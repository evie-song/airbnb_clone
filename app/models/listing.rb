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
  has_rich_text :description
  has_many :chatrooms

  def get_all_booked_days
    booked_dates_arr = []
    bookings = self.bookings
    bookings.each do |booking|
      start_date = booking.start_date
      end_date = booking.end_date
      date_range = start_date..end_date
      date_range.each { |date| booked_dates_arr.append(date) }
    end
    return booked_dates_arr
  end

  def get_total_bed_count
    bed_count = 0
    bedroom_config = self.bedroom_config
    bedroom_config.each { |bedroom| bed_count += bedroom["bed_count"] }
    return bed_count
  end

  def get_registered_feature_types
    feature_type = []
    self.features.each do |feature|
      feature_type.append(feature.feature_type.name)
    end
    feature_type.uniq
    feature_type.sort!
    return feature_type
  end

  def get_feature_list_in_str
    feature_list = ""
    self.features.each { |feature| feature_list += "#{feature.id.to_s}," }
    feature_list.chop!
    return feature_list
  end
end
