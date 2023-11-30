class Chatroom < ApplicationRecord
  has_many :messages, dependent: :destroy
  has_many :chatroom_registrations, dependent: :destroy
  belongs_to :listing

  def bookings_exists
    guest = self.chatroom_registrations[0].user
    listing = self.listing
    bookings_any = Booking.exists?(user_id: guest.id, listing_id: listing.id)
    return bookings_any
  end

  def last_booking
    guest = self.chatroom_registrations[0].user
    listing = self.listing
    bookings = Booking.where(user_id: guest.id, listing_id: listing.id)
    latest_booking = bookings.max_by(&:start_date)
    return latest_booking
  end
end
