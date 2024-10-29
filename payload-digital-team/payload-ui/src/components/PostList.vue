<template>
  <v-container>
    <!-- Post Title -->
    <v-row v-if="post">
      <v-col>
        <h1>{{ post.title }}</h1>
        <p><strong>Published At:</strong> {{ formatDate(post.publishedAt) }}</p>
        <p><strong>Author:</strong> {{ post.populatedAuthors?.[0]?.name || 'Unknown' }}</p>
      </v-col>
    </v-row>

    <!-- Categories -->
    <v-row v-if="post?.categories?.length">
      <v-col>
        <h2>Categories</h2>
        <v-chip-group>
          <v-chip v-for="category in post.categories" :key="category.id" class="ma-1">
            {{ category.title || 'Untitled' }}
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>

    <!-- Hero Section -->
    <v-row v-if="post?.hero">
      <v-col>
        <h2>{{ post.hero.richText?.[0]?.children?.[0]?.text || 'No Title' }}</h2>
        <v-img v-if="post.meta?.image" :src="post.meta.image.url" :alt="post.meta.image.alt" max-width="600"></v-img>
      </v-col>
    </v-row>

    <!-- Layout Content -->
    <v-row v-for="(layout, index) in post?.layout || []" :key="index" class="mt-5">
      <v-col v-for="column in layout.columns" :key="column.id" :cols="column.size === 'twoThirds' ? 8 : 4">
        <p>{{ column.richText?.[0]?.children?.[0]?.text || 'No Content' }}</p>
      </v-col>
    </v-row>

    <!-- Premium Content -->
    <v-row v-if="post?.enablePremiumContent && post.premiumContent?.length">
      <v-col>
        <h2>Premium Content</h2>
        <v-row v-for="(premium, index) in post.premiumContent" :key="index">
          <v-col v-for="column in premium.columns" :key="column.id">
            <p v-for="child in column.richText?.[0]?.children || []" :key="child.text">
              <strong v-if="child.bold">{{ child.text }}</strong>
              <span v-else>{{ child.text }}</span>
            </p>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Related Posts -->
    <v-row v-if="post?.relatedPosts?.length">
      <v-col>
        <h2>Related Posts</h2>
        <v-card v-for="related in post.relatedPosts" :key="related.id" class="ma-3">
          <v-card-title>{{ related.title }}</v-card-title>
          <v-card-text>{{ related.hero?.richText?.[0]?.children?.[0]?.text || 'No Text' }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'PostList',
  props: {
    postId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const post = ref(null)

    onMounted(async () => {
      post.value = await fetchPost(props.postId)
    })

    const fetchPost = async (id) => {
      try {
        const response = await axios.get(`/api/posts/67203ed750632503e91d7a15`)
        return response.data
      } catch (error) {
        console.error('Error fetching post:', error)
        return null
      }
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }

    return { post, formatDate }
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: bold;
}
</style>
