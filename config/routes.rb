Rails.application.routes.draw do
  resources :features
  resources :feature_types
  resources :listings
  resources :addresses, except: [:update, :edit, :destroy]

  root "listings#index"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
