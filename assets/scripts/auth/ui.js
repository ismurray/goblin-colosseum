'use strict'

const store = require('../store')

const signUpSuccess = function (data) {
  $('#account-message').text('Signed up successfully!')
  $('#account-message').css('background-color', '#5cb85c')
  $('#sign-up').find('input:text').val('')
  $('#sign-up').find('input:password').val('')
}

const signUpFailure = function (error) {
  $('#account-message').text('Error on signing up')
  $('#account-message').css('background-color', '#d9534f')
  $('#sign-up').find('input:text').val('')
  $('#sign-up').find('input:password').val('')
  console.log(error)
}

const signInSuccess = function (data) {
  $('#account-message').text('Signed in successfully!')
  $('#account-message').css('background-color', '#5cb85c')
  store.user = data.user
  console.log(store.user)
  $('#sign-in').find('input:text').val('')
  $('#sign-in').find('input:password').val('')
}

const signInFailure = function (error) {
  $('#account-message').text('Error on signing in')
  $('#account-message').css('background-color', '#d9534f')
  $('#sign-in').find('input:text').val('')
  $('#sign-in').find('input:password').val('')
  console.log(error)
}

const signOutSuccess = function () {
  $('#account-message').text('Signed out successfully!')
  $('#account-message').css('background-color', '#5cb85c')
}

const signOutFailure = function (error) {
  $('#account-page-message').text('Error on Signing Out')
  $('#account-page-message').css('background-color', '#d9534f')
  console.log(error)
}

module.exports = {
  signUpSuccess,
  signUpFailure,
  signInSuccess,
  signInFailure,
  signOutSuccess,
  signOutFailure
}
