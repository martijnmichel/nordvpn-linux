<template>
  <div id="world-map" ref="chartdiv"></div>
</template>

<style>
#world-map {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}
</style>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
//import am4themes_dataviz from "src/node_modules/@amcharts/amcharts4/themes/themes/dataviz.js";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
const axios = require("axios");
export default {
  name: "WorldMap",
  data() {
    return {
      chart: undefined
    };
  },
  beforeDestroy() {
    this.chart.dispose();
    this.$root.$off("update:worldmap");
  },
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
    this.chart = am4core.create(this.$refs.chartdiv, am4maps.MapChart);

    // Set map definition
    this.chart.geodata = am4geodata_worldLow;

    // Set projection
    this.chart.projection = new am4maps.projections.Miller();

    this.chart.homeZoomLevel = 5;
    this.chart.homeGeoPoint = {
      latitude: 52,
      longitude: 11
    };

    // Create map polygon series
    let polygonSeries = this.chart.series.push(new am4maps.MapPolygonSeries());

    // Exclude Antartica
    polygonSeries.exclude = ["AQ"];

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;

    // Configure series
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.polygon.fillOpacity = 0.6;
    polygonTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer;

    // Create hover state and set alternative fill color
    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = this.chart.colors.getIndex(0);

    let as = polygonTemplate.states.create("active");
    as.properties.fill = this.chart.colors.getIndex(0);

    this.$root.$on("update:worldmap", () => {
      polygonSeries.mapPolygons.each(function(item) {
        item.isActive = false;
      });

      if (!this.$store.state.status.country) {
        this.chart.goHome();
        return false;
      }
      axios
        .get(
          `https://restcountries.eu/rest/v2/name/${this.$store.state.status.country}?fullText=true`
        )
        .then(response => {
          polygonSeries.getPolygonById(
            response.data[0].alpha2Code
          ).isActive = true;

          this.chart.zoomToMapObject(
            polygonSeries.getPolygonById(response.data[0].alpha2Code)
          );
        });
    });

    polygonTemplate.events.on("hit", async ev => {
      //polygonTemplate.setStateOnChildren = true;
      // zoom to an object
      ev.target.series.chart.zoomToMapObject(ev.target);
      //ev.target.isActive = !ev.target.isActive;

      polygonSeries.mapPolygons.each(function(item) {
        if (item != ev.target) {
          item.isActive = false;
        } else {
          ev.target.isActive = !ev.target.isActive;
        }
      });

      // get object info
      let landcode = ev.target.dataItem.dataContext.id;
      await window.ptyProcess.write(`nordvpn connect ${landcode}\r`);
    });

    // Add image series
    let imageSeries = this.chart.series.push(new am4maps.MapImageSeries());
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
