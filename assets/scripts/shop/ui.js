'use strict'

// const store = require('../store')
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

const getPurchasesSuccess = function (data) {
  $('#account-message').text('Purchases retrieved!')
  $('#account-message').css('background-color', '#5cb85c')
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
