import { apiSlice } from "./apiSlice";
const PROJECTS_URL = "/api/projects";

export const projectsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProject: builder.mutation({
      query: (data) => ({
        url: `${PROJECTS_URL}/create`,
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Project", "ProjectFiles"]
    }),
    updateProject: builder.mutation({
      query: (data) => ({
        url: `${PROJECTS_URL}/update`,
        method: "POST",
        body: data
      }),
      invalidatesTags: (arg) => [{ type: "ProjectFiles", id: arg.projectName }]
    }),
    findProjectById: builder.query({
      query: (projectId) => ({
        url: `${PROJECTS_URL}/find/${projectId}`,
        method: "GET"
      }),
      providesTags: (arg) => [{ type: "Project", id: arg }]
    }),
    changeProjectName: builder.mutation({
      query: (data) => ({
        url: `${PROJECTS_URL}/change-name/${data.projectId}`,
        method: "POST",
        body: data
      }),
      invalidatesTags: (arg) => [{ type: "Project", id: arg.projectId }]
    }),
    getProjectDescription: builder.query({
      query: (projectId) => ({
        url: `${PROJECTS_URL}/get-description/${projectId}`,
        method: "GET"
      }),
      providesTags: (arg) => [{ type: "Project", id: arg }]
    }),
    changeProjectDescription: builder.mutation({
      query: (data) => ({
        url: `${PROJECTS_URL}/change-description/${data.projectId}`,
        method: "POST",
        body: data
      }),
      invalidatesTags: (arg) => [{ type: "Project", id: arg.projectId }]
    }),
    copyProject: builder.mutation({
      query: (data) => ({
        url: `${PROJECTS_URL}/copy`,
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Project", "ProjectFiles"]
    }),
    getProject: builder.query({
      query: (projectName) => ({
        url: `${PROJECTS_URL}/get/${projectName}`,
        method: "GET"
      }),
      providesTags: (arg) => [
        { type: "Project", id: arg },
        { type: "ProjectFiles", id: arg }
      ]
    }),
    getProjectId: builder.query({
      query: (projectId) => ({
        url: `${PROJECTS_URL}/get-id/${projectId}`,
        method: "GET"
      }),
      providesTags: (arg) => [{ type: "Project", id: arg }]
    }),
    checkOwnership: builder.query({
      query: (projectName) => ({
        url: `${PROJECTS_URL}/check-ownership/${projectName}`,
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0"
        }
      }),
      providesTags: (result, error, arg) => [
        { type: "ProjectOwnership", id: arg }
      ],
      keepUnusedDataFor: 10
    })
  })
});

export const {
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useCopyProjectMutation,
  useGetProjectQuery,
  useCheckOwnershipQuery,
  useFindProjectByIdQuery,
  useChangeProjectDescriptionMutation,
  useChangeProjectNameMutation,
  useGetProjectIdQuery,
  useGetProjectDescriptionQuery,
  util
} = projectsApiSlice;
