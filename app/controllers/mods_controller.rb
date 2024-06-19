class ModsController < ApplicationController
  layout "with_navbar"

  def new
    @structure = if params[:mod].present? then Mod.find_by(name: params[:mod]).structure else "[]" end
  end

  def create
    @mod = Mod.new(name: params[:name], structure: params[:structure], author_user: @current.user.id)
    @mod.save
  end

  def show
    @mods = Mod.all
  end
end
