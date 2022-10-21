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
			zoom: 13,
		})

		marker = new google.maps.Marker ({
			position: $coordinates,
			// icon: {
			// 	url: $mapEle.data('marker'),
			// 	size: new google.maps.Size(50, 50),
			// 	scaledSize: new google.maps.Size(50, 50),
			// 	anchor: new google.maps.Point(0, 50)
			// },
			label: {
				text: "\ue88a", // codepoint from https://fonts.google.com/icons
				fontFamily: "Material Icons",
				color: "#ffffff",
				fontSize: "20px",
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

		const infoWindow = new google.maps.InfoWindow();

		const $listingBlocks = $('.listing-block')

		$listingBlocks.each(function(index, value){
			const $longitude = $(this).data('lon')
			const $latitude = $(this).data('lat')
			const $coordinates = { lat: $latitude, lng: $longitude }
			const $rate = $(this).data('rate')
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
				title: `The rate for this listing is ${$rate}.`,
				map: map,
			});

			// marker.addListener("click", () => {
			// 	infoWindow.close();
			// 	infoWindow.setContent(marker.getTitle());
			// 	infoWindow.open(marker.getMap(), marker);
			// });

			google.maps.event.addListener(marker, "click", (function(marker) {
				return function(evt) {
					const content = marker.getTitle();
					

					infoWindow.setContent(content);
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
		} else {
			console.log('not blank')
		}
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
		}
		
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
			console.log('listing calendar function only')

			// temp commented
			const $checkInInput = $('.listing-pricing input.check-in-date')
			const $checkOutInput = $('.listing-pricing input.check-out-date')

			// actions for when both start date and end date have been selected. 
			if ($calandarContainer.find('td.end-date-selected').length) {
				// clear added date classes in their own scope
				clear_added_date_classes($calandarContainer)

				//clear the date inputs and pricing info in cost summary section. 
				clear_listing_date_inputs()
				switch_to_check_availability()
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
			}	

		// actions for when a header calendar date is clicked.
		} else if ($headerCalendar) {
			console.log('header calendar function only')
			const $searchCheckInInput = $('.search-item-wrapper.check-in input.header-check-in-date')
			const $searchCheckOutInput = $('.search-item-wrapper.check-out input.header-check-out-date')

			console.log($searchCheckInInput,$searchCheckOutInput)

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
	$(document).on( "mouseenter", "td.future.after-start-date.available-end-date", function(){
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

	$(document).on( "mouseleave", "td.future.after-start-date.available-end-date", function(){
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
		console.log($calandarContainer.attr('id'))
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
			}
		}

		// hide user popover window.
		const $userPopover = $('.login-popover')
		if (!$userPopover.hasClass('d-none')) {
			$userPopover.addClass('d-none')
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
	$(document).on('click', '.loginOrSignupBtn', function(event){
		event.stopPropagation()
		const $loginPopover = $('.login-popover')
		$loginPopover.addClass('d-none')

		event.preventDefault()
		
		const url = $(this).attr('href')
		$.get({
			url: url,
			success: function(response){
				const $customModal = $('#customModal')
				$customModal.find('#modal-custom-content').html(response.partial)
				$customModal.removeClass('d-none')
			},
			failure: function(errors){
				console.log(errors, "failure")
			}
		})
	})

	$(document).on('click', ".close-login-modal", function(){
		const $customModal = $('#customModal')
		$customModal.addClass('d-none')
	})

	// in the extend search area, click plus or minus button to change guest count.
	// function to update guest summary after clicking plus o minus btn. 
	$(document).on('click', ".search-popover.guest button.btn-round", function(){
		const $btnClicked = $(this)
		const $counterEle = $btnClicked.siblings('.counter-num')
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
				const $adultCounterEle = $('.counter-num.adult')
				const $adultMinusBtn = $adultCounterEle.siblings('.btn-round.minus')
				if ($('.counter-num.adult').text() === "0") {
					$adultCounterEle.text(1)
					$adultMinusBtn.addClass('change-not-allowed')
				} else if ($('.counter-num.adult').text() == "1") {
					$adultMinusBtn.addClass('change-not-allowed')
				}
			} 

			if (($counterEle.hasClass('adult')) && ($counter > 1)) {
				$minusBtn.removeClass('change-not-allowed')
			}

		} else if ($btnClicked.hasClass('minus')) {
			if ($counter >= 1) {
				if ($counter === 1) {
					$btnClicked.addClass('change-not-allowed')
				}
				$counter--
				$counterEle.text($counter)
			}
			// allow or not allow adult counter to go below one depending on if there is any other types of guests. 
			if (((!$counterEle.hasClass('adult')) && ($counter === 0) && ($('.counter-num.adult').text() == "1")) || (($counterEle.hasClass('adult')) && ($counter === 1))) {
				if (($('.counter-num.children').text() === "0") && ($('.counter-num.infant').text() === "0") && ($('.counter-num.pet').text() === "0")) {
					$('.counter-num.adult').siblings('.btn-round.minus').removeClass('change-not-allowed')
				} else {
					$('.counter-num.adult').siblings('.btn-round.minus').addClass('change-not-allowed')
				}
			}
		}

		const $counterEles = $('.search-popover.guest .counter-num')
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

		$('input[name="guest_summary"]').val(unpack_guest_obj(guestOjb))
		$('.search-bar-col.who span').text(unpact_guest_obj_to_guest_count_only(guestOjb))
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
				console.log('success', res)
				// window.location.reload()
			},
			error: (res) => {		
				console.log(res)		
				const url = $('#signupModalButton').attr('href')
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
});


