// تنظیم اتصال دیتابیس به‌صورت ثابت در config.js نگهداری می‌شود؛ کلید عمومی را هرگز با service_role جایگزین نکن.
let SUPABASE_URL = (window.KALAMEH_CONFIG && window.KALAMEH_CONFIG.supabaseUrl) || localStorage.getItem("kalameh_supabase_url") || "";
let SUPABASE_ANON_KEY = (window.KALAMEH_CONFIG && window.KALAMEH_CONFIG.supabaseAnonKey) || localStorage.getItem("kalameh_supabase_key") || "";
let configured = false;
let db = null;
function initSupabase(url, key) {
  SUPABASE_URL = (url || "").trim().replace(/\/$/, "");
  SUPABASE_ANON_KEY = (key || "").trim();
  configured = /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(SUPABASE_URL) && !!SUPABASE_ANON_KEY && !/service_role|secret/i.test(SUPABASE_ANON_KEY);
  db = configured ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
  return configured;
}
if (SUPABASE_URL && SUPABASE_ANON_KEY) initSupabase(SUPABASE_URL, SUPABASE_ANON_KEY);
const $ = id => document.getElementById(id);
const state = {lang:"fa",answer:"",guesses:[],active:false,user:null,authMode:"register",keyboard:{},daily:false,wordLength:[4,5,6].includes(Number(localStorage.getItem("kalameh_word_length")))?Number(localStorage.getItem("kalameh_word_length")):5};
const words = {
 fa:{4:["کتاب","بهار","خانه","دریا","زمین","آرام","سفره","مداد"],5:["باران","ستاره","لبخند","نارنج","کتابی","بهاری","پرنده","دوستی","آسمان","گلزار"],6:["دانایی","مهربان","خوشحال","زمستان","پاییزی","کتابها","گلدسته","دانشجو","خردمند"]},
 en:{4:["book","moon","star","tree","wind","blue","bird","game"],5:["crane","apple","grape","house","plant","water","dream","smile","brain","light"],6:["planet","orange","stream","garden","silver","bright","puzzle","friend","castle"]}
};
const dailyWords = {
 fa:{4:["بهار","دریا","خانه","کتاب"],5:["باران","ستاره","لبخند","نارنج","پرنده"],6:["مهربان","زمستان","دانایی","خوشحال"]},
 en:{4:["moon","star","tree","game"],5:["crown","flame","river","pride","stone"],6:["planet","orange","stream","garden"]}
};
const keyboards = {fa:["ض ص ث ق ف غ ع ه خ ح ج چ","ش س ی ب ل ا ت ن م ک گ","ظ ط ز ر ذ د پ و ژ"],en:["qwertyuiop","asdfghjkl","zxcvbnm"]};
const faDigits=n=>String(n).replace(/\d/g,d=>state.lang==="fa"?"۰۱۲۳۴۵۶۷۸۹"[d]:d);
const i18n={
 fa:{
  gameNav:"بازی", leaderboardNav:"برترین‌ها", profileNav:"پروفایل", settingsNav:"تنظیمات", lightMode:"☀️ حالت روشن", darkMode:"🌙 حالت تاریک", account:"ورود / ثبت‌نام",
  eyebrow:"بازی حدس واژه", setupTitle:"هر روز، یک چالش تازه.", setupIntro:"زبانت را انتخاب کن، شش فرصت داری تا واژه پنهان را پیدا کنی.", rulesCorrect:"درست!", rulesCorrectSmall:"حرف و جایگاه درست است.", rulesPresent:"نزدیک شدی!", rulesPresentSmall:"حرف در واژه هست، جای آن نه.", rulesAbsent:"این یکی نه.", rulesAbsentSmall:"این حرف در واژه نیست.", start:"شروع بازی", guestNote:"برای ذخیره سابقه بازی، ابتدا حساب بساز یا وارد شو.",
  today:"بازی کلمه", gameTitle:"واژه را پیدا کن", attempts:"از ۶ فرصت", enterWord:"یک واژه وارد کن.", lengthLabel:"تعداد حروف کلمه", guideEyebrow:"راهنمای بازی", guideTitle:"چطور بهتر حدس بزنم؟", guideItems:["یک کلمه واقعی با تعداد حروف انتخاب‌شده وارد کن.","سبز یعنی حرف و جایگاهش درست است؛ زرد یعنی حرف در کلمه هست اما جای آن اشتباه است.","خاکستری یعنی آن حرف در کلمه پنهان وجود ندارد.","حروف سبز را در جای خود نگه دار و با توجه به رنگ‌ها حدس بعدی را بساز.","برای پیدا کردن حروف تازه، از حدس‌های متفاوت استفاده کن؛ شش فرصت داری."], exactN:"واژه باید دقیقاً به تعداد حروف انتخاب‌شده باشد.", newGame:"بازی جدید", back:"بازگشت", champions:"جام قهرمانان", leaderboardTitle:"جدول برترین‌ها", leaderboardIntro:"بازیکنانی که بیشترین برد را ثبت کرده‌اند.", loadingLeaderboard:"در حال دریافت جدول...", refresh:"به‌روزرسانی", accountLabel:"حساب کاربری", playerProfile:"پروفایل بازیکن", level:"سطح بازیکن", games:"بازی", wins:"برد", bestGuess:"بهترین حدس", history:"سابقه بازی‌ها", logout:"خروج از حساب",
  personalize:"شخصی‌سازی بازی", settingsTitle:"تنظیمات", settingsIntro:"ظاهر کلمه را مطابق سلیقه‌ات انتخاب کن. انتخاب‌ها روی همین دستگاه ذخیره می‌شوند.", paletteHeading:"رنگ و تم منو", modeHeading:"حالت نمایش", settingsSaved:"تنظیمات به‌صورت خودکار ذخیره می‌شوند.", ocean:"اقیانوسی", purple:"بنفش", forest:"جنگلی", sunset:"غروب", rose:"رز", dark:"🌙 تاریک", light:"☀️ روشن", system:"⚙️ مطابق دستگاه",
  join:"به جمع کلمه‌بازها بپیوند", createAccount:"ساخت حساب", register:"ثبت‌نام", login:"ورود", username:"نام کاربری", usernamePlaceholder:"مثلاً kalameh_player", yourUsername:"نام کاربری شما", password:"رمز عبور", passwordPlaceholder:"حداقل ۸ نویسه", passwordHelp:"نام کاربری را خودت انتخاب کن. برای ورود دوباره، همین نام کاربری و رمز عبور را لازم داری.", close:"بستن", signupSuccess:"ثبت‌نام با موفقیت تأیید شد! نام کاربری شما: ", signupContinue:"حالا می‌توانی بازی را شروع کنی.", loggedIn:"وارد حساب شده‌ای؛ نتایج بازی‌ها ذخیره می‌شوند.", loginRequired:"برای بازی باید ثبت‌نام کنی یا وارد حساب شوی.",
  exactFive:"واژه باید دقیقاً ۵ حرف داشته باشد.", congrats:"آفرین! واژه را پیدا کردی 🎉", gameOver:"پایان بازی؛ پاسخ: ", tryAgain:"حدس بعدی را امتحان کن.", nextGuess:"حدس بعدی را امتحان کن.", saveError:"نتیجه در سرور ذخیره نشد. اتصال دیتابیس را بررسی کن.", configureDb:"ابتدا تنظیمات Supabase در config.js را تکمیل کن.", usernameRules:"نام کاربری باید ۳ تا ۲۴ نویسه و شامل حروف انگلیسی، عدد یا _ باشد.", passwordRules:"رمز عبور باید حداقل ۸ نویسه باشد.", duplicateUser:"این نام کاربری قبلاً ثبت شده است. لطفاً نام دیگری انتخاب کن یا وارد حساب قبلی‌ات شو.", signupFailed:"ثبت‌نام تأیید نشد. ممکن است این نام کاربری قبلاً استفاده شده باشد.", invalidLogin:"نام کاربری یا رمز عبور اشتباه است.", authError:"خطا در ورود یا ثبت‌نام.",
  loadingData:"در حال بارگذاری...", dbLeaderboard:"برای نمایش جدول، ابتدا دیتابیس را تنظیم کن.", failedLeaderboard:"دریافت جدول ناموفق بود.", noRecords:"هنوز رکوردی ثبت نشده است.",
 },
 en:{
  brand:"Kalameh", gameNav:"Game", leaderboardNav:"Leaderboard", profileNav:"Profile", settingsNav:"Settings", lightMode:"☀️ Light mode", darkMode:"🌙 Dark mode", account:"Log in / Sign up",
  eyebrow:"WORD GUESSING GAME", setupTitle:"A fresh challenge every day.", setupIntro:"Choose your language. You have six tries to find the hidden word.", rulesCorrect:"Correct!", rulesCorrectSmall:"Right letter in the right position.", rulesPresent:"Close!", rulesPresentSmall:"The letter is in the word, but in another position.", rulesAbsent:"Not this one.", rulesAbsentSmall:"This letter is not in the word.", start:"Start game", guestNote:"Create an account or log in to save your game history.",
  today:"WORD GAME", gameTitle:"Find the hidden word", attempts:"of 6 tries", enterWord:"Enter a word.", lengthLabel:"Word length", guideEyebrow:"HOW TO PLAY", guideTitle:"How can I make better guesses?", guideItems:["Enter a real word with the selected number of letters.","Green means the letter and position are correct; yellow means the letter is in the word but in another position.","Gray means the letter does not appear in the hidden word.","Keep green letters in place and use the colors to shape your next guess.","Try different guesses to discover new letters. You have six attempts."], exactN:"The word must contain exactly the selected number of letters.", newGame:"New game", back:"Back",
  champions:"CHAMPIONS CUP", leaderboardTitle:"Leaderboard", leaderboardIntro:"Players with the most wins.", loadingLeaderboard:"Loading leaderboard…", refresh:"Refresh", accountLabel:"ACCOUNT", playerProfile:"Player profile", level:"Player level", beginner:"Beginner", wordSeeker:"Word seeker", wordMaster:"Word master", wordLegend:"Word legend", games:"Games", wins:"Wins", bestGuess:"Best guess", history:"Game history", logout:"Log out",
  personalize:"PERSONALIZE YOUR GAME", settingsTitle:"Settings", settingsIntro:"Customize Kalameh. Your choices are saved on this device.", paletteHeading:"Menu color theme", modeHeading:"Display mode", settingsSaved:"Settings are saved automatically.", ocean:"Ocean", purple:"Purple", forest:"Forest", sunset:"Sunset", rose:"Rose", dark:"🌙 Dark", light:"☀️ Light", system:"⚙️ System",
  join:"Join the Kalameh community", createAccount:"Create account", register:"Sign up", login:"Log in", username:"Username", usernamePlaceholder:"e.g. kalameh_player", yourUsername:"Your username", password:"Password", passwordPlaceholder:"At least 8 characters", passwordHelp:"Choose a username. You will need the same username and password to log in again.", close:"Close", signupSuccess:"Registration successful! Your username: ", signupContinue:"You can now start playing.", loggedIn:"You are logged in; your game results will be saved.", loginRequired:"Please sign up or log in to play.",
  exactFive:"Word must contain exactly 5 letters.", congrats:"You got it! 🎉", gameOver:"Game over. Answer: ", tryAgain:"Try another guess.", nextGuess:"Try your next guess.", saveError:"The result could not be saved. Check the database connection.", configureDb:"Complete the Supabase configuration in config.js first.", usernameRules:"Username must be 3–24 characters and contain only English letters, numbers, or _.", passwordRules:"Password must be at least 8 characters.", duplicateUser:"That username is already registered. Choose another or log in.", signupFailed:"Registration could not be confirmed. This username may already be in use.", invalidLogin:"Incorrect username or password.", authError:"Could not log in or sign up.",
  loadingData:"Loading…", dbLeaderboard:"Configure the database to view the leaderboard.", failedLeaderboard:"Could not load the leaderboard.", noRecords:"No scores have been recorded yet.", dbHistoryEmpty:"No game history is available yet.", win:"Win", loss:"Loss", guesses:"guesses", levelSuffix:" · Level ", xp:"XP", untilNext:"% to next level", savedAccount:"You are logged in; your results will be saved.",
  winsWord:"wins", gamesWord:"games", weeklyWins:"wins"
 }
};
function t(key){return state.lang==="en"?(i18n.en[key]||key):(i18n.fa[key]||key);}
function show(page){["setup","game","profile","settings"].forEach(id=>$(id).classList.toggle("hidden",id!==page));document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.page===page));}
function say(t,type=""){$("message").textContent=t;$("message").className="message "+type;}
function setLang(lang){
 state.lang=lang; localStorage.setItem("kalameh_language",lang); const en=lang==="en", dir=en?"ltr":"rtl";
 document.documentElement.lang=en?"en":"fa"; document.documentElement.dir=dir; document.title=en?"Kalameh | Word Game":"کلمه | KALAMEH"; $("board").dir=dir; $("keyboard").dir=dir; $("game").dir=dir;
 const set=(selector,value)=>{const el=document.querySelector(selector);if(el)el.textContent=value;};
 const map={
  ".brand span:last-of-type":en?"Kalameh":"کلمه", ".brand[aria-label]":null,
  '.nav-btn[data-page="game"]':t("gameNav"), '.nav-btn[data-page="profile"]':t("profileNav"), '.nav-btn[data-page="settings"]':t("settingsNav"),
  "#themeToggle":document.body.dataset.theme==="light"?t("darkMode"):t("lightMode"), "#accountBtn":state.user?"@"+state.user.username:t("account"),
  "#setup .eyebrow":t("eyebrow"), "#setup h1":t("setupTitle"), "#setup > .muted":t("setupIntro"),
  ".rules div:nth-child(1) b":t("rulesCorrect"), ".rules div:nth-child(1) small":t("rulesCorrectSmall"), ".rules div:nth-child(2) b":t("rulesPresent"), ".rules div:nth-child(2) small":t("rulesPresentSmall"), ".rules div:nth-child(3) b":t("rulesAbsent"), ".rules div:nth-child(3) small":t("rulesAbsentSmall"),
  "#guestNote":state.user?t("loggedIn"):t("guestNote"),
  ".game-heading .eyebrow":t("today"), "#gameTitle":t("gameTitle"), ".attempt-pill span":t("attempts"),
  "#profile .eyebrow":t("accountLabel"), "#profileTitle":t("playerProfile"), "#profile .level-card small:first-child":t("level"), "#profile .stats div:nth-child(1) small":t("games"), "#profile .stats div:nth-child(2) small":t("wins"), "#profile .stats div:nth-child(3) small":t("bestGuess"), "#profile h3":t("history"),
  "#settings .eyebrow":t("personalize"), "#settingsTitle":t("settingsTitle"), "#settingsIntro":t("settingsIntro"), "#paletteHeading":t("paletteHeading"), "#modeHeading":t("modeHeading"), "#settingsSavedNote":t("settingsSaved"),
  "#darkModeChoice":t("dark"), "#lightModeChoice":t("light"), "#systemModeChoice":t("system"),
  "#authDialog .eyebrow":t("join"), "#authTitle":state.authMode==="login"?t("login"):t("createAccount"), '.auth-tabs button[data-auth="register"]':t("register"), '.auth-tabs button[data-auth="login"]':t("login"), "#passwordInput":null, ".auth-help":t("passwordHelp"), "#authSubmit":state.authMode==="login"?t("login"):t("createAccount")
 };
 Object.entries(map).forEach(([sel,val])=>{if(val!==null)set(sel,val);});
 const start=$("startBtn"); if(start)start.innerHTML=en?'Free play <span>→</span>':'بازی آزاد <span>←</span>';
 const lengthLabel=$("lengthLabel");if(lengthLabel)lengthLabel.textContent=t("lengthLabel");
 const lengthSelect=$("wordLengthSelect");if(lengthSelect){lengthSelect.value=String(state.wordLength);[...lengthSelect.options].forEach(o=>o.textContent=state.lang==="en"?`${o.value} letters`:({4:"۴ حرفی",5:"۵ حرفی",6:"۶ حرفی"}[o.value]));lengthSelect.setAttribute("aria-label",t("lengthLabel"));}
 const guideEyebrow=$("guideEyebrow"),guideTitle=$("guideTitle"),guideList=$("guideList");if(guideEyebrow)guideEyebrow.textContent=t("guideEyebrow");if(guideTitle)guideTitle.textContent=t("guideTitle");if(guideList){guideList.innerHTML="";t("guideItems").forEach(item=>{const li=document.createElement("li");li.textContent=item;guideList.appendChild(li);});}
 $("newGameBtn").textContent=t("newGame"); $("backBtn").textContent=t("back"); $("logoutBtn").textContent=t("logout"); updateDailyUI();
 $("registerUsername").placeholder=t("usernamePlaceholder"); $("usernameInput").placeholder=t("yourUsername"); $("passwordInput").placeholder=t("passwordPlaceholder");
 const help=document.querySelector('#authDialog .tiny.muted');if(help)help.textContent=t("passwordHelp");
 const nameLabel=$("nameLabel"), usernameLabel=$("usernameLabel");
 if(nameLabel&&nameLabel.firstChild)nameLabel.firstChild.textContent=t("username");
 if(usernameLabel&&usernameLabel.firstChild)usernameLabel.firstChild.textContent=t("username");
 const passwordLabel=$("passwordInput")?.parentElement;if(passwordLabel&&passwordLabel.firstChild)passwordLabel.firstChild.textContent=t("password");
 const close=document.querySelector('.dialog-close button');if(close)close.setAttribute("aria-label",t("close"));const brand=document.querySelector(".brand");if(brand)brand.setAttribute("aria-label",en?"Kalameh":"کلمه");
 const footer=document.querySelectorAll("footer span");if(footer.length){footer[0].textContent=en?"Kalameh © 2026":"کلمه © ۲۰۲۶";if(footer.length>1)footer[1].textContent=en?"Made for word lovers":"ساخته‌شده برای عاشقان واژه";}
 const mark=document.querySelector(".brand-mark");if(mark)mark.textContent=en?"K":"ک";const avatar=document.querySelector(".avatar");if(avatar)avatar.textContent=en?"K":"ک";const samples=document.querySelectorAll(".sample");if(samples.length>=3){samples[0].textContent=en?"A":"ک";samples[1].textContent=en?"B":"ل";samples[2].textContent=en?"C":"م";}
 document.querySelectorAll(".lang").forEach(b=>b.classList.toggle("active",b.dataset.lang===lang));
 document.querySelectorAll("[data-fa][data-en]").forEach(el=>el.textContent=el.dataset[lang]);
 renderKeyboard();
}
function dailyDateKey(){return new Date().toISOString().slice(0,10);}
function dailyStorageKey(){return "kalameh_daily_"+state.lang+"_"+state.wordLength+"_"+dailyDateKey();}
function wordLengthLabel(){return state.lang==="en"?`${state.wordLength}-letter`:{4:"چهارحرفی",5:"پنج‌حرفی",6:"شش‌حرفی"}[state.wordLength];}
function updateGameCopy(){const title=$("gameTitle");if(title)title.textContent=state.lang==="en"?`Guess the ${wordLengthLabel()} word`:`واژه ${wordLengthLabel()} را پیدا کن`;}
function updateDailyUI(){const btn=$("dailyChallengeBtn"),note=$("dailyChallengeNote");if(!btn||!note)return;const done=!!localStorage.getItem(dailyStorageKey());btn.disabled=done;btn.textContent=state.lang==="en"?(done?"✓ Daily challenge completed":"🌟 Daily challenge →"):(done?"✓ چالش امروز انجام شد":"🌟 چالش روزانه ←");note.textContent=state.lang==="en"?(done?"You have completed today's challenge for this word length. Come back tomorrow!":"A fresh daily word in the selected length. Your result can only be submitted once per day."):(done?"چالش امروز با این تعداد حروف انجام شده؛ فردا برگرد!":"هر روز یک واژه تازه با تعداد حروف انتخاب‌شده؛ نتیجه فقط یک‌بار در روز ثبت می‌شود.");}
function startDaily(){if(!state.user){openAuth("register");return;}if(localStorage.getItem(dailyStorageKey())){updateDailyUI();return;}const seed=dailyDateKey()+"_"+state.lang+"_"+state.wordLength;let hash=0;for(const ch of seed)hash=(hash*31+ch.charCodeAt(0))>>>0;state.answer=dailyWords[state.lang][state.wordLength][hash%dailyWords[state.lang][state.wordLength].length];startGame(true);}
function startGame(isDaily=false){state.daily=isDaily;state.guesses=[];state.current="";state.active=true;state.keyboard={};$("attemptCount").textContent=state.lang==="fa"?"۰":"0";say(t("enterWord"));updateGameCopy();renderBoard();renderKeyboard();show("game");}
function newGame(){if(!state.user){openAuth("register");return;}const pool=words[state.lang][state.wordLength];state.answer=pool[Math.floor(Math.random()*pool.length)];startGame(false);}
function evaluate(guess,answer){const g=Array.from(guess),a=Array.from(answer),out=Array(g.length).fill("gray"),counts={};for(let i=0;i<g.length;i++){if(g[i]===a[i])out[i]="green";else counts[a[i]]=(counts[a[i]]||0)+1;}for(let i=0;i<g.length;i++){if(out[i]!=="green"&&counts[g[i]]>0){out[i]="yellow";counts[g[i]]--;}}return out;}
function renderBoard(){const board=$("board");board.innerHTML="";board.style.setProperty("--word-length",state.wordLength);for(let r=0;r<6;r++){const row=document.createElement("div");row.className="board-row";row.style.gridTemplateColumns=`repeat(${state.wordLength}, minmax(0, 1fr))`;const guess=state.guesses[r]||"",letters=Array.from(guess);for(let c=0;c<state.wordLength;c++){const tile=document.createElement("div");tile.className="tile";if(letters[c]){tile.textContent=letters[c];tile.classList.add("filled");}if(state.guesses[r])tile.classList.add(evaluate(state.guesses[r],state.answer)[c]);row.appendChild(tile);}board.appendChild(row);}$("attemptCount").textContent=faDigits(state.guesses.length);}
function renderKeyboard(){const root=$("keyboard");if(!root)return;root.innerHTML="";keyboards[state.lang].forEach(line=>{const row=document.createElement("div");row.className="key-row";for(const letter of Array.from(line.replaceAll(" ",""))){const key=document.createElement("button");key.className="key";key.textContent=letter;if(state.keyboard[letter])key.classList.add(state.keyboard[letter]);key.onclick=()=>addLetter(letter);row.appendChild(key);}root.appendChild(row);});const row=document.createElement("div");row.className="key-row";[[state.lang==="en"?"⌫":"⌫","wide-key",removeLetter],[state.lang==="fa"?"ثبت":"ENTER","wide-key",submitGuess]].forEach(([label,cls,fn])=>{const b=document.createElement("button");b.className="key "+cls;b.textContent=label;b.onclick=fn;row.appendChild(b);});root.appendChild(row);}
function addLetter(ch){if(!state.active)return;const a=Array.from(state.current||"");if(a.length<state.wordLength){a.push(ch);state.current=a.join("");renderCurrent();}}
function removeLetter(){if(!state.active)return;state.current=Array.from(state.current||"").slice(0,-1).join("");renderCurrent();}
function renderCurrent(){const row=$("board").children[state.guesses.length];if(!row)return;const a=Array.from(state.current||"");[...row.children].forEach((t,i)=>{t.textContent=a[i]||"";t.classList.toggle("filled",!!a[i]);});}
async function submitGuess(){if(!state.active)return;const guess=(state.current||"").normalize("NFC").toLowerCase();if(Array.from(guess).length!==state.wordLength){say(t("exactN"),"error");return;}state.guesses.push(guess);state.current="";const result=evaluate(guess,state.answer);Array.from(guess).forEach((ch,i)=>{const old=state.keyboard[ch],next=result[i];if(old!=="green"&&(old!=="yellow"||next==="green"))state.keyboard[ch]=next;});renderBoard();renderKeyboard();if(guess===state.answer){state.active=false;say(t("congrats"),"success");finishDaily();await saveResult(true);return;}if(state.guesses.length===6){state.active=false;say(t("gameOver")+state.answer,"error");finishDaily();await saveResult(false);return;}say(state.lang==="en"?"Not quite. Keep green letters in place and move yellow letters to a new position.":"هنوز نه! حروف سبز را در جای خود نگه دار و حروف زرد را به جای دیگری منتقل کن.");}
function finishDaily(){if(state.daily){localStorage.setItem(dailyStorageKey(),JSON.stringify({won:state.guesses.at(-1)===state.answer,attempts:state.guesses.length,answer:state.answer}));updateDailyUI();}}
async function saveResult(won){if(!state.user||!db)return;const {error}=await db.rpc("record_kalameh_result",{p_username:state.user.username,p_password:state.user.password,p_won:won,p_attempts:state.guesses.length,p_answer:state.answer,p_guesses:state.guesses});if(error){console.error(error);say(t("saveError"),"error");}}
function openAuth(mode="register"){if(!db){$("authMessage").textContent=t("configureDb");}state.authMode=mode;updateAuthUI();$("authDialog").showModal();}
function updateAuthUI(){const login=state.authMode==="login";$("authTitle").textContent=login?t("login"):t("createAccount");$("nameLabel").classList.toggle("hidden",login);$("usernameLabel").classList.toggle("hidden",!login);$("authSubmit").textContent=login?t("login"):t("createAccount");$("passwordInput").value="";document.querySelectorAll(".auth-tabs button").forEach(b=>{b.classList.toggle("active",b.dataset.auth===state.authMode);b.textContent=b.dataset.auth==="login"?t("login"):t("register");});$("authMessage").textContent="";}
async function authSubmit(){
 if(!db){$('authMessage').textContent=t("configureDb");return;}
 const password=$('passwordInput').value;
 if(password.length<8){$('authMessage').textContent=t("passwordRules");return;}
 const registering=state.authMode==='register';
 const username=(registering?$('registerUsername').value:$('usernameInput').value).trim().toLowerCase();
 if(!/^[a-z0-9_]{3,24}$/.test(username)){$('authMessage').textContent=t("usernameRules");return;}
 $('authSubmit').disabled=true;
 try{
   const fn=registering?'register_kalameh_player':'login_kalameh_player';
   const {data,error}=await db.rpc(fn,{p_username:username,p_password:password});
   if(error){
     const message=String(error.message||'');
     if(registering&&(message.includes('این نام کاربری قبلاً انتخاب شده')||message.includes('already exists')||message.includes('duplicate'))){
       throw new Error(t("duplicateUser"));
     }
     throw error;
   }
   const row=Array.isArray(data)?data[0]:data;
   if(!row||!row.username){
     if(registering)throw new Error(t("signupFailed"));
     throw new Error(t("invalidLogin"));
   }
   state.user={username:row.username,password};
   sessionStorage.setItem('kalameh_session',JSON.stringify(state.user));
   if(registering)window.alert(t("signupSuccess")+row.username+"\n"+t("signupContinue"));
   $('authDialog').close();
   $('accountBtn').textContent='@'+row.username;
   $('guestNote').textContent=t("loggedIn");
   await loadProfile();
   newGame();
 }catch(e){$('authMessage').textContent=e.message||t("authError");}
 finally{$('authSubmit').disabled=false;}
}
async function loadProfile(){
 if(!state.user||!db)return;
 const {data,error}=await db.rpc("get_kalameh_profile",{p_username:state.user.username,p_password:state.user.password});if(error||!data?.length)return;
 const p=data[0];$("profileName").textContent=p.username;$("profileUsername").textContent="@"+p.username;$("statGames").textContent=faDigits(p.games);$("statWins").textContent=faDigits(p.wins);$("statBest").textContent=p.best_attempts?faDigits(p.best_attempts):"—";
 const xp=p.wins*100+p.games*20,lv=Math.floor(xp/250)+1,pr=Math.round(xp%250/250*100);const levelName=state.lang==="en"?(lv<3?"Beginner":lv<6?"Word seeker":lv<10?"Word master":"Word legend"):(lv<3?"تازه‌کار":lv<6?"واژه‌جو":lv<10?"استاد واژه":"افسانه‌ای");$("profileLevel").textContent=levelName+t("levelSuffix")+faDigits(lv);$("levelProgress").style.width=pr+"%";$("levelXp").textContent=faDigits(xp)+(state.lang==="en"?" XP · ":" امتیاز تجربه · ")+faDigits(pr)+(state.lang==="en"?"% ":"٪ ")+t("untilNext");
 const hist=$("profileHistory");if(hist){const {data:rows,error:he}=await db.rpc("get_kalameh_history",{p_username:state.user.username,p_password:state.user.password});hist.innerHTML="";if(he||!rows?.length){hist.innerHTML='<div class="loading">'+t("dbHistoryEmpty")+'</div>';return;}rows.forEach(h=>{const d=document.createElement("div");d.className="leader-row";d.textContent=(h.won?"🏆 "+t("win"):"🎮 "+t("loss"))+" · "+faDigits(h.attempts)+" "+t("guesses")+" · "+new Date(h.played_at).toLocaleDateString(state.lang==="en"?"en-US":"fa-IR");hist.appendChild(d);});}
}
function logout(){state.user=null;sessionStorage.removeItem("kalameh_session");$("accountBtn").textContent=t("account");$("guestNote").textContent=t("loginRequired");state.active=false;show("setup");}
document.querySelectorAll(".lang").forEach(b=>b.onclick=()=>setLang(b.dataset.lang));document.querySelectorAll(".nav-btn").forEach(b=>b.onclick=()=>{if(b.dataset.page==="game"){show("setup");return;}show(b.dataset.page);if(b.dataset.page==="profile")loadProfile();});document.querySelectorAll(".auth-tabs button").forEach(b=>b.onclick=()=>{state.authMode=b.dataset.auth;updateAuthUI();});
$("wordLengthSelect").onchange=()=>{state.wordLength=Number($("wordLengthSelect").value);localStorage.setItem("kalameh_word_length",String(state.wordLength));updateDailyUI();};$("startBtn").onclick=newGame;$("dailyChallengeBtn").onclick=startDaily;$("newGameBtn").onclick=newGame;$("backBtn").onclick=()=>show("setup");$("accountBtn").onclick=()=>openAuth(state.user?"login":"register");$("authSubmit").onclick=authSubmit;$("logoutBtn").onclick=logout;
document.addEventListener("keydown",e=>{if($("authDialog").open||!state.active||$("game").classList.contains("hidden"))return;if(e.key==="Enter")submitGuess();else if(e.key==="Backspace")removeLetter();else if(state.lang==="en"&&/^[a-z]$/i.test(e.key))addLetter(e.key.toLowerCase());else if(state.lang==="fa"&&Array.from(keyboards.fa.join("")).includes(e.key))addLetter(e.key);});
try{const saved=sessionStorage.getItem("kalameh_session");if(saved){state.user=JSON.parse(saved);$("accountBtn").textContent="@"+state.user.username;$("guestNote").textContent="وارد حساب شده‌ای؛ نتایج بازی‌ها ذخیره می‌شوند.";}}catch{}
setLang(localStorage.getItem("kalameh_language")||"fa");if(state.user){$("accountBtn").textContent="@"+state.user.username;$("guestNote").textContent=t("loggedIn");}renderBoard();renderKeyboard();updateDailyUI();

