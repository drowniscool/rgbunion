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

<div class="fixed inset-0 bg-center bg-no-repeat bg-contain opacity-10 filter blur-xs z-0" style="background-image: url('/logo.png')"></div>

<div class="p-6 text-center max-w-md mx-auto relative z-10">
  <a href="/" class="flex items-center gap-2 text-[#BF953F] mb-6 hover:text-[#FCF6BA] transition-colors">
    <ArrowLeft size={20} /> Back to Home
  </a>
  <form method="post" use:enhance class="bg-surface p-6 rounded-lg border border-border shadow-md mt-12">
    <h2 class="text-3xl mb-6 font-serif font-cinzel text-center" style="background: linear-gradient(45deg, #BF953F, #FCF6BA); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
      Admin Login
    </h2>

    <div class="relative mb-4">
      <input type="text" name="username" placeholder="Username" autocomplete="username" bind:value={username} class="w-full p-3 border border-border rounded-lg bg-input-bg text-text focus:border-primary focus:outline-none" />
    </div>

    <div class="relative mb-4">
      <input type="password" name="password" placeholder="Password" autocomplete="current-password" bind:value={password} class="w-full p-3 border border-border rounded-lg bg-input-bg text-text focus:border-primary focus:outline-none" />
    </div>

    {#if successMessage}
      <div class="bg-green-100 text-green-800 p-3 rounded-md mb-4">
        {successMessage}
      </div>
    {/if}

    {#if form?.message}
      <div class="bg-red-100 text-red-800 p-3 rounded-md mb-4">
        {form.message}
      </div>
    {/if}

    <button type="submit" disabled={!username || !password} class="w-full p-3 bg-primary text-white border-none rounded-lg font-medium cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed hover:opacity-90"> 
      Login 
    </button>
  </form>
</div>
