class SessionsController < ApplicationController
  def new
  end

  def create

    user = User.find_by(email: params[:session][:email].downcase)
    if user && user.authenticate(params[:session][:password])
      #if user.activated?
        log_in user
        params[:session][:remember_me] == '1' ? remember(user) : forget(user)
        #redirect_back_or user
        redirect_to root_url
      #else
      #  message  = "Account not activated. "
      #  message += "Check your email for the activation link."
      #  flash[:warning] = message
      # redirect_to root_url
      #end
    else
      flash.now[:danger] = 'Invalid email/password combination'
      render 'new'
    end
  end

  def create_fb_user
    auth=request.env["omniauth.auth"]
    session[:omniauth]=auth.except('extra')
    user = User.find_by(email: auth['info']['email'].downcase)
    if user
      user.provider=auth['provider']
      user.uid=auth['uid']
      user.name=auth['info']['name']
      user.save
    else
      user=User.sign_in_from_omniauth(auth)
    end
    log_in user
    redirect_to root_url
  end

  def destroy
    log_out if logged_in?
    redirect_to root_url
  end



end