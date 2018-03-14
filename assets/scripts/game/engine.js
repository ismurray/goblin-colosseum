'use strict'

const gameAPI = require('./api.js')
const shopEvents = require('../shop/events.js')

// initial variables
const rowLength = 5
let map = []
// playerStartPos = [4, 2]
// gobStartPos = [0, 3]

// Sample game state data that could come from API:
let apiGame = {
  // id and user_id will be some integer
  // id: 50,
  // user_id: 2,
  // below values will always be set to this for a new game
  score: 0,
  round: 1,
  over: false,
  player_state: null,
  goblin_state: null
}

const localGame = {
  score: 0,
  round: 1,
  over: false,
  playerState: {
    name: 'player',
    position: [4, 2],
    hp: [10, 10],
    attackDmg: 5,
    alive: true
  },
  goblinState: []
}

// API FUNCTIONS:

// initializes new game, resets variables
const createNewGame = function (data) {
  // store new game data from api in local object
  apiGame = data.game
  // initialize local game variables to the default values from API for new game
  localGame.score = apiGame.score
  localGame.round = apiGame.round
  localGame.over = apiGame.over
  // initialize goblin and player data, since API just defaults to null on new game
  localGame.goblinState = []
  localGame.playerState = {
    name: 'player',
    position: [4, 2],
    hp: [10, 10],
    attackDmg: 5,
    alive: true,
    goblinCount: 1,
    lastMove: 'up'
  }
  // initialize internal map
  resetMap(rowLength)
  // set the neighborIndices for player, spawn goblins, then set their neighbors
  setNeighborIndices(localGame.playerState)
  spawnCheck(localGame.round)
  for (let i = 0; i < localGame.goblinState.length; i++) {
    setNeighborIndices(localGame.goblinState[i])
  }
  // package data for gameUI, and call a UI update
  updateUI()
  // package game data and send to API
  const gameData = packageGameData()
  gameAPI.updateGame(gameData)
}

// loads a game from the API, unpacks the data, initializes game and updates UI
const loadGame = function (data) {
  // store game data from api in local object
  apiGame = data.game
  // unpack player/gob data from JSON to hash/array
  apiGame.player_state = JSON.parse(data.game.player_state)
  apiGame.goblin_state = JSON.parse(data.game.goblin_state)
  // initialize local game variables to the default values from API for new game
  localGame.score = apiGame.score
  localGame.round = apiGame.round
  localGame.over = apiGame.over
  // initialize goblin and player data, since API just defaults to null on new game
  localGame.goblinState = apiGame.goblin_state
  localGame.playerState = apiGame.player_state
  localGame.playerState.goblinCount = (localGame.playerState.goblinCount === undefined ? localGame.score + 1 : localGame.playerState.goblinCount)
  // reset and update internal map
  resetMap(rowLength)
  updateMap(localGame.playerState, localGame.goblinState)
  // package data for gameUI, and call a UI update
  updateUI()
}

// packages data for gameUI, and calls a UI update
const updateUI = function () {
  // have to include gameUI here or it won't be defined when this is called from
  // within gameEvents. Something to do with context?
  const gameUI = require('./ui.js')
  // package data for gameUI

  const liveGoblins = findLiveGoblins(localGame.goblinState)
  const gameUiData = {
    map: updateMap(localGame.playerState, localGame.goblinState),
    score: localGame.score,
    round: localGame.round,
    hp: localGame.playerState.hp[0],
    liveGoblins: liveGoblins,
    player: localGame.playerState,
    gameId: apiGame.id,
    over: localGame.over
  }
  // print game data to UI
  gameUI.updateMapUI(gameUiData)
}

const packageGameData = function () {
  const dataPack = {
    id: apiGame.id,
    data: {
      game: {
        score: localGame.score,
        round: localGame.round,
        over: localGame.over,
        player_state: JSON.stringify(localGame.playerState),
        goblin_state: JSON.stringify(localGame.goblinState)
      }
    }
  }
  return dataPack
}

