// =======================
// Initialize Slick Carousel
// =======================
import $ from 'jquery'
window.$ = window.jQuery = $

import AOS from 'aos'
import 'aos/dist/aos.css'
/*-----------------------------------------------------------------------------------

    Template Name: Blesso - Crowdfunding & Charity HTML Template



    Note: This is Custom Js file

-----------------------------------------------------------------------------------

    Js INDEX

    ===================

    ## reviews-slider

    ## hero-one-slider

    ## prayers-slider

    ## v-slide

    ## sponsors-slider

    ## slider-church-prayers

    ## hero-three-slider

    ## Slider-Causes-Of-Church

    ## Counter

    ## Tilt on hover

    ## Animation on scroll

    ## C-slide

    ## pd-gallery

    ## Loader

    ## Cart Popup

    ## Scroll top

    ## Donation Amount Select On Click

    ## Sermon Media

    ## Responsive header menu

    ## Audio Player



-----------------------------------------------------------------------------------*/

// TinyMCE
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver'

import 'tinymce/plugins/autolink'
import 'tinymce/plugins/advlist'

import 'tinymce/plugins/lists'
import 'tinymce/plugins/link'
import 'tinymce/plugins/image'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/code'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/help'
import 'tinymce/plugins/visualchars'

import 'tinymce/icons/default/icons'
import 'tinymce/models/dom'
import 'tinymce/plugins/help/js/i18n/keynav/en'
import 'tinymce/skins/ui/oxide/skin'
import 'tinymce/skins/ui/oxide/content'
import 'tinymce/skins/content/default/content'

tinymce.init({
  selector: 'textarea.editor',
  plugins: [
    'advlist',
    'autolink',
    'lists',
    'link',
    'image',
    'charmap',
    'preview',
    'anchor',
    'searchreplace',
    'visualblocks',
    'code',
    'fullscreen',
    'insertdatetime',
    'media',
    'table',
    'help',
    'wordcount',
    'visualchars',
  ],

  toolbar:
    'undo redo | formatselect | ' +
    'bold italic backcolor | alignleft aligncenter ' +
    'alignright alignjustify | bullist numlist outdent indent | ' +
    'removeformat | image | help',
  // Enable advanced image tools
  image_advtab: true,
  list_indent_on_tab: true, // Allow using Tab key to indent lists
  // Configure image style options
  style_formats: [
    {
      title: 'Headings',
      items: [
        { title: 'Heading 1', format: 'h1' },
        { title: 'Heading 2', format: 'h2' },
        { title: 'Heading 3', format: 'h3' },
        { title: 'Heading 4', format: 'h4' },
        { title: 'Heading 5', format: 'h5' },
        { title: 'Heading 6', format: 'h6' },
      ],
    },
    {
      title: 'Inline',
      items: [
        { title: 'Bold', format: 'bold' },
        { title: 'Italic', format: 'italic' },
        { title: 'Underline', format: 'underline' },
        { title: 'Strikethrough', format: 'strikethrough' },
        { title: 'Superscript', format: 'superscript' },
        { title: 'Subscript', format: 'subscript' },
        { title: 'Code', format: 'code' },
      ],
    },
    {
      title: 'Blocks',
      items: [
        { title: 'Paragraph', format: 'p' },
        { title: 'Blockquote', format: 'blockquote' },
        { title: 'Div', format: 'div' },
        { title: 'Pre', format: 'pre' },
      ],
    },
    {
      title: 'Align',
      items: [
        { title: 'Left', format: 'alignleft' },
        { title: 'Center', format: 'aligncenter' },
        { title: 'Right', format: 'alignright' },
        { title: 'Justify', format: 'alignjustify' },
      ],
    },
    {
      title: 'Image Styles',
      items: [
        {
          title: 'Left Aligned',
          selector: ['img', 'p'],
          styles: {
            'float': 'left',
            'margin': '0 10px 0 0',
            'max-width': '100%',
            'clear': 'both',
          },
        },
        {
          title: 'Right Aligned',
          selector: ['img', 'p'],
          styles: {
            'float': 'right',
            'margin': '0 0 0 10px',
            'max-width': '100%',
            'clear': 'both',
          },
        },
        {
          title: 'Default Aligned',
          selector: ['img', 'div', 'p'],
          styles: {
            'float': 'none',
            'margin': '0',
            'max-width': '100%',
          },
        },
      ],
    },
  ],
  // basic style for content
  content_style: `
    img {
      max-width: 100% !important;
      height: auto !important;
    }
  `,
  // setting image upload
  images_upload_handler: function (blobInfo, progress) {
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append('file', blobInfo.blob(), blobInfo.filename())
      const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

      fetch('/admin/files/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRF-TOKEN': csrfToken,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.location) {
            resolve(result.location)
          } else if (result.url) {
            resolve(result.url)
          } else {
            reject('upload failed: invalid response format')
          }
        })
        .catch((error) => {
          reject('upload failed: ' + error)
        })
    })
  },
})

