$(document).ready(function () {

  // custom jQuery plugin
  $.fn.prettyCard = function () {
    return this.each(function () {
      $(this).css({
        "padding": "18px",
        "border": "1px solid #e3d5db",
        "box-shadow": "0px 4px 12px rgba(150, 120, 130, 0.15)"
      });

      $(this).hover(
        function () {
          $(this).css("background", "#fdf6f9");
        },
        function () {
          $(this).css("background", "#fffdfc");
        }
      );
    });
  };

  // AJAX call using jQuery
  $.ajax({
    url: "poses.json",
    dataType: "json",
    success: function (data) {

      // loop through JSON data
      $.each(data, function (index, pose) {

        let card = `
          <div class="poseCard">
            <h2>${pose.name}</h2>
            <p><strong>Type:</strong> ${pose.type}</p>
            <p><strong>Benefit:</strong> ${pose.benefit}</p>
            <p><strong>Difficulty:</strong> ${pose.difficulty}</p>
          </div>
        `;

        $("#poseContainer").append(card);
      });

      // apply plugin + fade in animation
      $(".poseCard").prettyCard().hide().fadeIn(1200);
    },

    error: function () {
      console.log("Error loading JSON file.");
    }
  });

});
