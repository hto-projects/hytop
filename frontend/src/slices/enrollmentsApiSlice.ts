import { CONFIRM_ENROLLMENT, COURSE, COURSE_PARTICIPANTS, COURSES, CREATE_COURSE_OFFERING, ENROLL_ME, ENROLL_SOMEONE, ENROLLMENTS_URL, UPDATE_ENROLLMENT } from "../../../shared/enrollmentApiPaths";
import { apiSlice } from "./apiSlice";

export const enrollmentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCourseOffering: builder.mutation({
      query: (data) => ({
        url: `${ENROLLMENTS_URL}/${CREATE_COURSE_OFFERING}`,
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Enrollment"]
    }),
    enrollMe: builder.mutation({
      query: (data) => ({
        url: `${ENROLLMENTS_URL}/${ENROLL_ME}`,
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Enrollment"]
    }),
    enrollSomeone: builder.mutation({
      query: (data) => ({
        url: `${ENROLLMENTS_URL}/${ENROLL_SOMEONE}`,
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Enrollment"]
    }),
    confirmEnrollment: builder.mutation({
      query: (data) => ({
        url: `${ENROLLMENTS_URL}/${CONFIRM_ENROLLMENT}`,
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Enrollment"]
    }),
    updateEnrollment: builder.mutation({
      query: (data) => ({
        url: `${ENROLLMENTS_URL}/${UPDATE_ENROLLMENT}`,
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Enrollment"]
    }),
    getCourses: builder.query({
      query: () => ({
        url: `${ENROLLMENTS_URL}/${COURSES}`,
        method: "GET"
      }),
      providesTags: ["Enrollment"]
    }),
    getCourseOffering: builder.query({
      query: (offeringId) => ({
        url: `${ENROLLMENTS_URL}/${COURSE}/${offeringId}`,
        method: "GET"
      }),
      providesTags: ["Enrollment"]
    }),
    getCourseParticipants: builder.query({
      query: (offeringId) => ({
        url: `${ENROLLMENTS_URL}/${COURSE_PARTICIPANTS}/${offeringId}`,
        method: "GET"
      }),
      providesTags: ["Enrollment"]
    })
  })
});

export const {
  useCreateCourseOfferingMutation,
  useEnrollMeMutation,
  useEnrollSomeoneMutation,
  useConfirmEnrollmentMutation,
  useUpdateEnrollmentMutation,
  useGetCoursesQuery,
  useGetCourseOfferingQuery,
  useGetCourseParticipantsQuery
} = enrollmentsApiSlice;