// MAP FUNCTIONS:

// initializes the game map to be a 2D array filled with empty spaces
const resetMap = function (rowLength) {
  map = []
  for (let i = 0; i < rowLength; i++) {
    const row = []
    for (let n = 0; n < rowLength; n++) {
      row.push('...')
    }
    map.push(row)
  }
  return map
}

// update player position on internal map
const updateMap = function (player, goblins) {
  map = resetMap(rowLength)
  if (player.alive) {
    map[player.position[0]][player.position[1]] = '{o!'
  }
  for (let i = 0; i < goblins.length; i++) {
    if (goblins[i].alive) {
      map[goblins[i].position[0]][goblins[i].position[1]] = 'rw}'
    }
  }
  return map
}

// PLAYER/GOBLIN FUNCTIONS:

// Creates a hash of the indices of all four neighboring cells for a given combatant
const setNeighborIndices = function (combatant) {
  combatant.neighborIndices = {
    up: [combatant.position[0] - 1, combatant.position[1]],
    down: [combatant.position[0] + 1, combatant.position[1]],
    left: [combatant.position[0], combatant.position[1] - 1],
    right: [combatant.position[0], combatant.position[1] + 1]
  }
  validateNeighborIndices(combatant)
}

// Set any neighborIndices that are outside the map to 'wall'
const validateNeighborIndices = function (combatant) {
  // If player is in top row, set up to 'wall'
  if (combatant.position[0] === 0) {
    combatant.neighborIndices.up = 'wall'
  }
  // If player is in bottom row, set down to 'wall'
  if (combatant.position[0] === rowLength - 1) {
    combatant.neighborIndices.down = 'wall'
  }
  // If player is at far left, set left to 'wall'
  if (combatant.position[1] === 0) {
    combatant.neighborIndices.left = 'wall'
  }
  // If player is at far right, set right to 'wall'
  if (combatant.position[1] === rowLength - 1) {
    combatant.neighborIndices.right = 'wall'
  }
}

// moves the goblin 'up', 'down', 'left', or 'right'
// prevents invalid movement and calls attack if destination cell is occupied by
// opposite goblin type
const moveGoblin = function (goblin, direction) {
  goblin.lastMove = direction
  const destination = goblin.neighborIndices[direction]
  const currentPos = goblin.position
  map = updateMap(localGame.playerState, localGame.goblinState)
  // prevent goblin from walking off map
  if (destination === 'wall') {
    addGameMessage('A goblin attacks the wall in frustration')
  // if destination is empty, move goblin to that space and update neighbors
  // prevents gobs from moving over or attacking each other
  } else if (map[destination[0]][destination[1]] === '...') {
    goblin.position = goblin.neighborIndices[direction]
    setNeighborIndices(goblin)
  // if destination is occupied by opposite type (gob -> player),
  // call attack function
  } else if (map[destination[0]][destination[1]] !== map[currentPos[0]][currentPos[1]]) {
    targetAttack(goblin, destination)
  }
  return updateMap(localGame.playerState, localGame.goblinState)
}

