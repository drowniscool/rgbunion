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

<div class="fixed inset-0 bg-center bg-no-repeat bg-contain opacity-10 filter blur-xs z-0" style="background-image: url('/logo.png')"></div>

<div class="p-6 max-w-3xl mx-auto relative z-1 min-h-screen flex flex-col">
  <!-- Admin controls -->
  <div class="absolute top-4 right-4 flex gap-2">
    <button onclick={handleAccount} class="flex items-center gap-2 py-2 px-4 bg-[#BF953F] text-white rounded-lg hover:opacity-90 transition-opacity">
      <UserCog size={18} />
      <span>Account</span>
    </button>
    <button onclick={handleLogout} class="flex items-center gap-2 py-2 px-4 bg-rose-600 text-white rounded-lg hover:opacity-90 transition-opacity">
      <LogOut size={18} />
      <span>Logout</span>
    </button>
  </div>

  <a href="/" class="flex items-center gap-2 text-[#BF953F] mb-6 mt-16 hover:text-[#FCF6BA] transition-colors">
    <ArrowLeft size={20} /> Back to Home
  </a>

  <!-- Tab Navigation -->
  <div class="flex gap-4 mb-6">
    <button 
      class="flex items-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors {activeTab === 'links' ? 'bg-[#BF953F] text-white' : 'bg-surface text-text hover:bg-hover'}"
      onclick={() => activeTab = 'links'}
    >
      <Icon icon="fa-solid:link" width="18" /> Links
    </button>
    <button 
      class="flex items-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors {activeTab === 'shop' ? 'bg-[#BF953F] text-white' : 'bg-surface text-text hover:bg-hover'}"
      onclick={() => activeTab = 'shop'}
    >
      <ShoppingBag size={18} /> Shop
    </button>
  </div>

  {#if activeTab === 'links'}
    <!-- Existing Links Management -->
    <button onclick={handleAddLink} class="flex items-center justify-center gap-2 p-3 px-4 mb-6 bg-[#BF953F] text-white border-none rounded-lg font-medium w-full hover:opacity-90 transition-opacity">
      <PlusCircle size={20} /> Add New Link
    </button>

    <div class="flex flex-col gap-4 mb-8">
      {#if links && links.length > 0}
        {#each links as link (link.id)}
          <div class="flex items-center justify-between p-3 px-4 bg-surface rounded-lg border border-border">
            <div class="flex-1 flex flex-col gap-1">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 flex items-center justify-center">
                  {#if getIconDetails(link.link).isIconify}
                    <Icon
                      icon={getIconDetails(link.link).icon}
                      width="20"
                      height="20"
                      color="#BF953F"
                    />
                  {:else}
                    <i class={`${getIconDetails(link.link).icon} text-[#BF953F] text-base`}></i>
                  {/if}
                </div>
                <div class="font-medium text-text">{link.title}</div>
              </div>
              <a href={link.link} target="_blank" rel="noopener noreferrer" class="text-sm text-[#BF953F] hover:underline break-all">{link.link}</a>
              {#if link.description}
                <div class="text-sm text-text">{link.description}</div>
              {/if}
            </div>
            <div class="flex gap-2">
              <button class="bg-transparent border-none text-[#BF953F] p-2 rounded hover:bg-hover" onclick={() => handleEditLink(link)}>
                <Edit size={18} />
              </button>
              <button class="bg-transparent border-none text-red-500 p-2 rounded hover:bg-hover" onclick={() => handleDeleteConfirm('link', link.id, link.title)}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        {/each}
      {:else}
        <div class="text-center py-6 text-text-secondary">No links yet. Add your first link below.</div>
      {/if}
    </div>
  {:else}
    <!-- Shop Management -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <!-- Categories Section -->
      <div class="bg-surface p-6 rounded-lg border border-border">
        <h3 class="text-xl font-medium text-text mb-4">Categories</h3>
        <button onclick={handleAddCategory} class="flex items-center justify-center gap-2 p-3 px-4 mb-6 bg-[#BF953F] text-white border-none rounded-lg font-medium w-full hover:opacity-90 transition-opacity">
          <PlusCircle size={20} /> Add Category
        </button>
        
        {#if categories && categories.length > 0}
          {#each categories as category (category.id)}
            <div class="flex items-center justify-between p-3 px-4 bg-background rounded-lg border border-border mb-3">
              <div>
                <div class="font-medium text-text">{category.tag}</div>
                {#if subcategories.filter(s => s.category_id === category.id).length > 0}
                  <div class="text-sm text-text-secondary mt-1">
                    {subcategories.filter(s => s.category_id === category.id).map(s => s.name).join(', ')}
                  </div>
                {/if}
              </div>
              <div class="flex gap-2">
                <button class="bg-transparent border-none text-[#BF953F] p-2 rounded hover:bg-hover" onclick={() => handleEditCategory(category)}>
                  <Edit size={18} />
                </button>
                <button class="bg-transparent border-none text-red-500 p-2 rounded hover:bg-hover" onclick={() => handleDeleteConfirm('category', category.id, category.tag)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          {/each}
        {:else}
          <div class="text-center py-6 text-text-secondary">No categories yet. Add your first category above.</div>
        {/if}
      </div>

      <!-- Items Section -->
      <div class="bg-surface p-6 rounded-lg border border-border">
        <h3 class="text-xl font-medium text-text mb-4">Items</h3>
        <button onclick={handleAddItem} class="flex items-center justify-center gap-2 p-3 px-4 mb-6 bg-[#BF953F] text-white border-none rounded-lg font-medium w-full hover:opacity-90 transition-opacity">
          <PlusCircle size={20} /> Add Item
        </button>
        
        {#if items && items.length > 0}
          {#each items as item (item.id)}
            <div class="flex items-center justify-between p-3 px-4 bg-background rounded-lg border border-border mb-3">
              <div class="flex-1">
                <div class="font-medium text-text">{item.name}</div>
                <div class="text-sm text-[#BF953F]">${Math.round(item.price / 100)}</div>
                <div class="text-sm text-text-secondary">
                  {categories.find(c => c.id === item.category_id)?.tag}
                  {#if item.subcategory_id}
                    / {subcategories.find(s => s.id === item.subcategory_id)?.name}
                  {/if}
                </div>
                <a href={item.link} target="_blank" rel="noopener noreferrer" class="text-sm text-[#BF953F] hover:underline">{item.link}</a>
              </div>
              <div class="flex gap-2">
                <button class="bg-transparent border-none text-[#BF953F] p-2 rounded hover:bg-hover" onclick={() => handleEditItem(item)}>
                  <Edit size={18} />
                </button>
                <button class="bg-transparent border-none text-red-500 p-2 rounded hover:bg-hover" onclick={() => handleDeleteConfirm('item', item.id, item.name)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          {/each}
        {:else}
          <div class="text-center py-6 text-text-secondary">No items yet. Add your first item above.</div>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Delete Confirmation Modal -->
  {#if showDeleteConfirm}
    <div class="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-20">
      <div class="bg-background p-6 rounded-xl w-11/12 max-w-lg">
        <div class="flex items-start gap-4">
          <div class="bg-red-100 p-2 rounded-full">
            <AlertTriangle class="text-red-500" size={24} />
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-medium text-text mb-2">Confirm Delete</h3>
            <p class="text-text-secondary mb-6">
              Are you sure you want to delete {deleteType === 'link' ? 'the link' : deleteType === 'category' ? 'the category' : 'the item'} "{deleteItemName}"? 
              {#if deleteType === 'category'}
              This will also delete all items in this category.
              {/if}
              This action cannot be undone.
            </p>
            
            <div class="flex justify-end gap-3">
              <button 
                onclick={() => showDeleteConfirm = false}
                class="py-2.5 px-4 rounded-md font-medium border border-border text-text bg-transparent"
              >
                Cancel
              </button>
              <form 
                method="POST" 
                action={`?/delete${deleteType.charAt(0).toUpperCase() + deleteType.slice(1)}`} 
                use:enhance
              >
                <input type="hidden" name="id" value={deleteItemId} />
                <button type="submit" class="py-2.5 px-4 rounded-md font-medium bg-red-500 border-none text-white hover:opacity-90 transition-opacity">
                  Delete
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Existing Links Modal -->
  {#if showModal}
    <div class="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-10">
      <div class="bg-background p-6 rounded-xl w-11/12 max-w-lg">
        <h3 class="mt-0 mb-6 text-text">
          {editingLink ? "Edit Link" : "Add New Link"}
        </h3>

        <form method="POST" action={editingLink ? "?/updateLink" : "?/addLink"} use:enhance>
          {#if editingLink}
            <input type="hidden" name="id" value={editingLink} />
          {/if}

          <div class="mb-4">
            <label class="block mb-2 text-text font-medium" for="url">URL</label>
            <input type="text" id="url" name="url" bind:value={url} class="w-full p-3 bg-input-bg border border-border rounded-lg text-text focus:border-[#BF953F] focus:outline-none" />
          </div>

          <div class="mb-4">
            <label class="block mb-2 text-text font-medium" for="title">Title</label>
            <input type="text" id="title" name="title" bind:value={title} class="w-full p-3 bg-input-bg border border-border rounded-lg text-text focus:border-[#BF953F] focus:outline-none" />
          </div>

          <div class="mb-4">
            <label class="block mb-2 text-text font-medium" for="description">Description (Optional)</label>
            <input type="text" id="description" name="description" bind:value={description} class="w-full p-3 bg-input-bg border border-border rounded-lg text-text focus:border-[#BF953F] focus:outline-none" />
          </div>

          <div class="flex justify-end gap-3 mt-6">
            {#if form?.message}
              <h3 id="message" class="text-red-500 text-center text-warning-600 my-4">{form.message}</h3>
            {/if}
            <button type="button" onclick={handleCloseModal} class="py-2.5 px-4 rounded-md font-medium border border-border text-text bg-transparent">Cancel</button>
            <button type="submit" class="py-2.5 px-4 rounded-md font-medium bg-[#BF953F] border-none text-white hover:opacity-90 transition-opacity">{editingLink ? "Update" : "Add"}</button>
          </div>
        </form>
      </div>
    </div>
  {/if}

  <!-- Shop Modal -->
  {#if showShopModal}
    <div class="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-10">
      <div class="bg-background p-6 rounded-xl w-11/12 max-w-lg">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-medium text-text">
            {#if isAddingCategory}
              {editingCategoryId ? 'Edit Category' : 'Add Category'}
            {:else if editingItem}
              Edit Item
            {:else}
              Add Item
            {/if}
          </h3>
          <button onclick={() => showShopModal = false} class="bg-transparent border-none text-text p-2 rounded hover:bg-hover">
            <X size={20} />
          </button>
        </div>

        {#if isAddingCategory}
          <!-- Category Form -->
          <form method="POST" action={editingCategoryId ? "?/updateCategory" : "?/addCategory"} use:enhance>
            {#if editingCategoryId}
              <input type="hidden" name="id" value={editingCategoryId} />
            {/if}
            
            <div class="mb-4">
              <label class="block mb-2 text-text font-medium" for="tag">Category Tag</label>
              <input type="text" id="tag" name="tag" bind:value={categoryTag} class="w-full p-3 bg-input-bg border border-border rounded-lg text-text focus:border-[#BF953F] focus:outline-none" />
              {#if form?.message && form.action === 'addCategory'}
                <p class="text-red-500 text-sm mt-1">{form.message}</p>
              {/if}
            </div>

            <div class="mb-4">
              <label class="flex items-center gap-2 text-text font-medium cursor-pointer">
                <input 
                  type="checkbox" 
                  bind:checked={showSubcategoryFields} 
                  class="w-4 h-4 text-[#BF953F] border-border rounded focus:ring-[#BF953F] focus:ring-offset-0"
                />
                Add Subcategories (optional)
              </label>
            </div>

            {#if showSubcategoryFields}
              <div class="mb-4 pl-6 border-l-2 border-[#BF953F]">
                {#each subcategoryFields as subcategory, index (index)}
                  <div class="mb-4">
                    <div class="flex items-center gap-2 mb-2">
                      <label class="text-text font-medium" for="subcategory_name_{index}">Subcategory {index + 1}</label>
                      {#if index > 0}
                        <button 
                          type="button"
                          onclick={() => removeSubcategoryField(index)}
                          class="text-red-500 hover:text-red-600"
                        >
                          <X size={16} />
                        </button>
                      {/if}
                    </div>
                    <div class="flex gap-2">
                      <input 
                        type="text" 
                        id="subcategory_name_{index}" 
                        name="subcategory_names[]" 
                        bind:value={subcategory.name} 
                        class="flex-1 p-3 bg-input-bg border border-border rounded-lg text-text focus:border-[#BF953F] focus:outline-none" 
                        placeholder="Enter subcategory name"
                      />
                    </div>
                  </div>
                {/each}
                <button 
                  type="button"
                  onclick={addSubcategoryField}
                  class="flex items-center gap-2 text-[#BF953F] hover:text-[#FCF6BA] transition-colors"
                >
                  <PlusCircle size={16} />
                  Add another subcategory
                </button>
              </div>
            {/if}

            <div class="flex justify-end gap-3 mt-6">
              <button type="button" onclick={() => showShopModal = false} class="py-2.5 px-4 rounded-md font-medium border border-border text-text bg-transparent">
                Cancel
              </button>
              <button type="submit" class="py-2.5 px-4 rounded-md font-medium bg-[#BF953F] border-none text-white hover:opacity-90 transition-opacity">
                {editingCategoryId ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        {:else}
          <!-- Item Form -->
          <form method="POST" action={editingItem ? "?/updateItem" : "?/addItem"} use:enhance>
            {#if editingItem}
              <input type="hidden" name="id" value={editingItem} />
            {/if}

            <div class="mb-4">
              <label class="block mb-2 text-text font-medium" for="category">Category</label>
              <select id="category" name="category_id" bind:value={selectedCategoryId} class="w-full p-3 bg-input-bg border border-border rounded-lg text-text focus:border-[#BF953F] focus:outline-none [&>option]:bg-background [&>option]:text-text">
                <option value="">Select a category</option>
                {#each categories as category}
                  <option value={category.id}>{category.tag}</option>
                {/each}
              </select>
              {#if form?.message && form.action === 'addItem' && form.field === 'category_id'}
                <p class="text-red-500 text-sm mt-1">{form.message}</p>
              {/if}
            </div>

            <div class="mb-4">
              <label class="block mb-2 text-text font-medium" for="subcategory">Subcategory (Optional)</label>
              <select id="subcategory" name="subcategory_id" bind:value={selectedSubcategoryId} class="w-full p-3 bg-input-bg border border-border rounded-lg text-text focus:border-[#BF953F] focus:outline-none [&>option]:bg-background [&>option]:text-text">
                <option value="">Select a subcategory</option>
                {#each subcategories.filter(s => s.category_id === selectedCategoryId) as subcategory}
                  <option value={subcategory.id}>{subcategory.name}</option>
                {/each}
              </select>
            </div>

            <div class="mb-4">
              <label class="block mb-2 text-text font-medium" for="name">Item Name</label>
              <input type="text" id="name" name="name" bind:value={itemName} class="w-full p-3 bg-input-bg border border-border rounded-lg text-text focus:border-[#BF953F] focus:outline-none" />
              {#if form?.message && form.action === 'addItem' && form.field === 'name'}
                <p class="text-red-500 text-sm mt-1">{form.message}</p>
              {/if}
            </div>

            <div class="mb-4">
              <label class="block mb-2 text-text font-medium" for="price">Price ($)</label>
              <input type="number" id="price" name="price" bind:value={itemPrice} class="w-full p-3 bg-input-bg border border-border rounded-lg text-text focus:border-[#BF953F] focus:outline-none" />
              {#if form?.message && form.action === 'addItem' && form.field === 'price'}
                <p class="text-red-500 text-sm mt-1">{form.message}</p>
              {/if}
            </div>

            <div class="mb-4">
              <label class="block mb-2 text-text font-medium" for="link">Item Link</label>
              <input type="text" id="link" name="link" bind:value={itemLink} class="w-full p-3 bg-input-bg border border-border rounded-lg text-text focus:border-[#BF953F] focus:outline-none" />
              {#if form?.message && form.action === 'addItem' && form.field === 'link'}
                <p class="text-red-500 text-sm mt-1">{form.message}</p>
              {/if}
            </div>

            <div class="flex justify-end gap-3 mt-6">
              {#if form?.message && form.action === 'addItem' && !form.field}
                <p class="text-red-500 text-sm mt-1 flex-1">{form.message}</p>
              {/if}
              <button type="button" onclick={() => showShopModal = false} class="py-2.5 px-4 rounded-md font-medium border border-border text-text bg-transparent">
                Cancel
              </button>
              <button type="submit" class="py-2.5 px-4 rounded-md font-medium bg-[#BF953F] border-none text-white hover:opacity-90 transition-opacity">
                {editingItem ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Footer -->
  <div class="mt-auto pt-8 text-center text-sm text-gray-400">
    © {currentYear} RGBUNION. All Rights Reserved.
  </div>
</div>

{#if showToast}
  <div transition:fly={{ y: 20, duration: 300 }} class="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-3 {toastType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white z-[100]">
    {toastMessage}
  </div>
{/if}
