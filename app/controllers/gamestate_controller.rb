require 'pusher'
#Pusher.url = "https://84f09cdc1b38da624919:22fa8c3691e4d21a6236@api.pusherapp.com/apps/151070"
Pusher.logger = Rails.logger
Pusher.app_id = '151070'
Pusher.key = '84f09cdc1b38da624919'
Pusher.secret = '22fa8c3691e4d21a6236'
class GamestateController < ApplicationController

  def index

  end

  def delete_existing_gamestate(theuser)
    existing_gamestate=Gamestate.find_by(user: theuser)
    if existing_gamestate!=nil
      existing_gamestate.destroy
    end
  end

  def select_my_char
    @current_logged_in_user=current_user
    @selected_char=params[:selected_char_id]
    mychar=Character.find_by(id: @selected_char)

    # if user had a previous game state i.e. played previously, then delete that record
    delete_existing_gamestate(@current_logged_in_user)
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
    Pusher.trigger('game_events', 'left-key', {:message => 'data'})
    render :nothing => true
  end
  def move_image_right
    Pusher.trigger('game_events', 'right-key', {:message => 'data'})
    render :nothing => true
  end
  def move_image_up
    Pusher.trigger('game_events', 'up-key', {:message => 'data'})
    render :nothing => true
  end
  def move_image_down
    Pusher.trigger('game_events', 'down-key', {:message => 'data'})
    render :nothing => true
  end

  def show_bullet
    #path=view_context.image_path "bullet.png"
    #explosionpath=view_context.image_path "explosion1_1.png"
    Pusher.trigger('game_events', 'enter-key', {:message => "data"})
    render :nothing => true
  end

  def show

  end
  def game

  end

  def pusher_test
    Pusher.trigger('my-channel', 'my-event', {:message => 'hello world'})
    #render :nothing => true
  end

  def player_join
    #@current_logged_in_user=current_user
    #@playerCount=Gamestate.where(is_playing: true).count
    Pusher.trigger('game_events', 'player-joined', {:message => "data"})
    #Pusher.trigger('game_events', 'player-joined', {:playerid => @current_logged_in_user.email,:count => @playerCount})
    #render :nothing => true
  end

  def auth
    @playerCount=Gamestate.where(is_playing: true).count

    @current_logged_in_user=current_user
    @mygamestate=Gamestate.find_by(user: @current_logged_in_user)

    #user_id = current_user
    charpath=ActionController::Base.helpers.asset_path(@mygamestate.character.character_image)

    response = Pusher[params[:channel_name]].authenticate(params[:socket_id], {
                                                                                :user_id => @current_logged_in_user.email,
                                                                                :user_info => {
                                                                                    :usernumber => @playerCount,
                                                                                    :charimg => charpath
                                                                                }
                                                                            })
    render :json => response
  end

  def gamecanvas
    select_my_char
    @playerCount=Gamestate.where(is_playing: true).count
    @current_logged_in_user=current_user
    #if(@playerCount==2)
      #flash[:info] = "Please wait for other player to join"
      #respond_to do |format|
       # format.html { render :text => "Please wait for other player to join/quit, only 2 players allowed" }
    #end
    #else
      @explosionArr=Array.new(12);
      for i in 1..6
        @explosionArr[i-1]=view_context.image_path "explosion1_#{i}.png"
      end
      # after player has selected character....
    #end
    #Pusher.trigger('game_events', 'player-joined', {:playerid => @current_logged_in_user.email,:count => @playerCount})
    #Pusher.trigger('game_events', 'player-joined', {:message => "data"})
    #Pusher['presence-example'].trigger('add_user', {:message => "data"})
  end

  def scoreboard
    puts "came to scoreboard"
  end

end
