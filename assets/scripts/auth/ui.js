'use strict'

const store = require('../store')
const toast = require('../toasts.js')
const gameUI = require('../game/ui')

const signUpSuccess = function (data) {
  toast.success('Signed Up!')
  $('#sign-up-button').click()
  $('#sign-up').find('input:text').val('')
  $('#sign-up').find('input:password').val('')
}

const signUpFailure = function (error) {
  toast.failure('Error on signing up')
  $('#sign-up-button').click()
  $('#sign-up').find('input:text').val('')
  $('#sign-up').find('input:password').val('')
  console.log(error)
}

const signInSuccess = function (data) {
  toast.success('Signed In!')
  store.user = data.user
  // console.log('store.user is ', store.user)
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
  $('#get-user-purchases').hide()
}

const signInFailure = function (error) {
  toast.failure('Error on signing in')
  $('#sign-in-button').click()
  $('#sign-in').find('input:text').val('')
  $('#sign-in').find('input:password').val('')
  console.log(error)
  return error
}

const signOutSuccess = function () {
  toast.success('Signed Out!')
  $('#auth-wrapper').show()
  $('#account-navbar').hide()
  $('#game-wrapper-div').hide()
  $('#non-auth-wrapper').hide()
  $('#high-scores-content').html('')
  $('#change-password')[0].reset()
  $('#get-game')[0].reset()
  $('#user-gold').html('')
  sessionStorage.clear()
  document.removeEventListener('keydown', gameUI.keyDownHandler, false)
}

const signOutFailure = function (error) {
  // toast.failure('Error on signing out')
  console.log(error)
  // clear credentials from sessionStorage and render signout UI updates even in failure
  sessionStorage.clear()
  signOutSuccess()
}

const changePasswordSuccess = function () {
  toast.success('Password Changed!')
  $('#change-password').find('input:text').val('')
  $('#change-password').find('input:password').val('')
}

const changePasswordFailure = function (error) {
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