// runs the player's and gobs turn when user inputs a direction
const movePlayer = function (direction, ability) {
  // resetAttackAnimations()
  localGame.playerState.lastMove = direction
  const destination = localGame.playerState.neighborIndices[direction]
  const currentPos = localGame.playerState.position
  map = updateMap(localGame.playerState, localGame.goblinState)
  if (ability === 'attack') {
    // prevent player from walking off map
    if (destination === 'wall') {
      addGameMessage('You spend your turn attacking the wall. It doesn\'t seem effective')
    // if destination is empty, move player to that space and update neighbors
    } else if (map[destination[0]][destination[1]] === '...') {
      localGame.playerState.position = localGame.playerState.neighborIndices[direction]
      setNeighborIndices(localGame.playerState)
    // if destination is occupied by opposite type (gob -> player or player -> gob),
    // call attack function
    } else if (map[destination[0]][destination[1]] !== map[currentPos[0]][currentPos[1]]) {
      targetAttack(localGame.playerState, destination)
    }
  // Trigger sweeping attack
  } else if (ability === 'sweep') {
    sweepAttack(localGame.playerState)
  // Trigger healing ability
  } else if (ability === 'heal') {
    heal(localGame.playerState)
  // Trigger blast ability
  } else if (ability === 'blast') {
    blastAttack(localGame.playerState, direction)
  }
  // when player's turn is ending, run all the gobs' turns, increase the round
  // count, and do a spawnCheck
  goblinTurns(localGame.goblinState)
  localGame.round += 1
  spawnCheck(localGame.round)

  // make list of live goblins
  const liveGoblins = findLiveGoblins(localGame.goblinState)
  const game = {
    map: updateMap(localGame.playerState, localGame.goblinState),
    score: localGame.score,
    round: localGame.round,
    hp: localGame.playerState.hp[0],
    liveGoblins: liveGoblins,
    player: localGame.playerState,
    gameId: apiGame.id,
    over: localGame.over
  }
  buryDeadGobs(localGame.goblinState)
  const gameData = packageGameData()
  gameAPI.updateGame(gameData)
  return game
}

// Takes player obect as input to enact an attack at all four directions
const sweepAttack = function (player) {
  addGameMessage('player makes a sweeping attack that strikes at all four sides')
  const attackDestinations = [
    player.neighborIndices['up'],
    player.neighborIndices['down'],
    player.neighborIndices['left'],
    player.neighborIndices['right']
  ]
  for (let i = 0; i < attackDestinations.length; i++) {
    // attackAnimation(attackDestinations[i])
    targetAttack(player, attackDestinations[i])
  }
}

// Takes player obect as input to enact an attack at all four directions
const blastAttack = function (player, direction) {
  addGameMessage('player shoots a crackling beam of energy that hits all enemies in a line')
  const attackDestinations = blastAttackTargets(player, direction)
  if (attackDestinations.length > 0) {
    for (let i = 0; i < attackDestinations.length; i++) {
      // attackAnimation(attackDestinations[i])
      targetAttack(player, attackDestinations[i])
    }
  } else {
    addGameMessage('player shoots a crackling beam of energy that doesn\'t seem to damage the wall')
  }
}

const heal = function (player) {
  const formerHP = player.hp[0]
  player.hp[0] = player.hp[1]
  const text = `player quaffs a healing potion, raising their HP from ${formerHP} to ${player.hp[0]}!`
  addGameMessage(text)
}

const blastAttackTargets = function (player, direction) {
  const targets = []
  const virtualCombatant = {position: []}
  virtualCombatant.position[0] = player.position[0]
  virtualCombatant.position[1] = player.position[1]
  for (let i = 0; i < rowLength; i++) {
    setNeighborIndices(virtualCombatant)
    if (virtualCombatant.neighborIndices[direction] !== 'wall') {
      targets.push(virtualCombatant.neighborIndices[direction])
      virtualCombatant.position[0] = virtualCombatant.neighborIndices[direction][0]
      virtualCombatant.position[1] = virtualCombatant.neighborIndices[direction][1]
    } else {
      break
    }
  }
  return targets
}

// returns an array of live goblins
const findLiveGoblins = function (goblins) {
  const liveGoblins = []
  for (let i = 0; i < goblins.length; i++) {
    if (goblins[i].alive) {
      liveGoblins.push(goblins[i])
    }
  }
  return liveGoblins
}

// Remove all dead goblins from goblinState to prevent memory overload from buildup
const buryDeadGobs = function (goblins) {
  for (let i = 0; i < goblins.length; i++) {
    if (!goblins[i].alive) {
      goblins.splice(i, 1)
    }
  }
}

// returns index of the goblin at given coords, returns -1 if no gob is there
const findGobByPosition = function (goblins, givenPosition) {
  return goblins.findIndex(goblin => goblin.position[0] === givenPosition[0] &&
                                     goblin.position[1] === givenPosition[1] &&
                                     goblin.alive)
}

