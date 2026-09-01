/*
  ==============================
  EDYTUJ TYLKO TEN BLOK
  ==============================
  Możesz tu wpisać Wasze dane.
  Odpowiedzi nie są widoczne na stronie — to prosty projekt bez backendu.
*/
const CONFIG = {
  herName: "CIEBIE",
  yourName: "Kubuś",
  intro: "Te wakacje to był początek lepszej części naszego życia",

  // Zmień treść 7 zagadek. type: "date", "word" albo "yesno".
  puzzles: [
    {
      type: "date",
      title: "Początek",
      question: "Pamiętasz ten dzień kiedy pierwszy raz na siebe spojrzeliśmy?",
      answer: "2026-06-28",
      hint: "Kocham grać w bilarda ale ciebie kocham bardziej <3",
      memory: "To był dzień w którym nasze spojrzenia się spotkały aby od tego momentu patrzeć w jednym kierunku.❤️",
      photo: "foto/bilard.png"
    },
    {
      type: "word",
      title: "Miejsce",
      question: "Mimo że ta miłość była od pierwszej wiadomości to gdzie stała się ona oficjalna?",
      answer: "zoo",
      hint: "Koza tosia i osioł robert",
      memory: "Bardzo cieszę się że zadałaś te proste pytanie bo ja nie miałem odwagi",
      photo: "foto/lustro.jpg"
    },
	{
      type: "yesno",
      title: "kto mocniej",
      question: "Czy kocham cię mocniej?",
      answer: "tak",
      hint: "Nie masz wyjścia słońce",
      memory: "Oczywiście żartuje, kochasz mnie tak mocno jak mocno ja kocham ciebie, czyli niewyobrażalnie mocno",
      photo: "foto/koster.jpg"
    },
    {
      type: "word",
      title: "Czas",
      question: "wiesz ile dni jesteśmy już razem?",
      answer: "62",
      hint: "tak na oko to całe wakacje",
      memory: "jest to ponad 5 270 400 s, a każda sekunda przy tobie jest cenniejsza od złota",
      photo: "foto/czarni.jpg"
    },
    {
      type: "word",
      title: "Uśmiech",
      question: "Co jest jedną z rzeczy, które najbardziej uwielbiam w Tobie?",
      answer: "uśmiech",
      hint: "Pojawia się wtedy, kiedy jesteś naprawdę szczęśliwa.",
      memory: "Twój uśmiech potrafi zmienić mój dzień w kilka sekund.",
      photo: "foto/lustro2.jpg"
    },
    {
      type: "yesno",
      title: "Jeszcze więcej",
      question: "Czy chcę przeżyć z Tobą jeszcze mnóstwo takich wspomnień?",
      answer: "tak",
      hint: "Jeśli znasz mnie choć trochę, znasz odpowiedź.",
      memory: "Tak, pamiętaj, że jesteś moją żoną aleto jeszcze nie oficjalne",
      photo: "foto/susi.jpg"
    },
    {
      type: "word",
      title: "Najważniejsze",
      question: "Jedno słowo. Co sprawia, że wszystkie te wspomnienia mają sens?",
      answer: "ty",
      hint: "To odpowiedź, którą mam nadzieję znasz.",
      memory: "Bo wszystkie te daty, miejsca i chwile mają wspólny mianownik. Ciebie.",
      photo: "foto/mc.jpg"
    }
  ],

  finalLetter: `Chciałbym podziękować ci za najpiękniesze 2 miesiące mojego życia. Jakbyś kiedykolwiek kiedyś myślała, że ciebie nie kocham wypisałem kilka powodów za które doceniam że cię mam.

Twój uśmiech, twoje pomysły, twoje poczucie humoru, twoje pasje, twoje plany, twoje oczy, twoje usta, to jaka inteligenta jesteś, to jak się nie poddajesz, twoją zaradność, twoją ambicje, twoje włosy, twoje usta, twoje cycki :D, twój urok, to jaka urocza jesteś, twój styl ubierania się, twoje rysunki, twój smak, twój zapach, twoje ręce i nogi, twoje podejście do życia, czas spędony z tobą, nasze rozmowy, to jak potrafiszmnie zrozumieć, twój apetyt, twoją talie, to jak jaracię sztuka, to jak chcesz dzielić się ze mną swoją pasją.

To jest tylko część powodów bo nie wszystkie jestem w stanie nazwać. masz w sobie coś takiego co daje mi energie do działania i nie mamzamiaru przeżyć ani dnia bez myślenia o tobie. Kocham cię skarbie tak mocno, że wszystkie słowa wszystkich jęcyków świata nie mają dobrego słowa opisującego jak ogromną mocą jest to uczucię.

Szczęśliwych 2 miesięcy. ❤️

Najlepsze w tym wszystkim jest to, że to dopiero początek ❤️❤️❤️
`
};

// ==============================
// Silnik strony — najlepiej nie zmieniaj
// ==============================

const $ = (id) => document.getElementById(id);
let current = 0;
let selectedChoice = null;

