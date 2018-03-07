'use strict'

const getFormFields = require('../../../lib/get-form-fields')
const authAP = require('./api.js')
const authUI = require('./ui.js')

const onSignUp = function (event) {
  event.preventDefault()
  const data = getFormFields(this)

  authAP.signUp(data)
    .then(authUI.signUpSuccess)
    .catch(authUI.signUpFailure)
}

const onSignIn = function (event) {
  event.preventDefault()
  const data = getFormFields(this)

  authAP.signIn(data)
    .then(authUI.signInSuccess)
    .catch(authUI.signInFailure)
}

const addHandlers = () => {
  $('#sign-up').on('submit', onSignUp)
  $('#sign-in').on('submit', onSignIn)
}

module.exports = {
  addHandlers
}
