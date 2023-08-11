export default {
  data() {
    return {
      swiperOption: {
        slidesPerView: 'auto',
        spaceBetween: 10,
        loop: false,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
    }
  }
}
