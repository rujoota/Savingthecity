var ctx,canvas;
var windowSize={width:1024,height:600};
var playerSize={width:100,height:150};
var bulletObj={x:0,y:0,width:9,height:20,speed:30,direction:1};
var keyPressed={left:false,right:false,up:false,down:false,enter:false};

var player1={x:0,y:windowSize.height-playerSize.height-10,speed:20,width:playerSize.width,height:playerSize.height,sprite:''};
var player2={x:windowSize.width-playerSize.width-10,y:windowSize.height-playerSize.height-10,speed:10,width:playerSize.width,height:playerSize.height,sprite:''};

var blast={x:0,y:0,width:60,height:60};
var loadingDone=false,vLoaded=false;
var drawFrameTimeout;
var me,other;
var initialVillainX=100;
var initialVillainY=60;
var villain={x:initialVillainX,y:initialVillainY,width:80,height:100,sprite:""};

// initializing canvas
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

    //setupPlayer(currentUser,currentPlayerNo);
    setupSprite();
    init();
}
function setupSprite()
{
    if(me==player1)
    {
        me.sprite = p1Image;
        other.sprite = p2Image;
        bulletObj.direction = 1;
    }
    else
    {
        me.sprite = p2Image;
        other.sprite = p1Image;
        bulletObj.direction = -1;
    }
    villain.sprite = villainImg;
}
// setting up player1 and player2
function setupPlayer(playerid,playernumber)
{
    //alert(playernumber);
    if(!(playernumber==0 || playernumber>2))
    {
        if (playernumber == 1) {
            //alert('I am p1');
            me = player1;
            other = player2;
            /*me.sprite = p1Image;
            other.sprite = p2Image;
            bulletObj.direction = 1;*/
        }
        else  if (playernumber == 2)  {
            //alert('I am p2');
            me = player2;
            other = player1;
            /*me.sprite = p2Image;
            other.sprite = p1Image;
            bulletObj.direction = -1;*/
        }
        //villain.sprite = villainImg;
    }
    //else
        //alert('please wait for other players to join');
}

