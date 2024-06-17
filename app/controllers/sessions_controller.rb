class SessionsController < ApplicationController
  layout "with_navbar"

  before_action :unauthorized, except: :destroy

  def new
  end

  def create
    user = User.find_by(username: params[:username])
    if user && user.authenticate(params[:password])
      session[:user_id] = user.id.to_s
      redirect_to "/"
    else
      redirect_to controller: :sessions, action: :new, alert: "Authentication failed!"
    end
  end

  def destroy
    session.delete(:user_id)
    redirect_to "/"
  end

  private

  def unauthorized
    redirect_to root_path if @current.user
  end

end
