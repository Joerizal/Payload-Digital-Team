// stores/permissionsStore.js
import { defineStore } from "pinia";
import axios from "@/configs/axios";

export const usePermissionsStore = defineStore("permissions-store", {
  state: () => ({
    permissions: [], // Permissions data stored in memory
  }),
  actions: {
    setPermissions(permissions) {
      this.permissions = permissions;
    },
    async getPermissions() {
      try {
        const response = await axios.get("/api/user/permissions");

        const permissions = response.data.data.flatMap((role) =>
          role.edms_permissions.map((permission) => permission.permission),
        );

        this.setPermissions(permissions); // Store permissions in Pinia state
      } catch (error) {
        console.error("Error fetching permissions:", error);
        this.setPermissions([]); // Clear permissions on error
      }
    },
  },
  // persist: {
  //   enabled: false,
  //   strategies: [
  //     {
  //       key: "permissions-store", // Key used in local storage
  //       storage: localStorage, // Use sessionStorage if you prefer session-only persistence
  //       paths: ["permissions"], // Specify which parts of the state to persist
  //     },
  //   ],
  // },
});
