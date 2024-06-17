class UsersController < ApplicationController
  def new 
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      redirect_to "sessions/new", notice: "User was successfully created!"
    else
      redirect_to "users/new", alert: "User with this nickname already exists!"
    end
  end
end
