<script>
  import { fade, fly, scale } from "svelte/transition";
  import { enhance } from "$app/forms";
  import { onMount } from "svelte";
  import { PlusCircle, Trash2, Edit, X, ArrowLeft, ShoppingBag, AlertTriangle, ExternalLink } from "lucide-svelte";
  import Icon from '@iconify/svelte';
  import AccountModal from '$lib/components/AccountModal.svelte';
  import { showAccountModal, closeAccountModal } from '$lib/stores/modal.js';

  // Function to determine the correct icon for a link
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
      return domain.startsWith('www.') ? domain.slice(4) : domain;
    } catch (e) {
      return url;
    }
  };

  const { data, form } = $props();

  let showLinkModal = $state(false);
  let editingLinkId = $state(null);
  let url = $state('');
  let title = $state('');
  let description = $state('');

  // Toast notification
  let showToast = $state(false);
  let toastMessage = $state('');
  let toastType = $state('success'); // 'success' or 'error'

  function showSuccessToast(message) {
    toastMessage = message;
    toastType = "success";
    showToast = true;
    setTimeout(() => {
      showToast = false;
    }, 3000);
  }

  function showErrorToast(message) {
    toastMessage = message;
    toastType = "error";
    showToast = true;
    setTimeout(() => {
      showToast = false;
    }, 3000);
  }

  // Get current year for footer
  const currentYear = new Date().getFullYear();

  let activeTab = $state('links'); // 'links' or 'shop'
  let showShopModal = $state(false);
  let editingCategoryId = $state(null);
  let isAddingCategory = $state(false);
  let editingItem = $state(null);

  let categories = $state(data.categories || []);
  let subcategories = $state(data.subcategories || []);
  let items = $state(data.items || []);

  let categoryTag = $state('');
  let subcategoryName = $state('');
  let selectedCategoryId = $state('');
  let selectedSubcategoryId = $state('');
  let itemName = $state('');
  let itemPrice = $state('');
  let itemLink = $state('');
  let itemDescription = $state('');

  // Category management functions
  function addCategory() {
    editingCategoryId = null;
    categoryTag = '';
    isAddingCategory = true;
    editingItem = null;
    showShopModal = true;
  }

  function editCategory(category) {
    editingCategoryId = category.id;
    categoryTag = category.tag;
    isAddingCategory = true;
    editingItem = null;
    showShopModal = true;
  }

  function addSubcategory() {
    if (!selectedCategoryId) {
      showErrorToast('Please select a category first');
      return;
    }
    subcategoryName = '';
  }

  function editSubcategory(subcategory) {
    subcategoryName = subcategory.name;
    selectedCategoryId = subcategory.category_id.toString();
  }

  function getSubcategoriesForCategory(categoryId) {
    return subcategories.filter(s => s.category_id === categoryId);
  }

  function getCategoryName(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.tag : 'Unknown';
  }

  function getSubcategoryName(subcategoryId) {
    const subcategory = subcategories.find(s => s.id === subcategoryId);
    return subcategory ? subcategory.name : '';
  }

  // Item management functions
  function addItem() {
    editingItem = null;
    isAddingCategory = false;
    itemName = '';
    itemPrice = '';
    itemLink = '';
    itemDescription = '';
    selectedCategoryId = '';
    selectedSubcategoryId = '';
    showShopModal = true;
  }

  function editItem(item) {
    editingItem = item.id;
    isAddingCategory = false;
    itemName = item.name;
    itemPrice = (item.price / 100).toString();
    itemLink = item.link;
    itemDescription = item.description || '';
    selectedCategoryId = item.category_id.toString();
    selectedSubcategoryId = item.subcategory_id ? item.subcategory_id.toString() : '';
    showShopModal = true;
  }

  function formatPrice(cents) {
    return `$${(cents / 100).toFixed(2)}`;
  }

  function openLinkModal(link = null) {
    if (link) {
      // Edit mode
      editingLinkId = link.id;
      url = link.link;
      title = link.title;
      description = link.description || '';
    } else {
      // Add mode
      editingLinkId = null;
      url = '';
      title = '';
      description = '';
    }
    showLinkModal = true;
  }

  // Effect to handle form submission results
  $effect(() => {
    if (form?.success) {
      showLinkModal = false;
      showShopModal = false;
      editingLinkId = null;
      editingItem = null;

      // Show success message based on action
      const actionMessages = {
        addLink: 'Link added successfully!',
        updateLink: 'Link updated successfully!',
        deleteLink: 'Link deleted successfully!',
        addCategory: 'Category added successfully!',
        updateCategory: 'Category updated successfully!',
        deleteCategory: 'Category deleted successfully!',
        addSubcategory: 'Subcategory added successfully!',
        updateSubcategory: 'Subcategory updated successfully!',
        deleteSubcategory: 'Subcategory deleted successfully!',
        addItem: 'Item added successfully!',
        updateItem: 'Item updated successfully!',
        deleteItem: 'Item deleted successfully!',
      };

      const message = actionMessages[form.action] || 'Action completed successfully!';
      showSuccessToast(message);
    } else if (form?.message) {
      showErrorToast(form.message);
    }
  });

  // Update reactive data when form succeeds
  $effect(() => {
    if (data) {
      categories = data.categories || [];
      subcategories = data.subcategories || [];
      items = data.items || [];
    }
  });
