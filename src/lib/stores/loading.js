import { writable } from 'svelte/store';

// Route complexity mapping for intelligent progress simulation
const ROUTE_COMPLEXITY = {
  '/': { duration: 800, stages: [30, 60, 90, 100] }, // Landing page
  '/login': { duration: 600, stages: [40, 70, 95, 100] }, // Fast auth page
  '/logout': { duration: 400, stages: [50, 85, 100] }, // Quick logout
  '/dashboard': { duration: 1000, stages: [25, 50, 75, 95, 100] }, // User data loading
  '/admin': { duration: 1200, stages: [20, 40, 60, 80, 95, 100] }, // Complex admin panel
  '/shop': { duration: 1000, stages: [25, 50, 75, 95, 100] }, // Product data loading
  '/terms': { duration: 700, stages: [35, 65, 90, 100] }, // Static content
  'default': { duration: 800, stages: [30, 60, 90, 100] }, // Fallback for unknown routes
};

// Store for global loading state
const createLoadingStore = () => {
  const { subscribe, set, update } = writable({
    isLoading: false,
    message: '',
    progress: 0, // 0-100 for progress bar
  });

  let progressInterval = null;
  let currentStage = 0;

  return {
    subscribe,

    // Start loading with optional message and route-based progress simulation
    start: (message = '', targetRoute = null) => {
      // Clear any existing progress interval
      if (progressInterval) {
        clearInterval(progressInterval);
      }

      set({ isLoading: true, message, progress: 0 });
      currentStage = 0;

      // Get route complexity or use default
      const routeConfig = ROUTE_COMPLEXITY[targetRoute] || ROUTE_COMPLEXITY['default'];
      const { duration, stages } = routeConfig;

      // Calculate interval timing based on number of stages
      const intervalTime = duration / stages.length;

      // Simulate progress through stages
      progressInterval = setInterval(() => {
        if (currentStage < stages.length) {
          update(state => ({
            ...state,
            progress: stages[currentStage]
          }));
          currentStage++;
        } else {
          // Keep at max stage until stopped
          clearInterval(progressInterval);
        }
      }, intervalTime);
    },

    // Start loading with custom progress stages (for manual control)
    startCustom: (message = '', stages = [30, 60, 90, 100], duration = 800) => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }

      set({ isLoading: true, message, progress: 0 });
      currentStage = 0;

      const intervalTime = duration / stages.length;

      progressInterval = setInterval(() => {
        if (currentStage < stages.length) {
          update(state => ({
            ...state,
            progress: stages[currentStage]
          }));
          currentStage++;
        } else {
          clearInterval(progressInterval);
        }
      }, intervalTime);
    },

    // Update loading message without affecting progress
    setMessage: (message) => {
      update(state => ({ ...state, message }));
    },

    // Manually set progress (0-100) - stops automatic simulation
    setProgress: (progress) => {
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
      update(state => ({ ...state, progress: Math.min(100, Math.max(0, progress)) }));
    },

    // Complete loading immediately (jump to 100% then stop)
    complete: () => {
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
      update(state => ({ ...state, progress: 100 }));
      // Small delay before hiding to show completion
      setTimeout(() => {
        set({ isLoading: false, message: '', progress: 0 });
      }, 200);
    },

    // Stop loading and clear state
    stop: () => {
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
      set({ isLoading: false, message: '', progress: 0 });
    },

    // Reset state
    reset: () => {
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
      set({ isLoading: false, message: '', progress: 0 });
    },
  };
};

export const loading = createLoadingStore();
