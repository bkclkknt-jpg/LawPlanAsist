# LawPlanAsist — Kaynak Kod ve Claude Devir Paketi

**Bu depo LawPlanAsist'in mevcut tüm izlenen kaynak dosyalarını içerir.** Hâlen demo/prototip aşamasındadır; gerçek hukuk verileri için üretim güvenliği tamamlanmadı.

## Claude'a aktarım (önerilen)
1. GitHub: https://github.com/bkclkknt-jpg/LawPlanAsist
2. Tüm kaynaklar (ZIP): https://github.com/bkclkknt-jpg/LawPlanAsist/archive/refs/heads/main.zip
3. Claude'a ZIP'i ekle veya GitHub deposuna erişim ver.
4. Claude'dan **ilk olarak** [CLAUDE.md](CLAUDE.md) ve [docs/CLAUDE_DEV_HANDOFF.md](docs/CLAUDE_DEV_HANDOFF.md) dosyalarını okumasını iste. Bu belgeler mevcut durum, kullanıcı beklentileri, eksikler ve teslim kriterlerini içerir.

## Yerel çalıştırma
```bash
python server.py
```
Adres: http://localhost:10000/

Basit kod/HTML kontrolü:
```bash
python -m unittest test_frontend.py -v
```
Bu testler gerçek tarayıcı veya Supabase e-posta/giriş testlerinin yerini **tutmaz**.

## Canlı ortam
- Statik prototip: https://lawplanasist-sabit.onrender.com
- Eski Python web servisi: https://lawplanasist-ortak-demo.onrender.com

## Önemli kısıtlar
- Demo dosya/iş/taslak kayıtları esas olarak tarayıcı depolamasındadır; **cihazlar arası otomatik senkronizasyon yoktur**.
- Supabase Auth entegre edilmeye çalışılmıştır; SMTP doğrulama teslim sorunu açık.
- UYAP/UETS resmî bağlantısı, gerçek LLM hukuk asistanı, gerçek UDF işleme ve hukuken doğrulanmış son tarih hesaplama **yoktur**.
- Gerçek müvekkil veya hassas dava verileri bu demo üzerinden işlenmemelidir.
- `cloud-sync.js` içindeki Supabase **publishable** anahtarı istemci için tasarlanmıştır. Sunucu ve SMTP gizli anahtarlarını **asla** koda koymayın.

**Projenin tam teknik devri için [CLAUDE.md](CLAUDE.md) ve [docs/CLAUDE_DEV_HANDOFF.md](docs/CLAUDE_DEV_HANDOFF.md) dosyalarına bakın.**