function applyMode(mode){
  const resolved=mode==="system"?(window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"):mode;
  document.body.dataset.theme=resolved;
  localStorage.setItem("kalameh_display_mode",mode);
  const toggle=$("themeToggle");
  if(toggle)toggle.textContent=resolved==="light"?t("darkMode"):t("lightMode");
  document.querySelectorAll(".mode-choice").forEach(b=>b.classList.toggle("active",b.dataset.mode===mode));
}
function applyPalette(palette){
  const allowed=["ocean","purple","forest","sunset","rose"];
  const selected=allowed.includes(palette)?palette:"ocean";
  document.body.dataset.palette=selected;
  localStorage.setItem("kalameh_palette",selected);
  document.querySelectorAll(".theme-choice").forEach(b=>b.classList.toggle("active",b.dataset.palette===selected));
}
(function(){
  applyPalette(localStorage.getItem("kalameh_palette")||"ocean");
  applyMode(localStorage.getItem("kalameh_display_mode")||localStorage.getItem("kalameh_theme")||"dark");
  $("themeToggle").onclick=()=>applyMode(document.body.dataset.theme==="light"?"dark":"light");
  document.querySelectorAll(".theme-choice").forEach(b=>b.onclick=()=>applyPalette(b.dataset.palette));
  document.querySelectorAll(".mode-choice").forEach(b=>b.onclick=()=>applyMode(b.dataset.mode));
  if(window.matchMedia){
    const mq=window.matchMedia("(prefers-color-scheme: light)");
    mq.addEventListener?.("change",()=>{if(localStorage.getItem("kalameh_display_mode")==="system")applyMode("system");});
  }
  const settingsNav=document.querySelector('.nav-btn[data-page="settings"]');
  if(settingsNav)settingsNav.addEventListener("click",()=>{});
})();
