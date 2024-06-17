class ModsController < ApplicationController
  layout "with_navbar"

  def new
  end

  def index
    @mods = Mod.all
  end
end
