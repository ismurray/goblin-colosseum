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
  attackDmg: 5,
  alive: true
}
let goblinState = [
  {
    name: 'goblin',
    position: [0, 0],
    hp: [10, 10],
    attackDmg: 2,
    alive: true
  },
  {
    name: 'goblin',
    position: [0, 4],
    hp: [10, 10],
    attackDmg: 2,
    alive: true
  },
  {
    name: 'goblin',
    position: [0, 2],
    hp: [10, 10],
    attackDmg: 2,
    alive: true
  }
]

createNewGame = function () {
  resetMap(rowLength)
  setNeighborIndices(playerState)
  for (let i = 0; i < goblinState.length; i++) {
    setNeighborIndices(goblinState[i])
  }
  return updateMap(playerState, goblinState)
}

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
// prevents invalid movement and calls attack if destination cell is occupied by
// opposite combatant type
const moveCombatant = function (combatant, direction) {
  const destination = combatant.neighborIndices[direction]
  const currentPos = combatant.position
  // prevent combatant from walking off map
  if (destination === 'wall') {
    console.log('You cannot move that way!')
  // if destination is empty, move combatant to that space and update neighbors
  // prevents gobs from moving over or attacking each other
  } else if (map[destination[0]][destination[1]] === '   ') {
    combatant.position = combatant.neighborIndices[direction]
    setNeighborIndices(combatant)
  // if destination is occupied by opposite type (gob -> player or player -> gob),
  // call attack function
  } else if (map[destination[0]][destination[1]] !== map[currentPos[0]][currentPos[1]]) {
    targetAttack(combatant, destination)
  }
  return updateMap(playerState, goblinState)
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
    return (xDiff > 0 ? moveCombatant(goblin, 'left') : moveCombatant(goblin, 'right'))
  // if further from player along y-axis, move along y-axis
  } else if (Math.abs(yDiff) > Math.abs(xDiff)) {
    // determine whether player is above or below gob on x-axis and move toward
    // player accordingly
    return (yDiff > 0 ? moveCombatant(goblin, 'up') : moveCombatant(goblin, 'down'))
  }
}

// Below is for testing purposes

createNewGame()
chasePlayer(goblinState[0])
