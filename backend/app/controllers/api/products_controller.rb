class Api::ProductsController < ApplicationController
  def index
    products = Product.all
    products = products.where(category: params[:category]) if params[:category].present?
    products = products.where(brand: params[:brand]) if params[:brand].present?

    case params[:sort]
    when "price_asc"  then products = products.order(price: :asc)
    when "price_desc" then products = products.order(price: :desc)
    end

    render json: products.as_json(methods: :average_rating)
  end

  def show
    product = Product.find(params[:id])
    render json: product.as_json(
      methods: :average_rating,
      include: { reviews: { include: :user } }
    )
  end
end
