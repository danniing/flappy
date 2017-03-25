
//Configuration variables
var tickrate = 3;
var movementrate = 3;  //Pixels per frame
var playerOffset = 50;
var gap = 400;

//Engine variables
var interval, canvas, ctx, height, width;
var blockHeight;
var blockPos;
var highscore = 0;
var bgpos = 0;
var sound = true;

//Gameplay variables
var gameOn = false;
var playerHeight;
var upAcceleration = 0;
var points = 0;
var playerPos = 200;

//Textures
var bg = new Image(), column = new Image(), bird = new Image();
bg.src = "img/bg.png";
column.src = "img/column.jpg";
bird.src = "img/bird.png"
var spriteNumber = 0;
var spriteSpeed = 20; //frames per image


//Audio
var loosesound = new Audio('sound/loose.mp3');
var flapsound = new Audio('sound/flap.mp3');
var dingsound = new Audio('sound/ding.mp3');

//Event listeners
document.addEventListener('keydown', keyController, false);
document.addEventListener('DOMContentLoaded', init, false);

function init(){
	canvas = document.querySelector('canvas');
	ctx = canvas.getContext('2d');
	height = canvas.height;
	width = canvas.width;
	ctx.lineWidth="6";
	ctx.strokeStyle="red";

	//Init game functions
	playerHeight = 0.5 * height;
	points = 0;
	blockPos = width;
	blockHeight = Math.ceil(Math.random()*(height-gap))+1;

	var btn = document.getElementById('mute');
	btn.addEventListener('click', mute, false);

	var lbtn = document.getElementById('loosebtn');
	lbtn.addEventListener('click', startGame, false);

	draw();
}

function mute(){
	if(sound){
		sound = false;
		$('#mute').text('SOUND');
	}
	else{
		sound = true;
		$('#mute').text('MUTE');
	}
}

function play(){ 
	draw();
	updatePanel();
	applyPhysics();
	checkBoundaries();
}

function updatePanel(){
	$('.score').text(points);
	$('#highscore').text(highscore);
}

function draw(){
	ctx.clearRect(0, 0, width, height);
	drawBackground();
	drawPlayer();
	drawBlock();
}

function drawBackground(){
	ctx.drawImage(bg, bgpos, 0, width*1.5, height);
	ctx.drawImage(bg, bgpos+width*1.5, 0, width*1.5, height);
	bgpos -= movementrate/3;
	if(bgpos == -width*1.5)
	{
		bgpos = 0;
	}
}

function checkBoundaries(){
	if(playerHeight >= height - playerOffset|| playerHeight <= 0 + playerOffset){
		loose();
	}
	if(playerPos + playerOffset >= blockPos && blockPos + 100 >= playerPos){
		if(playerHeight-playerOffset<blockHeight || playerHeight+playerOffset > blockHeight+gap){
			loose();
		}
			
	}
	if(playerPos >= blockPos+100 && playerPos <= blockPos+100+movementrate){
		if(sound){
			dingsound.play();
		}
		points++;
	}
}

function applyPhysics(){
	if(upAcceleration){
		playerHeight -= movementrate;
		upAcceleration--;
	}
	else
	{
		playerHeight += movementrate;
	}
}

function drawPlayer(){
	ctx.drawImage(bird, spriteNumber*600, 0, 595, 400, playerPos-playerOffset,playerHeight-playerOffset,playerOffset*2, playerOffset*2);
	if(upAcceleration){
		if(!spriteSpeed){
			if(spriteNumber < 7){
				spriteNumber++;
			}
			else{
				spriteNumber = 0;
			}
			spriteSpeed = 20;
		}
		else
		{
			spriteSpeed--;
		}
	}
}

function keyController(event){
	//32 for spacebar
	if(event.keyCode == 32){
		if(!gameOn){
			//Starts game when spacebar is pressed
			startGame();
		}
		else{
			if(sound){
				flapsound.currentTime = 0;
				flapsound.play();
			}
			upAcceleration = (movementrate*tickrate)*7;//(movementrate * 10)/tickrate;
		}
	}
}

function drawBlock(){ 
	if(blockPos <= 0){
		blockHeight = Math.ceil(Math.random()*(height-gap))+1;
		blockPos = width;
	}

	ctx.drawImage(column, blockPos, blockHeight+gap, 100, height-blockHeight-gap);
	ctx.drawImage(column, blockPos, 0, 100, blockHeight);

	blockPos -= movementrate;
}

function loose(){
	if(points > highscore)
	{
		highscore = points;
	}
	if(sound){loosesound.play();}
	clearInterval(interval);
	gameOn = false;
	$('.loose').show('fast');
}

function startGame(){
	if(sound){
		loosesound.pause();
		loosesound.currentTime = 0;
	}
	gameOn = true;
	init();
	interval = window.setInterval(play, tickrate);
	$('.loose').hide('fast');
}