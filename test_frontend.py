"""LawPlanAsist static sanity tests. Runs without third-party packages."""
import pathlib
import re
import unittest
from html.parser import HTMLParser

ROOT = pathlib.Path(__file__).resolve().parent

class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.scripts=[]
        self.inscript=False
        self.inline=[]
    def handle_starttag(self, tag, attrs):
        if tag=="script":
            src=dict(attrs).get("src")
            self.scripts.append(src)
            self.inscript=src is None
    def handle_endtag(self,tag):
        if tag=="script":
            self.inscript=False
    def handle_data(self,data):
        if self.inscript:
            self.inline.append(data)

class FrontendSmokeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html=(ROOT/"index.html").read_text(encoding="utf8")
        cls.parser=Parser()
        cls.parser.feed(cls.html)

    def test_no_inline_nested_scripts(self):
        inline="\n".join(self.parser.inline)
        self.assertNotIn("<script",inline,"Script tags must not appear inside inline JS strings")
        self.assertIn("function go(id)",inline,"Main menu router must remain intact")
        self.assertIn("function downloadDoc()",inline)

    def test_script_tags_balanced(self):
        self.assertEqual(self.html.count("<script"),self.html.count("</script>"))

    def test_all_local_script_sources_exist(self):
        for src in self.parser.scripts:
            if src and src.startswith("/"):
                with self.subTest(src=src):
                    self.assertTrue((ROOT/src.lstrip("/")).is_file())

    def test_required_screens(self):
        for page in ("dashboard","cases","hearings","notices","deadlines","editor","convert","assistant","settings"):
            self.assertIn('id="'+page+'"',self.html)
        for feature in ("dossier-manager.js","legal-assistant.js","cloud-sync.js","task-manager.js"):
            self.assertIn(feature,self.html)

    def test_cloud_script_outside_inline(self):
        self.assertIn("/cloud-sync.js",self.parser.scripts)
        self.assertEqual(self.parser.scripts[-1],"/cloud-sync.js")
        for i in range(len(self.parser.scripts)-1):
            if self.parser.scripts[i] and "supabase" in self.parser.scripts[i]:
                break
        else:
            self.fail("Supabase SDK must load before cloud-sync.js")

if __name__=="__main__":
    unittest.main()
