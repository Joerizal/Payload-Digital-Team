<!-- src/components/CreatePage.vue -->

<template>
    <v-container>
      <h1>Create a New Page</h1>
      <v-form @submit.prevent="submitPage">
        <v-text-field
          v-model="page.title"
          label="Page Title"
          required
        ></v-text-field>
  
        <v-textarea
          v-model="page.description"
          label="Page Description"
          required
        ></v-textarea>
  
        <v-textarea
          v-model="page.heroRichText"
          label="Hero Rich Text (JSON)"
          placeholder='Example: {"children": [{"text": "Your hero text here"}]}'
          required
        ></v-textarea>
  
        <v-btn @click="addRow" color="secondary">Add Layout Row</v-btn>
        
        <div v-for="(row, index) in page.layout" :key="index">
          <v-text-field
            v-model="row.content"
            :label="`Row ${index + 1} Content`"
            required
          ></v-text-field>
        </div>
  
        <v-btn type="submit" color="primary">Create Page</v-btn>
      </v-form>
      <v-alert v-if="message" :type="alertType">{{ message }}</v-alert>
    </v-container>
  </template>
  
  <script>
  import { ref } from 'vue'
  import axios from 'axios'
  
  export default {
    setup() {
      const page = ref({
        title: '',
        description: '',
        heroRichText: '',
        layout: [],
      })
      const message = ref('')
      const alertType = ref('success')
  
      const submitPage = async () => {
        // Prepare the payload for the API
        const payload = {
          title: page.value.title,
          description: page.value.description,
          hero: {
            richText: JSON.parse(page.value.heroRichText), // Parse the JSON input
          },
          layout: page.value.layout.map((content) => ({
            // Create the layout structure with at least one row
            rows: [{ content }],
          })),
        }
  
        // Ensure at least one layout row exists
        if (payload.layout.length === 0) {
          payload.layout.push({ rows: [{ content: 'Default row content' }] })
        }
  
        try {
          const response = await axios.post('/api/pages', payload)
          message.value = 'Page created successfully!'
          alertType.value = 'success'
          // Optionally, reset the form
          page.value = { title: '', description: '', heroRichText: '', layout: [] }
        } catch (error) {
          message.value = 'Failed to create page: ' + error.response.data.errors.map(err => err.message).join(', ')
          alertType.value = 'error'
        }
      }
  
      const addRow = () => {
        page.value.layout.push({ content: '' }) // Add a new empty row
      }
  
      return { page, submitPage, message, alertType, addRow }
    },
  }
  </script>
  
  <style scoped>
  /* Add any styles specific to CreatePage.vue here */
  </style>
  