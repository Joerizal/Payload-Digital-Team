<template>
  <v-container>
    <v-row>
      <v-col cols="12">
      <!-- Page Title -->
      <v-sheet class="bg-transparent font-28-800 font-002680 mt-2 mb-3"
        >JCORP.AI</v-sheet
      >
        
        <v-card class="d-flex flex-column align-center" v-if="page?.hero">
          <!-- <p class="font-20-800 pt-1">Welcome to JRMS</p> -->
          <p class="font-20-800 pb-2">{{ page.hero.richText[1]?.children[0]?.text }}</p>
          <p class="font-34-800 custom-text">{{ page.hero.richText[3]?.children[0]?.text }}</p>
          <!-- <p>{{ page.hero.richText[2]?.children[0]?.text }}</p> -->
          <v-btn @click="goToCreatePage" color="primary">Create New Page</v-btn>
        </v-card>

        <div v-if="page?.layout">
          <v-row>
            <v-col v-for="block in page.layout" :key="block.id">
              <div v-if="block.richText">
                <h2 v-if="block.richText[1]?.children[0]?.text">{{ block.richText[1].children[0].text }}</h2>
                <p v-if="block.richText[2]?.children[0]?.text">{{ block.richText[2].children[0].text }}</p>
              </div>
              <div v-if="block.media">
                <img :src="block.media.url" :alt="block.media.alt" />
              </div>
            </v-col>
          </v-row>
        </div>

        
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="page in pages" :key="page.id" cols="12" md="4">
        <v-card>
          <v-card-title class="pointer" @click="goToPostList(page.id)">
            {{ page.title }}
          </v-card-title>
          <v-card-text>{{ page.description }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Add router-view to display child components -->
    <router-view></router-view>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      page: null, // Store the specific page data
      isLoggedIn: false, // Track login status
    }
  },
  methods: {
    goToCreatePage() {
      this.$router.push({ name: 'CreatePage' })
    },
    goToPostList(id) {
      this.$router.push({
        name: 'PostList',
        params: { id: id.toString() } // Ensure id is a string
      })
    },
    async fetchPage() {
      const API_URL = '/api/pages/67a193e4b31cf4272a477fd9?locale=undefined&draft=true&depth=1';
      try {
        const response = await axios.get(API_URL);
        this.page = response.data; // Store the fetched page data
      } catch (error) {
        console.error('Error fetching page:', error);
        this.page = null; // Reset page data on error
      }
    },
    async getUser() {
      try {
        const response = await axios.get('/api/users/me');
        this.isLoggedIn = true; // User is logged in
      } catch (error) {
        console.error('Error fetching user:', error);
        this.isLoggedIn = false; // User is not logged in
      }
    },
  },
  async created() {
    await this.getUser(); // Check if user is logged in
    if (!this.isLoggedIn) {
      this.$router.push({ name: 'LoginPage' }); // Redirect to login page if not logged in
    } else {
      await this.fetchPage(); // Fetch the specific page if logged in
    }
  },
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}

.custom-text {
  text-transform: uppercase;
  font-family: var(--AvenirHeavy);
  font-size: clamp(30px, 3.125vw, 50px);
  line-height: 1.2;
  letter-spacing: 6px;
}
</style>