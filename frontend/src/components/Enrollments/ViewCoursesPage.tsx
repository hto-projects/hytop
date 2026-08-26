import ViewCourses from "./ViewCourses"
import { useGetCoursesQuery, useEnrollMeMutation, useEnrollSomeoneMutation } from "../../slices/enrollmentsApiSlice";
import { Loader } from "@mantine/core";
import { toast } from "react-toastify";

const ViewCoursesPage = () => {
  const {
    data: courses,
    isLoading: coursesLoading,
    error: coursesError
  } = useGetCoursesQuery(null);

  const [enrollMe, { isLoading: enrollMeIsLoading }] = useEnrollMeMutation();
  const [enrollSomeone, { isLoading: enrollSomeoneIsLoading }] = useEnrollSomeoneMutation();

  const handleEnrollMe = async (offeringId) => {
    try {
      const res = await enrollMe({ offeringId }).unwrap();
      toast.success(`Enrollment submit! ${res.message}`);
    } catch (err: any) {
      toast.error(
        err?.data?.message || err.error || "Failed to enroll :("
      );
    }
  }

  const handleEnrollSomeone = async (username, offeringId, forInstructor) => {
    try {
      const res = await enrollSomeone({ username, offeringId, forInstructor }).unwrap();
      toast.success(`Enrollment submitted for ${username}! ${res.message}`);
    } catch (err: any) {
      toast.error(
        err?.data?.message || err.error || "Failed to submit enrollment :("
      );
    }
  }

  if (coursesLoading || enrollMeIsLoading || enrollSomeoneIsLoading) {
    return <Loader />;
  }

  if (coursesError) {
    return <p>{`Error: ${coursesError}`}</p>
  }

  return <ViewCourses courses={courses} onEnrollMe={handleEnrollMe} onEnrollSomeone={handleEnrollSomeone} />;
}

export default ViewCoursesPage;
