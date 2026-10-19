/** SK@S SK Sungai Tiram — API v1.0.0. Jalankan setupSystem() sekali dalam editor. */
const CONFIG = Object.freeze({
  SHEET_ID: '1ln3kviRYg-hShqoNiUl-Q6OqzFrLGoi_nmz7Tbb7pV8',
  DRIVE_ID: '141CECiUmWTbz28f6BIzANZacehH9KriD',
  SCHOOL: 'SEKOLAH KEBANGSAAN SUNGAI TIRAM', VERSION: '1.0.0', SESSION_SECONDS: 21600,
  MAX_FILE_BYTES: 5 * 1024 * 1024
});
const SCHEMA = {
  Standard: ['id','code','title','description','active'],
  Subtopik: ['id','standardId','code','title','description','officer','checklist','active'],
  Unit_Panitia: ['id','name','standardId','active'],
  Rekod_Pelaksanaan: ['id','year','standardId','subtopicId','unit','title','startDate','endDate','officer','ownerId','assignedTo','objectives','target','summary','impact','issues','evidence','checklist','status','feedback','createdAt','updatedAt','revision'],
  Evidens: ['id','recordId','fileId','name','url','mimeType','size','uploadedBy','createdAt'],
  Semakan: ['id','recordId','status','feedback','reviewerId','reviewerName','createdAt'],
  Log_Aktiviti: ['id','userId','name','action','recordId','createdAt'],
  Tetapan: ['id','school','logo','year']
};
const ARRAY_KEYS = ['checklist','evidence'];
function props_(){return PropertiesService.getScriptProperties();}
function uid_(){return Utilities.getUuid();}
function now_(){return new Date().toISOString();}
function fail_(message,code){const e=new Error(message);e.code=code||'VALIDATION';throw e;}
function text_(v,max){return String(v==null?'':v).trim().slice(0,max||4000);}
let _db;
function db_(){if(!_db)_db=SpreadsheetApp.openById(CONFIG.SHEET_ID);return _db;}
function table_(name){const s=db_().getSheetByName('SKAS_'+name);if(!s)fail_('Sila jalankan setupSystem() dalam editor Apps Script dahulu.','NOT_READY');return s;}
function rows_(name){const values=table_(name).getDataRange().getDisplayValues();if(values.length<2)return [];const headers=values[0];return values.slice(1).filter(r=>r[0]).map(r=>{const o={};headers.forEach((h,i)=>{o[h]=ARRAY_KEYS.indexOf(h)>=0?JSON.parse(r[i]||'[]'):r[i];});return o;});}
function cell_(v){if(Array.isArray(v)||typeof v==='object'&&v!==null)return JSON.stringify(v);if(typeof v==='boolean')return v?'true':'false';const s=String(v==null?'':v);return /^[=+\-@]/.test(s)?"'"+s:s;}
function put_(name,o){const s=table_(name),headers=SCHEMA[name],ids=s.getLastRow()>1?s.getRange(2,1,s.getLastRow()-1,1).getDisplayValues().flat():[],i=ids.indexOf(o.id);s.getRange(i<0?s.getLastRow()+1:i+2,1,1,headers.length).setValues([headers.map(h=>cell_(o[h]))]);return o;}
function del_(name,id){const s=table_(name);if(s.getLastRow()<2)return;const i=s.getRange(2,1,s.getLastRow()-1,1).getDisplayValues().flat().indexOf(id);if(i>=0)s.deleteRow(i+2);}
function allUsers_(){return JSON.parse(props_().getProperty('SKAS_USERS')||'[]');}
function saveUsers_(u){props_().setProperty('SKAS_USERS',JSON.stringify(u));}
function safeUser_(u){return {id:u.id,username:u.username,name:u.name,role:u.role,scopes:u.scopes||[],active:u.active,forcePassword:!!u.forcePassword};}
function hash_(value){return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,value,Utilities.Charset.UTF_8));}
function passwordHash_(password,salt){let value=salt+'|'+password+'|'+props_().getProperty('SKAS_PEPPER');for(let i=0;i<1200;i++)value=hash_(value+'|'+salt);return value;}
function setPassword_(u,password){if(String(password).length<12)fail_('Kata laluan mesti sekurang-kurangnya 12 aksara.');u.salt=uid_();u.passwordHash=passwordHash_(password,u.salt);u.authVersion=uid_();return u;}
function log_(u,action,id){put_('Log_Aktiviti',{id:uid_(),userId:u.id,name:u.name,action:action,recordId:id||'',createdAt:now_()});}
function admin_(u){if(u.role!=='admin')fail_('Akses pentadbir diperlukan.','FORBIDDEN');}
function inScope_(u,standard){return u.role==='admin'||u.role==='penyelaras'&&(u.scopes||[]).indexOf(standard)>=0;}
function canRead_(u,r){return inScope_(u,r.standardId)||r.ownerId===u.id||r.assignedTo===u.id;}
function canEdit_(u,r){return canRead_(u,r)&&(u.role==='admin'||r.status==='Draf'||r.status==='Perlu Pembetulan');}
function userFromToken_(token){if(!token)fail_('Sila log masuk.','UNAUTHORIZED');const raw=CacheService.getScriptCache().get('sess:'+hash_(token));if(!raw)fail_('Sesi tamat. Sila log masuk semula.','UNAUTHORIZED');const sess=JSON.parse(raw),u=allUsers_().find(x=>x.id===sess.id&&x.active&&x.authVersion===sess.v);if(!u)fail_('Sesi tidak sah. Sila log masuk semula.','UNAUTHORIZED');return u;}
function setupSystem(){
  const lock=LockService.getScriptLock();lock.waitLock(30000);
  try{
    const db=db_();DriveApp.getFolderById(CONFIG.DRIVE_ID).getName();
    Object.keys(SCHEMA).forEach(name=>{let s=db.getSheetByName('SKAS_'+name);if(!s)s=db.insertSheet('SKAS_'+name);if(!s.getLastRow()){s.getRange(1,1,1,SCHEMA[name].length).setValues([SCHEMA[name]]).setBackground('#123b49').setFontColor('#ffffff').setFontWeight('bold');s.setFrozenRows(1);}else if(JSON.stringify(s.getRange(1,1,1,SCHEMA[name].length).getDisplayValues()[0])!==JSON.stringify(SCHEMA[name]))fail_('Struktur kolum SKAS_'+name+' berbeza. Sila semak sebelum meneruskan.');});
    if(!props_().getProperty('SKAS_PEPPER'))props_().setProperty('SKAS_PEPPER',uid_()+uid_());
    const standards=[['3.1','Pengurusan Kurikulum','Pelaksanaan kurikulum dan peningkatan pencapaian akademik.'],['3.2','Pengurusan Kokurikulum','Pengurusan kelab, persatuan, badan beruniform dan sukan.'],['3.3','Pengurusan Hal Ehwal Murid','Kesejahteraan, keselamatan dan pembangunan sahsiah murid.']];
    const existing=rows_('Standard');standards.forEach(a=>{if(!existing.some(x=>x.id===a[0]))put_('Standard',{id:a[0],code:a[0],title:a[1],description:a[2],active:true});});
    const subtopics=[
      ['3.1','3.1.1 / 3.1.1.1','Pelaksanaan Kurikulum Sekolah','Ketetapan, panduan dan pengoperasian kurikulum sekolah.'],
      ['3.1','3.1.2.1–3.1.2.4','Pengurusan Mata Pelajaran','Pelaksanaan PdP, RPH/RPT, pentaksiran dan semakan kerja murid oleh panitia. Julat kod dikekalkan sebagai satu kumpulan.'],
      ['3.1','3.1.3.1','Pengurusan Masa Instruksional','Jadual waktu dan peruntukan masa pengajaran guru.'],
      ['3.1','3.1.4.1','Pengurusan Pentaksiran Murid','Peperiksaan, penilaian pencapaian akademik dan analisis keputusan.'],
      ['3.1','3.1.7','Program Peningkatan Pencapaian Akademik','Intervensi, pengukuhan dan pengayaan akademik murid.'],
      ['3.2','3.2.1 / 3.2.1.1','Ketetapan Pelaksanaan Kokurikulum','Dasar, pelan strategik dan takwim unit kokurikulum.'],
      ['3.2','3.2.2.1','Pengurusan Unit, Kelab dan Persatuan','Bimbingan aktiviti dan pengurusan setiap unit atau kelab.'],
      ['3.2','3.2.3.1','Pengurusan Sukan untuk Semua','Kejohanan olahraga, latihan rumah sukan dan penyertaan murid.'],
      ['3.3','3.3.1.1','Ketetapan Pelaksanaan Hal Ehwal Murid','Dasar, peraturan dan panduan pengurusan disiplin serta kebajikan.'],
      ['3.3','3.3.2.1','Pengurusan Disiplin Murid','Pemantauan salah laku dan pembentukan sahsiah terpuji.'],
      ['3.3','3.3.3.1','Pengurusan Keselamatan Murid','SOP keselamatan fizikal dan pencegahan bencana.'],
      ['3.3','3.3.4.1','Pengurusan Kesihatan Murid','Program kesihatan, kebersihan dan rawatan berkala.'],
      ['3.3','3.3.5.1','Pengurusan Bantuan Kebajikan Murid','KWAPM, RMT, biasiswa dan insurans Takaful.'],
      ['3.3','3.3.6.1','Perkhidmatan Bimbingan dan Kaunseling','Sesi individu, kelompok dan modul pembangunan sahsiah.'],
      ['3.3','3.3.7.1','Pengurusan Pendidikan Pencegahan Dadah','Pencegahan dadah, inhalan, rokok dan alkohol.']
    ];const oldSub=rows_('Subtopik');subtopics.forEach((a,i)=>{const id='SUB-'+(i+1);if(!oldSub.some(x=>x.id===id))put_('Subtopik',{id:id,standardId:a[0],code:a[1],title:a[2],description:a[3],officer:'',checklist:['Dokumen perancangan','Rekod pelaksanaan','Laporan / analisis impak'],active:true});});
    const units=['Kelab Pencegahan Jenayah','Bahasa','Doktor Muda','Kelab Seni Visual','Kerjaya','Pendidikan Islam / Agama','Rukun Negara','STEM','Usahawan','Bulan Sabit Merah Malaysia'];const oldUnits=rows_('Unit_Panitia');units.forEach((name,i)=>{if(!oldUnits.some(x=>x.id==='UNIT-'+(i+1)))put_('Unit_Panitia',{id:'UNIT-'+(i+1),name:name,standardId:'3.2',active:true});});
    if(!rows_('Tetapan').length)put_('Tetapan',{id:'school',school:CONFIG.SCHOOL,logo:'assets/lencana.png',year:new Date().getFullYear()});
    if(!allUsers_().length){const password='SKas!'+uid_().replace(/-/g,'').slice(0,15);const admin=setPassword_({id:uid_(),username:'admin',name:'Pentadbir SK Sungai Tiram',role:'admin',scopes:['3.1','3.2','3.3'],active:true,forcePassword:true},password);saveUsers_([admin]);console.log('AKAUN PERTAMA — Nama pengguna: admin | Kata laluan sementara: '+password+' | Tukar selepas log masuk.');}
    console.log('Persediaan berjaya. Versi '+CONFIG.VERSION+'. Data sedia ada tidak dipadam. Deploy versi baharu sebagai Web app (Execute as: Me, Access: Anyone).');
  }finally{lock.releaseLock();}
}
/** Pemulihan hanya boleh dijalankan pemilik dalam editor; tiada endpoint awam. */
function resetAdminPassword(){const lock=LockService.getScriptLock();lock.waitLock(30000);try{const users=allUsers_(),u=users.find(x=>x.role==='admin'&&x.active);if(!u)fail_('Jalankan setupSystem dahulu.');const password='SKas!'+uid_().replace(/-/g,'').slice(0,15);setPassword_(u,password);u.forcePassword=true;saveUsers_(users);console.log('Nama pengguna: '+u.username+' | Kata laluan sementara: '+password);}finally{lock.releaseLock();}}
function doGet(){return json_({ok:true,app:'SKAS',version:CONFIG.VERSION,school:CONFIG.SCHOOL,ready:!!props_().getProperty('SKAS_PEPPER')});}
function json_(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);}
function doPost(e){let lock;try{if(!e||!e.postData||!e.postData.contents)fail_('Permintaan kosong.');if(e.postData.contents.length>7500000)fail_('Permintaan terlalu besar.');const q=JSON.parse(e.postData.contents);if(q.action==='health')return doGet();if(!props_().getProperty('SKAS_PEPPER'))fail_('Sila jalankan setupSystem() dahulu.','NOT_READY');lock=LockService.getScriptLock();lock.waitLock(30000);const key=q.requestId&&q.token?'req:'+hash_(q.token+'|'+text_(q.requestId,100)):'';const mutation=['saveRecord','addEvidence','removeEvidence','deleteRecord','reviewRecord','reopenRecord','saveUser','saveMaster','saveSettings'].indexOf(q.action)>=0;if(mutation&&key)userFromToken_(q.token);const cached=mutation&&key?CacheService.getScriptCache().get(key):null;if(cached)return ContentService.createTextOutput(cached).setMimeType(ContentService.MimeType.JSON);const result={ok:true,data:dispatch_(q)};const serialized=JSON.stringify(result);if(mutation&&key&&serialized.length<90000)CacheService.getScriptCache().put(key,serialized,600);return json_(result);}catch(err){console.error(err.stack||err);return json_({ok:false,error:err.message||'Ralat pelayan.',code:err.code||'SERVER'});}finally{if(lock)lock.releaseLock();}}
function dispatch_(q){
  const action=q.action;
  if(action==='login'){
    const username=text_(q.username,120).toLowerCase(),cache=CacheService.getScriptCache(),key='login:'+hash_(username),tries=Number(cache.get(key)||0);if(tries>=8)fail_('Terlalu banyak cubaan. Cuba lagi selepas 10 minit.','RATE_LIMIT');
    const u=allUsers_().find(x=>x.username===username&&x.active);if(!u||passwordHash_(String(q.password||''),u.salt)!==u.passwordHash){cache.put(key,String(tries+1),600);fail_('Nama pengguna atau kata laluan tidak tepat.','UNAUTHORIZED');}
    cache.remove(key);const token=uid_()+uid_();cache.put('sess:'+hash_(token),JSON.stringify({id:u.id,v:u.authVersion}),CONFIG.SESSION_SECONDS);return {token:token,user:safeUser_(u)};
  }
  const u=userFromToken_(q.token);
  if(action==='logout'){CacheService.getScriptCache().remove('sess:'+hash_(q.token));return true;}
  if(action==='changePassword'){
    if(passwordHash_(String(q.oldPassword||''),u.salt)!==u.passwordHash)fail_('Kata laluan semasa tidak tepat.');if(q.oldPassword===q.newPassword)fail_('Gunakan kata laluan baharu yang berbeza.');setPassword_(u,String(q.newPassword||''));u.forcePassword=false;const users=allUsers_().map(x=>x.id===u.id?u:x);saveUsers_(users);CacheService.getScriptCache().put('sess:'+hash_(q.token),JSON.stringify({id:u.id,v:u.authVersion}),CONFIG.SESSION_SECONDS);return safeUser_(u);
  }
  if(u.forcePassword)fail_('Tukar kata laluan sementara terlebih dahulu.','PASSWORD_CHANGE');
  if(action==='bootstrap'){
    const records=rows_('Rekod_Pelaksanaan').filter(r=>canRead_(u,r));const ids=records.map(r=>r.id);return {user:safeUser_(u),standards:rows_('Standard'),subtopics:rows_('Subtopik'),units:rows_('Unit_Panitia'),settings:rows_('Tetapan')[0]||{},records:records,reviews:rows_('Semakan').filter(x=>ids.indexOf(x.recordId)>=0),users:allUsers_().filter(x=>x.active).map(safeUser_),logs:u.role==='admin'?rows_('Log_Aktiviti').slice(-100).reverse():[]};
  }
  if(action==='saveRecord'){
    const d=q.record||{},old=rows_('Rekod_Pelaksanaan').find(r=>r.id===d.id);if(old&&!canEdit_(u,old))fail_('Rekod ini tidak boleh disunting.','FORBIDDEN');if(old&&String(d.revision)!==String(old.revision))fail_('Rekod telah dikemas kini pengguna lain. Muat semula sebelum menyimpan.','CONFLICT');
    const sub=rows_('Subtopik').find(x=>x.id===d.subtopicId&&x.active!=='false');if(!sub)fail_('Pilih subtopik yang sah.');if(sub.standardId!==d.standardId)fail_('Standard dan subtopik tidak sepadan.');if(old&&old.standardId!==d.standardId)fail_('Standard rekod sedia ada tidak boleh ditukar.');
    if(u.role==='penyelaras'&&!inScope_(u,d.standardId)&&!old)fail_('Standard di luar skop penyelarasan.','FORBIDDEN');
    const title=text_(d.title,250);if(!title)fail_('Tajuk rekod diperlukan.');if(!/^20\d{2}$/.test(String(d.year)))fail_('Tahun tidak sah.');const validDate=v=>/^\d{4}-\d{2}-\d{2}$/.test(v)&&!isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
    if(!validDate(d.startDate)||!validDate(d.endDate)||d.endDate<d.startDate)fail_('Sila semak tarikh mula dan tarikh tamat.');
    const assignedTo=text_(d.assignedTo,100);if(assignedTo&&!allUsers_().some(x=>x.id===assignedTo&&x.active))fail_('Pegawai ditugaskan tidak sah.');if(u.role==='guru'&&assignedTo&&assignedTo!==u.id)fail_('Hanya pentadbir atau penyelaras boleh menugaskan rekod kepada pengguna lain.','FORBIDDEN');
    const status=d.submit?'Dihantar':'Draf';if(d.submit&&(!text_(d.summary)||!text_(d.objectives)))fail_('Isi objektif dan ringkasan pelaksanaan sebelum menghantar.');
    const r={id:old?old.id:uid_(),year:String(d.year),standardId:sub.standardId,subtopicId:sub.id,title:title,unit:text_(d.unit,200),startDate:d.startDate,endDate:d.endDate,officer:text_(d.officer,150)||u.name,ownerId:old?old.ownerId:u.id,assignedTo:assignedTo||u.id,objectives:text_(d.objectives),target:text_(d.target),summary:text_(d.summary),impact:text_(d.impact),issues:text_(d.issues),evidence:old?old.evidence:[],checklist:Array.isArray(d.checklist)?d.checklist.filter(x=>sub.checklist.indexOf(x)>=0):[],status:status,feedback:old?old.feedback:'',createdAt:old?old.createdAt:now_(),updatedAt:now_(),revision:Number(old?old.revision:0)+1};
    put_('Rekod_Pelaksanaan',r);log_(u,d.submit?'Hantar rekod':'Simpan rekod',r.id);return r;
  }
  if(action==='deleteRecord'){const r=record_(q.id);admin_(u);rows_('Evidens').filter(x=>x.recordId===r.id).forEach(x=>del_('Evidens',x.id));rows_('Semakan').filter(x=>x.recordId===r.id).forEach(x=>del_('Semakan',x.id));del_('Rekod_Pelaksanaan',r.id);log_(u,'Padam rekod (fail Drive dikekalkan)',r.id);return true;}
  if(action==='reviewRecord'){const r=record_(q.id);if(!inScope_(u,r.standardId))fail_('Tiada akses semakan.','FORBIDDEN');if(r.status!=='Dihantar')fail_('Hanya rekod dihantar boleh disemak.');if(['Disahkan','Perlu Pembetulan'].indexOf(q.status)<0)fail_('Status semakan tidak sah.');const feedback=text_(q.feedback);if(q.status==='Perlu Pembetulan'&&!feedback)fail_('Masukkan maklum balas pembetulan.');r.status=q.status;r.feedback=feedback;r.updatedAt=now_();r.revision=Number(r.revision)+1;put_('Rekod_Pelaksanaan',r);put_('Semakan',{id:uid_(),recordId:r.id,status:r.status,feedback:feedback,reviewerId:u.id,reviewerName:u.name,createdAt:now_()});log_(u,'Semakan: '+r.status,r.id);return r;}
  if(action==='reopenRecord'){const r=record_(q.id);if(!inScope_(u,r.standardId))fail_('Tiada akses.','FORBIDDEN');r.status='Perlu Pembetulan';r.feedback=text_(q.feedback)||'Dibuka semula untuk kemas kini.';r.updatedAt=now_();r.revision=Number(r.revision)+1;put_('Rekod_Pelaksanaan',r);put_('Semakan',{id:uid_(),recordId:r.id,status:r.status,feedback:r.feedback,reviewerId:u.id,reviewerName:u.name,createdAt:now_()});log_(u,'Buka semula rekod',r.id);return r;}
  if(action==='addEvidence'){
    const r=record_(q.recordId);if(!canEdit_(u,r))fail_('Evidens hanya boleh ditambah pada rekod yang boleh disunting.','FORBIDDEN');const name=text_(q.name,180);if(!name)fail_('Nama evidens diperlukan.');let fileId='',url='',mimeType='',size=0;
    if(q.base64){mimeType=text_(q.mimeType,120);const allowed=['application/pdf','image/jpeg','image/png','image/webp','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation'];if(allowed.indexOf(mimeType)<0)fail_('Format fail tidak disokong.');const bytes=Utilities.base64Decode(q.base64);size=bytes.length;if(!size||size>CONFIG.MAX_FILE_BYTES)fail_('Saiz fail maksimum ialah 5 MB.');const f=DriveApp.getFolderById(CONFIG.DRIVE_ID).createFile(Utilities.newBlob(bytes,mimeType,name));fileId=f.getId();url=f.getUrl();
    }else{url=text_(q.url,2000);if(!/^https:\/\/[^\s<>"']+$/i.test(url))fail_('Gunakan pautan HTTPS yang sah.');mimeType='link';}
    const ev={id:uid_(),recordId:r.id,fileId:fileId,name:name,url:url,mimeType:mimeType,size:size,uploadedBy:u.id,createdAt:now_()};put_('Evidens',ev);r.evidence.push(ev);r.updatedAt=now_();r.revision=Number(r.revision)+1;put_('Rekod_Pelaksanaan',r);log_(u,'Tambah evidens',r.id);return r;
  }
  if(action==='removeEvidence'){const r=record_(q.recordId);if(!canEdit_(u,r))fail_('Tiada akses suntingan.','FORBIDDEN');r.evidence=r.evidence.filter(x=>x.id!==q.id);del_('Evidens',q.id);r.updatedAt=now_();r.revision=Number(r.revision)+1;put_('Rekod_Pelaksanaan',r);log_(u,'Buang pautan evidens (fail Drive dikekalkan)',r.id);return r;}
  if(action==='saveUser'){
    admin_(u);const d=q.user||{},users=allUsers_(),old=users.find(x=>x.id===d.id),username=text_(d.username,120).toLowerCase();if(!/^[a-z0-9._@-]{3,120}$/.test(username))fail_('Nama pengguna: minimum 3 aksara, huruf kecil / nombor / . _ @ - sahaja.');if(users.some(x=>x.username===username&&(!old||x.id!==old.id)))fail_('Nama pengguna telah wujud.');if(!['admin','penyelaras','guru'].includes(d.role))fail_('Peranan tidak sah.');if(!text_(d.name,150))fail_('Nama diperlukan.');
    const next=Object.assign({},old||{id:uid_()}, {username:username,name:text_(d.name,150),role:d.role,scopes:(d.scopes||[]).filter(s=>['3.1','3.2','3.3'].includes(s)),active:d.active!==false});if(next.role==='penyelaras'&&!next.scopes.length)fail_('Pilih sekurang-kurangnya satu skop penyelaras.');if(old&&old.id===u.id&&(next.role!=='admin'||!next.active))fail_('Anda tidak boleh menyahaktifkan atau menurunkan peranan akaun sendiri.');if(!old||d.password){setPassword_(next,String(d.password||''));next.forcePassword=true;}else next.authVersion=uid_();if(old)users[users.findIndex(x=>x.id===old.id)]=next;else users.push(next);saveUsers_(users);log_(u,'Kemaskini pengguna',next.id);return safeUser_(next);
  }
  if(action==='listUsers'){admin_(u);return allUsers_().map(safeUser_);}
  if(action==='saveMaster'){admin_(u);if(!['Standard','Subtopik','Unit_Panitia'].includes(q.table))fail_('Jenis tetapan tidak sah.');const d=q.item||{},old=rows_(q.table).find(x=>x.id===d.id);let item={id:old?old.id:uid_(),active:d.active!==false};if(q.table==='Unit_Panitia'){item.name=text_(d.name,180);item.standardId=text_(d.standardId);if(!item.name)fail_('Nama diperlukan.');}else{item.code=text_(d.code,80);item.title=text_(d.title,200);item.description=text_(d.description);if(!item.code||!item.title)fail_('Kod dan tajuk diperlukan.');if(q.table==='Subtopik'){item.standardId=text_(d.standardId);item.officer=text_(d.officer,150);item.checklist=Array.isArray(d.checklist)?d.checklist.map(x=>text_(x,200)).filter(Boolean).slice(0,30):[];}}
    if(q.table!=='Standard'&&!rows_('Standard').some(x=>x.id===item.standardId))fail_('Standard tidak sah.');if(old&&old.standardId&&old.standardId!==item.standardId&&q.table==='Subtopik'&&rows_('Rekod_Pelaksanaan').some(x=>x.subtopicId===old.id))fail_('Subtopik yang mempunyai rekod tidak boleh dipindahkan ke Standard lain.');put_(q.table,item);log_(u,'Kemaskini '+q.table,item.id);return item;}
  if(action==='saveSettings'){admin_(u);const d=q.settings||{};const school=text_(d.school,200);if(!school)fail_('Nama sekolah diperlukan.');const logo=text_(d.logo,2000);if(logo&&!/^https:\/\/[^\s<>"']+$/i.test(logo)&&logo!=='assets/lencana.png')fail_('Pautan logo tidak sah.');const s={id:'school',school:school,logo:logo||'assets/lencana.png',year:String(d.year)};if(!/^20\d{2}$/.test(s.year))fail_('Tahun tidak sah.');put_('Tetapan',s);log_(u,'Kemaskini tetapan');return s;}
  fail_('Tindakan tidak dikenali.');
}
function record_(id){const r=rows_('Rekod_Pelaksanaan').find(x=>x.id===id);if(!r)fail_('Rekod tidak dijumpai.','NOT_FOUND');return r;}
