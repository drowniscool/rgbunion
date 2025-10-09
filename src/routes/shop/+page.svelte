<script>
  import { page } from "$app/stores";
  import { fade, fly, scale } from "svelte/transition";
  import { ExternalLink, ShoppingBag, Copy, Check } from "lucide-svelte";
  import Icon from '@iconify/svelte';
  import { enhancedFade, staggeredSlide, scaleIn, blurReveal, toastSlide, MOTION_TOKENS } from '$lib/motion/transitions';

  const { data } = $props();

  // Get current year for footer
  const currentYear = new Date().getFullYear();

  let activeCategory = $state(null);
  let activeSubcategory = $state(null);
  let categories = $state(data.categories || []);
  let subcategories = $state(data.subcategories || []);
  let itemsByCategory = $state(data.itemsByCategory || {});
  let mounted = $state(false);

  // Toast notification state
  let toastMessage = $state('');
  let showToast = $state(false);
  let copiedItemId = $state(null);


  $effect(() => {
    categories = data.categories || [];
    subcategories = data.subcategories || [];
    itemsByCategory = data.itemsByCategory || {};
  });

  function formatPrice(cents) {
    // Convert cents to dollars and round to whole number
    const dollars = Math.round(cents / 100);
    return `$${dollars}`;
  }

  function getSubcategoriesForCategory(categoryId) {
    return subcategories.filter(s => s.category_id === categoryId);
  }

  function getFilteredItems() {
    if (activeCategory === null) {
      return Object.values(itemsByCategory).flatMap(category => category.items);
    }

    const category = itemsByCategory[activeCategory];
    if (!category) return [];

    if (activeSubcategory === null) {
      return category.items;
    }

    return category.subcategories[activeSubcategory] || [];
  }

  // Copy to clipboard functionality
  async function copyToClipboard(text, itemId) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        // Modern API
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      // Show success feedback
      copiedItemId = itemId;
      showToast = true;
      toastMessage = `Copied "${text}" to clipboard!`;

      // Reset copied state after animation
      setTimeout(() => {
        copiedItemId = null;
      }, 2000);

      // Hide toast after 3 seconds
      setTimeout(() => {
        showToast = false;
      }, 3000);

    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Show error feedback
      showToast = true;
      toastMessage = 'Failed to copy to clipboard';
      setTimeout(() => {
        showToast = false;
      }, 3000);
    }
  }


  // Initialize mounted state
  import { onMount } from "svelte";
  onMount(() => {
    mounted = true;
  });
</script>

<svelte:head>
  <title>Shop - RGBUNION</title>
  <meta name="description" content="Browse our curated shop items and services">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</svelte:head>

<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

</style>

