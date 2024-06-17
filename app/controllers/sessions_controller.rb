class SessionsController < ApplicationController
  layout "with_navbar"

  def new
    @session = Session.new
  end

  def create
    user = User.find_by(username: params[:username])
    if user
      puts "Exist"
    end
    if user && user.authenticate(password: params[:password])
      @session.token = Time.now
      redirect_to "/"
    else
      redirect_to "/sessions/new", alert: "Authentication failed!"
    end
  end

  def destroy
    redirect_to "/"
  end
end
