/*******************************
   Performance Comparison #1
*******************************/

/*************
   Defaults
*************/

var isWebkit = /Webkit/i.test(navigator.userAgent),
    isChrome = /Chrome/i.test(navigator.userAgent),
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isAndroid = /Android/i.test(navigator.userAgent);

/* Set the selected element count based on device type. */
var defaultPerformanceCount = isMobile ? 10 : (isChrome ? 150 : 100);

$("#dataBody-PerformanceSelCount option[value='" + defaultPerformanceCount + "']").prop("selected", true);

/***********************
   Element Generation   
***********************/

var $performanceStage = $("#dataBody-PerformanceStage"),
    performanceStageHtml = "",
    $performanceStageDummies,
    dummiesCount = 350;

for (var i = 0; i < dummiesCount; i++) {
    performanceStageHtml += "<div class='dataBody-PerformanceDummy'></div>";
}

$performanceStageDummies = $(performanceStageHtml);

/* On mobile devices, we force hardware acceleration using a null transform hack.
   This levels the playing field across libraries since Transit inherently uses HA and Velocity turns it on for mobile devices. */
if (isMobile) {
    $performanceStageDummies.css("transform", "translateZ(0px)");
}

$performanceStageDummies.appendTo($performanceStage);

/*************************
   Animation Properties     
*************************/

var animateMapForward = {
        left: "85%",
        opacity: 1
    },
    animateMapReverse = {
        left: 0,
        /* We only bring opacity down to 0.65 since 0 results in the elements being transparent for the majority of the animation, making it difficult to judge framerate and other performance indicators. */
        opacity: 0.65
    },
    animateOptions = {
        duration: 850,
        easing: "easeInOutSine",
        mobileHA: true
    };

/* For reference, the elements' CSS properties (which are defined in main.css):
    .dataBody-PerformanceDummy {
        display: none;
        position: relative;

        left: 0;

        opacity: 0.65;
        filter: alpha(opacity=65);

        width: 15px;
        height: 15px;
        margin-bottom: 3px;

        border-radius: 15px;
        background-color: $textColor;
    }
*/

/*****************
   Start Button   
*****************/

var HAAlerted1 = false;

var $performanceSlowNotice = $("#performance-SlowNotice"),
    $performanceSelLibrary = $("#dataBody-PerformanceSelLibrary"),
    $performanceSelCount = $("#dataBody-PerformanceSelCount");

$("#dataBody-Performance1BtnStart").on("click", function() {
    if (isMobile && !HAAlerted1) {
        HAAlerted1 = true;

        alert("Since Velocity automatically turns on hardware acceleration for mobile devices, hardware acceleration has been enabled for *all* libraries so that you can compare them on equal grounds.");
    }

    $performanceSlowNotice.show()
    
    var performanceLibrary = $performanceSelLibrary.val(),
        /* Default to the second-lowest element count if none is selected. */
        performanceCount = $performanceSelCount.val() || $("#dataBody-PerformanceSelCount option").eq(2).val();

    var $performanceStageDummiesSlice;

    /* Loop the elements back and forth four times. */
    var loopCount = 4;

    /* Only proceed if a library has been selected. */
    if (performanceLibrary) {
        /* With the $performanceStageDummies object that we've already appended to the DOM, slice off a portion equal to the chosen element count and show them. */
        $performanceStageDummiesSlice = $performanceStageDummies.slice(0, performanceCount);    
        $performanceStageDummiesSlice
            .css("opacity", 0.65)
            .show();

        for (var i = 0; i < loopCount; i++) {

            /****************
                Animation     
            ****************/

            /* Although Velocity is more performant when an entire element set is passed in -- as opposed to one element at a time -- this optimization is forsaken
               (plus jQuery overhead is incurred) because Transit is incapable of queueing up animations on an element set. So, we take a performance hit to allow Transit to be included in these tests. */
            $performanceStageDummiesSlice.each(function() {
                /* Animate backward and forward using the chosen library. */
                $(this)
                    [performanceLibrary](animateMapForward, animateOptions)
                    [performanceLibrary](animateMapReverse, animateOptions)
            });

            /****************
                Teardown     
            ****************/

            /* If we've reached the final loop, fade out the elements. */
            if (i === (loopCount - 1)) {
                $performanceStageDummiesSlice
                    .delay(175)
                    [performanceLibrary]({ opacity: 0 }, function() {
                        $performanceStageDummiesSlice.hide()
                    });
            }
        }
    }
});