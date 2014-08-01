/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 cosminstefanxp [@] gmail [.] com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
define(['core', 'providers/StaticPOIsProvider', 'providers/SimpleSectorValueProvider', 
        'layers/SimplePOIsLayerBuilder', 'layers/SimpleSectorsValueLayerBuilder',
        'layers/SampleValuesLayerBuilder', 'layers/HeatmapLayerBuilder',
        'layers/CustomExpressionSectorsValueLayerBuilder', 'layers/AreaProportionalSectorsValueLayerBuilder',
        'layers/StatisticsLayerBuilder'],
	function (core, StaticPOIsProvider, SimpleSectorValueProvider, 
	          SimplePOIsLayerBuilder, SimpleSectorsValueLayerBuilder, SampleValuesLayerBuilder, HeatmapLayerBuilder,
	          CustomExpressionSectorsValueLayerBuilder, AreaProportionalSectorsValueLayerBuilder,
	          StatisticsLayerBuilder) {

		return {
			loadLayers: function () {
				new SimplePOIsLayerBuilder().buildLayers();
				new SimpleSectorsValueLayerBuilder().buildLayers();
				new SampleValuesLayerBuilder().buildLayers();
				new HeatmapLayerBuilder().buildLayers();
				new CustomExpressionSectorsValueLayerBuilder().buildLayers();
				new AreaProportionalSectorsValueLayerBuilder().buildLayers();
				new StatisticsLayerBuilder().buildLayers();
			},
			loadProviders: function () {
				new StaticPOIsProvider("train_stations", "transport_train_station", "Train Stations");
				new StaticPOIsProvider("bus_stops", "transport_bus_station", "Bus Stops");
				new StaticPOIsProvider("hospitals", "health_hospital", "Hospitals");
				new StaticPOIsProvider("attractions", "tourist_monument", "Attractions");
				new StaticPOIsProvider("pubs", "food_pub", "Pubs & Bars");
				new StaticPOIsProvider("restaurants", "food_restaurant", "Restaurants");

				new SimpleSectorValueProvider("train_stations_count", "Train Stations count",
					"train_stations_sector_count.json");
				new SimpleSectorValueProvider("bus_stops_count", "Bus Stops count", "bus_stops_sector_count.json");
				new SimpleSectorValueProvider("attractions_count", "Attractions count",
					"attractions_sector_count.json");
				new SimpleSectorValueProvider("hospitals_count", "Hospitals count", "hospitals_sector_count.json");
				new SimpleSectorValueProvider("pubs_count", "Pubs & Bars count", "pubs_sector_count.json");
				new SimpleSectorValueProvider("restaurants_count", "Restaurants count",
					"restaurants_sector_count.json");
				new SimpleSectorValueProvider("flickr_images_count", "Flickr Images count",
					"restaurants_sector_count.json");
				new SimpleSectorValueProvider("population", "Population", "population.json");
				new SimpleSectorValueProvider("average_income", "Average Income ", "average_income.json");
				new SimpleSectorValueProvider("workplaces_count", "Workplaces Count", "workplaces_count.json");
				new SimpleSectorValueProvider("criminal_charges", "Number of Criminal Charges",
					"criminal_charges.json");
			}
		};
	});
