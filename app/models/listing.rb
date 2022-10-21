class Listing < ApplicationRecord
    include ActionView::Helpers::NumberHelper
    belongs_to :property_type
    belongs_to :user
    belongs_to :address
    has_many :feature_registrations, dependent: :delete_all
    has_many :features, through: :feature_registrations
    has_many_attached :images
    has_many :comments
    has_many :bookings

    def get_all_booked_days
        booked_dates_arr = []
        bookings = self.bookings
        bookings.each do |booking| 
            start_date = booking.start_date
            end_date = booking.end_date
            date_range = start_date..end_date
            date_range.each do |date|
                booked_dates_arr.append(date)
            end
        end
        return booked_dates_arr
    end
end
