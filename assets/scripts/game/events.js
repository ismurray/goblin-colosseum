'use strict'

const gameAPI = require('./api.js')
const gameUI = require('./ui.js')
const gameEngine = require('./engine.js')
const getFormFields = require('../../../lib/get-form-fields')

const onGetAllGames = function (event) {
  event.preventDefault()
  gameAPI.getAllGames()
    .then(gameUI.getAllGamesSuccess)
    .catch(gameUI.getAllGamesFailure)
}

const onGetGame = function (event) {
  event.preventDefault()

  const id = $('#get-game input').val()
  console.log('id is ', id)

  gameAPI.getGame(id)
    .then(gameUI.getGameSuccess)
    .catch(gameUI.getGameFailure)
}

const onCreateGame = function (event) {
  event.preventDefault()

  const data = getFormFields(this)
  console.log('data is ', data)

  gameAPI.createGame(data)
    .then(gameUI.createGameSuccess)
    .catch(gameUI.createGameFailure)
}

// Resets internal game and game UI
const onNewGame = function (event) {
  event.preventDefault()
  console.log('clicked!')
  gameEngine.createNewGame()
}

const onUpdateGame = function (event) {
  event.preventDefault()

  const id = $('#update-game input').val()
  const data = getFormFields(this)

  gameAPI.updateGame(id, data)
    .then(gameUI.updateGameSuccess)
    .catch(gameUI.updateGameFailure)
}

const onDeleteGame = (event) => {
  event.preventDefault()
  const id = $(event.currentTarget).attr('data-id')

  const getElement = '[data-id=' + id + ']'
  $(getElement).empty()
  gameAPI.deleteGame(id)
    .then(gameUI.deleteGameSuccess)
    .catch(gameUI.deleteGameFailure)
}

const addHandlers = () => {
  $('#get-all-games').on('submit', onGetAllGames)
  $('#get-game').on('submit', onGetGame)
  $('#create-game').on('submit', onCreateGame)
  $('#update-game').on('submit', onUpdateGame)
  $('.content').on('click', 'button', onDeleteGame)
  $('#new-game-button').on('click', onNewGame)
}

module.exports = {
  addHandlers
}
