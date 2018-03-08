'use strict'

const gameAPI = require('./api.js')
const gameUI = require('./ui.js')
const getFormFields = require('../../../lib/get-form-fields')

const onGetAllGames = function (event) {
  event.preventDefault()
  gameAPI.getAllGames()
    .then(gameUI.getAllGamesSuccess)
    .catch(gameUI.getAllGamesFailure)
}

const onCreateGame = function (event) {
  event.preventDefault()

  const data = getFormFields(this)
  console.log('data is ', data)

  gameAPI.createGame(data)
    .then(gameUI.createGameSuccess)
    .catch(gameUI.createGameFailure)
}

const addHandlers = () => {
  $('#get-all-games').on('submit', onGetAllGames)
  $('#create-game').on('submit', onCreateGame)
}

module.exports = {
  addHandlers
}
