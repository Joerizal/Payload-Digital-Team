// stores/permissionsStore.js
import { defineStore } from "pinia";
import axios from "@/configs/axios";
import { useUserStore } from "@/store/user_store";
import { usePermissionsStore } from "@/store/permissions_store";
import { useSearchStore } from "@/store/search_store";

export const useAuthStore = defineStore("auth-store", {
  state: () => ({
    auth: {},
  }),
  actions: {
    setAuth(auth) {
      this.auth = auth;
    },
    async login({ username, password, is_secure_login, otp }) {
      try {
        const response = await axios.post("/api/auth/login", {
          username,
          password,
          is_secure_login,
          otp,
        });

        this.setAuth(response.data.data.auth);

        const userStore = useUserStore();
        userStore.setUser(response.data.data.user);
      } catch (error) {
        throw error;
      }
    },
    async refreshToken() {
      try {
        const response = await axios.post("/api/auth/refresh-token");
        this.setAuth(response.data.data.auth);

        const userStore = useUserStore();
        userStore.setUser(response.data.data.user);

        return response.data.data;
      } catch (error) {
        window.location.href = "/login";
        console.error(error);
        throw error;
      }
    },
    async logout() {
      try {
        const response = await axios.post("/api/auth/logout");

        this.setAuth({});

        const userStore = useUserStore();
        userStore.setUser({});

        const permissionsStore = usePermissionsStore();
        permissionsStore.setPermissions([]);

        const searchStore = useSearchStore();
        searchStore.setAdvancedSearchQuery({});
      } catch (error) {
        console.error(error);
        this.setAuth({});
        throw error;
      }
    },
  },
  // persist: {
  //   enabled: true,
  //   strategies: [
  //     {
  //       key: "auth-store", // Key used in local storage
  //       storage: localStorage, // Use sessionStorage if you prefer session-only persistence
  //       paths: ["auth"], // Specify which parts of the state to persist
  //     },
  //   ],
  // },
});
