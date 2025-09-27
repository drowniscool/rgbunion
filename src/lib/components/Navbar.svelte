<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { fade, slide, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import {
    Home,
  LayoutDashboard,
    LogOut,
    LogIn,
    Store,
    Settings,
    Menu,
    X
  } from 'lucide-svelte';

  let { user = null, loggedIn = false, isAdmin = false } = $props();

  let mobileMenuOpen = $state(false);
  let mounted = $state(false);

  // Get current route for active state highlighting
  let currentPath = $derived($page.url.pathname);

  // Navigation items for different user types
  const publicNavItems = [
    { href: '/shop', label: 'Shop', icon: Store }
  ];

  const userNavItems = [
    { href: '/shop', label: 'Shop', icon: Store },
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard }
  ];

  const adminNavItems = [
    { href: '/shop', label: 'Shop', icon: Store },
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/account', label: 'Account', icon: Settings }
  ];

  // Get current navigation items based on authentication and admin status
  let navItems = $derived(() => {
    if (!loggedIn) return publicNavItems;
    return isAdmin ? adminNavItems : userNavItems;
  });

  // Check if a route is active
  function isActive(href) {
    if (href === '/' && currentPath === '/') return true;
    if (href !== '/' && currentPath.startsWith(href)) return true;
    return false;
  }

  // Handle navigation with mobile menu close
  function handleNavigation(href) {
    mobileMenuOpen = false;
    goto(href);
  }

  // Handle logout
  function handleLogout() {
    mobileMenuOpen = false;
    goto('/logout');
  }

  // Close mobile menu when clicking outside
  function handleClickOutside(event) {
    if (mobileMenuOpen && !event.target.closest('.navbar-mobile-menu') && !event.target.closest('.navbar-mobile-toggle')) {
      mobileMenuOpen = false;
    }
  }

  // Close mobile menu on escape key
  function handleKeydown(event) {
    if (event.key === 'Escape' && mobileMenuOpen) {
      mobileMenuOpen = false;
    }
  }

  // Initialize mounted state
  $effect(() => {
    mounted = true;
  });
</script>

<svelte:window on:click={handleClickOutside} on:keydown={handleKeydown} />

