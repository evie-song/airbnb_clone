class AddFieldsToBookings < ActiveRecord::Migration[7.0]
  def change
    add_column :bookings, :guest_count, :json
    add_column :bookings, :booking_cost, :json
  end
end
