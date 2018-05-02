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
  toast.success('Games retrieved!')
}

const getAllGamesFailure = function (error) {
  toast.failure('Error getting games!')
  console.log(error)
}

const getGameSuccess = function (data) {
  $('#game-wrapper-div').show()
  $('#game-input-wrapper').show()
  toast.success('Game Loaded!')
  const showGameHtml = showAllGamesTemplate({ games: data })
  $('#all-games-content').html(showGameHtml)
  $('#game-message').text('Game Loaded! Pick up where you left off and kill as many Goblins as you can before you die!')
  $('#get-game').find('input:text').val('')
  // add keyboard input listener
  document.addEventListener('keydown', keyDownHandler, false)
}

const getGameFailure = function (error) {
  toast.failure('Error retrieving game!')
  console.log(error)
  $('#get-game').find('input:text').val('')
}

const createGameSuccess = function () {
  $('#game-wrapper-div').show()
  $('#game-message').text('New Game! See how many Gobs you can kill before dying!')
  $('#game-message').css('background-color', '#fefefe')
  $('#game-input-wrapper').show()
  // add keyboard input listener
  document.addEventListener('keydown', keyDownHandler, false)
}

// updates the UI map/score/etc to match the internal map
const updateMapUI = function (game) {
  $('#current-round').text(game.round)
  $('#current-hp').text(game.hp)
  $('#current-score').text(game.score)
  $('#current-game').text(game.gameId)
  if (game.over) {
    $('#game-input-wrapper').hide()
    document.removeEventListener('keydown', keyDownHandler, false)
    toast.gameOver('You Died! TRY AGAIN')
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
  toast.failure('Error creating game!')
  console.log(error)
  $('#create-game').find('input:text').val('')
}

const deleteGameSuccess = function (id) {
  const currentGameId = $('#current-game').text()
  if (currentGameId === store.deletedGameId) {
    $('#game-wrapper-div').hide()
  }
  toast.success('You have deleted a game!')
}

const deleteGameFailure = function (error) {
  toast.failure('Error deleting game!')
  console.log(error)
}

const getHighScoresSuccess = function (data) {
  const showHighScoresHtml = showHighScoresTemplate({ scores: data })
  $('#high-scores-content').html(showHighScoresHtml)
  toast.success('Scores retrieved!')
}

const getHighScoresFailure = function (error) {
  toast.failure('Error getting scores!')
  console.log(error)
}

// handles keyboard inputs for game actions
const keyDownHandler = function (event) {
  // console.log('event.key is ', event.key)
  switch (event.key) {
    case 'w':
      // console.log('move/attack up!')
      $('#move-up').click()
      break
    case 'a':
      // console.log('move/attack left!')
      $('#move-left').click()
      break
    case 's':
      // console.log('move/attack down!')
      $('#move-down').click()
      break
    case 'd':
      // console.log('move/attack right!')
      $('#move-right').click()
      break
    case 'W':
      // console.log('lightning blast up!')
      $('#blast-up').click()
      break
    case 'A':
      // console.log('lightning blast left!')
      $('#blast-left').click()
      break
    case 'S':
      // console.log('lightning blast down!')
      $('#blast-down').click()
      break
    case 'D':
      // console.log('lightning blast right!')
      $('#blast-right').click()
      break
    case 'e':
      // console.log('Sweeping Strike!')
      $('#sweep-button').click()
      break
    case 'r':
      // console.log('Healing Potion!')
      $('#heal-button').click()
      break
  }
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
  getHighScoresFailure,
  keyDownHandler
}
