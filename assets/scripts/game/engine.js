'use strict'

// initial variables
const rowLength = 5
let map = []
// playerStartPos = [4, 2]
// gobStartPos = [0, 3]

// Sample game state data that could come from API:
let score = 0
let over = false
let playerState = {
  name: 'player',
  position: [4, 2],
  hp: [10, 10],
  attack: 5,
  alive: true
}
let goblinStates = [
  {
    name: 'goblin',
    position: [0, 3],
    hp: [10, 10],
    attack: 2,
    alive: true
  }
]

// Map funcs:

// initializes the game map to be a 2D array filled with empty spaces
const resetMap = function (rowLength) {
  map = []
  for (let i = 0; i < rowLength; i++) {
    let row = []
    for (let n = 0; n < rowLength; n++) {
      row.push('   ')
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

// moves the player/goblin 'up', 'down', 'left', or 'right'
const moveCombatant = function (combatant, direction) {
  if (combatant.neighborIndices[direction] !== 'wall') {
    combatant.position = combatant.neighborIndices[direction]
    setNeighborIndices(combatant)
  } else {
    console.log('You cannot move that way!')
  }
  return updateMap(playerState, goblinStates)
}
