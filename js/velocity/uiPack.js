/******************
   Effects Pack
******************/

var $UIPackEffect = $("#dataBody-UIPackSelEffect"),
	$UIPackStagger = $("#dataBody-UIPackSelStagger"),
	$UIPackDrag = $("#dataBody-UIPackSelDrag"),
	$effectPackDummiesContainer = $("#dataBody-UIPackDummiesContainer"),
	$effectPackDummies = $("#dataBody-UIPackDummiesContainer p");

for (var sequenceName in $.Velocity.Sequences) {
	if (!/^slide/.test(sequenceName)) {
		$UIPackEffect.append($("<option value='" + sequenceName + "'>" + sequenceName + "</option>"));
	}
}

$effectPackDummiesContainer.height($effectPackDummiesContainer.height());

$UIPackEffect.add($UIPackStagger).add($UIPackDrag).on("change", function (event) {
	var effect = $UIPackEffect.val(),
		stagger = $UIPackStagger.val(),
		drag = $UIPackDrag.val();

	if (effect !== "") {
		var animateOptions = {
				duration: !/\./.test(effect) ? 1000 : null,
				stagger: stagger,
				drag: drag && /^transition/.test(effect),
				backwards: /Out$/.test(effect)
			};

		if (effect === "fadeIn" || /In$/.test(effect)) {
			$effectPackDummies.velocity({ opacity: 0 }, 100);
		} 

		$effectPackDummies.velocity(effect, animateOptions);

		if (effect === "fadeOut" || /Out$/.test(effect)) {
			$effectPackDummies.velocity({ opacity: 1 }, { display: "block" });
		} 
	}
});