// resolves an attack with a given attacker and target (both must be combatants)
// prints the result of the attack and updates the map
const attack = function (attacker, target) {
  target.hp[0] -= attacker.attackDmg
  const text = `${attacker.name} attacks ${target.name} for ${attacker.attackDmg} damage! Reducing ${target.name} HP to ${target.hp[0]}/${target.hp[1]}`
  addGameMessage(text)
  return deathCheck(target)
}

// resolves an attack if the identity of the target is not set yet. Takes an
// attacker and an attack destination coord. If attacker is player, finds the
// goblin at that coord and attacks it. If attacker is gob, attacks the player
const targetAttack = function (attacker, destination) {
  if (attacker.name === 'player') {
    const gobIndex = findGobByPosition(localGame.goblinState, destination)
    if (gobIndex > -1) {
      const target = localGame.goblinState[gobIndex]
      return attack(attacker, target)
    }
  } else {
    return attack(attacker, localGame.playerState)
  }
}

// Checks to see if target is killed after an attack, if yes, set target to dead,
// and whether target was a gob or the player, increase score or game over respectively
const deathCheck = function (target) {
  if (target.hp[0] < 1) {
    target.alive = false
    // if target killed was a gob, increase score by 1
    if (target.name !== 'player') {
      localGame.score += 1
      const text = `You have slain ${target.name}! Your score is now ${localGame.score}`
      addGameMessage(text)
    // if target killed was player, game over
    } else if (target.name === 'player') {
      localGame.over = true
      shopEvents.onUpdateGold(localGame.score)
      addGameMessage(`YOU ARE DEAD. GAME OVER. YOU EARNED ${localGame.score} GOLD.`)
    }
  }
  return updateMap(localGame.playerState, localGame.goblinState)
}

// Chases the player by determining along which axis the gob is further from the
// player, and moving in that direction
const chasePlayer = function (goblin) {
  const xDiff = goblin.position[1] - localGame.playerState.position[1]
  const yDiff = goblin.position[0] - localGame.playerState.position[0]
  // if further from player along x-axis, move along x-axis
  if (Math.abs(xDiff) > Math.abs(yDiff) ||
      Math.abs(xDiff) === Math.abs(yDiff)) {
    // determine whether player is above or below gob on x-axis and move toward
    // player accordingly
    return (xDiff > 0 ? moveGoblin(goblin, 'left') : moveGoblin(goblin, 'right'))
  // if further from player along y-axis, move along y-axis
  } else if (Math.abs(yDiff) > Math.abs(xDiff)) {
    // determine whether player is above or below gob on x-axis and move toward
    // player accordingly
    return (yDiff > 0 ? moveGoblin(goblin, 'up') : moveGoblin(goblin, 'down'))
  }
}

// Cycles through every live goblin and runs their turn, then updates map
const goblinTurns = function (goblins) {
  for (let i = 0; i < goblins.length; i++) {
    const goblin = goblins[i]
    if (goblin.alive) {
      chasePlayer(goblin)
    }
  }
  return updateMap(localGame.playerState, goblins)
}

// This func constructs new goblin hashes with given stats
const createGoblin = function (position, hp, attackDmg, alive) {
  const goblin = {}
  goblin.name = 'goblin'
  goblin.position = position
  goblin.hp = hp
  goblin.attackDmg = attackDmg
  goblin.alive = alive
  goblin.lastMove = 'down'
  setNeighborIndices(goblin)
  return goblin
}

// returns random integer from 0 to (upperLimit - 1)
const makeRandomNum = function (upperLimit) {
  return Math.floor(Math.random() * upperLimit)
}

// returns true if player position overlaps with newPosition. Both params are coords
const playerOverlapCheck = function (newPosition, playerPosition) {
  if (newPosition[0] === playerPosition[0] && newPosition[1] === playerPosition[1]) {
    return true
  } else {
    return false
  }
}

