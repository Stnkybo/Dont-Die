var myGamePiece;
var myObstacles = [];
var myScore;
var myHealth;

function startGame() {
    myGamePiece = new component(30, 30, "red", 10, 120);
    myGamePiece.gravity = 2.8;
    myScore = new component("30px", "Consolas", "black", myGameArea.canvas.width, 40, "text");
    myHealth = new component("30px", "Consolas", "black", myGameArea.canvas.width/3, 40, "text");
    myHealth.text = "Lives: 3"
    myGameArea.start();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 700;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.health = 3;
    this.isDead = false;
    this.update = function () {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function () {
        //this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY; //+ this.gravitySpeed;
        this.hitBorder();
    }
    this.hitBorder = function () {
        var bottomWall = myGameArea.canvas.height - this.height;
        if (this.y > bottomWall) {
            this.y = bottomWall;
            this.gravitySpeed = 0;

        }

        var topWall = 0;
        if (this.y < topWall) {
            this.y = topWall;
        }
        // Left wall
        if (this.x < topWall) {
            this.x = topWall;
        }
        // Right wall
        let rightWall = myGameArea.canvas.width - this.width
        if (this.x > rightWall) {
            this.x = rightWall;
        }
    }

    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function playerDamage(myGamePiece, damage) {
    myGamePiece.health -= damage
    myHealth.text = "Lives: " + myGamePiece.health;
    document.getElementById("oof").play();
    //alert(myGamePiece.health)
    if (myGamePiece.health < 1) {
        myGamePiece.isDead = true;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;


    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myObstacles.splice(i, 1); // This will remove the element at index i
            i--; // Decrement i since we've modified the array
            playerDamage(myGamePiece, 1);
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        myObstacles.push(new component(10, height, "green", x, 0));
        myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        if (myObstacles[i].x < 0) { // If the obstacle has moved off the screen
            myObstacles.splice(i, 1); // Remove the obstacle
            i--; // Decrement i since we've modified the array
        } else {
            myObstacles[i].update();
        }
    }

    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();
    
    myHealth.update();
    myGamePiece.newPos();
    myGamePiece.update();
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGamePiece.isDead) {

        document.getElementById("7f5147b1-5c71-4664-9ca0-2c74ddb4326c").play();
        sleep(6500).then(() => {
            clearInterval(myGameArea.interval);
            document.getElementById("dead?").hidden = false;
            document.getElementById("deathscreen").hidden = false;
            myGameArea.canvas.remove();
        });
    }
}

function smurfCat() {
    // Create a new audio element
    //var audio = document.body.audio()   //document.createElement('audio');

    // Set the attributes of the audio element
    // audio.id = '7f5147b1-5c71-4664-9ca0-2c74ddb4326c';
    // audio.setAttribute('data-testid', 'audioPlayerAudio');
    // audio.preload = 'auto';
    // audio.autoplay = true;
    // audio.type = 'audio/mpeg';
    // audio.src = 'https://us-tuna-sounds-files.voicemod.net/7f5147b1-5c71-4664-9ca0-2c74ddb4326c-1694030801532.mp3';
    // audio.loop = true
    // Append the audio element to the body of the document (or any other container element)
    //document.body.appendChild(audio);

}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}

// function accelerate(n) {
//     myGamePiece.gravity = n;
// }

// function checkForInput(e) {
//     let code = e.keyCode;
//     switch (code) {
//         case 65: myGamePiece.speedX = -5; break; //Left key
//         case 87: myGamePiece.speedY = -5; break; //Up key
//         case 68: myGamePiece.speedX = 5; break; //Right key
//         case 83: myGamePiece.speedY = 5; break; //Down key
//         default: ; //Everything else
//     }
// }

function sleeper(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sleep(ms) {
    await sleeper(ms);
}
