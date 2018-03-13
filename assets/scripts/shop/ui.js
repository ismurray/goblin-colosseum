'use strict'

const store = require('../store')
const showAllPurchasesTemplate = require('../templates/purchase-listing.handlebars')

const getGoldSuccess = function (data) {
  $('#account-message').text('Gold retrieved!')
  $('#account-message').css('background-color', '#5cb85c')
  $('#user-gold').html(data)
}

const getGoldFailure = function (error) {
  $('#account-message').text('Error retrieving gold balance!')
  $('#account-message').css('background-color', '#d9534f')
  console.log(error)
}

const updateGoldSuccess = function (data) {
  $('#account-message').text('Transaction successful!')
  $('#account-message').css('background-color', '#5cb85c')
  $('#user-gold').html(data)
}

const updateGoldFailure = function (error) {
  $('#account-message').text('Error processing transaction!')
  $('#account-message').css('background-color', '#d9534f')
  console.log(error)
}

// iterate through API purchases data and update local store
const storePurchases = function (data) {
  // reset local store of account purchases
  const accountPurchases = {
    healthPotions: 0,
    healPurchaseIDs: [],
    sweep: false,
    blast: false
  }
  // add each purchase
  for (let i = 0; i < data.purchases.length; i++) {
    if (data.purchases[i].item.name === 'Health Potion') {
      accountPurchases.healthPotions += 1
      // store consumable id's for easier deletion later
      accountPurchases.healPurchaseIDs.push(data.purchases[i].id)
    } else if (data.purchases[i].item.name === 'Sweeping Strike') {
      accountPurchases.sweep = true
    } else if (data.purchases[i].item.name === 'Lightning Blast') {
      accountPurchases.blast = true
    }
  }
  store.accountPurchases = accountPurchases
}

const getPurchasesSuccess = function (data) {
  $('#account-message').text('Purchases retrieved!')
  $('#account-message').css('background-color', '#5cb85c')
  storePurchases(data)
  console.log(store.accountPurchases)
  const showPurchasesHtml = showAllPurchasesTemplate({ purchases: data.purchases })
  $('#all-purchases-content').html(showPurchasesHtml)
}

const getPurchasesFailure = function (error) {
  $('#account-message').text('Error retrieving purchases!')
  $('#account-message').css('background-color', '#d9534f')
  console.log(error)
}

const createPurchaseSuccess = function (data) {
  $('#account-message').text('Purchase successful!')
  $('#account-message').css('background-color', '#5cb85c')
  const showPurchasesHtml = showAllPurchasesTemplate({ purchases: data })
  $('#all-purchases-content').append(showPurchasesHtml)
}

const createPurchaseFailure = function (error) {
  $('#account-message').text('Error processing purchase!')
  $('#account-message').css('background-color', '#d9534f')
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
