import { createSlice } from "@reduxjs/toolkit";

const COLOR_KEY = "primaryColor";
const COLOR_SCHEME_KEY = "color scheme";

const getInitialTheme = () => {
  const color = localStorage.getItem(COLOR_KEY);
  const colorScheme = localStorage.getItem(COLOR_SCHEME_KEY) || "auto";
  return {
    primaryColor: color || "#4f55c6",
    colorScheme
  };
};

const themeSlice = createSlice({
  name: "theme",
  initialState: getInitialTheme(),
  reducers: {
    setPrimaryColor: (state, action) => {
      state.primaryColor = action.payload;
      localStorage.setItem(COLOR_KEY, action.payload);
    },
    setColorScheme: (state, action) => {
      state.colorScheme = action.payload;
      localStorage.setItem(COLOR_SCHEME_KEY, action.payload);
    }
  }
});

export const { setPrimaryColor, setColorScheme } = themeSlice.actions;
export default themeSlice.reducer;
