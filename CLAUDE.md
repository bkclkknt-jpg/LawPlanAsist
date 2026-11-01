# CLAUDE.md — LawPlanAsist

Bu depo **LawPlanAsist** adlı Türkçe hukuk bürosu uygulamasının mevcut deneme prototipidir. Ayrı bir ürün olan **LawPlan** ile karıştırma. Kullanıcı mevcut uygulamayı gerçek, güvenilir, Windows/iOS/Android'de uyumlu, dosya-evrak-tebligat-süre-duruşma-uygulama olarak geliştirmek istiyor. Gereksiz prototip/gösteriş değil, çalışan uygulama isteniyor.

## Talimatlar (Claude'a)
1. Önce tüm kaynak dosyalarını, testleri, bu belgeyi ve `docs/CLAUDE_DEV_HANDOFF.md` dosyasını oku. Hata görmeden çalışan özellik ilan etme.
2. **Öncelik: çalışırlık ve regresyon testleri.** Ekran açılmıyor/menü çalışmıyor hatalarını ve kullanıcı giriş akışını düzeltmeden özellik ekleme. Her değişikliği mobil ve masaüstü ekranlarında test et.
3. **Gizli avukat-müvekkil verisini deneme altyapısına alma.** Mevcut uygulama bir üretim sistemi değildir. Gerçek UYAP/UETS bağlantısı, resmî süre hesabı, UDF dönüşümü veya gerçek AI varmış gibi gösterme.
4. Bağlı Supabase projesi önceden başka **LawPlan** ürününe de aittir: diğer tablolarını veya Auth kullanıcılarını silme, değiştirme ya da devre dışı bırakma. Yalnızca LawPlanAsist'e özel nesnelerde kontrollü değişiklik yap.
5. Repo içinde **Supabase publishable (public) key** ve URL görülebilir; bunlar istemci anahtarıdır. `service_role`, SMTP parolası, API gizli anahtarları ve avukatın kullanıcı şifresi **asla** repoya yazılmaz. Yeni sırlar ortam değişkenlerinde saklanır.
6. E-posta/şifre Auth: uygulama giriş/kayıt sayfası **içeri girmeden önce** gelir. Oturum açmadan menü açılmaz. `Kayıt Ol` alan sırası Ad Soyad → E-posta → Şifre → Şifre Tekrar. `Giriş Yap` yalnızca E-posta, Şifre, `Beni Hatırla`; oturum açıldığında ana ekran. `Hesabım` sadece profil düzenleme, şifre değiştirme ve çıkış. "Doğrulama e-postasını yeniden gönder" butonu bulunmayacak.
7. Yeni şifreler için (kayıt, değişiklik ve sıfırlama): min 8, en az bir büyük harf, küçük harf, sayı, noktalama/sembol. Örnek `Berkay-45` (örnektir; gerçek şifre olarak kullanma). Mevcut şifre ile girişte yeniden politika kontrolü yapılmaz. Sunucu tarafında da doğrulama gereklidir.
8. "Beni Hatırla" seçiliyse tarayıcı açılışlarında oturumu sürdür; seçili değilse oturum kalıcı depolamaya yazılmasın. Şifreyi depolama. Logout temizliği, çoklu sekme ve parola kurtarma akışlarını test et.
9. Mevcut veri saklama **çoğunlukla localStorage**. Hesap açmış olmak otomatik veritabanı senkronizasyonu anlamına gelmez. Bunu şeffaf belirt ve RLS/kayıt güvenliği tamamlanmadan otomatik eşitleme açma.
10. En önemli hata geçmişi: daha önce `index.html` içine yanlışlıkla `downloadDoc()` fonksiyonunun HTML stringinin ortasına `<script>` etiketleri eklenerek bütün menüleri kırdı. Yeni scriptleri yalnızca gerçek HTML gövdesinin sonunda ekle; statik testten öte **tarayıcı etkileşim testi** yap.
11. Kimlik doğrulama için Supabase Auth + RLS; frontend `cloud-sync.js` üzerinden `@supabase/supabase-js` CDN kullanıyor. Üçüncü taraf JS'nin bloklanması veya yüklenmemesi durumunu güvenli/hatasız ele al.
12. Her görev: (a) mevcut davranışı yeniden üret, (b) küçük düzeltme yap, (c) test et, (d) ilgili dosyaları commit et, (e) Render deploy `live` teyit et, (f) kullanıcıya gerçekten çalışan ve eksik özellikleri ayırarak Türkçe bildir. Sahte test, sahte ekran, sahte entegrasyon yapılmasın.

## Çalıştırma
- Statik site: kök dizin (`index.html`).
- Yerel Python alternatif: `python server.py` → varsayılan `http://localhost:10000/`.
- Basit kontroller: `python -m unittest test_frontend.py -v`.
- **Eklenmesi gereken:** Browser E2E (Playwright vb), sahte değil gerçek kullanıcı etkileşim testi, kimlik akışı için ayrılmış test projesi.

## Ana dosyalar
- `index.html`: sayfa kabuğu; büyük inline CSS/JS, navigasyon ve örnek veriler.
- `cloud-sync.js`: Supabase Auth giriş/kayıt, profil ve şifre, beni hatırla; gerçek kullanıcı oturumu test edilmedi.
- `dossier-manager.js`: tarayıcıda demo dosya/evrak kayıtları; JSON yedek.
- `task-manager.js`: demo iş kaydı; tarih elle girilir.
- `legal-assistant.js` + CSS: kural tabanlı taslak arayüzü; **gerçek LLM yok**.
- `converter.js` + CSS: belirli temel tarayıcı dönüştürmeleri; **gerçek UDF dönüşümü yok**.
- `settings.js` + CSS: ayarlar; çoğu cihaz yerelinde tutulur.
- `server.py`: yalnızca statik dosya ve /health sunar; sunucu Auth/API/veritabanı barındırmaz.
- `render.yaml`: önceki Render Python web servisi için; güncel statik siteyi tek başına tanımlamaz.
- `test_frontend.py`: kısıtlı statik kontrol; etkileşim testi değildir.
- `.github/workflows/frontend-smoke.yml`: test CI.

## Dağıtım
- Repo: https://github.com/bkclkknt-jpg/LawPlanAsist (main)
- Render statik: https://lawplanasist-sabit.onrender.com
- Eski Python web: https://lawplanasist-ortak-demo.onrender.com
- Supabase proje ref: `yolhophfdlnsisgdehww`; proje adı LawPlan, **ortak proje**.
- SMTP/Auth doğrulama teslim sorunu **çözülmedi**; özel SMTP sağlayıcısı / kimlik bilgileri / Auth redirect allowlist ayrı kurulmalı. Bunlar bağlanmadan "e-posta doğrulama çalışıyor" deme.

Ayrıntılı mimari, eksikler, kabul kriterleri: `docs/CLAUDE_DEV_HANDOFF.md`.