</script>

<svelte:head>
  <title>Admin Dashboard - RGBUNION</title>
  <meta name="description" content="Admin dashboard for managing links and shop">
</svelte:head>

<!-- Toast Notification -->
{#if showToast}
  <div
    class="fixed top-4 right-4 z-50 max-w-sm bg-slate-800/90 backdrop-blur-xl border border-{toastType === 'success' ? '[#BF953F]/50' : 'red-500/50'} rounded-xl p-4 shadow-2xl"
    in:fly={{ x: 300, duration: 300 }}
    out:fly={{ x: 300, duration: 300 }}
  >
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 bg-gradient-to-r from-{toastType === 'success' ? '[#BF953F]' : 'red-500'} to-{toastType === 'success' ? '[#B38728]' : 'red-600'} rounded-full flex items-center justify-center">
        {#if toastType === 'success'}
          <Icon icon="fa-solid:check" width="16" color="white" />
        {:else}
          <AlertTriangle class="w-4 h-4 text-white" />
        {/if}
      </div>
      <p class="text-[#FCF6BA] font-medium text-sm">{toastMessage}</p>
    </div>
  </div>
{/if}

<!-- Modern dark slate background with subtle pattern -->
<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
  <!-- Subtle Background Pattern -->
  <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNCRjk1M0YiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

<div class="relative z-10 p-4 sm:p-6 max-w-7xl mx-auto min-h-screen flex flex-col">
  <!-- Enhanced Tab Navigation -->
  <nav class="flex justify-center mb-12 px-4" aria-label="Admin dashboard navigation">
    <div class="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-1.5 backdrop-blur-xl shadow-xl shadow-black/20 w-full max-w-md">
      <div class="flex space-x-2">
        <button
          class="relative flex-1 px-4 sm:px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 {activeTab === 'links' ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-black shadow-lg shadow-[#BF953F]/30 scale-105' : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:scale-102'}"
          onclick={() => activeTab = 'links'}
        >
          <Icon icon="fa-solid:link" width="20" class={activeTab === 'links' ? 'text-black' : 'text-slate-400'} />
          <span class="text-sm sm:text-base">Links</span>
          {#if activeTab === 'links'}
            <div class="absolute -top-1 -right-1 w-3 h-3 bg-[#FCF6BA] rounded-full"></div>
          {/if}
        </button>
        <button
          class="relative flex-1 px-4 sm:px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 {activeTab === 'shop' ? 'bg-gradient-to-r from-[#BF953F] to-[#B38728] text-black shadow-lg shadow-[#BF953F]/30 scale-105' : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:scale-102'}"
          onclick={() => activeTab = 'shop'}
        >
          <ShoppingBag class="w-5 h-5 {activeTab === 'shop' ? 'text-black' : 'text-slate-400'}" />
          <span class="text-sm sm:text-base">Shop</span>
          {#if activeTab === 'shop'}
            <div class="absolute -top-1 -right-1 w-3 h-3 bg-[#FCF6BA] rounded-full"></div>
          {/if}
        </button>
      </div>
    </div>
  </nav>

  <!-- Links Tab -->
  {#if activeTab === 'links'}
    <div class="space-y-8">
      <!-- Enhanced Add Link Section -->
      <div class="flex justify-center mb-8">
        <button
          onclick={() => openLinkModal()}
          class="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#BF953F] to-[#B38728] hover:from-[#B38728] hover:to-[#BF953F] text-black font-bold rounded-2xl hover:shadow-xl hover:shadow-[#BF953F]/30 transition-all duration-300 hover:scale-105"
        >
          <PlusCircle class="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          <span class="text-lg">Add New Link</span>
        </button>
      </div>

      <!-- Enhanced Links Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {#each data.links as link (link.id)}
          {@const iconDetails = getIconDetails(link.link)}
          <article class="group bg-slate-800/60 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-8 hover:shadow-2xl hover:shadow-[#BF953F]/15 hover:border-[#BF953F]/60 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1" in:fade={{ duration: 300 }}>
            <!-- Card Header -->
            <header class="mb-6">
              <div class="flex items-start gap-4 mb-4">
                <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#BF953F]/20 to-[#B38728]/20 rounded-2xl flex items-center justify-center border border-[#BF953F]/30 group-hover:border-[#BF953F]/50 transition-all duration-300">
                  <Icon icon={iconDetails.icon} width="28" color="#BF953F" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-[#FCF6BA] text-xl mb-2 line-clamp-2 group-hover:text-white transition-colors duration-300">{link.title}</h3>
                  <div class="flex items-center gap-2 text-slate-400 text-sm">
                    <Icon icon="fa-solid:globe" width="14" color="#64748b" />
                    <span class="truncate">{getDomainName(link.link)}</span>
                  </div>
                </div>
              </div>

              {#if link.description}
                <p class="text-slate-300 text-base leading-relaxed line-clamp-3 group-hover:text-slate-200 transition-colors duration-300">{link.description}</p>
              {/if}
            </header>

            <!-- Card Footer -->
            <footer class="flex items-center justify-between pt-6 border-t border-slate-700/60 group-hover:border-slate-600/60 transition-colors duration-300">
              <a
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 text-[#BF953F] hover:text-[#FCF6BA] transition-all duration-300 text-base font-semibold group/link"
              >
                <span>Visit Site</span>
                <ExternalLink class="w-5 h-5 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform duration-300" />
              </a>

              <div class="flex items-center gap-3">
                <button
                  onclick={() => openLinkModal(link)}
                  class="p-3 rounded-xl bg-slate-700/60 hover:bg-[#BF953F]/20 border border-slate-600/60 hover:border-[#BF953F]/50 transition-all duration-300 hover:scale-110 group/edit"
                  title="Edit link"
                >
                  <Edit class="w-5 h-5 text-slate-400 group-hover/edit:text-[#BF953F] transition-colors duration-300" />
                </button>

                <form method="POST" action="?/deleteLink" use:enhance>
                  <input type="hidden" name="id" value={link.id} />
                  <button
                    type="submit"
                    class="p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 transition-all duration-300 hover:scale-110 group/delete"
                    title="Delete link"
                    onclick={(e) => {
                      if (!confirm('Are you sure you want to delete this link?')) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <Trash2 class="w-5 h-5 text-red-400 group-hover/delete:text-red-300 transition-colors duration-300" />
                  </button>
                </form>
              </div>
            </footer>
          </article>
        {/each}
      </div>

      {#if data.links.length === 0}
        <div class="text-center py-24">
          <div class="relative w-32 h-32 bg-gradient-to-br from-[#BF953F]/20 to-[#B38728]/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-[#BF953F]/40 shadow-xl shadow-[#BF953F]/10">
            <Icon icon="fa-solid:link" width="56" color="#BF953F" />
            <div class="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#FCF6BA] to-[#BF953F] rounded-full flex items-center justify-center">
              <PlusCircle class="w-5 h-5 text-black" />
            </div>
          </div>
          <h3 class="text-3xl font-bold text-[#FCF6BA] mb-4">Ready to Start Linking?</h3>
          <p class="text-slate-300 text-lg max-w-lg mx-auto leading-relaxed mb-8">
            Create your first link to begin building your curated collection. Share your favorite sites, tools, and resources.
          </p>
          <button
            onclick={() => openLinkModal()}
            class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#BF953F] to-[#B38728] hover:from-[#B38728] hover:to-[#BF953F] text-black font-bold rounded-2xl hover:shadow-xl hover:shadow-[#BF953F]/30 transition-all duration-300 hover:scale-105"
          >
            <PlusCircle class="w-6 h-6" />
            <span class="text-lg">Create Your First Link</span>
          </button>
        </div>
      {/if}
    </div>
  {/if}

  <!-- Shop Tab -->
  {#if activeTab === 'shop'}
    <div class="space-y-8">
      <!-- Enhanced Shop Actions -->
      <div class="flex flex-wrap justify-center gap-6 mb-12">
        <button
          onclick={() => addItem()}
          class="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#BF953F] to-[#B38728] hover:from-[#B38728] hover:to-[#BF953F] text-black font-bold rounded-2xl hover:shadow-xl hover:shadow-[#BF953F]/30 transition-all duration-300 hover:scale-105"
        >
          <PlusCircle class="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          <span class="text-lg">Add New Item</span>
        </button>
        <button
          onclick={() => addCategory()}
          class="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#BF953F] to-[#B38728] hover:from-[#B38728] hover:to-[#BF953F] text-black font-bold rounded-2xl hover:shadow-xl hover:shadow-[#BF953F]/30 transition-all duration-300 hover:scale-105"
        >
          <PlusCircle class="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          <span class="text-lg">Add Category</span>
        </button>
      </div>

      <!-- Categories -->
      <div class="space-y-6">
        <h2 class="text-2xl font-bold text-[#FCF6BA] text-center">Categories</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each categories as category (category.id)}
            {@const categorySubcategories = getSubcategoriesForCategory(category.id)}
            <div class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-[#FCF6BA]">{category.tag}</h3>
                <div class="flex items-center gap-2">
                  <button
                    onclick={() => editCategory(category)}
                    class="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
                  >
                    <Edit class="w-4 h-4 text-slate-400" />
                  </button>
                  <form method="POST" action="?/deleteCategory" use:enhance>
                    <input type="hidden" name="id" value={category.id} />
                    <button
                      type="submit"
                      class="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                      onclick={(e) => {
                        if (!confirm('Are you sure? This will delete all items in this category.')) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <Trash2 class="w-4 h-4 text-red-400" />
                    </button>
                  </form>
                </div>
              </div>

              <!-- Subcategories -->
              {#if categorySubcategories.length > 0}
                <div class="space-y-2">
                  {#each categorySubcategories as subcategory (subcategory.id)}
                    <div class="flex items-center justify-between bg-slate-700/50 rounded-lg p-2">
                      <span class="text-slate-300 text-sm">{subcategory.name}</span>
                      <form method="POST" action="?/deleteSubcategory" use:enhance>
                        <input type="hidden" name="id" value={subcategory.id} />
                        <button
                          type="submit"
                          class="p-1 rounded hover:bg-red-500/20 transition-colors"
                          onclick={(e) => {
                            if (!confirm('Are you sure?')) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <X class="w-3 h-3 text-red-400" />
                        </button>
                      </form>
                    </div>
                  {/each}
                </div>
              {/if}

              <!-- Add Subcategory -->
              <form method="POST" action="?/addSubcategory" use:enhance class="space-y-2">
                <input type="hidden" name="category_id" value={category.id} />
                <input
                  type="text"
                  name="name"
                  placeholder="Add subcategory..."
                  class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-[#FCF6BA] placeholder-slate-400 text-sm"
                />
                <button
                  type="submit"
                  class="w-full px-3 py-2 bg-gradient-to-r from-[#BF953F] to-[#B38728] hover:from-[#B38728] hover:to-[#BF953F] text-black font-medium rounded text-sm transition-all duration-200"
                >
                  Add Subcategory
                </button>
              </form>
            </div>
          {/each}
        </div>
      </div>

      <!-- Enhanced Shop Items -->
      <div class="space-y-8">
        <h2 class="text-3xl font-bold text-[#FCF6BA] text-center mb-8">Shop Items</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {#each items as item (item.id)}
            <article class="group bg-slate-800/60 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-8 hover:shadow-2xl hover:shadow-[#BF953F]/15 hover:border-[#BF953F]/60 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1" in:fade={{ duration: 300 }}>
              <!-- Item Header -->
              <header class="mb-6">
                <div class="flex items-start gap-4 mb-4">
                  <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#BF953F]/20 to-[#B38728]/20 rounded-2xl flex items-center justify-center border border-[#BF953F]/30 group-hover:border-[#BF953F]/50 transition-all duration-300">
                    <ShoppingBag class="w-7 h-7 text-[#BF953F]" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-[#FCF6BA] text-xl mb-3 line-clamp-2 group-hover:text-white transition-colors duration-300">{item.name}</h3>
                    <div class="text-2xl font-bold text-[#BF953F] mb-2">{formatPrice(item.price)}</div>
                  </div>
                </div>

                <!-- Item Details -->
                <div class="space-y-2 mb-4">
                  <div class="flex items-center gap-2 text-slate-300 text-sm">
                    <Icon icon="fa-solid:tag" width="14" color="#64748b" />
                    <span>{getCategoryName(item.category_id)}</span>
                    {#if item.subcategory_id}
                      <span class="text-slate-500">•</span>
                      <span class="text-slate-400">{getSubcategoryName(item.subcategory_id)}</span>
                    {/if}
                  </div>
                </div>

                {#if item.description}
                  <p class="text-slate-300 text-base leading-relaxed line-clamp-3 group-hover:text-slate-200 transition-colors duration-300">{item.description}</p>
                {/if}
              </header>

              <!-- Item Footer -->
              <footer class="flex items-center justify-between pt-6 border-t border-slate-700/60 group-hover:border-slate-600/60 transition-colors duration-300">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 text-[#BF953F] hover:text-[#FCF6BA] transition-all duration-300 text-base font-semibold group/link"
                >
                  <span>View Item</span>
                  <ExternalLink class="w-5 h-5 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform duration-300" />
                </a>

                <div class="flex items-center gap-3">
                  <button
                    onclick={() => editItem(item)}
                    class="p-3 rounded-xl bg-slate-700/60 hover:bg-[#BF953F]/20 border border-slate-600/60 hover:border-[#BF953F]/50 transition-all duration-300 hover:scale-110 group/edit"
                    title="Edit item"
                  >
                    <Edit class="w-5 h-5 text-slate-400 group-hover/edit:text-[#BF953F] transition-colors duration-300" />
                  </button>

                  <form method="POST" action="?/deleteItem" use:enhance>
                    <input type="hidden" name="id" value={item.id} />
                    <button
                      type="submit"
                      class="p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 transition-all duration-300 hover:scale-110 group/delete"
                      title="Delete item"
                      onclick={(e) => {
                        if (!confirm('Are you sure you want to delete this item?')) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <Trash2 class="w-5 h-5 text-red-400 group-hover/delete:text-red-300 transition-colors duration-300" />
                    </button>
                  </form>
                </div>
              </footer>
            </article>
          {/each}
        </div>

        {#if items.length === 0}
          <div class="text-center py-24">
            <div class="relative w-32 h-32 bg-gradient-to-br from-[#BF953F]/20 to-[#B38728]/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-[#BF953F]/40 shadow-xl shadow-[#BF953F]/10">
              <ShoppingBag class="w-16 h-16 text-[#BF953F]" />
              <div class="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#FCF6BA] to-[#BF953F] rounded-full flex items-center justify-center">
                <PlusCircle class="w-5 h-5 text-black" />
              </div>
            </div>
            <h3 class="text-3xl font-bold text-[#FCF6BA] mb-4">Ready to Build Your Shop?</h3>
            <p class="text-slate-300 text-lg max-w-lg mx-auto leading-relaxed mb-8">
              Create your first shop item to start selling. Add products, set prices, and organize with categories.
            </p>
            <button
              onclick={() => addItem()}
              class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#BF953F] to-[#B38728] hover:from-[#B38728] hover:to-[#BF953F] text-black font-bold rounded-2xl hover:shadow-xl hover:shadow-[#BF953F]/30 transition-all duration-300 hover:scale-105"
            >
              <PlusCircle class="w-6 h-6" />
              <span class="text-lg">Create Your First Item</span>
            </button>
          </div>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Enhanced Footer -->
  <footer class="mt-auto pt-16 border-t border-slate-700/60">
    <div class="text-center">
      <div class="mb-6">
        <div class="w-12 h-12 bg-gradient-to-br from-[#BF953F]/20 to-[#B38728]/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-[#BF953F]/30">
          <Icon icon="fa-solid:crown" width="24" color="#BF953F" />
        </div>
        <p class="text-slate-400 text-lg font-medium mb-2">
          © {currentYear} RGBUNION. All Rights Reserved.
        </p>
        <p class="text-slate-500 text-sm">
          Admin Dashboard - Empowering seamless content management
        </p>
      </div>

      <div class="flex justify-center items-center gap-6 text-slate-500 text-sm">
        <button
          onclick={() => $showAccountModal = true}
          class="hover:text-[#BF953F] transition-colors duration-300 flex items-center gap-2"
        >
          <Icon icon="fa-solid:user-cog" width="16" />
          <span>Account Settings</span>
        </button>
        <div class="w-1 h-4 bg-slate-600 rounded-full"></div>
        <span class="flex items-center gap-2">
          <Icon icon="fa-solid:shield-alt" width="16" />
          <span>Secure Admin Portal</span>
        </span>
      </div>
    </div>
  </footer>
</div>
</div>

<!-- Link Modal -->
{#if showLinkModal}
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" tabindex="-1" onclick={(e) => { if (e.target === e.currentTarget) showLinkModal = false; }} onkeydown={(e) => { if (e.key === 'Escape') showLinkModal = false; }}>
    <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md" in:scale={{ duration: 300 }}>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-[#FCF6BA]">
          {editingLinkId ? 'Edit Link' : 'Add Link'}
        </h2>
        <button onclick={() => showLinkModal = false} class="text-slate-400 hover:text-white transition-colors">
          <X class="w-6 h-6" />
        </button>
      </div>

      <form method="POST" action={editingLinkId ? "?/updateLink" : "?/addLink"} use:enhance class="space-y-4">
        {#if editingLinkId}
          <input type="hidden" name="id" value={editingLinkId} />
        {/if}

        <div>
          <label for="url" class="block text-sm font-medium text-slate-300 mb-2">URL *</label>
          <input
            type="url"
            id="url"
            name="url"
            bind:value={url}
            required
            class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-[#FCF6BA] placeholder-slate-400 focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 transition-all duration-200"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label for="title" class="block text-sm font-medium text-slate-300 mb-2">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            bind:value={title}
            required
            class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-[#FCF6BA] placeholder-slate-400 focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 transition-all duration-200"
            placeholder="Link title"
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-slate-300 mb-2">Description</label>
          <textarea
            id="description"
            name="description"
            bind:value={description}
            rows="3"
            class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-[#FCF6BA] placeholder-slate-400 focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 transition-all duration-200 resize-none"
            placeholder="Optional description"
          ></textarea>
        </div>

        {#if form?.message && form?.action === (editingLinkId ? 'updateLink' : 'addLink')}
          <div class="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
            <p class="text-red-400 text-sm font-medium">{form.message}</p>
          </div>
        {/if}

        <div class="flex gap-3 pt-4">
          <button
            type="button"
            onclick={() => showLinkModal = false}
            class="flex-1 py-2 px-4 rounded-lg font-medium border border-slate-600 text-slate-300 bg-slate-700 hover:bg-slate-600 transition-all duration-200 text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="flex-1 py-2 px-4 rounded-lg font-medium bg-gradient-to-r from-[#BF953F] to-[#B38728] text-black hover:shadow-lg transition-all duration-200"
          >
            {editingLinkId ? 'Update' : 'Add'} Link
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Shop Item Modal -->
{#if showShopModal}
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" tabindex="-1" onclick={(e) => { if (e.target === e.currentTarget) showShopModal = false; }} onkeydown={(e) => { if (e.key === 'Escape') showShopModal = false; }}>
    <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" in:scale={{ duration: 300 }}>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-[#FCF6BA]">
          {#if isAddingCategory}
            {editingCategoryId ? 'Edit Category' : 'Add Category'}
          {:else}
            {editingItem ? 'Edit Item' : 'Add Item'}
          {/if}
        </h2>
        <button onclick={() => { showShopModal = false; isAddingCategory = false; }} class="text-slate-400 hover:text-white transition-colors">
          <X class="w-6 h-6" />
        </button>
      </div>

      {#if !isAddingCategory}
        <!-- Enhanced Item Form -->
        <form
          method="POST"
          action={editingItem ? "?/updateItem" : "?/addItem"}
          use:enhance
          class="space-y-5"
        >
          {#if editingItem}
            <input type="hidden" name="id" value={editingItem} />
          {/if}

          <!-- Category Selection -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-300" for="category">Category *</label>
            <select
              id="category"
              name="category_id"
              bind:value={selectedCategoryId}
              required
              class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-[#FCF6BA] focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 focus:bg-slate-700 transition-all duration-200"
            >
              <option value="">Select a category</option>
              {#each categories as category}
                <option value={category.id}>{category.tag}</option>
              {/each}
            </select>
          </div>

          <!-- Subcategory Selection -->
          {#if selectedCategoryId}
            {@const availableSubcategories = getSubcategoriesForCategory(parseInt(selectedCategoryId))}
            {#if availableSubcategories.length > 0}
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-300" for="subcategory">Subcategory</label>
                <select
                  id="subcategory"
                  name="subcategory_id"
                  bind:value={selectedSubcategoryId}
                  class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-[#FCF6BA] focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 focus:bg-slate-700 transition-all duration-200"
                >
                  <option value="">No subcategory</option>
                  {#each availableSubcategories as subcategory}
                    <option value={subcategory.id}>{subcategory.name}</option>
                  {/each}
                </select>
              </div>
            {/if}
          {/if}

          <!-- Item Name -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-300" for="itemName">Item Name *</label>
            <input
              type="text"
              id="itemName"
              name="name"
              bind:value={itemName}
              required
              placeholder="Enter the item name"
              class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-[#FCF6BA] placeholder-slate-400 focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 focus:bg-slate-700 transition-all duration-200"
            />
          </div>

          <!-- Item Price -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-300" for="itemPrice">Price (USD) *</label>
            <input
              type="number"
              id="itemPrice"
              name="price"
              bind:value={itemPrice}
              required
              step="0.01"
              min="0"
              placeholder="0.00"
              class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-[#FCF6BA] placeholder-slate-400 focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 focus:bg-slate-700 transition-all duration-200"
            />
          </div>

          <!-- Item Description -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-300" for="itemDescription">Description</label>
            <textarea
              id="itemDescription"
              name="description"
              bind:value={itemDescription}
              rows="4"
              placeholder="Describe the item (optional)"
              class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-[#FCF6BA] placeholder-slate-400 focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 focus:bg-slate-700 transition-all duration-200 resize-none"
            ></textarea>
          </div>

          <!-- Item Link -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-300" for="link">Item Link *</label>
            <input
              type="url"
              id="link"
              name="link"
              bind:value={itemLink}
              required
              placeholder="https://example.com/product"
              class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-[#FCF6BA] placeholder-slate-400 focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 focus:bg-slate-700 transition-all duration-200"
            />
          </div>

          <!-- Error Message -->
          {#if form?.message && (form?.action === 'addItem' || form?.action === 'updateItem')}
            <div class="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
              <p class="text-red-400 text-sm font-medium">{form.message}</p>
            </div>
          {/if}

          <!-- Action Buttons -->
          <div class="flex flex-col-reverse sm:flex-row gap-3 pt-6">
            <button
              type="button"
              onclick={() => { showShopModal = false; isAddingCategory = false; }}
              class="flex-1 py-3 px-4 rounded-lg font-medium border border-slate-600 text-slate-300 bg-slate-700 hover:bg-slate-600 transition-all duration-200 text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 py-3 px-4 rounded-lg font-medium bg-gradient-to-r from-[#BF953F] to-[#B38728] text-black hover:shadow-lg hover:scale-[1.02] transition-all duration-200 shadow-md"
            >
              {editingItem ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      {:else}
        <!-- Category Form -->
        <form method="POST" action={editingCategoryId ? "?/updateCategory" : "?/addCategory"} use:enhance class="space-y-4">
          {#if editingCategoryId}
            <input type="hidden" name="id" value={editingCategoryId} />
          {/if}

          <div>
            <label for="categoryTag" class="block text-sm font-medium text-slate-300 mb-2">Category Name *</label>
            <input
              type="text"
              id="categoryTag"
              name="tag"
              bind:value={categoryTag}
              required
              class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-[#FCF6BA] placeholder-slate-400 focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 transition-all duration-200"
              placeholder="Category name"
            />
          </div>

          {#if form?.message && (form?.action === 'addCategory' || form?.action === 'updateCategory')}
            <div class="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
              <p class="text-red-400 text-sm font-medium">{form.message}</p>
            </div>
          {/if}

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              onclick={() => { showShopModal = false; isAddingCategory = false; }}
              class="flex-1 py-2 px-4 rounded-lg font-medium border border-slate-600 text-slate-300 bg-slate-700 hover:bg-slate-600 transition-all duration-200 text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 py-2 px-4 rounded-lg font-medium bg-gradient-to-r from-[#BF953F] to-[#B38728] text-black hover:shadow-lg transition-all duration-200"
            >
              {editingCategoryId ? 'Update' : 'Add'} Category
            </button>
          </div>
        </form>
      {/if}
    </div>
  </div>
{/if}

<!-- Account Modal -->
<AccountModal showModal={$showAccountModal} onClose={closeAccountModal} {form} />