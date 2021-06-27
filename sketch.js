var PLAY = 0;
var END = 1;
var gameState = PLAY;

var girl, girl_running;
var ground, invisibleGround, groundImage;

var virusesGroup, v1, v2, v3;
var masksGroup, m1, m2;
var sanitizersGroup, sanitizer, sImg;

var score=0;

var gameOver, restart;



function preload(){
  girl_running =   loadAnimation("girl1.jpg","Girl2.jpg","Girl3.jpg","Girl4.jpg","Girl5.jpg","Girl6.jpg","Girl7.jpg","Girl8.jpg");
  
  groundImage = loadImage("ground2.png");
  
  v1 = loadImage("Virus1.png");
  v2 = loadImage("Virus2.png");
  v3 = loadImage("Virus3.png");
  
  m1=loadImage("Mask1.png");
  m2=loadImage("Mask2.png");
  
  sImg=loadImage("Sanitizer.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
}

function setup() {
  createCanvas(600, 200);
  
  girl = createSprite(50,180,20,50);
  girl.addAnimation("running", girl_running);
  girl.scale = 0.7;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;

  
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  sanitizersGroup = createGroup();
  virusesGroup = createGroup();
  masksGroup = createGroup();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(255);
  text("Score: "+ score, 500,50);
  //console.log(girl.y)
  
  if (gameState===PLAY){
    if(masksGroup.isTouching(girl)){
      score=score+10;
      masksGroup.destroyEach();
    }
    if(sanitizersGroup.isTouching(girl)){
      score=score+50;
      sanitizersGroup.destroyEach();
    }
    
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && girl.y >= 140) {
      girl.velocityY = -12;
    }
  
    girl.velocityY = girl.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    girl.collide(invisibleGround);
    spawnMasks();
    spawnViruses();
    spawnSanitizers();
  
    if(virusesGroup.isTouching(girl)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    girl.velocityY = 0;
    virusesGroup.setVelocityXEach(0);
    masksGroup.setVelocityXEach(0);
    sanitizersGroup.setVelocityXEach(0);
    
    //set lifetime of the game objects so that they are never destroyed
    virusesGroup.setLifetimeEach(-1);
    masksGroup.setLifetimeEach(-1);
    sanitizersGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnViruses(){
 if (frameCount % 100 === 0){
   var virus = createSprite(600,height-45,10,40);
   virus.setCollider('circle',0,0,45);
   virus.velocityX = -(6+score/200);
   
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: virus.addImage(v1);
      virus.scale=0.04
              break;
      case 2: virus.addImage(v2);
      virus.scale=0.03
              break;
      case 3: virus.addImage(v3);
      virus.scale=0.015
              break;
      default: break;
    }
   
    //assign scale and lifetime to the virus           
    //virus.scale = 0.02;
    virus.lifetime = 300;
    virus.depth = girl.depth;
    girl.depth +=1;
   
   //add each virus to the group
    virusesGroup.add(virus);
 }
}

function spawnMasks(){
 if (frameCount % 111 === 0){
   var mask = createSprite(600,height-25,10,40);
   mask.setCollider('circle',0,0,45);
   mask.velocityX = -(6+score/200);
   
    //generate random obstacles
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: mask.addImage(m1);
      mask.scale = 0.025;
              break;
      case 2: mask.addImage(m2);
      mask.scale = 0.015;
              break;
      default: break;
    }
   
    //assign scale and lifetime to the virus           
    mask.lifetime = 300;
    mask.depth = girl.depth;
    girl.depth +=1;
   
   //add each virus to the group
   masksGroup.add(mask);
 }
}

function spawnSanitizers(){
 if (frameCount % 146 === 0){
   var sanitizer = createSprite(600,height-35,10,40);
   sanitizer.setCollider('circle',0,0,45);
   sanitizer.velocityX = -(6+score/200);
   sanitizer.addImage(sImg)         
    sanitizer.scale = 0.05;
    sanitizer.lifetime = 300;
    sanitizer.depth = girl.depth;
    girl.depth +=1;
    sanitizersGroup.add(sanitizer);
    }
  }

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  virusesGroup.destroyEach();
  sanitizersGroup.destroyEach();
  masksGroup.destroyEach();
  
  girl.changeAnimation("running",girl_running);
  
 
  
  score = 0;
  
}