class PartsController < ApplicationController
  def search
    @results = Part.where("name LIKE ?", "%#{Part.sanitize_sql_like(params[:query])}%").limit(50)
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.update("search_results", partial: "part_search_results")
      end
    end
  end
end
