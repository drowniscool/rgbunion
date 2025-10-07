import { writable } from 'svelte/store';

// Store for global loading state
const createLoadingStore = () => {
  const { subscribe, set, update } = writable({
    isLoading: false,
    message: '',
    progress: 0, // 0-100 for progress bar (optional)
  });

  return {
    subscribe,

    // Start loading with optional message
    start: (message = '') => {
      set({ isLoading: true, message, progress: 0 });
    },

    // Update loading message
    setMessage: (message) => {
      update(state => ({ ...state, message }));
    },

    // Update progress (0-100)
    setProgress: (progress) => {
      update(state => ({ ...state, progress: Math.min(100, Math.max(0, progress)) }));
    },

    // Stop loading and clear state
    stop: () => {
      set({ isLoading: false, message: '', progress: 0 });
    },

    // Reset state
    reset: () => {
      set({ isLoading: false, message: '', progress: 0 });
    },
  };
};

export const loading = createLoadingStore();
