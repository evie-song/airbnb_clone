class Booking < ApplicationRecord
  belongs_to :user
  belongs_to :listing

  def display_guest_count
    guest_str = ""
    guest_count.each do |key, value|
      if value.to_i == 1
        guest_str += "#{value} #{key}, "
      elsif value.to_i > 1
        guest_str += "#{value} #{key}s, "
      end
    end
    return guest_str.chop.chop
  end

  def formatted_duration
    if start_date.month == end_date.month
      "#{start_date.strftime("%b %e")}-#{end_date.strftime("%e, %Y")}"
    else
      "#{start_date.strftime("%b %e")}-#{end_date.strftime("%b %e, %Y")}"
    end
  end
end
