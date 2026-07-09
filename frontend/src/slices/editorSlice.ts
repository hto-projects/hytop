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
  tabs: string[];
  activeTab: string | null;
  monacoTheme: string;
  monacoFont: string;
  monacoFontSize: number;
  monacoWordWrap: "on" | "off";
  monacoAutocomplete: boolean;
  userIsOwner?: boolean;
  isLoading?: boolean;
  lastClosedTab?: string | null;
  projectName?: string;
  projectOwnerUserName?: string;
  projectDescription?: string;
  unsavedFiles: { [filename: string]: boolean };
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
    monacoAutocomplete:
      JSON.parse(localStorage.getItem("monacoAutocomplete")) || false
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
  tabs: [],
  activeTab: null,
  ...getInitialMonacoSettings(),
  userIsOwner: false,
  isLoading: false,
  lastClosedTab: null,
  projectName: "",
  projectOwnerUserName: "",
  projectDescription: "",
  unsavedFiles: {}
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
    setTabs(state, action: PayloadAction<string[]>) {
      state.tabs = action.payload;
    },
    setActiveTab(state, action: PayloadAction<string | null>) {
      state.activeTab = action.payload;
      state.selectedFile = action.payload;
    },
    setUnsavedFiles(
      state,
      action: PayloadAction<{ [filename: string]: boolean }>
    ) {
      state.unsavedFiles = action.payload;
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
    setMonacoAutocomplete(state, action: PayloadAction<boolean>) {
      state.monacoAutocomplete = action.payload;
      localStorage.setItem(
        "monacoAutocomplete",
        JSON.stringify(action.payload)
      );
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
    setProjectOwnerUserName(state, action: PayloadAction<string>) {
      state.projectOwnerUserName = action.payload;
    }
  }
});

export const {
  setPaneState,
  setSelectedFile,
  setProjectFiles,
  setProjectVersion,
  setTabs,
  setActiveTab,
  openTab,
  closeTab,
  syncTabsWithFiles,
  setMonacoTheme,
  setMonacoFont,
  setMonacoFontSize,
  setMonacoWordWrap,
  setMonacoAutocomplete,
  setUserIsOwner,
  setEditorIsLoading,
  deleteFile,
  setProjectName,
  setProjectOwnerUserName,
  setProjectDescription,
  setUnsavedFiles
} = editorSlice.actions;
export default editorSlice.reducer;
