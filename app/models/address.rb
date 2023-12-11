class Address < ApplicationRecord
  belongs_to :user
  has_many :listings

  geocoded_by :full_address
  after_validation :geocode

  # after_validation :geocode, if: ->(obj) { obj.full_address.present? }

  # after_validation :geocode_failed

  # def geocode_failed
  #   if (latitude.blank? || longitude.blank?)
  #     errors.add(
  #       :full_address,
  #       "could not be geocoded. Please enter a valid address."
  #     )
  #   end
  # end

  def full_address
    [street, city, state, country].reject(&:empty?).compact.join(", ")
  end
end
