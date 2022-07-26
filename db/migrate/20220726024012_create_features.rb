class CreateFeatures < ActiveRecord::Migration[7.0]
  def change
    create_table :features do |t|
      t.string :name
      t.references :feature_type, null: false, foreign_key: true

      t.timestamps
    end
  end
end
