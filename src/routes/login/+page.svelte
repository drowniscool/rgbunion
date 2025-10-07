<script>
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import { ArrowLeft } from "lucide-svelte";
  import { loading } from "$lib/stores/loading.js";

  const { form, data } = $props();

  let username = $state("");
  let password = $state("");
  let error = $state("");
  let successMessage = $state(data.message || "");
  let isSubmitting = $state(false);
</script>

<!-- Background with subtle pattern matching landing page -->
<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
  <!-- Subtle Background Pattern -->
  <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNCRjk1M0YiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

  <div class="relative z-10 min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <!-- Back to Home Link -->
      <a href="/" class="inline-flex items-center gap-2 text-[#BF953F] mb-8 hover:text-[#FCF6BA] transition-all duration-300 group">
        <ArrowLeft size={20} class="transition-transform group-hover:-translate-x-1" />
        <span class="font-medium">Back to Home</span>
      </a>

      <!-- Login Card with Glass-morphism -->
      <div class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-[#BF953F]/20 to-[#B38728]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#BF953F]/30">
            <svg class="w-8 h-8 text-[#BF953F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] mb-2" style="font-family: 'Cinzel', serif;">
            Admin Console
          </h1>
          <p class="text-slate-400 mb-4">Administrator access only</p>

          <!-- Visitor redirect notice -->
          <div class="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="text-left">
                <p class="text-blue-300 text-sm font-medium mb-2">Looking for the shop?</p>
                <a href="/shop" class="inline-flex items-center gap-2 text-[#BF953F] hover:text-[#FCF6BA] transition-colors duration-200 font-medium text-sm group">
                  <span>Browse products without logging in</span>
                  <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Login Form -->
        <form
          method="post"
          use:enhance={() => {
            isSubmitting = true;
            loading.start('Authenticating');

            return async ({ update }) => {
              await update();
              isSubmitting = false;
              loading.stop();
            };
          }}
          class="space-y-6"
        >
          <!-- Username Field -->
          <div class="space-y-2">
            <label for="username" class="block text-sm font-medium text-slate-300">Username</label>
            <div class="relative">
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                autocomplete="username"
                bind:value={username}
                class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 focus:bg-slate-700/70 transition-all duration-300"
                required
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-slate-300">Password</label>
            <div class="relative">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                autocomplete="current-password"
                bind:value={password}
                class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 focus:bg-slate-700/70 transition-all duration-300"
                required
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Success Message -->
          {#if successMessage}
            <div class="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <p class="text-green-300 text-sm font-medium">{successMessage}</p>
              </div>
            </div>
          {/if}

          <!-- Error Message -->
          {#if form?.message}
            <div class="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <p class="text-red-300 text-sm font-medium">{form.message}</p>
              </div>
            </div>
          {/if}

          <!-- Submit Button -->
          <button
            type="submit"
            disabled={!username || !password || isSubmitting}
            class="w-full py-3 px-4 bg-gradient-to-r from-[#BF953F] to-[#B38728] hover:from-[#B38728] hover:to-[#BF953F] text-black font-semibold rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#BF953F]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none focus:outline-none focus:ring-2 focus:ring-[#BF953F] focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            <span class="flex items-center justify-center gap-2">
              {#if isSubmitting}
                <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              {:else}
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                Access Admin Console
              {/if}
            </span>
          </button>
        </form>

        <!-- Terms Notice -->
        <div class="mt-6 text-center">
          <p class="text-slate-500 text-xs">
            By accessing this system you agree to our <a href="/terms" class="text-[#BF953F] hover:text-[#FCF6BA] transition-colors duration-300" aria-label="Read RGBUNION Terms of Service">Terms of Service</a>
          </p>
        </div>

        <!-- Footer -->
        <div class="mt-8 pt-6 border-t border-slate-700/50 text-center">
          <p class="text-slate-400 text-sm">Authorized administrator access only</p>
          <p class="text-slate-500 text-xs mt-1">Credentials required for system administration</p>
        </div>
      </div>
    </div>
  </div>
</div>
