var ctx,canvas;
var windowSize={width:1024,height:600};
var playerSize={width:100,height:150};
var bulletObj={x:0,y:0,width:9,height:20,speed:30,direction:1};

var scoreP1={x:10,y:40,score:0};
var scoreP2={x:windowSize.width-100,y:40,score:0};

var healthP1={x:10,y:60,health:5};
var healthP2={x:windowSize.width-100,y:60,health:5};

var player1={x:0,y:windowSize.height-playerSize.height-10,speed:20,width:playerSize.width,
    height:playerSize.height,sprite:'',mybullet:'',isfiring:false,name:'',isHitByBullet:false,opponent:'',
    myscore:scoreP1,myhealth:healthP1};
var player2={x:windowSize.width-playerSize.width-10,y:windowSize.height-playerSize.height-10,
    speed:10,width:playerSize.width,height:playerSize.height,sprite:'',mybullet:'',isfiring:false,name:'',
    isHitByBullet:false,opponent:'',
    myscore:scoreP2,myhealth:healthP2};

var blast={x:0,y:0,width:60,height:60};
var loadingDone=false,vLoaded=false;
var drawFrameTimeout;
var me,other;
var initialVillainX=100;
var initialVillainY=60;
var villain={x:initialVillainX,y:initialVillainY,width:80,height:100,sprite:"",visible:true};
var p1Loaded=false,p2Loaded=false;
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
        //bulletObj.direction = 1;
    }
    else
    {
        me.sprite = p2Image;
        other.sprite = p1Image;
        //bulletObj.direction = -1;
    }
    villain.sprite = villainImg;
}
// setting up player1 and player2
function setupPlayer(playerid,playernumber)
{
    if(!(playernumber==0 || playernumber>2))
    {
        if (playernumber == 1) {
            //alert('I am p1');
            me = player1;
            me.name='player1#'+playerid;
            other = player2;
        }
        else  if (playernumber == 2)  {
            me = player2;
            me.name='player2#'+currentLoggedinUser;
            other = player1;
        }
        me.opponent=other;
        other.opponent=me;
    }
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

    me.mybullet={x:0,y:0,width:9,height:20,speed:30,direction:1};
    me.mybullet.x=me.x+(me.width/2);
    me.mybullet.y=me.y+(me.height/2);

    other.mybullet={x:0,y:0,width:9,height:20,speed:30,direction:-1};
    other.mybullet.x=other.x+(other.width/2);
    other.mybullet.y=other.y+(other.height/2);

    if(me==player1) {
        me.mybullet.direction = 1;
        other.mybullet.direction = -1;
    }
    else if(me==player2)
    {
        me.mybullet.direction=-1;
        other.mybullet.direction=1;
    }

    setTimeout(drawFrame, 1000);
}

$(document).bind('keydown', function(e)  {
    var code = (e.keyCode ? e.keyCode : e.which);

    e.stopImmediatePropagation();
    switch(code) {
        case 37://left key

            directionGlobal="left";
            presenceChannel.trigger("client-left-key", {x:'left'});
            //$.ajax({url: "/gamestate/move_image_left" });
            break;
        case 39://right key
            directionGlobal="right";
            presenceChannel.trigger("client-right-key", {x:'right'});
            break;
        case 40://down key
            directionGlobal="down";
            presenceChannel.trigger("client-down-key", {x:'down'});
            break;
        case 38://up key
            directionGlobal="up";
            presenceChannel.trigger("client-up-key", {x:'up'});
            break;
        case 13://enter key

            //directionGlobal="enter";
            me.isfiring=true;
            presenceChannel.trigger("client-enter-key", {x:'enter'});
            //$.ajax("/gamestate/show_bullet");
            break;
    }

});

function drawFrame()
{
    if(bgLoaded && p1Loaded && p2Loaded && vLoaded)
    {
        drawBackground();
        drawPlayer(me.sprite,me.x,me.y,p1Loaded);
        drawPlayer(me.opponent.sprite,me.opponent.x,me.opponent.y,p2Loaded);
        //drawPlayer(p1Image,player1.x,player1.y,p1Loaded);
        //drawPlayer(p2Image,player2.x,player2.y,p2Loaded);
        loadingDone = true;
        //ctx.font= 'Italic 15px Sans-Serif';
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
    ctx.font= 'Italic 15px Sans-Serif';
    if(me.myscore==scoreP2)
        me.myscore.x=windowSize.width-350;
    ctx.fillText(me.name+" score: "+me.myscore.score,me.myscore.x,me.myscore.y);
    ctx.fillText(" score: "+me.opponent.myscore.score,me.opponent.myscore.x,me.opponent.myscore.y);
}
var timeEnd;
var gameOver=false;
function isGameOver()
{
    if(me.myhealth.health<=0) {
        ctx.font="50px Arial";
        ctx.fillText("Game over...", windowSize.width / 2, windowSize.height / 2);
        return true;
    }
    else if(me.opponent.myhealth.health<=0) {
        ctx.font="50px Arial";
        ctx.fillText("Game over...", windowSize.width / 2, windowSize.height / 2);
        return true;
    }
    return false;
}
function updateFrame(time)
{
    timeStart=Date.now();
    diff=timeStart-timeEnd;
    //alert("timestart="+timeStart+" timeEnd="+timeEnd+" diff="+diff);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(loadingDone) {

        ctx.drawImage(bgImage, 0, 0);
        gameOver=isGameOver();
        if(!gameOver)
        {
            updatePlayer(directionGlobal, me);
            checkBoundriesForPlayer(me);
            checkBoundriesForPlayer(other);

            // score and health
            displayScore();
            displayHealth();
            updateVillain();
            // save original background to show when a player dies
            imgData = ctx.getImageData(other.x, other.y, other.width, other.height);
            if (me.isHitByBullet)
                showBlast(me);
            else {
                ctx.drawImage(me.sprite, me.x, me.y, me.width, me.height);

            }

            // if blasted
            if (me.opponent.isHitByBullet)
                showBlast(me.opponent);
            else {
                ctx.drawImage(me.opponent.sprite, me.opponent.x, me.opponent.y, me.opponent.width, me.opponent.height);
            }

            if (me.isfiring)
                updateBullet(me);
            if (other.isfiring) {
                updateBullet(other);
            }
            timeEnd = Date.now();
            setTimeout(function () {
                updateFrame(timeEnd)
            }, 100);
        }
        else
        {

            $.ajax({url: "/gamestate/scoreboard",data: {myscore: me.myscore.score,otherscore: me.opponent.myscore.score} });
            //showScoreBoard();
            //location.href='/gamestate/scoreboard';
            //Turbolinks.visit('/gamestate/scoreboard',{myscore: me.myscore.score,otherscore: me.opponent.myscore.score});
        }
    }
}

