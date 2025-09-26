<script>
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import { ArrowLeft } from "lucide-svelte";

  const { form, data } = $props();

  let username = $state("");
  let password = $state("");
  let error = $state("");
  let successMessage = $state(data.message || "");
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] mb-2" style="font-family: 'Cinzel', serif;">
            Admin Login
          </h2>
          <p class="text-slate-400">Enter your credentials to access the admin panel</p>
        </div>

        <!-- Login Form -->
        <form method="post" use:enhance class="space-y-6">
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
            disabled={!username || !password}
            class="w-full py-3 px-4 bg-gradient-to-r from-[#BF953F] to-[#B38728] hover:from-[#B38728] hover:to-[#BF953F] text-black font-semibold rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#BF953F]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none focus:outline-none focus:ring-2 focus:ring-[#BF953F] focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            <span class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
              Login
            </span>
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-8 pt-6 border-t border-slate-700/50 text-center">
          <p class="text-slate-400 text-sm">Secure admin access to RGBUNION</p>
        </div>
      </div>
    </div>
  </div>
</div>
