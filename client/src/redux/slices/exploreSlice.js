import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import FetchApi from "../../client.js";
import { config } from "../../config/config.js";

const initialState = {
  allVideos: [],
  mostViewedThumbnails: [],
};

// export const getAllVideos = createAsyncThunk(
//   "explore/getAllVideos",
//   async ({ page, category, language, tags, search }) => {
//     try {
//       return await FetchApi.fetch(`${config.api}/api/explore/getallvideos?page=${page}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//     } catch (error) {
//       throw new Error(error.message);
//     }
//   },
// );
export const getAllVideos = createAsyncThunk(
  "explore/getAllVideos",
  async ({ page = 1, limit = 12, category = "", language = "", tags = [], search = "" }) => {
    try {
      const query = new URLSearchParams({
        page,
        limit,
        category,
        language,
        tags: tags.join(","), // Convert tags array to comma-separated string
        search,
      }).toString();

      return await FetchApi.fetch(`${config.api}/api/explore/getallvideos?${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // if (!response.ok) throw new Error("Failed to fetch videos.");

      // return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },
);

export const getMostViewedThumbnails = createAsyncThunk("explore/getMostViewedThumbnails", async () => {
  try {
    return await FetchApi.fetch(`${config.api}/api/explore/getmostviewedthumbnails`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

export const videoFilter = createAsyncThunk(
  "creator/videoFilter",
  async ({ category, language, tags, search }) => {
    // console.log("category", category, "language", language, "tags", tags, "search", search);
    try {
      return await FetchApi.fetch(`${config.api}/api/creator/video/filter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category, language, tags, search }),
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },
);

const exploreSlice = createSlice({
  name: "explore",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllVideos.fulfilled, (state, { payload }) => {
      state.allVideos = payload;
    });
    builder.addCase(getMostViewedThumbnails.fulfilled, (state, { payload }) => {
      state.mostViewedThumbnails = payload.thumbnails;
    });
    builder.addCase(videoFilter.fulfilled, (state, { payload }) => {
      state.allVideos = payload.data;
    });
  },
});

export const selectAllVideos = (state) => state.explore.allVideos;
export const selectMostViewedThumbnails = (state) => state.explore.mostViewedThumbnails;
export default exploreSlice.reducer;
