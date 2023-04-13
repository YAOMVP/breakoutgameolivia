// Load the backgroundImg 
const backgroundImg = new Image();
backgroundImg.src = "./img/star.jpg";

//Load the scoreImg
const scoreImg = new Image();
scoreImg.src = "./img/score.png";

//Load the lifeImg
const lifeImg = new Image();
lifeImg.src = "./img/life.png";

//Load the levelImg
const levelImg = new Image();
levelImg.src = "./img/level.png";


//Load sounds
const wallSound = new Audio();
wallSound.src = "./sounds/wall.mp3";

const paddleHit = new Audio();
paddleHit.src = "./sounds/paddle_hit.mp3";

const lifeLostSound = new Audio();
lifeLostSound.src = "./sounds/life_lost.mp3";

const bricksHit = new Audio();
bricksHit.src = "./sounds/brick_hit.mp3";

const winSound = new Audio();
winSound.src = "./sounds/win.mp3";