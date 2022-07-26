class CreateFeatureRegistrations < ActiveRecord::Migration[7.0]
  def change
    create_table :feature_registrations do |t|
      t.references :feature, null: false, foreign_key: true
      t.references :listing, null: false, foreign_key: true
      t.string :description

      t.timestamps
    end
  end
end
