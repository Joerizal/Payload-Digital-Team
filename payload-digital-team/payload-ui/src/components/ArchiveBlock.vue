<!-- ArchiveBlock.vue -->
<template>
    <div class="archive-block">
      <!-- Intro Content -->
      <div v-for="(content, index) in introContent" :key="index">
        <component 
          :is="getHeadingType(content.type)"
          :class="getTextClass(content.type)"
        >
          {{ getText(content.children) }}
        </component>
      </div>
      
      <!-- Documents Grid -->
      <v-row>
        <v-col v-for="doc in documents" :key="doc.id" cols="12" md="4">
          <v-card :to="generateDocumentUrl(doc)" class="h-100">
            <v-img
              v-if="doc.thumbnail"
              :src="doc.thumbnail.url"
              :alt="doc.thumbnail.alt"
              height="200"
              cover
            ></v-img>
            
            <v-card-title>{{ doc.title }}</v-card-title>
            
            <v-card-text>
              <div v-if="doc.excerpt" class="mb-2">{{ doc.excerpt }}</div>
              <div class="text-caption">
                {{ formatDate(doc.publishedAt || doc.createdAt) }}
              </div>
            </v-card-text>
            
            <v-card-actions>
              <v-btn
                variant="text"
                color="primary"
                :to="generateDocumentUrl(doc)"
              >
                Read More
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    name: 'ArchiveBlock',
    
    props: {
      introContent: {
        type: Array,
        default: () => []
      },
      relationTo: {
        type: String,
        required: true
      },
      populatedDocs: {
        type: Array,
        required: true
      }
    },
    
    data() {
      return {
        documents: [],
        loading: false,
        error: null
      }
    },

    watch: {
      populatedDocs: {
        handler: 'fetchDocuments',
        deep: true
      }
    },
    
    methods: {
      async fetchDocuments() {
        this.loading = true
        this.error = null
        
        try {
          const documentIds = this.populatedDocs.map(doc => doc.value)
          const requests = documentIds.map(id => 
            axios.get(`/api/${this.relationTo}/${id}`)
          )
          
          const responses = await Promise.all(requests)
          this.documents = responses.map(response => response.data)
        } catch (error) {
          console.error(`Error fetching ${this.relationTo}:`, error)
          this.error = `Failed to load ${this.relationTo}`
        } finally {
          this.loading = false
        }
      },
      
      getText(children) {
        if (!children) return ''
        return children.map(child => child.text || '').join('')
      },
      
      getHeadingType(type) {
        switch (type) {
          case 'h1': return 'h1'
          case 'h2': return 'h2'
          case 'h3': return 'h3'
          case 'h4': return 'h4'
          default: return 'p'
        }
      },
      
      getTextClass(type) {
        switch (type) {
          case 'h1': return 'text-h4'
          case 'h2': return 'text-h5'
          case 'h3': return 'text-h6'
          case 'h4': return 'text-subtitle-1'
          default: return 'text-body-1'
        }
      },
      
      formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      },
      
      generateDocumentUrl(doc) {
        return `/${this.relationTo}/${doc.slug}`
      }
    },
    
    async created() {
      await this.fetchDocuments()
    },
    
   
  }
  </script>
  
  <style scoped>
  .archive-block {
    margin: 2rem 0;
  }
  </style>