// loading all the images for sprites
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
    villainImg.onload=function(){
        vLoaded=true;
    }
    bulletObj.x=me.x+(me.width/2);
    bulletObj.y=me.y+(me.height/2);
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

            directionGlobal="left";
            presenceChannel.trigger("client-left-key", {x:'a'});
            //$.ajax({url: "/gamestate/move_image_left" });
            break;
        case 39://right key
            directionGlobal="right";
            presenceChannel.trigger("client-right-key", {x:'a'});
            break;
        case 40://down key
            directionGlobal="down";
            presenceChannel.trigger("client-down-key", {x:'a'});
            break;
        case 38://up key
            directionGlobal="up";
            presenceChannel.trigger("client-up-key", {x:'a'});
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
    if(bgLoaded && p1Loaded && p2Loaded && vLoaded)
    {
        drawBackground();
        drawPlayer(p1Image,player1.x,player1.y,p1Loaded);
        drawPlayer(p2Image,player2.x,player2.y,p2Loaded);
        loadingDone = true;
        ctx.font= 'Italic 15px Sans-Serif';
        displayScore();
        displayHealth();
        displayVillain();
        clearTimeout(drawFrameTimeout);
        setTimeout(updateFrame, 500);
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
var timeEnd;
var bulletBg;
function updateFrame(time)
{

    timeStart=Date.now();
    diff=timeStart-timeEnd;
    //alert("timestart="+timeStart+" timeEnd="+timeEnd+" diff="+diff);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(loadingDone) {

        ctx.drawImage(bgImage, 0, 0);
        updatePlayer(directionGlobal,me);
        checkBoundriesForPlayer(me);
        checkBoundriesForPlayer(other);

        // score and health
        displayScore();
        displayHealth();

        /*if(diff>20) {
            //alert(diff);
            updateVillain();
        }*/
        updateVillain();
        // save original background to show when a player dies
        imgData = ctx.getImageData(other.x, other.y, other.width, other.height);
        ctx.drawImage(me.sprite, me.x, me.y,me.width,me.height);

        // if blasted
        if(directionGlobal=="blastPlayer") {

            //timer=setTimeout(function(){updateFrame("blast")},150);
            showBlast(other);

        }
        else
            ctx.drawImage(other.sprite, other.x, other.y,other.width,other.height);
        if(directionGlobal=="blastVillain")
        {
            showBlast(villains[blastedVillain]);
        }
        if(directionGlobal=="enter")
        {
            //setTimeout(function(){updateFrame("enter")}, 500);
            bulletBg = ctx.getImageData(bulletObj.x, bulletObj.y, bulletObj.width, bulletObj.height);
            updateBullet();
        }
        timeEnd=Date.now();
        setTimeout(function(){updateFrame(timeEnd)}, 100);
    }
}
var villains=new Array();
var villainInRow=6;
function updateVillain()
{
    for(i=0;i<villains.length;i++) {
        if(i!=blastedVillain) {
            villains[i].y += villains[i].speedY;
            //villains[i].y+=1;
            if (villains[i].y + villains[i].height > canvas.height) {
                villains[i].y = initialVillainY;
            }
            ctx.drawImage(villains[i].sprite, villains[i].x, villains[i].y, villains[i].width, villains[i].height);
        }
        else
        {
            //villains.splice(i,1);
            //villains.push({x:villain.x,y:villain.y,width:villain.width,height:villain.height,sprite:villain.sprite,speedX:50,speedY:1});
        }
    }

}
function displayVillain()
{
    for(i=0;i<villainInRow;i++) {
        villains.push({x:villain.x,y:villain.y,width:villain.width,height:villain.height,sprite:villain.sprite,speedX:50,speedY:1});
        if(i>0)
            villains[i].x=villains[i-1].x+villains[i].width+villains[i].speedX;
        villains[i].speedY=getRandomArbitrary(5,20);
        ctx.drawImage(villains[i].sprite, villains[i].x, villains[i].y, villains[i].width, villains[i].height);
    }

}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
var blastedVillain;
function updateBullet()
{
    var oldx=bulletObj.x,oldy=bulletObj.y;
    // bullet out of canvas border
    if(isOutOfBoundry(bulletObj))
        resetBullet();
    else {
        var isCollidedWithVillain=false;
        var isCollidedWithPlayer=false;
        for(i=0;i<villainInRow;i++) {
            if (isColliding(bulletObj, villains[i])) {
                isCollidedWithVillain=true;
                blastedVillain=i;
                break;
            }
        }
        if(!isCollidedWithVillain)
        {
            if(isColliding(bulletObj,other))
                isCollidedWithPlayer=true;
        }
        if(!isCollidedWithPlayer && !isCollidedWithVillain)
        {
            // not collided with opponent
                ctx.drawImage(bulletImg, bulletObj.x, bulletObj.y);
                delta++;
                bulletObj.x = (me.width / 2) + me.x + delta * bulletObj.speed*bulletObj.direction;
                bulletObj.y = me.y + (me.height / 2);
                //bulletObj.x = (me.width / 2) + me.x;
                //bulletObj.y = (me.height / 2) + me.y - delta * bulletObj.speed;

        }
        else { // when collision occurs
            resetBullet();
            // refresh and show blast
            var exaudio = document.getElementById("explosionAudio");
            exaudio.play();
            if(isCollidedWithPlayer)
                directionGlobal = "blastPlayer";
            else if(isCollidedWithVillain)
                directionGlobal = "blastVillain";
            //timer = setTimeout(function () {updateFrame("blast")}, 150);
        }

    }

}
function updatePlayer(direction,player)
{
    if (direction=="left") {
        player.x -= player.speed;
        directionGlobal="";
    }
    else if (direction=="right") {
        player.x += player.speed;
        directionGlobal="";
    }
    else if(direction=="up") {
        player.y -= player.speed;
        directionGlobal="";
    }
    else if(direction=="down") {
        player.y += player.speed;
        directionGlobal = "";
    }

}
function resetBullet()
{
    bulletObj.x = (me.width / 2) + me.x;
    bulletObj.y=me.y+(me.height/2);
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
        //alert("blast drawing");
        ctx.drawImage(blastImg,blast.x,blast.y,blast.width,blast.height);
        if(blastCount==5) // last blasting image showing
        {
            scoreP1.score++;
            healthP2.health--;
        }
        if(blastCount>=6) {
            //clearTimeout(timer);
            //ctx.putImageData(imgData, diedPlayer.x,diedPlayer.y);
            blastCount=0;
            directionGlobal="";
            // to kill time after blast




            blastedVillain=-1;
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
