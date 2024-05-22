$(document).ready(function () {
    $('.navbar-toggler').click(function () {
        $('.toggle-menu-icon').toggleClass('open');
    })
    $(".nav-link").click(function () {
        if (!$(this).hasClass('active')) {
            $(".nav-link.active").removeClass("active");
            $(this).addClass("active");
        }
    });
    // $(document).on("click", function (event) {
    //     var $trigger = $(".navbar-toggler");
    //     if ($trigger !== event.target && !$trigger.has(event.target).length) {
    //         $("#navbar-right").removeClass("show");
    //         $('.toggle-menu-icon').toggleClass('open');

    //     }
    // });
});