const { ipcRenderer } = require('electron')
const remote = require('@electron/remote')
const { Menu } = remote;
const Store = require('electron-store')

window.onload = () => {

  window.electron_config = new Store();

  window.ipcRenderer = ipcRenderer
  window.Menu = Menu
  window.fs = require('fs')
  window.path = require('path')
  window.async = require('async')
  
  window.$ = window.jQuery = require('jquery')
  window.Popper = require('@popperjs/core')
  window.bootstrap = require ('bootstrap')

  window.ExifImage = require('kinda-exif').ExifImage
  
  window.config = require('./config.json')
  window.utils = require('./js/utilities.js')
  window.controls = require('./js/controls.js')
  window.options = require('./js/options.js')  

  $.getScript("../node_modules/handlebars/dist/handlebars.min.js")
  $.getScript("../js/index.js")
  $.getScript("../js/events.js")

}

