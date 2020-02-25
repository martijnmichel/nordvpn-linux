<template>
  <div id="world-map" ref="chartdiv"></div>
</template>

<style>
#world-map {
  width: 100%;
  height: 700px;
  overflow: hidden;
}
</style>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
//import am4themes_dataviz from "src/node_modules/@amcharts/amcharts4/themes/themes/dataviz.js";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
export default {
  name: "WorldMap",
  mounted() {
    let map = document.getElementById("world-map");
    map.style.height = window.innerHeight;
    /* Imports */

    /* Chart code */
    // Themes begin
    //am4core.useTheme(am4themes_dataviz);
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create map instance
    let chart = am4core.create(this.$refs.chartdiv, am4maps.MapChart);

    // Set map definition
    chart.geodata = am4geodata_worldLow;

    // Set projection
    chart.projection = new am4maps.projections.Miller();

    // Create map polygon series
    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    // Exclude Antartica
    polygonSeries.exclude = ["AQ"];

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;

    // Configure series
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.polygon.fillOpacity = 0.6;

    // Create hover state and set alternative fill color
    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = chart.colors.getIndex(0);

    let as = polygonTemplate.states.create("active");
    if (this.$store.state.Country) {
      as.properties.fill = chart.colors.getIndex(0);
    }

    polygonTemplate.events.on("hit", ev => {
      // zoom to an object
      ev.target.series.chart.zoomToMapObject(ev.target);

      // get object info
      console.log(ev.target.dataItem.dataContext.id);

      let landcode = ev.target.dataItem.dataContext.id;
      window.ptyProcess.write(`nordvpn connect ${landcode}\r`);
      this.$root.$emit("updateStatus");
    });

    // Add image series
    let imageSeries = chart.series.push(new am4maps.MapImageSeries());
    imageSeries.mapImages.template.propertyFields.longitude = "longitude";
    imageSeries.mapImages.template.propertyFields.latitude = "latitude";
    imageSeries.mapImages.template.tooltipText = "{title}";
    imageSeries.mapImages.template.propertyFields.url = "url";

    let circle = imageSeries.mapImages.template.createChild(am4core.Circle);
    circle.radius = 3;
    circle.propertyFields.fill = "color";

    let circle2 = imageSeries.mapImages.template.createChild(am4core.Circle);
    circle2.radius = 3;
    circle2.propertyFields.fill = "color";

    circle2.events.on("inited", function(event) {
      animateBullet(event.target);
    });

    function animateBullet(circle) {
      let animation = circle.animate(
        [
          { property: "scale", from: 1, to: 5 },
          { property: "opacity", from: 1, to: 0 }
        ],
        1000,
        am4core.ease.circleOut
      );
      animation.events.on("animationended", function(event) {
        animateBullet(event.target.object);
      });
    }

    let colorSet = new am4core.ColorSet();
  }
};
</script>

<style></style>
