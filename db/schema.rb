# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_07_26_024226) do
  create_table "addresses", force: :cascade do |t|
    t.string "street"
    t.string "city"
    t.string "state"
    t.string "zip"
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_addresses_on_user_id"
  end

  create_table "feature_registrations", force: :cascade do |t|
    t.integer "feature_id", null: false
    t.integer "listing_id", null: false
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["feature_id"], name: "index_feature_registrations_on_feature_id"
    t.index ["listing_id"], name: "index_feature_registrations_on_listing_id"
  end

  create_table "feature_types", force: :cascade do |t|
    t.string "name"
    t.string "category"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "features", force: :cascade do |t|
    t.string "name"
    t.integer "feature_type_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["feature_type_id"], name: "index_features_on_feature_type_id"
  end

  create_table "listings", force: :cascade do |t|
    t.string "title"
    t.text "about"
    t.float "default_price"
    t.json "bedroom_config"
    t.integer "bedroom_count"
    t.integer "bed_count"
    t.integer "bathroom_count"
    t.integer "host_id", null: false
    t.integer "address_id", null: false
    t.integer "property_type_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["address_id"], name: "index_listings_on_address_id"
    t.index ["host_id"], name: "index_listings_on_host_id"
    t.index ["property_type_id"], name: "index_listings_on_property_type_id"
  end

  create_table "property_types", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "display_name"
    t.string "email"
    t.text "about"
    t.string "phone_number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "addresses", "users"
  add_foreign_key "feature_registrations", "features"
  add_foreign_key "feature_registrations", "listings"
  add_foreign_key "features", "feature_types"
  add_foreign_key "listings", "addresses"
  add_foreign_key "listings", "hosts"
  add_foreign_key "listings", "property_types"
end