<nav class="navbar-container relative z-50" class:mounted>
  <div class="navbar-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="navbar-inner flex items-center justify-between h-16 lg:h-20">

      <!-- Logo/Brand -->
      <div class="navbar-brand flex-shrink-0">
        <button
          onclick={() => handleNavigation(loggedIn ? '/admin' : '/')}
          class="brand-link group flex items-center focus:outline-none focus:ring-2 focus:ring-[#BF953F] focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg p-2"
          aria-label="RGBUNION Home"
        >
          <div class="brand-text relative">
            <h1 class="brand-title text-xl sm:text-2xl lg:text-3xl font-bold tracking-wider transition-all duration-300 group-hover:scale-105"
                style="font-family: 'Cinzel', serif;">
              RGBUNION
            </h1>
            <div class="brand-underline absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 transition-all duration-300 w-0 group-hover:w-full"></div>
          </div>
        </button>
      </div>

      <!-- Desktop Navigation -->
      <div class="navbar-tabs-desktop hidden lg:flex items-center">
        <!-- Navigation Tab Group -->
        <div class="nav-tab-group flex items-center gap-1 bg-slate-800/50 rounded-xl p-1 backdrop-blur-sm border border-[#BF953F]/20">
          {#each navItems() as item}
            <button
              onclick={() => handleNavigation(item.href)}
              class="nav-tab flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#BF953F] focus:ring-offset-2 focus:ring-offset-slate-900 group"
              class:nav-tab-active={isActive(item.href)}
              class:nav-tab-inactive={!isActive(item.href)}
              aria-label={item.label}
            >
              <svelte:component this={item.icon} class="nav-tab-icon w-4 h-4 transition-all duration-300 group-hover:scale-110" />
              <span class="nav-tab-text text-sm font-medium tracking-wider">{item.label}</span>
            </button>
          {/each}
        </div>

        <!-- Authentication Action Section -->
        <div class="nav-auth-section ml-4 flex items-center">
          {#if loggedIn}
            <div class="nav-divider w-px h-6 bg-[#BF953F]/30 mr-4"></div>
            <button
              onclick={handleLogout}
              class="nav-logout-btn group flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-400/30 text-red-300 hover:text-red-200 hover:bg-red-400/10 hover:border-red-400/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              aria-label="Logout"
            >
              <LogOut class="nav-logout-icon w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <span class="text-sm font-medium tracking-wider">Logout</span>
            </button>
          {:else}
            <div class="nav-divider w-px h-6 bg-[#BF953F]/30 mr-4"></div>
            <button
              onclick={() => handleNavigation('/login')}
              class="nav-login-btn group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#BF953F] to-[#B38728] hover:from-[#B38728] hover:to-[#BF953F] text-black font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#BF953F]/30 focus:outline-none focus:ring-2 focus:ring-[#BF953F] focus:ring-offset-2 focus:ring-offset-slate-900 relative overflow-hidden"
              aria-label="Login"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <LogIn class="nav-login-icon w-4 h-4 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12 relative z-10" />
              <span class="text-sm tracking-wider relative z-10">Login</span>
            </button>
          {/if}
        </div>
      </div>

      <!-- Mobile Menu Toggle -->
      <div class="navbar-mobile lg:hidden">
        <button
          onclick={() => mobileMenuOpen = !mobileMenuOpen}
          class="navbar-mobile-toggle p-2 rounded-lg text-[#FCF6BA]/70 hover:text-[#BF953F] hover:bg-[#BF953F]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#BF953F] focus:ring-offset-2 focus:ring-offset-slate-900"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {#if mobileMenuOpen}
            <X class="w-6 h-6" />
          {:else}
            <Menu class="w-6 h-6" />
          {/if}
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    {#if mobileMenuOpen}
      <div
        class="navbar-mobile-menu lg:hidden"
        transition:slide={{ duration: 300, easing: cubicOut }}
      >
        <div class="mobile-menu-content px-3 pt-3 pb-4 space-y-2 bg-slate-800/95 backdrop-blur-md rounded-b-xl border-t border-[#BF953F]/30">
          <!-- Mobile Navigation Tabs -->
          <div class="mobile-nav-tabs space-y-1">
            {#each navItems() as item, index}
              <button
                onclick={() => handleNavigation(item.href)}
                class="mobile-nav-tab group flex items-center gap-3 w-full px-4 py-3.5 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#BF953F] focus:ring-offset-2 focus:ring-offset-slate-800 relative overflow-hidden"
                class:mobile-nav-tab-active={isActive(item.href)}
                class:mobile-nav-tab-inactive={!isActive(item.href)}
                style="animation-delay: {index * 50}ms; min-height: 44px;"
                aria-label={item.label}
                in:fly={{ x: -20, duration: 300, delay: index * 50 }}
              >
                <div class="mobile-nav-tab-border absolute left-0 top-0 bottom-0 w-1 transition-all duration-300" class:bg-[#BF953F]={isActive(item.href)} class:bg-transparent={!isActive(item.href)}></div>
                <svelte:component this={item.icon} class="mobile-nav-tab-icon w-5 h-5 transition-all duration-300 group-hover:scale-110" />
                <span class="mobile-nav-tab-text font-medium tracking-wide text-left flex-1">{item.label}</span>
                {#if isActive(item.href)}
                  <div class="mobile-nav-tab-indicator w-2 h-2 rounded-full bg-[#BF953F] animate-pulse"></div>
                {/if}
              </button>
            {/each}
          </div>

          <!-- Mobile Auth Section -->
          <div class="mobile-auth-section pt-2 border-t border-[#BF953F]/20">
            {#if loggedIn}
              <button
                onclick={handleLogout}
                class="mobile-logout-btn group flex items-center gap-3 w-full px-4 py-3.5 rounded-lg border border-red-400/30 text-red-300 hover:text-red-200 hover:bg-red-400/10 hover:border-red-400/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-800 relative overflow-hidden"
                style="min-height: 44px;"
                aria-label="Logout"
                in:fly={{ x: -20, duration: 300, delay: navItems().length * 50 }}
              >
                <LogOut class="mobile-logout-icon w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <span class="mobile-logout-text font-medium tracking-wide text-left flex-1">Logout</span>
              </button>
            {:else}
              <button
                onclick={() => handleNavigation('/login')}
                class="mobile-login-btn group flex items-center gap-3 w-full px-4 py-4 bg-gradient-to-r from-[#BF953F] to-[#B38728] hover:from-[#B38728] hover:to-[#BF953F] text-black font-semibold rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#BF953F]/25 focus:outline-none focus:ring-2 focus:ring-[#BF953F] focus:ring-offset-2 focus:ring-offset-slate-800 relative overflow-hidden"
                style="min-height: 44px;"
                aria-label="Login"
                in:fly={{ x: -20, duration: 300, delay: navItems().length * 50 }}
              >
                <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <LogIn class="mobile-login-icon w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12 relative z-10" />
                <span class="mobile-login-text tracking-wide text-left flex-1 relative z-10">Login</span>
              </button>
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>
</nav>

<style>
  .navbar-container {
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(191, 149, 63, 0.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .navbar-container.mounted {
    animation: navbarSlideIn 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards;
  }

  @keyframes navbarSlideIn {
    0% {
      opacity: 0;
      transform: translateY(-20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .brand-title {
    background: linear-gradient(135deg, #BF953F, #FCF6BA, #B38728, #FCF6BA);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    background-size: 300% 300%;
    animation: goldShimmer 3s ease-in-out infinite;
  }

  @keyframes goldShimmer {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  .brand-underline {
    animation: underlineExpand 0.3s ease-out forwards;
  }

  @keyframes underlineExpand {
    from { width: 0; }
    to { width: 100%; }
  }

  /* Desktop Navigation Tab Styles */
  .nav-tab-group {
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(191, 149, 63, 0.1);
  }

  .nav-tab {
    position: relative;
    letter-spacing: 0.025em;
    font-weight: 500;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Inactive Tab State */
  .nav-tab-inactive {
    color: rgba(252, 246, 186, 0.7);
    background: transparent;
    border: 1px solid transparent;
  }

  .nav-tab-inactive:hover {
    color: rgba(252, 246, 186, 0.9);
    background: rgba(191, 149, 63, 0.1);
    border: 1px solid rgba(191, 149, 63, 0.2);
    transform: translateY(-1px);
  }

  /* Active Tab State */
  .nav-tab-active {
    color: rgb(191, 149, 63);
    background: linear-gradient(135deg, rgba(191, 149, 63, 0.15), rgba(179, 135, 40, 0.1));
    border: 1px solid rgba(191, 149, 63, 0.3);
    box-shadow: inset 0 1px 0 0 rgba(191, 149, 63, 0.2);
  }

  .nav-tab-active .nav-tab-icon,
  .nav-tab-active .nav-tab-text {
    text-shadow: 0 0 10px rgba(191, 149, 63, 0.3);
  }

  /* Tab Icon and Text Transitions */
  .nav-tab-icon,
  .nav-tab-text {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Authentication Button Styles */
  .nav-logout-btn {
    backdrop-filter: blur(8px);
  }

  .nav-logout-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px 0 rgba(248, 113, 113, 0.2);
  }

  .nav-login-btn {
    box-shadow: 0 4px 14px 0 rgba(191, 149, 63, 0.3);
    backdrop-filter: blur(8px);
  }

  .nav-login-btn:hover {
    box-shadow: 0 6px 20px 0 rgba(191, 149, 63, 0.4);
  }

  /* Mobile Navigation Tab Styles */
  .mobile-nav-tab {
    position: relative;
    font-weight: 500;
    letter-spacing: 0.025em;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(8px);
  }

  /* Mobile Inactive Tab State */
  .mobile-nav-tab-inactive {
    color: rgba(252, 246, 186, 0.7);
    background: rgba(191, 149, 63, 0.05);
    border: 1px solid rgba(191, 149, 63, 0.15);
  }

  .mobile-nav-tab-inactive:hover {
    color: rgba(252, 246, 186, 0.9);
    background: rgba(191, 149, 63, 0.1);
    border: 1px solid rgba(191, 149, 63, 0.25);
    transform: translateX(4px);
  }

  /* Mobile Active Tab State */
  .mobile-nav-tab-active {
    color: rgb(191, 149, 63);
    background: linear-gradient(135deg, rgba(191, 149, 63, 0.15), rgba(179, 135, 40, 0.1));
    border: 1px solid rgba(191, 149, 63, 0.3);
    box-shadow: inset 0 1px 0 0 rgba(191, 149, 63, 0.2);
  }

  .mobile-nav-tab-active .mobile-nav-tab-icon,
  .mobile-nav-tab-active .mobile-nav-tab-text {
    text-shadow: 0 0 10px rgba(191, 149, 63, 0.3);
  }

  /* Mobile Authentication Button Styles */
  .mobile-logout-btn {
    backdrop-filter: blur(8px);
  }

  .mobile-logout-btn:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px 0 rgba(248, 113, 113, 0.2);
  }

  .mobile-login-btn {
    box-shadow: 0 4px 14px 0 rgba(191, 149, 63, 0.3);
    backdrop-filter: blur(8px);
  }

  .mobile-login-btn:hover {
    box-shadow: 0 6px 20px 0 rgba(191, 149, 63, 0.4);
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    .brand-title {
      font-size: 1.125rem;
    }
  }

  /* Enhanced Focus Styles for Accessibility */
  .nav-tab:focus-visible,
  .mobile-nav-tab:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(191, 149, 63, 0.6), inset 0 0 0 2px rgba(252, 246, 186, 0.8);
    transform: translateY(-1px);
  }

  .nav-logout-btn:focus-visible,
  .mobile-logout-btn:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.6), inset 0 0 0 2px rgba(252, 246, 186, 0.8);
  }

  .nav-login-btn:focus-visible,
  .mobile-login-btn:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(191, 149, 63, 0.6), inset 0 0 0 2px rgba(0, 0, 0, 0.8);
  }

  .navbar-mobile-toggle:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(191, 149, 63, 0.6);
  }

  /* Reduced Motion Support */
  @media (prefers-reduced-motion: reduce) {
    .nav-tab,
    .mobile-nav-tab,
    .nav-logout-btn,
    .nav-login-btn,
    .mobile-logout-btn,
    .mobile-login-btn,
    .nav-tab-icon,
    .mobile-nav-tab-icon,
    .navbar-mobile-toggle {
      transition: none;
      animation: none;
    }

    .nav-tab:hover,
    .mobile-nav-tab:hover {
      transform: none;
    }

    .nav-logout-btn:hover,
    .nav-login-btn:hover,
    .mobile-logout-btn:hover,
    .mobile-login-btn:hover {
      transform: none;
    }
  }

  /* High Contrast Mode Support */
  @media (prefers-contrast: high) {
    .nav-tab-active,
    .mobile-nav-tab-active {
      border: 2px solid rgb(191, 149, 63);
      background: rgba(191, 149, 63, 0.3);
    }

    .nav-tab-inactive,
    .mobile-nav-tab-inactive {
      border: 1px solid rgba(252, 246, 186, 0.5);
    }
  }

  /* Enhanced Animation Improvements */
  .nav-tab-icon,
  .mobile-nav-tab-icon,
  .nav-logout-icon,
  .nav-login-icon,
  .mobile-logout-icon,
  .mobile-login-icon {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .nav-tab-text,
  .mobile-nav-tab-text,
  .nav-logout-text,
  .nav-login-text,
  .mobile-logout-text,
  .mobile-login-text {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Tab Group Container Enhancements */
  .nav-tab-group:hover {
    box-shadow: 0 6px 25px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(191, 149, 63, 0.15);
  }

  /* Mobile Navigation Enhancements */
  .mobile-nav-tabs {
    animation: mobileTabsSlideIn 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  }

  @keyframes mobileTabsSlideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Auth Section Enhancements */
  .nav-auth-section,
  .mobile-auth-section {
    animation: authSectionFadeIn 0.5s ease-out 0.2s both;
  }

  @keyframes authSectionFadeIn {
    from {
      opacity: 0;
      transform: translateX(10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>