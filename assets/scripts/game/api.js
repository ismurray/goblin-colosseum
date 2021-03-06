'use strict'

const config = require('../config.js')
const store = require('../store')

const getAllGames = function (data) {
  return $.ajax({
    url: config.apiOrigin + '/games',
    method: 'GET',
    headers: {
      contentType: 'application/json',
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const getGame = function (id) {
  return $.ajax({
    url: config.apiOrigin + '/games/' + id,
    method: 'GET',
    headers: {
      contentType: 'application/json',
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const createGame = function () {
  return $.ajax({
    url: config.apiOrigin + '/games',
    method: 'POST',
    headers: {
      contentType: 'application/json',
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const updateGame = function (gamePack) {
  const data = gamePack.data
  return $.ajax({
    url: config.apiOrigin + '/games/' + gamePack.id,
    method: 'PATCH',
    headers: {
      contentType: 'application/json',
      Authorization: 'Token token=' + store.user.token
    },
    data
  })
}

const deleteGame = function (id) {
  store.deletedGameId = id
  return $.ajax({
    url: config.apiOrigin + '/games/' + id,
    method: 'DELETE',
    headers: {
      contentType: 'application/json',
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const getHighScores = function (data) {
  return $.ajax({
    url: config.apiOrigin + '/high-scores/10',
    method: 'GET',
    headers: {
      contentType: 'application/json',
      Authorization: 'Token token=' + store.user.token
    }
  })
}

module.exports = {
  getAllGames,
  getGame,
  createGame,
  updateGame,
  deleteGame,
  getHighScores
}
