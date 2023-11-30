class AddressesController < ApplicationController
  def index
    @addresses = Address.order("created_at DESC")
  end

  def new
    @address = Address.new
  end

  def create
    @address = Address.new(address_params)

    if @address.save!
      flash[:success] = "address added!"
      redirect_to users_hosting_page_path
    else
      render "new"
    end
  end

  def show
    @address = Address.find(params[:id])
  end

  private

  def address_params
    params.require(:address).permit(
      :street,
      :city,
      :state,
      :country,
      :zip,
      :user_id
    )
  end
end
