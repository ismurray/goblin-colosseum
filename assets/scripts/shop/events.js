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

const onUpdateGold = function (amount) {
  event.preventDefault()
  // const tx = $('#update-gold input').val()
  shopAPI.updateGold(amount)
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
  console.log('test!')
  const purchaseItem = $(this).attr('data-id')
  let data
  // if item is potion, or is an ability that hasn't been unlocked yet, buy it
  if (purchaseItem === 'heal' || (purchaseItem !== 'heal' && !store.accountPurchases[purchaseItem])) {
    const purchaseID = store.accountPurchases.serverItemIDs[purchaseItem]
    data = {
      'purchase': {
        'item_id': purchaseID
      }
    }
  }
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
  $('#shop-button').on('click', onGetGold)
  $('#update-gold').on('submit', onUpdateGold)
  $('#get-user-purchases').on('click', onGetPurchases)
  $('#create-purchase').on('submit', onCreatePurchase)
  $('#unlock-sweep').on('submit', onCreatePurchase)
  $('#unlock-blast').on('submit', onCreatePurchase)
  $('#buy-heal').on('submit', onCreatePurchase)
  $('#delete-purchase').on('submit', onDeletePurchase)
}

module.exports = {
  addHandlers,
  onUpdateGold
}
