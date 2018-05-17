<template>
  <div class="charts-page">
    <div class="row">
      <div class="col-md-6">
        <vuestic-widget class="chart-widget" headerText="Indicator">
            <indicator-box></indicator-box>
        </vuestic-widget>
      </div>

      <div class="col-md-6">
        <vuestic-widget class="chart-widget" headerText="Localization">
          <location-graph></location-graph>
        </vuestic-widget>
      </div>

    </div>

    <!-- <div class="row">
      <div class="col-md-6">
        <vuestic-widget class="chart-widget" headerText="Walking Speed">
            <speed-graph></speed-graph>
        </vuestic-widget>
      </div>
    </div> -->

    <div class="row">
      <!-- <div class="col-md-12">
        <vuestic-widget class="chart-widget" headerText="Duration">
          <duration-graph></duration-graph>
        </vuestic-widget>
      </div> -->
      <div class="col-md-6">
        <vuestic-widget class="chart-widget" headerText="Intensity">
          <intensity-graph></intensity-graph>
        </vuestic-widget>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <vuestic-widget class="chart-widget" headerText="Sleep Time">
          <duration-sleep></duration-sleep>
        </vuestic-widget>
      </div>

      <div class="col-md-6">
        <vuestic-widget class="chart-widget" headerText="Toilet Time">
          <duration-toilet></duration-toilet>
        </vuestic-widget>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <vuestic-widget class="chart-widget" headerText="Bedroom Visit Times">
          <visit-time-bedroom></visit-time-bedroom>
        </vuestic-widget>
      </div>

      <div class="col-md-6">
        <vuestic-widget class="chart-widget" headerText="Bathroom Visit Times">
          <visit-time-restroom></visit-time-restroom>
        </vuestic-widget>
      </div>
    </div>

  </div>
</template>

<script>
  import LineChartData from 'data/charts/LineChartData'
  import BubbleChartData from 'data/charts/BubbleChartData'
  import PieChartData from 'data/charts/PieChartData'
  import DonutChartData from 'data/charts/DonutChartData'
  import VerticalBarChartData from 'data/charts/VerticalBarChartData'
  import HorizontalBarChartData from 'data/charts/HorizontalBarChartData'
  import LocationGraph from 'components/demo-components/LocationGraph.vue'
  import IntensityGraph from 'components/demo-components/IntensityGraph.vue'
  import SpeedGraph from "components/demo-components/SpeedGraph.vue";
  import DurationGraph from "components/demo-components/DurationGraph.vue";
  import webFrame from 'components/testComponents/webFrame.vue';
  import barGraph from 'components/testComponents/barGraph.vue'
  import DurationSleep from "components/demo-components/DurationSleep.vue"
  import DurationToilet from "components/demo-components/DurationToilet.vue"
  import VisitTimeBedroom from "components/demo-components/VisitTimeBedroom.vue"
  import VisitTimeRestroom from "components/demo-components/VisitTimeRestroom.vue"
  import IndicatorBox from "components/demo-components/IndicatorBox.vue";


  export default {
    name: 'charts',
    components: {
      // d3Image,
      // scrollingChart,
      // areaChart,
      webFrame,
      // svgViewport,
      barGraph,
      // intensityGraph
      LocationGraph,
      IntensityGraph,
      SpeedGraph,
      DurationGraph,
      DurationSleep,
      DurationToilet,
      VisitTimeBedroom,
      VisitTimeRestroom,
      IndicatorBox
    },
    data: function () {
      return {
        bubbleChartData: BubbleChartData,
        lineChartData: LineChartData,
        pieChartData: PieChartData,
        donutChartData: DonutChartData,
        verticalBarChartData: VerticalBarChartData,
        horizontalBarChartData: HorizontalBarChartData,
      }
    }
  }
</script>

<style lang="scss">
  .widget.chart-widget {
    .widget-body {
      height: 550px;
    }
  }
</style>
