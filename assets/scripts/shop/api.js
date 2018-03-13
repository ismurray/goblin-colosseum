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

module.exports = {
  getGold
}
