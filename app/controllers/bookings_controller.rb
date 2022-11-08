class BookingsController < ApplicationController
  before_action :set_booking, only: %i[show edit update destroy]

  # GET /bookings or /bookings.json
  def index
    @bookings = Booking.all
  end

  # GET /bookings/1 or /bookings/1.json
  def show
  end

  # GET /bookings/new
  def new
    @booking = Booking.new
  end

  # GET /bookings/1/edit
  def edit
  end

  # POST /bookings or /bookings.json
  def create
    @booking = Booking.new(booking_params)

    respond_to do |format|
      if @booking.save
        format.html do
          redirect_to booking_url(@booking),
                      notice: "Booking was successfully created."
        end
        format.json { render :show, status: :created, location: @booking }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json do
          render json: @booking.errors, status: :unprocessable_entity
        end
      end
    end
  end

  # PATCH/PUT /bookings/1 or /bookings/1.json
  def update
    respond_to do |format|
      if @booking.update(booking_params)
        format.html do
          redirect_to booking_url(@booking),
                      notice: "Booking was successfully updated."
        end
        format.json { render :show, status: :ok, location: @booking }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json do
          render json: @booking.errors, status: :unprocessable_entity
        end
      end
    end
  end

  # DELETE /bookings/1 or /bookings/1.json
  def destroy
    @booking.destroy

    respond_to do |format|
      format.html do
        redirect_to bookings_url, notice: "Booking was successfully destroyed."
      end
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_booking
    @booking = Booking.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def booking_params
    params.require(:booking).permit(
      :user_id,
      :listing_id,
      :start_date,
      :end_date,
      :cancellation_time,
      :guest_count,
      :booking_cost
    )
  end
end
