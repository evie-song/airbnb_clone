module ApplicationHelper
  def formatted_duration_between_dates(start_date, end_date)
    today_date = Date.today

    if start_date.year == end_date.year
      if start_date.year == today_date.year
        if start_date.month == end_date.month
          "#{start_date.strftime("%b %e")}-#{end_date.strftime("%e")}"
        else
          "#{start_date.strftime("%b %e")}-#{end_date.strftime("%b %e")}"
        end
      else
        if start_date.month == end_date.month
          "#{start_date.strftime("%b %e")}-#{end_date.strftime("%e, %Y")}"
        else
          "#{start_date.strftime("%b %e")}-#{end_date.strftime("%b %e, %Y")}"
        end
      end
    else
      "#{start_date.strftime("%b %e, %Y")}-#{end_date.strftime("%b %e, %Y")}"
    end
  end
end
