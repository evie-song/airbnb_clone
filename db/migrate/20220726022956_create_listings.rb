class CreateListings < ActiveRecord::Migration[7.0]
  def change
    create_table :listings do |t|
      t.string :title
      t.text :about
      t.float :default_price
      t.json :bedroom_config
      t.integer :bedroom_count
      t.integer :bed_count
      t.integer :bathroom_count
      t.references :host, null: false, foreign_key: true
      t.references :address, null: false, foreign_key: true
      t.references :property_type, null: false, foreign_key: true

      t.timestamps
    end
  end
end
