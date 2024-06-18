class ModsController < ApplicationController
  layout "with_navbar"

  def new
    render layout: "editor"
  end

  def index
    @mods = Mod.all
  end
end
