'use strict'

const getFormFields = require('../../../lib/get-form-fields')
const shopAPI = require('./api.js')
const shopUI = require('./ui.js')
const store = require('../store')

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
  shopAPI.getPurchases()
    .then(shopUI.getPurchasesSuccess)
    .catch(shopUI.getPurchasesFailure)
}

const onCreatePurchase = function (event) {
  event.preventDefault()

  const purchaseItem = $(this).attr('data-id')
  console.log(purchaseItem)
  let data
  // if item is potion, or is an ability that hasn't been unlocked yet, buy it
  if (purchaseItem === 'heal' || (purchaseItem !== 'heal' && !store.accountPurchases[purchaseItem])) {
    const purchaseID = store.accountPurchases.serverItemIDs[purchaseItem]
    console.log(purchaseID)
    data = {
      'purchase': {
        'item_id': purchaseID
      }
    }
  }
  console.log('data is ', data)
  shopAPI.createPurchase(data)
    .then(shopUI.createPurchaseSuccess)
    .catch(shopUI.createPurchaseFailure)
}

const onDeletePurchase = function (event) {
  event.preventDefault()
  const purchaseID = $('#delete-purchase input').val()

  shopAPI.deletePurchase(purchaseID)
    .then(shopUI.deletePurchaseSuccess)
    .catch(shopUI.deletePurchaseFailure)
}

const addHandlers = () => {
  $('#get-user-gold').on('click', onGetGold)
  $('#update-gold').on('submit', onUpdateGold)
  $('#get-user-purchases').on('click', onGetPurchases)
  $('#create-purchase').on('submit', onCreatePurchase)
  $('#unlock-sweep').on('submit', onCreatePurchase)
  $('#unlock-blast').on('submit', onCreatePurchase)
  $('#buy-heal').on('submit', onCreatePurchase)
  $('#delete-purchase').on('submit', onDeletePurchase)
}

module.exports = {
  addHandlers
}
