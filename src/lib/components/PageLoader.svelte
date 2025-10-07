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

      <!-- Animated Geometric Shapes Container -->
      <div class="relative w-32 h-32" aria-hidden="true">

        <!-- Rotating Outer Hexagon -->
        <div class="absolute inset-0 animate-spin-slow">
          <svg viewBox="0 0 100 100" class="w-full h-full">
            <polygon
              points="50,10 90,30 90,70 50,90 10,70 10,30"
              fill="none"
              stroke="url(#goldGradient1)"
              stroke-width="2"
              class="origin-center animate-pulse-opacity"
            />
          </svg>
        </div>

        <!-- Counter-rotating Middle Diamond -->
        <div class="absolute inset-0 flex items-center justify-center animate-spin-reverse">
          <svg viewBox="0 0 60 60" class="w-20 h-20">
            <polygon
              points="30,5 55,30 30,55 5,30"
              fill="none"
              stroke="url(#goldGradient2)"
              stroke-width="2.5"
              class="origin-center"
              style="animation: pulse-opacity 2s ease-in-out infinite 0.3s;"
            />
          </svg>
        </div>

        <!-- Pulsing Inner Circle -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#BF953F]/30 to-[#B38728]/30 backdrop-blur-sm border border-[#BF953F]/50 animate-pulse-scale"></div>
        </div>

        <!-- Orbiting Particles -->
        <div class="absolute inset-0 animate-spin-orbital">
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#FCF6BA] shadow-lg shadow-[#FCF6BA]/50"></div>
        </div>
        <div class="absolute inset-0 animate-spin-orbital-reverse" style="animation-delay: 0.5s;">
          <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#BF953F] shadow-lg shadow-[#BF953F]/50"></div>
        </div>

        <!-- Shimmer Overlay -->
        <div class="absolute inset-0 overflow-hidden rounded-full">
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-[#FCF6BA]/20 to-transparent animate-shimmer"></div>
        </div>

        <!-- SVG Gradients -->
        <svg width="0" height="0" class="absolute">
          <defs>
            <linearGradient id="goldGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#BF953F;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#FCF6BA;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#B38728;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="goldGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#B38728;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#FCF6BA;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#BF953F;stop-opacity:1" />
            </linearGradient>
          </defs>
        </svg>
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
      transform: scale(1.1);
      opacity: 0.8;
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
    .animate-shimmer,
    .animate-bounce-dot {
      animation: none;
    }

    /* Show simple static loader for reduced motion */
    .animate-pulse-opacity,
    .animate-pulse-scale {
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
