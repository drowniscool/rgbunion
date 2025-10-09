<script>
  import { onMount } from "svelte";
  import { fade, fly, scale } from "svelte/transition";
  import { goto } from "$app/navigation";
  import { ExternalLink, LogIn, ArrowRight } from "lucide-svelte";
  import Icon from '@iconify/svelte';
  import { enhancedFade, staggeredSlide } from '$lib/motion/transitions';

  const { data } = $props();
  let mounted = $state(false);

  // Get domain-based icon details (ported from dashboard)
  const getIconDetails = (url) => {
    if (!url) return { icon: 'fa-solid:link', isIconify: true };

    const domain = url.toLowerCase();

    if (domain.includes('t.me') || domain.includes('telegram')) {
      return { icon: 'ic:baseline-telegram', isIconify: true };
    }
    if (domain.includes('signal')) {
      return { icon: 'bi:signal', isIconify: true };
    }
    if (domain.includes('simplex')) {
      return { icon: 'simple-icons:simplex', isIconify: true };
    }
    if (domain.includes('github')) {
      return { icon: 'mdi:github', isIconify: true };
    }
    if (domain.includes('discord')) {
      return { icon: 'ic:baseline-discord', isIconify: true };
    }
    if (domain.includes('twitter') || domain.includes('x.com')) {
      return { icon: 'mdi:twitter', isIconify: true };
    }
    if (domain.includes('youtube')) {
      return { icon: 'mdi:youtube', isIconify: true };
    }
    if (domain.includes('instagram')) {
      return { icon: 'mdi:instagram', isIconify: true };
    }

    // Default fallback
    return { icon: 'fa-solid:link', isIconify: true };
  };

  // Extract domain for display
  const getDomainName = (url) => {
    if (!url) return '';
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  };

  onMount(() => {
    mounted = true;
  });

  function handleLogin() {
    goto("/login");
  }

  function handleDashboard() {
    goto("/admin");
  }

  // Get current year for footer
  const currentYear = new Date().getFullYear();
</script>

<svelte:head>
  <title>RGBUNION - Digital Marketplace</title>
  <meta name="description" content="Professional digital services and marketplace solutions.">
  <meta property="og:title" content="RGBUNION - Digital Marketplace">
  <meta property="og:description" content="Premium digital services and marketplace solutions for professionals.">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</svelte:head>

