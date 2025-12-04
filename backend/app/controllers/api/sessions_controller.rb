class Api::SessionsController < ApplicationController

  skip_before_action :set_current_user, only: [:create]
  
  def create
    user = User.find_by(email: params[:email])

    if user&.authenticate(params[:password])
      session[:user_id] = user.id
      render json: user, status: :ok
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  
  def show
    if current_user
      render json: current_user, status: :ok
    else
      render json: { user: nil }, status: :ok
    end
  end

  
  def destroy
    session.delete(:user_id)
    head :no_content
  end
end
