<template>
  <v-app id="inspire">
    <!-- Hamburger only when collapsed -->
    <div v-if="rail" class="ham-only">
      <img
        src="/src/assets/icon/ham-nav.svg"
        alt="ham"
        @click.stop="rail = !rail"
        class="pointer ham-icon"
      />
    </div>

    <!-- Full navigation drawer when expanded -->
    <v-navigation-drawer
      v-else
      :width="2000"
      v-model="drawer"
      permanent
      @click="rail = false"
      transition="none"
    >
      <div class="pa-10">
        <v-list-item class="logo pt-5 pb-5">
          <template v-slot:prepend class="bg-white">
            <img
              src="/src/assets/icon/x-icon.svg"
              alt="left arrow"
              @click.stop="rail = !rail"
              class="pointer"
              style="width: 34px; height: 34px;" 
            />
          </template>
        </v-list-item>

        <v-list v-model:opened="open">
          <v-list-item
            title="Home"
            to="/JDMS/records"
            router
            @click="selectItem('Record')"
            class="main-menu"
          >
          </v-list-item>

          <v-list-item
            title="News"
            to="/JDMS/advance-search"
            router
            @click="selectItem('Search')"
            class="main-menu"
          >
          </v-list-item>
        </v-list>
      </div>
    </v-navigation-drawer>

    <v-app-bar class="shadow-none pt-4 bg-E5E9F2">
      <AppBar :class="{ 'drawer-collapsed-margin': rail }" />
    </v-app-bar>

    <v-main
      class="bg-E5E9F2"
      style="padding-left: 97px; padding-top: 100px; padding-right: 20px"
      :class="{ 'main-collapsed-margin': !rail }"
    >
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import "../styles/style.scss";

export default {
  data() {
    return {
      drawer: true,
      rail: true,
      selectedItem: "",
      open: ["Users"],
    };
  },
  methods: {
    selectItem(item) {
      this.selectedItem = item;
    },
  },
};
</script>

<style>
.ham-only {
  position: fixed;
  top: 0;
  left: 0;
  width: 60px;
  height: 60px;
  background: hsla(0, 0%, 10%, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.ham-icon {
  padding: 12px;
  cursor: pointer;
}

.v-navigation-drawer {
  background: #1a1a1a !important;
  box-shadow: 0px 2px 4px 0px rgba(165, 163, 174, 0.3) !important;
  border: none !important;
  transition: none !important;
}

.v-navigation-drawer__content {
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  transition: none !important;
}

.drawer-collapsed-margin {
  margin-left: 60px !important;
}

.main-collapsed-margin {
  padding-left: 280px !important;
  padding-right: 30px !important;
}

.selected-item {
  background-color: #002680 !important;
  border-radius: 4px !important;
  box-shadow: 0px 2px 4px 0px rgba(165, 163, 174, 0.3) !important;
  color: #fff !important;
  stroke: #ffffff !important;
}

.main-menu.v-list-item--variant-text .v-list-item__overlay {
  background-color: #fff !important;
}
</style>