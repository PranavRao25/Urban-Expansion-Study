# Urban-Expansion-Study

This project aims to study the changes in Urban Area of five cities - Bangalore, Coimbatore, Hyderabad, Indore, and Mumbai over the period of 2019-2024. This has been done via Satellite Imagery using the NDBI metric on the Google Earth Engine software. This Project was carried out as part of the Summer Training / Internship program on Remote Sensing and GIS by Indian Space Academy in 2025.

## Data Used
We utilised the Sentinel 2A satellite data for analysis (specifically the bands B8 and B11 bands for NIR and SWIR respectively). We marked the Areas of Interest for each of the cities.

## NDBI metric
The Normalised Difference Built-up indices (NDBI) uses the NIR and SWIR bands to emphasize manufactured built-up areas. It ranges from -1 to 1, higher the index, more the urbanisation. It is calculated as:
$NDBI = \frac{(SWIR - NIR)}{(SWIR + NIR)}$

## Methodology
We first preprocess the satellite data for correcting any cloud maskings. We then setup the NDBI metric using the present bands from the data for Urban Analysis. We classify the region as urban/non-urban based on the NDBI metric. We then visualize the AOIs through the NDBI band. We also calculate the total urban area for each city and analyse the results.

## Findings
We observe the following:
<ol>
<li>Hyderabad has the highest urban area size followed by Bangalore.</li>
<li>Mumbai falls short on both the total area, urban area as well as urban area percentage oweing to being located on an island with limited room for growth and high green cover.</li>
<li>Coimbatore has a significantly high urban area percentage, rivalling that of Hyderabad and Bangalore.</li>
<li>The total urban area size for all cities over the years has either remained same or decreased.</li>
</ol>
