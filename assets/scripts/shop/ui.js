'use strict'

const store = require('../store')
const showAllPurchasesTemplate = require('../templates/purchase-listing.handlebars')
const toast = require('../toasts.js')

const getGoldSuccess = function (data) {
  $('#user-gold').html(data)
}

const getGoldFailure = function (error) {
  toast.failure('Error retrieving gold balance!')
  console.log(error)
}

const updateGoldSuccess = function (data) {
  toast.success('Gold Deposited Into Your Account!')
  $('#user-gold').html(data)
}

const updateGoldFailure = function (error) {
  toast.failure('No Gold Transferred!')
  console.log(error)
}

// iterate through API purchases data and update local store
const storePurchases = function (data) {
  // reset local store of account purchases
  const accountPurchases = {
    healthPotions: 0,
    healPurchaseIDs: [],
    sweep: false,
    blast: false,
    serverItemNames: {
      heal: 'Health Potion',
      sweep: 'Sweeping Strike',
      blast: 'Lightning Blast'
    }
  }
  // add each purchase
  for (let i = 0; i < data.purchases.length; i++) {
    if (data.purchases[i].item.name === 'Health Potion') {
      accountPurchases.healthPotions += 1
      // store consumable id's for easier deletion later
      accountPurchases.healPurchaseIDs.push(data.purchases[i].id)
      $('#heal-button').css('background-color', '#5cb85c')
    } else if (data.purchases[i].item.name === 'Sweeping Strike') {
      accountPurchases.sweep = true
      $('#sweep-button').css('background-color', '#5cb85c')
      $('#unlock-sweep').hide()
    } else if (data.purchases[i].item.name === 'Lightning Blast') {
      accountPurchases.blast = true
      $('#blast-left').css('background-color', '#5cb85c')
      $('#blast-right').css('background-color', '#5cb85c')
      $('#blast-up').css('background-color', '#5cb85c')
      $('#blast-down').css('background-color', '#5cb85c')
      $('#unlock-blast').hide()
    }
  }
  store.accountPurchases = accountPurchases
  $('#current-heals').text('(' + store.accountPurchases.healthPotions + ')')
}

const getPurchasesSuccess = function (data) {
  toast.success('Purchases retrieved!')
  storePurchases(data)
  const showPurchasesHtml = showAllPurchasesTemplate({ accountPurchases: [store.accountPurchases] })
  $('#all-purchases-content').html(showPurchasesHtml)
}

const getPurchasesFailure = function (error) {
  toast.failure('Error retrieving purchases!')
  console.log(error)
}

const createPurchaseSuccess = function (data) {
  toast.success('Purchase successful!')
  const showPurchasesHtml = showAllPurchasesTemplate({ purchases: data })
  $('#all-purchases-content').append(showPurchasesHtml)
  $('#user-gold').html(data.purchase.user.gold)
  $('#get-user-purchases').click()
}

const createPurchaseFailure = function (error) {
  toast.failure('Error processing purchase!')
  console.log(error)
}

module.exports = {
  getGoldSuccess,
  getGoldFailure,
  updateGoldSuccess,
  updateGoldFailure,
  getPurchasesSuccess,
  getPurchasesFailure,
  createPurchaseSuccess,
  createPurchaseFailure
}
