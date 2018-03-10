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

// Creates new game in API, loads server response into game engine. Then
// initializes new game in the engine and updates the visual game UI
const onCreateNewGame = function (event) {
  event.preventDefault()
  gameAPI.createGame()
    .then(gameEngine.createNewGame)
    .catch(gameUI.createGameFailure)
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

const onMakeMove = function (event) {
  event.preventDefault()
  const direction = event.currentTarget.id.split('-')[1]
  const game = gameEngine.movePlayer(direction)
  gameUI.createGameSuccess(game)
}

const addHandlers = () => {
  $('#get-all-games').on('submit', onGetAllGames)
  $('#get-game').on('submit', onGetGame)
  $('#create-new-game').on('click', onCreateNewGame)
  $('#update-game').on('submit', onUpdateGame)
  $('.content').on('click', 'button', onDeleteGame)
  $('#move-left').on('click', onMakeMove)
  $('#move-right').on('click', onMakeMove)
  $('#move-up').on('click', onMakeMove)
  $('#move-down').on('click', onMakeMove)
}

module.exports = {
  addHandlers
}
