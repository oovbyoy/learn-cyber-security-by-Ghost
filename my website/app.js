// app.js (نسخة مُحدّثة: دورات + فيديوات يوتيوب + وصف + شراء محلي)
const DEFAULT_COURSES = [
  {
    id: 'course-kali',
    title: 'مقدمة في Kali Linux — عملي ونظري',
    short: 'تثبيت، أوامر أساسية، إعداد مختبر محاكى، أدوات مهمة (شرح نظري فقط).',
    instructor: 'أحمد المحاضر',
    price: 0,
    youtube_explain: 'https://www.youtube.com/watch?v=Yg4tV98y69I',      // شرح مبسط (تعليمي)
    youtube_practical: 'https://www.youtube.com/watch?v=W-gAcKqjogY',   // تطبيق / تثبيت و labs
    description: `هذه الدورة تضعك على الطريق: ستتعلم تثبيت Kali، التنقل في نظام لينكس، أوامر سطر الأوامر المهمة، وكيف تهيئ بيئة مختبر آمنة للتدريب. لا تحتوي الدورة على أوامر استغلال فعلية.`,
    lessons: [
      { id: 'k1', title: 'مقدمة عن Kali', type:'text', content: 'ما هو Kali ولماذا نستخدمه في بيئة اختبارية.' },
      { id: 'k2', title: 'أوامر أساسية', type:'text', content: 'ls, cd, pwd, cat, apt, ip, ifconfig (محاكي)'},
      { id: 'k3', title: 'مختبر محاكى', type:'lab', content: 'محاكاة أوامر آمنة داخل المتصفح' }
    ]
  },
  {
    id: 'course-bounty',
    title: 'Bug Bounty — منهجية كاملة من الصفر إلى التقرير',
    short: 'منهجية، أدوات الاستطلاع، كتابة تقرير احترافي، قانون وأخلاقيات.',
    instructor: 'سارة المحاضرة',
    price: 25, // دولار (محاكاة)
    youtube_explain: 'https://www.youtube.com/watch?v=Ukv85Dx0GhA',     // منهجية بداية
    youtube_practical: 'https://www.youtube.com/watch?v=krCsMZfbuB4',  // Recon course مثال
    description: `تتعلم كيف تبدأ في Bug Bounty: اختيار المنصات، طرق الاستطلاع (recon)، تأكيد الثغرات بشكل آمن، وصياغة تقارير تُقبل وتؤدي إلى مكافآت حقيقية. التركيز على أخلاقيات العمل وعدم استهداف أي نظام بدون إذن.`,
    lessons: [
      { id: 'b1', title: 'مقدمة المنهجية', type:'text', content: 'ما هي برامج Bug Bounty وكيف تبدأ' },
      { id: 'b2', title: 'Recon basics', type:'text', content: 'أدوات استطلاع عامة (نظرية فقط)' },
      { id: 'b3', title: 'كتابة تقرير', type:'text', content: 'كيفية كتابة POC وشرح واضح للمراجعين' }
    ]
  },
  {
    id: 'course-advanced',
    title: 'دورات مهنية متقدمة (شراكة مع منصات التدريب)',
    short: 'ممارسة على منصات مثل HackTheBox، مسارات CTF، إعداد سيرة ذاتية أمنية.',
    instructor: 'فريق التدريب',
    price: 99,
    youtube_explain: 'https://www.youtube.com/watch?v=RSIka-LWwNM', // مرجع
    youtube_practical: 'https://www.youtube.com/watch?v=krCsMZfbuB4',
    description: `مسار متكامل للمحترفين: تمارين مع منشورات ومشاريع عملية مع منصات تدريب. يوصى بمنصة HackTheBox للتمارين الآمنة.`,
    lessons: []
  }
];

// state handlers (same mechanism)
function $(id){return document.getElementById(id)}
function loadState(){
  const raw = localStorage.getItem('csacademy_state');
  if(!raw){
    const state = { courses: DEFAULT_COURSES, users: [], enrollments: [] };
    localStorage.setItem('csacademy_state', JSON.stringify(state));
    return state;
  }
  return JSON.parse(raw);
}
function saveState(s){ localStorage.setItem('csacademy_state', JSON.stringify(s)) }

let state = loadState();
let currentUser = JSON.parse(localStorage.getItem('csacademy_user') || 'null');

