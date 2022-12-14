class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :first_name
      t.string :last_name
      t.string :display_name
      t.string :email
      t.text :about
      t.string :phone_number

      t.timestamps
    end
  end
end
