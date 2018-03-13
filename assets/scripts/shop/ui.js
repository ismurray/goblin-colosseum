'use strict'

// const store = require('../store')

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

module.exports = {
  getGoldSuccess,
  getGoldFailure
}
