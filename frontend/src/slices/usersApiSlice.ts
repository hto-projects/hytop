import { apiSlice } from "./apiSlice";
const USERS_URL = "/api/users";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data
      })
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST"
      })
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data
      })
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data
      })
    }),
    getUserProjects: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}/projects`,
        method: "GET"
      })
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/reset-password`,
        method: "POST",
        body: data
      })
    }),
    getUserView: builder.query({
      query: (username) => ({
        url: `${USERS_URL}/view/${username}`,
        method: "GET"
      })
    }),
    promoteAdmin: builder.mutation({
      query: (data: { username: string; isAdmin: boolean }) => ({
        url: `${USERS_URL}/change-admin-status`,
        method: "POST",
        body: data
      })
    })
  })
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useGetUserProjectsQuery,
  useResetPasswordMutation,
  useGetUserViewQuery,
  usePromoteAdminMutation
} = userApiSlice;
