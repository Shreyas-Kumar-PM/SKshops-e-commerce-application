class ApplicationController < ActionController::API
  include ActionController::Cookies

  before_action :set_current_user

  private

  def set_current_user
    @current_user = User.find_by(id: session[:user_id])
  end

  def current_user
    @current_user
  end

  def require_login
    unless current_user
      render json: { error: "Not logged in" }, status: :unauthorized
    end
  end
end
