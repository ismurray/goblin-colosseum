'use strict'

const store = require('../store')
const toast = require('../toasts.js')

const signUpSuccess = function (data) {
  // $('#account-message').text('Signed up successfully!')
  // $('#account-message').css('background-color', '#5cb85c')
  toast.success('Signed Up!')
  $('#sign-up-button').click()
  $('#sign-up').find('input:text').val('')
  $('#sign-up').find('input:password').val('')
}

const signUpFailure = function (error) {
  // $('#account-message').text('Error on signing up')
  // $('#account-message').css('background-color', '#d9534f')
  toast.failure('Error on signing up')
  $('#sign-up-button').click()
  $('#sign-up').find('input:text').val('')
  $('#sign-up').find('input:password').val('')
  console.log(error)
}

const signInSuccess = function (data) {
  // $('#account-message').text('Signed in successfully!')
  // $('#account-message').css('background-color', '#5cb85c')
  toast.success('Signed In!')
  store.user = data.user
  $('#sign-in').find('input:text').val('')
  $('#sign-in').find('input:password').val('')
  $('#auth-wrapper').hide()
  $('#account-navbar').show()
  $('#non-auth-wrapper').show()
  $('#get-user-purchases').click()
  $('#heal-button').css('background-color', 'grey')
  $('#sweep-button').css('background-color', 'grey')
  $('#blast-left').css('background-color', 'grey')
  $('#blast-right').css('background-color', 'grey')
  $('#blast-up').css('background-color', 'grey')
  $('#blast-down').css('background-color', 'grey')
  $('#unlock-sweep').show()
  $('#unlock-blast').show()
}

const signInFailure = function (error) {
  // $('#account-message').text('Error on signing in')
  // $('#account-message').css('background-color', '#d9534f')
  toast.failure('Error on signing in')
  $('#sign-in-button').click()
  $('#sign-in').find('input:text').val('')
  $('#sign-in').find('input:password').val('')
  console.log(error)
}

const signOutSuccess = function () {
  // $('#account-message').text('Signed out successfully!')
  // $('#account-message').css('background-color', '#5cb85c')
  toast.success('Signed Out!')
  $('#auth-wrapper').show()
  $('#account-navbar').hide()
  $('#game-wrapper-div').hide()
  $('#non-auth-wrapper').hide()
  $('#high-scores-content').html('')
  $('#change-password')[0].reset()
  $('#get-game')[0].reset()
  $('#user-gold').html('')
}

const signOutFailure = function (error) {
  // $('#account-page-message').text('Error on Signing Out')
  // $('#account-page-message').css('background-color', '#d9534f')
  toast.failure('Error on signing out')
  console.log(error)
}

const changePasswordSuccess = function () {
  // $('#account-message').text('Password changed successfully!')
  // $('#account-message').css('background-color', '#5cb85c')
  toast.success('Password Changed!')
  $('#change-password').find('input:text').val('')
  $('#change-password').find('input:password').val('')
}

const changePasswordFailure = function (error) {
  // $('#account-message').text('Error on changing password')
  // $('#account-message').css('background-color', '#d9534f')
  toast.failure('Error on changing password')
  $('#change-password').find('input:text').val('')
  $('#change-password').find('input:password').val('')
  console.log(error)
}

module.exports = {
  signUpSuccess,
  signUpFailure,
  signInSuccess,
  signInFailure,
  signOutSuccess,
  signOutFailure,
  changePasswordSuccess,
  changePasswordFailure
}
