# LawPlanAsist — Claude Geliştirici Devir Dosyası

> **Durum:** 1 Kasım 2026, kaynaklar GitHub `main` üzerinden paylaşılır. Bu belgede yer alanlar proje gerçekliğini ve istenen hedefleri ayırır. Hiçbir bilgi "tamamlandı" varsayılmamalıdır; kod ve canlı ortamda yeniden doğrulanmalıdır.

## 1. Ürün hedefi ve kullanıcı beklentisi
Türkiye'deki avukat için Türkçe kapsamlı büro/case management uygulaması. Windows, iPhone, Android, tablet üzerinde aynı işlev ve tutarlı, hızlı, duyarlı arayüz. İlk açılışta giriş/kayıt ekranı. Yetkili hesapla içeri girildikten sonra genel bakış; dosyalar, duruşmalar, tebligatlar, süreli işler, evrak editörü/dönüştürücü, hukuk asistanı, ayarlar, hesap yönetimi.

Bu ürün **LawPlanAsist**'tir. Önceki ayrı bir ürün olan **LawPlan** ile kod ve veritabanı nesnelerini karıştırma.

## 2. Mevcut mimari
HTML, CSS, vanilla JavaScript, büyük `index.html` dosyasında inline JS. Birkaç bağımsız JS/CSS modülü. Üçüncü taraf Supabase JS tarayıcıda CDN'den. React/Vite/Node build sistemi yok. Python standart `http.server` tabanlı `server.py` yalnızca statik dosya sağlar. Render'da ücretsiz statik site ve eski Python web servisi bulunur. RLS uygulanmış ama uygulamanın mevcut arayüzü dosya verilerini esasen localStorage'da tutar; **giriş sistemi = tam veri eşitlemesi değildir**.

Açık kaynak ağacındaki tüm dosyaları oku. Yerel geliştirmede sunucu `python server.py`, statik check `python -m unittest test_frontend.py -v`.

## 3. Geçerli arayüz sözleşmesi
| Ekran | İstenen davranış |
|---|---|
| Uygulama ilk açılışı | Oturum yoksa giriş/kayıt ekranı; hiçbir iç menü görünmez |
| Giriş Yap | Sadece E-posta, Şifre, Beni Hatırla; şifre unutma linki |
| Kayıt Ol | Ad Soyad (EN ÜSTTE), E-posta, Şifre, Şifre Tekrar |
| Şifre kuralı | Minimum 8; 1+ büyük, 1+ küçük, 1+ sayı, 1+ noktalama/simge; Türkçe karakterler geçerli; örnek şifre `Berkay-45` |
| Beni Hatırla | İşaretli: oturum kalıcı; işaretsiz: tarayıcı/sekme oturumu; parolayı asla düz metin saklama |
| Hesabım | Profil bilgilerini değiştir, şifre değiştir, çıkış yap; bulut yedekleme panelini buraya taşımama |
| Doğrulama | Kullanıcı özellikle "Doğrulama e-postasını yeniden gönder" tuşunu kaldırılmasını istedi; bunu geri ekleme |
| Navigasyon | Genel Bakış ve tüm menüler açılır, konsolda exception yok, dar ekranlarda erişilebilir |

## 4. İşlevler: gerçek ve eksik
**Mevcut çalışan olması amaçlanan demo parçaları**
- Dosya/evrak listesini yerel ekleme-düzenleme-silme; tarih sıralaması, demo JSON export/import.
- Elle son gün girilen iş takip kayıtları.
- Basit rich-text içerik düzenleme, HTML çıktı, tarayıcı yazdırma.
- Bazı metin/görsel/CSV/JSON/XML dönüşümleri.
- Şablon/kural tabanlı hukuk asistanı önerileri, metin üretme.
- Supabase Auth giriş/kayıt/profil/parola akışı (gerçek cihaz ve e-posta teslimi doğrulaması eksik).

**Eksikler — yapılmış gibi gösterme**
- Üretim seviyesinde gizlilik, hukuk verisi için yetkilendirme, audit log, şifreleme, KVKK uyumu, saklama/imha politikası.
- Gerçek UYAP/UETS resmi/izinli API bağlantısı; tebligat indirme, safahat, belge ayrıştırma, dosyaya bağlama.
- Gerçek hukuk LLM sağlayıcısı entegrasyonu; avukat onay akışı ve hukuki kaynak doğrulaması.
- Gerçek UDF okuyucu/yazıcı; DOCX/PDF/UDF güvenilir dönüşümü, baskı eşitliği.
- Gerçek usul hukukuna uygun tatil ve süre hesaplama/veri kaynağı; idari iznin özel ele alınması, mevzuat versiyonlaması.
- Çoklu kullanıcı/rol, ortak dosya veritabanı, gerçekten sorunsuz cihazlar arası sync.
- Prod SMTP (kayıt doğrulama e-postaları teslim edilmiyor), Auth allowed redirect URLs, email template ve gönderim kayıtları.
- Test katmanı yetersiz; yalnızca Python HTML statik smoke test var.

