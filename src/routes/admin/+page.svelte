<script>
  import { fade, fly } from "svelte/transition";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { PlusCircle, Trash2, Edit, X, LogOut, Key, ArrowLeft, UserCog, ShoppingBag, AlertTriangle } from "lucide-svelte";
  import Icon from '@iconify/svelte';

  // Function to determine the correct icon for a link
  const getIconDetails = (url) => {
    if (!url) return { icon: 'fa-solid fa-link', isIconify: false };
    
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
    
    // Default fallback
    return { icon: 'fa-solid fa-link', isIconify: false };
  };

  const { data, form } = $props();

  let links = $state(data.links || []);
  let showToast = $state(false);
  let toastMessage = $state("");
  let toastType = $state("success");

  $effect(() => {
    links = data.links || [];
  });

  $effect(() => {
    categories = data.categories || [];
    subcategories = data.subcategories || [];
    items = data.items || [];
  });

  $effect(() => {
    if (form?.success) {
      if (form.action === "addLink") {
        showModal = false;
        showSuccessToast("Link added successfully");
      } else if (form.action === "updateLink") {
        showModal = false;
        showSuccessToast("Link updated successfully");
      } else if (form.action === "deleteLink") {
        showDeleteConfirm = false;
        showSuccessToast("Link deleted successfully");
      } else if (form.action === 'addCategory' || form.action === 'updateCategory') {
        showShopModal = false;
        showSuccessToast(form.action === 'addCategory' ? 'Category added successfully' : 'Category updated successfully');
      } else if (form.action === 'addSubcategory' || form.action === 'updateSubcategory') {
        showShopModal = false;
        showSuccessToast(form.action === 'addSubcategory' ? 'Subcategory added successfully' : 'Subcategory updated successfully');
      } else if (form.action === 'deleteSubcategory') {
        showDeleteConfirm = false;
        showSuccessToast('Subcategory deleted successfully');
      } else if (form.action === 'addItem' || form.action === 'updateItem') {
        showShopModal = false;
        showSuccessToast(form.action === 'addItem' ? 'Item added successfully' : 'Item updated successfully');
      } else if (form.action === 'deleteCategory' || form.action === 'deleteItem') {
        showDeleteConfirm = false;
        showSuccessToast('Item deleted successfully');
      }
    }
  });

  let showModal = $state(false);
  let editingLink = $state(null);
  let url = $state("");
  let title = $state("");
  let description = $state("");

  function handleAddLink() {
    url = "";
    title = "";
    description = "";
    editingLink = null;
    showModal = true;
  }

  function handleEditLink(link) {
    url = link.link;
    title = link.title || "";
    description = link.description || "";
    editingLink = link.id;
    showModal = true;
  }

  function handleCloseModal() {
    showModal = false;
  }

  function handleLogout() {
    // Navigate to logout endpoint
    goto("/logout");
  }

  function handleAccount() {
    goto("/admin/account");
  }

  function showSuccessToast(message) {
    toastMessage = message;
    toastType = "success";
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
  let editingSubcategoryId = $state(null);
  let isAddingSubcategory = $state(false);
  let showSubcategoryFields = $state(false);
  let subcategoryFields = $state([{ name: '' }]);

  let showDeleteConfirm = $state(false);
  let deleteType = $state(''); // 'link', 'category', or 'item'
  let deleteItemId = $state(null);
  let deleteItemName = $state('');

  function handleAddCategory() {
    categoryTag = '';
    editingCategoryId = null;
    isAddingCategory = true;
    editingItem = null;
    showShopModal = true;
  }

  function handleAddSubcategory() {
    if (categories.length === 0) {
      showToast = true;
      toastType = 'error';
      toastMessage = 'Please add at least one category first';
      return;
    }
    subcategoryName = '';
    selectedCategoryId = categories[0].id;
    editingSubcategoryId = null;
    isAddingSubcategory = true;
    isAddingCategory = false;
    editingItem = null;
    showShopModal = true;
  }

  function handleEditCategory(category) {
    categoryTag = category.tag;
    editingCategoryId = category.id;
    isAddingCategory = true;
    editingItem = null;
    showShopModal = true;
  }

  function handleEditSubcategory(subcategory) {
    subcategoryName = subcategory.name;
    selectedCategoryId = subcategory.category_id;
    editingSubcategoryId = subcategory.id;
    isAddingSubcategory = true;
    isAddingCategory = false;
    editingItem = null;
    showShopModal = true;
  }

  function handleAddItem() {
    if (categories.length === 0) {
      showToast = true;
      toastType = 'error';
      toastMessage = 'Please add at least one category first';
      return;
    }
    itemName = '';
    itemPrice = '';
    itemLink = '';
    selectedCategoryId = categories[0].id; // Set first category as default
    selectedSubcategoryId = '';
    editingItem = null;
    isAddingCategory = false;
    isAddingSubcategory = false;
    editingCategoryId = null;
    editingSubcategoryId = null;
    showShopModal = true;
  }

  function handleEditItem(item) {
    itemName = item.name;
    itemPrice = Math.round(item.price / 100).toString(); // Convert cents to dollars and round to whole number
    itemLink = item.link;
    selectedCategoryId = item.category_id;
    editingItem = item.id;
    isAddingCategory = false;
    editingCategoryId = null;
    showShopModal = true;
  }

  function handleDeleteConfirm(type, id, name) {
    deleteType = type;
    deleteItemId = id;
    deleteItemName = name;
    showDeleteConfirm = true;
  }

  function addSubcategoryField() {
    subcategoryFields = [...subcategoryFields, { name: '' }];
  }

  function removeSubcategoryField(index) {
    subcategoryFields = subcategoryFields.filter((_, i) => i !== index);
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</svelte:head>

<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes shrinkWidth {
    from { width: 100%; }
    to { width: 0%; }
  }

  .animate-fadeIn {
    animation: fadeIn 0.4s ease-out;
  }

  .animate-shrink-width {
    animation: shrinkWidth 3s linear;
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

  /* Custom focus styles for better accessibility */
  :global(.focus-ring:focus) {
    outline: 2px solid #BF953F !important;
    outline-offset: 2px !important;
  }
</style>

<!-- Modern dark slate background with subtle pattern -->
<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
  <!-- Subtle Background Pattern -->
  <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNCRjk1M0YiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

<div class="relative z-10 p-4 sm:p-6 max-w-7xl mx-auto min-h-screen flex flex-col">
  <!-- Enhanced Admin Controls with dark theme -->
  <div class="absolute top-6 right-6 flex flex-col sm:flex-row gap-3">
    <button onclick={handleAccount} class="flex items-center justify-center sm:justify-start gap-2 py-3 px-4 bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 text-[#FCF6BA] rounded-lg hover:bg-[#BF953F]/20 hover:border-[#BF953F]/50 transition-all duration-300 text-sm font-medium min-h-[44px] group">
      <UserCog size={18} class="transition-colors group-hover:text-[#BF953F]" />
      <span class="hidden sm:inline transition-colors group-hover:text-[#BF953F]">Account</span>
    </button>
    <button onclick={handleLogout} class="flex items-center justify-center sm:justify-start gap-2 py-3 px-4 bg-slate-700/50 backdrop-blur-sm border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300 text-sm font-medium min-h-[44px] group">
      <LogOut size={18} class="transition-colors group-hover:text-red-400" />
      <span class="hidden sm:inline transition-colors group-hover:text-red-400">Logout</span>
    </button>
  </div>

  <!-- Back to Home with enhanced styling -->
  <div class="mb-8 mt-20">
    <a href="/" class="inline-flex items-center gap-2 text-[#BF953F] hover:text-[#FCF6BA] transition-all duration-300 group">
      <ArrowLeft size={20} class="transition-transform group-hover:-translate-x-1" />
      <span class="font-medium">Back to Home</span>
    </a>
  </div>

  <!-- Page Header -->
  <div class="text-center mb-12">
    <div class="w-20 h-20 bg-gradient-to-br from-[#BF953F]/20 to-[#B38728]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#BF953F]/30">
      <svg class="w-10 h-10 text-[#BF953F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
      </svg>
    </div>
    <h1 class="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] mb-4" style="font-family: 'Cinzel', serif;">
      Admin Dashboard
    </h1>
    <p class="text-slate-300 text-lg max-w-2xl mx-auto">
      Manage community links, shop items, and system settings
    </p>
  </div>

  <!-- Enhanced Tab Navigation with dark theme -->
  <div class="relative mb-8">
    <div class="flex bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-1 shadow-xl">
      <!-- Tab Indicators -->
      <div
        class="absolute top-1 h-12 bg-gradient-to-r from-[#BF953F] to-[#B38728] rounded-lg shadow-md transition-all duration-300 ease-in-out"
        style="width: calc(50% - 4px); left: {activeTab === 'links' ? '4px' : 'calc(50% + 0px)'}; box-shadow: 0 4px 12px rgba(191, 149, 63, 0.4);"
      ></div>

      <!-- Links Tab -->
      <button
        class="relative z-10 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-all duration-300 flex-1 {activeTab === 'links' ? 'text-black' : 'text-slate-300 hover:text-[#FCF6BA]'}"
        onclick={() => activeTab = 'links'}
        role="tab"
        aria-selected={activeTab === 'links'}
        aria-controls="links-panel"
      >
        <Icon icon="fa-solid:link" width="18" class="transition-all duration-300" />
        <span class="text-sm font-semibold">Community Links</span>
      </button>

      <!-- Shop Tab -->
      <button
        class="relative z-10 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-all duration-300 flex-1 {activeTab === 'shop' ? 'text-black' : 'text-slate-300 hover:text-[#FCF6BA]'}"
        onclick={() => activeTab = 'shop'}
        role="tab"
        aria-selected={activeTab === 'shop'}
        aria-controls="shop-panel"
      >
        <ShoppingBag size={18} class="transition-all duration-300" />
        <span class="text-sm font-semibold">Shop Management</span>
      </button>
    </div>
  </div>

  {#if activeTab === 'links'}
    <!-- Enhanced Links Management Panel -->
    <div id="links-panel" role="tabpanel" aria-labelledby="links-tab" class="animate-fadeIn">
      <div class="mb-8">
        <button
          onclick={handleAddLink}
          class="group flex items-center justify-center gap-3 p-4 mb-6 bg-gradient-to-r from-[#BF953F] to-[#B38728] hover:from-[#B38728] hover:to-[#BF953F] text-black border-none rounded-xl font-semibold w-full hover:shadow-lg hover:shadow-[#BF953F]/25 hover:scale-[1.02] transition-all duration-300 shadow-md"
        >
          <PlusCircle size={22} class="transition-transform group-hover:rotate-90 duration-300" />
          <span>Add New Community Link</span>
        </button>
      </div>

    <div class="flex flex-col gap-6 mb-8">
      {#if links && links.length > 0}
        {#each links as link (link.id)}
          <div class="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 hover:shadow-2xl hover:shadow-[#BF953F]/10 hover:border-[#BF953F]/50 transition-all duration-300 hover:scale-[1.01]">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 space-y-3">
                <!-- Header with icon and title -->
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-gradient-to-br from-[#BF953F]/20 to-[#B38728]/20 rounded-xl flex items-center justify-center border border-[#BF953F]/30">
                    {#if getIconDetails(link.link).isIconify}
                      <Icon
                        icon={getIconDetails(link.link).icon}
                        width="24"
                        height="24"
                        color="#BF953F"
                      />
                    {:else}
                      <i class={`${getIconDetails(link.link).icon} text-[#BF953F] text-xl`}></i>
                    {/if}
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-[#FCF6BA] text-lg group-hover:text-white transition-colors">{link.title}</h4>
                  </div>
                </div>

                <!-- Link URL -->
                <div class="pl-16">
                  <a href={link.link} target="_blank" rel="noopener noreferrer"
                     class="text-[#BF953F] hover:text-[#FCF6BA] text-sm font-medium hover:underline break-all inline-flex items-center gap-2 group-hover:text-[#FCF6BA] transition-colors">
                    {link.link}
                    <svg class="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </a>
                </div>

                <!-- Description -->
                {#if link.description}
                  <div class="pl-16">
                    <p class="text-slate-300 text-sm leading-relaxed">{link.description}</p>
                  </div>
                {/if}
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-2">
                <button
                  class="p-3 text-[#BF953F] hover:text-black hover:bg-[#BF953F]/20 hover:border-[#BF953F] border border-transparent rounded-lg transition-all duration-300 hover:shadow-md backdrop-blur-sm"
                  onclick={() => handleEditLink(link)}
                  title="Edit link"
                >
                  <Edit size={18} />
                </button>
                <button
                  class="p-3 text-red-400 hover:text-white hover:bg-red-500/20 hover:border-red-400 border border-transparent rounded-lg transition-all duration-300 hover:shadow-md backdrop-blur-sm"
                  onclick={() => handleDeleteConfirm('link', link.id, link.title)}
                  title="Delete link"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        {/each}
      {:else}
        <div class="text-center py-16">
          <div class="w-20 h-20 bg-gradient-to-br from-[#BF953F]/20 to-[#B38728]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#BF953F]/30">
            <Icon icon="fa-solid:link" width="32" color="#BF953F" />
          </div>
          <h3 class="text-[#FCF6BA] font-semibold text-xl mb-3">No community links yet</h3>
          <p class="text-slate-400 text-base mb-8 max-w-md mx-auto">Create your first community link to start building your social presence and connecting with your audience.</p>
          <button onclick={handleAddLink} class="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#BF953F] to-[#B38728] hover:from-[#B38728] hover:to-[#BF953F] text-black rounded-lg hover:shadow-lg hover:shadow-[#BF953F]/25 transition-all duration-300 text-sm font-semibold">
            <PlusCircle size={18} /> Add Your First Community Link
          </button>
        </div>
      {/if}
    </div>
    </div>
  {:else}
    <!-- Enhanced Shop Management Panel -->
    <div id="shop-panel" role="tabpanel" aria-labelledby="shop-tab" class="animate-fadeIn">
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-8">
        <!-- Enhanced Categories Section -->
        <div class="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-[#FCF6BA]/40 to-[#BF953F]/30 rounded-lg flex items-center justify-center">
              <Icon icon="fa-solid:tags" width="20" color="#BF953F" />
            </div>
            <h3 class="text-xl font-semibold text-gray-800">Categories</h3>
          </div>

          <button onclick={handleAddCategory} class="group flex items-center justify-center gap-3 p-4 mb-6 bg-gradient-to-r from-[#BF953F] to-[#B38728] text-white border-none rounded-lg font-medium w-full hover:shadow-md hover:scale-[1.02] transition-all duration-200">
            <PlusCircle size={20} class="transition-transform group-hover:rotate-90 duration-200" /> Add Category
          </button>
        
          <div class="space-y-3">
            {#if categories && categories.length > 0}
              {#each categories as category (category.id)}
                <div class="group bg-gradient-to-r from-white to-gray-50/50 border border-gray-200/60 rounded-lg p-4 hover:shadow-md hover:border-[#FCF6BA]/60 transition-all duration-200">
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <div class="w-3 h-3 bg-[#BF953F] rounded-full"></div>
                        <h4 class="font-semibold text-gray-800">{category.tag}</h4>
                      </div>
                      {#if subcategories.filter(s => s.category_id === category.id).length > 0}
                        <div class="ml-6">
                          <div class="flex flex-wrap gap-2">
                            {#each subcategories.filter(s => s.category_id === category.id) as subcategory}
                              <span class="px-2 py-1 bg-[#FCF6BA]/40 text-[#B38728] text-xs rounded-md border border-[#BF953F]/20">
                                {subcategory.name}
                              </span>
                            {/each}
                          </div>
                        </div>
                      {/if}
                    </div>
                    <div class="flex gap-1">
                      <button
                        class="p-2 text-[#BF953F] hover:text-white hover:bg-[#BF953F] rounded-md transition-all duration-200"
                        onclick={() => handleEditCategory(category)}
                        title="Edit category"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        class="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-md transition-all duration-200"
                        onclick={() => handleDeleteConfirm('category', category.id, category.tag)}
                        title="Delete category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              {/each}
            {:else}
              <div class="text-center py-8">
                <div class="w-12 h-12 bg-gradient-to-br from-[#FCF6BA]/30 to-[#BF953F]/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon icon="fa-solid:tags" width="18" color="#BF953F" />
                </div>
                <p class="text-gray-500 text-sm">No categories yet. Add your first category above.</p>
              </div>
            {/if}
          </div>
        </div>

        <!-- Enhanced Items Section -->
        <div class="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-[#FCF6BA]/40 to-[#BF953F]/30 rounded-lg flex items-center justify-center">
              <ShoppingBag size={20} color="#BF953F" />
            </div>
            <h3 class="text-xl font-semibold text-gray-800">Items</h3>
          </div>

          <button onclick={handleAddItem} class="group flex items-center justify-center gap-3 p-4 mb-6 bg-gradient-to-r from-[#BF953F] to-[#B38728] text-white border-none rounded-lg font-medium w-full hover:shadow-md hover:scale-[1.02] transition-all duration-200">
            <PlusCircle size={20} class="transition-transform group-hover:rotate-90 duration-200" /> Add Item
          </button>
        
          <div class="space-y-3">
            {#if items && items.length > 0}
              {#each items as item (item.id)}
                <div class="group bg-gradient-to-r from-white to-gray-50/50 border border-gray-200/60 rounded-lg p-4 hover:shadow-md hover:border-[#FCF6BA]/60 transition-all duration-200">
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1 space-y-2">
                      <!-- Item name and price -->
                      <div class="flex items-center gap-3">
                        <h4 class="font-semibold text-gray-800">{item.name}</h4>
                        <div class="px-3 py-1 bg-gradient-to-r from-[#BF953F] to-[#B38728] text-white text-sm font-semibold rounded-full">
                          ${Math.round(item.price / 100)}
                        </div>
                      </div>

                      <!-- Category and subcategory -->
                      <div class="flex flex-wrap gap-2">
                        <span class="px-2 py-1 bg-[#FCF6BA]/40 text-[#B38728] text-xs rounded-md border border-[#BF953F]/20">
                          {categories.find(c => c.id === item.category_id)?.tag}
                        </span>
                        {#if item.subcategory_id}
                          <span class="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200">
                            {subcategories.find(s => s.id === item.subcategory_id)?.name}
                          </span>
                        {/if}
                      </div>

                      <!-- Item link -->
                      <a href={item.link} target="_blank" rel="noopener noreferrer"
                         class="text-[#BF953F] hover:text-[#B38728] text-sm font-medium hover:underline inline-flex items-center gap-1 transition-colors">
                        {item.link.length > 40 ? item.link.substring(0, 40) + '...' : item.link}
                        <svg class="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                      </a>
                    </div>

                    <!-- Action buttons -->
                    <div class="flex gap-1">
                      <button
                        class="p-2 text-[#BF953F] hover:text-white hover:bg-[#BF953F] rounded-md transition-all duration-200"
                        onclick={() => handleEditItem(item)}
                        title="Edit item"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        class="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-md transition-all duration-200"
                        onclick={() => handleDeleteConfirm('item', item.id, item.name)}
                        title="Delete item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              {/each}
            {:else}
              <div class="text-center py-8">
                <div class="w-12 h-12 bg-gradient-to-br from-[#FCF6BA]/30 to-[#BF953F]/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag size={18} color="#BF953F" />
                </div>
                <p class="text-gray-500 text-sm">No items yet. Add your first item above.</p>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Enhanced Delete Confirmation Modal -->
  {#if showDeleteConfirm}
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4" transition:fade={{ duration: 200 }}>
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-200/50" transition:fly={{ y: 20, duration: 300 }}>
        <div class="p-6">
          <!-- Header -->
          <div class="flex items-start gap-4 mb-6">
            <div class="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center border border-red-200">
              <AlertTriangle class="text-red-500" size={24} />
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Confirm Delete</h3>
              <p class="text-gray-600 text-sm leading-relaxed">
                Are you sure you want to delete {deleteType === 'link' ? 'the link' : deleteType === 'category' ? 'the category' : 'the item'} <span class="font-semibold text-gray-800">"{deleteItemName}"</span>?
                {#if deleteType === 'category'}
                  <br><span class="text-amber-600 font-medium">This will also delete all items in this category.</span>
                {/if}
                <br><span class="text-red-600">This action cannot be undone.</span>
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col-reverse sm:flex-row gap-3">
            <button
              onclick={() => showDeleteConfirm = false}
              class="flex-1 py-3 px-4 rounded-lg font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 text-center"
            >
              Cancel
            </button>
            <form
              method="POST"
              action={`?/delete${deleteType.charAt(0).toUpperCase() + deleteType.slice(1)}`}
              use:enhance
              class="flex-1"
            >
              <input type="hidden" name="id" value={deleteItemId} />
              <button type="submit" class="w-full py-3 px-4 rounded-lg font-medium bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg">
                Delete {deleteType.charAt(0).toUpperCase() + deleteType.slice(1)}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Enhanced Links Modal -->
  {#if showModal}
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4" transition:fade={{ duration: 200 }}>
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-200/50" transition:fly={{ y: 20, duration: 300 }}>
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-[#FCF6BA]/40 to-[#BF953F]/30 rounded-lg flex items-center justify-center">
              <Icon icon="fa-solid:link" width="20" color="#BF953F" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900">
              {editingLink ? "Edit Link" : "Add New Link"}
            </h3>
          </div>
          <button
            onclick={handleCloseModal}
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6">
          <form method="POST" action={editingLink ? "?/updateLink" : "?/addLink"} use:enhance class="space-y-5">
            {#if editingLink}
              <input type="hidden" name="id" value={editingLink} />
            {/if}

            <!-- URL Field -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700" for="url">URL *</label>
              <div class="relative">
                <input
                  type="text"
                  id="url"
                  name="url"
                  bind:value={url}
                  placeholder="https://example.com"
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 focus:bg-white transition-all duration-200"
                  required
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Icon icon="fa-solid:link" width="16" class="text-gray-400" />
                </div>
              </div>
            </div>

            <!-- Title Field -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700" for="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                bind:value={title}
                placeholder="Enter a descriptive title"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 focus:bg-white transition-all duration-200"
                required
              />
            </div>

            <!-- Description Field -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700" for="description">Description</label>
              <textarea
                id="description"
                name="description"
                bind:value={description}
                placeholder="Optional description..."
                rows="3"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 focus:bg-white transition-all duration-200 resize-none"
              ></textarea>
            </div>

            <!-- Error Message -->
            {#if form?.message}
              <div class="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p class="text-red-600 text-sm font-medium">{form.message}</p>
              </div>
            {/if}

            <!-- Action Buttons -->
            <div class="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onclick={handleCloseModal}
                class="flex-1 py-3 px-4 rounded-lg font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex-1 py-3 px-4 rounded-lg font-medium bg-gradient-to-r from-[#BF953F] to-[#B38728] text-white hover:shadow-lg hover:scale-[1.02] transition-all duration-200 shadow-md"
              >
                {editingLink ? "Update Link" : "Add Link"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  {/if}

  <!-- Enhanced Shop Modal -->
  {#if showShopModal}
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4" transition:fade={{ duration: 200 }}>
      <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200/50 max-h-[90vh] overflow-y-auto" transition:fly={{ y: 20, duration: 300 }}>
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-[#FCF6BA]/40 to-[#BF953F]/30 rounded-lg flex items-center justify-center">
              {#if isAddingCategory}
                <Icon icon="fa-solid:tags" width="20" color="#BF953F" />
              {:else}
                <ShoppingBag size={20} color="#BF953F" />
              {/if}
            </div>
            <h3 class="text-xl font-semibold text-gray-900">
              {#if isAddingCategory}
                {editingCategoryId ? 'Edit Category' : 'Add Category'}
              {:else if editingItem}
                Edit Item
              {:else}
                Add Item
              {/if}
            </h3>
          </div>
          <button
            onclick={() => showShopModal = false}
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6">

          {#if isAddingCategory}
            <!-- Enhanced Category Form -->
            <form method="POST" action={editingCategoryId ? "?/updateCategory" : "?/addCategory"} use:enhance class="space-y-6">
              {#if editingCategoryId}
                <input type="hidden" name="id" value={editingCategoryId} />
              {/if}

              <!-- Category Tag Field -->
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700" for="tag">Category Tag *</label>
                <input
                  type="text"
                  id="tag"
                  name="tag"
                  bind:value={categoryTag}
                  placeholder="Enter category name"
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 focus:bg-white transition-all duration-200"
                  required
                />
                {#if form?.message && form.action === 'addCategory'}
                  <div class="p-2 bg-red-50 border border-red-200 rounded-md">
                    <p class="text-red-600 text-sm font-medium">{form.message}</p>
                  </div>
                {/if}
              </div>

              <!-- Subcategories Toggle -->
              <div class="space-y-2">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    bind:checked={showSubcategoryFields}
                    class="w-4 h-4 text-[#BF953F] border-gray-300 rounded focus:ring-[#BF953F] focus:ring-offset-0 transition-colors"
                  />
                  <span class="text-sm font-medium text-gray-700">Add Subcategories (optional)</span>
                </label>
              </div>

              <!-- Subcategory Fields -->
              {#if showSubcategoryFields}
                <div class="pl-6 border-l-3 border-[#BF953F]/30 bg-gradient-to-r from-[#FCF6BA]/10 to-transparent rounded-r-lg pr-4 py-4 space-y-4">
                  {#each subcategoryFields as subcategory, index (index)}
                    <div class="space-y-2">
                      <div class="flex items-center justify-between">
                        <label class="text-sm font-medium text-gray-700" for="subcategory_name_{index}">Subcategory {index + 1}</label>
                        {#if index > 0}
                          <button
                            type="button"
                            onclick={() => removeSubcategoryField(index)}
                            class="p-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200"
                            title="Remove subcategory"
                          >
                            <X size={14} />
                          </button>
                        {/if}
                      </div>
                      <input
                        type="text"
                        id="subcategory_name_{index}"
                        name="subcategory_names[]"
                        bind:value={subcategory.name}
                        placeholder="Enter subcategory name"
                        class="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 transition-all duration-200"
                      />
                    </div>
                  {/each}
                  <button
                    type="button"
                    onclick={addSubcategoryField}
                    class="flex items-center gap-2 text-[#BF953F] hover:text-[#B38728] transition-colors text-sm font-medium"
                  >
                    <PlusCircle size={16} />
                    Add another subcategory
                  </button>
                </div>
              {/if}

              <!-- Action Buttons -->
              <div class="flex flex-col-reverse sm:flex-row gap-3 pt-6">
                <button
                  type="button"
                  onclick={() => showShopModal = false}
                  class="flex-1 py-3 px-4 rounded-lg font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="flex-1 py-3 px-4 rounded-lg font-medium bg-gradient-to-r from-[#BF953F] to-[#B38728] text-white hover:shadow-lg hover:scale-[1.02] transition-all duration-200 shadow-md"
                >
                  {editingCategoryId ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </form>
          {:else}
            <!-- Enhanced Item Form -->
            <form method="POST" action={editingItem ? "?/updateItem" : "?/addItem"} use:enhance class="space-y-5">
              {#if editingItem}
                <input type="hidden" name="id" value={editingItem} />
              {/if}

              <!-- Category Selection -->
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700" for="category">Category *</label>
                <select
                  id="category"
                  name="category_id"
                  bind:value={selectedCategoryId}
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 focus:bg-white transition-all duration-200"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {#each categories as category}
                    <option value={category.id}>{category.tag}</option>
                  {/each}
                </select>
                {#if form?.message && form.action === 'addItem' && form.field === 'category_id'}
                  <div class="p-2 bg-red-50 border border-red-200 rounded-md">
                    <p class="text-red-600 text-sm font-medium">{form.message}</p>
                  </div>
                {/if}
              </div>

              <!-- Subcategory Selection -->
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700" for="subcategory">Subcategory</label>
                <select
                  id="subcategory"
                  name="subcategory_id"
                  bind:value={selectedSubcategoryId}
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 focus:bg-white transition-all duration-200 disabled:opacity-50"
                  disabled={!selectedCategoryId}
                >
                  <option value="">Select a subcategory (optional)</option>
                  {#each subcategories.filter(s => s.category_id === selectedCategoryId) as subcategory}
                    <option value={subcategory.id}>{subcategory.name}</option>
                  {/each}
                </select>
                {#if !selectedCategoryId}
                  <p class="text-xs text-gray-500">Select a category first to enable subcategories</p>
                {/if}
              </div>

              <!-- Item Name -->
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700" for="name">Item Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  bind:value={itemName}
                  placeholder="Enter item name"
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 focus:bg-white transition-all duration-200"
                  required
                />
                {#if form?.message && form.action === 'addItem' && form.field === 'name'}
                  <div class="p-2 bg-red-50 border border-red-200 rounded-md">
                    <p class="text-red-600 text-sm font-medium">{form.message}</p>
                  </div>
                {/if}
              </div>

              <!-- Price -->
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700" for="price">Price (USD) *</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span class="text-gray-500 font-medium">$</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    bind:value={itemPrice}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    class="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 focus:bg-white transition-all duration-200"
                    required
                  />
                </div>
                {#if form?.message && form.action === 'addItem' && form.field === 'price'}
                  <div class="p-2 bg-red-50 border border-red-200 rounded-md">
                    <p class="text-red-600 text-sm font-medium">{form.message}</p>
                  </div>
                {/if}
              </div>

              <!-- Item Link -->
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700" for="link">Item Link *</label>
                <div class="relative">
                  <input
                    type="url"
                    id="link"
                    name="link"
                    bind:value={itemLink}
                    placeholder="https://example.com/item"
                    class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 focus:bg-white transition-all duration-200"
                    required
                  />
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Icon icon="fa-solid:link" width="16" class="text-gray-400" />
                  </div>
                </div>
                {#if form?.message && form.action === 'addItem' && form.field === 'link'}
                  <div class="p-2 bg-red-50 border border-red-200 rounded-md">
                    <p class="text-red-600 text-sm font-medium">{form.message}</p>
                  </div>
                {/if}
              </div>

              <!-- General Error Message -->
              {#if form?.message && form.action === 'addItem' && !form.field}
                <div class="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p class="text-red-600 text-sm font-medium">{form.message}</p>
                </div>
              {/if}

              <!-- Action Buttons -->
              <div class="flex flex-col-reverse sm:flex-row gap-3 pt-6">
                <button
                  type="button"
                  onclick={() => showShopModal = false}
                  class="flex-1 py-3 px-4 rounded-lg font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="flex-1 py-3 px-4 rounded-lg font-medium bg-gradient-to-r from-[#BF953F] to-[#B38728] text-white hover:shadow-lg hover:scale-[1.02] transition-all duration-200 shadow-md"
                >
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          {/if}
        </div>
      </div>
    </div>
  {/if}

  <!-- Footer with dark theme -->
  <div class="mt-auto pt-12 border-t border-slate-700/50">
    <div class="text-center">
      <p class="text-slate-400 text-sm mb-2">
        © {currentYear} RGBUNION. All Rights Reserved.
      </p>
      <p class="text-slate-500 text-xs">
        Secure admin dashboard powered by SvelteKit
      </p>
    </div>
  </div>
</div>
</div>

<!-- Enhanced Toast Notifications -->
{#if showToast}
  <div
    transition:fly={{ y: 50, duration: 400, easing: (t) => t * t * (3 - 2 * t) }}
    class="fixed bottom-6 right-6 max-w-sm w-full shadow-2xl z-[100]"
  >
    <div class="bg-white rounded-xl border border-gray-200/80 backdrop-blur-sm overflow-hidden">
      <div class="flex items-start gap-4 p-4">
        <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center {toastType === 'success' ? 'bg-green-100' : 'bg-red-100'}">
          {#if toastType === 'success'}
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          {:else}
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          {/if}
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-semibold {toastType === 'success' ? 'text-green-800' : 'text-red-800'} mb-1">
            {toastType === 'success' ? 'Success!' : 'Error!'}
          </div>
          <p class="text-sm text-gray-700 leading-relaxed">{toastMessage}</p>
        </div>
        <button
          onclick={() => showToast = false}
          class="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      <div class="h-1 bg-gray-100">
        <div class="h-full {toastType === 'success' ? 'bg-green-400' : 'bg-red-400'} rounded-full animate-shrink-width"></div>
      </div>
    </div>
  </div>
{/if}
