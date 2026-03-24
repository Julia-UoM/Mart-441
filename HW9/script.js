$(document).ready(function () {

  // IMAGE ARRAY
  let images = [
    "imgs/img1.jpg",
    "imgs/img2.jpg",
    "imgs/img3.jpg",
    "imgs/img4.jpg",
    "imgs/img5.jpg",
    "imgs/img6.jpg",
    "imgs/img7.jpg",
    "imgs/img8.jpg",
    "imgs/img9.jpg",
    "imgs/img10.jpg"
  ];

  // TEXT ARRAY
  let phrases = [
    "Return to center.",
    "Breathe into what you feel.",
    "Rest is sacred",
    "Balance is something you practice.",
    "You are allowed to move slowly.",
    "Protect your peace.",
    "Care for the body you live in.",
    "Connection is part of healing.",
    "Let the mind soften.",
    "There is wisdom in stillness."
  ];

  // SHAPE ARRAY
  let shapes = [
    {
      width: "140px",
      height: "140px",
      background: "#d6c2a1",
      borderRadius: "50%",
      borderLeft: "",
      borderRight: "",
      borderBottom: ""
    },
    {
      width: "170px",
      height: "170px",
      background: "#b8d8d8",
      borderRadius: "0%",
      borderLeft: "",
      borderRight: "",
      borderBottom: ""
    },
    {
      width: "120px",
      height: "120px",
      background: "#c7b5d6",
      borderRadius: "30%",
      borderLeft: "",
      borderRight: "",
      borderBottom: ""
    },
    {
      width: "0",
      height: "0",
      background: "transparent",
      borderRadius: "0%",
      borderLeft: "75px solid transparent",
      borderRight: "75px solid transparent",
      borderBottom: "130px solid #e3b7a0"
    }
  ];

  let imageIndex = 0;
  let textIndex = 0;
  let shapeIndex = 0;

  // IMAGE SYSTEM
  function cycleImage() {
    $("#artImage").fadeOut(1000, function () {
      imageIndex++;
      if (imageIndex >= images.length) {
        imageIndex = 0;
      }

      $(this).attr("src", images[imageIndex]);

      let randomTop = Math.floor(Math.random() * 220) + 100;
      let randomLeft = Math.floor(Math.random() * 450) + 60;

      $(this)
        .css({
          top: randomTop + "px",
          left: randomLeft + "px"
        })
        .fadeIn(1200)
        .animate({
          left: "+=60"
        }, 2200);
    });
  }

  // TEXT SYSTEM
  function cycleText() {
    textIndex++;
    if (textIndex >= phrases.length) {
      textIndex = 0;
    }

    $("#textBox").fadeOut(500, function () {
      $(this).text(phrases[textIndex]).fadeIn(700);
    });

    let randomTop = Math.floor(Math.random() * 180) + 360;
    let randomLeft = Math.floor(Math.random() * 500) + 50;

    $("#textBox").animate({
      top: randomTop + "px",
      left: randomLeft + "px"
    }, 2200);
  }

  // SHAPE SYSTEM
  function cycleShape() {
    shapeIndex++;
    if (shapeIndex >= shapes.length) {
      shapeIndex = 0;
    }

    $("#shape").css({
      width: "",
      height: "",
      background: "",
      borderRadius: "",
      borderLeft: "",
      borderRight: "",
      borderBottom: ""
    });

    $("#shape").css(shapes[shapeIndex]);

    let randomTop = Math.floor(Math.random() * 250) + 120;
    let randomLeft = Math.floor(Math.random() * 450) + 520;

    $("#shape").animate({
      top: randomTop + "px",
      left: randomLeft + "px"
    }, 2200);
  }

  setInterval(cycleImage, 6000);
  setInterval(cycleText, 6000);
  setInterval(cycleShape, 6000);

});