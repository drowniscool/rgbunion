<script>
  import { page } from "$app/stores";
  import { fade, fly, scale } from "svelte/transition";
  import { ExternalLink, ShoppingBag } from "lucide-svelte";
  import Icon from '@iconify/svelte';

  const { data } = $props();
  
  // Get current year for footer
  const currentYear = new Date().getFullYear();
  
  let activeCategory = $state(null);
  let activeSubcategory = $state(null);
  let categories = $state(data.categories || []);
  let subcategories = $state(data.subcategories || []);
  let itemsByCategory = $state(data.itemsByCategory || {});
  let mounted = $state(false);

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

  .animate-fadeIn {
    animation: fadeIn 0.4s ease-out;
  }

  /* Enhanced scrollbar styling */
  :global(*::-webkit-scrollbar) {
    width: 6px;
  }

  :global(*::-webkit-scrollbar-track) {
    background: transparent;
  }

  :global(*::-webkit-scrollbar-thumb) {
    background: #BF953F;
    border-radius: 3px;
  }

  :global(*::-webkit-scrollbar-thumb:hover) {
    background: #B38728;
  }
</style>

<!-- Modern dark slate background with subtle pattern -->
<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
  <!-- Subtle Background Pattern -->
  <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNCRjk1M0YiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

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
      Discover our curated selection of premium items and services
    </p>
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
        <div class="mb-8" in:fly={{ y: 30, duration: 600 }}>
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
          <div class="mb-12" in:fly={{ y: 30, duration: 600, delay: 200 }}>
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
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#if getFilteredItems().length > 0}
            {#each getFilteredItems() as item, index (item.id)}
              <div
                class="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:shadow-2xl hover:shadow-[#BF953F]/10 hover:border-[#BF953F]/50 transition-all duration-300 hover:scale-[1.02]"
                in:scale={{ duration: 400, delay: index * 100 }}
              >
                <!-- Item Header -->
                <div class="flex items-start justify-between gap-4 mb-4">
                  <div class="flex-1">
                    <h3 class="font-bold text-[#FCF6BA] text-lg group-hover:text-white transition-colors mb-2">
                      {item.name}
                    </h3>
                    <div class="flex items-center gap-2 mb-3">
                      <div class="px-3 py-1 bg-gradient-to-r from-[#BF953F] to-[#B38728] text-black text-sm font-semibold rounded-full">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                  </div>
                </div>

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
                  View Item
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
 
  <!-- Footer with dark theme -->
  <div class="mt-auto pt-12 border-t border-slate-700/50">
    <div class="text-center">
      <p class="text-slate-400 text-sm mb-2">
        © {currentYear} RGBUNION. All Rights Reserved.
      </p>
      <p class="text-slate-500 text-xs">
        Premium items and services curated for our community
      </p>
    </div>
  </div>
</div>
</div>