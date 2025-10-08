<!--
  @component Footer

  Elegant, compact footer component with glassmorphic design and gold theme accents.

  @prop {boolean} showTermsLink - Whether to display the Terms of Service link (default: true)
  @prop {string} companyName - Company name for copyright notice (default: "RGBUNION")
  @prop {string} watermarkName - Designer/creator name (default: "drown")
  @prop {string} watermarkIcon - Icon to replace the 'o' in watermark name (default: "💧")
  @prop {number} year - Copyright year (default: current year)

  @example
  ```svelte
  <Footer />
  ```

  @example Custom configuration
  ```svelte
  <Footer
    showTermsLink={false}
    companyName="My Company"
    watermarkName="creator"
    watermarkIcon="⭐"
  />
  ```

  @example Dynamic Terms link visibility
  ```svelte
  <Footer showTermsLink={$page.url.pathname !== '/terms'} />
  ```
-->

<script>
  /**
   * Props for footer configurability - enables reusability across projects
   * All props have sensible defaults matching RGBUNION branding
   */
  let {
    showTermsLink = true,
    companyName = 'RGBUNION',
    watermarkName = 'drown',
    watermarkIcon = '💧',
    year = new Date().getFullYear()
  } = $props();

  /**
   * Split watermark name to insert icon at position of 'o'
   * Example: "drown" + "💧" → "dr💧wn"
   */
  const iconPosition = watermarkName.indexOf('o');
  const nameBeforeIcon = iconPosition >= 0 ? watermarkName.slice(0, iconPosition) : watermarkName;
  const nameAfterIcon = iconPosition >= 0 ? watermarkName.slice(iconPosition + 1) : '';
</script>

<!--
  Condensed Footer with Elegant Flow
  Spacing optimizations:
  - pt-16 → pt-8 (50% reduction in top padding: 64px → 32px)
  - pb-8 → pb-6 (25% reduction in bottom padding: 32px → 24px)
  - space-y-6 → space-y-4 (internal spacing: 24px → 16px)
  - Total vertical space reduction: ~40px
-->
<footer class="relative mt-auto pt-8 pb-6">
  <!-- Subtle gradient separator line -->
  <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700/40 to-transparent"></div>

  <div class="text-center space-y-4">
    <!-- Copyright & Legal Section -->
    <div>
      <p class="text-slate-400 text-sm font-medium {showTermsLink ? 'mb-2' : ''}">
        © {year} {companyName}. All Rights Reserved.
      </p>
      {#if showTermsLink}
        <p class="text-slate-500 text-xs">
          By continuing you agree to our <a
            href="/terms"
            class="text-[#BF953F] hover:text-[#FCF6BA] transition-colors duration-300 underline decoration-[#BF953F]/30 hover:decoration-[#FCF6BA]/50"
            aria-label="Read {companyName} Terms of Service"
          >Terms of Service</a>
        </p>
      {/if}
    </div>

    <!-- Subtle Decorative Separator -->
    <div class="flex items-center justify-center gap-3 opacity-40">
      <div class="h-px w-8 bg-gradient-to-r from-transparent to-slate-600"></div>
      <div class="w-1 h-1 rounded-full bg-slate-600"></div>
      <div class="h-px w-8 bg-gradient-to-l from-transparent to-slate-600"></div>
    </div>

    <!-- Premium Watermark Signature Card -->
    <div class="inline-flex flex-col items-center">
      <div class="group relative px-6 py-3 rounded-2xl backdrop-blur-sm bg-slate-800/20 border border-slate-700/30 shadow-lg transition-all duration-500 hover:border-[#BF953F]/40 hover:shadow-[0_0_30px_rgba(191,149,63,0.15)] hover:bg-slate-800/30">
        <!-- Decorative corner accents (animated on hover) -->
        <div class="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#BF953F]/0 group-hover:border-[#BF953F]/60 transition-all duration-500 rounded-tl-2xl"></div>
        <div class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#BF953F]/0 group-hover:border-[#BF953F]/60 transition-all duration-500 rounded-br-2xl"></div>

        <div class="text-center space-y-1">
          <!-- "designed with ♥" line -->
          <p class="text-xs text-slate-400/90 font-light tracking-[0.15em] transition-colors duration-300 group-hover:text-slate-300">
            designed with
            <span
              class="inline-block text-red-400/70 group-hover:text-red-400/90 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]"
              style="animation: pulse-heart 2s ease-in-out infinite;"
              aria-label="love"
            >♥</span>
          </p>

          <!-- "by [name]" line with Cinzel font - icon replaces "o" -->
          <p class="text-sm text-slate-300/90 font-light tracking-wider transition-colors duration-300 group-hover:text-[#FCF6BA]">
            by <span class="font-['Cinzel'] font-semibold tracking-wide">
              {nameBeforeIcon}<span
                class="inline-block text-blue-400/80 group-hover:text-blue-300/90 transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]"
                aria-label={watermarkIcon === '💧' ? 'water droplet' : 'icon'}
              >{watermarkIcon}</span>{nameAfterIcon}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</footer>

<!-- Pulsing heart animation -->
<style>
  @keyframes pulse-heart {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
</style>
