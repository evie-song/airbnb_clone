class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :validatable
  has_one_attached :avatar
  has_many :comments
  has_many :bookings
  has_many :addresses
  has_many :listings
  has_many :messages
  has_many :chatroom_registrations
  has_many :chatrooms, through: :chatroom_registrations

  def get_sorted_chatrooms
    chatrooms =
      self
        .chatrooms
        .includes(:messages)
        .sort do |a, b|
          latest_message_a = a.messages.maximum(:created_at) || a.created_at
          latest_message_b = b.messages.maximum(:created_at) || b.created_at

          latest_message_b <=> latest_message_a
        end
  end

  def get_chatrooms_as_host
    chatrooms =
      Chatroom
        .joins(listing: :user)
        .where(users: { id: self.id })
        .includes(:messages)
        .sort do |a, b|
          latest_message_a = a.messages.maximum(:created_at) || a.created_at
          latest_message_b = b.messages.maximum(:created_at) || b.created_at

          latest_message_b <=> latest_message_a
        end
  end
end
