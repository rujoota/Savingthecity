require 'pusher'
#Pusher.url = "https://84f09cdc1b38da624919:22fa8c3691e4d21a6236@api.pusherapp.com/apps/151070"
Pusher.logger = Rails.logger
Pusher.app_id = '151070'
Pusher.key = '84f09cdc1b38da624919'
Pusher.secret = '22fa8c3691e4d21a6236'
class GamestateController < ApplicationController

  def index
    select_my_char
  end

  def select_my_char
    @selected_char=params[:selected_char_id]
    Gamestate.create(user_id:1,is_loggedin:true,is_playing:false,character_id:@selected_char)
  end

  def hello_world
    Pusher.trigger('test_channel', 'my-event', {:message => params[:txtToSend]})
  end

  def move_image_left
    Pusher.trigger('key_pressed', 'left-key', {:message => 'data'})
  end
  def move_image_right
    Pusher.trigger('key_pressed', 'right-key', {:message => 'data'})
  end
  def move_image_up
    Pusher.trigger('key_pressed', 'up-key', {:message => 'data'})
  end
  def move_image_down
    Pusher.trigger('key_pressed', 'down-key', {:message => 'data'})
  end

  def show_bullet
    path=view_context.image_path "bullet.png"
    explosionpath=view_context.image_path "explosion1_1.png"
    Pusher.trigger('key_pressed', 'enter-key', {:message => path,:explode=>explosionpath})
  end

  def show

  end

end
