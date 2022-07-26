require "test_helper"

class ListingsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @listing = listings(:one)
  end

  test "should get index" do
    get listings_url
    assert_response :success
  end

  test "should get new" do
    get new_listing_url
    assert_response :success
  end

  test "should create listing" do
    assert_difference("Listing.count") do
      post listings_url, params: { listing: { about: @listing.about, address_id: @listing.address_id, bathroom_count: @listing.bathroom_count, bed_count: @listing.bed_count, bedroom_config: @listing.bedroom_config, bedroom_count: @listing.bedroom_count, default_price: @listing.default_price, host_id: @listing.host_id, title: @listing.title } }
    end

    assert_redirected_to listing_url(Listing.last)
  end

  test "should show listing" do
    get listing_url(@listing)
    assert_response :success
  end

  test "should get edit" do
    get edit_listing_url(@listing)
    assert_response :success
  end

  test "should update listing" do
    patch listing_url(@listing), params: { listing: { about: @listing.about, address_id: @listing.address_id, bathroom_count: @listing.bathroom_count, bed_count: @listing.bed_count, bedroom_config: @listing.bedroom_config, bedroom_count: @listing.bedroom_count, default_price: @listing.default_price, host_id: @listing.host_id, title: @listing.title } }
    assert_redirected_to listing_url(@listing)
  end

  test "should destroy listing" do
    assert_difference("Listing.count", -1) do
      delete listing_url(@listing)
    end

    assert_redirected_to listings_url
  end
end
