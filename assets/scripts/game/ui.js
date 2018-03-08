'use strict'

const showAllGamesTemplate = require('../templates/game-listing.handlebars')

const getAllGamesSuccess = function (data) {
  console.log(data.games)
  const showAllGamesHtml = showAllGamesTemplate({ games: data.games })
  $('#content').html(showAllGamesHtml)
  $('#account-message').text('Games retrieved!')
  $('#account-message').css('background-color', '#5cb85c')
}

const getAllGamesFailure = function (error) {
  $('#account-message').text('Error on getting games!')
  $('#account-message').css('background-color', '#d9534f')
  console.log(error)
}

const createGameSuccess = function (data) {
  $('#account-message').text('You have created a game!')
  $('#account-message').css('background-color', '#5cb85c')
  const addNewGameHtml = showAllGamesTemplate({ games: data })
  $('#content').append(addNewGameHtml)
  // For some reason clearing the text field works, but not the number field
  // $('#create-game').find('input:text').val('')
  // $('#create-game').find('input:number').val('')
}

const createGameFailure = function (error) {
  $('#account-message').text('Error creating game!')
  $('#account-message').css('background-color', '#d9534f')
  console.log(error)
}

const deleteGameSuccess = function (id) {
  $('#account-message').text('You have deleted a game!')
  $('#account-message').css('background-color', '#5cb85c')
}

const deleteGameFailure = function (error) {
  $('#account-message').text('Error deleting game!')
  $('#account-message').css('background-color', '#d9534f')
  console.log(error)
}

module.exports = {
  getAllGamesSuccess,
  getAllGamesFailure,
  createGameSuccess,
  createGameFailure,
  deleteGameSuccess,
  deleteGameFailure
}
