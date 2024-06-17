class SessionsController < ApplicationController
  def new
    @session = Session.new
  end

  def create
    @user = User.find_by(username: params[:username])
    if !!@user
      @session.token = Time.now
      redirect_to "/"
    else
      redirect_to "sessions/new", alert: "Authentication failed!"
    end
  end

  def destroy
    redirect_to "/"
  end
end
