'use strict'

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

module.exports = {
  signUpSuccess,
  signUpFailure
}
