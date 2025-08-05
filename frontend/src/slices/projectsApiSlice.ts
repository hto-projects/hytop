import { apiSlice } from "./apiSlice";
const PROJECTS_URL = "/api/projects";

export const projectsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProject: builder.mutation({
      query: (data) => ({
        url: `${PROJECTS_URL}/create`,
        method: "POST",
        body: data
      })
    }),
    updateProject: builder.mutation({
      query: (data) => ({
        url: `${PROJECTS_URL}/update`,
        method: "POST",
        body: data
      })
    }),
    findProjectById: builder.query({
      query: (projectId) => ({
        url: `${PROJECTS_URL}/find/${projectId}`,
        method: "GET"
      })
    }),
    changeProjectName: builder.mutation({
      query: (data) => ({
        url: `${PROJECTS_URL}/change-name/${data.projectId}`,
        method: "POST",
        body: data
      })
    }),
    getProjectDescription: builder.query({
      query: (projectId) => ({
        url: `${PROJECTS_URL}/get-description/${projectId}`,
        method: "GET"
      })
    }),
    changeProjectDescription: builder.mutation({
      query: (data) => ({
        url: `${PROJECTS_URL}/change-description/${data.projectId}`,
        method: "POST",
        body: data
      })
    }),
    copyProject: builder.mutation({
      query: (data) => ({
        url: `${PROJECTS_URL}/copy`,
        method: "POST",
        body: data
      })
    }),
    getProject: builder.query({
      query: (projectName) => ({
        url: `${PROJECTS_URL}/get/${projectName}`,
        method: "GET"
      })
    }),
    getProjectId: builder.query({
      query: (projectId) => ({
        url: `${PROJECTS_URL}/get-id/${projectId}`,
        method: "GET"
      })
    }),
    checkOwnership: builder.query({
      query: (projectName) => ({
        url: `${PROJECTS_URL}/check-ownership/${projectName}`,
        method: "GET"
      })
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
  useGetProjectDescriptionQuery
} = projectsApiSlice;
