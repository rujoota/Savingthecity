class GamestateController < ApplicationController
  def index
  end
  def select_my_char
    @selected_char=params[:selected_char_id]
    Gamestate.create(user_id:1,is_loggedin:true,is_playing:false,character_id:@selected_char)
    respond_to do |format|
      format.html { render :text => "Your game state is created for id:#{@selected_char}" }
    end
  end
end
