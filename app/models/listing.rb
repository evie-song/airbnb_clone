class Listing < ApplicationRecord
    belongs_to :property_type
    belongs_to :user
    belongs_to :address
    has_many :feature_registrations, dependent: :delete_all
    has_many :features, through: :feature_registrations
    has_many_attached :images
    has_many :comments
end