<!-- Modern dark slate background with subtle pattern -->
<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
  <!-- Subtle Background Pattern -->
  <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNCRjk1M0YiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

  <!-- Toast Notification -->
  {#if showToast}
    <div
      class="fixed top-4 right-4 z-50 max-w-sm bg-slate-800/90 backdrop-blur-xl border border-[#BF953F]/50 rounded-xl p-4 shadow-2xl shadow-[#BF953F]/25"
      in:toastSlide={{ direction: 'right' }}
      out:toastSlide={{ direction: 'right' }}
    >
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-gradient-to-r from-[#BF953F] to-[#B38728] rounded-full flex items-center justify-center">
          <Check class="w-4 h-4 text-black" />
        </div>
        <p class="text-[#FCF6BA] font-medium text-sm">{toastMessage}</p>
      </div>
    </div>
  {/if}

<div class="relative z-10 p-4 sm:p-6 max-w-7xl mx-auto min-h-screen flex flex-col">

  <!-- Page Header -->
  <div class="text-center mb-12 mt-8">
    <div class="w-20 h-20 bg-gradient-to-br from-[#BF953F]/20 to-[#B38728]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#BF953F]/30">
      <ShoppingBag class="w-10 h-10 text-[#BF953F]" />
    </div>
    <h1 class="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] mb-4" style="font-family: 'Cinzel', serif;">
      Shop
    </h1>
    <p class="text-slate-300 text-lg max-w-2xl mx-auto">
      If you have any questions or want to purchase a specific item, just click the contact link under the product name — we'll get back to you quickly
    </p>

    <!-- Terms Notice -->
    <div class="bg-slate-800/40 border border-slate-700/40 rounded-lg px-4 py-3 mt-6 max-w-2xl mx-auto">
      <p class="text-slate-400 text-sm text-center">
        By purchasing you automatically agree to our <a href="/terms" class="text-[#BF953F] hover:text-[#FCF6BA] transition-colors duration-300" aria-label="Read Terms of Service">Terms of Service</a>
      </p>
    </div>
  </div>

    {#if categories.length === 0}
      <!-- Empty State -->
      <div class="text-center py-20">
        <div class="w-24 h-24 bg-gradient-to-br from-[#BF953F]/20 to-[#B38728]/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-[#BF953F]/30">
          <ShoppingBag class="w-12 h-12 text-[#BF953F]" />
        </div>
        <h3 class="text-2xl font-semibold text-[#FCF6BA] mb-4">Shop Coming Soon</h3>
        <p class="text-slate-400 text-base max-w-md mx-auto leading-relaxed">
          Our shop is being prepared with premium items and services. Check back soon for exciting new additions!
        </p>
      </div>
    {:else}
      <!-- Category Navigation -->
      {#if mounted}
        <div class="mb-8" in:enhancedFade={{ duration: MOTION_TOKENS.durations.slow, direction: 'up' }}>
          <h3 class="text-xl font-semibold text-[#FCF6BA] mb-4 text-center">Browse Categories</h3>
          <div class="flex flex-wrap gap-3 justify-center">
            <button
              class="py-3 px-6 rounded-full font-medium transition-all duration-300 hover:scale-105 {activeCategory === null ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-black shadow-lg shadow-[#BF953F]/25' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600/50 hover:border-[#BF953F]/30'}"
              onclick={() => { activeCategory = null; activeSubcategory = null; }}
            >
              All Categories
            </button>
            {#each categories as category (category.id)}
              <button
                class="py-3 px-6 rounded-full font-medium transition-all duration-300 hover:scale-105 {activeCategory === category.id ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-black shadow-lg shadow-[#BF953F]/25' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600/50 hover:border-[#BF953F]/30'}"
                onclick={() => { activeCategory = category.id; activeSubcategory = null; }}
              >
                {category.tag}
              </button>
            {/each}
          </div>
        </div>

        <!-- Subcategory Navigation -->
        {#if activeCategory !== null && getSubcategoriesForCategory(activeCategory).length > 0}
          <div class="mb-12" in:enhancedFade={{ duration: MOTION_TOKENS.durations.slow, direction: 'up', delay: 200 }}>
            <h4 class="text-lg font-medium text-slate-300 mb-4 text-center">
              {categories.find(c => c.id === activeCategory)?.tag} Subcategories
            </h4>
            <div class="flex flex-wrap gap-3 justify-center">
              <button
                class="py-2 px-5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 {activeSubcategory === null ? 'bg-[#BF953F]/20 text-[#FCF6BA] border border-[#BF953F]/40' : 'bg-slate-600/50 text-slate-400 hover:bg-slate-500/50 border border-slate-500/50'}"
                onclick={() => activeSubcategory = null}
              >
                All {categories.find(c => c.id === activeCategory)?.tag}
              </button>
              {#each getSubcategoriesForCategory(activeCategory) as subcategory (subcategory.id)}
                <button
                  class="py-2 px-5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 {activeSubcategory === subcategory.id ? 'bg-[#BF953F]/20 text-[#FCF6BA] border border-[#BF953F]/40' : 'bg-slate-600/50 text-slate-400 hover:bg-slate-500/50 border border-slate-500/50'}"
                  onclick={() => activeSubcategory = subcategory.id}
                >
                  {subcategory.name}
                </button>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Items Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {#if getFilteredItems().length > 0}
            {#each getFilteredItems() as item, index (item.id)}
              <div
                class="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:shadow-2xl hover:shadow-[#BF953F]/10 hover:border-[#BF953F]/50 transition-all duration-300 hover:scale-[1.02]"
                in:staggeredSlide={{ index, direction: 'up', distance: 30, staggerDelay: MOTION_TOKENS.stagger.normal }}
              >

                <!-- Item Header -->
                <div class="flex items-start justify-between gap-4 mb-4">
                  <div class="flex-1">
                    <div class="flex items-center justify-between gap-2 mb-2">
                      <h3 class="font-bold text-[#FCF6BA] text-lg group-hover:text-white transition-colors">
                        {item.name}
                      </h3>
                      <button
                        onclick={() => copyToClipboard(item.name, item.id)}
                        class="flex-shrink-0 p-2 rounded-lg bg-slate-700/50 hover:bg-[#BF953F]/20 border border-slate-600/50 hover:border-[#BF953F]/40 transition-all duration-300 hover:scale-110 group/copy"
                        title="Copy item name"
                      >
                        {#if copiedItemId === item.id}
                          <Check class="w-4 h-4 text-green-400" />
                        {:else}
                          <Copy class="w-4 h-4 text-slate-400 group-hover/copy:text-[#BF953F]" />
                        {/if}
                      </button>
                    </div>
                    <div class="flex items-center gap-2 mb-3">
                      <div class="px-3 py-1 bg-gradient-to-r from-[#BF953F] to-[#B38728] text-black text-sm font-semibold rounded-full">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Item Description -->
                {#if item.description && item.description.trim()}
                  <div class="mb-4">
                    <h4 class="text-sm font-semibold text-[#BF953F] mb-2 flex items-center gap-2">
                      <span class="w-1 h-4 bg-gradient-to-b from-[#BF953F] to-[#B38728] rounded-full"></span>
                      Description
                    </h4>
                    <p class="text-slate-300 text-sm leading-relaxed bg-slate-700/30 rounded-lg p-3 border-l-2 border-[#BF953F]/40">
                      {item.description}
                    </p>
                  </div>
                {/if}

                <!-- Category Tags -->
                <div class="flex flex-wrap gap-2 mb-4">
                  <span class="px-3 py-1 bg-[#BF953F]/20 text-[#FCF6BA] text-xs font-medium rounded-full border border-[#BF953F]/30">
                    {categories.find(c => c.id === item.category_id)?.tag}
                  </span>
                  {#if item.subcategory_id}
                    <span class="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full border border-blue-500/30">
                      {subcategories.find(s => s.id === item.subcategory_id)?.name}
                    </span>
                  {/if}
                </div>

                <!-- Action Button -->
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-[#BF953F] to-[#B38728] hover:from-[#B38728] hover:to-[#BF953F] text-black font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#BF953F]/25 hover:scale-[1.02] mt-4"
                >
                  BUY
                  <ExternalLink class="w-4 h-4" />
                </a>

                <!-- Hover Glow Effect -->
                <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#BF953F]/0 via-[#BF953F]/0 to-[#BF953F]/0 group-hover:from-[#BF953F]/5 group-hover:via-[#BF953F]/10 group-hover:to-[#BF953F]/5 transition-all duration-500 pointer-events-none"></div>
              </div>
            {/each}
          {:else}
            <!-- No Items in Filter -->
            <div class="col-span-full text-center py-16">
              <div class="w-20 h-20 bg-gradient-to-br from-[#BF953F]/20 to-[#B38728]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#BF953F]/30">
                <Icon icon="fa-solid:search" width="32" color="#BF953F" />
              </div>
              <h3 class="text-[#FCF6BA] font-semibold text-xl mb-3">No items found</h3>
              <p class="text-slate-400 text-base max-w-md mx-auto">
                No items match your current filter. Try selecting a different category or view all items.
              </p>
              <button
                onclick={() => { activeCategory = null; activeSubcategory = null; }}
                class="mt-6 px-6 py-3 bg-gradient-to-r from-[#BF953F] to-[#B38728] hover:from-[#B38728] hover:to-[#BF953F] text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-[#BF953F]/25 transition-all duration-300"
              >
                Show All Items
              </button>
            </div>
          {/if}
        </div>
      {/if}
    {/if}
</div>
</div>