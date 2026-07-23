import { Transition, Notification } from "@mantine/core";

type ClassroomNotificationProps = {
  mounted: boolean;
  title: string;
  message: string;
  onClose: () => void;
};

const ClassroomNotification = ({mounted, onClose, title, message}: ClassroomNotificationProps) => {
  return (
    <Transition 
      mounted={mounted} 
      duration={200} 
      timingFunction="ease-in"
      transition={"slide-left"}
    >
      {(TransitionStyle) => (
        <div
          style={{
            ...TransitionStyle,
            position: "absolute",
            right: "10vh",
            bottom: "10vh",
            width: "300px"
          }}
        >
          <Notification 
            title={title}
            onClose={onClose}
          >
            {message}
          </Notification>
        </div>
      )}
    </Transition>
  );
};

export default ClassroomNotification;