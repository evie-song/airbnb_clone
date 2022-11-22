class AddListingToChatroom < ActiveRecord::Migration[7.0]
  def change
    add_reference :chatrooms, :listing, null: false, foreign_key: true
  end
end
