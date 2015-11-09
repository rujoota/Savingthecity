// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require bootstrap
//= require turbolinks

//= require_tree .
//setTimeout(foo, 1000);
var timeOutBullet;
var bulletSteps=20;
var playerSteps=40;
var explodeimgpath;

function collideRectangle(a, b) {
    var aPos = a.position();
    var bPos = b.position();

    var aLeft = aPos.left;
    var aRight = aPos.left + a.width();
    var aTop = aPos.top;
    var aBottom = aPos.top + a.height();

    var bLeft = bPos.left;
    var bRight = bPos.left + b.width();
    var bTop = bPos.top;
    var bBottom = bPos.top + b.height();

    return !( bLeft > aRight
        || bRight < aLeft
        || bTop > aBottom
        || bBottom < aTop
    );
}

function getPosition(cssPos)
{
    if (cssPos == "auto")
        cssPos = 0;
    else if (cssPos.indexOf("px") > 0)
        cssPos = parseInt(cssPos.split("px")[0]);
    return cssPos;
}
function showBullet(imgPath)
{
    strToAppend="<img src='"+imgPath+"' alt='bullet' class='bulletImg' id='bullet'/>";
    $('#bullet_start').append(strToAppend);
    var bulletTop=getPosition($('.bulletImg').css('top'));
    //mtop=bulletTop;
    startAnimation(bulletTop);
    //updateBulletLocation(0,0,bulletTop,0);
}

function startAnimation(bulletTop){
    bulletTop=bulletTop+bulletSteps;
    if(bulletTop>400) {
        //clearTimeout(timeOutBullet);
        $(".bulletImg").remove();
    }
    else if(collideRectangle($(".bulletImg"),$(".player2")))
    {
        //$(".player2").remove();
        showBlast();
        //var ret=initialize();
    }
    else
        $(".bulletImg").animate({"top": bulletTop}, "fast",
            function(){startAnimation(bulletTop);});
}
function showBlast()
{
    strToAppend="<img src='"+explodeimgpath+"' alt='explosion' class='myexplode' id='explosion'/>";
    $('.explosionDiv').append(strToAppend);
    $(".player2").remove();
    $('.myexplode').hide("explode", { pieces: 2 }, 3000);
    var exaudio = document.getElementById("explosionAudio");
    exaudio.play();
    $(".bulletImg").remove();
}
function updateBulletLocation(left,right,top,bottom)
{
    top=top+10;
    $(".bulletImg").css('top',top);
    if(top>300) {

        //clearTimeout(timeOutBullet);
        removeBullet();
    }
    else if(collide($(".bulletImg"),$(".player2")))
    {
        //alert('in collide');
        //initialize();
        //alert("collision");
        removeObject($(".player2"));
    }
    else
        timeOutBullet=setTimeout(function(){ updateBulletLocation(0,0,top,0) }, 500);
}
/*$(document).ajaxSend(function(e, xhr, options) {
    var token = $("meta[name='csrf-token']").attr('content');
    xhr.setRequestHeader('X-CSRF-Token', token);
});*/

/*$(document).bind('keydown', function(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    switch(code) {
        case 37://left key
            $.ajax({url: "/gamestate/move_image_left" });

            //$.post('/gamestate/move_image_left', { _method: 'post' }, null, 'json');
            break;
        case 39://right key
            $.ajax("/gamestate/move_image_right");
            break;
        case 40://down key
            $.ajax("/gamestate/move_image_down");
            break;
        case 38://up key
            $.ajax("/gamestate/move_image_up");
            break;
        case 13://enter key
            $.ajax("/gamestate/show_bullet");
            break;
    }
});*/
function changePosition(direction,extras,explodepath)
{
    var elem = $("#superman_img");
    var myleft = elem.css("left");
    var mytop = elem.css("top");
    switch(direction)
    {
        case "left":
            if (myleft == "auto")
                myleft = 0;
            else if (myleft.indexOf("px") > 0)
                myleft = parseInt(myleft.split("px")[0]);

            myleft = myleft - 10;
            elem.css("left", myleft);
            elem.animate({left: "-="+playerSteps}, "slow");
            break;
        case "right":
            if (myleft == "auto")
                myleft = 0;
            else if (myleft.indexOf("px") > 0)
                myleft = parseInt(myleft.split("px")[0]);

            myleft = myleft + 10;
            elem.css("left", myleft);
            elem.animate({left: "+="+playerSteps}, "slow");
            break;
        case "down":
            if(mytop=="auto")
                mytop=0;
            else if(mytop.indexOf("px")>0)
                mytop=parseInt(mytop.split("px")[0]);

            mytop=mytop+10;
            elem.css("top",mytop);
            elem.animate({top: "+="+playerSteps}, "slow");
            break;
        case "up":
            if(mytop=="auto")
                mytop=0;
            else if(mytop.indexOf("px")>0)
                mytop=parseInt(mytop.split("px")[0]);

            mytop=mytop-10;
            elem.css("top",mytop);
            elem.animate({top: "-="+playerSteps}, "slow");
            break;
        case "enter":
            explodeimgpath=explodepath;
            showBullet(extras);

            break;
    }

    /*switch(code)
     {
     case 37://left key
     if(myleft=="auto")
     myleft=0;
     if(myleft.indexOf("px")>0)
     myleft=parseInt(myleft.split("px")[0])-10;
     elem.css("left",myleft);
     break;
     case 39://right key
     if(myleft=="auto")
     myleft=0;
     if(myleft.indexOf("px")>0)
     myleft=parseInt(myleft.split("px")[0])+10;
     elem.css("left",myleft);
     break;
     case 40://down key
     if(mytop=="auto")
     mytop=0;
     if(mytop.indexOf("px")>0)
     mytop=parseInt(mytop.split("px")[0])+10;
     elem.css("top",mytop);
     break;
     case 38://up key
     if(mytop=="auto")
     mytop=0;
     if(mytop.indexOf("px")>0)
     mytop=parseInt(mytop.split("px")[0])-10;
     elem.css("top",mytop);
     break;
     case 13://enter key
     alert("enter key");
     break;
     case 32:
     alert("space");break;
     case 97:
     alert("a");break;
     case 119:
     alert("w");break;
     case 115:
     alert("s");break;
     case 100:
     alert("d");break;
     }*/
}