class ApplicationController < ActionController::Base
  before_action :set_current_user

  def set_current_user
    @current = Current.new
    if session[:user_id]
      @current.user = User.find_by(id: session[:user_id])
      session.delete(:user_id) unless @current.user
    end
  end
end
