/* LawPlanAsist settings — DEMO, browser-local only. No credentials collected. */
(function(){
const KEY='lpa_settings_v2';
const defaults={displayName:'Demo Kullanıcı',office:'Hukuk Bürosu',email:'',phone:'',barNumber:'',timezone:'Europe/Istanbul',language:'tr',coverTitle:'DAVA DOSYASI',fileOrder:'date',caseView:'cards',personalNumber:'0001',autoArchive:false,deadlineAlerts:true,deadline7:true,deadline3:true,deadline1:true,deadlineLast:true,deadlineMethod:'uyap',manualReason:true,showOriginal:true,hearingAlerts:true,hearingDays:'1',hearingCity:'',noticeAlerts:true,noticeReview:true,noticeSort:'newest',editorFont:'Georgia',editorSize:'12',letterhead:'',defaultTemplate:'blank',autosave:true,autosaveNote:true,theme:'dark',density:'normal',fontScale:'normal',contrast:false,menuCollapsed:false,sessionTimeout:'30',deviceLog:true,requireApproval:true,loginAlerts:true,integrationSource:'none',uyapMode:'manual',uetsMode:'manual',syncMode:'disabled',importPolicy:'metadata'};
let state={...defaults};try{let prev=JSON.parse(localStorage.getItem(KEY)||'{}');for(let k in defaults)if(Object.hasOwn(prev,k))state[k]=prev[k]}catch(e){}
const categories=[
['profile','👤','Profil ve Büro'],
['security','🛡','Güvenlik ve Gizlilik'],
['files','📁','Dosya Yönetimi'],
['deadlines','⏱','Süre ve Hatırlatmalar'],
['hearings','📅','Duruşma Takvimi'],
['notices','✉','Tebligatlar'],
['editor','📝','UDF / Belge Editörü'],
['integrations','🔗','UYAP ve UETS'],
['appearance','🎨','Görünüm'],
['system','⚙','Sistem ve Veri']
];
const text=(key,label,description='',type='text')=>'<label class="settings-field">'+label+'<input type="'+type+'" data-setting="'+key+'" value="'+esc(state[key])+'">'+(description?'<small>'+description+'</small>':'')+'</label>';
const area=(key,label,description='')=>'<label class="settings-field">'+label+'<textarea data-setting="'+key+'">'+esc(state[key])+'</textarea>'+(description?'<small>'+description+'</small>':'')+'</label>';
const select=(key,label,options,description='')=>'<label class="settings-field">'+label+'<select data-setting="'+key+'">'+options.map(([v,l])=>'<option value="'+esc(v)+'"'+(state[key]===v?' selected':'')+'>'+l+'</option>').join('')+'</select>'+(description?'<small>'+description+'</small>':'')+'</label>';
const sw=(key,label,hint)=>'<label class="settings-switch"><span><b>'+label+'</b><small>'+hint+'</small></span><input aria-label="'+label+'" type="checkbox" data-setting="'+key+'"'+(state[key]?' checked':'')+'></label>';
const note=(s,warn=false)=>'<div class="settings-note'+(warn?' settings-warning':'')+'">'+s+'</div>';
const grid=(...items)=>'<div class="settings-grid">'+items.join('')+'</div>';
const section=(title,lead,body)=>'<h2>'+title+'</h2><p class="settings-lead">'+lead+'</p>'+body;
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function build(cat){switch(cat){
case 'profile':return section('Profil ve Büro Bilgileri','Demo profilinizi ve belge başlıklarını tek merkezden yönetin.',
note('Bu demo oturum açma sistemi içermez. Buradaki profil yalnızca bu tarayıcıda tutulur. Gerçek kişisel veya müvekkil verileri girmeyin.',true)+
'<h3>Kullanıcı Profili</h3>'+grid(text('displayName','Görünen ad'),text('office','Büro / Kurum adı'),text('email','İletişim e-postası (demo)','Doğrulama e-postası gönderilmez.','email'),text('phone','Telefon (demo)'),text('barNumber','Baro sicil (demo)'),select('timezone','Saat dilimi',[['Europe/Istanbul','Türkiye · İstanbul'],['UTC','UTC']]))+
'<h3>Belge Kimliği</h3>'+grid(text('coverTitle','Dosya kapak başlığı','Yazdırma kapağında kullanılır.'),text('letterhead','Belge üst bilgisi','Belge editörüne isteğe bağlı uygulanabilir.'))+
note('Büro adı ve kapak başlığı taslak belge ve dosya yazdırma işlemlerinin görünümünde kullanılır.'));
case 'security':return section('Güvenlik ve Gizlilik','Hesap, oturum, yetkilendirme ve denetim ilkelerinin yönetim alanı.',
note('<b>Önemli:</b> Demo henüz gerçek kullanıcı hesabı, şifreleme tabanlı sunucu oturumu, iki faktörlü doğrulama veya erişim kontrolü içermez. Bu kontrolleri etkinmiş gibi göstermiyoruz.',true)+
'<div class="settings-subcard"><h3>🔒 Kimlik Doğrulama</h3><div class="settings-stat"><span>Parola ile giriş</span><span class="settings-badge">Altyapı bekleniyor</span></div><div class="settings-stat"><span>İki adımlı doğrulama (2FA)</span><span class="settings-badge">Altyapı bekleniyor</span></div><div class="settings-stat"><span>Aktif cihazlar ve oturum kapatma</span><span class="settings-badge">Altyapı bekleniyor</span></div></div>'+
'<h3>Tercih Edilen Güvenlik Politikaları</h3>'+grid(select('sessionTimeout','Hareketsizlikte oturum süresi',[['15','15 dakika'],['30','30 dakika'],['60','60 dakika']],'Sunucu oturum altyapısı kurulunca uygulanacaktır.'),select('timezone','İşlem zamanı dilimi',[['Europe/Istanbul','Türkiye · İstanbul'],['UTC','UTC']]))+
sw('requireApproval','Avukat onayı zorunlu','İleride yapay zekâ önerileri ve dış sisteme gönderimler için iş akışı tercihi; bu demoda gerçek gönderim yok.')+
sw('loginAlerts','Yeni cihaz giriş bildirimi','Gerçek kimlik doğrulama ve e-posta servisi kurulunca kullanılacak.')+
sw('deviceLog','İşlem kayıtları','Gelecekte merkezi denetim günlüğü kurulması için tercih.')+
note('Gerçek müvekkil dosyalarını güvenle saklamak için sunucu tarafı yetkilendirme, şifreleme, log, yedekleme ve erişim kontrolleri gereklidir.'));
case 'files':return section('Dosya Yönetimi','Dosyalarım ekranının numaralandırma, sıralama ve yazdırma tercihleri.',
grid(select('fileOrder','Dosya sıralaması',[['date','UYAP açılış tarihi (eskiden yeniye)'],['newest','En yeni açılan önce'],['number','Kişisel numara sırası']]),select('caseView','Dosya görünümü',[['cards','Geniş kartlar'],['compact','Kompakt tablo']]),text('personalNumber','İlk kişisel numara','Demo numaraları 0001, 0002... olarak gösterilir.'),text('coverTitle','Yazdırma kapak başlığı'))+
sw('autoArchive','Tamamlanan dosyaları arşivlemeyi öner','Demo yalnızca tercih saklar; gerçek dosya taşıma yapılmaz.')+
'<h3>Kapak Sayfası</h3>'+note('Dosya kapağında yalnızca kişisel dosya numarası, mahkeme, esas numarası, konu ve müvekkil görünür. Yazdırmadan önce kapak ekleme sorulur.')+
'<div class="settings-row"><button class="settings-btn" data-action="cases">Dosyalarım ekranını aç</button></div>');
case 'deadlines':return section('Süre ve Hatırlatma Ayarları','Ayrı hesaplayıcı yok. Süreler dosya olayından doğar; avukat manuel değişiklik yapabilir.',
note('Güncel demoda gerçek UYAP/UETS tarihi, resmî tatil motoru ve hukuki süre türleri bağlı değildir. Örnek otomatik tarih <b>kesin yasal son gün değildir</b>.',true)+
grid(select('deadlineMethod','Kaynak olay tercihi',[['uyap','UYAP/UETS tarih metaverisi'],['manual','Manuel doğrulama öncelikli']]),select('timezone','Tarih ve saat dilimi',[['Europe/Istanbul','Türkiye (UTC+3)'],['UTC','UTC']]))+
sw('deadlineAlerts','Süre bildirimleri','Gerçek push/e-posta bildirim sistemi henüz bağlı değil.')+
sw('deadline7','7 gün kala hatırlat','Tercih kaydedilir.')+sw('deadline3','3 gün kala hatırlat','Tercih kaydedilir.')+sw('deadline1','1 gün kala hatırlat','Tercih kaydedilir.')+sw('deadlineLast','Son gün hatırlat','Tercih kaydedilir.')+
sw('manualReason','Manuel değişiklikte gerekçe iste','Süreler ekranında değişiklik gerekçesini kaydet.')+sw('showOriginal','Özgün tarihi göster','Elle düzeltme olsa da ilk örnek otomatik tarih görünür.')+
'<div class="settings-row"><button class="settings-btn" data-action="deadlines">Süreleri görüntüle</button></div>');
case 'hearings':return section('Duruşma Takvimi','Duruşma listesi, uyarılar ve hazırlık tercihleri.',
grid(select('hearingDays','Ön uyarı süresi',[['1','1 gün önce'],['2','2 gün önce'],['4','4 gün önce'],['7','7 gün önce']]),text('hearingCity','Varsayılan adliye / şehir','Yalnızca yerel görünüm tercihi.'))+
sw('hearingAlerts','Duruşma hatırlatmaları','Bildirim altyapısı eklendiğinde kullanılacak.')+
note('Takvimdeki duruşmalar örnektir; gerçek UYAP takvim senkronizasyonu bağlı değildir.')+
'<button class="settings-btn" data-action="hearings">Duruşmalar ekranına git</button>');
case 'notices':return section('Tebligat Ayarları','UETS gelen kutusuna ilişkin inceleme ve bildirim tercihleri.',
grid(select('noticeSort','Gelen kutusu sıralaması',[['newest','Yeni tebligatlar önce'],['oldest','Eskiler önce'],['case','Dosya numarasına göre']]),select('importPolicy','Tarih metaverisi politikası',[['metadata','Kaynak metaverisine öncelik ver'],['review','Tüm tarihleri avukat teyit etsin']]))+
sw('noticeAlerts','Yeni tebligat bildirimleri','Gelecekteki gerçek UETS bağlantısı için tercih.')+
sw('noticeReview','Her tebligat için avukat incelemesi','Yapay zekâ işlem önerileri otomatik gönderilmez.')+
note('Tebliğ tarihi, elektronik tebligatın hukuki sonuçları ve süre başlangıcı dosya bazında doğrulanmalıdır.')+
'<button class="settings-btn" data-action="notices">Tebligatları aç</button>');
case 'editor':return section('UDF / Belge Editörü Ayarları','Belge görünümü, antet ve yerel taslak ayarlarını yönetin.',
note('Bu sürümün editörü zengin metin düzenler. Yerel UDF biçiminde açma/kaydetme henüz desteklenmiyor; HTML dışa aktarma ve tarayıcıdan PDF yazdırma var.',true)+
grid(select('editorFont','Belge yazı tipi',[['Georgia','Georgia'],['Arial','Arial'],['Times New Roman','Times New Roman'],['Calibri','Calibri'],['Inter','Inter / Sistem']]),select('editorSize','Yazı boyutu',[['10','10 punto'],['11','11 punto'],['12','12 punto'],['13','13 punto'],['14','14 punto']]),select('defaultTemplate','Yeni belge şablonu',[['blank','Boş belge'],['petition','Dilekçe başlangıcı'],['memo','Büro içi not']]),text('letterhead','Üst bilgi / antet başlığı','Editörde kullanılabilir.'))+
sw('autosave','Taslakları otomatik kaydet','Bu tarayıcıda, yazarken otomatik saklama.')+
sw('autosaveNote','Kaydetme bilgisini göster','Belge editöründe durum mesajı.')+
'<button class="settings-btn" data-action="editor">Belge editörünü aç</button>');
case 'integrations':return section('UYAP ve UETS Entegrasyonları','Dış sistem bağlantı durumları, veri kaynakları ve ileride uygulanacak erişim politikaları.',
note('<b>Bağlantı durumu: Bağlı değil.</b> Bu ekrandaki tercih değişiklikleri UYAP veya UETS hesabınıza giriş yapmaz. Şifre, e-imza PIN’i, UETS erişim anahtarı ya da sertifika yüklemeyin.',true)+
'<div class="settings-subcard"><h3>⚖ UYAP Avukat Portalı <span class="settings-badge">Bağlı değil</span></h3><p class="settings-small">Dosya safahatı, belgeler, duruşmalar, mahkeme bilgisi ve gerçek kaynak tarihleri. Resmî/izinli entegrasyon yöntemi seçilmeden bağlantı kurulmayacak.</p>'+select('uyapMode','Planlanan veri edinme yöntemi',[['manual','Kullanıcının yüklediği UYAP dışa aktarımı'],['official','Resmî/izinli entegrasyon (altyapı bekliyor)']])+'</div>'+
'<div class="settings-subcard"><h3>✉ UETS <span class="settings-badge">Bağlı değil</span></h3><p class="settings-small">Gelen elektronik tebligat, teslim ve tebliğ metaverisi için ileride desteklenecek bağlantı.</p>'+select('uetsMode','Planlanan edinme yöntemi',[['manual','Kullanıcı tarafından sağlanan dışa aktarım'],['official','Resmî/izinli erişim (altyapı bekliyor)']])+'</div>'+
'<h3>İçe Aktarma ve Eşitleme</h3>'+grid(select('syncMode','Otomatik eşitleme',[['disabled','Kapalı — bağlantı yok']], 'Bu demoda etkinleştirilemez.'),select('importPolicy','Tarih kaynağı',[['metadata','Kaynak sistem metaverisi'],['review','Avukat onaylı kayıt']]))+
note('Gerçek senkronizasyon için yetkili entegrasyon, arka uç sunucu, kalıcı veritabanı, gizli bilgi saklama ve erişim kontrolleri ayrı geliştirme aşamasıdır.'));
case 'appearance':return section('Görünüm ve Erişilebilirlik','Windows ve mobilde aynı tasarım tercihleri.',
grid(select('theme','Renk teması',[['dark','Gece laciverti'],['light','Açık görünüm']]),select('density','İçerik yoğunluğu',[['normal','Dengeli'],['compact','Kompakt'],['comfortable','Geniş aralıklı']]),select('fontScale','Metin boyutu',[['normal','Standart'],['large','Büyük']]),select('language','Arayüz dili',[['tr','Türkçe']]))+
sw('contrast','Yüksek kontrast','Metin ve panel sınırlarını güçlendir.')+
note('Görünüm değişiklikleri bu cihazda anında uygulanır; farklı tarayıcılara otomatik senkronize edilmez.'));
case 'system':return section('Sistem, Depolama ve Veri','Demo durumu, tarayıcı depolaması ve dışa aktarma.',
'<div class="settings-subcard"><h3>Sistem Durumu</h3><div class="settings-stat"><span>Web sunucu</span><span class="settings-feature">Render demo</span></div><div class="settings-stat"><span>Ortak veritabanı</span><span class="settings-badge">Bağlı değil</span></div><div class="settings-stat"><span>UYAP / UETS</span><span class="settings-badge">Bağlı değil</span></div><div class="settings-stat"><span>Kalıcı sunucu hesabı</span><span class="settings-badge">Bağlı değil</span></div><div class="settings-stat"><span>Bu cihazda taslak saklama</span><span class="settings-feature">Tarayıcı</span></div></div>'+
'<div class="settings-row"><button class="settings-btn" id="exportSettings">Ayarları JSON olarak indir</button><button class="settings-btn settings-danger" id="resetSettings">Demo ayarlarını sıfırla</button></div>'+
note('Ayar dışa aktarımı, UYAP belgesi veya avukat dosyası yedeği değildir. Bu tarayıcıdaki taslakları otomatik olarak içermez.',true));
}}
const settings=document.getElementById('settings');if(!settings)return;
settings.innerHTML='<div class="settings-head"><div><h1>Ayarlar</h1><p class="settings-intro">Çalışma alanınızı, belge düzenini ve tüm modül tercihlerini buradan yönetin.</p></div><span class="settings-badge">Yerel demo ayarları</span></div><div class="settings-layout"><div id="settingsNav" class="settings-nav"></div><div id="settingsPanel" class="settings-panel" aria-live="polite"></div></div>';
const nav=document.getElementById('settingsNav'),panel=document.getElementById('settingsPanel');
nav.innerHTML=categories.map(([id,icon,title])=>'<button type="button" data-settings-tab="'+id+'"><span class="settings-icon">'+icon+'</span><span>'+title+'</span></button>').join('');
let activeTab='profile';
function capture(){panel.querySelectorAll('[data-setting]').forEach(el=>{state[el.dataset.setting]=el.type==='checkbox'?el.checked:el.value})}
function save(){capture();try{localStorage.setItem(KEY,JSON.stringify(state));localStorage.setItem('lpa_cover',state.coverTitle);let old=document.getElementById('coverTitle');if(old)old.value=state.coverTitle;apply();let mark=document.getElementById('settingsSaved');if(mark)mark.textContent='✓ Tercihler bu tarayıcıda kaydedildi.'}catch(e){alert('Kaydetme başarısız: tarayıcı depolaması kullanılamıyor.')}}
function render(cat){if(panel.querySelector('[data-setting]'))capture();activeTab=cat;nav.querySelectorAll('button').forEach(b=>b.classList.toggle('selected',b.dataset.settingsTab===cat));panel.innerHTML='<div class="settings-section">'+build(cat)+'</div><div class="settings-footer"><span id="settingsSaved" class="settings-toast"></span><button class="settings-save" id="settingsSave">Değişiklikleri Kaydet</button></div>';panel.querySelector('#settingsSave').onclick=save;
panel.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{save();go(b.dataset.action)});
let e=panel.querySelector('#exportSettings');if(e)e.onclick=()=>{capture();let data=JSON.stringify({...state,exportedAt:new Date().toISOString(),demo:true},null,2),blob=new Blob([data],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='lawplanasist-demo-ayarlari.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
let x=panel.querySelector('#resetSettings');if(x)x.onclick=()=>{if(confirm('Bu tarayıcıdaki demo ayarları varsayılana sıfırlansın mı? Taslak belgeler silinmeyecek.')){panel.innerHTML='';state={...defaults};localStorage.removeItem(KEY);localStorage.removeItem('lpa_cover');render(activeTab);apply()}}
}
nav.onclick=e=>{let b=e.target.closest('[data-settings-tab]');if(b)render(b.dataset.settingsTab)};
function apply(){document.body.classList.toggle('lpa-light',state.theme==='light');document.body.classList.toggle('lpa-compact',state.density==='compact');document.body.classList.toggle('lpa-comfortable',state.density==='comfortable');document.body.classList.toggle('lpa-large',state.fontScale==='large');document.body.classList.toggle('lpa-highcontrast',state.contrast);const paper=document.getElementById('docText');if(paper){paper.style.fontFamily=state.editorFont+',serif';paper.style.fontSize=state.editorSize+'pt'}if(typeof examples!=='undefined'&&typeof listCases==='function'){let sort=state.fileOrder;if(sort==='newest')examples.sort((a,b)=>b.date.localeCompare(a.date));else if(sort==='date')examples.sort((a,b)=>a.date.localeCompare(b.date));else examples.sort((a,b)=>a.n.localeCompare(b.n));if(document.getElementById('caseRows'))listCases()}}
render('profile');apply();
const priorSave=window.saveCover;window.saveCover=function(){const e=document.getElementById('coverTitle');if(e){state.coverTitle=e.value;save();if(activeTab==='profile'||activeTab==='files')render(activeTab)}else if(priorSave)priorSave()};
const originalShow=window.showTasks;if(typeof originalShow==='function'){window.showTasks=function(){originalShow();if(!state.showOriginal)document.querySelectorAll('#deadlineList .notice').forEach(p=>{if(p.textContent.includes('Taslak otomatik'))p.style.display='none'})}}
const originalEdit=window.editDue;if(typeof originalEdit==='function'){window.editDue=function(id){if(state.manualReason){let reason=prompt('Manuel son gün değişikliğinin gerekçesini yazın:');if(reason===null)return;if(!reason.trim()){alert('Gerekçe boş bırakılamaz.');return}localStorage.setItem('due_reason_'+id,reason.slice(0,500))}originalEdit(id)}}
const originalOpen=window.openCase;if(typeof originalOpen==='function'){window.openCase=function(i){originalOpen(i);if(state.caseView==='compact')document.getElementById('caseDetail').style.padding='12px';else document.getElementById('caseDetail').style.padding=''}}
const editor=document.getElementById('docText');if(editor){let debounce;editor.addEventListener('input',()=>{if(!state.autosave)return;clearTimeout(debounce);debounce=setTimeout(()=>{try{localStorage.setItem('lpa_draft',JSON.stringify({title:document.getElementById('docTitle').value,html:editor.innerHTML}));let tip=document.getElementById('saved');if(tip&&state.autosaveNote)tip.textContent='Taslak otomatik kaydedildi.'}catch(e){}},650)})}
})();
