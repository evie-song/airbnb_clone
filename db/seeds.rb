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
user_2 = User.create(first_name:"nick", last_name:"delannoy", display_name:"Nick", email:"nick@gmail.com", phone_number:"312-721-0002")

feature_type_1 = FeatureType.create(name:"Bathroom", category:"amenities")
feature_type_2 = FeatureType.create(name:"Bedroom and laundry", category:"amenities")
feature_type_3 = FeatureType.create(name:"Entertainment", category:"amenities")
feature_type_4 = FeatureType.create(name:"Heating and cooling", category:"amenities")
feature_type_5 = FeatureType.create(name:"Kitchen and dining", category:"amenities")
feature_type_6 = FeatureType.create(name:"Outdoor", category:"amenities")

bathroom_features = Feature.create([{name:"Bathtub", feature_type_id:feature_type_1.id},
    {name:"Hair dryer", feature_type_id:feature_type_1.id},
    {name:"Shampoo", feature_type_id:feature_type_1.id},
    {name:"Conditioner", feature_type_id:feature_type_1.id},
    {name:"Body soap", feature_type_id:feature_type_1.id},
    {name:"Hot water", feature_type_id:feature_type_1.id}])

bedroom_features = Feature.create([{name:"Free washer – In unit", feature_type_id:feature_type_2.id},
    {name:"Free dryer – In unit", feature_type_id:feature_type_2.id},
    {name:"Shampoo", feature_type_id:feature_type_2.id},
    {name:"Essentials", feature_type_id:feature_type_2.id},
    {name:"Hangers", feature_type_id:feature_type_2.id},
    {name:"Extra pillows and blankets", feature_type_id:feature_type_2.id}])

entertainment_features = Feature.create([{name:"'50' HDTV with Amazon Prime Video, Netflix", feature_type_id:feature_type_3.id},
    {name:"Suitable for events", feature_type_id:feature_type_3.id},
    {name:"Books and reading material", feature_type_id:feature_type_3.id}])

heating_cooling_features = Feature.create([{name:"Central air conditioning", feature_type_id:feature_type_4.id},
    {name:"Central heating", feature_type_id:feature_type_4.id},
    {name:"Window air conditioning", feature_type_id:feature_type_4.id}])

kitchen_features = Feature.create([{name:"Refrigerator", feature_type_id:feature_type_5.id},
    {name:"Microwave", feature_type_id:feature_type_5.id},
    {name:"Freezer", feature_type_id:feature_type_5.id},
    {name:"Cooking basics", feature_type_id:feature_type_5.id},
    {name:"Dishes and silverware", feature_type_id:feature_type_5.id},
    {name:"Dishwasher", feature_type_id:feature_type_5.id}])

outdoor_features = Feature.create([{name:"Private patio or balcony", feature_type_id:feature_type_6.id},
    {name:"Private backyard – Fully fenced", feature_type_id:feature_type_6.id},
    {name:"Fire pit", feature_type_id:feature_type_6.id},
    {name:"Outdoor furniture", feature_type_id:feature_type_6.id},
    {name:"Outdoor dining area", feature_type_id:feature_type_6.id},
    {name:"BBQ grill", feature_type_id:feature_type_6.id}])

address_1 = Address.create(street:"4700 N Sacramento Ave", city:"Chicago", state:"IL", zip:"60625", user_id:user_1.id)
address_2 = Address.create(street:"4701 N California Ave", city:"Chicago", state:"IL", zip:"60618", user_id:user_2.id)

listing_1 = Listing.create(title:"Spacious, Comfy, and Private in Ravenswood Manor",
    about:"Over 2,000 sq ft, this basement has 10 ft ceilings, full kitchen, bath, and makes you feel at home. With a 65” inch smart tv, washer/dryer, and internet, you have everything you need.
    Owners reside upstairs, but are very quiet and accommodating. Come stay in one of the best and convenient areas in Chicago. This home on on a dead end street is only 2 blocks to the brown line train which goes downtown (about 40 min ride). Restaurants and shopping at lincoln square is 15 min walk.",
    address_id:address_2.id,
    default_price:100.0,
    bedroom_config:{"bedroom 1": {"king bed": 1, "queen bed": 1}, "bedroom 2": {"queen bed": 1},"bedroom 3": {"single bed": 2}},
    bedroom_count:3,
    bed_count:4,
    bathroom_count:2,
    user_id:user_1.id,
    property_type_id:property_type_2.id)