'use strict'

const showAllGamesTemplate = require('../templates/game-listing.handlebars')

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

module.exports = {
  getAllGamesSuccess,
  getAllGamesFailure
}
