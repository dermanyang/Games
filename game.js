var dieSound = new Audio('./sound/die.mp3')
var eatFruitSound = new Audio('./sound/eat-fruit.mp3')
var eatGhostSound = new Audio('./sound/eat-ghost.mp3')
var eatPillSound = new Audio('./sound/eat-pill.mp3')
var extraLifeSound = new Audio('./sound/extra-life.mp3')
var ghostEatenSound = new Audio('./sound/ghost-eaten.mp3')
var eatingSound = new Audio('./sound/eating.mp3')
var readySound = new Audio('./sound/ready.mp3')
var sirenSound = new Audio('./sound/siren.mp3')
var wazaSound = new Audio('./sound/waza.mp3')


var called = false;

$(document).ready(function() {
//      *** CLASS DEFINITIONS  ***     ///
  class Pacman{
    constructor(){
      this.x = pos[0].x;
      this.y = pos[0].y;
      this.width = 64;
      this.height = 64;
    }
    updatePosition(){
      this.x = pos[0].x;
      this.y = pos[0].y;
    }
  };
  class Ghost{
    constructor(num){
      this.num = num;
      this.x = pos[num].x;
      this.y = pos[num].y;
      this.width = 64;
      this.height = 64;
    }
    updatePosition(){
      this.x = pos[this.num].x;
      this.y = pos[this.num].y;
    }
  };
  class Wall{
    constructor(startX, startY, width, height){
      this.x = startX;
      this.y = startY;
      this.width = width;
      this.height = height;
    }
  };
  class Berry{
    constructor(startX, startY){
      this.x = startX;
      this.y = startY;
      this.width = 7;
      this.height = 7;
    }
    eaten(pac){
      if (this.x < pac.x + pac.width &&
          this.x + this.width > pac.x &&
          this.y < pac.y + pac.height &&
          this.height + this.y > pac.y) {
            //collision!
            //board.remove($(this));
          }
        }
  };

  var allGhosts = [];
  var allWalls = [];
  var allBerries = [];
  var pos = [{x:320, y:150}, {x:60, y:60}, {x:100, y:100}, {x:100, y:100},]
  var score = 0
  var board = $('.board')
  var hacman = $(`<div class="hacman hacman-move hacman-l" style="top: -1000px; left: -1000px; width: 64px; height: 64px;"></div>`)
  var redGhost = $(`<div class="ghost ghost-red ghost-u" style="top: -1000px; left: -1000px; width: 64px; height: 64px;"></div>`)
  var babyblueGhost = $(`<div class="ghost ghost-babyblue ghost-u" style="top: -1000px; left: -1000px; width: 64px; height: 64px;"></div>`)
  var pinkGhost = $(`<div class="ghost ghost-pink ghost-u" style="top: -1000px; left: -1000px; width: 64px; height: 64px;"></div>`)
  var orangeGhost = $(`<div class="ghost ghost-orange ghost-u" style="top: -1000px; left: -1000px; width: 64px; height: 64px;"></div>`)

  // TODO: BUILD A GAME BOARD

 board.append($(`<div class="wall" style="border-right: 0px; top: 330px; left: 30px; width: 10px; height: 200px;"></div>`));
 allWalls.push(new Wall(30,330,10,200));
 board.append($(`<div class="wall" style="border-right: 0px; top: 330px; left: 710px; width: 10px; height: 200px;"></div>`));
 allWalls.push(new Wall(710,330,10,200));
 board.append($(`<div class="wall" style="border-right: 0px; top: 520px; left: 30px; width: 685px; height: 10px;"></div>`));
 allWalls.push(new Wall(30,520,685,10));
 board.append($(`<div class="wall" style="border-right: 0px; top: 40px; left: 30px; width: 10px; height: 200px;"></div>`));
 allWalls.push(new Wall(30,40,10,200));
 board.append($(`<div class="wall" style="border-right: 0px; top: 40px; left: 710px; width: 10px; height: 200px;"></div>`));
 allWalls.push(new Wall(710,40,10,200));
 board.append($(`<div class="wall" style="border-right: 0px; top: 40px; left: 30px; width: 685px; height: 10px;"></div>`));
 allWalls.push(new Wall(30,40,685,10));
 board.append($(`<div class="wall" style="border-right: 0px; top: 220px; left: 250px; width: 250px; height: 10px;"></div>`));
 allWalls.push(new Wall(250,220,250,10));
 board.append($(`<div class="wall" style="border-right: 0px; top: 320px; left: 250px; width: 250px; height: 10px;"></div>`));
 allWalls.push(new Wall(250,320,250,10));
 board.append($(`<div class="wall" style="border-right: 0px; top: 220px; left: 250px; width: 10px; height: 110px;"></div>`));
 allWalls.push(new Wall(250,220,10,110));
 board.append($(`<div class="wall" style="border-right: 0px; top: 220px; left: 490px; width: 10px; height: 110px;"></div>`));
 allWalls.push(new Wall(490,220,10,110));

 board.append($(`<div class="wall" style="border-right: 0px; top: 120px; left: 140px; width: 10px; height: 330px;"></div>`));
 allWalls.push(new Wall(140,120,10,330));
 board.append($(`<div class="wall" style="border-right: 0px; top: 120px; left: 600px; width: 10px; height: 330px;"></div>`));
 allWalls.push(new Wall(600,120,10,330));
 board.append($(`<div class="wall" style="border-right: 0px; top: 40px; left: 360px; width: 30px; height: 110px;"></div>`));
 allWalls.push(new Wall(360,40,30,110));
 board.append($(`<div class="wall" style="border-right: 0px; top: 420px; left: 360px; width: 30px; height: 110px;"></div>`));
 allWalls.push(new Wall(360,420,30,110));


  // Add the hacman and ghost
  board.append(hacman); var pacman = new Pacman()
  allGhosts.push(new Ghost(1));

    for (var x = 40; x < 705; x += 20){
    for (var y = 40; y < 520; y+= 20)
      {
        board.append($(`<div class="food" style="top: ${y}px; left: ${x}px; width: 7px; height: 7px;"></div>`));
        allBerries.push(new Berry(x, y));
      }
    }
  board.append(redGhost);
  board.append(babyblueGhost);
  board.append(pinkGhost);
  board.append(orangeGhost);

  // handle the keyboard
  var key = null
  var gameTimer = null
  $(document).on('keydown', function(event) {
    if(event.key === 'q') {
      clearTimeout(gameTimer)
      gameTimer = null
    }
    else if(event.key === 's' && called == false) {
      gameTimer = setInterval(gameLoop, 50)
      readySound.play()
      called = true;
    } else {
      key = event.key;
    }
  })


//directions
    var redGhostDir = randomDirection();

  // main game loop (move hacman, ghost, update score, track food, handle collisions)


  function gameLoop() {
    var direction;

    pacman.updatePosition();
    for (var i = 0; i < allGhosts.length; i++){
        allGhosts[i].updatePosition();
    }

    for (var i = 0; i < allBerries.length; i++){
        console.log("eaten");
        allBerries[i].eaten(pacman);
    }

    // if (!validMove(pacman, allGhosts))
    //   console.log("Spooky!");



    var preMoveX = pos[0].x; var preMoveY = pos[0].y;
    if(key == 'ArrowUp' && validMove(pacman, allWalls, 'u')) {pos[0].y -= 10; direction = 'hacman-u';}
    if(key == 'ArrowUp') {direction = 'hacman-u';}
    else if(key == 'ArrowDown' && validMove(pacman, allWalls, 'd')) {pos[0].y += 10; direction = 'hacman-d';}
    else if(key == 'ArrowDown') {direction = 'hacman-d';}
    else if(key == 'ArrowRight' && validMove(pacman, allWalls, 'r')) {pos[0].x += 10; direction = 'hacman-r';}
    else if(key == 'ArrowRight') {direction = 'hacman-r';}
    else if(key == 'ArrowLeft' && validMove(pacman, allWalls, 'l')) {pos[0].x -= 10; direction = 'hacman-l';}
    else if(key == 'ArrowLeft') { direction = 'hacman-l';}
    if(pos[0].y < 0) pos[0].y = 0;
    if(pos[0].x < 0) pos[0].x = 0;
    if(pos[0].y > 480) pos[0].y = 480;
    if(pos[0].x > 645) pos[0].x = 645;
    hacman.removeClass('hacman-u hacman-d hacman-r hacman-l')
    hacman.addClass(direction)
    hacman.css('top', pos[0].y)
    hacman.css('left', pos[0].x)

    // TODO: Example of how to move a ghost

    //REDGHOST MOVEMENT
    if (!ghostValidMove(pos[1].x, pos[1].y , allWalls, redGhostDir))
      {
          //if current direction is invalid, find new valid direction
          var newDir;
          while (true){
          newDir =  randomDirection();
          if (ghostValidMove(pos[1].x, pos[1].y , allWalls, newDir))
          {
            redGhostDir = newDir;
            break;
          }
        }
      }

      switch (redGhostDir){
        case 'u': pos[1].y-=10; break;
        case 'd': pos[1].y+=10; break;
        case 'l': pos[1].x-=10; break;
        case 'r': pos[1].x+=10; break;
      //   default: break;
  }
    redGhost.removeClass('ghost-u ghost-d ghost-r ghost-l')
    redGhost.addClass('ghost-d') // ghost-l ghost-r ghost-u ghost-d (LOOK left, right, up, down)
    redGhost.css('top', pos[1].y)
    redGhost.css('left', pos[1].x)
    if(pos[1].y < 0) pos[1].y = 0;
    if(pos[1].x < 0) pos[1].x = 0;
    if(pos[1].y > 480) pos[1].y = 480;
    if(pos[1].x > 645) pos[1].x = 645;



    //SCORE HANDLING
    score += 100;
    $('.score').text('Score: '+score)
  }
})


