import { UTIL_URL, ADD_IMPRESSION, GET_IMPRESSIONS } from "../../../shared/utilApiPaths";
import { apiSlice } from "./apiSlice";

export const utilApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addImpression: builder.mutation({
      query: (data) => ({
        url: `${UTIL_URL}/${ADD_IMPRESSION}`,
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Impression"]
    }),
    getImpressions: builder.query({
      query: () => ({
        url: `${UTIL_URL}/${GET_IMPRESSIONS}`,
        method: "GET"
      }),
      providesTags: ["Impression"]
    })
  })
});

export const {
  useAddImpressionMutation,
  useGetImpressionsQuery,
} = utilApiSlice;
