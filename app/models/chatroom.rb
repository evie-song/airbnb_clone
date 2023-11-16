class Chatroom < ApplicationRecord
  has_many :messages, dependent: :destroy
  has_many :chatroom_registrations, dependent: :destroy
  belongs_to :listing
end