function init(){
  renderAuthArea();
  renderFeatured();
  renderCourses();
  renderProfile();
}
function renderAuthArea(){
  const el = $('authArea');
  if(currentUser){
    el.innerHTML = `<span class="small">مرحبًا، ${currentUser.name || currentUser.email}</span>
      <button onclick="logout()">خروج</button>
      ${currentUser.role==='Admin' || currentUser.role==='Owner' ? '<button onclick="openAdmin()">لوحة الإدارة</button>':''}`;
  } else {
    el.innerHTML = `<button onclick="showLogin()">تسجيل / دخول</button>`;
  }
}
function renderFeatured(){
  const f = $('featuredList');
  f.innerHTML = '';
  state.courses.slice(0,3).forEach(c=>{
    const card = document.createElement('div'); card.className='course-card';
    card.innerHTML = `<h4>${c.title}</h4><p>${c.short}</p>
      <div class="small">مدرّب: ${c.instructor} · السعر: ${c.price===0?'مجاني': '$'+c.price}</div>
      <div style="margin-top:8px;">
        <button onclick="openCourse('${c.id}')">عرض الدورة</button>
        ${c.youtube_practical?` <button onclick="openYoutube('${c.youtube_practical}')">شاهد التطبيق</button>`:''}
      </div>`;
    f.appendChild(card);
  })
}
function renderCourses(){
  const list = $('courseList');
  if(!list) return;
  list.innerHTML = '';
  state.courses.forEach(c=>{
    const el = document.createElement('div'); el.className='course-card';
    el.innerHTML = `<h3>${c.title}</h3><p>${c.short}</p>
      <div class="small">المدرب: ${c.instructor} · السعر: ${c.price===0?'مجاني':'$'+c.price}</div>
      <div style="margin-top:8px;">
        <button onclick="openCourse('${c.id}')">تفاصيل</button>
        <button onclick="openYoutube('${c.youtube_explain}')">شاهد الشرح</button>
      </div>`;
    list.appendChild(el);
  })
}

function openYoutube(url){
  window.open(url, '_blank');
}

function openCourse(id){
  const course = state.courses.find(x=>x.id===id);
  if(!course) return alert('الدورة غير موجودة');
  // انشاء نافذة modal بعرض تفاصيل + فيديوات
  const modal = $('modal');
  modal.style.display='flex';
  modal.innerHTML = `<div class="sheet">
    <h2>${course.title}</h2>
    <p class="small">المدرّب: ${course.instructor} · السعر: ${course.price===0?'مجاني':'$'+course.price}</p>
    <p>${course.description}</p>
    <h3>فيديو شرح</h3>
    ${course.youtube_explain?`<iframe width="100%" height="315" src="${youtubeEmbed(course.youtube_explain)}" frameborder="0" allowfullscreen></iframe>`:''}
    <h3>فيديو تطبيقي</h3>
    ${course.youtube_practical?`<iframe width="100%" height="315" src="${youtubeEmbed(course.youtube_practical)}" frameborder="0" allowfullscreen></iframe>`:''}
    <h4>الدروس</h4>
    <ul>${course.lessons.map(l=>`<li>${l.title} — ${l.type}</li>`).join('')}</ul>
    <div style="margin-top:12px">
      ${course.price>0 ? `<button onclick="purchaseCourse('${course.id}')">اشترِ الدورة — $${course.price}</button>` : `<button onclick="enrollCourse('${course.id}')">سجل الآن (مجاني)</button>`}
      <button onclick="closeModal()">إغلاق</button>
    </div>
  </div>`;
}

function youtubeEmbed(url){
  // تحويل رابط يوتيوب لiframe src بصيغة embed
  try{
    const u = new URL(url);
    let id = '';
    if(u.hostname.includes('youtube.com')){
      id = u.searchParams.get('v');
    } else if(u.hostname.includes('youtu.be')){
      id = u.pathname.slice(1);
    }
    return id ? `https://www.youtube.com/embed/${id}` : url;
  }catch(e){ return url }
}

function closeModal(){ $('modal').style.display='none'; $('modal').innerHTML=''; }

function enrollCourse(id){
  if(!currentUser) return showLogin();
  const enrolls = state.enrollments || [];
  if(enrolls.find(e=>e.user===currentUser.email && e.course===id)) {
    alert('أنت مسجّل بالفعل في هذه الدورة');
    return;
  }
  enrolls.push({ user: currentUser.email, course: id, progress: 0, purchased: true });
  state.enrollments = enrolls;
  saveState(state);
  alert('تم التسجيل! يمكنك تتبع التقدّم من حسابي');
  closeModal();
}
function purchaseCourse(id){
  if(!currentUser) return showLogin();
  // محاكاة عملية دفع: تخزين علامة purchased
  if(confirm('محاكاة شراء: هل تريد إتمام الدفع الآن؟ (محاكاة)')){
    const enrolls = state.enrollments || [];
    enrolls.push({ user: currentUser.email, course: id, progress: 0, purchased: true });
    state.enrollments = enrolls;
    saveState(state);
    alert('تمت عملية الشراء بنجاح (محاكاة). تم تسجيلك في الدورة.');
    closeModal();
  }
}

