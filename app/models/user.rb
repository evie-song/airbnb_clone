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
end
