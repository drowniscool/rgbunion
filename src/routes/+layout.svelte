<script>
  let { children, data } = $props();
  import "../app.css";
  import { loggedIn, user } from "$lib/stores.js";
  import { page } from "$app/stores";
  import { navigating } from "$app/stores";
  import Navbar from "$lib/components/Navbar.svelte";
  import PageLoader from "$lib/components/PageLoader.svelte";
  import { openAccountModal } from "$lib/stores/modal.js";
  import { loading } from "$lib/stores/loading.js";
  import { onMount } from "svelte";

  let navbarHeight = $state(0);
  let isInitialLoad = $state(true);

  $effect(() => {
    $user = data.user;
    $loggedIn = data.loggedIn;
  });

  // Check if we're on the home page using a derived value
  let isHomePage = $derived($page.url.pathname === '/');

  // Handle initial page load
  onMount(() => {
    // Show loader briefly on initial load for smooth entrance
    loading.start('Initializing');

    // Hide loader after app is ready
    setTimeout(() => {
      loading.stop();
      isInitialLoad = false;
    }, 600);
  });

  // Handle navigation loading states
  $effect(() => {
    if ($navigating && !isInitialLoad) {
      // Show loader when navigation starts
      const targetPath = $navigating.to?.url.pathname;
      let message = 'Loading';

      // Custom messages for specific routes
      if (targetPath === '/login') message = 'Opening admin console';
      else if (targetPath === '/logout') message = 'Signing out';
      else if (targetPath === '/admin') message = 'Loading admin panel';
      else if (targetPath === '/dashboard') message = 'Loading dashboard';
      else if (targetPath === '/shop') message = 'Loading shop';

      loading.start(message);
    } else if (!$navigating && !isInitialLoad) {
      // Navigation complete - hide loader after brief delay for smoothness
      setTimeout(() => {
        loading.stop();
      }, 200);
    }
  });
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<!-- Global Page Loader -->
<PageLoader isLoading={$loading.isLoading} message={$loading.message} />

<div class="min-h-screen flex flex-col">
  <!-- Fixed Navbar - shown on all pages for consistent navigation -->
  <Navbar bind:navbarHeight user={$user} loggedIn={$loggedIn} isAdmin={data.isAdmin} onProfileClick={openAccountModal} />

  <!-- Main content with top padding to account for fixed navbar -->
  <main class="flex-grow" style="padding-top: {Math.max(navbarHeight, 80)}px;">
    {@render children()}
  </main>
</div>

