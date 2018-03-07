'use strict'

const getFormFields = require('../../../lib/get-form-fields')
const authAP = require('./api.js')
const authUI = require('./ui.js')

const onSignUp = function (event) {
  event.preventDefault()
  console.log("I'm clicked!")

  const data = getFormFields(this)
  console.log(data)

  authAP.signUp(data)
    .then(authUI.signUpSuccess)
    .catch(authUI.signUpFailure)
}

const addHandlers = () => {
  $('#sign-up').on('submit', onSignUp)
}

module.exports = {
  addHandlers
}
