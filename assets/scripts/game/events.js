'use strict'

const gameAPI = require('./api.js')
const gameUI = require('./ui.js')
const gameEngine = require('./engine.js')
const getFormFields = require('../../../lib/get-form-fields')
const store = require('../store')
const shopAPI = require('../shop/api.js')

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
    $('#close-all-games-modal').click()
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
  if (store.accountPurchases['sweep']) {
    const game = gameEngine.movePlayer('down', 'sweep')
    gameUI.updateMapUI(game)
  } else {
    gameEngine.addGameMessage('You must unlock Sweeping Strike in the store to use it!')
  }
}

const onBlastAttack = function (event) {
  event.preventDefault()

  if (store.accountPurchases['blast']) {
    const direction = event.currentTarget.id.split('-')[1]
    const game = gameEngine.movePlayer(direction, 'blast')
    gameUI.updateMapUI(game)
  } else {
    gameEngine.addGameMessage('You must unlock Lightning Blast in the store to use it!')
  }
}

const onHeal = function (event) {
  event.preventDefault()
  if (store.accountPurchases.healthPotions > 0) {
    console.log('before:', store.accountPurchases)
    // heal player in game engine
    const game = gameEngine.movePlayer('down', 'heal')
    gameUI.updateMapUI(game)
    // remove a heal purchase from local store and update API
    const purchaseID = store.accountPurchases.healPurchaseIDs.shift()
    shopAPI.deletePurchase(purchaseID)
    store.accountPurchases.healthPotions -= 1
    $('#current-heals').text('(' + store.accountPurchases.healthPotions + ')')
    console.log('after:', store.accountPurchases)
  } else {
    gameEngine.addGameMessage('You must buy more Healing Potions in the store!')
  }
}

const onGetHighScores = function (event) {
  event.preventDefault()
  console.log('high scores!')
  gameAPI.getHighScores()
    .then(gameUI.getHighScoresSuccess)
    .catch(gameUI.getHighScoresFailure)
}

const addHandlers = () => {
  $('#get-all-games').on('click', onGetAllGames)
  $('#get-game').on('submit', onGetGame)
  $('#create-new-game').on('click', onCreateNewGame)
  $('#start-game').on('submit', onCreateNewGame)
  $('#update-game').on('submit', onUpdateGame)
  $('.all-games-content').on('click', '.delete-button', onDeleteGame)
  $('.all-games-content').on('click', '.load-button', onGetGame)
  $('#move-left').on('click', onMakeMove)
  $('#move-right').on('click', onMakeMove)
  $('#move-up').on('click', onMakeMove)
  $('#move-down').on('click', onMakeMove)
  $('#blast-left').on('click', onBlastAttack)
  $('#blast-right').on('click', onBlastAttack)
  $('#blast-up').on('click', onBlastAttack)
  $('#blast-down').on('click', onBlastAttack)
  $('#sweep-button').on('click', onSweepAttack)
  $('#heal-button').on('click', onHeal)
  $('#get-high-scores').on('click', onGetHighScores)
}

module.exports = {
  addHandlers
}
