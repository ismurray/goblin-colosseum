'use strict'

const setAPIOrigin = require('../../lib/set-api-origin')
const config = require('./config')
const authEvents = require('./auth/events.js')
const gameEvents = require('./game/events.js')
const shopEvents = require('./shop/events.js')
const authAPI = require('./auth/api.js')

$(() => {
  setAPIOrigin(location, config)
  authEvents.addHandlers()
  gameEvents.addHandlers()
  shopEvents.addHandlers()
  authAPI.wakeUpHeroku()
  $('#game-wrapper-div').hide()
  $('#non-auth-wrapper').hide()
  $('#account-navbar').hide()
  authEvents.checkSessionCreds()
})

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
// require('./example')
