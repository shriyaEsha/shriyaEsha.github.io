/**************
    Support
**************/

var $propertiesProperty = $("#dataBody-PropertiesSelProperty"),
	$propertiesValue = $("#dataBody-PropertiesSelValue"),
	$propertiesDummy = $("#dataBody-PropertiesDummy");

/* Whenever a new property is selected, reset the value select box. */
$propertiesProperty.on("change", function () {
	$propertiesValue.prop("selectedIndex", 0);
});

$propertiesValue.on("change", function (event, test) {
	var value = $propertiesValue.val(),
		property = $propertiesProperty.val(),
		/* Properties that look good with the "spring" easing trigger "spring" via a data-spring attribute. */
		easing = $propertiesProperty.find(":selected").attr("data-spring") ? "spring" : "easeInOutSine",
		/* Spring is animated a bit slower for a better visual feel. */
		duration = test ? 500 : ((easing === "spring") ? 750 : 500);
		
	/* Reset the value -- otherwise, it cannot be immediately animated to again since animations are triggered upon selection. */
	$propertiesValue.prop("selectedIndex", 0);

	if (property !== "" && value !== "") {
		var animateMap = {},
			animateOptions = {
				easing: easing,
				duration: duration
			};

		animateMap[property] = value;

		$propertiesDummy
			.queue(function() {
				if (test) {
					/* If this animation is part of testing, display the current property and value combination being animated. */
					$propertiesDummy.html(test + ": " + value);
				}
			
				$propertiesDummy.dequeue();
			})
			.velocity(animateMap, animateOptions)
			.delay(250)
			.velocity("reverse", function() {
				if (/textShadow/i.test(property)) {
					/* Text-shadows of 0px in size still create a slight fuzzy blur around letters. So, when it's done being reversed, we remove the text-shadow entirely. */
					$propertiesDummy.css("textShadow", "none");
				}
			});
	}
});

/***************
    Testing
***************/

if (window.location.hash === "#propertiesTest") {
	/* Make border, outline, and box-shadow easily visible so that their color tweens can be seen. */
	$propertiesDummy.css({
		border: "5px solid rgb(75, 75, 75)",
		outline: "5px solid rgb(50, 50, 50)",
		boxShadow: "0px 0px 30px 0px rgb(25, 25, 25)"
	});

	var $properties = $("#dataBody-PropertiesSelProperty option"),
		$values = $("#dataBody-PropertiesSelValue option"),
		propertyOffset = 5,
		valueOffset = 0;

	/* Test each property that has a data-test attribute. */
	/* Todo: Allow property and value offsets to be set via the URL hash. At the moment, they must be manually set in this script. */
	$.each($properties.slice(propertyOffset), function(i, option) {
		var $this = $(this),
			tested = $this.attr("data-test"),
			propertyName = $this.val();

		if ($(this).attr("data-test")) {
			var currentProperty = propertyOffset + i;

			$propertiesProperty.prop("selectedIndex", currentProperty);

			$.each($values.slice(valueOffset), function(j, option) {
				var currentValue = valueOffset + j;

				if ($(this).attr("data-test")) {
					$propertiesValue.prop("selectedIndex", currentValue);
					$propertiesValue.trigger("change", propertyName);
				}
			});
		}
	});
}