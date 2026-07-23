import { createSlice, PayloadAction, type Draft } from "@reduxjs/toolkit";

const initialState = {
  roomName: "",
  roomId: "",
  isInRoom: false,
  isRoomCreator: false,
};

const roomSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setRoomName: (state, action: PayloadAction<string>) => {
      state.roomName = action.payload;
    },
    
    setRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload;
    },
    
    setIsInRoom: (state, action: PayloadAction<boolean>) => {
      state.isInRoom = action.payload;
    },
    
    setIsRoomCreator: (state, action: PayloadAction<boolean>) => {
      state.isRoomCreator = action.payload;
    },
  }
});

export const { 
  setRoomName, 
  setRoomId, 
  setIsInRoom, 
  setIsRoomCreator,
} = roomSlice.actions;
export default roomSlice.reducer;