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
  let id
  // if getting game by id, use input value
  if ($('#get-game input').val()) {
    id = $('#get-game input').val()
  // if getting game from all games list, use data id
  } else if ($(event.currentTarget).attr('data-id')) {
    id = $(event.currentTarget).attr('data-id')
  }

  gameAPI.getGame(id)
    .then(gameEngine.loadGame)
    .then(gameUI.getGameSuccess)
    .catch(gameUI.getGameFailure)
}

// Creates new game in API, loads server response into game engine. Then
// initializes new game in the engine and updates the visual game UI
const onCreateNewGame = function (event) {
  event.preventDefault()
  gameAPI.createGame()
    .then(gameEngine.createNewGame)
    .then(gameUI.createGameSuccess)
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
  const game = gameEngine.movePlayer(direction, 'attack')
  gameUI.updateMapUI(game)
}

const onSweepAttack = function (event) {
  event.preventDefault()
  const game = gameEngine.movePlayer('down', 'sweep')
  gameUI.updateMapUI(game)
}

const onHeal = function (event) {
  event.preventDefault()
  const game = gameEngine.movePlayer('down', 'heal')
  gameUI.updateMapUI(game)
}


const addHandlers = () => {
  $('#get-all-games').on('submit', onGetAllGames)
  $('#get-game').on('submit', onGetGame)
  $('#create-new-game').on('click', onCreateNewGame)
  $('#update-game').on('submit', onUpdateGame)
  $('.content').on('click', '.delete-button', onDeleteGame)
  $('.content').on('click', '.load-button', onGetGame)
  $('#move-left').on('click', onMakeMove)
  $('#move-right').on('click', onMakeMove)
  $('#move-up').on('click', onMakeMove)
  $('#move-down').on('click', onMakeMove)
  $('#sweep-button').on('click', onSweepAttack)
  $('#heal-button').on('click', onHeal)
}

module.exports = {
  addHandlers
}
