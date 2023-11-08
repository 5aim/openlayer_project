window.onload = init;

function init() {
  /* 천안 중앙 위치 */
  const CHEONAN = [14152187.20776864, 4413944.543811761];

  const map = new ol.Map({
    view: new ol.View({
      center: CHEONAN,
      zoom: 13.5,
      maxZoom: 18,
      minZoom: 13,
      extent: [
        14136311.278827626, 4394656.463022412, 14174402.542814588,
        4429267.881654042,
      ],
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
		target: 'openlayers-map'
  });

	// Cheonan GeoJSON
	const cheonanCitiesStyle = function(feature){
		let nodeId = feature.get('node_id');
		let nodeIdString = nodeId.toString();
		let placename = feature.get('placename');
		const Styles = [
			new ol.style.Style({
				image: new ol.style.Circle({
					fill: new ol.style.Fill({
						color: [77, 219, 105, 0.6]
					}),
					stroke: new ol.style.Stroke({
						color: [6, 125, 34, 1],
						width: 1
					}),
					radius: 12
				}),
				text: new ol.style.Text({
					text: nodeIdString,
					scale: 1.5,
					fill: new ol.style.Fill({
						color: [232, 26, 26, 1]
					}),
					stroke: new ol.style.Stroke({
						color: [232, 26, 26, 1],
						width: 0.3
					})
				}),
			})
		]
		return Styles
	}

	const styleForSelect = function(feature){
		let nodeId = feature.get('node_id');
		let nodeIdString = nodeId.toString();
		let placename = feature.get('placename');
		const Styles = [
			new ol.style.Style({
				image: new ol.style.Circle({
					fill: new ol.style.Fill({
						color: [247, 40, 10, 0.7]
					}),
					stroke: new ol.style.Stroke({
						color: [6, 125, 34, 1],
						width: 1
					}),
					radius: 12
				}),
				text: new ol.style.Text({
					text: nodeIdString,
					scale: 1.5,
					fill: new ol.style.Fill({
						color: [0, 0, 0, 1]
					}),
					stroke: new ol.style.Stroke({
						color: [232, 26, 26, 1],
						width: 0.3
					})
				}),
			})
		]
		return Styles
	}
	
	const cheonanCitiesLayer = new ol.layer.Vector({
		source: new ol.source.Vector({
			format: new ol.format.GeoJSON(),
			url: './data/cheonan.geojson'
		}),
		style: cheonanCitiesStyle
	})
	map.addLayer(cheonanCitiesLayer)

	// Map Features Click Logic
	const navElements = document.querySelector('.column-navigation');
	const cityNameElement = document.getElementById('cityname');
	const cityImageElement = document.getElementById('cityimage');
	const mapView = map.getView();

	map.on('singleclick', function(evt){
		map.forEachFeatureAtPixel(evt.pixel, function(feature, layer){
			let featureName = feature.get('cityname')
			let navElement = navElements.children.namedItem(featureName);
			
			mainLogic(feature, navElement)
		})
	})

	function mainLogic(feature, clickedAnchorElement){
		// Re-assign active class to the clicked element
		let currentActiveStyledElement = document.querySelector('.active');
		currentActiveStyledElement.className = currentActiveStyledElement.className.replace('active', '');
		clickedAnchorElement.className = 'active';
		
		// Default style for all features
		let aussieCitiesFeatures = cheonanCitiesLayer.getSource().getFeatures();
		aussieCitiesFeatures.forEach(function(feature){
			feature.setStyle(cheonanCitiesStyle);
		})

		// Home Element : change content in the menu to home
		if(clickedAnchorElement.id === 'Home'){
			mapView.animate({center : CHEONAN}, {zoom:13.5})
			cityNameElement.innerHTML = 'Welcome to cheonan cities';
			cityImageElement.setAttribute('src', './data/image/Home.jpg');
		}
		
		// Change view, and content in the menu based on the feature
		else {
			feature.setStyle(styleForSelect)
			let featureCoordinates = feature.get('geometry').getCoordinates();
			mapView.animate({center: featureCoordinates}, {zoom: 17})
			
			let featureName = feature.get('cityname');
			let featureImage = feature.get('cityimage');
			cityNameElement.innerHTML = 'Name is : ' + featureName
			cityImageElement.setAttribute('src', './data/image/' + featureImage + '.jpg')
		}
	}

	// Navigation Button Logic
	const anchorNavElements = document.querySelectorAll('.column-navigation > a')
	for(let anchorNavElement of anchorNavElements){
		anchorNavElement.addEventListener('click', function(e){
			let clickedAnchorElement = e.currentTarget;
			let clickedAbchorElementID = clickedAnchorElement.id;
			let cheonanCitiesFeatures = cheonanCitiesLayer.getSource().getFeatures();
			
			cheonanCitiesFeatures.forEach(function(feature){
				let featureCityName = feature.get('cityname');
				if(clickedAbchorElementID === featureCityName){
					mainLogic(feature, clickedAnchorElement);
				}
			})

			// Home Navigation Case
			if(clickedAbchorElementID === 'Home'){
				mainLogic(undefined, clickedAnchorElement);
			}
		})
	}
}
