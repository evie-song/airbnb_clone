
// let map;

// window.initMap = function() {
// 	map = new google.maps.Map (document.getElementById("map")), {
// 		center: { lat: -34.397, lng: 150.644 },
// 		zoom: 8,
// 	}};

$(document).ready(function(){
	// display dynamic google map for listing address on listing page. 
	
	console.log('1')
	if ($('#map').length) {
		console.log('if')
		let map, marker;
		const $mapEle = $('#map')
		const $longitude = $mapEle.data('lon')
		const $latitude = $mapEle.data('lat')
		const $coordinates = { lat: $latitude, lng: $longitude }
		
		map = new google.maps.Map($("#map")[0], {
			center: $coordinates,
			zoom: 15,
		})

		marker = new google.maps.Marker ({
			position: $coordinates,
			map: map,
		});
	} else {
		console.log('else')
	}
	
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
		console.log('remove')
		const $selectedbtn = $(this)
		const $selectedRow = $selectedbtn.closest('tr')
		$selectedRow.remove()
	})

	// Add a new bedroom.
	$(document).on('click', ".js-add-bedroom", function(){
		const $roomTitle = $("input.bedroom-name").val()
		const $bedConfigs = $('tr.bed-config-row')
		
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

});


