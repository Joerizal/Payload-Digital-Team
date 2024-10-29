// src/api.js

import axios from 'axios'

// Define base API URL as /api to leverage the Vite proxy
const API_URL = '/api'

// Fetch pages from Payload CMS
export const getPages = async () => {
  try {
    const response = await axios.get(`${API_URL}/pages`)
    return response.data.docs
  } catch (error) {
    console.error('Error fetching pages:', error)
    return []
  }
}

// Fetch posts from Payload CMS
export const getPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/posts`)
    return response.data.docs
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}
