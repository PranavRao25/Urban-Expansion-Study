// Load Sentinel 2A data
/**
 * Function to mask clouds using the Sentinel-2 QA band
 * @param {ee.Image} image Sentinel-2 image
 * @return {ee.Image} cloud masked Sentinel-2 image
 */
function maskS2clouds(image) {
  var qa = image.select('QA60');

  // Bits 10 and 11 are clouds and cirrus, respectively.
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;

  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));

  return image.updateMask(mask).divide(10000);
}

var yearList = [2019, 2020, 2021, 2022, 2023, 2024];
var areas = [];
var regions = [
  {region: 'mumbai', geometry: mumbai}, {region: 'hyderabad', geometry: hyderabad},
  {region: 'indore', geometry: indore}, {region: 'bangalore', geometry: bangalore},
  {region: 'coimbatore', geometry: coimbatore}
  ];

// Iterate over all Regions first
for(var j = 0; j < regions.length; j ++) {
  var regionName = regions[j].region;
  var region = regions[j].geometry;
  
  // Iterate over the years for a given region
  for(var i = 0; i < yearList.length; i++) {
    var year = yearList[i];
    var start = ee.Date.fromYMD(year, 1, 1);
    var end = ee.Date.fromYMD(year, 12, 31);
    
    // Get the satellite image with masked clouds
    var image = sentinel_dataset.filterDate(start, end).filterBounds(region)
                .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20))
                .map(maskS2clouds).median();
    
    // Calculate NDBI
    var ndbi = image.normalizedDifference(['B11', 'B8']).rename('ndbi');

    // If NDBI >=0 -> Urban (Class 2) else Other (Class 1)
    var ndbiClass = ndbi.expression(
                    "(b < 0) ? 1 : (b >= 0) ? 2 : 0", {'b' : ndbi}
                    ).clip(region).rename('ndbi_class');
    
    var urbanClass = ndbiClass.eq(2);  // Get the matrix with Urban areas
    var areaImage = urbanClass.multiply(ee.Image.pixelArea());  // Multiply each pixel with the pixelArea
    var area = areaImage.reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: region,
      scale: 30,
      maxPixels: 1e12
    });  // Sum all the pixel areas for the given image
    var urbanAreaSqKm = ee.Number(area.get('ndbi_class')).divide(1e6);  // Convert into appropriate units
    areas.push(ee.Feature(null, {'region': regionName, 'year': year, 'urban_area_sqkm': urbanAreaSqKm}));
    
    Map.addLayer(ndbi, {}, regionName + '_NDBI_'+ year);
    Map.addLayer(ndbiClass, {min : 1, max : 2, palette : ['green', 'red']}, regionName + '_NDBI_Classification_'+year);
    
    Export.image.toDrive({
      image: ndbiClass,
      description: 'Sentinel_2_NDBI_' + regionName + '_' + year,
      scale: 30,
      region: region,
      maxPixels: 1e13
    });
  }
}
areas = ee.FeatureCollection(areas);
print(areas);

Export.table.toAsset({
  collection: areas,
  description: 'Export_Total_Areas', // Name that appears in the Tasks tab.
  assetId: 'users/pranavrao2500/total_areas'
});
