Rails.application.routes.draw do
  mount ActionCable.server => "/cable"

  resources :chatrooms do
    get "get_details",
        on: :collection,
        to: "chatrooms#get_details",
        as: :get_chatroom_details
    get "get_details_as_host",
        on: :collection,
        to: "chatrooms#get_details_as_host",
        as: :get_chatroom_details_as_host
    get "chatrooms_as_host",
        on: :collection,
        to: "chatrooms#chatrooms_as_host",
        as: :chatrooms_as_host
    get "chatrooms_as_host/:chatroom_id",
        on: :collection,
        to: "chatrooms#chatroom_as_host",
        as: :chatroom_as_host
  end
  post "/chatroom", to: "chatrooms#create", as: :create_chatroom

  resources :messages do
    get "messages_as_host",
        on: :collection,
        to: "messages#messages_as_host",
        as: :messages_as_host
  end
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
    get "users/show_profile/:user_id" => "users/sessions#show_profile",
        :as => :users_show_profile
  end

  resources :bookings
  resources :features
  resources :feature_types
  resources :listings do
    post :calculate_cost
    get :request_booking
    post :booking_confirmation
    post :remove_image
    get :search, on: :collection
  end
  resources :addresses, except: %i[update edit destroy]

  root "listings#index"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
