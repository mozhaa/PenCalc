Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  root :to => redirect("mods")
  get :mods, to: "mods#index"
  resource :mods, only: :new
  resource :sessions, only: [:new, :create, :destroy]
  resources :users, only: [:new, :create, :show]
  # get "users/:username", to: "users#show"
end
