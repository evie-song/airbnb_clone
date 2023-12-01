class ListingsController < ApplicationController
  before_action :set_listing, only: %i[show edit update destroy]

  # GET /listings or /listings.json
  def index
    # session[:whatever] = 'foo'
    @listings = Listing.all
  end

  def search
    checkin_date_str = params[:checkin_date]
    checkout_date_str = params[:checkout_date]
    @checkin_date = Date.strptime(checkin_date_str, "%m/%d/%Y")
    @checkout_date = Date.strptime(checkout_date_str, "%m/%d/%Y")
    @selected_date_range = (@checkin_date..@checkout_date).to_a

    @listings =
      Listing
        .includes(:bookings)
        .where.not(bookings: Booking.overlapping(@checkin_date, @checkout_date))

    render "index"
  end

  # GET /listings/1 or /listings/1.json
  def show
    @booked_dates = @listing.get_all_booked_days
  end

  # GET /listings/new
  def new
    @feature_types = FeatureType.all
    @listing = Listing.new()
    @property_types = PropertyType.all.map { |p| { id: p.id, name: p.name } }
  end

  # GET /listings/1/edit
  def edit
    @feature_types = FeatureType.all
    @property_types = PropertyType.all.map { |p| { id: p.id, name: p.name } }
  end

  # POST /listings or /listings.json
  def create
    # byebug
    @listing = Listing.new(listing_params)
    feature_list = params[:feature_list].split(",")

    if @listing.save
      save_images(@listing)
      feature_list.each do |feature_num|
        feature_id = feature_num.to_i
        listing_id = @listing.id
        new_registration =
          FeatureRegistration.new(
            { listing_id: listing_id, feature_id: feature_id }
          )
        new_registration.save
      end
      redirect_to listing_url(@listing),
                  notice: "Listing was successfully created."
    else
      flash[
        :error
      ] = "Failed to create new listing! errors: #{@listing.errors.full_messages.join(", ")}"
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
    new_feature_list = params[:feature_list].split(",")
    existing_feature_list = @listing.get_feature_list_in_str.split(",")

    features_to_remove = []
    features_to_add = []
    new_feature_list.each do |new_feature|
      if !existing_feature_list.include? new_feature
        features_to_add.append(new_feature.to_i)
      end
    end
    existing_feature_list.each do |existing_feature|
      if !new_feature_list.include? existing_feature
        features_to_remove.append(existing_feature.to_i)
      end
    end

    if @listing.update(listing_params)
      save_images(@listing)
      features_to_add.each do |feature_num|
        feature_id = feature_num.to_i
        listing_id = @listing.id
        new_registration =
          FeatureRegistration.new(
            { listing_id: listing_id, feature_id: feature_id }
          )
        new_registration.save
      end
      features_to_remove.each do |feature_num|
        feature_id = feature_num.to_i
        listing_id = @listing.id
        feature_registration =
          FeatureRegistration.find_by(
            listing_id: listing_id,
            feature_id: feature_id
          )
        feature_registration.destroy
      end
      redirect_to listing_url(@listing),
                  notice: "Listing was successfully updated."
    else
      format.html { render :edit, status: :unprocessable_entity }
    end

    # respond_to do |format|
    #   if @listing.update(listing_params)
    #     format.html do
    #       redirect_to listing_url(@listing),
    #                   notice: "Listing was successfully updated."
    #     end
    #     format.json { render :show, status: :ok, location: @listing }
    #   else
    #     format.html { render :edit, status: :unprocessable_entity }
    #     format.json do
    #       render json: @listing.errors, status: :unprocessable_entity
    #     end
    #   end
    # end
  end

  # DELETE /listings/1 or /listings/1.json
  def destroy
    @listing.destroy

    respond_to do |format|
      format.html do
        redirect_to listings_url, notice: "Listing was successfully destroyed."
      end
      format.json { head :no_content }
    end
  end

  def request_booking
    @cost_obj = params["cost_obj"]
    # @start_date = params["start_date"]
    # @end_date = params["end_date"]
    @start_date = Date.strptime(params["start_date"])
    @end_date = Date.strptime(params["end_date"])
    @listing_id = params["listing_id"]
    @guest_count = params["guest_count"]
    @listing = Listing.find(@listing_id)
  end

  # listing_calculate_cost
  # POST /listings/:listing_id/calculate_cost
  def calculate_cost
    # byebug
    start_date = Date.strptime(params["start_date"], "%m/%d/%Y")
    end_date = Date.strptime(params["end_date"], "%m/%d/%Y")
    duration = (end_date - start_date).to_i
    listing_id = params["listing_id"].to_i
    listing = Listing.find(listing_id)
    base_total = (listing.default_price.to_i * duration)
    guest_count = params["guest_count"]

    costs = {
      "$#{listing.default_price.to_i} x #{duration} nights": base_total,
      "Cleaning fee": "100",
      "Service fee": "100"
    }

    total_cost = 0
    costs.each do |item, cost|
      cost = cost.to_i
      total_cost = total_cost + cost.to_i
    end

    locals = { costs: costs, total: total_cost }

    respond_to do |format|
      format.html do
        redirect_to listing_request_booking_path(
                      cost_obj: locals,
                      start_date: start_date,
                      end_date: end_date,
                      listing_id: listing_id,
                      guest_count: guest_count
                    )
      end

      format.json do
        rendered_string =
          render_to_string(
            template: "listings/_cost_breakdown",
            formats: [:html],
            layout: false,
            locals: locals
          )
        return render json: { partial: rendered_string }
      end
    end
  end

  def booking_confirmation
    booking = Booking.new
    booking.user_id = params["user_id"]
    booking.listing_id = params["listing_id"]
    booking.start_date = params["start_date"]
    booking.end_date = params["end_date"]
    guest_str = params["guest_count"]
    guest_arr = guest_str.split(", ")
    guest_count = {}
    guest_arr.each do |i|
      guest_obj = i.split(" ")
      if guest_obj.include?("guest") || guest_obj.include?("guests")
        guest_count.merge!({ guest: guest_obj[0] })
      elsif guest_obj.include?("infant") || guest_obj.include?("infants")
        guest_count.merge!({ infant: guest_obj[0] })
      elsif guest_obj.include?("pet") || guest_obj.include?("pets")
        guest_count.merge!({ pet: guest_obj[0] })
      end
    end
    booking.guest_count = guest_count
    booking_cost = JSON.parse((params["booking_cost"]))
    booking.booking_cost = booking_cost

    booking.save

    redirect_to booking_path(booking.id)
  end

  def remove_image
    img_blob_id = params["image_blob_id"]
    listing_id = params["listing_id"]
    listing = Listing.find(listing_id)
    img = listing.images.find_by(blob_id: img_blob_id)
    img.purge
    return render json: { partial: "image removed" }
  end

  private

  def save_images(listing)
    if params[:listing][:images].present?
      params[:listing][:images].each { |image| listing.images.attach(image) }
    end
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_listing
    @listing = Listing.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def listing_params
    params
      .require(:listing)
      .permit(
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
        :description
      )
      .tap { |p| p[:bedroom_config] = JSON.parse(p[:bedroom_config]) }
  end
end
