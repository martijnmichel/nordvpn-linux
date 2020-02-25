<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import _ from "lodash";
export default {
  name: "App",
  mounted() {
    console.log(this);
  }
};
</script>
