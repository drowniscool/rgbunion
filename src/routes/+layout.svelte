<script>
  let { children, data } = $props();
  import "../app.css";
  import { loggedIn, user } from "$lib/stores.js";
  import { page } from "$app/stores";
  import Navbar from "$lib/components/Navbar.svelte";

  $effect(() => {
    $user = data.user;
    $loggedIn = data.loggedIn;
  });

  // Check if we're on the home page using a derived value
  let isHomePage = $derived($page.url.pathname === '/');
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen flex flex-col">
  <!-- Navbar - only show on non-home pages or when user is logged in -->
  {#if !isHomePage || $loggedIn}
    <Navbar user={$user} loggedIn={$loggedIn} isAdmin={data.isAdmin} />
  {/if}

  <main class="flex-grow">
    {@render children()}
  </main>
</div>