//      *** GAME FUNCTIONS  ***     ///
function validMove(a, b, dir){
  //take pacman a and list b
  var ax = a.x; var ay = a.y; var awidth = a.width; var aheight = a.height;
  switch (dir){
    case 'u': ay-=10; break;
    case 'd': ay+=10; break;
    case 'l': ax-=10; break;
    case 'r': ax+=10; break;
    default: break;
  }
  var flag = true;
  //given cooridnates (x,y) of character a and (x,y) of character b
  //return euclidian distance between two points
  for (var i = 0; i < b.length; i ++){
  if (ax < b[i].x + b[i].width &&
      ax + awidth > b[i].x &&
      ay < b[i].y + b[i].height &&
      aheight + ay > b[i].y) {
        flag = false;
      }}
      return flag;
}

function ghostValidMove(x, y, b, dir){
  //take pacman a and list b
  var ax = x; var ay = y; var awidth = 64 ; var aheight = 64;
  switch (dir){
    case 'u': ay-=10; break;
    case 'd': ay+=10; break;
    case 'l': ax-=10; break;
    case 'r': ax+=10; break;
    default: break;
  }
  var flag = true;
  //given cooridnates (x,y) of character a and (x,y) of character b
  //return euclidian distance between two points
  for (var i = 0; i < b.length; i ++){
  if (ax < b[i].x + b[i].width &&
      ax + awidth > b[i].x &&
      ay < b[i].y + b[i].height &&
      aheight + ay > b[i].y) {
        flag = false;
      }}
      return flag;
}



function randomDirection(){
 var a = Math.floor(Math.random() * 4);
 switch(a){
   case 0: return 'u'; break;
   case 1: return 'd'; break;
   case 2: return 'l'; break;
   case 3: return 'r'; break;
 }
}
