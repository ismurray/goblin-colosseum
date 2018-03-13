'use strict'

const getFormFields = require('../../../lib/get-form-fields')
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

const onGetPurchases = function (event) {
  event.preventDefault()
  console.log('Purchases!')
  shopAPI.getPurchases()
    .then(shopUI.getPurchasesSuccess)
    .catch(shopUI.getPurchasesFailure)
}

const onCreatePurchase = function (event) {
  event.preventDefault()
  const data = getFormFields(this)
  shopAPI.createPurchase(data)
    .then(shopUI.createPurchaseSuccess)
    .catch(shopUI.createPurchaseFailure)
}

const addHandlers = () => {
  $('#get-user-gold').on('click', onGetGold)
  $('#update-gold').on('submit', onUpdateGold)
  $('#get-user-purchases').on('click', onGetPurchases)
  $('#create-purchase').on('submit', onCreatePurchase)
}

module.exports = {
  addHandlers
}
