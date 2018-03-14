'use strict'

const store = require('../store')
const showAllPurchasesTemplate = require('../templates/purchase-listing.handlebars')

const getGoldSuccess = function (data) {
  // $('#account-message').text('Gold retrieved!')
  // $('#account-message').css('background-color', '#5cb85c')
  $('#user-gold').html(data)
}

const getGoldFailure = function (error) {
  $('#shop-message').text('Error retrieving gold balance!')
  $('#shop-message').css('background-color', '#d9534f')
  console.log(error)
}

const updateGoldSuccess = function (data) {
  $('#shop-message').text('Transaction successful!')
  $('#shop-message').css('background-color', '#5cb85c')
  $('#user-gold').html(data)
}

const updateGoldFailure = function (error) {
  $('#shop-message').text('Error processing transaction!')
  $('#shop-message').css('background-color', '#d9534f')
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
    // server item ID's only apply to the DevServer, TODO: update for production
    serverItemIDs: {
      heal: 1,
      sweep: 4,
      blast: 5
    }
  }
  // add each purchase
  for (let i = 0; i < data.purchases.length; i++) {
    if (data.purchases[i].item.name === 'Health Potion') {
      accountPurchases.healthPotions += 1
      // store consumable id's for easier deletion later
      accountPurchases.healPurchaseIDs.push(data.purchases[i].id)
    } else if (data.purchases[i].item.name === 'Sweeping Strike') {
      accountPurchases.sweep = true
      $('#sweep-button').css('background-color', '#5cb85c')
    } else if (data.purchases[i].item.name === 'Lightning Blast') {
      accountPurchases.blast = true
      $('#blast-button').css('background-color', '#5cb85c')
    }
  }
  store.accountPurchases = accountPurchases
  $('#current-heals').text('(' + store.accountPurchases.healthPotions + ')')
}

const getPurchasesSuccess = function (data) {
  $('#shop-message').text('Purchases retrieved!')
  $('#shop-message').css('background-color', '#5cb85c')
  storePurchases(data)
  console.log(store.accountPurchases)
  const showPurchasesHtml = showAllPurchasesTemplate({ accountPurchases: [store.accountPurchases] })
  $('#all-purchases-content').html(showPurchasesHtml)
}

const getPurchasesFailure = function (error) {
  $('#shop-message').text('Error retrieving purchases!')
  $('#shop-message').css('background-color', '#d9534f')
  console.log(error)
}

const createPurchaseSuccess = function (data) {
  $('#shop-message').text('Purchase successful!')
  $('#shop-message').css('background-color', '#5cb85c')
  const showPurchasesHtml = showAllPurchasesTemplate({ purchases: data })
  $('#all-purchases-content').append(showPurchasesHtml)
  $('#user-gold').html(data.purchase.user.gold)
  $('#get-user-purchases').click()
}

const createPurchaseFailure = function (error) {
  $('#shop-message').text('Error processing purchase!')
  $('#shop-message').css('background-color', '#d9534f')
  console.log(error)
}

const deletePurchaseSuccess = function (data) {
  $('#shop-message').text('Purchase delete successful!')
  $('#shop-message').css('background-color', '#5cb85c')
}

const deletePurchaseFailure = function (error) {
  $('#shop-message').text('Error processing purchase deletion!')
  $('#shop-message').css('background-color', '#d9534f')
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
  createPurchaseFailure,
  deletePurchaseSuccess,
  deletePurchaseFailure
}
