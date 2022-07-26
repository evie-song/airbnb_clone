require "application_system_test_case"

class FeatureTypesTest < ApplicationSystemTestCase
  setup do
    @feature_type = feature_types(:one)
  end

  test "visiting the index" do
    visit feature_types_url
    assert_selector "h1", text: "Feature types"
  end

  test "should create feature type" do
    visit feature_types_url
    click_on "New feature type"

    fill_in "Category", with: @feature_type.category
    fill_in "Name", with: @feature_type.name
    click_on "Create Feature type"

    assert_text "Feature type was successfully created"
    click_on "Back"
  end

  test "should update Feature type" do
    visit feature_type_url(@feature_type)
    click_on "Edit this feature type", match: :first

    fill_in "Category", with: @feature_type.category
    fill_in "Name", with: @feature_type.name
    click_on "Update Feature type"

    assert_text "Feature type was successfully updated"
    click_on "Back"
  end

  test "should destroy Feature type" do
    visit feature_type_url(@feature_type)
    click_on "Destroy this feature type", match: :first

    assert_text "Feature type was successfully destroyed"
  end
end
