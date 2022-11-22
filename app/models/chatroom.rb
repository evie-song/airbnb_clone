class Chatroom < ApplicationRecord
  has_many :messages
  has_many :chatroom_registrations
  belongs_to :listing
end
