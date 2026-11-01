window.LPA_CLOUD_CONFIG={url:"https://yolhophfdlnsisgdehww.supabase.co",key:"sb_publishable_uKAgK5Tv510IqU_U16grXg_wA2-HhVu"};
/* Auth gate and account settings. No UYAP/UETS or privileged tokens in client. */
(() => {
const $=id=>document.getElementById(id);
const gate=$('lpaAuthGate');
const main=document.querySelector('main');
if(!gate||!main)return;
const config=window.LPA_CLOUD_CONFIG;
let client=null,currentUser=null,recovery=false,busy=false,tab='login';
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const account=document.createElement('section');account.id='cloud';account.hidden=true;
account.innerHTML='<div class="lpa-account-wrap"><h1>Hesabım</h1><p class="muted">Profil bilgilerinizi düzenleyin veya şifrenizi değiştirin.</p><div class="lpa-account-form"><h3>Profil Bilgilerim</h3><p class="muted" id="lpAccountMail"></p><label>Ad Soyad<input id="lpAccountName" maxlength="100" autocomplete="name"></label><label>Büro Adı<input id="lpAccountOffice" maxlength="160"></label><button class="lpa-auth-primary" id="lpSaveProfile">Profili Kaydet</button></div><div class="lpa-account-form"><h3>Şifre Değiştir</h3><label>Yeni Şifre<input id="lpNewPassword" type="password" minlength="10" autocomplete="new-password" placeholder="En az 10 karakter"></label><label>Yeni Şifre (Tekrar)<input id="lpConfirmPassword" type="password" minlength="10" autocomplete="new-password"></label><button class="lpa-auth-primary" id="lpChangePassword">Şifreyi Değiştir</button></div><button class="btn sub" id="lpLogOut">Çıkış Yap</button><p class="muted" id="lpAccountStatus" role="status" aria-live="polite"></p><p class="muted" style="font-size:12px">Uygulamadaki dosya ve evrak ekranları hâlâ demo niteliğindedir. Bu cihazın yerel kayıtları otomatik olarak hesaba aktarılmaz; gerçek müvekkil bilgisi kullanmayın.</p></div>';
const print=$('printArea');if(print)main.insertBefore(account,print);else main.append(account);
const nav=document.querySelector('aside nav');if(nav){const b=document.createElement('button');b.dataset.page='cloud';b.textContent='👤 Hesabım';nav.insertBefore(b,nav.querySelector('[data-page="settings"]')||null);b.onclick=()=>{if(currentUser&&typeof go==='function')go('cloud')}}
function status(message){const t=$('lpAccountStatus');if(t)t.textContent=message}
function gateMessage(message){const el=$('lpGateMessage');if(el)el.textContent=message}
function renderGate(){
gate.innerHTML='<div class="lpa-auth-card"><div style="font-size:13px;letter-spacing:.12em;color:#8cbbff;font-weight:750">⚖ HUKUK BÜROSU YÖNETİMİ</div><h1>LawPlanAsist</h1><p id="lpGateSubtitle">Hesabınızla giriş yapın veya yeni hesap oluşturun.</p><div class="lpa-auth-tabs"><button type="button" id="lpTabLogin">Giriş Yap</button><button type="button" id="lpTabRegister">Kayıt Ol</button></div><div id="lpGateFields"><label>E-posta<input id="lpGateEmail" type="email" autocomplete="email" required></label><label id="lpGatePasswordLabel">Şifre<input id="lpGatePassword" type="password" autocomplete="current-password" required></label><label id="lpGateConfirmLabel" hidden>Şifre Tekrar<input id="lpGateConfirm" type="password" autocomplete="new-password"></label><label id="lpGateNameLabel" hidden>Ad Soyad<input id="lpGateName" type="text" autocomplete="name" maxlength="100"></label></div><button id="lpGateSubmit" class="lpa-auth-primary" style="width:100%;margin-top:10px">Giriş Yap</button><div style="text-align:center"><button id="lpForgotPassword" type="button" class="lpa-auth-link">Şifremi Unuttum</button></div><p class="lpa-auth-message" id="lpGateMessage" aria-live="polite"></p><p style="font-size:12px">Bu sürüm deneme amaçlıdır; gerçek müvekkil verisi girmeyin.</p></div>';
$('lpTabLogin').onclick=()=>changeTab('login');$('lpTabRegister').onclick=()=>changeTab('register');
$('lpForgotPassword').onclick=()=>changeTab('reset');$('lpGateSubmit').onclick=submit;
$('lpGatePassword').addEventListener('keydown',e=>{if(e.key==='Enter')submit()});
changeTab(tab);
}
function changeTab(next){tab=next;const isRegister=next==='register',reset=next==='reset'||next==='recovery';
$('lpTabLogin').classList.toggle('active',next==='login');$('lpTabRegister').classList.toggle('active',isRegister);
$('lpGateNameLabel').hidden=!isRegister;$('lpGateConfirmLabel').hidden=!(isRegister||next==='recovery');
$('lpGatePasswordLabel').hidden=next==='reset';
$('lpGatePasswordLabel').firstChild.textContent=next==='recovery'?'Yeni Şifre':'Şifre';
$('lpGateSubmit').textContent=next==='login'?'Giriş Yap':isRegister?'Kayıt Ol':next==='reset'?'Şifre Sıfırlama Bağlantısı Gönder':'Yeni Şifreyi Kaydet';
$('lpForgotPassword').hidden=reset;
$('lpGateSubtitle').textContent=next==='login'?'Kayıtlı hesabınızla giriş yapın.':isRegister?'Yeni bir hesap oluşturun.':next==='reset'?'E-posta adresinize şifre sıfırlama bağlantısı isteyin.':'Yeni şifrenizi belirleyin.';
gateMessage('');
}
async function withLock(callback){if(busy)return;busy=true;const btn=$('lpGateSubmit');if(btn)btn.disabled=true;try{await callback()}catch(e){gateMessage('İşlem başarısız: '+(e?.message||'Bilinmeyen hata'))}finally{busy=false;if(btn)btn.disabled=false}}
async function submit(){if(!client){gateMessage('Giriş hizmeti yüklenemedi. Sayfayı yenileyin.');return}
await withLock(async()=>{
const email=($('lpGateEmail')?.value||'').trim(),password=$('lpGatePassword')?.value||'';
if(tab==='reset'){if(!email.includes('@'))throw Error('Geçerli e-posta adresinizi yazın.');const {error}=await client.auth.resetPasswordForEmail(email,{redirectTo:location.origin+'/'});if(error)throw error;gateMessage('E-posta kayıtlıysa şifre sıfırlama bağlantısı gönderilmesi istendi. Gelen kutunuzu ve Spam klasörünü kontrol edin.');return}
if(tab==='recovery'){if(password.length<10||password!==$('lpGateConfirm').value)throw Error('Yeni şifre en az 10 karakter olmalı ve iki alan eşleşmeli.');const {error}=await client.auth.updateUser({password});if(error)throw error;recovery=false;tab='login';gateMessage('Şifre yenilendi. Giriş yapabilirsiniz.');await client.auth.signOut();renderGate();return}
if(!email.includes('@')||!password)throw Error('E-posta ve şifreyi girin.');
if(tab==='register'){
if(password.length<10)throw Error('Şifre en az 10 karakter olmalıdır.');
if(password!==$('lpGateConfirm').value)throw Error('Şifreler eşleşmiyor.');
const name=$('lpGateName').value.trim();if(!name)throw Error('Ad ve soyadınızı girin.');
const {data,error}=await client.auth.signUp({email,password,options:{emailRedirectTo:location.origin+'/',data:{full_name:name}}});
if(error)throw error;
if(!data.session)gateMessage('Kayıt başvurusu alındı. E-posta doğrulaması gerekli olabilir. E-posta ulaşmıyorsa Supabase gönderim (SMTP) yapılandırması kontrol edilmelidir.');
else gateMessage('Hesap oluşturuldu.');
return;
}
const {error}=await client.auth.signInWithPassword({email,password});if(error)throw error;
$('lpGatePassword').value='';gateMessage('Giriş yapıldı.');
});
}
function setAuthorized(user){
currentUser=user;
document.body.classList.toggle('lpa-authenticated',!!user&&!recovery);
gate.hidden=!!user&&!recovery;
if(user&&!recovery){
$('lpAccountMail').textContent='E-posta: '+(user.email||'');
$('lpAccountName').value=String(user.user_metadata?.full_name||'');
$('lpAccountOffice').value=String(user.user_metadata?.office_name||'');
}
if(!user){if(typeof go==='function')go('dashboard');gate.hidden=false;}
}
async function accountAction(button,operation){const b=$(button);b.disabled=true;status('İşlem yapılıyor…');try{await operation()}catch(e){status('İşlem başarısız: '+(e?.message||e))}finally{b.disabled=false}}
$('lpSaveProfile').onclick=()=>accountAction('lpSaveProfile',async()=>{const name=$('lpAccountName').value.trim(),office=$('lpAccountOffice').value.trim();if(!name)throw Error('Ad soyad boş bırakılamaz.');const {data,error}=await client.auth.updateUser({data:{full_name:name,office_name:office}});if(error)throw error;currentUser=data.user;status('Profil bilgileri kaydedildi.')});
$('lpChangePassword').onclick=()=>accountAction('lpChangePassword',async()=>{const pwd=$('lpNewPassword').value,confirmPwd=$('lpConfirmPassword').value;if(pwd.length<10||pwd!==confirmPwd)throw Error('En az 10 karakterli ve eşleşen iki şifre girin.');const {error}=await client.auth.updateUser({password:pwd});if(error)throw error;$('lpNewPassword').value='';$('lpConfirmPassword').value='';status('Şifre değişikliği isteği işlendi. Supabase güvenlik ayarlarına bağlı olarak yeniden doğrulama gerekebilir.')});
$('lpLogOut').onclick=()=>accountAction('lpLogOut',async()=>{const {error}=await client.auth.signOut();if(error)throw error;setAuthorized(null);renderGate()});
renderGate();
if(!config||!window.supabase?.createClient){gateMessage('Kimlik doğrulama kütüphanesi yüklenemedi. İnternet bağlantısını kontrol edin.');return;}
try{client=window.supabase.createClient(config.url,config.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:'lpa_demo_auth_session_v1'}})}catch(e){gateMessage('Giriş sistemi başlatılamadı: '+e.message);return}
client.auth.onAuthStateChange((event,session)=>{
if(event==='PASSWORD_RECOVERY'){recovery=true;setAuthorized(null);renderGate();changeTab('recovery');return}
setAuthorized(session?.user||null);
});
client.auth.getUser().then(({data,error})=>setAuthorized(error?null:data.user)).catch(()=>setAuthorized(null));
})();
