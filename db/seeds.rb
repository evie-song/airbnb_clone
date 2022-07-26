# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

property_type_1 = PropertyType.create(name:'House')
property_type_2 = PropertyType.create(name:'Apartment')
property_type_3 = PropertyType.create(name:'Guesthouse')
property_type_4 = PropertyType.create(name:'Hotel')

user_1 = User.create(first_name:"evie", last_name:"song", display_name:"Evie", email:"evie@gmail.com", phone_number:"312-721-0000")
user_2 = User.create(first_name:"nick", last_name:"deLannoy", display_name:"Nick", email:"nick@gmail.com", phone_number:"312-721-0002")

feature_type_1 = FeatureType.create(name:"Bathroom", )