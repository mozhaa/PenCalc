class ModsController < ApplicationController
  layout "with_navbar"

  def new
    @structure = if params[:structure].present? then params[:structure] else "[]" end
  end

  def index
    @mods = Mod.all
  end
end
