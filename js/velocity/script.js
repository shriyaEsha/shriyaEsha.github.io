/*****************
   Known Issues
*****************/ 

/* Demos that use transforms do not work on <=IE9. */
/* Code previews lose their linebreaks in <=IE8. */
/* Code coloring causes a stack overflow in <=IE7. */

/*************
    Global
*************/ 

/* Remove the 300ms tap delay on mobile devices. */
$(window).load(function () {
    FastClick.attach(document.body);
});

/* Force all non-hash links to open in a new tab. */
$("#main a").filter(function() { return !/^#/.test($(this).attr("href")); }).attr("target", "_blank")

/* Page bottom/top jumping. */
$("#nav").on("click", function () {
    if (document.body.scrollTop === 0) {
        window.scrollTo(0, document.body.scrollHeight);
    } else {
        window.scrollTo(0, 0);
    }
});

/* Highlight code samples.*/
$.each($("#data code"), function() {
    var $this = $(this);

    Rainbow.color($this.html().replace(/\[tab\]/g, "&nbsp;&nbsp;&nbsp;&nbsp;"), $this.attr("data-rainbow-language"), function (htmlHighlighted) {
        $this.html($.trim(htmlHighlighted).replace(/\n+/g, "<br />"));
    });
});

/* Code Viewer controls. */
var $codeViewer = $("#codeViewer");
$(".codeViewerOpen").on("click", function () {
    var $codeViewerCode = $("#codeViewerCode");

    $codeViewerCode.html("Loading source in real-time... This may take a moment...");
    $codeViewer.fadeIn(200);

    /* Code Viewer source loading. */
    $.ajax({
            type: "get",
            url: $(this).attr("data-script"),
            dataType: "text"
        })
        .done(function (data) {
            Rainbow.color(data, "javascript", function (codeHighlighted) {
                $codeViewerCode
                .velocity({ opacity: 0 }, function() {
                	$codeViewerCode.html(codeHighlighted);
                })
                .velocity({ opacity: 1 });
            });
        });
});

$("#codeViewer").on("click", "#codeViewerClose", function () {
    window.scrollTo(0, 0);

    $("#codeViewer").fadeOut(200);
});

$("body").on("keydown", function (event) {
    if (event.keyCode === 27) {
        $("#codeViewerClose").trigger("click");
    }
});