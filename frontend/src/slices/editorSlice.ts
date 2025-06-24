import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProjectFile } from "../../../shared/types";

interface PaneState {
  open: { [key: string]: boolean };
  order: string[];
}

interface EditorState {
  paneState: PaneState;
  selectedFile: string | null;
  projectFiles: IProjectFile[];
  projectVersion: number;
  renamingFile: string | null;
  renameValue: string;
  tabs: string[];
  activeTab: string | null;
  monacoTheme: string;
  monacoFont: string;
  monacoFontSize: number;
  monacoWordWrap: "on" | "off";
}

const getInitialMonacoSettings = () => {
  return {
    monacoTheme: localStorage.getItem("monacoTheme") || "vs-light",
    monacoFont: localStorage.getItem("monacoFont") || "Fira Mono, monospace",
    monacoFontSize: Number(localStorage.getItem("monacoFontSize")) || 14,
    monacoWordWrap:
      (localStorage.getItem("monacoWordWrap") as "on" | "off") || "off"
  };
};

const initialState: EditorState = {
  paneState: {
    open: { explorer: true, editor: true, preview: true },
    order: ["explorer", "editor", "preview"]
  },
  selectedFile: null,
  projectFiles: [],
  projectVersion: 0,
  renamingFile: null,
  renameValue: "",
  tabs: [],
  activeTab: null,
  ...getInitialMonacoSettings()
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setPaneState(state, action: PayloadAction<PaneState>) {
      state.paneState = action.payload;
    },
    setSelectedFile(state, action: PayloadAction<string>) {
      state.selectedFile = action.payload;
    },
    setProjectFiles(state, action: PayloadAction<IProjectFile[]>) {
      state.projectFiles = action.payload;
    },
    setProjectVersion(state, action: PayloadAction<number>) {
      state.projectVersion = action.payload;
    },
    setRenameFile(
      state,
      action: PayloadAction<{ oldName: string; newName: string }>
    ) {
      const { oldName, newName } = action.payload;
      const file = state.projectFiles.find((file) => file.fileName === oldName);
      if (file) {
        file.fileName = newName;
      }
      state.tabs = state.tabs.map((tab) => (tab === oldName ? newName : tab));
      if (state.activeTab === oldName) {
        state.activeTab = newName;
        state.selectedFile = newName;
      }
      if (state.selectedFile === oldName) {
        state.selectedFile = newName;
      }
    },
    setRenamingFile(state, action: PayloadAction<string | null>) {
      state.renamingFile = action.payload;
    },
    setRenameValue(state, action: PayloadAction<string>) {
      state.renameValue = action.payload;
    },
    setTabs(state, action: PayloadAction<string[]>) {
      state.tabs = action.payload;
    },
    setActiveTab(state, action: PayloadAction<string | null>) {
      state.activeTab = action.payload;
      state.selectedFile = action.payload;
    },
    openTab(state, action: PayloadAction<string>) {
      const fileName = action.payload;
      if (!state.tabs.includes(fileName)) {
        state.tabs.push(fileName);
      }
      state.activeTab = fileName;
      state.selectedFile = fileName;
    },
    closeTab(state, action: PayloadAction<string>) {
      const fileName = action.payload;
      const hi = state.tabs.indexOf(fileName);
      if (hi !== -1) {
        state.tabs.splice(hi, 1);
        if (state.activeTab === fileName) {
          if (state.tabs.length > 0) {
            state.activeTab = state.tabs[Math.max(0, hi - 1)];
            state.selectedFile = state.activeTab;
          } else {
            state.activeTab = null;
            state.selectedFile = null;
          }
        }
      }
    },
    syncTabsWithFiles(state) {
      const fileNames = state.projectFiles.map((f) => f.fileName);
      state.tabs = state.tabs.filter((tab) => fileNames.includes(tab));
      if (state.activeTab && !fileNames.includes(state.activeTab)) {
        state.activeTab = state.tabs.length > 0 ? state.tabs[0] : null;
        state.selectedFile = state.activeTab;
      }
    },
    setMonacoTheme(state, action: PayloadAction<string>) {
      state.monacoTheme = action.payload;
      localStorage.setItem("monacoTheme", action.payload);
    },
    setMonacoFont(state, action: PayloadAction<string>) {
      state.monacoFont = action.payload;
      localStorage.setItem("monacoFont", action.payload);
    },
    setMonacoFontSize(state, action: PayloadAction<number>) {
      state.monacoFontSize = action.payload;
      localStorage.setItem("monacoFontSize", String(action.payload));
    },
    setMonacoWordWrap(state, action: PayloadAction<"on" | "off">) {
      state.monacoWordWrap = action.payload;
      localStorage.setItem("monacoWordWrap", action.payload);
    }
  }
});

export const {
  setPaneState,
  setSelectedFile,
  setProjectFiles,
  setProjectVersion,
  setRenameFile,
  setRenamingFile,
  setRenameValue,
  setTabs,
  setActiveTab,
  openTab,
  closeTab,
  syncTabsWithFiles,
  setMonacoTheme,
  setMonacoFont,
  setMonacoFontSize,
  setMonacoWordWrap
} = editorSlice.actions;
export default editorSlice.reducer;
