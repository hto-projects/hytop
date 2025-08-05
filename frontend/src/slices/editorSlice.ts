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
  userIsOwner?: boolean;
  isLoading?: boolean;
  vimMode: boolean;
  lastClosedTab?: string | null;
  projectName?: string;
  projectDescription?: string;
  currentProjectName?: string;
}

const getInitialMonacoSettings = () => {
  let monacoTheme = localStorage.getItem("monacoTheme");
  if (!monacoTheme) {
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    monacoTheme = prefersDark ? "vs-dark" : "vs-light";
  }
  return {
    monacoTheme,
    monacoFont: localStorage.getItem("monacoFont") || "Fira Mono, monospace",
    monacoFontSize: Number(localStorage.getItem("monacoFontSize")) || 14,
    monacoWordWrap:
      (localStorage.getItem("monacoWordWrap") as "on" | "off") || "off",
    vimMode: localStorage.getItem("vimMode") === "true"
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
  ...getInitialMonacoSettings(),
  userIsOwner: false,
  isLoading: false,
  lastClosedTab: null,
  projectName: "",
  projectDescription: "",
  currentProjectName: undefined
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
      if (!state.paneState.open.editor) {
        state.paneState.open.editor = true;
        if (state.lastClosedTab && state.tabs.includes(state.lastClosedTab)) {
          state.activeTab = state.lastClosedTab;
          state.selectedFile = state.lastClosedTab;
          state.lastClosedTab = null;
        }
      }
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
            state.lastClosedTab = fileName;
            state.paneState.open.editor = false;
          }
        }
      }
      if (state.selectedFile === fileName) {
        if (state.tabs.length > 0) {
          state.selectedFile = state.tabs[0];
        } else {
          state.selectedFile = null;
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
    },
    setVimMode(state, action: PayloadAction<boolean>) {
      state.vimMode = action.payload;
      localStorage.setItem("vimMode", String(action.payload));
    },
    setUserIsOwner(state, action: PayloadAction<boolean>) {
      state.userIsOwner = action.payload;
    },
    setEditorIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    deleteFile(state, action: PayloadAction<string>) {
      const fileName = action.payload;
      state.projectFiles = state.projectFiles.filter(
        (f) => f.fileName !== fileName
      );
      state.tabs = state.tabs.filter((tab) => tab !== fileName);
      if (state.activeTab === fileName) {
        state.activeTab = state.tabs.length > 0 ? state.tabs[0] : null;
        state.selectedFile = state.activeTab;
      }
      if (state.selectedFile === fileName) {
        state.selectedFile = state.tabs.length > 0 ? state.tabs[0] : null;
      }
    },
    setProjectName(state, action: PayloadAction<string>) {
      state.projectName = action.payload;
    },
    setProjectDescription(state, action: PayloadAction<string>) {
      state.projectDescription = action.payload;
    },
    setCurrentProjectName(state, action: PayloadAction<string>) {
      state.currentProjectName = action.payload;
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
  setMonacoWordWrap,
  setVimMode,
  setUserIsOwner,
  setEditorIsLoading,
  deleteFile,
  setProjectName,
  setProjectDescription,
  setCurrentProjectName
} = editorSlice.actions;
export default editorSlice.reducer;
