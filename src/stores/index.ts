import { create } from 'zustand';

interface AuthStore {
  user: any | null;
  isLoading: boolean;
  setUser: (user: any) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null }),
}));

interface UIStore {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  theme: 'system',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setTheme: (theme) => set({ theme }),
}));

interface FilterStore {
  selectedStatus?: string;
  selectedStage?: string;
  searchQuery: string;
  dateRange?: { from: Date; to: Date };
  setSelectedStatus: (status?: string) => void;
  setSelectedStage: (stage?: string) => void;
  setSearchQuery: (query: string) => void;
  setDateRange: (range?: { from: Date; to: Date }) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  searchQuery: '',
  setSelectedStatus: (status) => set({ selectedStatus: status }),
  setSelectedStage: (stage) => set({ selectedStage: stage }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setDateRange: (dateRange) => set({ dateRange }),
  reset: () => set({
    selectedStatus: undefined,
    selectedStage: undefined,
    searchQuery: '',
    dateRange: undefined,
  }),
}));
