'use strict'

const gameAPI = require('./api.js')
const gameUI = require('./ui.js')

const onGetAllGames = function (event) {
  event.preventDefault()
  gameAPI.getAllGames()
    .then(gameUI.getAllGamesSuccess)
    .catch(gameUI.getAllGamesFailure)
}

const addHandlers = () => {
  $('#get-all-games').on('submit', onGetAllGames)
}

module.exports = {
  addHandlers
}
