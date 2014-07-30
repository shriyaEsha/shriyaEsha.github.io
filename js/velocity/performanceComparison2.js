/*******************************
   Performance Comparison #2
*******************************/

var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

$("#dataBody-Performance2BtnStart").on("click", function() {
    /* Object references. */
    var $performanceUIIndicator = $("#performanceUIIndicator"),
        $performanceUI = $("#performanceUI"),
        $performanceUIDivs = $("#performanceUI div");

    /* Ensure that GSAP isn't turned on since it overwrites jQuery's native $.animate(). */
    $.gsap.enabled(false);

    /* Indicator preparation. */
    $performanceUIIndicator
        .html("jQuery")
        .velocity({ opacity: 1, colorRed: 200, colorGreen: 0 }, { display: "block", duration: 350 });

    /* Comparison queueing. */
    $.each([ "animate", "velocity" ], function(i, animationLibrary) {
        $performanceUI
            .delay(500)
            /* Animation. Use shorter durations for mobile (since they have smaller screens and we're animating based on %). */
            [animationLibrary]({ bottom: "50%" }, { duration: isMobile ? 1750 : 2000 })
            [animationLibrary]({ bottom: "-50%" }, { duration: isMobile ? 1250 : 1500 })
            /* Indicator updating. */
            .queue(function() {
                if (i === 0) {
                    $performanceUIIndicator
                        .html("Velocity")
                        .velocity({ colorRed: 0, colorGreen: 200 }, 350);
                } else {
                   $performanceUIIndicator.velocity({ opacity: 0 }, { display: "none", duration: 350 });
                }

                $performanceUI.dequeue(); 
            });
    });
});

/* For reference, the dialog box's CSS properties (which are defined in main.css):
#performanceUI {
        position: fixed;

        top: 105%;
        left: 50%;
        width: 26em;
        margin-left: -13.5em;
        padding: 0.5em;

        border: 1px solid #b9b6c0;
        background-color: rgb(249, 249, 249);

        color: #4b4d53;
        font-size: 0.65em;
        line-height: 1.25em;

        div ~ div {
            margin-top: 0.5em;
        }

        #performanceUIClose {
            display: block;
            position: absolute;
            top: 0.4em;
            right: 0.5em;

            color: #5d6069;
            font-size: 0.65em;
            font-weight: bold;
        }

        #performanceUIOkay {
            margin-top: 0.7em;

            text-align: center;
            font-weight: bold;
        }
    }
*/