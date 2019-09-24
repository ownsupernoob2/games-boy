const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 15;
const playerHeight = grid * 3; 
const maxPlayerY = canvas.height - grid - playerHeight;

var playerSpeed = 4;

const leftPlayer = {
  
  x: grid * 2,
  y: canvas.height / 2 - playerHeight / 2,
  width: grid,
  height: playerHeight,
  
 
  cooldown: 0,

  dy: 0
};

const rightPlayer = {

  x: canvas.width - grid * 3,
  y: canvas.height / 2 - playerHeight / 2,
  width: grid,
  height: playerHeight,
  
  
  cooldown: 0,
  

  dy: 0
};

const bullets = {
  speed: 5,
  array: []
}

function collides(obj1, obj2) {
  return obj1.x < obj2.x + obj2.width &&
         obj1.x + obj1.width > obj2.x &&
         obj1.y < obj2.y + obj2.height &&
         obj1.y + obj1.height > obj2.y;
}

function loop() {
  requestAnimationFrame(loop);
  context.clearRect(0,0,canvas.width,canvas.height);
  
  if (leftPlayer.cooldown > 0) {
    leftPlayer.cooldown--;
  }

  if (rightPlayer.cooldown > 0) {
    rightPlayer.cooldown--;
  }
  
  
  leftPlayer.y += leftPlayer.dy;
  rightPlayer.y += rightPlayer.dy;
  

  if (leftPlayer.y < grid) {
    leftPlayer.y = grid;
  }
  else if (leftPlayer.y > maxPlayerY) {
    leftPlayer.y = maxPlayerY;
  }
  
  if (rightPlayer.y < grid) {
    rightPlayer.y = grid;
  }
  else if (rightPlayer.y > maxPlayerY) {
    rightPlayer.y = maxPlayerY;
  }
  
 
  context.fillStyle = 'silver';
  bullets.array.forEach(function(bullet, index) {
    context.fillRect(bullet.x, bullet.y, 10, 5);

    
	
	
	if (collides(bullet, leftPlayer)) {
	  bullets.array.splice(index, 1);
	  leftPlayer.y = canvas.height / 2 - playerHeight / 2;
	  rightPlayer.y = canvas.height / 2 - playerHeight / 2;
	  bullets.array.length = 0;
	}

	else if (collides(bullet, rightPlayer)) {
	  bullets.array.splice(index, 1);
	  leftPlayer.y = canvas.height / 2 - playerHeight / 2;
	  rightPlayer.y = canvas.height / 2 - playerHeight / 2;
	  bullets.array.length = 0;
	}
    
   
    bullet.x += bullet.dx;
	
	
    if (bullet.x < 0 || bullet.x > canvas.width) {
      bullets.array.splice(index, 1);
    }
  });
  

  context.fillStyle = 'gold';
  context.fillRect(leftPlayer.x, leftPlayer.y, leftPlayer.width, leftPlayer.height);
  context.fillRect(rightPlayer.x, rightPlayer.y, rightPlayer.width, rightPlayer.height);


  context.fillStyle = 'lightgray';
  context.fillRect(0, 0, canvas.width, grid);
  context.fillRect(0, canvas.height - grid, canvas.width, canvas.height);
}

document.addEventListener('keydown', function(e) {
    if (e.which === 38) {
    rightPlayer.dy = -playerSpeed;
       }
        
       else if (e.which === 40) {
            rightPlayer.dy = playerSpeed;
          }
          
        
          if (e.which === 87) {
            leftPlayer.dy = -playerSpeed;
          }
         
          else if (e.which === 83) {
            leftPlayer.dy = playerSpeed;
          }
          
         
          if (e.which === 37 && rightPlayer.cooldown === 0) {
            bullets.array.push({
        	  x: rightPlayer.x - 10, 
        	  y: rightPlayer.y + 20, 
        	  width: 10,
        	  height: 5,
        	  dx: -bullets.speed
        	});
        	rightPlayer.cooldown = 25;
          }
        
          if (e.which === 68 && leftPlayer.cooldown === 0) {
            bullets.array.push({
        	  x: leftPlayer.x + 15, 
        	  y: leftPlayer.y + 20, 
        	  width: 10,
        	  height: 5,
        	  dx: bullets.speed
        	});
        	leftPlayer.cooldown = 25;
          }
        });
        
        document.addEventListener('keyup', function(e) {
          if (e.which === 38 || e.which === 40) {
            rightPlayer.dy = 0;
          }
          
          if (e.which === 83 || e.which === 87) {
            leftPlayer.dy = 0;
          }
        });
        
        requestAnimationFrame(loop);
