'use strict'

const showAllGamesTemplate = require('../templates/game-listing.handlebars')
const showHighScoresTemplate = require('../templates/score-listing.handlebars')
// const gameMessageTemplate = require('../templates/game-message.handlebars')
// const gameEngine = require('./engine.js')
const store = require('../store')
const toast = require('../toasts.js')

const getAllGamesSuccess = function (data) {
  const showAllGamesHtml = showAllGamesTemplate({ games: data.games })
  $('#all-games-content').html(showAllGamesHtml)
  // $('#account-message').text('Games retrieved!')
  // $('#account-message').css('background-color', '#5cb85c')
  toast.success('Games retrieved!')
}

const getAllGamesFailure = function (error) {
  // $('#account-message').text('Error on getting games!')
  // $('#account-message').css('background-color', '#d9534f')
  toast.failure('Error getting games!')
  console.log(error)
}

const getGameSuccess = function (data) {
  $('#game-wrapper-div').show()
  $('#game-input-wrapper').show()
  // $('#account-message').text('Game retrieved!')
  // $('#account-message').css('background-color', '#5cb85c')
  toast.success('Game Loaded!')
  const showGameHtml = showAllGamesTemplate({ games: data })
  $('#all-games-content').html(showGameHtml)
  $('#game-message').text('Game Loaded! Pick up where you left off and kill as many Goblins as you can before you die!')
  $('#get-game').find('input:text').val('')
}

const getGameFailure = function (error) {
  // $('#account-message').text('Error retrieving game!')
  // $('#account-message').css('background-color', '#d9534f')
  toast.failure('Error retrieving game!')
  console.log(error)
  $('#get-game').find('input:text').val('')
}

const createGameSuccess = function () {
  $('#game-wrapper-div').show()
  $('#game-message').text('New Game! See how many Gobs you can kill before dying!')
  $('#game-message').css('background-color', '#fefefe')
  $('#game-input-wrapper').show()
}

// updates the UI map/score/etc to match the internal map
const updateMapUI = function (game) {
  $('#current-round').text(game.round)
  $('#current-hp').text(game.hp)
  $('#current-score').text(game.score)
  $('#current-game').text(game.gameId)
  if (game.over) {
    $('#game-input-wrapper').hide()
  }

  for (let y = 0; y < 5; y++) {
    const ID1 = '#mark' + y
    for (let x = 0; x < 5; x++) {
      const spotID = ID1 + x
      if (game.map[y][x] === '{o!') {
        switch (game.player.lastMove) {
          case 'up':
            $(spotID).html('<img src="http://res.cloudinary.com/ismurray/image/upload/v1520858541/male-sprite-up.png" alt="player" height="42" width="42">')
            break
          case 'down':
            $(spotID).html('<img src="http://res.cloudinary.com/ismurray/image/upload/v1520858540/male-sprite-down.png" alt="player" height="42" width="42">')
            break
          case 'left':
            $(spotID).html('<img src="http://res.cloudinary.com/ismurray/image/upload/v1520858540/male-sprite-left.png" alt="player" height="42" width="42">')
            break
          case 'right':
            $(spotID).html('<img src="http://res.cloudinary.com/ismurray/image/upload/v1520858540/male-sprite-right.png" alt="player" height="42" width="42">')
            break
          case undefined:
            $(spotID).html('<img src="http://res.cloudinary.com/ismurray/image/upload/v1520858541/male-sprite-up.png" alt="player" height="42" width="42">')
            break
        }
      } else if (game.map[y][x] === '...') {
        // $(spotID).text(game.map[y][x])
        $(spotID).text('')
      }
    }
  }
  for (let i = 0; i < game.liveGoblins.length; i++) {
    const ID1 = '#mark' + game.liveGoblins[i].position[0]
    const spotID = ID1 + game.liveGoblins[i].position[1]
    switch (game.liveGoblins[i].lastMove) {
      case 'up':
        $(spotID).html('<img src="http://res.cloudinary.com/ismurray/image/upload/v1520858541/goblin-up.png" alt="goblin" height="42" width="42">')
        break
      case 'down':
        $(spotID).html('<img src="http://res.cloudinary.com/ismurray/image/upload/v1520858540/goblin-down.png" alt="goblin" height="42" width="42">')
        break
      case 'left':
        $(spotID).html('<img src="http://res.cloudinary.com/ismurray/image/upload/v1520858540/goblin-left.png" alt="goblin" height="42" width="42">')
        break
      case 'right':
        $(spotID).html('<img src="http://res.cloudinary.com/ismurray/image/upload/v1520858540/goblin-right.png" alt="goblin" height="42" width="42">')
        break
      case undefined:
        $(spotID).html('<img src="http://res.cloudinary.com/ismurray/image/upload/v1520858540/goblin-down.png" alt="player" height="42" width="42">')
        break
    }
  }
}

const createGameFailure = function (error) {
  // $('#account-message').text('Error creating game!')
  // $('#account-message').css('background-color', '#d9534f')
  toast.failure('Error creating game!')
  console.log(error)
  $('#create-game').find('input:text').val('')
}

const deleteGameSuccess = function (id) {
  const currentGameId = $('#current-game').text()
  if (currentGameId === store.deletedGameId) {
    $('#game-wrapper-div').hide()
  }
  // $('#account-message').text('You have deleted a game!')
  // $('#account-message').css('background-color', '#5cb85c')
  toast.success('You have deleted a game!')
}

const deleteGameFailure = function (error) {
  // $('#account-message').text('Error deleting game!')
  // $('#account-message').css('background-color', '#d9534f')
  toast.failure('Error deleting game!')
  console.log(error)
}

const getHighScoresSuccess = function (data) {
  const showHighScoresHtml = showHighScoresTemplate({ scores: data })
  $('#high-scores-content').html(showHighScoresHtml)
  // $('#account-message').text('Scores retrieved!')
  // $('#account-message').css('background-color', '#5cb85c')
  toast.success('Scores retrieved!')
}

const getHighScoresFailure = function (error) {
  // $('#account-message').text('Error on getting scores!')
  // $('#account-message').css('background-color', '#d9534f')
  toast.failure('Error getting scores!')
  console.log(error)
}

module.exports = {
  getAllGamesSuccess,
  getAllGamesFailure,
  getGameSuccess,
  getGameFailure,
  createGameSuccess,
  createGameFailure,
  deleteGameSuccess,
  deleteGameFailure,
  updateMapUI,
  getHighScoresSuccess,
  getHighScoresFailure
}
