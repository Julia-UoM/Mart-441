// CLASS
class Slide {
  constructor(title, image, description, author, year) {
    this.title = title;
    this.image = image;
    this.description = description;
    this.author = author;
    this.year = year;
  }
}

// OBJECTS

let slide1 = new Slide(
  "Dropping a Han Dynasty Urn",
  "images/slide1.jpg",
  "This photograph shows Ai Weiwei dropping and shattering a 2,000-year-old ceremonial urn. The work questions how societies value tradition, history, and cultural authority. By destroying an ancient object, Ai challenges the idea that history must always be preserved rather than questioned.",
  "Ai Weiwei",
  "1995"
);

let slide2 = new Slide(
  "Sunflower Seeds",
  "images/slide2.jpg",
  "This installation consists of millions of hand-painted porcelain sunflower seeds made by artisans in China. From a distance they appear identical, but each one is unique. The work reflects on mass production, collective labor, and individuality within large political systems.",
  "Ai Weiwei",
  "2010"
);

let slide3 = new Slide(
  "American Gothic, Washington D.C.",
  "images/slide3.jpg",
  "This photograph shows Ella Watson, a government cleaning worker standing in front of an American flag while holding a mop and broom. Gordon Parks created the image to highlight racial inequality in the United States. It critiques the gap between American ideals and the reality of segregation.",
  "Gordon Parks",
  "1942"
);

let slide4 = new Slide(
  "Atomic Bomb Damage – Wristwatch Stopped at 11:02",
  "images/slide4.jpg",
  "This photograph shows a wristwatch damaged by the atomic bombing of Nagasaki, frozen at the exact moment the explosion occurred. The image turns an ordinary object into a symbol of the human cost of nuclear warfare. It reminds viewers how war affects everyday lives and historical memory.",
  "Shomei Tomatsu",
  "approx. 1961 (object from 1945)"
);

let slide5 = new Slide(
  "Myth of Tomorrow",
  "images/slide5.jpg",
  "This large mural depicts a skeleton exploding from a nuclear blast. Okamoto created the work during the Cold War as a warning about nuclear weapons and technological destruction. The mural encourages viewers to reflect on the consequences of nuclear warfare and technological power.",
  "Taro Okamoto",
  "1968"
);

// ARRAY
let slides = [slide1, slide2, slide3, slide4, slide5];

// DOM ELEMENTS
let slideImage = document.getElementById("slideImage");
let slideTitle = document.getElementById("slideTitle");
let slideDescription = document.getElementById("slideDescription");
let slideAuthor = document.getElementById("slideAuthor");
let slideYear = document.getElementById("slideYear");
let nextButton = document.getElementById("nextButton");

let lastIndex = -1;

// FUNCTION TO SHOW RANDOM SLIDE
let currentIndex;

// Show random slide on page load
function showRandomStart() {

  currentIndex = Math.floor(Math.random() * slides.length);

  displaySlide(currentIndex);
}

// Function to display a slide
function displaySlide(index) {

  let slide = slides[index];

  slideImage.src = slide.image;
  slideTitle.textContent = slide.title;
  slideDescription.textContent = slide.description;
  slideAuthor.textContent = slide.author;
  slideYear.textContent = slide.year;
}

// Button moves to next slide in order
function nextSlide() {

  currentIndex++;

  if (currentIndex >= slides.length) {
    currentIndex = 0;
  }

  displaySlide(currentIndex);
}

// Random slide when page loads
showRandomStart();

// Button click
nextButton.addEventListener("click", nextSlide);

