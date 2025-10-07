<script>
  import { fade } from 'svelte/transition';
  import { quintOut, expoOut } from 'svelte/easing';

  let { isLoading = false, message = '' } = $props();

  // Check for reduced motion preference
  let prefersReducedMotion = $state(false);

  if (typeof window !== 'undefined') {
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
</script>

{#if isLoading}
  <!-- Fullscreen Overlay with Backdrop Blur -->
  <div
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/95 backdrop-blur-md"
    transition:fade={{ duration: prefersReducedMotion ? 150 : 300, easing: quintOut }}
    role="status"
    aria-live="polite"
    aria-label="Loading content"
  >
    <!-- Material Design Geometric Loader -->
    <div class="relative flex flex-col items-center gap-8">

      <!-- Animated Logo Container -->
      <div class="relative w-40 h-40" aria-hidden="true">

        <!-- Rotating Glow Ring -->
        <div class="absolute inset-0 animate-spin-slow">
          <div class="absolute inset-0 rounded-full border-2 border-[#BF953F]/30 border-t-[#FCF6BA] border-r-[#B38728]/50"></div>
        </div>

        <!-- Counter-rotating Secondary Ring -->
        <div class="absolute inset-2 animate-spin-reverse">
          <div class="absolute inset-0 rounded-full border border-[#B38728]/20 border-b-[#BF953F]/40"></div>
        </div>

        <!-- Pulsing Logo with Glow -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="relative animate-pulse-scale">
            <!-- Glow Effect Background -->
            <div class="absolute inset-0 rounded-full bg-[#BF953F]/20 blur-2xl animate-pulse-glow"></div>

            <!-- Logo Image -->
            <img
              src="/logo.png"
              alt="RGBUNION"
              class="relative z-10 h-28 w-28 object-contain"
              style="filter: drop-shadow(0 0 20px rgba(191, 149, 63, 0.6)) drop-shadow(0 0 40px rgba(191, 149, 63, 0.3));"
              loading="eager"
              fetchpriority="high"
              decoding="async"
            />
          </div>
        </div>

        <!-- Orbiting Particles -->
        <div class="absolute inset-0 animate-spin-orbital">
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#FCF6BA] shadow-lg shadow-[#FCF6BA]/60"></div>
        </div>
        <div class="absolute inset-0 animate-spin-orbital-reverse" style="animation-delay: 0.5s;">
          <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#BF953F] shadow-lg shadow-[#BF953F]/60"></div>
        </div>
        <div class="absolute inset-0 animate-spin-orbital" style="animation-delay: 1s;">
          <div class="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#B38728] shadow-lg shadow-[#B38728]/50"></div>
        </div>

        <!-- Shimmer Sweep Effect -->
        <div class="absolute inset-0 overflow-hidden rounded-full opacity-50">
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-[#FCF6BA]/30 to-transparent animate-shimmer"></div>
        </div>
      </div>

      <!-- Loading Text -->
      <div class="flex flex-col items-center gap-2">
        <p class="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] animate-pulse font-cinzel">
          Loading
        </p>

        {#if message}
          <p
            class="text-sm text-slate-400 max-w-xs text-center"
            transition:fade={{ duration: 200 }}
          >
            {message}
          </p>
        {/if}
      </div>

      <!-- Subtle Progress Indicator Dots -->
      <div class="flex gap-2" aria-hidden="true">
        <div class="w-2 h-2 rounded-full bg-[#BF953F] animate-bounce-dot" style="animation-delay: 0s;"></div>
        <div class="w-2 h-2 rounded-full bg-[#FCF6BA] animate-bounce-dot" style="animation-delay: 0.15s;"></div>
        <div class="w-2 h-2 rounded-full bg-[#B38728] animate-bounce-dot" style="animation-delay: 0.3s;"></div>
      </div>
    </div>

    <!-- Accessible Loading Text for Screen Readers -->
    <span class="sr-only">Loading content, please wait</span>
  </div>
{/if}

<style>
  /* Rotating Animations */
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes spin-reverse {
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
  }

  @keyframes spin-orbital {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes spin-orbital-reverse {
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
  }

  /* Pulsing Animations */
  @keyframes pulse-opacity {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  @keyframes pulse-scale {
    0%, 100% {
      transform: scale(1);
      opacity: 0.6;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.9;
    }
  }

  @keyframes pulse-glow {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(1.15);
    }
  }

  /* Shimmer Effect */
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
  }

  /* Bouncing Dots */
  @keyframes bounce-dot {
    0%, 80%, 100% {
      transform: translateY(0);
      opacity: 0.5;
    }
    40% {
      transform: translateY(-8px);
      opacity: 1;
    }
  }

  /* Apply Animations */
  .animate-spin-slow {
    animation: spin-slow 8s linear infinite;
  }

  .animate-spin-reverse {
    animation: spin-reverse 6s linear infinite;
  }

  .animate-spin-orbital {
    animation: spin-orbital 3s linear infinite;
  }

  .animate-spin-orbital-reverse {
    animation: spin-orbital-reverse 4s linear infinite;
  }

  .animate-pulse-opacity {
    animation: pulse-opacity 2s ease-in-out infinite;
  }

  .animate-pulse-scale {
    animation: pulse-scale 2s ease-in-out infinite;
  }

  .animate-pulse-glow {
    animation: pulse-glow 2.5s ease-in-out infinite;
  }

  .animate-shimmer {
    animation: shimmer 2.5s ease-in-out infinite;
  }

  .animate-bounce-dot {
    animation: bounce-dot 1.4s ease-in-out infinite;
  }

  /* Reduced Motion Support */
  @media (prefers-reduced-motion: reduce) {
    .animate-spin-slow,
    .animate-spin-reverse,
    .animate-spin-orbital,
    .animate-spin-orbital-reverse,
    .animate-pulse-opacity,
    .animate-pulse-scale,
    .animate-pulse-glow,
    .animate-shimmer,
    .animate-bounce-dot {
      animation: none;
    }

    /* Show simple static loader for reduced motion */
    .animate-pulse-opacity,
    .animate-pulse-scale,
    .animate-pulse-glow {
      opacity: 0.8;
    }
  }

  /* Screen Reader Only */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>
