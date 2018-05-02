## Goblin Colosseum Game

Goblin colosseum is a turn-based roguelike RPG, where players fight increasingly
difficult waves of goblins in an attempt to earn gold and get a score high
enough to make it onto the leaderboards. User and game data is stored in the
Goblin Colosseum API (see below), allowing users to save games to return to
later.

  * Players can move in the 4 cardinal directions
  * Moving towards an adjacent enemy triggers an attack
  * A new wave of goblins spawns every 10 rounds
  * Every wave, goblins are spawned in random positions, and the number of
      spawned goblins goes up
  * Every time you kill a goblin, your score increases
  * The game is over when the player drops to 0 HP
  * At gameover, an amount of gold equal to your final score is added to your
      account
  * If your score is high enough, you might just make it onto the global
      leaderboards
  * Users can spend their gold to unlock special abilities, and buy consumable
      items in the Shop
  * Items and Special Abilities:
    - Sweeping Strike: [Ability] attacks all adjacent enemies
    - Lightning Blast: [Ability] attacks all enemies in a straight line
    - Healing Potion: [Item] Restores the players hit points back to maximum

## Web App URL

https://ismurray.github.io/goblin-colosseum/

## Gobin Colosseum API URL/Github Repo

- Github Repo: https://github.com/ismurray/goblin-colosseum-api
- API: https://goblin-colosseum-api.herokuapp.com/


## Wire Frames
Initial Wire frames:
![ERD](https://i.imgur.com/IIScTZZ.jpg)


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
