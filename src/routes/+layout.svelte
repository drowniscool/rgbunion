<script>
  let { children, data } = $props();
  import "../app.css";
  import { loggedIn, user } from "$lib/stores.js";

  $effect(() => {
    $user = data.user;
    $loggedIn = data.loggedIn;
  });
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen flex flex-col">
  <header class="py-6 sm:py-8 px-4 text-center relative animate-fadeIn">
    <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-wider animate-titleReveal" style="font-family: 'Cinzel', serif; background: linear-gradient(45deg, #BF953F, #FCF6BA, #B38728, #FCF6BA); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-size: 300% auto; animation: shine 4s linear infinite;">
      RGBUNION
    </h1>
    <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-[4px] animate-lineReveal" style="background: linear-gradient(90deg, transparent, #BF953F, #BF953F, transparent);"></div>
  </header>

  <main class="flex-grow">
    {@render children()}
  </main>
</div>

<style>
  @keyframes shine {
    0% { background-position: 0% 50%; }
    50% { background-position: 150% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes titleReveal {
    0% { 
      opacity: 0;
      transform: scale(0.9) translateY(20px);
      filter: blur(12px);
    }
    60% {
      opacity: 0.8;
      transform: scale(1.05) translateY(-5px);
      filter: blur(4px);
    }
    100% { 
      opacity: 1;
      transform: scale(1) translateY(0);
      filter: blur(0);
    }
  }

  @keyframes lineReveal {
    0% { 
      width: 0;
      opacity: 0;
    }
    50% {
      width: 16rem;
      opacity: 1;
    }
    100% {
      width: 16rem;
      opacity: 0.8;
    }
  }

  :global(.animate-fadeIn) {
    animation: fadeIn 0.8s ease-out forwards;
  }

  :global(.animate-titleReveal) {
    animation: titleReveal 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
  }

  :global(.animate-lineReveal) {
    animation: lineReveal 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: 0.6s;
  }
</style>
