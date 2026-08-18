import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Title,
  Button,
  Group,
  Box,
  useComputedColorScheme
} from "@mantine/core";
import {
  Form,
  PasswordInputForm,
  TextInputForm,
  passwordValidation,
  emailValidation,
  nameValidation
} from "../Interface/Form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../Interface/Loader";
import {
  useUpdateUserMutation,
  useGetUserProfileInfoQuery,
  useLogoutMutation
} from "../../slices/usersApiSlice";
import { setCredentials, logout } from "../../slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import ProjectList from "./ProjectList";
import { ICourseOffering, UserTypeForCourse } from "../../../../shared/types";

const ProfileScreen = () => {
  const { userInfo } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = userInfo?._id || userInfo?.userId;

  const [logoutApiCall] = useLogoutMutation();
  const [updateProfile, { isLoading }] = useUpdateUserMutation();

  const {
    data: userProfileInfo,
    isLoading: projectsLoading,
    error: projectsError
  } = useGetUserProfileInfoQuery(null);
  console.log(userProfileInfo);

  const handleLogout = async () => {
    try {
      await logoutApiCall(undefined).unwrap();
    } catch (err) {}

    dispatch(logout(null));
    navigate("/#signin");
  };

  useEffect(() => {
    if (projectsError && 'status' in projectsError && projectsError?.status === 401) {
      handleLogout();
    }
  }, [projectsError]);

  const [email, setEmail] = useState(userInfo ? userInfo.email : "");
  const [name, setName] = useState(userInfo ? userInfo.name : "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const theColorScheme = useComputedColorScheme("light");

  function confirmPasswordHandler(
    password: string,
    confirmPassword: string
  ): boolean {
    if (password === confirmPassword) return true;
    toast.error("Passwords do not match");
    return false;
  }

  async function onSubmit({ fulfilled, event }) {
    event.preventDefault();
    if (!fulfilled) {
      return;
    }

    try {
      const updateData: any = { id: userId, name, email };
      if (password) updateData.password = password;
      const res = await updateProfile(updateData).unwrap();
      dispatch(setCredentials(res));
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(
        err?.data?.message || err.error || "Failed to update profile"
      );
    }
  }

  const courseToEl: (c: ICourseOffering & { userType: UserTypeForCourse }) => JSX.Element = (c) => {
    if (c.userType === UserTypeForCourse.Instructor) {
      return <Link style={{background: "black", color: "white", fontWeight: "bold", padding: "5px"}} to={`/vc/${c.offeringId}`}>{c.courseName}</Link>
    } else if (c.userType === UserTypeForCourse.Student) {
      return <span>{c.courseName}</span>
    } else {
      return <span></span>
    }
  }

  return (
    <Box
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: theColorScheme === "dark" ? "#181A1B" : undefined,
        color: theColorScheme === "dark" ? "#fff" : undefined,
        display: "flex",
        justifyContent: "center",
        overflow: "auto"
      }}
    >
      <Container size={1200} my={40}>
        <Paper
          shadow="md"
          p={48}
          radius="md"
          withBorder
          style={{
            width: "100%",
            display: "flex",
            gap: 48,
            background: theColorScheme === "dark" ? "#23272A" : undefined,
            color: theColorScheme === "dark" ? "#fff" : undefined
          }}
        >
          <div style={{ flex: 1, minWidth: 340 }}>
            <Title order={2} ta="center" mb="md">
              {userProfileInfo && userProfileInfo.hasTemporaryPassword ? <span style={{color: "red"}}>RESET YOUR PASSWORD!</span> : `Account`}
            </Title>

            <Form
              colorScheme={theColorScheme}
              customConditions={() => {
                return confirmPasswordHandler(password, confirmPassword);
              }}
              onSubmit={onSubmit}
            >
              <TextInputForm
                label="Name"
                value={name}
                setValue={setName}
                validation={nameValidation}
                required
                hideFulfilled
              ></TextInputForm>
              <TextInputForm
                label="Email"
                value={email}
                setValue={setEmail}
                validation={emailValidation}
                required
                showAfter
                hideFulfilled
              />
              <PasswordInputForm
                label="Password"
                value={password}
                setValue={setPassword}
                validation={passwordValidation}
                required
                showAfter
                hideCompleted
              />
              <PasswordInputForm
                label="Confirm Password"
                value={confirmPassword}
                setValue={setConfirmPassword}
                required
              />
              <Group mt="md" justify="space-between">
                <Button type="submit" size="md" loading={isLoading}>
                  Update
                </Button>
                <Button
                  variant="outline"
                  color="red"
                  size="md"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </Group>
              {isLoading && (
                <Box mt="md">
                  <Loader />
                </Box>
              )}
            </Form>
          </div>

          <div
            style={{
              flex: 2,
              minWidth: 700,
              borderLeft:
                theColorScheme === "dark" ? "1px solid #333" : "1px solid #eee",
              paddingLeft: 48
            }}
          >
            <Title order={2} mb={16} ta="left">
              Your Projects
            </Title>
            <ProjectList
              projects={userProfileInfo ? userProfileInfo.projects : []}
              loading={projectsLoading}
              error={projectsError}
            />
          </div>
        </Paper>
        <Paper>
          <Title>Your Courses</Title>
          <div style={{display: "flex", gap: "5px"}}>{userProfileInfo && userProfileInfo.courses.map(courseToEl)}</div>
          <br />
          <p><Link to="/vcs" style={{color: "white", background: "black"}}>View All Courses</Link></p>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProfileScreen;
