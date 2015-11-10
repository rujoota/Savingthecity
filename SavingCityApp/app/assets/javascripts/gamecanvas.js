var ctx,canvas;
var windowSize={width:1024,height:600};
var playerSize={width:100,height:150};
var bulletObj={x:0,y:0,width:9,height:20,speed:20};
var keyPressed={left:false,right:false,up:false,down:false,enter:false};
var player1={x:0,y:windowSize.height-playerSize.height-10,speed:20,width:playerSize.width,height:playerSize.height};
var player2={x:windowSize.width-playerSize.width-10,y:windowSize.height-playerSize.height-10,speed:10,width:playerSize.width,height:playerSize.height};
var blast={x:0,y:0,width:60,height:60};
var loadingDone=false;
var drawFrameTimeout;

function mymain()
{
    // Create the canvas
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = windowSize.width;
    canvas.height = windowSize.height;
    var mydiv=document.getElementById('divcanvas');
    mydiv.appendChild(canvas);
    //setTimeout(drawFrame, 1000);
    init();
}

function init()
{
    bgImage.onload = function () {
        bgLoaded=true;
    }

    p1Image.onload = function () {
        p1Loaded=true;
    }

    p2Image.onload = function () {
        p2Loaded=true;
    }

    bulletObj.x=player1.x+(player1.width/2);
    bulletObj.y=player1.y+(player1.height/2);
    setTimeout(drawFrame, 1000);
}

$(document).bind('keydown', function(e)  {
    var code = (e.keyCode ? e.keyCode : e.which);
    keyPressed.left=false;
    keyPressed.right=false;
    keyPressed.down=false;
    keyPressed.up=false;
    keyPressed.enter=false;
    e.stopImmediatePropagation();
    switch(code) {
        case 37://left key
            keyPressed.left=true;
            $.ajax({url: "/gamestate/move_image_left" });
            break;
        case 39://right key
            keyPressed.right=true;
            $.ajax({url: "/gamestate/move_image_right" });
            break;
        case 40://down key
            keyPressed.down=true;
            $.ajax({url: "/gamestate/move_image_down" });
            break;
        case 38://up key
            $.ajax({url: "/gamestate/move_image_up" });
            keyPressed.up=true;
            break;
        case 13://enter key
            $.ajax("/gamestate/show_bullet");
            keyPressed.enter=true;
            break;
    }

});
var scoreP1={x:10,y:30,score:0};
var scoreP2={x:windowSize.width-100,y:30,score:0};
var healthP1={x:10,y:50,health:10};
var healthP2={x:windowSize.width-100,y:50,health:10};
function drawFrame()
{
    if(bgLoaded && p1Loaded && p2Loaded)
    {
        drawBackground();
        drawPlayer(p1Image,player1.x,player1.y,p1Loaded);
        drawPlayer(p2Image,player2.x,player2.y,p1Loaded);
        loadingDone = true;
        ctx.font= 'Italic 15px Sans-Serif';
        displayScore();
        displayHealth();
        clearTimeout(drawFrameTimeout);
    }
    else
    {
        if(!loadingDone)
            drawFrameTimeout=setTimeout(drawFrame, 500);
    }
}

var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

// obj1=source/bullet, obj2=dest/player
function isColliding(object1,object2) {

    if (object1.x < object2.x + object2.width  && object1.x + object1.width  > object2.x &&
        object1.y < object2.y + object2.height && object1.y + object1.height > object2.y)
    {
        return true;
    }
    else
    {
        return false;
    }
}

var animFrame,delta= 0,p2Died=false,imgData;
var blastCount= 0,blastImg,timer;
function checkBoundriesForPlayer(player)
{
    if(player.x>canvas.width-player.width)
        player.x-=player.speed;
    else if(player.x<0)
        player.x+=player.speed;

    if(player.y>canvas.height-player.height)
        player.y-=player.speed;
    else if(player.y<0)
        player.y+=player.speed;
}
function isOutOfBoundry(obj)
{
    return obj.x>canvas.width-obj.width||obj.x<0||obj.y>canvas.height-obj.height||obj.y<0
}

