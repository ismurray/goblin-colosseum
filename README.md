## Goblin Colosseum Game

Goblin colosseum is a turn-based roguelike RPG, where players fight increasingly
difficult waves of goblins in an attempt to get a score high enough to make it
onto the leaderboards. User and game data is stored in the Goblin Colosseum API
(see below), allowing users to save games to return to later.

  * A new wave of goblins spawns every 10 rounds.
  * Players can move in the 4 cardinal directions
  * Moving towards an adjacent enemy triggers an attack
  * The game is over when the player drops to 0 HP
  * Users can spend their score points to use special abilities
  * Special Abilities:
    - Sweeping Strike: attacks all adjacent enemies
    - Rallying Shout: the player's health is restored to maximum

## Web App URL

https://ismurray.github.io/goblin-colosseum/

## Gobin Colosseum API URL/Github Repo

- Github Repo: https://github.com/ismurray/goblin-colosseum-api
- API: https://goblin-colosseum-api.herokuapp.com/

## Development Process
[PLACEHOLDER TEXT]

## Wire Frames
Initial Wire frames: https://imgur.com/IIScTZZ


## User Stories
Below are some of the initial user stories I made during the planning stage:
  As a user, I should be able to:
    - [Auth] create an account
    - [Auth] login to my account
    - [Auth] change my password
    - [Auth] sign out of my account
    - [Game UI] click a button to start a new game
    - [Game UI/Engine] See myself on the map
    - [Engine] Move around the colosseum
    - [Game UI/Engine] See the enemies on the map
    - [Engine] Attack the enemies
    - [Game UI/Engine] See how much HP I have
    - [Game UI/Engine] See how much HP the goblins have
    - [Game UI/Engine] See when I'm hit by the enemies
    - [Game UI/Engine] See how many rounds until the next wave
    - [Game UI/Engine] See my current score
    - [Game API] Abandon a game at any point and have my progress saved to the surver
    - [Game API] Continue playing an abandoned game
    - [Game API] See a list of my high scores

## Technologies Used
* JavaScript
* jQUERY
* AJAX
* HTML5
* SASS/CSS3
* Handlebars
* Bootstrap
* GIT/GITHUB
* Atom
* Webpack

## Future Iterations
