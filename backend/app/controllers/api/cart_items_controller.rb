class Api::CartItemsController < ApplicationController
  before_action :require_login

  def index
    items = current_user.cart_items.includes(:product)
    render json: items.as_json(include: { product: { only: %i[id name brand price image_url category] } })
  end

  def create
    quantity = (params[:quantity] || 1).to_i
    product_id = params[:product_id]

    item = current_user.cart_items.find_or_initialize_by(product_id: product_id)
    item.quantity = (item.quantity || 0) + quantity

    if item.save
      render json: item, status: :ok
    else
      render json: { error: item.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def update
    item = current_user.cart_items.find(params[:id])
    if item.update(quantity: params[:quantity])
      render json: item
    else
      render json: { error: item.errors.full_messages.to_sentence }, status: :unprocessable_entity
    end
  end

  def destroy
    item = current_user.cart_items.find(params[:id])
    item.destroy
    head :no_content
  end
end
