class ModsController < ApplicationController
  layout "with_navbar"

  def index
    @mods = Mod.all
  end
end
