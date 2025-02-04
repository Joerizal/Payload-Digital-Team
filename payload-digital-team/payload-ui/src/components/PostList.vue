<template>
  <v-container>
    <div v-if="loading" class="text-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <div v-else-if="error" class="text-center error-message">
      {{ error }}
    </div>

    <template v-else-if="page">
      <!-- Title Section -->
      <v-row>
        <v-col>
          <h1>{{ page.title }}</h1>
        </v-col>
      </v-row>

      <!-- Hero Section -->
      <v-row v-if="page.hero">
        <v-col>
          <div :class="{ 'high-impact': page.hero.type === 'highImpact', 'low-impact': page.hero.type === 'lowImpact' }">
            <div v-for="(text, index) in page.hero.richText" :key="index">
              <div v-if="text.type === 'h1'" class="text-h4">
                {{ getText(text.children) }}
              </div>
              <div v-else-if="text.type === 'large-body'" class="text-body-1">
                <template v-for="(child, childIndex) in text.children">
                  <a v-if="child.type === 'link'" 
                     :key="`link-${childIndex}`"
                     :href="child.url"
                     :target="child.newTab ? '_blank' : '_self'"
                     class="text-decoration-none">
                    {{ getText(child.children) }}
                  </a>
                  <span v-else :key="`text-${childIndex}`">{{ child.text }}</span>
                </template>
              </div>
            </div>

            <!-- Hero Links -->
            <div v-if="page.hero.links" class="mt-4">
              <v-btn
                v-for="(link, index) in page.hero.links"
                :key="index"
                :color="link.link.appearance === 'primary' ? 'primary' : 'secondary'"
                :to="link.link.url || ''"
                class="mr-2"
              >
                {{ link.link.label }}
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Layout Content -->
      <template v-if="page.layout">
        <v-row v-for="(section, sIndex) in page.layout" :key="sIndex" class="mt-5">
          <!-- Content Block -->
          <template v-if="section.blockType === 'content'">
            <v-col v-for="(column, cIndex) in section.columns" :key="cIndex"
              :cols="getColumnSize(column.size)">
              <div v-for="(content, rIndex) in column.richText" :key="rIndex">
                <component 
                  :is="getHeadingType(content.type)"
                  :class="getTextClass(content.type)"
                >
                  {{ getText(content.children) }}
                </component>
              </div>
            </v-col>
          </template>

          <!-- Media Block -->
          <template v-if="section.blockType === 'mediaBlock'">
            <v-col cols="12">
              <v-img
                :src="section.media.url"
                :alt="section.media.alt"
                :aspect-ratio="16/9"
                cover
              >
                <template v-if="section.media.caption" #placeholder>
                  <div class="text-caption">{{ getText(section.media.caption[0].children) }}</div>
                </template>
              </v-img>
            </v-col>
          </template>

         <!-- Archive Block -->
<template v-if="section.blockType === 'archive'">
  <v-col cols="12">
    <archive-block
      :intro-content="section.introContent"
      :relation-to="section.relationTo"
      :populated-docs="section.populatedDocs"
    />
  </v-col>
</template>

          <!-- CTA Block -->
          <template v-if="section.blockType === 'cta'">
            <v-col cols="12" class="text-center">
              <div v-for="(content, index) in section.richText" :key="index">
                <component 
                  :is="getHeadingType(content.type)"
                  :class="getTextClass(content.type)"
                >
                  {{ getText(content.children) }}
                </component>
              </div>
              
              <div class="mt-4">
                <v-btn
                  v-for="(link, index) in section.links"
                  :key="index"
                  :color="link.link.appearance === 'primary' ? 'primary' : 'secondary'"
                  :to="link.link.url || ''"
                  class="mx-2"
                >
                  {{ link.link.label }}
                </v-btn>
              </div>
            </v-col>
          </template>
        </v-row>
      </template>
    </template>
  </v-container>
</template>

<script>
import axios from 'axios'
import ArchiveBlock from './ArchiveBlock.vue';

export default {
  name: 'PageDetail',
  components: {
    ArchiveBlock
  },
  props: {
    id: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      page: null,
      loading: true,
      error: null
    }
  },
  methods: {
    async fetchPageData() {
      this.loading = true
      this.error = null
      const pageId = this.id || this.$route.params.id

      try {
        const response = await axios.get(`/api/pages/${pageId}`, {
          params: {
            depth: 1
          }
        })
        
        this.page = response.data
      } catch (error) {
        console.error('Error fetching page:', error)
        this.error = 'Failed to load page'
      } finally {
        this.loading = false
      }
    },
    getText(children) {
      if (!children) return ''
      return children.map(child => child.text || '').join('')
    },
    getColumnSize(size) {
      switch (size) {
        case 'full': return 12
        case 'oneThird': return 4
        case 'oneHalf': return 6
        default: return 12
      }
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
        day: 'numeric',
      })
    }
  },
  watch: {
    '$route'(to, from) {
      if (to.params.id !== from.params.id) {
        this.fetchPageData()
      }
    }
  },
  async created() {
    await this.fetchPageData()
  }
}
</script>

<style scoped>
h1, h2, h3, h4 {
  font-weight: bold;
}
.error-message {
  color: red;
  padding: 1rem;
}
.high-impact {
  padding: 2rem 0;
  background-color: var(--v-primary-lighten5);
}
.low-impact {
  padding: 1rem 0;
}
</style>