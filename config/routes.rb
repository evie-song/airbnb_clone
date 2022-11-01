Rails.application.routes.draw do
  devise_for :users,
             controllers: {
               sessions: "users/sessions",
               registrations: "users/registrations",
               passwords: "users/passwords"
             }

  devise_scope :user do
    get "users/change_password" => "users/registrations#change_password"
    get "users/trips" => "users/sessions#trips"
    get "users/hosting_page" => "users/sessions#hosting_page"
  end

  resources :bookings
  resources :features
  resources :feature_types
  resources :listings do
    post :calculate_cost
    get :request_booking
    post :booking_confirmation
    post :remove_image
  end
  resources :addresses, except: %i[update edit destroy]

  root "listings#index"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
