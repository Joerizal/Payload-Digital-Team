import { defineStore } from "pinia";

export const useFileClassPageStore = defineStore("file-class-page-store", {
  state: () => ({
    fileClassPageState: [],
    initialPageState: {
      level: null,
      folderId: null,
      column: "id",
      direction: "ASC",
      size: 5,
      page: 1,
      totalChild: null,
      pageCount: null,
      pageStart: 1,
      pageStop: null,
    },
  }),

  actions: {
    getFileClassPage({ items }) {
      const folderPageState = this.fileClassPageState.find(
        (pageState) => pageState?.folderId == items.folderId,
      );

      const pageState =
        Object.keys(folderPageState || {}).length > 0
          ? folderPageState
          : { ...this.initialPageState, ...items };

      return pageState;
    },

    setFileClassPage({ items }) {
      // Remove states for child levels
      this.fileClassPageState = this.fileClassPageState.filter(
        (pageState) => pageState?.level <= items.level,
      );

      //check for existing state, if not exist use intialize value
      const existingFolderState = {
        ...(Object.keys(this.getFileClassPage({ items }) || {}).length > 0
          ? this.getFileClassPage({ items })
          : this.initialPageState),
      };

      const paginationData = {
        pageCount: this.getPageCount({
          totalChild: items.totalChild || existingFolderState.totalChild,
          size: items.size || existingFolderState.size,
        }),
        pageStart: this.getPageStart({
          page: items.page || existingFolderState.page,
          size: items.size || existingFolderState.size,
          totalChild: items.totalChild || existingFolderState.totalChild,
        }),
        pageStop: this.getPageStop({
          page: items.page || existingFolderState.page,
          size: items.size || existingFolderState.size,
          totalChild: items.totalChild || existingFolderState.totalChild,
        }),
      };

      const newFolderState = {
        ...existingFolderState,
        ...items,
        ...paginationData,
      };

      const existingIndex = this.fileClassPageState.findIndex(
        (state) => state.folderId === items.folderId,
      );

      // Update or push folder state
      if (existingIndex !== -1) {
        this.fileClassPageState[existingIndex] = newFolderState;
      } else {
        this.fileClassPageState.push(newFolderState);
      }
    },

    getPageCount({ totalChild, size }) {
      return Math.ceil(totalChild / size);
    },

    getPageStart({ page, size, totalChild }) {
      return Math.min((page - 1) * size + 1, totalChild);
    },

    getPageStop({ page, size, totalChild }) {
      return Math.min(page * size, totalChild);
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: "file-class-page-store",
        storage: localStorage,
        paths: ["fileClassPageState"],
      },
    ],
  },
});
