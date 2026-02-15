// ------ State ------
let energy = 3;
let detail = "none";
let stepCount = 0;
let currentNode = "start";
let awaitingRestart = false;

// ------ DOM -----
const storyTextEl = document.getElementById("storyText");
const optionsLineEl = document.getElementById("optionsLine");
const hintTextEl = document.getElementById("hintText");
const sceneImageEl = document.getElementById("sceneImage");
const energyValueEl = document.getElementById("energyValue");
const detailValueEl = document.getElementById("detailValue");
const stepValueEl = document.getElementById("stepValue");

const userInputEl = document.getElementById("userInput");
const submitBtn = document.getElementById("submitBtn");
const restartBtn = document.getElementById("restartBtn");

// -------- Story Data --------
const nodes = {
  start: {
    text: "You stand still longer than you meant to. The light has changed, but the room hasn’t.",
    img: "images/window.jpg",
    theme: "calm",
    options: ["window", "mirror", "kitchen", "outside", "pause"]
  },

  window: {
    text: "Outside feels close and unreachable at the same time. You try to remember what time it is.",
    img: "images/window.jpg",
    theme: "dawn",
    options: ["pause", "outside", "mirror", "start"],
    onEnter: () => { energy = energy - 1; }
  },

  mirror: {
    text: "The mirror gives you back a version of you that looks slightly delayed.",
    img: "images/mirror.jpg",
    theme: "storm",
    options: ["note", "start", "window"]
  },

  note: {
    text: "You decide to keep one detail: the angle of the light, the way your face holds still.",
    img: "images/mirror.jpg",
    theme: "storm",
    options: ["window", "kitchen", "start"],
    onEnter: () => { detail = "a small note"; }
  },

  kitchen: {
    text: "The kitchen light feels too honest. It shows everything exactly as it is.",
    img: "images/kitchen.jpg",
    theme: "calm",
    options: ["rest", "start", "mirror"]
  },

  rest: {
    text: "You pause long enough to feel your shoulders drop. Nothing changes, but something eases.",
    img: "images/night.jpg",
    theme: "night",
    options: ["start", "window", "outside"],
    onEnter: () => { energy = energy + 1; }
  },

  pause: {
    text: "You let the moment stay unfinished. You don’t need an explanation.",
    img: "images/dawn.jpg",
    theme: "dawn",
    options: ["outside", "end", "start"]
  },

  outside: {
    text: "Outside, the ground becomes the first thing you notice. Cracks, shadows, your footsteps.",
    img: "images/sidewalk.jpg",
    theme: "dawn",
    options: ["walk", "start", "end"],
    onEnter: () => { energy = energy - 1; }
  },

  walk: {
    text: "You keep walking. Not to arrive somewhere—just to let the day become real.",
    img: "images/dawn.jpg",
    theme: "dawn",
    options: ["end", "start"]
  },

  end: {
    text: "Nothing dramatic happens. But something settles. Want to start again? (type: yes or no)",
    img: "images/dawn.jpg",
    theme: "dawn",
    options: ["yes", "no"]
  }
};

// ---- Functions ------
function normalizeChoice(rawText) {
  // returns a value (required)
  return rawText.trim().toLowerCase();
}

function setTheme(themeName) {
  document.body.classList.remove("theme-calm", "theme-storm", "theme-dawn", "theme-night");
  document.body.classList.add(`theme-${themeName}`);
}

function updateStatus() {
  energyValueEl.textContent = energy;
  detailValueEl.textContent = detail;
  stepValueEl.textContent = stepCount;
}

function formatOptions(optionsArray) {
  // uses a loop (required)
  let output = "Options: ";
  for (let i = 0; i < optionsArray.length; i++) {
    output += optionsArray[i];
    if (i < optionsArray.length - 1) output += " · ";
  }
  return output;
}

function renderNode(nodeKey) {
  const node = nodes[nodeKey];
  currentNode = nodeKey;

  stepCount = stepCount + 1; // addition (required)

  // run node effects
  if (typeof node.onEnter === "function") node.onEnter();

  // update DOM (required)
  storyTextEl.textContent = node.text + " — step count: " + stepCount; // concatenation
  sceneImageEl.src = node.img;
  setTheme(node.theme);

  optionsLineEl.textContent = formatOptions(node.options);
  hintTextEl.textContent = "Tip: please type the option words exactly as shown.";

  updateStatus();

  // end-state helper
  awaitingRestart = (nodeKey === "end");

  // energy check (if statements required)
  if (energy <= 0) {
    storyTextEl.textContent =
      "You’re out of energy. The page goes quiet. Type 'restart' to begin again — step count: " + stepCount;
    optionsLineEl.textContent = "Options: restart";
    hintTextEl.textContent = "";
  }

  userInputEl.value = "";
  userInputEl.focus();
}

function restart() {
  energy = 3;
  detail = "none";
  stepCount = 0;
  awaitingRestart = false;
  renderNode("start");
}

// -------- Input Handler --------
function handleInput() {
  const choice = normalizeChoice(userInputEl.value);

  // Allow restart anytime
  if (choice === "restart") {
    restart();
    return;
  }

  // If energy is gone, only restart is allowed
  if (energy <= 0) {
    hintTextEl.textContent = "Type 'restart' to begin again.";
    return;
  }

  // If at end, ask restart question
  if (awaitingRestart) {
    if (choice === "yes") {
      restart();
      return;
    }
    if (choice === "no") {
      storyTextEl.textContent = "Okay. You can close the page, or type 'restart' anytime.";
      optionsLineEl.textContent = "Options: restart";
      hintTextEl.textContent = "";
      return;
    }
    hintTextEl.textContent = "Type 'yes' or 'no'.";
    return;
  }

  // Validate choice is one of the current node's options
  const node = nodes[currentNode];
  const isValid = node.options.includes(choice); // decision logic

  if (!isValid) {
    hintTextEl.textContent = "Not one of the options. Type exactly: " + node.options.join(", ");
    return;
  }

  // Control structure: switch (required)
  switch (choice) {
    case "start":
      renderNode("start");
      break;
    case "window":
      renderNode("window");
      break;
    case "mirror":
      renderNode("mirror");
      break;
    case "note":
      renderNode("note");
      break;
    case "kitchen":
      renderNode("kitchen");
      break;
    case "rest":
      renderNode("rest");
      break;
    case "pause":
      renderNode("pause");
      break;
    case "outside":
      renderNode("outside");
      break;
    case "walk":
      renderNode("walk");
      break;
    case "end":
      renderNode("end");
      break;
    default:
      // fallback (shouldn't happen because we validate)
      hintTextEl.textContent = "Try one of the listed options.";
  }
}

// ---------- Events ----------
submitBtn.addEventListener("click", handleInput);
userInputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleInput();
});
restartBtn.addEventListener("click", restart);

// ---------- Start ----------
renderNode("start");
