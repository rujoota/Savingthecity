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
    @current_logged_in_user=current_user
    @selected_char=params[:selected_char_id]
    mychar=Character.find_by(id: @selected_char)


    # if user had a previous game state i.e. played previously, then delete that record
    existing_gamestate=Gamestate.find_by(user: @current_logged_in_user)
    if existing_gamestate!=nil
      existing_gamestate.destroy
    end
    gamest=Gamestate.new
    gamest.character=mychar
    gamest.user=@current_logged_in_user
    gamest.is_loggedin=true
    gamest.is_playing=true
    gamest.save
    #Gamestate.create(user_id:1,is_loggedin:true,is_playing:true,character_id:@selected_char)
  end

  def hello_world
    Pusher.trigger('test_channel', 'my-event', {:message => params[:txtToSend]})
  end

  def move_image_left
    Pusher.trigger('key_pressed', 'left-key', {:message => 'data'})
    render :nothing => true
  end
  def move_image_right
    Pusher.trigger('key_pressed', 'right-key', {:message => 'data'})
    render :nothing => true
  end
  def move_image_up
    Pusher.trigger('key_pressed', 'up-key', {:message => 'data'})
    render :nothing => true
  end
  def move_image_down
    Pusher.trigger('key_pressed', 'down-key', {:message => 'data'})
    render :nothing => true
  end

  def show_bullet
    #path=view_context.image_path "bullet.png"
    #explosionpath=view_context.image_path "explosion1_1.png"
    Pusher.trigger('key_pressed', 'enter-key', {:message => "data"})
    render :nothing => true
  end

  def show

  end
  def game

  end

  def gamecanvas

    playerCount=Gamestate.where(is_playing: true).count

    if(playerCount!=2)
      respond_to do |format|
        format.html { render :text => "Please wait for other player to join/quit, only 2 players allowed" }
      end
    else

      @explosionArr=Array.new(12);
      for i in 1..6
        @explosionArr[i-1]=view_context.image_path "explosion1_#{i}.png"
      end
    end

    # after player has selected character....

    #Pusher.trigger('player_channel', 'player_joined', {:message => 'rshah1@gmail.com'})
  end

end