var villains=new Array();
var villainInRow=6;
function updateVillain()
{
    for(i=0;i<villains.length;i++) {
        if(villains[i]!=undefined && villains[i].visible==true) {
            villains[i].y += villains[i].speedY;
            //villains[i].y+=1;
            if (villains[i].y + villains[i].height > canvas.height) {
                villains[i].y = initialVillainY;
            }
            ctx.drawImage(villains[i].sprite, villains[i].x, villains[i].y, villains[i].width, villains[i].height);
            if(isColliding(villains[i],me))
                me.myhealth.health--;
            if(isColliding(villains[i],me.opponent))
                me.opponent.myhealth.health--;
        }
        else
        {
            villains.splice(i,1); // remove that villain
        }
    }

}
function displayVillain()
{
    var villainSpeeds=new Array();
    /*villainSpeeds[0]=7;
    villainSpeeds[1]=5;
    villainSpeeds[2]=9;
    villainSpeeds[3]=5;
    villainSpeeds[4]=10;
    villainSpeeds[5]=6;*/
    villainSpeeds[0]=1;
     villainSpeeds[1]=2;
     villainSpeeds[2]=1;
     villainSpeeds[3]=2;
     villainSpeeds[4]=1;
     villainSpeeds[5]=2;
    for(i=0;i<villainInRow;i++) {
        villains.push({x:villain.x,y:villain.y,width:villain.width,height:villain.height,sprite:villain.sprite,speedX:50,speedY:1,visible:true});
        if(i>0)
            villains[i].x=villains[i-1].x+villains[i].width+villains[i].speedX;
        villains[i].speedY=villainSpeeds[i];
        ctx.drawImage(villains[i].sprite, villains[i].x, villains[i].y, villains[i].width, villains[i].height);
    }
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function updateBullet(player)
{
    // bullet out of canvas border
    if(isOutOfBoundry(player.mybullet))
        resetBullet(player);
    else {
        var isCollidedWithVillain=false;
        var isCollidedWithPlayer=false;
        for(i=0;i<villains.length;i++) {
            if(player==me) {
                if (isColliding(player.mybullet, villains[i]) && villains[i].visible == true) {
                    isCollidedWithVillain = true;
                    villains[i].visible = false;
                    blastedVillain = i;
                    presenceChannel.trigger("client-villain-died", {index: i});
                    break;
                }
            }
        }
        if(!isCollidedWithVillain)
        {
            if(isColliding(player.mybullet,player.opponent))
            {
                isCollidedWithPlayer=true;
                player.opponent.isHitByBullet=true;
            }
        }
        if(!isCollidedWithPlayer && !isCollidedWithVillain)
        {
            // not collided with opponent
            ctx.drawImage(bulletImg, player.mybullet.x, player.mybullet.y);
            delta++;
            player.mybullet.x = (player.width / 2) + player.x +
                                delta * player.mybullet.speed*player.mybullet.direction;
            player.mybullet.y = player.y + (player.height / 2);

        }
        else { // when collision occurs
            if(blastedVillain!=-1 && villains[blastedVillain]!=undefined) {
                villains[blastedVillain].visible=false;
                blasting(villains[blastedVillain]);
                blastedVillain=-1;
            }
            else if(isCollidedWithPlayer) {
                blasting(player);
            }
            resetBullet(player);
        }

    }

}
function blasting(item)
{
    // refresh and show blast
    var exaudio = document.getElementById("explosionAudio");
    exaudio.play();
    showBlast(item);
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
function resetBullet(player)
{
    player.mybullet.x = (player.width / 2) + player.x;
    player.mybullet.y=player.y+(player.height/2);
    player.isfiring=false;
    //cancelAnimationFrame(animFrame);
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
            //scoreP1.score++;
            //healthP2.health--;
            if(diedPlayer==me) {
                me.myhealth.health--;
                me.opponent.myscore.score++;
            }
            if(diedPlayer==me.opponent)
            {
                me.opponent.myhealth.health--;
                me.myscore.score++;
            }
        }
        if(blastCount>=6) {
            //clearTimeout(timer);
            //ctx.putImageData(imgData, diedPlayer.x,diedPlayer.y);
            blastCount=0;
            directionGlobal="";
            //sleep(3000);
            me.isHitByBullet=false;
            me.opponent.isHitByBullet=false;
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
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}