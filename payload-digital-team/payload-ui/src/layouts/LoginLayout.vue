<template>
    <v-row class="p-0 m-0">
      <v-col
        lg="8"
        md="6"
        class="w-100 p-0 bg-login d-flex flex-column align-center justify-space-between"
        v-if="!xs"
        style="height: 100vh"
      >
        <!-- <div class="pt-2">
          <img src="/src/assets/icon/logo-white.svg" alt="logo" />
        </div>
        <div class="pb-10 text-center font-20-800 text-white">
          JCORP RECORD MANAGEMENT SYSTEM <br />
          <span class="font-16-400">© 2024 Copyright JRMS</span>
        </div> -->
      </v-col>
  
      <v-col lg="4" md="6" class="w-100 p-0" style="height: 100vh">
        <router-view></router-view>
      </v-col>
    </v-row>
  </template>
  
  <script>
  import "../styles/style.scss";
  import { useDisplay } from "vuetify";
  export default {
    setup() {
      const { xs } = useDisplay();
      return { xs };
    },
  };
  </script>
  
  <style scoped>
  .bg-login {
    background-image: url("/src/assets/image/bg-login.webp"); /* Replace with the path to your image */
    background-size: cover; /* This ensures the image covers the entire element */
    background-position: center; /* This centers the image in the element */
    background-repeat: no-repeat; /* This prevents the image from repeating */
  }
  </style>
  