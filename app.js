const $ = (s) => document.querySelector(s);
const modal = $("#authModal"), courseModal = $("#courseModal");
let mode = "register", lang = "ru", selectedCourse = "chess";
const sb = window.supabase.createClient(window.MESHCHER_SUPABASE_URL, window.MESHCHER_SUPABASE_ANON_KEY);
const translations = {
  ru: {navDirections:"Направления",navManifesto:"Философия",login:"Войти",register:"Регистрация",heroKicker:"ПРОЕКТ ЛИЧНОГО РАЗВИТИЯ",heroLine1:"СДЕЛАЙ СЕБЯ",heroLine2:"ЛУЧШЕ.",heroText:"Интеллект. Дисциплина. Физическая сила.<br>Начни менять себя уже сегодня.",start:"Начать сейчас",explore:"Изучить направления",heroBottom:"ТВОЙ ПУТЬ НАЧИНАЕТСЯ С РЕШЕНИЯ",manifestoLabel:"ПРИНЦИП",manifestoEyebrow:"НЕ ЖДИ ПОДХОДЯЩЕГО МОМЕНТА",manifestoTitle:"ТВОЯ ЖИЗНЬ МЕНЯЕТСЯ<br>НЕ ОТ СЛОВ, А ОТ ДЕЙСТВИЙ.",manifestoText:"Здесь собраны направления, которые помогают развивать мышление, укреплять тело и формировать характер. Без быстрых обещаний. Только знания и последовательная работа.",directionsLabel:"ОБУЧЕНИЕ",directionsTitle:"ЧЕТЫРЕ НАПРАВЛЕНИЯ.<br><span class='muted'>ОДНА ЦЕЛЬ.</span>",directionsNote:"Материалы доступны зарегистрированным участникам.",chessDesc:"Стратегия, тактика, расчёт и концентрация.",martialDesc:"Техника, координация и физическая подготовка.",warriorDesc:"Самоконтроль, стойкость и ответственность.",gymDesc:"Силовые тренировки, прогрессия и восстановление.",openDirection:"Открыть направление",accessEyebrow:"ДОСТУП К МАТЕРИАЛАМ",accessTitle:"СНАЧАЛА РЕШЕНИЕ.<br>ЗАТЕМ — РАБОТА.",accessText:"Создай аккаунт, чтобы открыть учебные материалы MeshcherClub.",createAccount:"Создать аккаунт ↗",emailLabel:"EMAIL",passwordLabel:"ПАРОЛЬ",lockedTitle:"МАТЕРИАЛЫ ЗАКРЫТЫ",lockedText:"Зарегистрируйся или войди, чтобы получить доступ к урокам.",loginOrRegister:"Войти / Зарегистрироваться"},
  en: {navDirections:"Directions",navManifesto:"Philosophy",login:"Log in",register:"Sign up",heroKicker:"PERSONAL DEVELOPMENT PROJECT",heroLine1:"MAKE YOURSELF",heroLine2:"BETTER.",heroText:"Intellect. Discipline. Physical strength.<br>Start changing yourself today.",start:"Start now",explore:"Explore directions",heroBottom:"YOUR JOURNEY STARTS WITH A DECISION",manifestoLabel:"PRINCIPLE",manifestoEyebrow:"DON'T WAIT FOR THE RIGHT MOMENT",manifestoTitle:"YOUR LIFE CHANGES<br>THROUGH ACTION, NOT WORDS.",manifestoText:"Explore paths that develop your thinking, strengthen your body and build character. No overnight promises. Just knowledge and consistent work.",directionsLabel:"LEARNING",directionsTitle:"FOUR DIRECTIONS.<br><span class='muted'>ONE GOAL.</span>",directionsNote:"Learning materials are available to registered members.",chessDesc:"Strategy, tactics, calculation and focus.",martialDesc:"Technique, coordination and physical preparation.",warriorDesc:"Self-control, resilience and responsibility.",gymDesc:"Strength training, progressive overload and recovery.",openDirection:"Explore direction",accessEyebrow:"MEMBER ACCESS",accessTitle:"MAKE THE DECISION.<br>THEN DO THE WORK.",accessText:"Create an account to access MeshcherClub learning materials.",createAccount:"Create account ↗",emailLabel:"EMAIL",passwordLabel:"PASSWORD",lockedTitle:"MEMBERS ONLY",lockedText:"Sign up or log in to access the lessons.",loginOrRegister:"Log in / Sign up"}
};
function msg(t){$("#formMessage").textContent=t;}
function setLanguage(){document.documentElement.lang=lang;document.querySelectorAll("[data-i18n]").forEach(el=>{const v=translations[lang][el.dataset.i18n];if(v!==undefined)el.innerHTML=v;});}
function openAuth(nextMode="register"){mode=nextMode;$("#modalTitle").textContent=mode==="register"?(lang==="ru"?"СОЗДАТЬ АККАУНТ":"CREATE ACCOUNT"):(lang==="ru"?"ВОЙТИ":"LOG IN");$("#modalNote").textContent=mode==="register"?(lang==="ru"?"Регистрация откроет доступ к учебным материалам.":"Create an account to access learning materials."):(lang==="ru"?"Войди, чтобы продолжить обучение.":"Log in to continue learning.");$("#authSubmit").textContent=mode==="register"?(lang==="ru"?"Зарегистрироваться ↗":"SIGN UP ↗"):(lang==="ru"?"Войти ↗":"LOG IN ↗");$("#authSwitch").firstChild.textContent=mode==="register"?(lang==="ru"?"Уже есть аккаунт? ":"Already a member? "):(lang==="ru"?"Нет аккаунта? ":"New here? ");$("#switchMode").textContent=mode==="register"?(lang==="ru"?"Войти":"Log in"):(lang==="ru"?"Регистрация":"Sign up");$("#password").autocomplete=mode==="register"?"new-password":"current-password";msg("");modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");}
function closeModal(m){m.classList.remove("open");m.setAttribute("aria-hidden","true");document.body.classList.remove("modal-open");}
["#loginOpen"].forEach(s=>$(s).addEventListener("click",()=>openAuth("login")));
["#registerOpen","#heroRegister","#accessRegister"].forEach(s=>$(s).addEventListener("click",()=>openAuth("register")));
$("#modalClose").addEventListener("click",()=>closeModal(modal));
$("#switchMode").addEventListener("click",()=>openAuth(mode==="register"?"login":"register"));
$("#langToggle").addEventListener("click",()=>{lang=lang==="ru"?"en":"ru";setLanguage();});
$("#authForm").addEventListener("submit",async e=>{e.preventDefault();const email=$("#email").value.trim(), password=$("#password").value;
  $("#authSubmit").disabled=true;msg(lang==="ru"?"Подождите…":"Please wait…");
  try {
    if(mode==="register"){const {data,error}=await sb.auth.signUp({email,password,options:{emailRedirectTo:location.origin}});if(error)throw error;
      if(data.session){msg(lang==="ru"?"Аккаунт создан. Вы вошли.":"Account created and signed in.");await refreshAuth();}
      else {msg(lang==="ru"?"Письмо со ссылкой подтверждения отправлено. Откройте его и нажмите ссылку — затем вернитесь на сайт.":"A confirmation link has been sent. Open the email and click the link, then return here.");}
    } else {const {error}=await sb.auth.signInWithPassword({email,password});if(error)throw error;msg(lang==="ru"?"Вход выполнен.":"Signed in.");await refreshAuth();}
  } catch(err){msg(err.message||String(err));} finally {$("#authSubmit").disabled=false;}
});
const courseInfo={chess:["CHESS","Стратегия, тактика, расчёт вариантов и шахматная психология."],martial:["MARTIAL ARTS","Техника единоборств, координация и общая физическая подготовка."],warrior:["THE WARRIOR'S PATH","Самоконтроль, психологическая устойчивость, ответственность и дисциплина."],gym:["GYM","Силовые тренировки, прогрессия нагрузок, питание и восстановление."]};
const category={chess:"chess",martial:"martial_arts",warrior:"warriors_path",gym:"gym"};
async function showCourse(){const {data:{session}}=await sb.auth.getSession();const box=$("#courseModal .locked-content");if(!session){box.innerHTML=`<span class="lock-icon">⌑</span><strong>${lang==="ru"?"МАТЕРИАЛЫ ЗАКРЫТЫ":"MEMBERS ONLY"}</strong><p>${lang==="ru"?"Войди, чтобы открыть учебные материалы.":"Log in to access learning materials."}</p><button class="button button-white" id="courseAuth">${lang==="ru"?"Войти / Зарегистрироваться":"Log in / Sign up"}</button>`;$("#courseAuth").addEventListener("click",()=>{closeModal(courseModal);openAuth("register");});return;}
 const {data,error}=await sb.from("articles").select("title,excerpt,content,published_at").eq("category",category[selectedCourse]).eq("status","published").order("published_at",{ascending:false});
 if(error){box.textContent=lang==="ru"?"Не удалось загрузить материалы.":"Could not load lessons.";return;}
 box.innerHTML="";if(!data.length){box.textContent=lang==="ru"?"Пока нет опубликованных материалов.":"No published materials yet.";return;}
 for(const a of data){const article=document.createElement("article");article.className="lesson-item";const h=document.createElement("h3");h.textContent=a.title;const ex=document.createElement("p");ex.textContent=a.excerpt||"";const body=document.createElement("p");body.textContent=a.content;article.append(h,ex,body);box.append(article);}
}
document.querySelectorAll(".course-open").forEach(btn=>btn.addEventListener("click",async()=>{selectedCourse=btn.dataset.course;$("#courseTitle").textContent=courseInfo[selectedCourse][0];$("#courseDescription").textContent=courseInfo[selectedCourse][1];await showCourse();courseModal.classList.add("open");courseModal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");}));
$("#courseClose").addEventListener("click",()=>closeModal(courseModal));
[modal,courseModal].forEach(m=>m.addEventListener("click",e=>{if(e.target===m)closeModal(m)}));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal(modal);closeModal(courseModal);closeModal($("#adminModal"))}});
let currentUser=null;let isOwner=false;
async function refreshAuth(){
  const {data:{user}}=await sb.auth.getUser();currentUser=user||null;isOwner=false;
  const adminButton=$("#adminOpen");
  if(user){
    $("#loginOpen").textContent=lang==="ru"?"Выйти":"Log out";
    $("#loginOpen").onclick=async()=>{await sb.auth.signOut();location.reload();};
    $("#registerOpen").textContent=user.email;$("#registerOpen").disabled=true;
    const {data:profile,error}=await sb.from("profiles").select("role").eq("id",user.id).maybeSingle();
    if(!error&&profile?.role==="owner")isOwner=true;
  }else{
    $("#loginOpen").textContent=lang==="ru"?"Войти":"Log in";
    $("#loginOpen").onclick=()=>openAuth("login");
    $("#registerOpen").textContent=lang==="ru"?"Регистрация":"Sign up";$("#registerOpen").disabled=false;
  }
  adminButton.classList.toggle("is-visible",isOwner);
  if(!isOwner&&$("#adminModal").classList.contains("open"))closeModal($("#adminModal"));
}
function slugify(value){return value.toLowerCase().trim().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9а-яё]+/gi,"-").replace(/^-+|-+$/g,"")||"article";}
function adminMessage(value){$("#adminMessage").textContent=value;}
function resetArticleForm(){$("#articleForm").reset();$("#articleId").value="";$("#articleSave").textContent="СОХРАНИТЬ";adminMessage("");}
async function loadAdminArticles(){
  const list=$("#articleList");list.textContent="Загрузка…";
  const {data,error}=await sb.from("articles").select("id,slug,title,excerpt,content,category,status,published_at").order("updated_at",{ascending:false});
  if(error){list.textContent="Ошибка загрузки статей: "+error.message;return;}
  list.innerHTML="";
  if(!data.length){list.textContent="Статей пока нет.";return;}
  for(const article of data){
    const item=document.createElement("div");item.className="admin-item";
    const info=document.createElement("div");const title=document.createElement("strong");title.textContent=article.title;const meta=document.createElement("small");meta.textContent=article.category+" · "+article.status;info.append(title,meta);
    const actions=document.createElement("div");actions.className="admin-item-actions";
    const edit=document.createElement("button");edit.type="button";edit.className="button button-outline button-small";edit.textContent="ИЗМЕНИТЬ";edit.addEventListener("click",()=>{ $("#articleId").value=article.id;$("#articleTitle").value=article.title;$("#articleExcerpt").value=article.excerpt||"";$("#articleCategory").value=article.category;$("#articleStatus").value=article.status;$("#articleContent").value=article.content;$("#articleSave").textContent="ОБНОВИТЬ";adminMessage("Редактирование: "+article.title);$("#articleForm").scrollIntoView({behavior:"smooth",block:"start"});});
    const del=document.createElement("button");del.type="button";del.className="button button-outline button-small";del.textContent="УДАЛИТЬ";del.addEventListener("click",async()=>{if(!confirm("Удалить статью «"+article.title+"»?"))return;const {error}=await sb.from("articles").delete().eq("id",article.id);if(error){adminMessage("Не удалось удалить: "+error.message);return;}resetArticleForm();await loadAdminArticles();});
    actions.append(edit,del);item.append(info,actions);list.append(item);
  }
}
async function loadAdminUsers(){
  const list=$("#userList");list.textContent="Загрузка…";
  const {data,error}=await sb.from("profiles").select("id,email,display_name,role").order("email",{ascending:true});
  if(error){list.textContent="Ошибка загрузки пользователей: "+error.message;return;}
  list.innerHTML="";if(!data.length){list.textContent="Пользователей пока нет.";return;}
  for(const user of data){const item=document.createElement("div");item.className="admin-item";const info=document.createElement("div");const name=document.createElement("strong");name.textContent=user.display_name||user.email||"Участник";const meta=document.createElement("small");meta.textContent=(user.email||"")+" · "+user.role;info.append(name,meta);item.append(info);list.append(item);}
}
async function openAdmin(){if(!isOwner){adminMessage("Доступ запрещён.");return;}$("#adminModal").classList.add("open");$("#adminModal").setAttribute("aria-hidden","false");document.body.classList.add("modal-open");resetArticleForm();await loadAdminArticles();}
$("#adminOpen").addEventListener("click",openAdmin);
$("#adminClose").addEventListener("click",()=>closeModal($("#adminModal")));
$("#adminModal").addEventListener("click",e=>{if(e.target===$("#adminModal"))closeModal($("#adminModal"));});
$("#articleReset").addEventListener("click",resetArticleForm);
$("#articleForm").addEventListener("submit",async e=>{
  e.preventDefault();if(!isOwner||!currentUser){adminMessage("Нет прав доступа.");return;}
  const title=$("#articleTitle").value.trim(),status=$("#articleStatus").value;
  const payload={title,slug:slugify(title),excerpt:$("#articleExcerpt").value.trim(),category:$("#articleCategory").value,status,content:$("#articleContent").value.trim(),author_id:currentUser.id,published_at:status==="published"?new Date().toISOString():null};
  const id=$("#articleId").value;$("#articleSave").disabled=true;adminMessage("Сохранение…");
  const result=id?await sb.from("articles").update(payload).eq("id",id):await sb.from("articles").insert(payload);
  $("#articleSave").disabled=false;
  if(result.error){adminMessage("Ошибка: "+result.error.message);return;}
  adminMessage(status==="published"?"Статья опубликована.":"Статья сохранена.");resetArticleForm();await loadAdminArticles();
});
document.querySelectorAll(".admin-tab").forEach(tab=>tab.addEventListener("click",async()=>{
  document.querySelectorAll(".admin-tab").forEach(t=>t.classList.toggle("active",t===tab));
  const users=tab.dataset.tab==="users";$("#adminArticles").hidden=users;$("#adminUsers").hidden=!users;if(users)await loadAdminUsers();
}));
sb.auth.onAuthStateChange(()=>{setTimeout(refreshAuth,0);});
$("#year").textContent=new Date().getFullYear();setLanguage();refreshAuth();