jQuery(document).ready(function ($) {
  'use strict'

  if ($('.reviews-slider')[0]) {
    $('.reviews-slider').slick({
      slidesToShow: 1,

      slidesToScroll: 1,

      arrows: false,

      dots: true,

      cssEase: 'linear',
    })
  }

  if ($('.hero-one-slider')[0]) {
    $('.hero-one-slider').slick({
      slidesToShow: 1,

      slidesToScroll: 1,

      arrows: true,

      dots: false,

      cssEase: 'linear',
    })
  }

  if ($('.prayers-slider')[0]) {
    $('.prayers-slider').slick({
      slidesToShow: 1,

      slidesToScroll: 1,

      arrows: false,

      fade: true,

      dots: true,

      cssEase: 'linear',
      autoplay: true,

      autoplaySpeed: 3000,

      speed: 1000,
    })
  }
  if ($('.events-carousal-slider')[0]) {
    $('.events-carousal-slider').slick({
      slidesToShow: 4,

      slidesToScroll: 3,

      arrows: false,

      dots: false,

      centerMode: true,

      infinite: true,

      cssEase: 'linear',

      draggable: true,

      autoplay: true,

      autoplaySpeed: 1000,

      speed: 1000,

      responsive: [
        {
          breakpoint: 1500,

          settings: {
            slidesToShow: 4,

            slidesToScroll: 4,
          },
        },

        {
          breakpoint: 1300,

          settings: {
            slidesToShow: 3,

            slidesToScroll: 3,
          },
        },

        {
          breakpoint: 1000,

          settings: {
            slidesToShow: 2,

            slidesToScroll: 2,
          },
        },

        {
          breakpoint: 800,

          settings: {
            slidesToShow: 2,

            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,

          settings: {
            slidesToShow: 1,

            slidesToScroll: 1,
          },
        },
      ],
    })
  }

  if ($('.sponsors-slider')[0]) {
    $('.sponsors-slider').slick({
      slidesToShow: 5,

      slidesToScroll: 3,

      arrows: false,

      dots: false,
      autoplay: true,

      autoplaySpeed: 2000,

      speed: 1000,

      responsive: [
        {
          breakpoint: 1200,

          settings: {
            slidesToShow: 4,

            slidesToScroll: 1,
          },
        },

        {
          breakpoint: 1000,

          settings: {
            slidesToShow: 3,

            slidesToScroll: 1,
          },
        },

        {
          breakpoint: 550,

          settings: {
            slidesToShow: 2,

            slidesToScroll: 1,
          },
        },
      ],
    })
  }

  // hero-three-slider
  if ($('.hero-three-slider')[0]) {
    $('.hero-three-slider')
      .slick({
        slidesToShow: 1,

        slidesToScroll: 1,

        arrows: false,
        fade: true,
        dots: false,
        pauseOnHover: false,
        cssEase: 'linear',
        autoplay: true,
        draggable: false,

        autoplaySpeed: 5000,

        speed: 2000,
      })
      .on('setPosition', function (event, slick) {
        slick.$slides.css('height', slick.$slideTrack.height(100) + '%')
      })
    var currentSlide = 0
    $('.hero-three-slider').on('afterChange', function (event, slick, newSlide) {
      var items = $('.hero-three-slider .item')
      $(items).addClass('animated')
    })
    $('.hero-three-slider').on('beforeChange', function (event, slick, newSlide) {
      var items = $('.hero-three-slider .item')
      $(items).removeClass('animated')
    })
  }

  // slider-church-prayers
  if ($('.slider-church-prayers')[0]) {
    $('.slider-church-prayers').slick({
      slidesToShow: 2,

      slidesToScroll: 1,

      arrows: false,

      dots: false,

      cssEase: 'ease-in-out',

      draggable: true,

      autoplay: true,

      autoplaySpeed: 3000,

      speed: 1300,
      responsive: [
        {
          breakpoint: 1000,

          settings: {
            slidesToShow: 1,

            slidesToScroll: 1,
          },
        },
      ],
    })
  }

  // Slider-Causes-Of-Church
  if ($('.slider-causes-of-church')[0]) {
    $('.slider-causes-of-church').slick({
      slidesToShow: 3,

      slidesToScroll: 1,

      dots: false,

      arrows: false,

      cssEase: 'ease-in-out',

      draggable: true,

      autoplay: true,

      autoplaySpeed: 3000,

      speed: 1300,
      responsive: [
        {
          breakpoint: 1030,

          settings: {
            slidesToShow: 2,

            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 600,

          settings: {
            slidesToShow: 1,

            slidesToScroll: 1,
          },
        },
      ],
    })
  }

  // Tilt on hover
  if ($('.tilt')[0]) {
    $('.tilt').tilt({
      maxGlare: 1,

      maxTilt: 3,

      transition: true,
    })
  }
  if ($('.tiltt')[0]) {
    $('.tiltt').tilt({
      maxGlare: 0.5,

      maxTilt: 0.5,

      transition: true,
    })
  }

  // Animation on scroll

  AOS.init({
    once: true,
  })

  // C-Slider

  if ($('.c-slider')[0]) {
    $('.c-slider').slick({
      slidesToShow: 1,

      slidesToScroll: 1,

      arrows: false,

      dots: false,

      draggable: false,

      waitForAnimate: true,

      lazyLoad: 'ondemand',

      fade: false,

      speed: 30000,
    })
  }

  // C-Slider

  $('.next-slide').on('click', function () {
    var img_src = ''

    $('.next-slide.nav-active').removeClass('nav-active')

    $(this).addClass('nav-active')

    img_src = $(this).html()

    $('.slider-main-img').html(img_src)

    var slideno = $(this).data('slide')

    $('.c-slider').slick('slickGoTo', slideno - 1, true)
  })

  // pd-gallery
  $('.li-pd-imgs').on('click', function () {
    var img_src = ''

    $('.li-pd-imgs.nav-active').removeClass('nav-active')

    $(this).addClass('nav-active')

    img_src = $(this).find('img').attr('src')

    $('#NZoomContainer').children('img').attr('src', img_src)
  })

  // Loader Start

  let settings = {
    progressSize: 320,
    progressColor: '#ffffff',
    lineWidth: 2,
    lineCap: 'round',
    preloaderAnimationDuration: 800,
    startDegree: -90,
    finalDegree: 270,
  }

  function setAttributes(elem, attrs) {
    for (let key in attrs) {
      elem.setAttribute(key, attrs[key])
    }
  }

  let preloader = document.createElement('div'),
    canvas = document.createElement('canvas'),
    size
  ;(function () {
    let width = window.innerWidth,
      height = window.innerHeight

    if (width > height) {
      size = Math.min(settings.progressSize, height / 2)
    } else {
      size = Math.min(settings.progressSize, width - 50)
    }
  })()

  setAttributes(preloader, {
    class: 'preloader',
    id: 'preloader',
    style: 'transition: opacity ' + settings.preloaderAnimationDuration / 1000 + 's',
  })
  setAttributes(canvas, {
    class: 'progress-bar',
    id: 'progress-bar',
    width: settings.progressSize,
    height: settings.progressSize,
  })

  preloader = document.getElementById('preloader')

  // let progressBar = document.getElementById('progress-bar'),
  //   images = document.images,
  //   imagesAmount = images.length,
  //   imagesLoaded = 0,
  //   barCtx = progressBar.getContext('2d'),
  //   circleCenterX = progressBar.width / 2,
  //   circleCenterY = progressBar.height / 2,
  //   circleRadius = circleCenterX - settings.lineWidth,
  //   degreesPerPercent = 3.6,
  //   currentProgress = 0,
  //   showedProgress = 0,
  //   progressStep = 0,
  //   progressDelta = 0,
  //   startTime = null,
  //   running
  // ;(function () {
  //   return (
  //     requestAnimationFrame ||
  //     mozRequestAnimationFrame ||
  //     webkitRequestAnimationFrame ||
  //     oRequestAnimationFrame ||
  //     msRequestAnimationFrame ||
  //     function (callback) {
  //       setTimeout(callback, 1000 / 60)
  //     }
  //   )
  // })()

  Math.radians = function (degrees) {
    return (degrees * Math.PI) / 180
  }

  // progressBar.style.opacity = settings.progressOpacity
  // barCtx.strokeStyle = settings.progressColor
  // barCtx.lineWidth = settings.lineWidth
  // barCtx.lineCap = settings.lineCap
  // let angleMultiplier = (Math.abs(settings.startDegree) + Math.abs(settings.finalDegree)) / 360
  // let startAngle = Math.radians(settings.startDegree)
  // document.body.style.overflowY = 'hidden'
  // preloader.style.backgroundColor = settings.preloaderBackground

  // for (let i = 0; i < imagesAmount; i++) {
  //   let imageClone = new Image()
  //   imageClone.onload = onImageLoad
  //   imageClone.onerror = onImageLoad
  //   imageClone.src = images[i].src
  // }

  // function onImageLoad() {
  //   if (running === true) running = false

  //   imagesLoaded++

  //   if (imagesLoaded >= imagesAmount) hidePreloader()

  //   progressStep = showedProgress
  //   currentProgress = ((100 / imagesAmount) * imagesLoaded) << 0
  //   progressDelta = currentProgress - showedProgress

  //   setTimeout(function () {
  //     if (startTime === null) startTime = performance.now()
  //     running = true
  //     animate()
  //   }, 10)
  // }

  function animate() {
    if (running === false) {
      startTime = null
      return
    }

    let timeDelta = Math.min(
      1,
      (performance.now() - startTime) / settings.preloaderAnimationDuration
    )
    showedProgress = progressStep + progressDelta * timeDelta

    if (timeDelta <= 1) {
      barCtx.clearRect(0, 0, progressBar.width, progressBar.height)
      barCtx.beginPath()
      barCtx.arc(
        circleCenterX,
        circleCenterY,
        circleRadius,
        startAngle,
        Math.radians(showedProgress * degreesPerPercent) * angleMultiplier + startAngle
      )
      barCtx.stroke()
      requestAnimationFrame(animate)
    } else {
      startTime = null
    }
  }

  function hidePreloader() {
    setTimeout(function () {
      $('body').addClass('page-loaded')
      document.body.style.overflowY = ''
    }, settings.preloaderAnimationDuration + 100)
  }
  var resizeTimer

  // Loader End

  // Cart Popup Start

  $('.pr-cart').on('click', function () {
    $('.cart-popup').toggleClass('show-cart')
  })

  // Cart Popup End

  // // Scroll Top

  window.onscroll = function () {
    var num = window.pageYOffset

    if (num >= 160) {
      document.querySelector('#scrollTop').classList.add('active')
    } else {
      document.querySelector('#scrollTop').classList.remove('active')
    }
  }

  // // Just add #scrollTop to the footer

  document.querySelector('#scrollTop').addEventListener('click', function () {
    window.scrollTo({
      top: 0,

      left: 0,

      behavior: 'smooth',
    })
  })
})

// Donation Amount Select On Click Start

$('.donating').on('click', function () {
  var empty = ''
  $('.donated_amount').attr('placeholder', empty)
  var donation_amount = $(this).children('span').text()
  $('.donated_amount').attr('placeholder', donation_amount)
})

// Donation Amount Select On Click End

// Sermon Media Start

$('.s_video').on('click', function () {
  $('.s_video').parent().closest('.sermon-img').removeClass('audio')

  $(this).parent().closest('.sermon-img').addClass('video')
})

$('.s_audio').on('click', function () {
  $('.s_audio').parent().closest('.sermon-img').removeClass('video')

  $(this).parent().closest('.sermon-img').addClass('audio')
})

$('.s_pdf').on('click', function () {
  $(this).attr({ target: '_blank', href: 'assets/randomfile.pdf' })
})

$('.s_music').on('click', function () {
  $(this).attr({ target: '_blank', href: 'assets/music/hey.mp3' })
})

// get help from here https://www.geeksforgeeks.org/how-to-download-file-using-javascript-jquery/

// Sermon Media End

$(document).ready(function () {
  // Header

  var new_scroll_position = 0

  var last_scroll_position

  var header = document.getElementById('stickyHeader')

  window.addEventListener('scroll', function (e) {
    last_scroll_position = window.scrollY

    // Scrolling down

    if (new_scroll_position < last_scroll_position && last_scroll_position > 100) {
      // header.removeClass('slideDown').addClass('slideUp');

      header.classList.remove('slideDown')

      header.classList.add('slideUp')

      // Scroll top
    } else if (last_scroll_position < 100) {
      header.classList.remove('slideDown')
    } else if (new_scroll_position > last_scroll_position) {
      header.classList.remove('slideUp')

      header.classList.add('slideDown')
    }

    new_scroll_position = last_scroll_position
  })

  // Responsive header menu

  $('.mobile-nav .menu-item-has-children').on('click', function () {
    $(this).toggleClass('active')
  })

  $('#nav-icon4').click(function () {
    $(this).toggleClass('open')

    $('#mobile-nav').toggleClass('open')
  })

  $('#res-cross').click(function () {
    $('#mobile-nav').removeClass('open')

    $('#nav-icon4').removeClass('open')
  })
})
