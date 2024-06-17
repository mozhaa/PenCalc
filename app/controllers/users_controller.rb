class UsersController < ApplicationController
  layout "with_navbar"

  before_action :unauthorized, only: [:new, :create]

  def new 
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      redirect_to controller: :sessions, action: :new, notice: "User was successfully created!"
    else
      redirect_to controller: :users, action: :new, alert: "User with this nickname already exists!"
    end
  end

  def show
    @user = User.find_by(username: params[:username])
  end

  private

  def user_params
    uparams = params.require(:user).permit(:username, :password, :password_confirmation)
    uparams[:role] = 1 # default role: normal (1)
    uparams
  end

  def unauthorized
    redirect_to root_path if @current.user
  end
end
