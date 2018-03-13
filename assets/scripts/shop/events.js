'use strict'

const shopAPI = require('./api.js')
const shopUI = require('./ui.js')

const onGetGold = function (event) {
  event.preventDefault()
  console.log('GOLD!')
  shopAPI.getGold()
    .then(shopUI.getGoldSuccess)
    .catch(shopUI.getGoldFailure)
}

const addHandlers = () => {
  $('#get-user-gold').on('click', onGetGold)
}

module.exports = {
  addHandlers
}
