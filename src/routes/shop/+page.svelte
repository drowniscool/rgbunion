<script>
  import { page } from "$app/stores";
  import { fade } from "svelte/transition";

  const { data } = $props();
  
  // Get current year for footer
  const currentYear = new Date().getFullYear();
  
  let activeCategory = $state(null);
  let activeSubcategory = $state(null);
  let categories = $state(data.categories || []);
  let subcategories = $state(data.subcategories || []);
  let itemsByCategory = $state(data.itemsByCategory || {});

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
</script>

<div class="fixed inset-0 bg-center bg-no-repeat bg-contain opacity-10 filter blur-xs z-0" style="background-image: url('/logo.png')"></div>

<div class="min-h-screen flex flex-col relative z-1">
  <div class="p-6 max-w-7xl w-full mx-auto">
    <h1 class="text-5xl font-bold text-center text-[#BF953F] mb-12 mt-8">Shop</h1>

    {#if categories.length === 0}
      <div class="text-center text-text py-12">
        No items available in the shop yet. Check back later!
      </div>
    {:else}
      <!-- Category Navigation -->
      <div class="flex flex-wrap gap-4 justify-center mb-6">
        <button
          class="py-2 px-6 rounded-full font-medium transition-colors {activeCategory === null ? 'bg-[#BF953F] text-white' : 'bg-surface text-text hover:bg-hover'}"
          onclick={() => { activeCategory = null; activeSubcategory = null; }}
        >
          All
        </button>
        {#each categories as category (category.id)}
          <button
            class="py-2 px-6 rounded-full font-medium transition-colors {activeCategory === category.id ? 'bg-[#BF953F] text-white' : 'bg-surface text-text hover:bg-hover'}"
            onclick={() => { activeCategory = category.id; activeSubcategory = null; }}
          >
            {category.tag}
          </button>
        {/each}
      </div>

      <!-- Subcategory Navigation -->
      {#if activeCategory !== null && getSubcategoriesForCategory(activeCategory).length > 0}
        <div class="flex flex-wrap gap-4 justify-center mb-12">
          <button
            class="py-2 px-6 rounded-full font-medium transition-colors {activeSubcategory === null ? 'bg-[#BF953F] text-white' : 'bg-surface text-text hover:bg-hover'}"
            onclick={() => activeSubcategory = null}
          >
            All {categories.find(c => c.id === activeCategory)?.tag}
          </button>
          {#each getSubcategoriesForCategory(activeCategory) as subcategory (subcategory.id)}
            <button
              class="py-2 px-6 rounded-full font-medium transition-colors {activeSubcategory === subcategory.id ? 'bg-[#BF953F] text-white' : 'bg-surface text-text hover:bg-hover'}"
              onclick={() => activeSubcategory = subcategory.id}
            >
              {subcategory.name}
            </button>
          {/each}
        </div>
      {/if}

      <!-- Items Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#if getFilteredItems().length > 0}
          {#each getFilteredItems() as item (item.id)}
            <div
              class="bg-surface p-6 rounded-xl border border-border hover:border-[#BF953F] transition-colors"
              transition:fade
            >
              <h3 class="text-xl font-medium text-text mb-2">{item.name}</h3>
              <div class="text-lg text-[#BF953F] font-medium mb-4">
                {formatPrice(item.price)}
              </div>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-block w-full py-2 px-4 bg-[#BF953F] text-white rounded-lg text-center font-medium hover:opacity-90 transition-opacity"
              >
                Buy
              </a>
            </div>
          {/each}
        {:else}
          <div class="col-span-full text-center text-text-secondary py-12">
            No items available in this category yet.
          </div>
        {/if}
      </div>
    {/if}
  </div>
 
  <!-- Footer -->
  <div class="mt-auto py-8 text-center text-sm text-gray-400">
    © {currentYear} RGBUNION. All Rights Reserved.
  </div>
</div>