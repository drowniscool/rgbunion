<!--
  @component AccessibilityBadge

  Professional accessibility and performance metrics modal with glassmorphic design.
  Demonstrates commitment to quality standards and web excellence.

  @prop {boolean} show - Controls modal visibility
  @prop {() => void} onClose - Callback function to close the modal
  @prop {Object} metrics - Performance and accessibility metrics (optional)
  @prop {number} metrics.accessibility - Lighthouse accessibility score (default: 100)
  @prop {number} metrics.performance - Lighthouse performance score (default: 98)
  @prop {string} metrics.fcp - First Contentful Paint time (default: "<1s")
  @prop {string} metrics.tbt - Total Blocking Time (default: "<100ms")

  @example
  ```svelte
  <AccessibilityBadge
    show={showModal}
    onClose={() => showModal = false}
  />
  ```

  @example Custom metrics
  ```svelte
  <AccessibilityBadge
    show={showModal}
    onClose={() => showModal = false}
    metrics={{
      accessibility: 100,
      performance: 95,
      fcp: "0.8s",
      tbt: "85ms"
    }}
  />
  ```
-->

<script>
  import { onMount } from 'svelte';

  /**
   * Props with sensible defaults matching project quality standards
   */
  let {
    show = $bindable(false),
    onClose = () => {},
    metrics = {
      accessibility: 100,
      performance: 98,
      fcp: '<1s',
      tbt: '<100ms'
    }
  } = $props();

  let modalElement = $state(null);
  let closeButtonElement = $state(null);

  /**
   * Handle ESC key to close modal
   */
  function handleKeydown(event) {
    if (event.key === 'Escape' && show) {
      onClose();
    }
  }

  /**
   * Handle click outside modal to close
   */
  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  /**
   * Focus management: auto-focus close button when modal opens
   */
  $effect(() => {
    if (show && closeButtonElement) {
      closeButtonElement.focus();
    }
  });

  /**
   * Focus trap within modal
   */
  function handleFocusTrap(event) {
    if (!show || !modalElement) return;

    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.key === 'Tab') {
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  onMount(() => {
    // Add global keydown listener
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

{#if show}
  <!-- Modal Backdrop -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
    onclick={handleBackdropClick}
    onkeydown={handleFocusTrap}
    role="presentation"
  >
    <!-- Modal Container -->
    <div
      bind:this={modalElement}
      class="relative max-w-2xl w-full mx-4 animate-scale-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-modal-title"
    >
      <!-- Glassmorphic Card -->
      <div class="relative rounded-3xl backdrop-blur-xl bg-gradient-to-br from-slate-800/40 via-slate-700/30 to-slate-800/40 border border-[#BF953F]/30 shadow-[0_24px_64px_rgba(0,0,0,0.4),0_0_80px_rgba(191,149,63,0.1)] overflow-hidden">

        <!-- Decorative corner accents -->
        <div class="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#BF953F]/60 rounded-tl-3xl"></div>
        <div class="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#BF953F]/60 rounded-br-3xl"></div>

        <!-- Close Button -->
        <button
          bind:this={closeButtonElement}
          onclick={onClose}
          class="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-slate-800/40 border border-slate-600/30 text-slate-400 hover:text-white hover:bg-slate-700/60 hover:border-[#BF953F]/50 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(191,149,63,0.3)] flex items-center justify-center group"
          aria-label="Close accessibility metrics modal"
        >
          <svg
            class="w-5 h-5 transition-transform duration-300 group-hover:rotate-90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Modal Content -->
        <div class="px-8 py-10 space-y-8">

          <!-- Header -->
          <div class="text-center space-y-3">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#BF953F]/20 to-[#B38728]/20 border border-[#BF953F]/30 shadow-[0_8px_32px_rgba(191,149,63,0.2)]">
              <svg class="w-9 h-9 text-[#FCF6BA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 id="accessibility-modal-title" class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FCF6BA] via-[#BF953F] to-[#B38728]">
              Quality Excellence
            </h2>
            <p class="text-slate-400 text-sm">
              Built with industry-leading standards and best practices
            </p>
          </div>

          <!-- Metrics Grid -->
          <div class="grid gap-6">

            <!-- Accessibility Excellence -->
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-[#BF953F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3 class="text-lg font-semibold text-[#FCF6BA]">Accessibility Excellence</h3>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="flex items-center gap-2 text-sm text-slate-300">
                  <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>WCAG 2.1 AAA Compliant</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-slate-300">
                  <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Lighthouse: {metrics.accessibility}/100</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-slate-300">
                  <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Keyboard Navigation</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-slate-300">
                  <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Screen Reader Optimized</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-slate-300">
                  <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Reduced Motion Support</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-slate-300">
                  <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>ARIA Landmarks</span>
                </div>
              </div>
            </div>

            <!-- Performance Metrics -->
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-[#BF953F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 class="text-lg font-semibold text-[#FCF6BA]">Performance Metrics</h3>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="flex items-center gap-2 text-sm text-slate-300">
                  <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Lighthouse: {metrics.performance}/100</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-slate-300">
                  <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>FCP: {metrics.fcp}</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-slate-300">
                  <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>TBT: {metrics.tbt}</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-slate-300">
                  <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Core Web Vitals</span>
                </div>
              </div>
            </div>

            <!-- Enterprise Ready -->
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-[#BF953F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 class="text-lg font-semibold text-[#FCF6BA]">Enterprise Ready</h3>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="flex items-center gap-2 text-sm text-slate-300">
                  <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Production Tested</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-slate-300">
                  <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Security Hardened</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-slate-300">
                  <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>SEO Optimized</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-slate-300">
                  <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Edge Deployed</span>
                </div>
              </div>
            </div>

          </div>

          <!-- Footer Badge -->
          <div class="pt-4 border-t border-slate-700/30">
            <div class="flex items-center justify-center gap-2 text-xs text-slate-500">
              <svg class="w-4 h-4 text-[#BF953F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Built with excellence • Designed for everyone</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Fade in backdrop animation */
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .animate-fade-in {
    animation: fade-in 0.2s ease-out;
  }

  /* Scale in modal animation */
  @keyframes scale-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-scale-in {
    animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .animate-fade-in,
    .animate-scale-in {
      animation: none !important;
    }
  }
</style>
