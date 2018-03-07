'use strict'

const config = require('../config.js')
const store = require('../store')

const signUp = function (data) {
  return $.ajax({
    url: config.apiOrigin + '/sign-up',
    method: 'POST',
    headers: {
      contentType: 'application/json'
    },
    data
  })
}

const signIn = function (data) {
  return $.ajax({
    url: config.apiOrigin + '/sign-in',
    method: 'POST',
    headers: {
      contentType: 'application/json'
    },
    data
  })
}

const signOut = function () {
  return $.ajax({
    url: config.apiOrigin + '/sign-out',
    method: 'DELETE',
    headers: {
      contentType: 'application/json',
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const changePassword = function (data) {
  return $.ajax({
    url: config.apiOrigin + '/change-password',
    method: 'PATCH',
    headers: {
      contentType: 'application/json',
      Authorization: 'Token token=' + store.user.token
    },
    data
  })
}

module.exports = {
  signUp,
  signIn,
  signOut,
  changePassword
}
