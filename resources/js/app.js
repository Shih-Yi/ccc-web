// resources/js/app.js

// =======================
// 1. Import CSS Files
// =======================

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'

// Import Slick Carousel CSS
import 'slick-carousel/slick/slick.css'
// import 'slick-carousel/slick/slick-theme.css'

// Import Custom CSS
import '../css/app.css'
import '../css/responsive.css'
// =======================
// 2. Import JavaScript Dependencies
// =======================

// Import FontAwesome JS
import '@fortawesome/fontawesome-free/js/all.min.js'

// Import Bootstrap JS and Popper.js
import * as bootstrap from 'bootstrap'
import '@popperjs/core'

// Import jQuery and set it as a global variable
import $ from 'jquery'
window.$ = window.jQuery = $

// Import Slick Carousel JS
import 'slick-carousel'

import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'

Fancybox.bind('[data-fancybox]', {
  // Optional: Add custom configuration
})

// import all images
const allImages = import.meta.glob('../images/*.*', { eager: true })
window.appImages = { ...allImages }

// Import Custom Scripts
import './custom'

// =======================
// 3. Initialize Bootstrap Components
// =======================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all elements with data-bs-toggle="popover"
  const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
  popoverTriggerList.forEach((popoverTriggerEl) => {
    new bootstrap.Popover(popoverTriggerEl)
  })

  // Initialize all elements with data-bs-toggle="tooltip"
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  tooltipTriggerList.forEach((tooltipTriggerEl) => {
    new bootstrap.Tooltip(tooltipTriggerEl)
  })
})