// ----- login/logout/reg (بسيط، محلي) -----
function showLogin(){
  const modal = $('modal');
  modal.style.display='flex';
  modal.innerHTML = `<div class="sheet">
    <h3>تسجيل / دخول</h3>
    <label>الإيميل</label><input id="liEmail" style="width:100%;padding:8px;margin-bottom:8px"/>
    <label>الاسم (اختياري)</label><input id="liName" style="width:100%;padding:8px;margin-bottom:8px"/>
    <div style="display:flex;gap:8px;margin-top:8px">
      <button onclick="doRegister()">تسجيل جديد</button>
      <button onclick="doLogin()">دخول</button>
      <button onclick="closeModal()">إغلاق</button>
    </div>
    <p class="small">هذا تسجيل محلي للتجربة. لربط حقيقي استعمل Firebase/Supabase.</p>
  </div>`;
}
function doRegister(){
  const email = $('liEmail').value.trim();
  const name = $('liName').value.trim() || email.split('@')[0];
  if(!email) return alert('أدخل إيميل');
  const users = state.users || [];
  if(users.find(u=>u.email===email)) return alert('المستخدم موجود، سجّل الدخول');
  const user = { email, name, role: 'Student', created: Date.now() };
  users.push(user);
  state.users = users; saveState(state);
  localStorage.setItem('csacademy_user', JSON.stringify(user)); currentUser = user;
  renderAuthArea(); closeModal(); alert('تم التسجيل كطالب');
}
function doLogin(){
  const email = $('liEmail').value.trim();
  if(!email) return alert('أدخل إيميل');
  const users = state.users || [];
  const user = users.find(u=>u.email===email);
  if(!user) return alert('المستخدم غير موجود، قم بالتسجيل أولًا');
  localStorage.setItem('csacademy_user', JSON.stringify(user)); currentUser = user;
  renderAuthArea(); closeModal(); alert('تم تسجيل الدخول');
}
function logout(){ localStorage.removeItem('csacademy_user'); currentUser = null; renderAuthArea(); alert('تم الخروج') }

// ----- profile / progress -----
function renderProfile(){
  const area = $('profileArea');
  if(!area) return;
  if(!currentUser){ area.innerHTML = '<p>سجّل الدخول لعرض حسابك وتقدّمك.</p>'; return; }
  const enrolled = state.enrollments?.filter(e=>e.user===currentUser.email) || [];
  area.innerHTML = `<h3>مرحبًا ${currentUser.name || currentUser.email}</h3>
    <p class="small">دورات مسجلة: ${enrolled.length}</p>
    <ul>${enrolled.map(en=>`<li>${(state.courses.find(c=>c.id===en.course)||{}).title} — تقدم: ${en.progress || 0}%</li>`).join('')}</ul>`;
}

// ----- assistant chat محلي بسيط (محاكاة) -----
function assistantSend(){
  const input = $('chatInput');
  const log = $('chatLog');
  if(!input || !log) return;
  const q = input.value.trim(); if(!q) return;
  // append user
  log.innerHTML += `<div class="me">${q}</div>`;
  input.value='';
  // simple simulated responses (no external API)
  setTimeout(()=>{
    const resp = simulateAssistant(q);
    log.innerHTML += `<div class="ai">${resp}</div>`;
    log.scrollTop = log.scrollHeight;
  }, 300);
}
function simulateAssistant(q){
  q = q.toLowerCase();
  if(q.includes('kali') || q.includes('لينكس')) return 'ابدأ بتعلم أساسيات لينكس: الملفات، الصلاحيات، وإدارة الحزم. شاهد الفيديو التطبيقي داخل صفحة الدورة. لا تقم بتنفيذ أيّ اختبار على أنظمة بدون إذن.';
  if(q.includes('bug') || q.includes('bounty')) return 'ركّز على Recon وقراءة تقارير الآخرين. استخدم منصات مثل HackerOne وHackTheBox للممارسة الآمنة.';
  return 'اسألني عن مسار تعلّم، أو اطلب دورة محددة (مثال: "كيف أبدأ Kali؟").';
}

// ----- terminal محاكى لمختبرات -----
let currentLab = null;
function openLab(key){
  $('terminal').style.display='block';
  $('termOut').innerHTML = '';
  $('termTitle').textContent = key==='kali' ? 'Kali Lab (محاكي)' : 'Bug Bounty Lab (محاكي)';
  currentLab = key;
  appendTerm(`محاكاة مختبر ${key} — هذه بيئة افتراضية آمنة لعرض مخرجات أوامر تعليمية.`);
}
function closeTerminal(){ $('terminal').style.display='none'; currentLab=null; }
function appendTerm(text){ const out = $('termOut'); out.innerHTML += `<div>${text}</div>`; out.scrollTop = out.scrollHeight; }
function runTermCmd(){
  const cmd = $('termInput').value.trim(); $('termInput').value='';
  appendTerm(`<span style="color:#ffd166">$ ${cmd}</span>`);
  // مسبق: لا نفّذ شيء خطير — فقط مخرجات توضيحية
  if(!cmd) return;
  if(currentLab==='kali'){
    if(cmd==='ls') appendTerm('Desktop  Documents  Downloads  lab-notes.txt');
    else if(cmd==='pwd') appendTerm('/home/student');
    else if(cmd==='whoami') appendTerm('student');
    else appendTerm('محاكاة: هذا مخرج تعليمي — لا ينفّذ أي أوامر فعلية.');
  } else if(currentLab==='bug'){
    if(cmd.includes('recon')) appendTerm('جمع أسماء النطاقات: example.com, dev.example.com');
    else appendTerm('محاكاة: استخدم أدوات Recon في بيئة مختبريّة مثل HackTheBox');
  } else appendTerm('غير متصل بمختبر محدد');
}

// init on load
document.addEventListener('DOMContentLoaded', init);