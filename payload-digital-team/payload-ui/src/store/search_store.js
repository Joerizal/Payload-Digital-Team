// stores/permissionsStore.js
import { defineStore } from "pinia";
import axios from "@/configs/axios";

export const useSearchStore = defineStore("search-store", {
  state: () => ({
    isAdvancedSearch: false,
    advancedSearchQuery: {},
  }),
  actions: {
    setIsAdvancedSearch(isAdvancedSearch) {
      this.isAdvancedSearch = isAdvancedSearch;
    },
    setAdvancedSearchQuery(advancedSearchQuery) {
      this.advancedSearchQuery = advancedSearchQuery;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "search-store",
        storage: localStorage,
        paths: ["isAdvancedSearch", "advancedSearchQuery"],
      },
    ],
  },
});
