class Api::UsersController < ApplicationController
 
  protect_from_forgery with: :null_session if respond_to?(:protect_from_forgery)

  
  def create
   
    name     = params.dig(:user, :name)     || params[:name]
    email    = params.dig(:user, :email)    || params[:email]
    password = params.dig(:user, :password) || params[:password]

    user = User.new(name: name, email: email, password: password)

    if user.save
     
      session[:user_id] = user.id if defined?(session)

      render json: {
        id: user.id,
        name: user.name,
        email: user.email
      }, status: :created
    else
      render json: { errors: user.errors.full_messages },
             status: :unprocessable_entity
    end
  end
end
