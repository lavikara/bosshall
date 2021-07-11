$(document).ready(function () {
    $('.intro-pics').on('beforeChange', function (event, slick, direction) {
        // set index number for display
        let index = $('.intro-pics').slick('slickCurrentSlide') + 1;
        $('#pics-count').text(`${index} / 2`);
    })
        .slick({
            slidesToShow: 1,
            focusOnSelect: true,
            arrows: true,
            autoplay: true,
            autoplaySpeed: 2000,
            pauseOnHover: false,
            responsive: [
                {
                    breakpoint: '768', // and below. i.e max-width, unless mobileFirst option is set
                    settings: {
                        pauseOnHover: true
                    }
                }
            ],
            appendArrows: '#pics-append-arrows',
            prevArrow: `
                    <svg class="svg-icon">
                        <use xlink:href="#arrow-left"></use>
                    </svg>
                    `,
            nextArrow: `
                    <svg class="svg-icon">
                        <use xlink:href="#arrow-right"></use>
                    </svg>
                    `,
        });

    $('.intro-vids').on('swipe', function (event, slick, direction) {
        let index = $('.intro-vids').slick('slickCurrentSlide') + 1;
        $('#vids-count').text(`${index} / 3`);
    })
        .slick({
            centerMode: true,
            centerPadding: '6rem', // corresponds to $page-padding in variables.scss
            slidesToShow: 1,
            focusOnSelect: true,
            arrows: true,
            responsive: [
                {
                    breakpoint: 1024, // and below. i.e max-width, unless mobileFirst option is set
                    settings: {
                        centerPadding: '3em',
                    }
                }
            ],
            appendArrows: '#vids-append-arrows',
            prevArrow: `
                    <svg class="svg-icon">
                        <use xlink:href="#arrow-left"></use>
                    </svg>
                    `,
            nextArrow: `
                    <svg class="svg-icon">
                        <use xlink:href="#arrow-right"></use>
                    </svg>
                    `,
        });
});