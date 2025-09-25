<script>
  import { page } from '$app/stores';
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</svelte:head>

<div class="fixed inset-0 bg-[url('/logo.png')] bg-center bg-no-repeat bg-contain opacity-[0.08] blur-[1px] z-0"></div>

<div class="min-h-screen w-full flex items-center justify-center relative z-10">
  <main class="px-3 sm:px-4 w-full max-w-[500px]">
    <div class="text-center">
      <h1 class="text-8xl font-bold bg-gradient-to-r from-[#BF953F] to-[#FCF6BA] bg-clip-text text-transparent mb-4">
        {$page.status}
      </h1>
      <p class="text-xl text-gray-400 mb-8">{$page.error?.message || 'Page not found'}</p>
      <a 
        href="/" 
        class="inline-flex items-center px-6 py-3 bg-[rgba(255,255,255,0.02)] border-2 border-[#BF953F]/70 rounded-md transition-all duration-300 hover:bg-[rgba(255,255,255,0.05)] hover:border-[#FCF6BA] hover:shadow-lg hover:shadow-[#BF953F]/20 hover:-translate-y-0.5 active:translate-y-0"
      >
        <i class="fas fa-home mr-2 text-[#BF953F] group-hover:text-[#FCF6BA]"></i>
        <span class="bg-gradient-to-r from-[#BF953F] to-[#FCF6BA] bg-clip-text text-transparent">
          Back to Home
        </span>
      </a>
    </div>
  </main>
</div>