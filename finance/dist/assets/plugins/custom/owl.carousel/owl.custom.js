jQuery(document).ready(function ($) {
    //owl carousel
    $('.owl-carousel').owlCarousel({
        margin: 10,
        responsiveClass: true,
        responsive: {
            0: {
                items: 2,
                nav: true,
                loop: false,
            },
            480: {
                items: 4,
                nav: false,
                loop: false
            },
            700: {
                items: 8,
                nav: false,
                loop: false
            },
            1000: {
                items: 12,
                nav: false,
                loop: false
            },
            1100: {
                items: 12,
                nav: false,
                loop: false
            }
        }
    });
});