// returns true if any gob position overlaps with newPosition. newPosition param
// is coord, goblins param is goblin array
const goblinOverlapCheck = function (newPosition, goblins) {
  const goblinAlreadyAtNewPos = findGobByPosition(goblins, newPosition)
  if (goblinAlreadyAtNewPos !== -1) {
    return true
  } else {
    return false
  }
}

// randomizes the position of a goblin, making sure the new position doesn't
// overlap with the player position or any gobs already on the map
const randomizeGobPos = function (goblin) {
  let newPosition = [makeRandomNum(5), makeRandomNum(5)]
  const playerPosition = localGame.playerState.position
  // run overlap checks
  let playerOverlaps = playerOverlapCheck(newPosition, playerPosition)
  let goblinOverlaps = goblinOverlapCheck(newPosition, localGame.goblinState)

  if (playerOverlaps || goblinOverlaps) {
    while (playerOverlaps || goblinOverlaps) {
      newPosition = [makeRandomNum(5), makeRandomNum(5)]
      playerOverlaps = playerOverlapCheck(newPosition, playerPosition)
      goblinOverlaps = goblinOverlapCheck(newPosition, localGame.goblinState)
    }
    return newPosition
  }
  return newPosition
}

// run at end of player move and during createGame to check whether current
// round is a spawn round, if yes, add the goblins to localGame.goblinState
const spawnCheck = function (round) {
  if (round % 10 === 0) {
    const newGobs = []
    let newGobAmount = round / 10 + 1
    const availableSpaces = numberOfOpenMapSpaces()
    newGobAmount = (newGobAmount > availableSpaces ? availableSpaces : newGobAmount)
    for (let i = 0; i < newGobAmount; i++) {
      newGobs.push(createGoblin([0, 2], [10, 10], 1, true))
    }
    const text = `${newGobs.length} goblins enter the arena!`
    addGameMessage(text)
    for (let i = 0; i < newGobs.length; i++) {
      localGame.playerState.goblinCount++
      newGobs[i].position = randomizeGobPos(newGobs[i])
      setNeighborIndices(newGobs[i])
      newGobs[i].name = newGobs[i].name + localGame.playerState.goblinCount
      localGame.goblinState.push(newGobs[i])
    }
  } else if (round === 1) {
    const newGobs = [createGoblin([0, 2], [10, 10], 1, true)]
    setNeighborIndices(newGobs[0])
    newGobs[0].name = newGobs[0].name + localGame.playerState.goblinCount
    localGame.goblinState.push(newGobs[0])
  }
}

// returns the number of open spaces on the map
const numberOfOpenMapSpaces = function () {
  let counter = 0
  // iterate through every map cell and count all the empty spaces
  for (let y = 0; y < rowLength; y++) {
    for (let x = 0; x < rowLength; x++) {
      if (map[y][x] === '...') {
        counter++
      }
    }
  }
  return counter
}

const addGameMessage = function (message) {
  const gameMessageTemplate = require('../templates/game-message.handlebars')
  const timeStamp = new Date()
  const gameMessageHtml = gameMessageTemplate({ messages: [{text: message, time: timeStamp}] })
  $('#game-message').prepend(gameMessageHtml)
}

// const attackAnimation = function (position) {
//   const ID1 = '#mark' + position[0]
//   const spotID = ID1 + position[1]
//   $(spotID).css('background-color', '#d9534f')
// }
//
// const resetAttackAnimations = function () {
//   for (let y = 0; y < 5; y++) {
//     const ID1 = '#mark' + y
//     for (let x = 0; x < 5; x++) {
//       const spotID = ID1 + x
//       $(spotID).css('background-color', 'rgba(0, 0, 0, 0)')
//     }
//   }
// }

module.exports = {
  createNewGame,
  moveGoblin,
  localGame,
  movePlayer,
  packageGameData,
  loadGame,
  addGameMessage
}
