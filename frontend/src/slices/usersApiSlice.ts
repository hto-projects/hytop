import { apiSlice } from "./apiSlice";
const USERS_URL = "/api/users";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data
      }),
      invalidatesTags: ["User"]
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST"
      }),
      invalidatesTags: ["User"]
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data
      }),
      invalidatesTags: ["User"]
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["User"]
    }),
    getUserProfileInfo: builder.query({
      query: (userId) => { console.log('hey'); return ({
        url: `${USERS_URL}/${userId}/profile-info`,
        method: "GET"
      })},
      providesTags: ["User"],
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/reset-password`,
        method: "POST",
        body: data
      }),
      invalidatesTags: ["User"],
    }),
    instructorResetPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/instructor-reset-password`,
        method: "POST",
        body: data
      }),
      invalidatesTags: ["User"],
    }),
    getUserView: builder.query({
      query: (username) => { console.log('viewo'); return ({
        url: `${USERS_URL}/view/${username}`,
        method: "GET"
      })},
      providesTags: ["User"],
    }),
    promoteAdmin: builder.mutation({
      query: (data: { username: string; isAdmin: boolean }) => ({
        url: `${USERS_URL}/change-admin-status`,
        method: "POST",
        body: data
      }),
      invalidatesTags: ["User"]
    })
  })
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useGetUserProfileInfoQuery,
  useResetPasswordMutation,
  useInstructorResetPasswordMutation,
  useGetUserViewQuery,
  usePromoteAdminMutation
} = userApiSlice;
