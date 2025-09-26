<script>
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { ArrowLeft, User, Key } from "lucide-svelte";
  import { fly } from "svelte/transition";

  const { form } = $props();
  let usernameSuccessMessage = $state("");
  let passwordSuccessMessage = $state("");
  let redirecting = $state(false);
  
  // Get current year for footer
  const currentYear = new Date().getFullYear();

  function goBack() {
    goto("/admin");
  }
  
  // Handle form submission for username update
  function handleUsernameForm({ formElement }) {
    return async ({ result }) => {
      if (result.type === 'success' && result.data.success) {
        // Show success message on page
        usernameSuccessMessage = result.data.message;
        redirecting = true;
        
        // Wait 3 seconds then redirect to login
        setTimeout(() => {
          if (result.data.redirectTo) {
            window.location.href = result.data.redirectTo;
          }
        }, 3000);
      }
      
      // Let SvelteKit handle failure messages
      return;
    };
  }
  
  // Handle form submission for password update
  function handlePasswordForm({ formElement }) {
    return async ({ result }) => {
      if (result.type === 'success' && result.data.success) {
        // Show success message on page
        passwordSuccessMessage = result.data.message;
        redirecting = true;
        
        // Wait 3 seconds then redirect to login
        setTimeout(() => {
          if (result.data.redirectTo) {
            window.location.href = result.data.redirectTo;
          }
        }, 3000);
      }
      
      // Let SvelteKit handle failure messages
      return;
    };
  }
</script>

<!-- Modern dark slate background with subtle pattern -->
<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
  <!-- Subtle Background Pattern -->
  <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNCRjk1M0YiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

  <div class="relative z-10 min-h-screen flex flex-col p-6 max-w-lg mx-auto">
    <button onclick={goBack} class="flex items-center gap-2 text-[#BF953F] mb-8 hover:text-[#FCF6BA] transition-all duration-300 group">
      <ArrowLeft size={20} class="transition-transform group-hover:-translate-x-1" />
      <span class="font-medium">Back to Dashboard</span>
    </button>

    <div class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
    <h2 class="text-3xl mb-6 font-serif font-cinzel text-center" style="background: linear-gradient(45deg, #BF953F, #FCF6BA); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
      Account Settings
    </h2>

      <!-- Username Change Section -->
      <div class="mb-8 p-6 bg-slate-700/30 rounded-xl border border-slate-600/50">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-br from-[#BF953F]/20 to-[#B38728]/20 rounded-lg flex items-center justify-center border border-[#BF953F]/30">
            <User size={20} class="text-[#BF953F]" />
          </div>
          <h3 class="text-lg font-semibold text-[#FCF6BA]">Change Username</h3>
        </div>
      <form
        method="POST"
        action="?/updateUsername"
        use:enhance={handleUsernameForm}
      >
        <div class="mb-4">
          <label class="block mb-2 text-text font-medium" for="currentPasswordForUsername">Current Password</label>
          <input type="password" id="currentPasswordForUsername" name="currentPassword" required class="w-full p-3 bg-input-bg border border-border rounded-lg text-text focus:border-[#BF953F] focus:outline-none" />
        </div>
        <div class="mb-4">
          <label class="block mb-2 text-text font-medium" for="newUsername">New Username</label>
          <input type="text" id="newUsername" name="newUsername" required class="w-full p-3 bg-input-bg border border-border rounded-lg text-text focus:border-[#BF953F] focus:outline-none" />
        </div>
        <button type="submit" class="w-full py-2.5 px-4 rounded-md font-medium bg-[#BF953F] border-none text-white hover:opacity-90 transition-opacity" disabled={redirecting}>
          Update Username
        </button>
        
        {#if usernameSuccessMessage}
          <div class="mt-4 p-3 rounded-md bg-green-100 text-green-800" transition:fly={{ y: 20, duration: 300 }}>
            {usernameSuccessMessage}
          </div>
        {:else if form?.action === 'updateUsername'}
          <div class="mt-4 p-3 rounded-md bg-red-100 text-red-800">
            {form.message}
          </div>
        {/if}
      </form>
    </div>

    <!-- Password Change Section -->
    <div class="p-6 bg-background rounded-lg border border-border">
      <div class="flex items-center gap-2 mb-4">
        <Key size={20} class="text-[#BF953F]" />
        <h3 class="text-lg font-medium text-text">Change Password</h3>
      </div>
      <form
        method="POST"
        action="?/updatePassword"
        use:enhance={handlePasswordForm}
      >
        <div class="mb-4">
          <label class="block mb-2 text-text font-medium" for="currentPassword">Current Password</label>
          <input type="password" id="currentPassword" name="currentPassword" autocomplete="current-password" required class="w-full p-3 bg-input-bg border border-border rounded-lg text-text focus:border-[#BF953F] focus:outline-none" />
        </div>

        <div class="mb-4">
          <label class="block mb-2 text-text font-medium" for="newPassword">New Password</label>
          <input type="password" id="newPassword" name="newPassword" autocomplete="new-password" required minlength="6" class="w-full p-3 bg-input-bg border border-border rounded-lg text-text focus:border-[#BF953F] focus:outline-none" />
        </div>

        <div class="mb-6">
          <label class="block mb-2 text-text font-medium" for="confirmPassword">Confirm New Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" autocomplete="new-password" required minlength="6" class="w-full p-3 bg-input-bg border border-border rounded-lg text-text focus:border-[#BF953F] focus:outline-none" />
        </div>

        <button type="submit" class="w-full py-2.5 px-4 rounded-md font-medium bg-[#BF953F] border-none text-white hover:opacity-90 transition-opacity" disabled={redirecting}>
          Update Password
        </button>

        {#if passwordSuccessMessage}
          <div class="mt-4 p-3 rounded-md bg-green-100 text-green-800" transition:fly={{ y: 20, duration: 300 }}>
            {passwordSuccessMessage}
          </div>
        {:else if form?.action === 'updatePassword'}
          <div class="mt-4 p-3 rounded-md bg-red-100 text-red-800">
            {form.message}
          </div>
        {/if}
      </form>
    </div>
  </div>
  
  <!-- Footer -->
  <div class="mt-auto pt-8 text-center text-sm text-gray-400">
    © {currentYear} RGBUNION. All Rights Reserved.
  </div>
</div>