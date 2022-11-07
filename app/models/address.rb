class Address < ApplicationRecord
  belongs_to :user
  has_many :listings

  geocoded_by :full_address
  after_validation :geocode

  def full_address
    [street, city, state, country].reject(&:empty?).compact.join(", ")
  end
end