## 5. Teknik borç ve regresyonlar
1. `index.html` inline JS çok uzun: script eklerken HTML-string içine `</script>` düşürüp bütün navigasyonu bozma riski. Bu hata gerçek ortamda **daha önce yaşandı**. Scriptleri ayrı JS modülüne ayır.
2. Statik test script sözdizimini ya da tarayıcı davranışını tam test etmiyor. Playwright ile e2e: yüklendi, menü açıldı, auth gate, register vs login alan görünürlüğü, form doğrulamaları, localStorage/oturum, görsel taşma.
3. Tarayıcı Supabase CDN'ine bağımlı; bloklu olduğunda anlaşılır hata ve retry gerekir.
4. `cloud-sync.js` istemcide Supabase `publishable` anahtarını içeriyor (normal, **secret değil**). Supabase `service_role` asla istemciye taşınmaz.
5. `localStorage` hukuk verisi için uygun kalıcı çok cihazlı saklama değildir. Giriş ekranı yalnızca arayüzü gizliyor; güvenlik sınırı veritabanı RLS'dir.
6. Veriler arasında çekişme: `examples` array üzerinden oluşturulan demo listeleri, bağımsız modüller ve Settings bazen birbirine mutasyon yapıyor. Tek state modeli gerek.
7. `document.execCommand` eskimiş arayüzdür; güvenilir belge editörü gerekir.
8. Editörde dışarıdan gelen HTML'yi içeri almadan önce sanitize et; XSS, HTML injection, CSV/formula injection ve dosya import limitleri.
9. Kullanıcının paylaştığı gerçek hassas hukuk dosyalarını hazır olmayan public demo ortamına kopyalama.

## 6. Supabase bağlantısı ve SMTP
Mevcut ortak Supabase proje ref: `yolhophfdlnsisgdehww`. Veritabanındaki ayrı `public.lawplanasist_demo_records` tablosu `user_id`, `category`, `payload` ile RLS kullanır. Bu tablo varlığı **aktif uygulama senkronizasyonu olduğunu göstermez**.
- Başka ürünün `lawplan_*` tablolarını değiştirme.
- Bağlantı için current publishable key kodda var; Gizli/SMTP/LLM API anahtarlarını repoya koyma.
- Özel SMTP yoksa Supabase'in varsayılan SMTP'si gönderimi kısıtlar. Bu sorun hâlâ açıktır. Email teslim problemi düzeltilmeden kullanıcıya teslim başarısı söyleme.
- Resmî UYAP/UETS erişimi sadece yetkili entegrasyon/kimlik bilgileriyle olabilir.

## 7. Uygulama teslim stratejisi
**P0: Çalışırlık**
- Repo'yu eksiksiz çalıştır, JS hata ve bozuk HTML menü problemlerini yeniden üret/test et.
- Oturum yokken yalnızca auth gate; authenticated olduğunda çalışan nav; hata fallback; giriş, kayıt, hatalı parola ve refresh doğrulaması.
- Kayıt giriş alanları/şifre kriteri/beni hatırla; test hesapları ve izole test Supabase ortamı kullan.

**P1: Mimari**
- Kodları modüllere böl; UI navigation / auth / API / models / editor ayrı.
- Minimal responsive automated e2e seti; giriş ekranı mobil Safari dahil.
- Sunucu taraflı Auth, veri sahipliği ve erişim kontrolleri; dosya/evrak/task şemaları için izole RLS.
- Kullanıcı, dosyalar, evrak, işler ve duruşmaları tek veri modeline bağla.

**P2: Hukuki iş akışı**
- Tebligat alındığında belge türü/süre/önerilen işlem/son işlem ve avukat onayı; kaynağı ve dayanakları göster.
- UYAP/UETS yalnızca resmi ve yetkili teknik erişim varsa; yoksa açıkça "bağlı değil".
- UDF ve dönüştürme için gerçek format test örnekleri ve round-trip test.
- Mevzuat takibi ve son tarih hesaplarında Türkiye resmî tatilleri, hafta sonları, usul türü, adli tatil, tatil uzamaları; hukuki doğrulama kaydı.

## 8. Kabul kriterleri
- Kırık HTML, sayfa dibinde kaynak kodu, konsol JS exception **yok**.
- Testler gerçekten koşuyor, mobil ve desktop menüler işliyor.
- Kayıt Formu tam sıralı; giriş formunda ekstra input **görünmüyor**.
- Auth yapılan cihazda oturum açılır; Beni Hatırla davranışı cihaz üzerinde test edilmiş.
- Hesabım yalnızca profil/şifre/çıkış; hiçbir "doğrulama e-postası yeniden gönder" butonu yok.
- Her modül için smoke ve kritik iş akışı testi.
- User-facing açıklamalarda "canlı / demo / planlanan / erişilemeyen" açık ayrım.
- Code değişikliğinden sonra deploy status kontrolü, mümkünse otomatik e2e smoke.
- Her şeyin hazır olduğu iddia edilmeden önce uçtan uca test ve güvenlik değerlendirmesi.

## 9. Claude için başlangıç görevi
"Projeyi baştan incele. Kodun tamamına erişim olduğundan emin ol; dosyaları listele. P0 hataları önce çöz. Auth/giriş/kayıt/navigation için tarayıcı tabanlı E2E kur; testleri çalıştır ve mevcut kusurları raporla. Sonra uygulamayı gerçek güvenli veri mimarisine kademeli taşı. Kullanıcının açıkça istediği akışı değiştirme. UYAP/UETS/gerçek AI/UDF bileşenlerinin yokluğunu belirt. Her aşamada gerçek uygulamaya kod commit ederek ve çalışır deploy'u test ederek ilerle."
