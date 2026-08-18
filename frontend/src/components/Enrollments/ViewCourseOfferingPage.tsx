import { Loader } from "@mantine/core";
import { useConfirmEnrollmentMutation, useEnrollSomeoneMutation, useGetCourseOfferingQuery, useGetCourseParticipantsQuery, useUpdateEnrollmentMutation } from "../../slices/enrollmentsApiSlice";
import ViewCourseOffering from "./ViewCourseOffering";
import { useParams } from "react-router-dom";
import { useInstructorResetPasswordMutation } from "../../slices/usersApiSlice";
import { toast } from "react-toastify";
import { CourseParticipantStatus } from "../../../../shared/types";

const ViewCourseOfferingPage = () => {
  const { offeringId } = useParams();
  const {
    data: courseInfo,
    isLoading: courseLoading,
    error: courseError
  } = useGetCourseOfferingQuery(offeringId);

  const {
    data: courseParticipants,
    isLoading: participantsLoading,
    error: participantsError
  } = useGetCourseParticipantsQuery(offeringId);

  const [confirmEnrollment, { isLoading: isConfirmLoading }] = useConfirmEnrollmentMutation();
  const [resetPassword, { isLoading: isResetPassLoading }] = useInstructorResetPasswordMutation();
  const [enrollSomeone, { isLoading: isEnrollSomeoneLoading }] = useEnrollSomeoneMutation();
  const [updateEnrollment, { isLoading: isUpdateEnrollmentLoading }] = useUpdateEnrollmentMutation();

  const onConfirmEnr: (userId: string, forInstructor: boolean) => Promise<void> = async (userId, forInstructor) => {
    try {
      const res = await confirmEnrollment({
        userId,
        offeringId: courseInfo.offeringId,
        forInstructor,
      }).unwrap();
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const onUpdateEnr: (userId: string, newStatus: CourseParticipantStatus | "delete") => Promise<void> = async (userId, newStatus) => {
    try {
      const res = await updateEnrollment({
        userId,
        offeringId: courseInfo.offeringId,
        newStatus,
      }).unwrap();
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const onResetPsw: (userId: string) => Promise<void> = async (userId) => {
    try {
      const res = await resetPassword({
        userId,
      }).unwrap();
      toast.success(res.message);
      alert(`New Temporary Password: ${res.newPassword}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

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

  if (courseLoading || participantsLoading || isConfirmLoading || isResetPassLoading || isEnrollSomeoneLoading || isUpdateEnrollmentLoading) {
    return <Loader />;
  }

  if (courseError || participantsError) {
    return <p>{`Error: ${courseError || participantsError}`}</p>
  }

  return <ViewCourseOffering courseInfo={courseInfo} participants={courseParticipants} onConfirm={onConfirmEnr} onResetPass={onResetPsw} onEnrollSomeone={handleEnrollSomeone} onUpdateEnrollment={onUpdateEnr} />
}

export default ViewCourseOfferingPage;