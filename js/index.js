const foodSound = new Audio("music/food.mp3");
const gameOverSound = new Audio("music/gameover.mp3");
const moveSound = new Audio("music/move.mp3");
const musicSound = new Audio("music/music.mp3");
const scoreBox = document.querySelector("#scoreBox");

let inputDirection = {x: 0, y:0};
let speed = 10;
let lastPaintTime = 0;
let score = 0;
let highScore = localStorage.getItem("highScore");
let snakeArray = [
  {
    x: 13,
    y: 15
  },
];
let food = {
  x: 6,
  y: 7
};

//Game Functions
const main = (ctime) => {
  window.requestAnimationFrame(main);
  if((ctime - lastPaintTime) / 1000 < 1 / speed ){
    return;
  }
  lastPaintTime = ctime;
  gameEngine();
}

const gameEngine = () => {
  // Part 1: Updateing the snake array and food
  if(isCollide(snakeArray)){
    gameOverSound.play();
    inputDirection = {x:0, y:0};
    alert("Game Over, press any key to play again!");
    snakeArray = [
      {
        x: 13,
        y: 15
      },
    ];
    score = 0; 
    scoreBox.innerHTML = "Score: " + score;
  }


  // Part 2: Display the snake
  board.innerHTML = "";
  snakeArray.forEach( (e, index) => {
    const snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    if(index == 0){
      snakeElement.classList.add("head");
    }else{
      snakeElement.classList.add("snake");
    }
    board.appendChild(snakeElement);
  });

  // If Sanke has eaten the food, increment the score and regenarate the food
  if(snakeArray[0].y === food.y && snakeArray[0].x === food.x){
    foodSound.play();
    score += 1;
    scoreBox.innerHTML = "Score: " + score;
    if(score > highScoreValue){
      highScoreValue = score;
      localStorage.setItem("highScore", JSON.stringify(highScoreValue));
      highScoreBox.innerHTML = "High Score: " + highScoreValue;
    }
    snakeArray.unshift({x: snakeArray[0].x + inputDirection.x, y: snakeArray[0].y + inputDirection.y});
    let a = 2;
    let b = 16;
    food = {x: Math.round(a + (b-a) * Math.random()), y: Math.round(a + (b-a) * Math.random())}
  }

  //Moving the Snake
  for(let i = snakeArray.length - 2; i >= 0; i--){
    snakeArray[i + 1] = { ...snakeArray[i] };
  }
  snakeArray[0].x += inputDirection.x;
  snakeArray[0].y += inputDirection.y;

  // Part 3: Display the food

    const foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");
    board.appendChild(foodElement);
}

//Main logic Stars here
if(highScore === null){
  highScoreValue = 0;
  localStorage.setItem("highScore", JSON.stringify(highScoreValue));
}else{
  highScoreValue = JSON.parse(highScore);
  highScoreBox = document.querySelector("#highScore");
  highScoreBox.innerHTML = "High Score: " + highScore;
}
window.requestAnimationFrame(main);
window.addEventListener("keydown", (event) => {
  inputDirection = {x: 1, y: 1};
  moveSound.play();
  switch(event.key){
    case "ArrowUp":
      inputDirection.x = 0;
      inputDirection.y = -1;
      break;
    case "ArrowDown":
      inputDirection.x = 0;
      inputDirection.y = 1;
      break;
    case "ArrowRight":
      inputDirection.x = 1;
      inputDirection.y = 0;
      break;
    case "ArrowLeft":
      inputDirection.x = -1;
      inputDirection.y = 0;
      break;
    default:
      break;
  }
});

const isCollide = (snake) => {
  // If Snake bumps into itself
  for(let index = 1; index < snakeArray.length; index++){
    if(snake[index].x === snake[0].x && snake[index].y === snake[0].y){
      return true;
    }
  }
  // If Snake collides with the boundary of the board
  if(snake[0].x > 18 || snake[0].x <= 0 || snake[0].y > 18 || snake[0].y <= 0){
    return true;
  }
  return false;
}