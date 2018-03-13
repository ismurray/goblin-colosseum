'use strict'

const config = require('../config.js')
const store = require('../store')

const getGold = function () {
  return $.ajax({
    url: config.apiOrigin + '/gold',
    method: 'GET',
    headers: {
      contentType: 'application/json',
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const updateGold = function (tx) {
  return $.ajax({
    url: config.apiOrigin + '/gold-transaction/' + tx,
    method: 'PATCH',
    headers: {
      contentType: 'application/json',
      Authorization: 'Token token=' + store.user.token
    }
  })
}

module.exports = {
  getGold,
  updateGold
}
