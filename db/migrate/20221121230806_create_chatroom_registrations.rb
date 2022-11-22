class CreateChatroomRegistrations < ActiveRecord::Migration[7.0]
  def change
    create_table :chatroom_registrations do |t|
      t.references :user, null: false, foreign_key: true
      t.references :chatroom, null: false, foreign_key: true

      t.timestamps
    end
  end
end
