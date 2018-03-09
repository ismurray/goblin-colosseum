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

const getGameSuccess = function (data) {
  $('#account-message').text('Game retrieved!')
  $('#account-message').css('background-color', '#5cb85c')
  const showGameHtml = showAllGamesTemplate({ games: data })
  $('#content').html(showGameHtml)
  $('#get-game').find('input:text').val('')
}

const getGameFailure = function (error) {
  $('#account-message').text('Error retrieving game!')
  $('#account-message').css('background-color', '#d9534f')
  console.log(error)
  $('#get-game').find('input:text').val('')
}

const createGameSuccess = function (data) {
  $('#account-message').text('You have created a game!')
  $('#account-message').css('background-color', '#5cb85c')
  const addNewGameHtml = showAllGamesTemplate({ games: data })
  $('#content').append(addNewGameHtml)
  $('#create-game').find('input:text').val('')
}

const createGameFailure = function (error) {
  $('#account-message').text('Error creating game!')
  $('#account-message').css('background-color', '#d9534f')
  console.log(error)
  $('#create-game').find('input:text').val('')
}

const updateGameSuccess = function (id) {
  $('#account-message').text('You have updated a game!')
  $('#account-message').css('background-color', '#5cb85c')
  $('#get-all-games-button').click()
  $('#update-game').find('input:text').val('')
}

const updateGameFailure = function (error) {
  $('#account-message').text('Error updating game!')
  $('#account-message').css('background-color', '#d9534f')
  console.log(error)
  $('#update-game').find('input:text').val('')
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
  getGameSuccess,
  getGameFailure,
  createGameSuccess,
  createGameFailure,
  updateGameSuccess,
  updateGameFailure,
  deleteGameSuccess,
  deleteGameFailure
}
