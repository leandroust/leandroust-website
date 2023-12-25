let tileSize = 32
let rows = 16
let columns = 16

let board
let boardWidth = tileSize * columns
let boardHeight = tileSize * rows
let context


//Ship
let shipWidth = tileSize *2
let shipHeight = tileSize
let shipX = boardWidth/2 - tileSize
let shipY = boardHeight - tileSize*2

let ship = {
    x:shipX,
    y:shipY,
    width:shipWidth,
    height:shipHeight
}
 let shipImg
 let shipVelocityX = tileSize; // Shipt moving speed

//Aliens
let alienArray = []
let alienWidth = tileSize*2
let alienHeight = tileSize
let alienX = tileSize
let alienY = tileSize
let alienImg

let alienRows = 2
let alienColumns = 3
let alienCount = 0 // Aliens to defeat
let alienVelocityX = 1 //Aliens moving speed

//Bullets
let bulletArray = []
let bulletVelocityY = -10 //Bullet moving up

let score = 0
let gameOver = false
const scoreHold = document.getElementById("score")
const gameOverHold = document.getElementById("game-over")




window.onload = function (){
    board = document.getElementById('board')
    board.width = boardWidth
    board.height = boardHeight
    context = board.getContext("2d")

    //Draw ship
        //Load Images
    shipImg = new Image()
    shipImg.src = './images/ship.png'
    shipImg.onload = function(){
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height)
    }

    //Draw aliens
    alienImg = new Image()
    alienImg.src = './images/alien.png'

    createAliens()

    requestAnimationFrame(update)
    document.addEventListener("keydown", moveShip)
    document.addEventListener("keyup", shoot)
}

function update(){
    requestAnimationFrame(update)

    if(gameOver){
        return
    }

    context.clearRect(0, 0, board.width, board.height)

    //Draw ship
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height)

    //Draw alien
    for(let i = 0; i < alienArray.length; i++){
        let alien = alienArray[i] 
        if(alien.alive){
            alien.x += alienVelocityX

            //if alien touches borders
            if(alien.x + alien.width >= board.width || alien.x <= 0){
                
                alienVelocityX *= -1
                alien.x += alienVelocityX*2

                //move all aliens one row down
                for(let j = 0; j < alienArray.length; j++){
                    alienArray[j].y += alienHeight
                }
            }



            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height)

            if(alien.y >= ship.y){
                gameOver = true
                gameOverHold.innerHTML = "GAME OVER!"
            }
        }
    }

    //Draw bullet
    for(let i = 0; i < bulletArray.length; i++){
        let bullet = bulletArray[i]
        bullet.y += bulletVelocityY
        context.fillStyle = "white" 
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)

        // bullets collision with aliens
        for(let j = 0; j< alienArray.length;j++){
            let alien = alienArray[j]
            if(!bullet.used && alien.alive && detectCollision(bullet, alien)){
                bullet.used = true
                alien.alive = false
                alienCount--
                score += 100
            }
        }

    }
    //Clear bullets
    while(bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)){        
        bulletArray.shift() // removes first element        
    }

    //check next level
    if ( alienCount == 0){
        //increase columns and rows by 1
        alienColumns = Math.min(alienColumns + 1, columns/2 - 2)
        alienRows = Math.min(alienRows + 1, rows-4)
        alienVelocityX -= 0.1
        alienArray = []
        bulletArray = []
        createAliens()
    }

    //score
    // context.fillStyle="white"
    // context.font="16px press Start 2P"
    // context.fillText(score, 5, 20)
    scoreHold.innerHTML = score
}

function moveShip(e){
    
    if(gameOver){
        return
    }

    if(e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0){
        ship.x -= shipVelocityX // Move left once
    }
    else if (e.code == "ArrowRight" && ship.x + ship.width + shipVelocityX <= board.width){
        ship.x += shipVelocityX //Move right once
    }
}

function createAliens(){
    for(let c = 0; c < alienColumns; c++){
        for(let r = 0; r < alienRows; r++){
            let alien = {
                img : alienImg,
                x : alienX + c*alienWidth,
                y : alienY + r*alienHeight,
                width : alienWidth,
                height : alienHeight,
                alive : true
            }
            alienArray.push(alien)
        }
    }
    alienCount = alienArray.length
}

function shoot(e){

    if(gameOver){
        return
    }

    if(e.code == "Space"){
        //shoot
        let bullet = {
            x : ship.x + ship.width*15/32,
            y : ship.y,
            width : tileSize/8,
            height : tileSize/2,
            used : false
        }
        bulletArray.push(bullet)
    }
}

function detectCollision(a,b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y <b.y + b.height &&
           a.y + a.height > b.y
}