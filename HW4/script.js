// Variables (required)
let energy = 3;
let trinket = "none";
let stepCount = 0;

// DOM references (required)
const storyTextEl = document.getElementById("storyText");
const choiceButtonsEl = document.getElementById("choiceButtons");
const sceneImageEl = document.getElementById("sceneImage");
const energyValueEl = document.getElementById("energyValue");
const trinketValueEl = document.getElementById("trinketValue");
const restartBtn = document.getElementById("restartBtn");

// Story nodes (photo-driven)
const nodes = {
  start: {
    text: "You stand still longer than you meant to. The light has changed, but the room hasn’t.",
    img: "images/window.jpg",
    theme: "calm",
    choices: [
      { label: "Look out the window.", next: "window" },
      { label: "Check your reflection.", next: "mirror" },
      { label: "Turn on the kitchen light.", next: "kitchen" }
    ]
  },

  window: {
    text: "Outside feels close and unreachable at the same time. You try to remember what time it is.",
    img: "images/window.jpg",
    theme: "dawn",
    choices: [
      { label: "Stay with this view a little longer.", next: "pause" },
      { label: "Step outside.", next: "sidewalk" },
      { label: "Look back at yourself.", next: "mirror" }
    ],
    onEnter: () => { energy = energy - 1; } // subtraction (addition/sub required)
  },

  mirror: {
    text: "The mirror gives you back a version of you that looks slightly delayed.",
    img: "images/mirror.jpg",
    theme: "storm",
    choices: [
      { label: "Make a quiet note of what you see.", next: "note" },
      { label: "Turn away.", next: "start" }
    ]
  },

  note: {
    text: "You decide to keep one detail: the angle of the light, the way your face holds still.",
    img: "images/mirror.jpg",
    theme: "storm",
    choices: [
      { label: "Return to the window.", next: "window" },
      { label: "Go to the kitchen.", next: "kitchen" }
    ],
    onEnter: () => { trinket = "a small note"; } // variable update
  },

  kitchen: {
    text: "The kitchen light feels too honest. It shows everything exactly as it is.",
    img: "images/kitchen.jpg",
    theme: "calm",
    choices: [
      { label: "Drink some water and pause.", next: "rest" },
      { label: "Turn off the light.", next: "start" }
    ]
  },

  rest: {
    text: "You pause long enough to feel your shoulders drop. Nothing changes, but something eases.",
    img: "images/night.jpg",
    theme: "calm",
    choices: [
      { label: "Begin again.", next: "start" },
      { label: "Look out the window once more.", next: "window" }
    ],
    onEnter: () => { energy = energy + 1; } // addition (required)
  },

  pause: {
    text: "You let the moment stay unfinished. You don’t need an explanation—just a frame.",
    img: "images/dawn.jpg",
    theme: "dawn",
    choices: [
      { label: "Step outside.", next: "sidewalk" },
      { label: "End here.", next: "end" }
    ]
  },

  sidewalk: {
    text: "Outside, the ground becomes the first thing you notice. Cracks, shadows, your pace.",
    img: "images/sidewalk.jpg",
    theme: "dawn",
    choices: [
      { label: "Walk until the light changes.", next: "ending" },
      { label: "Go back inside.", next: "start" }
    ],
    onEnter: () => { energy = energy - 1; } // subtraction
  },

  ending: {
    text: "You keep walking. Not to arrive somewhere—just to let the day become real.",
    img: "images/dawn.jpg",
    theme: "dawn",
    choices: [
      { label: "End the story.", next: "end" }
    ]
  },

  end: {
    text: "Nothing dramatic happens. But something settles. You can restart and frame it differently.",
    img: "images/dawn.jpg",
    theme: "dawn",
    choices: []
  }
};

// Functions (required)
function setTheme(themeName) {
  document.body.classList.remove("theme-calm", "theme-storm", "theme-dawn");
  document.body.classList.add(`theme-${themeName}`);
}

function updateStatusLine() {
  energyValueEl.textContent = energy;
  trinketValueEl.textContent = trinket;
}

function makeChoiceButton(label, nextKey) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = label;
  btn.addEventListener("click", () => renderNode(nextKey));
  return btn;
}

function renderNode(nodeKey) {
  const node = nodes[nodeKey];
  stepCount = stepCount + 1; // addition

  // run node effect
  if (typeof node.onEnter === "function") node.onEnter();

  // concatenation (required)
 storyTextEl.textContent = node.text + " — step count: " + stepCount;

  // DOM updates (required)
  sceneImageEl.src = node.img;
  setTheme(node.theme);
  updateStatusLine();

  // rebuild buttons each time (DOM update)
  choiceButtonsEl.innerHTML = "";

  // if statements (required)
  if (energy <= 0) {
    storyTextEl.textContent =
  "You’re out of energy. The page goes quiet. Restart and choose slower paths — step count: " + stepCount;
    restartBtn.classList.remove("hidden");
    return;
  }

  if (node.choices.length === 0) {
    restartBtn.classList.remove("hidden");
    return;
  }

  node.choices.forEach(choice => {
    choiceButtonsEl.appendChild(makeChoiceButton(choice.label, choice.next));
  });

  restartBtn.classList.add("hidden");
}

function restart() {
  energy = 3;
  trinket = "none";
  stepCount = 0;
  renderNode("start");
}

// wire up restart
restartBtn.addEventListener("click", restart);

// start story
renderNode("start");
