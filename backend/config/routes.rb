Rails.application.routes.draw do
  namespace :api, defaults: { format: :json } do
    post   "signup",       to: "users#create"
    post   "login",        to: "sessions#create"
    delete "logout",       to: "sessions#destroy"
    get    "current_user", to: "sessions#show"

    resources :products, only: %i[index show] do
      resources :reviews, only: %i[index create]
    end

    resources :cart_items, only: %i[index create update destroy]
    post "checkout", to: "orders#create"

    resources :orders, only: %i[index show]
  end
end
