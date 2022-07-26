class CreateFeatureTypes < ActiveRecord::Migration[7.0]
  def change
    create_table :feature_types do |t|
      t.string :name
      t.string :category

      t.timestamps
    end
  end
end
