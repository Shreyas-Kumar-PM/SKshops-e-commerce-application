class Product < ApplicationRecord
  has_many :reviews, dependent: :destroy

  validates :name, :brand, :category, :price, presence: true

  def average_rating
    reviews.average(:rating)&.round(1)
  end
end
