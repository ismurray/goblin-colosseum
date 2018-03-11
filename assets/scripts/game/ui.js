'use strict'

const showAllGamesTemplate = require('../templates/game-listing.handlebars')
// const gameMessageTemplate = require('../templates/game-message.handlebars')
// const gameEngine = require('./engine.js')

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
  $('#game-message').text('Game Loaded! Pick up where you left off and kill as many Goblins as you can before you die!')
  $('#get-game').find('input:text').val('')
}

const getGameFailure = function (error) {
  $('#account-message').text('Error retrieving game!')
  $('#account-message').css('background-color', '#d9534f')
  console.log(error)
  $('#get-game').find('input:text').val('')
}

const createGameSuccess = function () {
  $('#game-message').text('New Game! See how many Gobs you can kill before dying!')
  $('#game-message').css('background-color', '#fefefe')
}

// updates the UI map/score/etc to match the internal map
const updateMapUI = function (game) {
  $('#current-round').text(game.round)
  $('#current-hp').text(game.hp)
  $('#current-score').text(game.score)
  $('#current-game').text(game.gameId)
  for (let y = 0; y < 5; y++) {
    const ID1 = '#mark' + y
    for (let x = 0; x < 5; x++) {
      const spotID = ID1 + x
      if (game.map[y][x] === '{o!') {
        switch (game.player.lastMove) {
          case 'up':
            $(spotID).html('<img src="./assets/resources/male-sprite-up.png" alt="player" height="42" width="42">')
            break
          case 'down':
            $(spotID).html('<img src="./assets/resources/male-sprite-down.png" alt="player" height="42" width="42">')
            break
          case 'left':
            $(spotID).html('<img src="./assets/resources/male-sprite-left.png" alt="player" height="42" width="42">')
            break
          case 'right':
            $(spotID).html('<img src="./assets/resources/male-sprite-right.png" alt="player" height="42" width="42">')
            break
        }
      } else if (game.map[y][x] === '...') {
        $(spotID).text(game.map[y][x])
      }
    }
  }
  for (let i = 0; i < game.liveGoblins.length; i++) {
    const ID1 = '#mark' + game.liveGoblins[i].position[0]
    const spotID = ID1 + game.liveGoblins[i].position[1]
    console.log('spotID: ', spotID)
    switch (game.liveGoblins[i].lastMove) {
      case 'up':
        $(spotID).html('<img src="./assets/resources/goblin-up.png" alt="goblin" height="42" width="42">')
        break
      case 'down':
        $(spotID).html('<img src="./assets/resources/goblin-down.png" alt="goblin" height="42" width="42">')
        break
      case 'left':
        $(spotID).html('<img src="./assets/resources/goblin-left.png" alt="goblin" height="42" width="42">')
        break
      case 'right':
        $(spotID).html('<img src="./assets/resources/goblin-right.png" alt="goblin" height="42" width="42">')
        break
    }
  }
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
  deleteGameFailure,
  updateMapUI
}
