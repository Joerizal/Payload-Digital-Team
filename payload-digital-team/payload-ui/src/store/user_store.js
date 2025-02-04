// stores/permissionsStore.js
import { defineStore } from "pinia";
import axios from "@/configs/axios";
import { useAuthStore } from "@/store/auth_store";

export const useUserStore = defineStore("user-store", {
  state: () => ({
    user: {},
    positions: [],
    departments: [],
  }),
  actions: {
    setUser(user) {
      this.user = user;
    },
    setPositions(positions) {
      this.positions = positions;
    },
    setDepartments(departments) {
      this.departments = departments;
    },
    async getPositions({ namespace_id }) {
      try {
        const response = await axios.get("/api/positions", {
          params: {
            namespace_id,
          },
        });

        this.setPositions(response.data.data.rows);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        this.setPositions([]);
      }
    },
    async getDepartments({ namespace_id }) {
      try {
        const response = await axios.get("/api/departments", {
          params: {
            namespace_id,
          },
        });

        this.setDepartments(response.data.data.rows);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        this.setDepartments([]);
      }
    },
    async updateUser({
      id,
      full_name,
      email_address,
      department_id,
      position_id,
    }) {
      try {
        const params = {
          params: {
            id,
          },
        };

        const body = {
          full_name,
          email_address,
          department_id,
          position_id,
        };

        const response = await axios.put("/api/user", body, params);

        if (response.status === 200) {
          this.setUser(response.data.data);
          return {
            success: true,
            message: response.data.message || "Profile updated successfully.",
            data: response.data.data,
          };
        }

        return {
          success: false,
          message: response.data.message || "Failed to update profile",
        };
      } catch (error) {
        console.error("Error updating user:", error);
        return {
          success: false,
          message: error.response?.data?.message || "Error updating profile",
        };
      }
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "user-store", // Key used in local storage
        storage: localStorage, // Use sessionStorage if you prefer session-only persistence
        paths: ["user"], // Specify which parts of the state to persist
      },
    ],
  },
});
