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
  import Icon from '@iconify/svelte';
  import AccessibilityBadge from './AccessibilityBadge.svelte';

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
   * Example: "drown" + "🌊" → "dr🌊wn"
   */
  const iconPosition = watermarkName.indexOf('o');
  const nameBeforeIcon = iconPosition >= 0 ? watermarkName.slice(0, iconPosition) : watermarkName;
  const nameAfterIcon = iconPosition >= 0 ? watermarkName.slice(iconPosition + 1) : '';

  /**
   * Tech Stack Orbital Display State
   * Shows rotating tech icons after 2 seconds of hovering on watermark
   */
  let showOrbitalIcons = $state(false);
  let hoverTimeout = $state(null);

  /**
   * Accessibility Badge Modal State
   * Shows quality metrics modal on right-click
   */
  let showAccessibilityModal = $state(false);

  /**
   * Tech stack icons configuration
   * Positioned at 120° intervals around watermark (3 icons in circular orbit)
   */
  const techIcons = [
    { icon: 'logos:svelte-icon', angle: 0, label: 'Svelte' },
    { icon: 'logos:tailwindcss-icon', angle: 120, label: 'Tailwind CSS' },
    { icon: 'logos:cloudflare-icon', angle: 240, label: 'Cloudflare' }
  ];

  /**
   * Water Droplet Splash State
   * Controls click-triggered splash animation
   */
  let clickSplash = $state(false);

  /**
   * Water droplet particles configuration
   * 14 particles positioned in radial burst pattern with varied distances
   */
  const waterParticles = [
    // Ring 1: Close particles (20px radius)
    { angle: 0, radius: 20, size: 3, delay: 0 },
    { angle: 72, radius: 22, size: 2, delay: 40 },
    { angle: 144, radius: 18, size: 3, delay: 80 },
    { angle: 216, radius: 21, size: 2, delay: 120 },
    { angle: 288, radius: 19, size: 3, delay: 160 },

    // Ring 2: Medium particles (30px radius)
    { angle: 36, radius: 30, size: 3, delay: 20 },
    { angle: 108, radius: 32, size: 2, delay: 60 },
    { angle: 180, radius: 28, size: 4, delay: 100 },
    { angle: 252, radius: 31, size: 2, delay: 140 },
    { angle: 324, radius: 29, size: 3, delay: 180 },

    // Ring 3: Far particles (40px radius)
    { angle: 18, radius: 38, size: 2, delay: 10 },
    { angle: 90, radius: 42, size: 3, delay: 50 },
    { angle: 162, radius: 36, size: 2, delay: 90 },
    { angle: 234, radius: 40, size: 3, delay: 130 }
  ];

  /**
   * Handle watermark hover start
   * Starts 2-second timer to trigger orbital display
   */
  function handleMouseEnter() {
    hoverTimeout = setTimeout(() => {
      showOrbitalIcons = true;
    }, 2000);
  }

  /**
   * Handle watermark hover end
   * Clears timer and hides orbital icons
   */
  function handleMouseLeave() {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }
    showOrbitalIcons = false;
  }

  /**
   * Handle watermark click
   * Triggers smaller water splash animation
   */
  function handleWatermarkClick() {
    clickSplash = true;
    setTimeout(() => clickSplash = false, 400);
  }

  /**
   * Handle watermark right-click
   * Opens accessibility badge modal and prevents context menu
   */
  function handleContextMenu(event) {
    event.preventDefault();
    showAccessibilityModal = true;
  }

  /**
   * Cleanup on component unmount
   */
  $effect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  });
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
      <div
        class="group relative px-6 py-3 rounded-2xl backdrop-blur-md bg-gradient-to-br from-slate-800/10 via-slate-800/15 to-slate-700/10 border border-slate-700/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all duration-500 hover:scale-105 hover:border-[#BF953F]/30 hover:shadow-[0_8px_32px_rgba(191,149,63,0.15),0_0_40px_rgba(96,165,250,0.1)] hover:bg-gradient-to-br hover:from-slate-800/20 hover:via-slate-700/25 hover:to-slate-800/20 {clickSplash ? 'click-splash' : ''}"
        role="button"
        tabindex="0"
        aria-label="Designer watermark - click for splash effect, right-click for accessibility info"
        onmouseenter={handleMouseEnter}
        onmouseleave={handleMouseLeave}
        onclick={handleWatermarkClick}
        onkeydown={(e) => e.key === 'Enter' && handleWatermarkClick()}
        oncontextmenu={handleContextMenu}
      >
        <!-- Decorative corner accents (animated on hover) -->
        <div class="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#BF953F]/0 group-hover:border-[#BF953F]/60 transition-all duration-500 rounded-tl-2xl"></div>
        <div class="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#BF953F]/0 group-hover:border-[#BF953F]/60 transition-all duration-500 rounded-br-2xl"></div>

        <div class="text-center space-y-1">
          <!-- "designed with ♥" line -->
          <p class="text-xs text-slate-500/70 font-light tracking-[0.15em] transition-all duration-300 group-hover:text-slate-300 group-hover:tracking-[0.18em]">
            designed with
            <span
              class="inline-block text-red-400/50 group-hover:text-red-400/90 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.5)]"
              style="animation: pulse-heart 2s ease-in-out infinite;"
              aria-label="love"
            >♥</span>
          </p>

          <!-- "by dr💧wn" line with bidirectional wave explosion -->
          <p class="text-sm font-light tracking-normal transition-all duration-500 scale-95 opacity-70 group-hover:scale-100 group-hover:opacity-100 group-hover:tracking-wide">
            <span class="text-slate-500/70 group-hover:text-slate-300 transition-colors duration-300">by</span> <span class="water-splash-container relative inline-block font-['Cinzel'] font-bold text-sm leading-none">

              <!-- Individual animated letters with bidirectional explosion -->
              <span class="inline-block relative z-10" style="letter-spacing: -0.02em;">
                <!-- Left side: "dr" - waves explode leftward (reverse order delays) -->
                <span class="letter-wave-left inline-block text-slate-400/60 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:via-cyan-300 group-hover:to-blue-500 transition-all duration-700" style="animation-delay: 100ms;">{nameBeforeIcon.charAt(0)}</span><span class="letter-wave-left inline-block text-slate-400/60 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:via-cyan-300 group-hover:to-blue-500 transition-all duration-700" style="animation-delay: 0ms;">{nameBeforeIcon.charAt(1)}</span><!--

                --><!-- Water droplet functioning as "o" - perfectly sized -->
                <span class="relative inline-block -top-[0.05em]" style="margin: 0 -0.08em;">
                  <!-- Realistic water droplet particle burst (14 particles) -->
                  {#each waterParticles as particle, i}
                    {@const radians = (particle.angle * Math.PI) / 180}
                    {@const x = Math.cos(radians) * particle.radius}
                    {@const y = Math.sin(radians) * particle.radius}
                    {@const particleColor = i % 3 === 0 ? 'rgba(6, 182, 212, 0.8)' : i % 3 === 1 ? 'rgba(59, 130, 246, 0.8)' : 'rgba(34, 211, 238, 0.8)'}
                    <span
                      class="droplet-particle absolute rounded-full opacity-0 transform"
                      style="
                        width: {particle.size}px;
                        height: {particle.size}px;
                        background: {particleColor};
                        left: 50%;
                        top: 50%;
                        --tx: {x}px;
                        --ty: {y}px;
                        --delay: {particle.delay}ms;
                        --click-tx: {x * 0.6}px;
                        --click-ty: {y * 0.6}px;
                        filter: blur(0.5px);
                        box-shadow: 0 0 4px rgba(6, 182, 212, 0.4);
                        transform: translate(-50%, -50%) scale(0);
                        transition: all 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
                        transition-delay: var(--delay);
                      "
                    ></span>
                  {/each}

                  <!-- Droplet sized to match text flow perfectly -->
                  <span
                    class="droplet-bounce inline-block transition-all duration-500 text-[1em] leading-none"
                    style="filter: drop-shadow(0 1px 3px rgba(96, 165, 250, 0.2));"
                    aria-label={watermarkIcon === '💧' ? 'water droplet' : 'icon'}
                  >
                    <span class="inline-block text-blue-400/50 group-hover:text-cyan-300 transition-colors duration-500 group-hover:drop-shadow-[0_0_12px_rgba(96,165,250,0.8)]">{watermarkIcon}</span>
                  </span>
                </span><!--

                --><!-- Right side: "wn" - waves explode rightward (normal delays) -->
                <span class="letter-wave-right letter-glow inline-block text-slate-400/60 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:via-blue-400 group-hover:to-cyan-500 transition-all duration-700" style="animation-delay: 0ms;">{nameAfterIcon.charAt(0)}</span><span class="letter-wave-right letter-glow inline-block text-slate-400/60 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:via-blue-400 group-hover:to-cyan-500 transition-all duration-700" style="animation-delay: 100ms;">{nameAfterIcon.charAt(1)}</span>
              </span>

            </span>
          </p>
        </div>

        <!-- Tech Stack Orbital Display (appears after 2s hover) -->
        {#if showOrbitalIcons}
          <div class="orbital-container absolute inset-0 pointer-events-none" aria-hidden="true">
            {#each techIcons as { icon, angle, label }}
              {@const radians = (angle * Math.PI) / 180}
              {@const radius = 60}
              {@const x = Math.cos(radians) * radius}
              {@const y = Math.sin(radians) * radius}
              <div
                class="orbital-icon absolute"
                style="left: calc(50% + {x}px); top: calc(50% + {y}px);"
                title={label}
              >
                <Icon {icon} class="w-5 h-5 tech-icon" />
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>

  <!-- Accessibility Badge Modal -->
  <AccessibilityBadge
    bind:show={showAccessibilityModal}
    onClose={() => showAccessibilityModal = false}
  />
</footer>

<!-- Animations -->
<style>
  /* Pulsing heart animation */
  @keyframes pulse-heart {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  /* Letter wave animations - bidirectional explosion from droplet */
  /* Left side waves (dr) - explode leftward */
  .letter-wave-left {
    /* Synchronized collapse - no delay, uniform 300ms */
    transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1),
                opacity 300ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .group:hover .letter-wave-left {
    animation: wave-bounce-left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    transition-delay: 0ms; /* Remove delay on hover in */
  }

  @keyframes wave-bounce-left {
    0% {
      transform: translateY(0px) translateX(0px) rotate(0deg);
    }
    40% {
      transform: translateY(-8px) translateX(-4px) rotate(-5deg);
    }
    70% {
      transform: translateY(-5px) translateX(-2px) rotate(-3deg);
    }
    100% {
      transform: translateY(-6px) translateX(-3px) rotate(-4deg);
    }
  }

  /* Right side waves (wn) - explode rightward */
  .letter-wave-right {
    /* Synchronized collapse - no delay, uniform 300ms */
    transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1),
                opacity 300ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .group:hover .letter-wave-right {
    animation: wave-bounce-right 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    transition-delay: 0ms; /* Remove delay on hover in */
  }

  @keyframes wave-bounce-right {
    0% {
      transform: translateY(0px) translateX(0px) rotate(0deg);
    }
    40% {
      transform: translateY(-8px) translateX(4px) rotate(5deg);
    }
    70% {
      transform: translateY(-5px) translateX(2px) rotate(3deg);
    }
    100% {
      transform: translateY(-6px) translateX(3px) rotate(4deg);
    }
  }

  /* Droplet bounce with splash */
  .droplet-bounce {
    /* Synchronized collapse - no delay, uniform 300ms */
    transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .group:hover .droplet-bounce {
    animation: droplet-splash 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
    transition-delay: 0ms; /* Remove delay on hover in */
  }

  @keyframes droplet-splash {
    0% {
      transform: translateY(0) scale(1);
    }
    40% {
      transform: translateY(-12px) scale(1.2);
    }
    60% {
      transform: translateY(-8px) scale(1.15);
    }
    100% {
      transform: translateY(-10px) scale(1.25) rotate(5deg);
    }
  }

  /* Water droplet particle burst animations */
  .droplet-particle {
    transition: all 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* Hover splash - full distance */
  .group:hover .droplet-particle {
    opacity: 0.6 !important;
    transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1) !important;
  }

  /* Click splash - smaller scale */
  .click-splash .droplet-particle {
    opacity: 0.4 !important;
    transform: translate(calc(-50% + var(--click-tx)), calc(-50% + var(--click-ty))) scale(0.8) !important;
    transition: all 400ms cubic-bezier(0.34, 1.56, 0.64, 1) !important;
  }



  /* Tech Stack Orbital Display Animations */
  .orbital-container {
    animation: orbit-rotate 20s linear infinite;
  }

  @keyframes orbit-rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .orbital-icon {
    transform: translate(-50%, -50%);
    opacity: 0;
    animation: orbital-fade-in 500ms ease-out forwards;
  }

  @keyframes orbital-fade-in {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.5);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  /* Tech icon glow effect matching watermark theme */
  .orbital-icon :global(.tech-icon) {
    filter: drop-shadow(0 0 8px rgba(96, 165, 250, 0.4))
            drop-shadow(0 0 12px rgba(191, 149, 63, 0.2));
    transition: filter 300ms ease;
  }

  .orbital-icon:hover :global(.tech-icon) {
    filter: drop-shadow(0 0 12px rgba(96, 165, 250, 0.6))
            drop-shadow(0 0 16px rgba(191, 149, 63, 0.3));
  }

  /* Counter-rotate icons to keep them upright while orbit rotates */
  .orbital-icon :global(.tech-icon) {
    animation: counter-rotate 20s linear infinite;
  }

  @keyframes counter-rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(-360deg);
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .letter-wave-left,
    .letter-wave-right,
    .droplet-bounce,
    .droplet-particle,
    .orbital-container,
    .orbital-icon :global(.tech-icon) {
      animation: none !important;
    }

    .group:hover .letter-wave-left,
    .group:hover .letter-wave-right,
    .group:hover .droplet-bounce,
    .group:hover .droplet-particle,
    .click-splash .droplet-particle {
      transform: none !important;
      opacity: 0 !important;
    }

    .orbital-icon {
      opacity: 1 !important;
      transform: translate(-50%, -50%) !important;
    }
  }
</style>
