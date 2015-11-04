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
function foo()
{
    $("img")[0].className="newpos";
}

/*$(document).ajaxSend(function(e, xhr, options) {
    var token = $("meta[name='csrf-token']").attr('content');
    xhr.setRequestHeader('X-CSRF-Token', token);
});*/

$(document).bind('keydown', function(e) {
    //alert("key press");


    var code = (e.keyCode ? e.keyCode : e.which);

    switch(code) {
        case 37://left key
            $.ajax({url: "/gamestate/move_image_left" });

            //$.post('/gamestate/move_image_left', { _method: 'post' }, null, 'json');
            break;
        case 39://right key
            $.ajax("/gamestate/move_image_right");
            break;
    }

});
function changePosition(direction)
{
    var elem = $("#superman_img");
    var myleft = elem.css("left");
    var mytop = elem.css("top");

    if(direction=="left") {
        if (myleft == "auto")
            myleft = 0;
        else if (myleft.indexOf("px") > 0)
            myleft = parseInt(myleft.split("px")[0]);

        myleft = myleft - 10;
        //alert(myleft);
        elem.css("left", myleft);
    }
    else if(direction=="right")
    {
        if (myleft == "auto")
            myleft = 0;
        else if (myleft.indexOf("px") > 0)
            myleft = parseInt(myleft.split("px")[0]);

        myleft = myleft + 10;
        //alert(myleft);
        elem.css("left", myleft);
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