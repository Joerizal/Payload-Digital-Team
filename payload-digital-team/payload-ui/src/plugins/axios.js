import api from '@/configs/axios'

export default {
  install: app => {
    // Make Axios instance available globally as $axios
    app.config.globalProperties.$axios = api
  },
}
