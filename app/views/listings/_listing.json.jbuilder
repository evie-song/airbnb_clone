json.extract! listing, :id, :title, :about, :default_price, :bedroom_config, :bedroom_count, :bed_count, :bathroom_count, :host_id, :address_id, :created_at, :updated_at
json.url listing_url(listing, format: :json)
