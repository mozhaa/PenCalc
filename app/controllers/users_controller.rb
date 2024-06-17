class UsersController < ApplicationController
  layout "with_navbar"

  def new 
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      redirect_to "/sessions/new", notice: "User was successfully created!"
    else
      redirect_to "/users/new", alert: "User with this nickname already exists!"
    end
  end

  private

  def user_params
    uparams = params.require(:user).permit(:username, :password, :password_confirmation)
    uparams[:role] = 1 # default role: normal (1)
    uparams
  end
end
