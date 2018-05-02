'use strict'

const getFormFields = require('../../../lib/get-form-fields')
const authAPI = require('./api.js')
const shopAPI = require('../shop/api.js')
const store = require('../store')
const authUI = require('./ui.js')
const toast = require('../toasts.js')

// checks session storage to see if user already has login info saved in
// sessionStorage. If yes, load signInSuccess for UI update, otherwise do nothing
const checkSessionCreds = function () {
  const user = sessionStorage.getItem('user')
  if (user !== undefined && user !== null) {
    // console.log('sessionCreds user is ', JSON.parse(user))
    store.user = JSON.parse(user).user
    // console.log('store.user is ', store.user)
    shopAPI.getGold()
      .then(() => authUI.signInSuccess(JSON.parse(user)))
      .catch((res) => {
        // console.log(res.status)
        // if token is no longer valid, clear it from sessionStorage
        if (res.status === 401) {
          toast.failure('No longer signed in')
          sessionStorage.clear()
        }
      })
  } else {
    // console.log('sessionCreds user doesn\'t exist')
  }
}

const onSignUp = function (event) {
  event.preventDefault()

  const data = getFormFields(this)
  // console.log('data is ', data)
  authAPI.signUp(data)
    .then(authUI.signUpSuccess)
    .then(() => authAPI.signIn(data))
    .then(authUI.signInSuccess)
    .catch(authUI.signUpFailure)
}

const onSignIn = function (event) {
  event.preventDefault()

  const data = getFormFields(this)
  // console.log('data is ', data)
  authAPI.signIn(data)
    .then((res) => {
      // console.log('res is ', res)
      sessionStorage.setItem('user', JSON.stringify(res))
      return res
    })
    .then((res) => {
      const credentials = JSON.parse(sessionStorage.getItem('user'))
      // console.log('session credentials is ', credentials.user.token)
      return res
    })
    .then(authUI.signInSuccess)
    .then(() => $('#sign-in-button').click())
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
  $('#signUpModal').on('hide.bs.modal', function () { $('#sign-up')[0].reset() })
  $('#signInModal').on('hide.bs.modal', function () { $('#sign-in')[0].reset() })
}

module.exports = {
  addHandlers,
  checkSessionCreds
}
