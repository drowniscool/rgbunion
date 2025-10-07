<script>
  import { enhance } from "$app/forms";
  import { User, Key, X } from "lucide-svelte";
  import { fly, fade } from "svelte/transition";

  let { showModal = false, onClose = null, form = null } = $props();

  let usernameSuccessMessage = $state("");
  let passwordSuccessMessage = $state("");
  let redirecting = $state(false);

  function resetRedirecting() {
    redirecting = false;
  }

  function handleUsernameForm() {
    return async ({ result }) => {
      if (result.type === "success" && result.data.success) {
        usernameSuccessMessage = result.data.message;
        redirecting = true;

        setTimeout(() => {
          if (result.data.redirectTo) {
            window.location.href = result.data.redirectTo;
          }
        }, 3000);
      } else {
        usernameSuccessMessage = "";
        resetRedirecting();
      }

      return;
    };
  }

  function handlePasswordForm() {
    return async ({ result }) => {
      if (result.type === "success" && result.data.success) {
        passwordSuccessMessage = result.data.message;
        redirecting = true;

        setTimeout(() => {
          if (result.data.redirectTo) {
            window.location.href = result.data.redirectTo;
          }
        }, 3000);
      } else {
        passwordSuccessMessage = "";
        resetRedirecting();
      }

      return;
    };
  }

  function handleClose() {
    if (onClose) {
      onClose();
    }
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      handleClose();
    }
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if showModal}
  <div
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[1100] p-4"
    transition:fade={{ duration: 200 }}
    onclick={handleBackdropClick}
    onkeydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div
      class="bg-slate-900/95 rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-700/70 max-h-[90vh] overflow-y-auto"
      transition:fly={{ y: 20, duration: 300 }}
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-slate-700/60">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-[#BF953F]/20 to-[#B38728]/20 rounded-lg flex items-center justify-center">
            <User size={20} class="text-[#BF953F]" />
          </div>
          <h3 class="text-xl font-semibold text-[#FCF6BA]">Account Settings</h3>
        </div>
        <button
          onclick={handleClose}
          class="p-2 text-slate-400 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-all duration-200"
        >
          <X size={20} />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 space-y-8">
        <!-- Username Change Section -->
        <div class="p-6 bg-slate-800/40 rounded-xl border border-slate-700/60">
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
            class="space-y-4"
          >
            <div>
              <label class="block mb-2 text-[#FCF6BA] font-medium" for="currentPasswordForUsername">Current Password</label>
              <input
                type="password"
                id="currentPasswordForUsername"
                name="currentPassword"
                required
                class="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-[#FCF6BA] placeholder-slate-400 focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 focus:bg-slate-900 transition-all duration-200"
              />
            </div>
            <div>
              <label class="block mb-2 text-[#FCF6BA] font-medium" for="newUsername">New Username</label>
              <input
                type="text"
                id="newUsername"
                name="newUsername"
                required
                class="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-[#FCF6BA] placeholder-slate-400 focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 focus:bg-slate-900 transition-all duration-200"
              />
            </div>
            <button
              type="submit"
              class="w-full py-2.5 px-4 rounded-lg font-medium bg-gradient-to-r from-[#BF953F] to-[#B38728] text-black hover:shadow-lg hover:scale-[1.02] transition-all duration-200 shadow-md"
              disabled={redirecting}
            >
              Update Username
            </button>

            {#if usernameSuccessMessage}
              <div class="p-3 rounded-lg bg-green-900/30 border border-green-500/30" transition:fly={{ y: 20, duration: 300 }}>
                <p class="text-green-400 text-sm font-medium">{usernameSuccessMessage}</p>
              </div>
            {:else if form?.action === "updateUsername"}
              <div class="p-3 rounded-lg bg-red-900/30 border border-red-500/30">
                <p class="text-red-400 text-sm font-medium">{form.message}</p>
              </div>
            {/if}
          </form>
        </div>

        <!-- Password Change Section -->
        <div class="p-6 bg-slate-800/40 rounded-xl border border-slate-700/60">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-[#BF953F]/20 to-[#B38728]/20 rounded-lg flex items-center justify-center border border-[#BF953F]/30">
              <Key size={20} class="text-[#BF953F]" />
            </div>
            <h3 class="text-lg font-semibold text-[#FCF6BA]">Change Password</h3>
          </div>
          <form
            method="POST"
            action="?/updatePassword"
            use:enhance={handlePasswordForm}
            class="space-y-4"
          >
            <div>
              <label class="block mb-2 text-[#FCF6BA] font-medium" for="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                autocomplete="current-password"
                required
                class="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-[#FCF6BA] placeholder-slate-400 focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 focus:bg-slate-900 transition-all duration-200"
              />
            </div>

            <div>
              <label class="block mb-2 text-[#FCF6BA] font-medium" for="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                autocomplete="new-password"
                required
                minlength="6"
                class="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-[#FCF6BA] placeholder-slate-400 focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 focus:bg-slate-900 transition-all duration-200"
              />
            </div>

            <div>
              <label class="block mb-2 text-[#FCF6BA] font-medium" for="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                autocomplete="new-password"
                required
                minlength="6"
                class="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-[#FCF6BA] placeholder-slate-400 focus:border-[#BF953F] focus:ring-2 focus:ring-[#BF953F]/20 focus:bg-slate-900 transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              class="w-full py-2.5 px-4 rounded-lg font-medium bg-gradient-to-r from-[#BF953F] to-[#B38728] text-black hover:shadow-lg hover:scale-[1.02] transition-all duration-200 shadow-md"
              disabled={redirecting}
            >
              Update Password
            </button>

            {#if passwordSuccessMessage}
              <div class="p-3 rounded-lg bg-green-900/30 border border-green-500/30" transition:fly={{ y: 20, duration: 300 }}>
                <p class="text-green-400 text-sm font-medium">{passwordSuccessMessage}</p>
              </div>
            {:else if form?.action === "updatePassword"}
              <div class="p-3 rounded-lg bg-red-900/30 border border-red-500/30">
                <p class="text-red-400 text-sm font-medium">{form.message}</p>
              </div>
            {/if}
          </form>
        </div>
      </div>
    </div>
  </div>
{/if}