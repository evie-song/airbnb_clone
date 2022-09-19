class ListingsController < ApplicationController
  before_action :set_listing, only: %i[ show edit update destroy ]

  # GET /listings or /listings.json
  def index
    @listings = Listing.all
  end

  # GET /listings/1 or /listings/1.json
  def show
      
  end

  # GET /listings/new
  def new
    @feature_types = FeatureType.all
    @listing = Listing.new()
    @property_types = PropertyType.all.map{ |p| { id: p.id, name: p.name }}

    
  end

  # GET /listings/1/edit
  def edit
  end

  # POST /listings or /listings.json
  def create
    @listing = Listing.create!(listing_params)
    feature_list = params[:feature_list].split(",")
    byebug

    if @listing.save
      feature_list.each do |feature_num|
        feature_id = feature_num.to_i 
        listing_id = @listing.id
        new_registration = FeatureRegistration.new({:listing_id => listing_id,:feature_id => feature_id})
        new_registration.save
      end
      redirect_to listing_url(@listing),notice: "Listing was successfully created." 
    else
      flash[:error] = "Failed to create new listing! errors: #{@listing.errors.full_messages.join(', ')}"
      redirect_to new_listing_path({ listing: listing_params.to_h })
    end

    

    # respond_to do |format|
    #   if @listing.save
    #     format.html { redirect_to listing_url(@listing), notice: "Listing was successfully created." }
    #     format.json { render :show, status: :created, location: @listing }
    #   else
    #     format.html { redirect_to new_listing_path, status: :unprocessable_entity }
    #     format.json { render json: @listing.errors.to_json, status: :unprocessable_entity }
    #   end
    # end
  end

  # PATCH/PUT /listings/1 or /listings/1.json
  def update
    respond_to do |format|
      if @listing.update(listing_params)
        format.html { redirect_to listing_url(@listing), notice: "Listing was successfully updated." }
        format.json { render :show, status: :ok, location: @listing }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @listing.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /listings/1 or /listings/1.json
  def destroy
    @listing.destroy

    respond_to do |format|
      format.html { redirect_to listings_url, notice: "Listing was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_listing
      @listing = Listing.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def listing_params
      params.require(:listing).permit(
        :title,
        :about,
        :default_price,
        :bedroom_config,
        :bedroom_count,
        :bed_count,
        :bathroom_count,
        :user_id,
        :address_id,
        :property_type_id,
        images: [],
      ).tap do |p|
        p[:bedroom_config] = JSON.parse(p[:bedroom_config])
      end
    end
end
