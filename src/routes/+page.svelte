<script>
  import { onMount } from "svelte";
  import { fade, fly, scale } from "svelte/transition";
  import { goto } from "$app/navigation";
  import { ExternalLink, LogIn, ArrowRight } from "lucide-svelte";
  import Icon from '@iconify/svelte';

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
    goto("/dashboard");
  }

  // Get current year for footer
  const currentYear = new Date().getFullYear();
</script>

<svelte:head>
  <title>RGBUNION - Shop Links</title>
  <meta name="description" content="Browse our collection of curated shop links and services.">
  <meta property="og:title" content="RGBUNION - Shop Links">
  <meta property="og:description" content="Discover our curated collection of quality shop links and services.">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</svelte:head>

<div class="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-black">
  <!-- Subtle Background Pattern -->
  <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNCRjk1M0YiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

  <!-- Header -->
  <header class="relative z-10 px-4 sm:px-6 lg:px-8 py-8">
    <div class="max-w-6xl mx-auto flex justify-between items-center">
      <!-- Logo -->
      <div class="text-center">
        <h1 class="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 font-serif">
          RGBUNION
        </h1>
        <p class="text-slate-400 text-sm sm:text-base mt-1">
          Shop Links Collection
        </p>
      </div>

      <!-- Auth Controls -->
      <div class="flex gap-3">
        {#if data.loggedIn}
          <button
            on:click={handleDashboard}
            class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-medium rounded-lg transition-all duration-300 hover:scale-105"
          >
            Dashboard
            <ArrowRight class="w-4 h-4" />
          </button>
        {:else}
          <button
            on:click={handleLogin}
            class="flex items-center gap-2 px-4 py-2 border border-slate-600 hover:border-amber-500 text-slate-300 hover:text-white font-medium rounded-lg transition-all duration-300 hover:bg-amber-500/10"
          >
            <LogIn class="w-4 h-4" />
            Login
          </button>
        {/if}
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="flex-1 px-4 sm:px-6 lg:px-8 pb-16">
    <div class="max-w-6xl mx-auto">
      {#if mounted}
        <!-- Welcome Section -->
        <div
          class="text-center mb-12"
          in:fly={{ y: 30, duration: 800, delay: 200 }}
        >
          <h2 class="text-2xl sm:text-3xl font-bold text-white mb-4">
            Explore Our Shop Links
          </h2>
          <p class="text-lg text-slate-400 max-w-2xl mx-auto">
            Discover our carefully curated collection of quality services and platforms
          </p>
        </div>

        <!-- Links Grid -->
        {#if data.links && data.links.length > 0}
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            in:fly={{ y: 30, duration: 800, delay: 400 }}
          >
            {#each data.links as link, index (link.id)}
              <div
                class="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-amber-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/10"
                in:scale={{ duration: 400, delay: index * 100 }}
              >
                <!-- Card Icon -->
                <div class="flex items-center gap-4 mb-4">
                  <div class="flex-shrink-0 w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                    {#if getIconDetails(link.link).isIconify}
                      <Icon
                        icon={getIconDetails(link.link).icon}
                        width="24"
                        height="24"
                        class="text-amber-400 group-hover:text-amber-300 transition-colors"
                      />
                    {:else}
                      <i class="fa-solid fa-link text-amber-400 group-hover:text-amber-300 transition-colors text-xl"></i>
                    {/if}
                  </div>
                  <div class="flex-1">
                    <h3 class="text-xl font-semibold text-white group-hover:text-amber-100 transition-colors">
                      {link.title || getDomainName(link.link)}
                    </h3>
                    <p class="text-sm text-amber-400/80 font-medium">
                      {getDomainName(link.link)}
                    </p>
                  </div>
                </div>

                <!-- Card Description -->
                {#if link.description}
                  <p class="text-slate-300 mb-6 leading-relaxed">
                    {link.description}
                  </p>
                {:else}
                  <div class="mb-6"></div>
                {/if}

                <!-- Card Button -->
                <a
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold rounded-lg transition-all duration-300 hover:shadow-lg"
                >
                  Visit Site
                  <ExternalLink class="w-4 h-4" />
                </a>

                <!-- Hover Glow Effect -->
                <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500/0 via-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:via-amber-500/10 group-hover:to-amber-500/5 transition-all duration-300 pointer-events-none"></div>
              </div>
            {/each}
          </div>
        {:else}
          <!-- Empty State -->
          <div
            class="text-center py-16"
            in:fly={{ y: 30, duration: 800, delay: 400 }}
          >
            <div class="max-w-md mx-auto">
              <div class="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon icon="fa-solid:store" width="48" height="48" class="text-slate-500" />
              </div>
              <h3 class="text-2xl font-semibold text-white mb-4">
                No Links Available
              </h3>
              <p class="text-slate-400 leading-relaxed mb-8">
                Our shop links collection is currently being updated. Check back soon for exciting new additions!
              </p>
              {#if data.loggedIn}
                <button
                  on:click={handleDashboard}
                  class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Manage Links
                  <ArrowRight class="w-4 h-4" />
                </button>
              {/if}
            </div>
          </div>
        {/if}
      {/if}
    </div>
  </main>

  <!-- Footer -->
  <footer class="relative z-10 px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-700/50">
    <div class="max-w-6xl mx-auto text-center">
      <p class="text-slate-500 text-sm">
        © {currentYear} RGBUNION. All Rights Reserved.
      </p>
    </div>
  </footer>
</div>

<style>
  :global(body) {
    background: #000;
  }
</style>