<div class="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-black">
  <!-- Subtle Background Pattern -->
  <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNCRjk1M0YiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

  <!-- Hero Section -->
  <header class="relative z-10 px-4 sm:px-6 lg:px-8 py-16">
    <div class="max-w-6xl mx-auto text-center">
      <!-- Hero Logo -->
      <div class="flex justify-center mb-10">
        <div class="relative flex items-center justify-center h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48">
          <span class="hero-logo-shadow"></span>
          <img
            src="/logo.png"
            alt="RGBUNION emblem"
            class="relative z-10 h-36 w-36 sm:h-44 sm:w-44 lg:h-52 lg:w-52 object-contain"
            loading="eager"
            fetchpriority="high"
            decoding="async"
            style="filter: drop-shadow(0 14px 34px rgba(191, 149, 63, 0.45));"
          />
        </div>
      </div>

      <div class="mb-8">
        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] font-serif tracking-wide mb-4">
          RGBUNION
        </h1>
        <div class="flex items-center justify-center gap-4 mb-6">
          <div class="h-px bg-gradient-to-r from-transparent via-[#BF953F] to-transparent flex-1 max-w-24"></div>
          <p class="text-[#FCF6BA] text-lg sm:text-xl font-medium tracking-wide">
            Reliable, Guaranteed, Best
          </p>
          <div class="h-px bg-gradient-to-r from-transparent via-[#BF953F] to-transparent flex-1 max-w-24"></div>
        </div>
        <p class="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
          From enrolls to cards, our products are known for top-tier quality and market-leading reliability — trusted by professionals who settle for nothing less than the best.
        </p>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="flex-1 px-4 sm:px-6 lg:px-8 pb-16">
    <div class="max-w-6xl mx-auto">
      <!-- Welcome Section -->
        <div
          class="text-center mb-16"
          in:enhancedFade={{ duration: 800, delay: 200, direction: 'up', distance: 30 }}
        >
          <!-- Service Features -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div class="flex flex-col items-center p-4 mb-8 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <div class="w-12 h-12 bg-[#BF953F]/20 rounded-full flex items-center justify-center mb-3">
                <Icon icon="mdi:currency-usd" width="24" height="24" class="text-[#BF953F]" />
              </div>
              <h3 class="text-white font-semibold mb-1">Guaranteed Balance</h3>
              <p class="text-slate-400 text-sm text-center"><i>Subject to <a href="/terms" class="text-[#BF953F] underline">Terms of Service</a></i></p>
            </div>

            <div class="flex flex-col items-center p-4 mb-8 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <div class="w-12 h-12 bg-[#BF953F]/20 rounded-full flex items-center justify-center mb-3">
                <Icon icon="mdi:numeric-1-box" width="24" height="24" class="text-[#BF953F]" />
              </div>
              <h3 class="text-white font-semibold mb-1">First Hand</h3>
            </div>

            <div class="flex flex-col items-center p-4 mb-8 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <div class="w-12 h-12 bg-[#BF953F]/20 rounded-full flex items-center justify-center mb-3">
                <Icon icon="mdi:clock-fast" width="24" height="24" class="text-[#BF953F]" />
              </div>
              <h3 class="text-white font-semibold mb-1">Fast Delivery</h3>
            </div>
          </div>
        </div>

        <!-- Service Links Section -->
        {#if data.links && data.links.length > 0}
          <div class="mb-12">
            <div class="text-center mb-8">
              <h3 class="text-2xl sm:text-3xl font-bold text-white mb-3">
                Service
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] to-[#B38728]">
                  Access
                </span>
              </h3>
              <p class="text-slate-400 max-w-2xl mx-auto">
                You can find all our services, contact links, and channel information below.<br />
                Feel free to reach out — we're here to help.
              </p>
            </div>
          </div>

          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            in:enhancedFade={{ duration: 800, delay: 400, direction: 'up', distance: 30 }}
          >
            {#each data.links as link, index (link.id)}
              <div
                class="group relative bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-[#BF953F]/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#BF953F]/20"
                in:staggeredSlide={{ index, direction: 'up', distance: 20, staggerDelay: 100 }}
              >
                <!-- Card Icon -->
                <div class="flex items-center gap-4 mb-4">
                  <div class="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#BF953F]/20 to-[#B38728]/20 rounded-xl flex items-center justify-center group-hover:from-[#BF953F]/30 group-hover:to-[#B38728]/30 transition-all duration-300">
                    {#if getIconDetails(link.link).isIconify}
                      <Icon
                        icon={getIconDetails(link.link).icon}
                        width="28"
                        height="28"
                        class="text-[#BF953F] group-hover:text-[#FCF6BA] transition-colors duration-300"
                      />
                    {:else}
                      <i class="fa-solid fa-link text-[#BF953F] group-hover:text-[#FCF6BA] transition-colors duration-300 text-2xl"></i>
                    {/if}
                  </div>
                  <div class="flex-1">
                    <h3 class="text-xl font-bold text-white group-hover:text-[#FCF6BA] transition-colors duration-300">
                      {link.title || getDomainName(link.link)}
                    </h3>
                    <p class="text-sm text-[#BF953F] font-semibold tracking-wide">
                      {getDomainName(link.link)}
                    </p>
                  </div>
                </div>

                <!-- Card Description -->
                {#if link.description && link.description.trim()}
                  <div class="mb-6">
                    <h4 class="text-sm font-semibold text-[#BF953F] mb-2 flex items-center gap-2">
                      <span class="w-1 h-4 bg-gradient-to-b from-[#BF953F] to-[#B38728] rounded-full"></span>
                      Description
                    </h4>
                    <p class="text-slate-300 text-sm leading-relaxed bg-slate-700/30 rounded-lg p-3 border-l-2 border-[#BF953F]/40">
                      {link.description}
                    </p>
                  </div>
                {:else}
                  <div class="mb-6"></div>
                {/if}

                <!-- Card Button -->
                <a
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-[#BF953F] to-[#B38728] hover:from-[#B38728] hover:to-[#BF953F] text-black font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#BF953F]/25 hover:scale-[1.02]"
                >
                  Open
                  <ExternalLink class="w-4 h-4" />
                </a>

                <!-- Hover Glow Effect -->
                <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#BF953F]/0 via-[#BF953F]/0 to-[#BF953F]/0 group-hover:from-[#BF953F]/5 group-hover:via-[#BF953F]/10 group-hover:to-[#BF953F]/5 transition-all duration-500 pointer-events-none"></div>
              </div>
            {/each}
          </div>
        {:else}
          <!-- Empty State -->
          <div
            class="text-center py-16"
            in:enhancedFade={{ duration: 800, delay: 400, direction: 'up', distance: 30 }}
          >
            <div class="max-w-lg mx-auto">
              <div class="w-24 h-24 bg-gradient-to-br from-[#BF953F]/20 to-[#B38728]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon icon="mdi:store" width="48" height="48" class="text-[#BF953F]" />
              </div>
              <h3 class="text-2xl font-semibold text-white mb-4">
                Services Available Soon
              </h3>
              <p class="text-slate-400 leading-relaxed mb-8">
                Nothing available currently, come back later.
              </p>
              {#if data.loggedIn}
                <button
                  onclick={handleDashboard}
                  class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#BF953F] to-[#B38728] hover:from-[#B38728] hover:to-[#BF953F] text-black font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#BF953F]/25"
                >
                  Manage Services
                  <ArrowRight class="w-4 h-4" />
                </button>
              {/if}
            </div>
          </div>
        {/if}
    </div>
  </main>

</div>

<style>
  :global(body) {
    background: #000;
  }

  .hero-logo-shadow {
    position: absolute;
    inset: 0;
    border-radius: 36px;
    background: radial-gradient(circle at 50% 40%, rgba(191, 149, 63, 0.45), rgba(15, 23, 42, 0) 65%);
    filter: blur(28px);
    opacity: 0.85;
    animation: heroGlow 7s ease-in-out infinite alternate;
    pointer-events: none;
  }

  @keyframes heroGlow {
    from {
      transform: scale(0.96) translateY(4px);
      opacity: 0.65;
    }
    to {
      transform: scale(1.04) translateY(-2px);
      opacity: 0.9;
    }
  }
</style>