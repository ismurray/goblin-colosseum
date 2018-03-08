'use strict'

const getFormFields = require('../../../lib/get-form-fields')
const authAPI = require('./api.js')
const authUI = require('./ui.js')

const onSignUp = function (event) {
  event.preventDefault()

  const data = getFormFields(this)
  authAPI.signUp(data)
    .then(authUI.signUpSuccess)
    .catch(authUI.signUpFailure)
}

const onSignIn = function (event) {
  event.preventDefault()

  const data = getFormFields(this)
  authAPI.signIn(data)
    .then(authUI.signInSuccess)
    .catch(authUI.signInFailure)
}

const onSignOut = function (event) {
  event.preventDefault()
  authAPI.signOut()
    .then(authUI.signOutSuccess)
    .catch(authUI.signOutFailure)
}

const onChangePassword = function (event) {
  event.preventDefault()

  const data = getFormFields(this)
  authAPI.changePassword(data)
    .then(authUI.changePasswordSuccess)
    .catch(authUI.changePasswordFailure)
}

const addHandlers = () => {
  $('#sign-up').on('submit', onSignUp)
  $('#sign-in').on('submit', onSignIn)
  $('#sign-out').on('submit', onSignOut)
  $('#change-password').on('submit', onChangePassword)
}

module.exports = {
  addHandlers
}
