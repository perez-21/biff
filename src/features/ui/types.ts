export type Theme = "light" | "dark" | "system";

export interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
}

export interface UIStore extends UIState {
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}
