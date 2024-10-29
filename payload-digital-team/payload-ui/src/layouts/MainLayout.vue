<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Welcome to the Main Layout</h1>
        <!-- Button to create a new page -->
        <v-btn @click="goToCreatePage" color="primary">Create New Page</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="page in pages" :key="page.id" cols="12" md="4">
        <v-card>
          <v-card-title class="pointer" @click="goToPostList">{{ page.title }}</v-card-title>
          <v-card-text>{{ page.description }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getPages } from '../api';

export default {
  data() {
    return {
      pages: [],
    };
  },
  methods: {
    goToCreatePage() {
      this.$router.push({ name: 'CreatePage' }); // Adjust the route name based on your router
    },
    goToPostList() {
      this.$router.push({ name: 'PostList' });
    },
  },
  async created() {
    this.pages = await getPages();
  },
};
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
