class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  #protect_from_forgery with: :exception
  protect_from_forgery with: :null_session
  include SessionsHelper
  before_action :set_auth
  def set_auth
    @fbauth=session[:omniauth] if session[:omniauth]
  end
end
