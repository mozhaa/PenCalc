Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  root :to => redirect("mods")
  resource :mods, only: [:new, :create, :show]
  resource :sessions, only: [:new, :create, :destroy]
  resources :users, only: [:new, :create]
  resources :parts, only: [:create, :edit, :show, :destroy] do
    collection do
      post "search"
    end
  end
  get "/users/:username", to: "users#show", as: :user
end
