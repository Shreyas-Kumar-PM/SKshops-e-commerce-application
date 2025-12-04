class Api::OrdersController < ApplicationController
  before_action :require_login

  def create
    cart_items = current_user.cart_items.includes(:product)

    if cart_items.empty?
      return render json: { error: "Cart is empty" }, status: :unprocessable_entity
    end

    total = cart_items.sum { |item| item.product.price * item.quantity }

    order = current_user.orders.build(
      total_price: total,
      status: "completed"
    )

    cart_items.each do |item|
      order.order_items.build(
        product:  item.product,
        quantity: item.quantity
      )
    end

    if order.save
    
      cart_items.destroy_all

      render json: {
        id:          order.id,
        total_price: order.total_price,
        status:      order.status,
        created_at:  order.created_at
      }, status: :created
    else
      render json: { error: order.errors.full_messages.to_sentence },
             status: :unprocessable_entity
    end
  end


  def index
    orders = current_user.orders
                         .includes(order_items: :product)
                         .order(created_at: :desc)

    render json: orders.as_json(
      only: %i[id total_price status created_at],
      include: {
        order_items: {
          only: %i[id quantity],
          include: {
            product: {
              only: %i[id name brand price image_url category]
            }
          }
        }
      }
    )
  end

 
  def show
    order = current_user.orders
                        .includes(order_items: :product)
                        .find(params[:id])

    render json: order.as_json(
      only: %i[id total_price status created_at],
      include: {
        order_items: {
          only: %i[id quantity],
          include: {
            product: {
              only: %i[id name brand price image_url category]
            }
          }
        }
      }
    )
  end
end
