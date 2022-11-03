$(document).ready(function(){
	// display dynamic google map for listing address on listing page. 
	if ($('#map').length) {
		let map, marker;
		const $mapEle = $('#map')
		const $longitude = $mapEle.data('lon')
		const $latitude = $mapEle.data('lat')
		const $coordinates = { lat: $latitude, lng: $longitude }
		
		map = new google.maps.Map($("#map")[0], {
			center: $coordinates,
			zoom: 12,
		})

		marker = new google.maps.Marker ({
			position: $coordinates,
			icon: {
				url: $mapEle.data('marker'),
				size: new google.maps.Size(46, 46),
				scaledSize: new google.maps.Size(46, 46),
				// anchor: new google.maps.Point(0, 50)
			},

			// icon: { size: new google.maps.Size(120, 120)},
			label: {
				text: "\ue88a", // codepoint from https://fonts.google.com/icons
				fontFamily: "Material Icons",
				color: "#ffffff",
				fontSize: "24px",
			},
			map: map,
		});
	};

	// render listings map for all listings listed. 
	if ($('#searchMap').length) {
		let map, marker;
		// const $mapEle = $('#map')
		// const $longitude = $mapEle.data('lon')
		// const $latitude = $mapEle.data('lat')
		// const $coordinates = { lat: $latitude, lng: $longitude }
		const $centerCoordinates = { lat: 41.9668787, lng: -87.7038547 }

		
		map = new google.maps.Map($("#searchMap")[0], {
			center: $centerCoordinates,
			zoom: 10,
		})

		const infoWindow = new google.maps.InfoWindow({
			maxWidth: 210,
		});

		const $listingBlocks = $('.listing-block')

		$listingBlocks.each(function(index, value){
			const $longitude = $(this).data('lon')
			const $latitude = $(this).data('lat')
			const $coordinates = { lat: $latitude, lng: $longitude }
			const $rate = $(this).data('rate')
			const $listingID = $(this).data('id')
			marker = new google.maps.Marker ({
				position: $coordinates,
				icon: {
					url: $('#searchMap').data('marker'),
					size: new google.maps.Size(52, 65),
					scaledSize: new google.maps.Size(52, 65),
					// anchor: new google.maps.Point(0, 50)
				},
				label: {
					text: $rate,
					fontSize: "14px",
					fontWeight: "500"
				},
				title: `${$listingID}`,
				map: map,
				
			});

			// marker.addListener("click", () => {
			// 	infoWindow.close();
			// 	infoWindow.setContent(marker.getTitle());
			// 	infoWindow.open(marker.getMap(), marker);
			// });

			google.maps.event.addListener(marker, "click", (function(marker) {
				return function(evt) {
					const listingID = marker.getTitle();
					const $content = $(`.listing-block[data-id="${listingID}"]`)
					console.log($content, $content[0].outerHTML)

					infoWindow.setContent($content[0].outerHTML);
					infoWindow.open(map, marker);
				}
			})(marker));
	
		})

	};
	
	// Config defaul bedroom name when adding a new bedroom. 
	$(document).on('click', 'button.add-bedroom-btn', function(){
		const currentBedroom = $('.bedroom-display').length
		const defaultBedroomName = 'Bedroom ' + (currentBedroom + 1)
		$('input.bedroom-name').val(defaultBedroomName)
		const $alertEle = $('#newBedroomModal .modal-body .alert')
			if (!$alertEle.hasClass('d-none')) {
				$alertEle.addClass('d-none')
			}
	})

	// Focus on bedroom name input when modal is open. 
	$(document).on('shown.bs.modal', '#newBedroomModal', function(){
		$('input.bedroom-name').focus()
	})

	// Add a new bed config for a new bedroom. 
	$(document).on("click", ".js-add-bed-btn", function(){

		const $selectedbtn = $(this)
		const $newBedType = $selectedbtn.closest('tr').find('.js-new-bed-type').find('select').val()
		if ($newBedType === "blank") {
			console.log(' blank')
			$('td.js-new-bed-type select').focus()
		} else {
			const $alertEle = $('#newBedroomModal .modal-body .alert')
			if (!$alertEle.hasClass('d-none')) {
				$alertEle.addClass('d-none')
			}
			const $newBedCount = $selectedbtn.closest('tr').find('.js-new-bed-count').find('input').val()
			const $newRow = $('tr.example-row-bed-config').clone()
			$newRow.find('.bed-type').text($newBedType)
			$newRow.find('.bed-count').text($newBedCount)
			$newRow.removeClass('example-row-bed-config')
			$newRow.addClass('bed-config-row')
			$newRow.insertBefore('tr.example-row-bed-config')
			$('select.form-select').val('blank')
		}
	})

	// Remove a new bed config for a new bedroom. 
	$(document).on("click", ".js-remove-bed-btn", function(){
		const $selectedbtn = $(this)
		const $selectedRow = $selectedbtn.closest('tr')
		$selectedRow.remove()
	})

	// Add a new bedroom.
	$(document).on('click', ".js-add-bedroom", function(){
		const $bedConfigs = $('tr.bed-config-row')
		if (!$bedConfigs.length) {
			$('td.js-new-bed-type select').focus()
			const $alertEle = $('#newBedroomModal .modal-body .alert')
			$alertEle.text('Add at least one bed configuration!')
			$alertEle.removeClass('d-none')
		} else {
			const $roomTitle = $("input.bedroom-name").val()
			const $bedroomDisplay = $('.example-bedroom-display').clone()
			$bedroomDisplay.find('.bedroom-title').text($roomTitle)

			let bedArray = []
			let bedCount = 0
			$bedConfigs.each(function(){
				const $bedType = $(this).find('.bed-type').text()
				const $bedCount = $(this).find('.bed-count').text()
				bedArray.push({"type": $bedType, "count": $bedCount})
				bedCount += parseInt($bedCount)

				const $bedConfigDisplay = $('li.example-bed-config-display').clone()
				$bedConfigDisplay.find('.bed-count').text($bedCount)
				$bedConfigDisplay.find('.bed-type').text($bedType)
				$bedConfigDisplay.removeClass('example-bed-config-display')
				$bedroomDisplay.find('ul').append($bedConfigDisplay)
			})

			const bedroomConfigObj = {"title": $roomTitle, "bed_count": bedCount, "beds": bedArray}

			$bedroomDisplay.removeClass('example-bedroom-display')
			$bedroomDisplay.removeClass('d-none')
			$bedroomDisplay.addClass('bedroom-display')

			$bedroomDisplay.find('li.example-bed-config-display').remove()
			$bedroomDisplay.attr("data-config", JSON.stringify(bedroomConfigObj))
			$bedroomDisplay.insertBefore($('.example-bedroom-display'))
			$('.bed-config-row').remove()

			// set value of bedroom_config input. 
			const $bedroomConfigEle = $bedroomDisplay.siblings('input.bedroom-config')
			let configArray = JSON.parse($bedroomConfigEle.val())
			configArray.push(bedroomConfigObj)
			$bedroomConfigEle.val(JSON.stringify(configArray))

			// set value of bedroom_count input. 
			const $bedroomCountEle = $bedroomDisplay.siblings('input.bedroom-count')
			const totalBedroomCount = (parseInt($bedroomCountEle.val()) + 1)
			$bedroomCountEle.val(totalBedroomCount)

			// set value of bed_count input. 
			const $bedCountEle = $bedroomDisplay.siblings('input.bed-count')
			const totalBedCount = (parseInt($bedCountEle.val()) + bedroomConfigObj["bed_count"])
			$bedCountEle.val(totalBedCount)

			// close the modal window.
			$('#newBedroomModal').modal('toggle');
		}
	})

	// Remove a bedroom
	$(document).on('click', ".bedroom-display .button-wrapper", function(){
		// remove the bedroom diaplay div.
		const $bedroomDisplayEle = $(this).closest('.bedroom-display')
		$bedroomDisplayEle.addClass('d-none')

		// set value of bedroom_config input.
		const $bedroomConfigEle = $bedroomDisplayEle.siblings('input.bedroom-config')
		const $bedroomTitle = $bedroomDisplayEle.find('.bedroom-title').text()
		let configArray = JSON.parse($bedroomConfigEle.val())
		for (const index in configArray) {
			if (configArray[index]["title"] === $bedroomTitle ) {
				configArray.splice(index, 1)
			}
		}
		$bedroomConfigEle.val(JSON.stringify(configArray))

		// set value of bed_count input.
		const $bedroomCountEle = $bedroomDisplayEle.siblings('input.bedroom-count')
		const totalBedroomCount = (parseInt($bedroomCountEle.val()) - 1)
		$bedroomCountEle.val(totalBedroomCount)

		// set value of bed_count input. 
		const $bedCountEle = $bedroomDisplayEle.siblings('input.bed-count')
		const $bedCount = $bedroomDisplayEle.find('li span.bed-count')
		let bedNum = 0
		$bedCount.each(function(){
			bedNum = bedNum + (parseInt($(this).text()))
		})
		console.log($bedCountEle, $bedCount, bedNum)
		const totalBedCount = (parseInt($bedCountEle.val()) - bedNum)
		$bedCountEle.val(totalBedCount)
	})

	// Check and uncheck feature checkboxes. 
	$(document).on("change", ".js-feature-checkbox", function(){
		const $featureId = $(this).siblings('input.feature-id').val()
		const $featureDisplayEle = $('.feature-display').find(".feature-container").filter(`[data-id='${$featureId}']`)
		const $featureTypeId = $(this).closest('.feature-type').data('id')
		const $featureTypeContainer = $('.feature-type-container').filter(`[data-id='${$featureTypeId}']`)
		const $featureListEle = $('input.feature-list')
		let featureList = $featureListEle.val().split(',')
		featureList = featureList.filter(Number) 		

		if ($(this).is(":checked")) {
			$featureDisplayEle.removeClass('d-none')
			$featureDisplayEle.addClass('selected')
			if ($featureTypeContainer.hasClass('d-none')) {
				$featureTypeContainer.removeClass('d-none')
			}
			featureList.push($featureId)
			featureList.sort()
		} else {
			$featureDisplayEle.removeClass('selected')
			$featureDisplayEle.addClass('d-none')
			if ($featureTypeContainer.find('.selected').length < 1 ) {
				$featureTypeContainer.addClass('d-none')
			}
			for (var i = 0; i < featureList.length; i++ ) {
				if ( featureList[i] === $featureId ) {
					featureList.splice(i, 1)
				}
			}
		}
	$featureListEle.val(featureList)
	console.log($featureListEle.val())
	})

	// slide listing img when arrow keys are pressed. 
	$(document).on("click", "button.slide-btn", function(event) {
		event.stopPropagation()

		const $btnSelected = $(this)
		const $imgCollectEle = $btnSelected.siblings('a').find('.listing-imgs-collection')
		const $displayImg = $imgCollectEle.find('img.show')
		
		if ($btnSelected.hasClass('back-btn')) {

			if ($displayImg.hasClass('last-img')) {
				$btnSelected.siblings('button.forward-btn').removeClass('d-none')
			}

			const $prevImg = $displayImg.prev()
			$prevImg.removeClass('d-none')
			$prevImg.addClass('show')
			$displayImg.removeClass('show')
			$displayImg.addClass('d-none')

			// hide back-arrow if the current img is the first img.
			if ($prevImg.hasClass('first-img')) {
				$btnSelected.addClass('d-none')
			}

		} else if ($btnSelected.hasClass('forward-btn')) {
			if ($displayImg.hasClass('first-img')) {
				$btnSelected.siblings('button.back-btn').removeClass('d-none')
			}

			const $nextImg = $displayImg.next()
			$nextImg.removeClass('d-none')
			$nextImg.addClass('show')
			$displayImg.removeClass('show')
			$displayImg.addClass('d-none')

			// hide forward-arrow if the current img is the last img.
			if ($nextImg.hasClass('last-img')) {
				$btnSelected.addClass('d-none')
			}
		}
	})
	
	// function assign_prev_or_after_start_date($date, $dateSelected, $currentEle) {
	// 	if ($date < $dateSelected) {
	// 		$currentEle.addClass("prev-start-date")
	// 	} else if ($date > $dateSelected) {
	// 		$currentEle.addClass("after-start-date")
	// 	}
	// }

	// function call_a_thing(element, $dateSelected) {
	// 	let $element = $(element)
	// 	let $date = $element.data('date')
	// 	assign_prev_or_after_start_date($date, $dateSelected, $element)
	// }

	// add css class to start date, prev-start dates and after-start dates. 
	function assign_prev_or_after_start_date(startDateEle, startDate, calendarContainerEle) {
		startDateEle.addClass('start-date-selected')
		const $dateElesAll = calendarContainerEle.find('td.future, td.today')

		$dateElesAll.each(function(){
			let $currentEle = $(this)
			let $date = new Date($currentEle.data('date').replace(/-/g, '\/'))
			if ($date < startDate) {
				$currentEle.addClass("prev-start-date")
			} else if ($date > startDate) {
				$currentEle.addClass("after-start-date")
			}
		})
	}

	// adjust css classes for date elements when an end date is selected. 
	function assign_end_date_and_adjust_classes(endDateEle, endDate, calendarContainerEle) {
		endDateEle.addClass('end-date-selected')
		endDateEle.removeClass('after-start-date')
		const $afterStartEles = calendarContainerEle.find('td.future.after-start-date')
		const $dateStart = calendarContainerEle.find('td.start-date-selected')
		const $prevStartEles = calendarContainerEle.find('td.future.prev-start-date')

		endDateEle.find('.date-overwrapper').css({
			"background-image": "linear-gradient(to right, #f7f7f7 , #fff)"
		})

		endDateEle.find('.date-wrapper').css({
			"background-color": ""
		})

		$dateStart.find('.date-overwrapper').css({
			"background-image": "linear-gradient(to left, #f7f7f7 , #fff)"
		})
		
		$afterStartEles.each(function() {
			let $currentEle = $(this)
			let $currentDate = new Date($(this).data('date'))
			$currentEle.removeClass('after-start-date')
			if ($currentDate < endDate ){
				$currentEle.addClass('date-in-between-selected')
				$currentEle.removeClass('date-in-between')
			}
		})

		$prevStartEles.each(function(){
			$(this).removeClass('prev-start-date')
		})
	}

	// remove added css classes when a new start date is getting selected. 
	function clear_added_date_classes(ele) {
		ele.find('td.end-date-selected').find('.date-overwrapper').css({"background-image":""})
		ele.find('td.end-date-selected').removeClass('end-date-selected')
		ele.find('td.start-date-selected').find('.date-overwrapper').css({"background-image":""})
		ele.find('td.start-date-selected').removeClass('start-date-selected')
		ele.find('td.date-in-between-selected').removeClass('date-in-between-selected')
		ele.find('td.after-first-booked-date').removeClass('after-first-booked-date')
		ele.find('td.available-end-date').removeClass('available-end-date')
	}

	function clear_listing_date_inputs() {
		$('.listing-pricing input.check-in-date').val('')
		$('.listing-pricing input.check-out-date').val('')
	}

	function switch_to_reserve() {
		$('div.availability-btn-wrapper').addClass('d-none')
		$('div.cost-calculation').removeClass('d-none')
	}

	function switch_to_check_availability() {
		$('div.availability-btn-wrapper').removeClass('d-none')
		$('div.cost-calculation').addClass('d-none')
	}

	// actions for clicking dates on LISTING or HEADER calendars. 
	$(document).on('click', "td.future", function(){
		
		// check whether the dates are in the header calendar or listing calendar. set flag variable $headerCalendar to true to false accordingly.  
		const $calandarContainer = $(this).closest('.calendar-container')
		let $headerCalendar 
		if ($calandarContainer.attr('id') == "headerCalendar" ) {
			$headerCalendar = true
		} else if ($calandarContainer.attr('id') == "listingCalendar" ) {
			$headerCalendar = false
		}

		// define a js date object with clicked date info. 
		const $dateEleSelected = $(this)
		let $dateSelected = $dateEleSelected.data('date')
		$dateSelected = new Date($dateSelected.replace(/-/g, '\/'))

		// temp code 
		// const $checkInInput = $('.listing-pricing input.check-in-date')
		// const $checkOutInput = $('.listing-pricing input.check-out-date')


		// actions for when a listing calendar date is clicked.
		if (!$headerCalendar) {
	
			const $checkInInput = $('.listing-pricing input.check-in-date')
			const $checkOutInput = $('.listing-pricing input.check-out-date')
			const $checkinHeader = $('.listing-datepick .datepick-header.checkin')
			const $checkoutHeader = $('.listing-datepick .datepick-header.checkout')
			const $dateSummaryHeader = $('.listing-datepick .datepick-header.summary')

			// actions for when both start date and end date have been selected. 
			if ($calandarContainer.find('td.end-date-selected').length) {
				// clear added date classes in their own scope
				clear_added_date_classes($calandarContainer)

				//clear the date inputs and pricing info in cost summary section. 
				clear_listing_date_inputs()
				switch_to_check_availability()

				// swap the datepick header to "select checkout date"
				$checkoutHeader.removeClass('d-none')
				$dateSummaryHeader.addClass('d-none')

			}

			// actions for when start date gets selected.
			if (!$dateEleSelected.hasClass('after-start-date')) {
				assign_prev_or_after_start_date($dateEleSelected, $dateSelected, $calandarContainer)
	
				$checkInInput.val($dateSelected.toLocaleDateString())
	
				// Find the first booked date after the start date.
				const $afterStartDateBooked = $('.after-start-date.booked')
				let $firstBookedDate = null
	
				if ($afterStartDateBooked.length) {
					$afterStartDateBooked.each(function(){
						let $currentDate = new Date($(this).data('date').replace(/-/g, '\/'))
						if ($firstBookedDate === null) {
							$firstBookedDate = $currentDate
						} else {
							if ($currentDate < $firstBookedDate) {
								$firstBookedDate = $currentDate
							}
						}
					})
	
					// Make all dates after the first booked date unclickable. 
					const $unbookedDates = $('.after-start-date.unbooked')
					$unbookedDates.each(function(){
						let $currentEle = $(this)
						let $currentDate = new Date($(this).data('date').replace(/-/g, '\/'))
						if ($currentDate > $firstBookedDate) {
							$currentEle.addClass('after-first-booked-date')
						} else {
							$currentEle.addClass('available-end-date')
						}
					})
				} else {
					const $unbookedDates = $('.after-start-date.unbooked')
					$unbookedDates.addClass('available-end-date')
				}

				// swap the datepick header to "select checkout date"
				$checkinHeader.addClass('d-none')
				$checkoutHeader.removeClass('d-none')

			// actions for when end date gets selected. 
			} else {
				assign_end_date_and_adjust_classes($dateEleSelected, $dateSelected, $calandarContainer)

				$checkOutInput.val($dateSelected.toLocaleDateString())

				let payload = {
					"start_date": $('input.check-in-date').val(),
					"end_date": $('input.check-out-date').val(),
					"listing_id": $('.listing-container').data('listingid')
				}

				let url = $('#booking-request-form')[0].action + ".json"

				$.post({
					url: url,
					data: payload,
					success: function(response){
						$('#cost-breakdown').html(response.partial)
					},
					failure: function(errors){
						console.log(errors, "failure")
					}
				})

				switch_to_reserve()

				// swap the datepick header to summary header
				const dateCount = (new Date($('input.check-out-date').val())).getDate() - (new Date($('input.check-in-date').val())).getDate()
				const $dateCountEle = $('.listing-datepick .day-count')
				const $checkinDateEle = $('.listing-datepick .checkin-date')
				const $checkoutDateEle = $('.listing-datepick .checkout-date')
				const checkinDate = (new Date($('input.check-in-date').val())).toLocaleString("en-GB", {
					month: "short",
					day: "numeric",
					year: "numeric",
				  });
				
				const checkoutDate = (new Date($('input.check-out-date').val())).toLocaleString("en-GB", {
					month: "short",
					day: "numeric",
					year: "numeric",
				  });

				$checkinDateEle.text(checkinDate)
				$checkoutDateEle.text(checkoutDate)

				if (dateCount === 1) {
					$dateCountEle.text(`${dateCount} night`)
				} else if (dateCount > 1) {
					$dateCountEle.text(`${dateCount} nights`)
				}

				$checkoutHeader.addClass('d-none')
				$dateSummaryHeader.removeClass('d-none')
			}	

		// actions for when a header calendar date is clicked.
		} else if ($headerCalendar) {
			const $searchCheckInInput = $('.search-item-wrapper.check-in input.header-check-in-date')
			const $searchCheckOutInput = $('.search-item-wrapper.check-out input.header-check-out-date')

			// actions for when both start date and end date have been selected. 
			if ($calandarContainer.find('td.end-date-selected').length) {
				// clear added date classes in their own scope
				clear_added_date_classes($calandarContainer)
			}

			// actions for when start date gets selected.
			if (!$dateEleSelected.hasClass('after-start-date')) {
				assign_prev_or_after_start_date($dateEleSelected, $dateSelected, $calandarContainer)
				
				//fill in the value of check in input.  
				$searchCheckInInput.val($dateSelected.toLocaleDateString())

				// unfocus check in wrapper and switch to focus check out wrapper. 
				$('.search-item-wrapper.check-in').removeClass('focused')
				$('.search-item-wrapper.check-out').addClass('focused')
		
			// actions for when end date gets selected. 
			} else {
				assign_end_date_and_adjust_classes($dateEleSelected, $dateSelected, $calandarContainer)

				//fill in the value of check out input.  
				$searchCheckOutInput.val($dateSelected.toLocaleDateString())

				// unfocus check out wrapper and switch to focus check in wrapper. 
				$('.search-item-wrapper.check-in').addClass('focused')
				$('.search-item-wrapper.check-out').removeClass('focused')

			}
		}
	})

	// for both listing and header calendars. 
	// style the duration dates when hovering end date elements after a start date has been picked. 
	$(document).on( "mouseenter", "td.future.after-start-date.available-end-date, #headerCalendar td.future.after-start-date", function(){
		const $dateHovered = $(this)
		const $date = new Date($dateHovered.data('date'))
		const $dateStart = $('td.start-date-selected')

		$dateHovered.find('.date-overwrapper').css({
			"background-image": "linear-gradient(to right, #f7f7f7 , #fff)"
		})
		$dateHovered.find('.date-wrapper').css({
			"background-color": "#f7f7f7"
		})
		$dateStart.find('.date-overwrapper').css({
			"background-image": "linear-gradient(to left, #f7f7f7 , #fff)"
		})

		const $afterStartEles = $('td.future.after-start-date')
		$afterStartEles.each(function() {
			let $currentEle = $(this)
			let $currentDate = new Date($(this).data('date'))
			if ($currentDate < $date ){
				$currentEle.addClass('date-in-between')
			}
		})
	})

	$(document).on( "mouseleave", "td.future.after-start-date.available-end-date, #headerCalendar td.future.after-start-date", function(){
		const $dateHovered = $(this)
		const $date = new Date($dateHovered.data('date'))
		const $dateStart = $('td.start-date-selected')

		$dateHovered.find('.date-overwrapper').css({
			"background-image": ""
		})
		$dateHovered.find('.date-wrapper').css({
			"background-color": ""
		})
		$dateStart.find('.date-overwrapper').css({
			"background-image": ""
		})

		const $afterStartEles = $('td.future.after-start-date')
		$afterStartEles.each(function() {
			let $currentEle = $(this)
			let $currentDate = new Date($(this).data('date'))
			if ($currentDate < $date ){
				$currentEle.removeClass('date-in-between')
			}
		})
	})

	// applies for both header and listing calendars
	// click clear dates button to remove currently selected check in and check out dates.
	$(document).on('click', ".date-clear-btn", function(){
		const $calandarContainer = $(this).parent().siblings('.calendar-container')
		if ($calandarContainer.find('td.end-date-selected').length) {
			clear_added_date_classes($calandarContainer)
		} else if ($calandarContainer.find('td.start-date-selected').length) {
			$calandarContainer.find('td.start-date-selected').removeClass('start-date-selected')
			$calandarContainer.find('td.prev-start-date').removeClass('prev-start-date')
			$calandarContainer.find('td.after-start-date').removeClass('after-start-date')
		}

		if ($calandarContainer.attr('id') == "listingCalendar") {
			clear_listing_date_inputs()
			switch_to_check_availability()

			// swap the datepick header to "select check-in date"
			const $checkinHeader = $('.listing-datepick .datepick-header.checkin')
			const $checkoutHeader = $('.listing-datepick .datepick-header.checkout')
			const $dateSummaryHeader = $('.listing-datepick .datepick-header.summary')

			$checkinHeader.removeClass('d-none')
			$checkoutHeader.addClass('d-none')
			$dateSummaryHeader.addClass('d-none')
			
		} else if ($calandarContainer.attr('id') == "headerCalendar" ) {
			$('.search-item-wrapper.check-in input.header-check-in-date').val('')
			$('.search-item-wrapper.check-out input.header-check-out-date').val('')
			$('.search-item-wrapper.check-in').addClass('focused')
			$('.search-item-wrapper.check-out').removeClass('focused')
		}
	})
	
	$(document).on('click', '.calendar-show .calendar-arrow', function(){
		const $selectedEle = $(this)
		const $selectedCalendar = $selectedEle.closest('.calendar-wrapper')

		if (($selectedEle.hasClass('forward')) && ($selectedCalendar.next().is('.calendar-wrapper.hide'))) {
			const $nextCalendar = $selectedCalendar.next()
			const $prevCalendar = $selectedCalendar.prev()
			$prevCalendar.removeClass('calendar-show left')
			$prevCalendar.addClass('hide')
			$selectedCalendar.removeClass('right')
			$selectedCalendar.addClass('left')
			$nextCalendar.removeClass('hide')
			$nextCalendar.addClass('calendar-show right')

		} else if ($selectedEle.hasClass('back') && $selectedCalendar.prev().is('.calendar-wrapper.hide')){
			console.log('forward arrow clicked')
			const $nextCalendar = $selectedCalendar.next()
			const $prevCalendar = $selectedCalendar.prev()
			$nextCalendar.removeClass('calendar-show right')
			$nextCalendar.addClass('hide')
			$selectedCalendar.removeClass('left')
			$selectedCalendar.addClass('right')
			$prevCalendar.removeClass('hide')
			$prevCalendar.addClass('calendar-show left')
		}
	})

	// show user popover window. 
	$(document).on('click', '.login-overwrap', function(){
		const $userPopover = $('.login-popover')
		$userPopover.removeClass('d-none')
	})

	// hide popover windows when click elsewhere. 
	$(document).mouseup(function(event){
		// when extend search is open, hide extend search bar when click elsewhere. 
		if ($('.body-main-wrapper').hasClass('readonly')) {
			const $extendSearchOverwrap = $('.extend-search-overwrap')

			if ((!$extendSearchOverwrap[0].contains(event.target))) {
				// hide all extend search bar, remove readonly on the main listing page. 
				$extendSearchOverwrap.addClass('d-none')
				$extendSearchOverwrap.removeClass('focused')
				$('.search-item-wrapper.focused').removeClass('focused')
				$('.search-popover').addClass('d-none')
				$('.search-bar-overwrap').removeClass('d-none')
				const $listingPage = $('.body-main-wrapper')
				$listingPage.removeClass('readonly')
				$('.main-page-overlay').removeClass('darkened')

				reactivate_body_scroll()
			}
		}

		// hide user popover window.
		const $userPopover = $('.login-popover')
		if (!$userPopover.hasClass('d-none')) {
			$userPopover.addClass('d-none')
		}

		// hide listing guest popover window
		const $listingGuestPopover = $('.listing-popover.guest')
		if (($listingGuestPopover.length) && (!$listingGuestPopover.hasClass('d-none'))) {
			if (!$listingGuestPopover[0].contains(event.target)) {
				$listingGuestPopover.addClass('d-none')
				$('.guest-selection').removeClass('focused')
			}

		}
	})

	// search bar functions
	// show extended search bar when search bar is clicked. 
	$(document).on('click', ".search-bar-overwrap .search-bar-col", function(){
		const $searchBar = $(this).closest('.search-bar-overwrap')
		const $extendSearchBar = $('.extend-search-overwrap')
		$searchBar.addClass('d-none')
		$extendSearchBar.removeClass('d-none')

		// focus location search wrapper, show region popover window. 
		let customClass
		if ($(this).hasClass('where')) {
			customClass = "where"
		} else if ($(this).hasClass('when')) {
			customClass = "check-in"
		}  else if ($(this).hasClass('who')) {
			customClass = "who"
		}

		const $searchItemWrapper = $('.search-item-wrapper.' + customClass)
		const $searchContainer = $searchItemWrapper.closest('.extend-search-container')
		const $searchWhereInput = $searchItemWrapper.find('input')
		let $regionPopover

		if (customClass == "check-in") {
			$regionPopover = $('.search-popover.date')
		} else {
			$regionPopover = $searchItemWrapper.find('.search-popover')
		}

		$searchContainer.addClass('focused')
		$searchItemWrapper.addClass('focused')
		$regionPopover.removeClass('d-none')
		$searchWhereInput.focus()

		// make main page read only. 
		const $listingPage = $('.body-main-wrapper')
		$listingPage.addClass('readonly')
		$('.main-page-overlay').addClass('darkened')

		disable_body_scroll()
		
	})

	// show search popover window when wrappers are clciked. 
	$(document).on('click', '.search-item-wrapper', function(){
		const $searchWrapperSelected = $(this)
		const $searchWrappers = $('.search-item-wrapper')

		const $searchContainer = $searchWrapperSelected.closest('.extend-search-container')
		const $searchWhereInput = $searchWrapperSelected.find('input')

		$searchWrappers.each(function(){
			const $currentWrapper = $(this)
			const $currentPopover = $currentWrapper.find('.search-popover')

			if ($(this).is($searchWrapperSelected)) {
				$currentWrapper.addClass('focused')
				if ($currentWrapper.hasClass('check-out') || $currentWrapper.hasClass('check-in')){ 
					$('.search-popover.date').removeClass('d-none')
				} else {
					$currentPopover.removeClass('d-none')
					$('.search-popover.date').addClass('d-none')
				}
			} else {
				$currentPopover.addClass('d-none')
				$currentWrapper.removeClass('focused')
			}
		})
		$searchContainer.addClass('focused')
		$searchWhereInput.focus()

		// make the main listing page read only. 
		const $listingPage = $('.body-main-wrapper')
		$listingPage.addClass('readonly')
	})

	// show and hide custom login modal.
	$(document).on('click', '.loginOrSignupBtn, #redirect-to-signin-btn', function(event){
		event.stopPropagation()
		const $loginPopover = $('.login-popover')
		$loginPopover.addClass('d-none')

		event.preventDefault()
		
		let url 
		if ($(this).hasClass('reserve-btn')) {
			url = $('#loginModalButton').attr('href')
		} else {
			url = $(this).attr('href')
		}
		
		$.get({
			url: url,
			success: function(response){
				const $customModal = $('#customModal')
				$customModal.find('#modal-custom-content').html(response.partial)
				$customModal.removeClass('d-none')
				disable_body_scroll()
			},
			failure: function(errors){
				console.log(errors, "failure")
			}
		})
	})

	$(document).on('click', ".close-login-modal", function(){
		const $customModal = $('#customModal')
		$customModal.addClass('d-none')
		reactivate_body_scroll()
	})

	// in the extend search area, click plus or minus button to change guest count.
	// function to update guest summary after clicking plus o minus btn. 
	$(document).on('click', ".search-popover.guest button.btn-round, .listing-popover.guest button.btn-round", function(e){
		e.stopPropagation()
		const $btnClicked = $(this)
		const $counterEle = $btnClicked.siblings('.counter-num')
		const $wrapper = $btnClicked.closest('.guest')
		let $counter = Number($counterEle.text())
		
		if ($btnClicked.hasClass('plus')) {
			const $minusBtn = $btnClicked.siblings('button.minus')
			if ($counter === 0) {
				$minusBtn.removeClass('change-not-allowed')
			}
			$counter++
			$counterEle.text($counter)

			// if adult count is 0, adding other guests automatically adds 1 adult guest. 
			if (!$counterEle.hasClass('adult')) {
				const $adultCounterEle = $wrapper.find('.counter-num.adult')
				const $adultMinusBtn = $adultCounterEle.siblings('.btn-round.minus')
				if (($adultCounterEle.text() === "0")) {
					$adultCounterEle.text(1)
					$adultMinusBtn.addClass('change-not-allowed')
				} else if ($adultCounterEle.text() == "1") {
					$adultMinusBtn.addClass('change-not-allowed')
				}
			} 

			if (($counterEle.hasClass('adult')) && ($counter > 1)) {
				$minusBtn.removeClass('change-not-allowed')
			}

		} else if ($btnClicked.hasClass('minus')) {
			if ($counter >= 1) {
				if (($wrapper.hasClass('listing-popover')) && ($counterEle.hasClass('adult')) && ($counter === 2)) {
							$btnClicked.addClass('change-not-allowed')
				} else {
					if ($counter === 1) {
						$btnClicked.addClass('change-not-allowed')
					}
				}
				
				$counter--
				$counterEle.text($counter)
			}
			// allow or not allow adult counter to go below one depending on if there is any other types of guests. 
			const $adultCounterEle = $wrapper.find('.counter-num.adult')
			const $childrenCounterEle = $wrapper.find('.counter-num.children')
			const $infantCounterEle = $wrapper.find('.counter-num.infant')
			const $petCounterEle = $wrapper.find('.counter-num.pet')
			if ($wrapper.hasClass('search-popover')) {
				if (((!$counterEle.hasClass('adult')) && ($counter === 0) && ($adultCounterEle.text() == "1")) || (($counterEle.hasClass('adult')) && ($counter === 1))) {
					if (($childrenCounterEle.text() === "0") && ($infantCounterEle.text() === "0") && ($petCounterEle.text() === "0")) {
						$adultCounterEle.siblings('.btn-round.minus').removeClass('change-not-allowed')
					} else {
						$adultCounterEle.siblings('.btn-round.minus').addClass('change-not-allowed')
					}
				}
			}
		}

		const $counterEles = $wrapper.find('.counter-num')
		let guestCount = 0
		let infantCount = 0 
		let petCount = 0
		$counterEles.each(function(){
			if (($(this).hasClass('adult')) || ($(this).hasClass('children'))) {
				guestCount = guestCount + Number($(this).text())
			} else if ($(this).hasClass('infant')) {
				infantCount = Number($(this).text())
			} else if ($(this).hasClass('pet')) {
				petCount = Number($(this).text())
			}
		})
		const guestOjb = {
			"guest": guestCount,
			"infant": infantCount,
			"pet": petCount
		}

		function unpack_guest_obj(obj) {
			let guestString = ""
			Object.entries(obj).forEach(([key, value]) => {
				if (value > 0) {
					if (value === 1) {
						if (guestString ) {
							guestString = guestString + `, ${value} ${key}`  
						} else {
							guestString = `${value} ${key}`  
						}
					} else {
						if (guestString ) {
							guestString = guestString + `, ${value} ${key}s`  
						} else {
							guestString = `${value} ${key}s`  
						}
					}
				}
			})
			return guestString
		}

		function unpact_guest_obj_to_guest_count_only(obj) {
			let guestOnlyString = ""
			const guestOnlyCount = obj["guest"]
			if ( guestOnlyCount > 1 ) {
				guestOnlyString = `${guestOnlyCount} guests`
				return guestOnlyString
			} else if ( guestOnlyCount === 1 ) {
				guestOnlyString = `${guestOnlyCount} guest`
				return guestOnlyString
			}
			return null
		}

		if ($wrapper.hasClass('search-popover')) {
			$('input[name="guest_summary"]').val(unpack_guest_obj(guestOjb))
			$('.search-bar-col.who span').text(unpact_guest_obj_to_guest_count_only(guestOjb))
		} else if ($wrapper.hasClass('listing-popover')) {
			$('input[name="guest_count"]').val(unpack_guest_obj(guestOjb))
		}
	})

	// open the guest popover window on listing page.
	$(document).on('click', '.guest-selection input[name="guest_count"]', function (){
		const $guestPopover = $('.listing-popover.guest')
		const $guestWrapper = $('.guest-selection')
		if ($guestPopover.hasClass('d-none')) {
			$('.listing-popover.guest .counter-num.adult').text(1)
			$guestPopover.removeClass('d-none')
			$guestWrapper.addClass('focused')

		}
	})

	// search by region function in the extended search bar for destination. 
	$(document).on('click', ".map-icon-container", function(e){
		e.stopPropagation()
		const $mapIconSelected = $(this).find('img.map-icon')
		const $locationName = $(this).siblings('.map-address').text()
		const $locationInput = $('input.region-input')

		if ($('.map-icon-container .map-icon.selected').length) {
			console.log('map selected previously')
			const $selctedPreviously = $('.map-icon-container .map-icon.selected')
			if ($selctedPreviously[0] === $mapIconSelected[0]) {
			} else {
				$selctedPreviously.removeClass('selected')
			}
		}

		$mapIconSelected.addClass('selected')

		if ($locationName === "I'm flexible") {
			$locationInput.val('')
		} else {
			$locationInput.val($locationName)
		}

		$('.search-item-wrapper.check-in').addClass('focused')
		$('.search-popover.date').removeClass('d-none')
		$('.search-item-wrapper.where').removeClass('focused')
		$('.search-popover.region').addClass('d-none')

	})

	// when log in successfully, redirect to home page, when not log in successfully, show error message in the pop over window. 
	$(document).on('click', '#loginButton', (e)=>{
		e.preventDefault()
		e.stopPropagation()
		let $button = $(e.target)
		// debugger
		let $form = $button.closest('form')
		let form_data = $form.serialize()
		$.post({
			url: $form[0].action,
			data: form_data,
			success: (res) => {
				window.location.reload()
			},
			error: (res) => {		
				console.log(res.responseText)		
				const url = $('#loginModalButton').attr('href')
				$.get({
					url: url,
					success: function(response){
						const $customModal = $('#customModal')
						$customModal.find('#modal-custom-content').html(response.partial)
						$customModal.find('#modal-custom-content').find('.custom-alert').text(res.responseText)
						$customModal.find('#modal-custom-content').find('.custom-alert').removeClass('d-none')
					},
					failure: function(errors){
						console.log(errors, "failure")
					}
				})
			},
		})
	})

	// When sign up successfullly, log in the account and redirect to the home page. when not sign up successully, show error message in the pop over window.
	$(document).on('click', '#signupButton', (e)=>{
		console.log('signup clicked')
		e.preventDefault()
		e.stopPropagation()
		let $button = $(e.target)
		let $form = $button.closest('form')
		let form_data = $form.serialize()
		$.post({
			url: $form[0].action,
			data: form_data,
			success: (res) => {
				window.location.replace(res.redirect_url)
			},
			error: (res) => {
				console.log(res)
				// debugger	
				// const url = $('#signupModalButton').attr('href')
				const $customModal = $('#customModal')
				$customModal.find('#modal-custom-content').html(res.responseJSON.partial)
				// $customModal.find('#modal-custom-content').find('.custom-alert').text(res.responseText)
				// $customModal.find('#modal-custom-content').find('.custom-alert').removeClass('d-none')
			},
		})
	})

	// click the remove image button to remove a listing image. 
	$(document).on('click', ".remove-img-btn", function(){
		const $btnClicked = $(this)
		const $imgEle = $btnClicked.closest('.listing-img-container')
		const imgId = $imgEle.data('id')
		const listingId = $imgEle.data('listing')
		const url = $imgEle.data('url')
		$imgEle.addClass('d-none')
		
		 $.post({
			url: url,
			data: {
				"image_blob_id": imgId,
				"listing_id": listingId
			},
			success: (res) => {
				console.log('suuccess', res)
			}, 
			error: (res) => {
				console.log('errors', res)
			}
		 })
	})

	// close custom image gallery modal
	$(document).on('click', ".photo-modal .close-btn", function() {
		// close the gallery modal
		const galleryModal = $('#photoGalleryModal')
		galleryModal.addClass('d-none')

		// hide header 
		const header = $('header.sticky-top')
		header.removeClass('d-none')

		reactivate_body_scroll()
	}) 
		
	
	// create custom image gallery for listing photos. 
	$(document).on('click', ".show-all-img-btn", function(){
		// open the gallery modal
		const galleryModal = $('#photoGalleryModal')
		galleryModal.removeClass('d-none')

		// hide header 
		const header = $('header.sticky-top')
		header.addClass('d-none')

		const $allImgs = $('.original-img')
		const $photoContainer = $('.gallery-container')
		const $singleRowExampleEle = $('.gallery-container .single-row-example')
		const $doubleRowExampleEle = $('.gallery-container .double-row-example')
		let imgType
		let singleRowFlag = true

		let pendingImgCount = 0
		let pendingImgIndex

		let newSingleRow
		let newDoubleRow

		// let pendingImg = [{"type": "long", "index": 1}]

		$allImgs.each(function(index, ele){
			
			const height = ele.height
			const width = ele.width
			if (height >= width ) {
				imgType = "long"
			} else {
				imgType = "short"
			}
			if (singleRowFlag) {
				if (imgType === "short") {
					newSingleRow =  $singleRowExampleEle.clone()
					newSingleRow.html(ele)
					$photoContainer.append(newSingleRow)
					singleRowFlag = !singleRowFlag
				} else {
					pendingImgCount ++
					pendingImgIndex = index
				}
			} else {
				if (pendingImgCount === 0 ) {
					pendingImgCount ++
					pendingImgIndex = index
				} else {
					newDoubleRow = $doubleRowExampleEle.clone()
					newDoubleRow.find('.right').html(ele)
					newDoubleRow.find('.left').html($allImgs[pendingImgIndex])
					$photoContainer.append(newDoubleRow)
					pendingImgCount --
					pendingImgIndex = null
					singleRowFlag = !singleRowFlag
				}
			}
		})
		$('.gallery-container img').removeClass('d-none')
		$allImgs.removeClass('original-img')
		disable_body_scroll()

		// focus on the first img
		$('#photoGalleryModal').animate({ scrollTop: 0 }, 0)
	})

	// disable the any click or scroll function of the overflow content
	function disable_body_scroll() {
		$('body.custom-body').addClass('hide-overflow')
	}

	// reactivate the any click or scroll function of the overflow content
	function reactivate_body_scroll() {
		$('body.custom-body').removeClass('hide-overflow')
	}

	// switch betweem the map and listing view on listing index page
	$(document).on('click', ".switch-to-map-btn, .switch-to-listing-btn", function(){
		const $mapEle = $('.map-wrapper')
		const $listingsEle = $('.listings-wrapper')
		const $switchToMap = $('.switch-to-map-btn')
		const $switchToListing = $('.switch-to-listing-btn')

		const $btnClicked = $(this)
		if ($btnClicked.hasClass('switch-to-map-btn')) {
			$mapEle.removeClass('d-none')
			$listingsEle.addClass('d-none')
			$switchToMap.addClass('d-none')
			$switchToListing.removeClass('d-none')
		} else if ($btnClicked.hasClass('switch-to-listing-btn')) {
			$mapEle.addClass('d-none')
			$listingsEle.removeClass('d-none')
			$switchToMap.removeClass('d-none')
			$switchToListing.addClass('d-none')
		}
	})

	// when click on check in or check out input on listing page, jump to the "Select dates" section
	$(document).on('click', '.pricing-container input[name="start_date"], .pricing-container input[name="end_date"]', function(){
		const $datepickEle = $('.listing-datepick')
		const yOffset = -100
		const y = $datepickEle[0].getBoundingClientRect().top  + window.pageYOffset + yOffset
		window.scrollTo({top: y, behavior: 'smooth'});
	})
});


