'use strict'

const gameUI = require('./ui.js')

// initial variables
const rowLength = 5
let map = []
// playerStartPos = [4, 2]
// gobStartPos = [0, 3]


// Sample game state data that could come from API:
let score = 0
let over = false
// TODO: add round column to the API/ClientUI, etc
let round = 1
let playerState = {
  name: 'player',
  position: [4, 2],
  hp: [10, 10],
  attackDmg: 5,
  alive: true
}
let goblinState = []
// let goblinState = [
//   {
//     name: 'goblin',
//     position: [0, 0],
//     hp: [10, 10],
//     attackDmg: 2,
//     alive: true
//   },
//   {
//     name: 'goblin',
//     position: [0, 4],
//     hp: [10, 10],
//     attackDmg: 2,
//     alive: true
//   },
//   {
//     name: 'goblin',
//     position: [0, 2],
//     hp: [10, 10],
//     attackDmg: 2,
//     alive: true
//   }
// ]

// initializes new game, resets variables
const createNewGame = function () {
  const gameUI = require('./ui.js')
  goblinState = []
  score = 0
  round = 1
  over = false
  playerState = {
    name: 'player',
    position: [4, 2],
    hp: [10, 10],
    attackDmg: 5,
    alive: true
  }
  resetMap(rowLength)
  setNeighborIndices(playerState)
  spawnCheck(round)
  for (let i = 0; i < goblinState.length; i++) {
    setNeighborIndices(goblinState[i])
  }
  const game = {
    map: updateMap(playerState, goblinState),
    score: score,
    round: round,
    hp: playerState.hp[0]
  }
  return game
}



// Map funcs:

// initializes the game map to be a 2D array filled with empty spaces
const resetMap = function (rowLength) {
  map = []
  for (let i = 0; i < rowLength; i++) {
    let row = []
    for (let n = 0; n < rowLength; n++) {
      row.push('...')
    }
    map.push(row)
  }
  return map
}

// update player position on map
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

// Player funcs:

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
  const destination = goblin.neighborIndices[direction]
  const currentPos = goblin.position
  map = updateMap(playerState, goblinState)
  // prevent goblin from walking off map
  if (destination === 'wall') {
    console.log('You cannot move that way!')
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
  return updateMap(playerState, goblinState)
}

const movePlayer = function (direction) {
  const destination = playerState.neighborIndices[direction]
  const currentPos = playerState.position
  map = updateMap(playerState, goblinState)
  // prevent player from walking off map
  if (destination === 'wall') {
    console.log('You spend your turn attacking the wall. It doesn\'t seem effective')
  // if destination is empty, move player to that space and update neighbors
  } else if (map[destination[0]][destination[1]] === '...') {
    playerState.position = playerState.neighborIndices[direction]
    setNeighborIndices(playerState)
  // if destination is occupied by opposite type (gob -> player or player -> gob),
  // call attack function
  } else if (map[destination[0]][destination[1]] !== map[currentPos[0]][currentPos[1]]) {
    targetAttack(playerState, destination)
  }
  // when player's turn is ending, run all the gobs' turns, increase the round
  // count, and do a spawnCheck
  goblinTurns(goblinState)
  round += 1
  spawnCheck(round)

  const game = {
    map: updateMap(playerState, goblinState),
    score: score,
    round: round,
    hp: playerState.hp[0]
  }
  return game
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
  console.log(`${attacker.name} attacks ${target.name} for ${attacker.attackDmg} damage! Reducing ${target.name} HP to ${target.hp[0]}`)
  return deathCheck(target)
}

// resolves an attack if the identity of the target is not set yet. Takes an
// attacker and an attack destination coord. If attacker is player, finds the
// goblin at that coord and attacks it. If attacker is gob, attacks the player
const targetAttack = function (attacker, destination) {
  if (attacker.name === 'player') {
    const gobIndex = findGobByPosition(goblinState, destination)
    if (gobIndex > -1) {
      const target = goblinState[gobIndex]
      return attack(attacker, target)
    } else {
      return `No target at position ${destination}`
    }
  } else {
    return attack(attacker, playerState)
  }
}

// Checks to see if target is killed after an attack, if yes, set target to dead,
// and whether target was a gob or the player, increase score or game over respectively
const deathCheck = function (target) {
  if (target.hp[0] < 1) {
    target.alive = false
    // if target killed was a gob, increase score by 1
    if (target.name !== 'player') {
      score += 1
      console.log(`You have slain a ${target.name}! Your score is now ${score}`)
    // if target killed was player, game over
    } else if (target.name === 'player') {
      over = true
      console.log('YOU ARE DEAD. GAME OVER.')
    }
  }
  return updateMap(playerState, goblinState)
}

// Chases the player by determining along which axis the gob is further from the
// player, and moving in that direction
const chasePlayer = function (goblin) {
  const xDiff = goblin.position[1] - playerState.position[1]
  const yDiff = goblin.position[0] - playerState.position[0]
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
  return updateMap(playerState, goblins)
}

// This func constructs new goblin hashes with given stats
const createGoblin = function (position, hp, attackDmg, alive) {
  const goblin = {}
  goblin.name = 'goblin'
  goblin.position = position
  goblin.hp = hp
  goblin.attackDmg = attackDmg
  goblin.alive = alive
  setNeighborIndices(goblin)
  return goblin
}

// run at end of player move and during createGame to check whether current
// round is a spawn round in the levels hash, if yes, add the goblins to goblinState
const spawnCheck = function (round) {
  if (levels[round] !== undefined) {
    const newGobs = levels[round]
    for (let i = 0; i < newGobs.length; i++) {
      goblinState.push(newGobs[i])
    }
  }
}

// holds keys that are landmark rounds (1, 10, 20, etc) whose values are arrays
// of goblins to be spawned on that round.
const levels = {
  1: [createGoblin([0, 2], [10, 10], 1, true)],
  10: [
    createGoblin([0, 0], [10, 10], 1, true),
    createGoblin([0, 4], [10, 10], 1, true)
  ],
  20: [
    createGoblin([0, 0], [10, 10], 1, true),
    createGoblin([0, 2], [10, 10], 1, true),
    createGoblin([0, 4], [10, 10], 1, true)
  ],
  30: [
    createGoblin([0, 0], [10, 10], 1, true),
    createGoblin([0, 2], [10, 10], 1, true),
    createGoblin([0, 4], [10, 10], 1, true),
    createGoblin([2, 0], [10, 10], 1, true)
  ]
}

module.exports = {
  createNewGame,
  moveGoblin,
  playerState,
  movePlayer
}

// Below is for testing purposes

// createNewGame()
// moveGoblin(playerState, 'up')
// goblinTurns(goblinState)
