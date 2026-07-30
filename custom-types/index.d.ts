import "socket.io";
import { Classroom } from "../shared/types";

declare module "socket.io" {
  interface Server {
    data: {
      classRooms: Classroom[];
    }
  }
}