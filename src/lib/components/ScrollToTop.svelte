<script>
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';

  // State to control button visibility
  let showButton = $state(false);

  // Scroll detection with debouncing for performance
  $effect(() => {
    let timeoutId;

    const handleScroll = () => {
      // Clear previous timeout to debounce
      clearTimeout(timeoutId);

      // Debounce scroll events (50ms)
      timeoutId = setTimeout(() => {
        showButton = window.scrollY > 300;
      }, 50);
    };

    // Add passive scroll listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  });

  /**
   * Smoothly scroll to top of page
   * Fallback for browsers without smooth scroll support
   */
  function scrollToTop() {
    try {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } catch (error) {
      // Fallback for older browsers
      window.scrollTo(0, 0);
    }
  }
</script>

<!--
  Scroll-to-Top Button
  Material UI inspired circular button with glassmorphic design
  - Appears after scrolling 300px down
  - Smooth fade-in/out transitions
  - Gold theme matching site design
  - Accessible with keyboard navigation
-->
{#if showButton}
  <button
    onclick={scrollToTop}
    class="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50
           w-12 h-12 rounded-full
           bg-slate-800/80 backdrop-blur-md
           border-2 border-[#BF953F]/40
           shadow-lg shadow-black/20
           text-[#BF953F]
           transition-all duration-300 ease-out
           hover:border-[#FCF6BA] hover:text-[#FCF6BA]
           hover:scale-110 hover:shadow-xl hover:shadow-[#BF953F]/20
           focus:outline-none focus:ring-2 focus:ring-[#BF953F] focus:ring-offset-2 focus:ring-offset-slate-900
           opacity-0 translate-y-4
           {showButton ? 'opacity-100 translate-y-0' : ''}"
    aria-label="Scroll to top"
    type="button"
  >
    <Icon icon="mdi:chevron-up" width="24" class="mx-auto" />
  </button>
{/if}

<style>
  /* Ensure smooth transitions even when class changes */
  button {
    will-change: transform, opacity;
  }
</style>