$("herName").textContent = CONFIG.herName;
$("introText").textContent = CONFIG.intro;
$("signatureName").textContent = CONFIG.yourName;
$("finalLetter").textContent = CONFIG.finalLetter;

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
  window.scrollTo({top: 0, behavior: "instant"});
}

function updateTopbar() {
  $("counterLabel").textContent = `${Math.min(current, 7)} / 7`;
  $("chapterLabel").textContent = current === 0 ? "NASZA HISTORIA" : `ROZDZIAŁ ${String(current).padStart(2, "0")}`;
}

function normalize(value) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function renderPuzzle(index) {
  const p = CONFIG.puzzles[index];
  selectedChoice = null;
  
  $("checkBtn").onclick = checkAnswer;

  $("quizNumber").textContent = String(index + 1).padStart(2, "0");
  $("quizTitle").textContent = p.title;
  $("quizType").textContent =
    p.type === "date" ? "ZAGADKA / DATA" :
    p.type === "yesno" ? "ZAGADKA / TAK CZY NIE" :
    "ZAGADKA / SŁOWO";

  $("questionText").textContent = p.question;
  $("hintText").textContent = p.hint || "";
  $("feedback").textContent = "";
  $("feedback").className = "feedback";

  const area = $("answerArea");
  area.innerHTML = "";

  if (p.type === "date") {
    area.innerHTML = `<input class="answer-input" id="answerInput" type="date" />`;
  }

  if (p.type === "word") {
    area.innerHTML = `<input class="answer-input" id="answerInput" type="text" autocomplete="off" placeholder="Wpisz odpowiedź..." />`;
  }

  if (p.type === "yesno") {
    area.innerHTML = `
      <div class="choices">
        <button class="choice" data-choice="tak">TAK<small>❤️</small></button>
        <button class="choice" data-choice="nie">NIE<small>🤍</small></button>
      </div>`;
    area.querySelectorAll(".choice").forEach(btn => {
      btn.addEventListener("click", () => {
        selectedChoice = btn.dataset.choice;
        area.querySelectorAll(".choice").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
      });
    });
  }

  if (p.photo) {
    $("memoryPhoto").style.backgroundImage = `url("${p.photo}")`;
    $("memoryPhoto").style.backgroundSize = "cover";
    $("memoryPhoto").style.backgroundPosition = "center";
    $("memoryPhoto").innerHTML = "";
  } else {
    $("memoryPhoto").style.backgroundImage = "";
    $("memoryPhoto").innerHTML = "<span>WASZE<br>WSPOMNIENIE</span>";
  }

  $("memoryText").textContent = p.memory || "";
  $("memoryCard").classList.add("hidden");

  const input = $("answerInput");
  if (input) {
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") checkAnswer();
    });
    setTimeout(() => input.focus({preventScroll: true}), 250);
  }

  updateTopbar();
}

function checkAnswer() {
  const p = CONFIG.puzzles[current - 1];
  let userAnswer = selectedChoice;

  if (p.type !== "yesno") {
    const input = $("answerInput");
    userAnswer = input ? input.value : "";
  }

  const correct = normalize(userAnswer) === normalize(p.answer);

  if (!userAnswer) {
    showFeedback("Najpierw odpowiedz. ❤️", false);
    return;
  }

  if (!correct) {
    showFeedback("Jeszcze raz… czuję, że znasz tę odpowiedź. ❤️", false);
    return;
  }

  showFeedback("Dobrze. Właśnie o to mi chodziło. ❤️", true);
  $("memoryCard").classList.remove("hidden");

  $("checkBtn").textContent = current < 7 ? "NASTĘPNE WSPOMNIENIE  →" : "ZAKOŃCZ HISTORIĘ  →";
  $("checkBtn").onclick = nextStep;
}

function showFeedback(text, good) {
  const f = $("feedback");
  f.textContent = text;
  f.className = "feedback " + (good ? "good" : "bad");
}

function nextStep() {
  if (current >= 7) {
    showScreen("finalScreen");
    updateTopbar();
    return;
  }
  current++;
  renderPuzzle(current - 1);
  showScreen("quizScreen");
}

$("startBtn").addEventListener("click", () => {
  current = 1;
  renderPuzzle(0);
  showScreen("quizScreen");
});



$("finalBtn").addEventListener("click", () => {
  const value = $("finalAnswer").value.trim();
  const feedback = $("finalFeedback");

  // Celowo akceptujemy dowolną liczbę — odpowiedź i tak prowadzi do finału.
  if (!value) {
    feedback.textContent = "Wpisz swoją odpowiedź. ❤️";
    feedback.className = "feedback bad";
    return;
  }

  feedback.textContent = "Dokładnie. Nie ma takiej liczby. ❤️";
  feedback.className = "feedback good";
  $("loveLetter").classList.remove("hidden");
  $("finalBtn").style.display = "none";
  $("finalAnswer").style.display = "none";
});

updateTopbar();
