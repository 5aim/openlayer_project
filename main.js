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
	
	const cheonanCitiesLayer = new ol.layer.Vector({
		source: new ol.source.Vector({
			format: new ol.format.GeoJSON(),
			url: './data/cheonan.geojson'
		}),
		style: cheonanCitiesStyle
	})
	map.addLayer(cheonanCitiesLayer)
}
