class Address < ApplicationRecord
  belongs_to :user
  has_many :listings

  geocoded_by :full_address
  after_validation :geocode

  def full_address 
    [street, city, state, country].compact.join(',')
  end
end
