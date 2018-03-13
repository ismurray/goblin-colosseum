'use strict'

// const getFormFields = require('../../../lib/get-form-fields')
const shopAPI = require('./api.js')
const shopUI = require('./ui.js')

const onGetGold = function (event) {
  event.preventDefault()

  shopAPI.getGold()
    .then(shopUI.getGoldSuccess)
    .catch(shopUI.getGoldFailure)
}

const onUpdateGold = function (event) {
  event.preventDefault()
  const tx = $('#update-gold input').val()
  shopAPI.updateGold(tx)
    .then(shopUI.updateGoldSuccess)
    .catch(shopUI.updateGoldFailure)
}

const addHandlers = () => {
  $('#get-user-gold').on('click', onGetGold)
  $('#update-gold').on('submit', onUpdateGold)
}

module.exports = {
  addHandlers
}
