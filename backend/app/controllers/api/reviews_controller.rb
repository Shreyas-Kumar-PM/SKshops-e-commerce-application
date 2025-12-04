class Api::ReviewsController < ApplicationController
  before_action :require_login

  def index
    product = Product.find(params[:product_id])
    render json: product.reviews.includes(:user).as_json(include: :user)
  end

  def create
    product = Product.find(params[:product_id])
    review = product.reviews.build(review_params.merge(user: current_user))
    if review.save
      render json: review.as_json(include: :user), status: :created
    else
      render json: { errors: review.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def review_params
    params.require(:review).permit(:rating, :comment)
  end

  def require_login
    render json: { error: "Not logged in" }, status: :unauthorized unless current_user
  end

  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end
end