function displayHealth()
{
    for(i=0;i<healthP1.health;i++)
        ctx.fillText("|",healthP1.x+i*10,healthP1.y);

    for(i=0;i<healthP2.health;i++)
        ctx.fillText("|",healthP2.x+i*10,healthP2.y);
}
function displayScore()
{
    ctx.fillText("score: "+scoreP1.score,scoreP1.x,scoreP1.y);
    ctx.fillText("score: "+scoreP2.score,scoreP2.x,scoreP2.y);
}
function updateFrame(direction)
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(loadingDone) {
        updatePlayer(direction,player1);
        checkBoundriesForPlayer(player1);
        checkBoundriesForPlayer(player2);
        ctx.drawImage(bgImage, 0, 0);
        // score and health
        displayScore();
        displayHealth();

        // save original background to show when a player dies
        imgData = ctx.getImageData(player2.x, player2.y, player2.width, player2.height);
        ctx.drawImage(p1Image, player1.x, player1.y,player1.width,player1.height);

        // if blasted
        if(direction=="blast") {
            //animFrame=requestAnimationFrame(function(){updateFrame("blast")});
            timer=setTimeout(function(){updateFrame("blast")},150);
            showBlast(player2);
        }
        else
            ctx.drawImage(p2Image, player2.x, player2.y,player2.width,player2.height);
        if(direction=="enter")
        {
            animFrame=requestAnimationFrame(function(){updateFrame("enter")});
            updateBullet();
        }
    }
}
function updateBullet()
{
    // bullet out of canvas border
    if(isOutOfBoundry(bulletObj))
        resetBullet();
    else {
        if (!isColliding(bulletObj, player2)) { // collided with opponent
            ctx.drawImage(bulletImg, bulletObj.x, bulletObj.y);
            delta++;
            bulletObj.x = (player1.width / 2) + player1.x + delta * 10;
            bulletObj.y = player1.y + (player1.height / 2);

        }
        else {
            resetBullet();
            // refresh and show blast
            var exaudio = document.getElementById("explosionAudio");
            exaudio.play();
            timer = setTimeout(function () {updateFrame("blast")}, 150);
        }
    }
}
function updatePlayer(direction,player)
{
    if (direction=="left") {
        player.x -= player.speed;
    }
    else if (direction=="right")
        player.x += player.speed;
    else if(direction=="up")
        player.y-=player.speed;
    else if(direction=="down")
        player.y+=player.speed;
}
function resetBullet()
{
    bulletObj.x = (player1.width / 2) + player1.x;
    bulletObj.y=player1.y+(player1.height/2);
    cancelAnimationFrame(animFrame);
    delta=0;
}
function showBlast(diedPlayer)
{
    blastImg=document.createElement('img');
    blastImg.src=blastImgs[blastCount++];
    blastImg.onload = function () {
        blast.x=diedPlayer.x+(diedPlayer.width/2)-(blast.width/2);
        blast.y=diedPlayer.y+(diedPlayer.height/2)-(blast.height/2);
        ctx.drawImage(blastImg,blast.x,blast.y,blast.width,blast.height);
        if(blastCount==5) // last blasting image showing
        {
            scoreP1.score++;
            healthP2.health--;
        }
        if(blastCount>=6) {
            clearTimeout(timer);
            ctx.putImageData(imgData, diedPlayer.x,diedPlayer.y);
            blastCount=0;
        }
    }
}

function drawPlayer(playerImg,x,y,isLoaded)
{
    if(isLoaded)
        ctx.drawImage(playerImg, x, y,playerSize.width,playerSize.height);
}
function drawBackground()
{
    if(bgLoaded)
        ctx.drawImage(bgImage, 0, 0);
}
