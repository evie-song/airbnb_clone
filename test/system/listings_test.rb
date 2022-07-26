require "application_system_test_case"

class ListingsTest < ApplicationSystemTestCase
  setup do
    @listing = listings(:one)
  end

  test "visiting the index" do
    visit listings_url
    assert_selector "h1", text: "Listings"
  end

  test "should create listing" do
    visit listings_url
    click_on "New listing"

    fill_in "About", with: @listing.about
    fill_in "Address", with: @listing.address_id
    fill_in "Bathroom count", with: @listing.bathroom_count
    fill_in "Bed count", with: @listing.bed_count
    fill_in "Bedroom config", with: @listing.bedroom_config
    fill_in "Bedroom count", with: @listing.bedroom_count
    fill_in "Default price", with: @listing.default_price
    fill_in "Host", with: @listing.host_id
    fill_in "Title", with: @listing.title
    click_on "Create Listing"

    assert_text "Listing was successfully created"
    click_on "Back"
  end

  test "should update Listing" do
    visit listing_url(@listing)
    click_on "Edit this listing", match: :first

    fill_in "About", with: @listing.about
    fill_in "Address", with: @listing.address_id
    fill_in "Bathroom count", with: @listing.bathroom_count
    fill_in "Bed count", with: @listing.bed_count
    fill_in "Bedroom config", with: @listing.bedroom_config
    fill_in "Bedroom count", with: @listing.bedroom_count
    fill_in "Default price", with: @listing.default_price
    fill_in "Host", with: @listing.host_id
    fill_in "Title", with: @listing.title
    click_on "Update Listing"

    assert_text "Listing was successfully updated"
    click_on "Back"
  end

  test "should destroy Listing" do
    visit listing_url(@listing)
    click_on "Destroy this listing", match: :first

    assert_text "Listing was successfully destroyed"
  end
end
