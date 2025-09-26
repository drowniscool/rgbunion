<script>
  import { onMount } from "svelte";
  import { fade, scale } from "svelte/transition";
  import { LogOut, Home, ArrowLeft } from "lucide-svelte";

  let mounted = $state(false);
  let showMessage = $state(false);

  onMount(() => {
    mounted = true;
    // Show success message after a brief delay
    setTimeout(() => {
      showMessage = true;
    }, 300);
  });
</script>

<svelte:head>
  <title>Logged Out - RGBUNION</title>
  <meta name="description" content="You have been successfully logged out of RGBUNION">
</svelte:head>

<!-- Modern dark slate background with subtle pattern -->
<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
  <!-- Subtle Background Pattern -->
  <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNCRjk1M0YiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

  <div class="relative z-10 min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-md text-center">
      {#if mounted}
        <!-- Logout Success Card -->
        <div
          class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl"
          in:scale={{ duration: 600, start: 0.8 }}
        >
          <!-- Success Icon -->
          <div class="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
            <LogOut class="w-10 h-10 text-green-400" />
          </div>

          <!-- Success Message -->
          {#if showMessage}
            <div in:fade={{ duration: 500, delay: 300 }}>
              <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] mb-4" style="font-family: 'Cinzel', serif;">
                Successfully Logged Out
              </h1>
              <p class="text-slate-300 text-lg mb-8">
                You have been safely logged out of your RGBUNION account.
              </p>

              <!-- Success Notification -->
              <div class="p-4 bg-green-500/10 border border-green-500/30 rounded-lg mb-8">
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <p class="text-green-300 text-sm font-medium">Your session has been securely terminated</p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="space-y-4">
                <!-- Back to Home -->
                <a
                  href="/"
                  class="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-[#BF953F] to-[#B38728] hover:from-[#B38728] hover:to-[#BF953F] text-black font-semibold rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#BF953F]/25"
                >
                  <Home class="w-5 h-5" />
                  Return to Home
                </a>

                <!-- Login Again -->
                <a
                  href="/login"
                  class="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-700/50 border border-slate-600/50 text-[#FCF6BA] rounded-lg hover:bg-[#BF953F]/20 hover:border-[#BF953F]/50 transition-all duration-300"
                >
                  <ArrowLeft class="w-5 h-5" />
                  Login Again
                </a>
              </div>
            </div>
          {/if}

          <!-- Footer -->
          <div class="mt-8 pt-6 border-t border-slate-700/50">
            <p class="text-slate-400 text-sm">
              Thank you for using RGBUNION securely
            </p>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  :global(body) {
    background: #000;
  }
</style>