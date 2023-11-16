class Message < ApplicationRecord
  belongs_to :user
  belongs_to :chatroom

  def message_data
    {
      chatroom_id: chatroom_id,
      content: content,
      created_at: created_at.strftime("%I:%M %p"),
      user_id: user_id,
      user_first_name: user.first_name,
      avatar_url: Rails.application.routes.url_helpers.url_for(user.avatar)
    }
  end
end
