module SimpleCalendar
  class Calendar
    def render(&block)
      view_context.render(
        partial: partial_name,
        locals: {
          passed_options: @options,
          passed_block: block,
          calendar: self,
          date_range: date_range,
          start_date: start_date,
          sorted_events: sorted_events
        }
      )
    end
  end
end
