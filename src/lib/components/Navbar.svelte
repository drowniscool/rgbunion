<script>
  import { page } from '$app/stores';
  import { goto, invalidateAll } from '$app/navigation';
  import { loggedIn, user } from '$lib/stores.js';
  import { fade, slide, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { enhancedFade, staggeredSlide, navReveal, MOTION_TOKENS } from '$lib/motion/transitions';
  import { onMount } from 'svelte';
  import {
    Home,
  LayoutDashboard,
    LogOut,
    LogIn,
    Store,
    Settings,
    Menu,
    X,
    User,
    FileText
  } from 'lucide-svelte';

  let { user: userProp = null, loggedIn: loggedInProp = false, isAdmin = false, onProfileClick = null, navbarHeight: navbarHeightProp = $bindable() } = $props();

  // Create reactive values that prioritize store state over props for immediate updates
  let currentUser = $derived($user || userProp);
  let currentLoggedIn = $derived($loggedIn || loggedInProp);

  let mobileMenuOpen = $state(false);
  let mounted = $state(false);
  let scrollY = $state(0);
  let navbarHeight = $state(0);
  let navbarElement;

  // Parallax scroll effect calculations
  let scrolled = $derived(scrollY > 50);
  let backgroundOpacity = $derived(Math.min(0.95, 0.6 + (scrollY / 200) * 0.35));
  let blurIntensity = $derived(Math.min(24, 12 + (scrollY / 100) * 12));
  let borderOpacity = $derived(Math.min(0.4, 0.1 + (scrollY / 300) * 0.3));

  // Get current route for active state highlighting
  let currentPath = $derived($page.url.pathname);

  // Navigation items for different user types
  const publicNavItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/shop', label: 'Shop', icon: Store },
    { href: '/terms', label: 'Terms', icon: FileText }
  ];

  const userNavItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/shop', label: 'Shop', icon: Store },
    { href: '/terms', label: 'Terms', icon: FileText },
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard }
  ];

  const adminNavItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/shop', label: 'Shop', icon: Store },
    { href: '/terms', label: 'Terms', icon: FileText },
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard }
  ];

  // Get current navigation items based on authentication and admin status
  let navItems = $derived(() => {
    // Ensure we always return a valid array during SSR
    if (typeof currentLoggedIn !== 'boolean') return publicNavItems;
    if (!currentLoggedIn) return publicNavItems;
    return isAdmin ? adminNavItems : userNavItems;
  });

  // Check if a route is active with precise path matching
  function isActive(href) {
    // Ensure we have a valid path during SSR
    if (!currentPath || typeof currentPath !== 'string') return false;

    if (href === '/' && currentPath === '/') return true;
    if (href !== '/') {
      // Exact match first
      if (currentPath === href) return true;
      // For prefix matching, only allow if there are more specific routes that don't match
      // This prevents /admin from matching /admin/account when /admin/account is available
      if (currentPath.startsWith(href + '/')) {
        // Check if there's a more specific route in the current nav items
        const moreSpecificExists = navItems().some(item =>
          item.href !== href &&
          item.href.startsWith(href + '/') &&
          currentPath === item.href
        );
        return !moreSpecificExists;
      }
    }
    return false;
  }
  // Handle navigation with mobile menu close
  function handleNavigation(href) {
    mobileMenuOpen = false;
    goto(href);
  }

  // Handle logout with immediate UI state update
  async function handleLogout() {
    mobileMenuOpen = false;

    // Immediately update the stores for instant UI feedback
    user.set(null);
    loggedIn.set(false);

    try {
      // Navigate to logout route to handle server-side session cleanup
      await goto('/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: direct navigation
      window.location.href = '/logout';
    }
  }

  // Handle profile click
  async function handleProfile() {
    mobileMenuOpen = false;

    const triggerModal = () => {
      if (onProfileClick) {
        onProfileClick();
      }
    };

    if (currentPath !== '/admin') {
      try {
        await goto('/admin');
      } catch (error) {
        console.error('Dashboard navigation error:', error);
        window.location.href = '/admin';
        return;
      }
    }

    triggerModal();
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

  // Initialize mounted state and handle scroll effects
  $effect(() => {
    mounted = true;

    // Update navbar height for layout spacing
    if (navbarElement) {
      navbarHeight = navbarElement.offsetHeight;
      if (navbarHeightProp !== undefined) {
        navbarHeightProp = navbarHeight;
      }
    }
  });

  // Handle scroll updates for parallax effects
  onMount(() => {
    const updateScrollY = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('scroll', updateScrollY, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateScrollY);
    };
  });
</script>

<svelte:window on:click={handleClickOutside} on:keydown={handleKeydown} />

<nav bind:this={navbarElement} class="navbar-container fixed top-0 left-0 right-0 z-50" class:mounted class:scrolled style="background-color: rgba(15, 23, 42, {backgroundOpacity}); backdrop-filter: blur({blurIntensity}px); border-bottom-color: rgba(191, 149, 63, {borderOpacity});">
  <div class="navbar-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="navbar-inner flex items-center justify-between h-16 lg:h-20">

      <!-- Logo/Brand -->
      <div class="navbar-brand flex-shrink-0">
        <button
          onclick={() => handleNavigation('/')}
          class="brand-link group flex items-center focus:outline-none focus:ring-2 focus:ring-[#BF953F] focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg p-2"
          aria-label="RGBUNION Home"
        >
          <div class="brand-identity flex items-center gap-3">
            <div class="brand-logo-wrapper relative flex items-center justify-center">
              <img
                src="/logo.png"
                alt="RGBUNION logo"
                class="brand-logo h-9 w-9 sm:h-10 sm:w-10 lg:h-12 lg:w-12 object-contain drop-shadow-[0_4px_12px_rgba(191,149,63,0.35)] transition-transform duration-300 group-hover:scale-105"
                decoding="async"
                fetchpriority="high"
              />
              <span class="brand-logo-glow"></span>
            </div>
            <div class="brand-text relative">
              <h1 class="brand-title text-xl sm:text-2xl lg:text-3xl font-bold tracking-wider transition-all duration-300 group-hover:scale-105"
                  style="font-family: 'Cinzel', serif;">
                RGBUNION
              </h1>
              <div class="brand-underline absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 transition-all duration-300 w-0 group-hover:w-full"></div>
            </div>
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
              {@render item.icon({ class: "w-4 h-4 transition-all duration-300 group-hover:scale-110" })}
              <span class="nav-tab-text text-sm font-medium tracking-wider">{item.label}</span>
            </button>
          {/each}
        </div>

        <!-- Authentication Action Section -->
        <div class="nav-auth-section ml-4 flex items-center">
          {#if currentLoggedIn}
            <div class="nav-divider w-px h-6 bg-[#BF953F]/30 mr-4"></div>

            <!-- Profile Button for Admin Users -->
            {#if isAdmin && onProfileClick}
              <button
                onclick={handleProfile}
                class="nav-profile-btn group flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[#BF953F]/30 text-[#BF953F] hover:text-[#FCF6BA] hover:bg-[#BF953F]/10 hover:border-[#BF953F]/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#BF953F] focus:ring-offset-2 focus:ring-offset-slate-900 mr-3"
                aria-label="Account Settings"
                title="Account Settings"
              >
                <div class="profile-circle w-8 h-8 bg-gradient-to-br from-[#BF953F]/20 to-[#B38728]/20 rounded-full flex items-center justify-center border border-[#BF953F]/30 group-hover:border-[#BF953F]/50 transition-all duration-300">
                  <User class="w-4 h-4 transition-all duration-300 group-hover:scale-110" />
                </div>
                <span class="text-sm font-medium tracking-wider hidden sm:inline">Account</span>
              </button>
            {/if}

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
        transition:enhancedFade={{ duration: MOTION_TOKENS.durations.normal, direction: 'down' }}
      >
        <div class="mobile-menu-content px-3 pt-3 pb-4 space-y-2 bg-slate-800/95 backdrop-blur-md rounded-b-xl border-t border-[#BF953F]/30 shadow-xl shadow-black/20">
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
                in:staggeredSlide={{ index, direction: 'right', distance: 20, staggerDelay: MOTION_TOKENS.stagger.normal }}
              >
                <div class="mobile-nav-tab-border absolute left-0 top-0 bottom-0 w-1 transition-all duration-300" class:bg-[#BF953F]={isActive(item.href)} class:bg-transparent={!isActive(item.href)}></div>
                {@render item.icon({ class: "w-5 h-5 transition-all duration-300 group-hover:scale-110" })}
                <span class="mobile-nav-tab-text font-medium tracking-wide text-left flex-1">{item.label}</span>
                {#if isActive(item.href)}
                  <div class="mobile-nav-tab-indicator w-2 h-2 rounded-full bg-[#BF953F] animate-pulse"></div>
                {/if}
              </button>
            {/each}
          </div>

          <!-- Mobile Auth Section -->
          <div class="mobile-auth-section pt-2 border-t border-[#BF953F]/20">
            {#if currentLoggedIn}
              <!-- Mobile Profile Button for Admin Users -->
              {#if isAdmin && onProfileClick}
                <button
                  onclick={handleProfile}
                  class="mobile-profile-btn group flex items-center gap-3 w-full px-4 py-3.5 rounded-lg border border-[#BF953F]/30 text-[#BF953F] hover:text-[#FCF6BA] hover:bg-[#BF953F]/10 hover:border-[#BF953F]/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#BF953F] focus:ring-offset-2 focus:ring-offset-slate-800 relative overflow-hidden mb-2"
                  style="min-height: 44px;"
                  aria-label="Account Settings"
                  in:staggeredSlide={{ index: navItems().length, direction: 'right', distance: 20, staggerDelay: MOTION_TOKENS.stagger.normal }}
                >
                  <div class="profile-circle w-8 h-8 bg-gradient-to-br from-[#BF953F]/20 to-[#B38728]/20 rounded-full flex items-center justify-center border border-[#BF953F]/30 group-hover:border-[#BF953F]/50 transition-all duration-300">
                    <User class="w-4 h-4 transition-all duration-300 group-hover:scale-110" />
                  </div>
                  <span class="mobile-profile-text font-medium tracking-wide text-left flex-1">Account Settings</span>
                </button>
              {/if}

              <button
                onclick={handleLogout}
                class="mobile-logout-btn group flex items-center gap-3 w-full px-4 py-3.5 rounded-lg border border-red-400/30 text-red-300 hover:text-red-200 hover:bg-red-400/10 hover:border-red-400/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-800 relative overflow-hidden"
                style="min-height: 44px;"
                aria-label="Logout"
                in:staggeredSlide={{ index: navItems().length + 1, direction: 'right', distance: 20, staggerDelay: MOTION_TOKENS.stagger.normal }}
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
                in:staggeredSlide={{ index: navItems().length + 1, direction: 'right', distance: 20, staggerDelay: MOTION_TOKENS.stagger.normal }}
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
    /* Background and backdrop effects are handled inline via style binding for dynamic parallax */
    border-bottom: 1px solid transparent;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: backdrop-filter, background-color;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    transform: translateZ(0); /* Force hardware acceleration */
  }

  /* Smooth bottom gradient fade for seamless page integration */
  .navbar-container::after {
    content: '';
    position: absolute;
    bottom: -24px;
    left: 0;
    right: 0;
    height: 24px;
    background: linear-gradient(
      to bottom,
      rgba(15, 23, 42, 0.8) 0%,
      rgba(15, 23, 42, 0.5) 25%,
      rgba(15, 23, 42, 0.2) 50%,
      rgba(191, 149, 63, 0.03) 75%,
      transparent 100%
    );
    opacity: 0;
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
    transform: translateZ(0);
    will-change: opacity;
  }

  .navbar-container.scrolled {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 16px rgba(191, 149, 63, 0.1);
  }

  .navbar-container.scrolled::after {
    opacity: 1;
  }

  .navbar-container.mounted {
    animation: navbarSlideIn 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards;
  }

  @keyframes navbarSlideIn {
    0% {
      opacity: 0;
      transform: translateY(-100%) translateZ(0);
    }
    100% {
      opacity: 1;
      transform: translateY(0) translateZ(0);
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

  .brand-logo-wrapper {
    padding: 4px;
    border-radius: 20px;
    background: linear-gradient(135deg, rgba(191, 149, 63, 0.35), rgba(252, 246, 186, 0.15));
    box-shadow: inset 0 1px 1px rgba(252, 246, 186, 0.2), 0 6px 18px rgba(0, 0, 0, 0.35);
  }

  .brand-logo {
    border-radius: 16px;
    background: radial-gradient(circle at 30% 30%, rgba(252, 246, 186, 0.25), transparent 60%), rgba(15, 23, 42, 0.65);
  }

  .brand-logo-glow {
    position: absolute;
    inset: -8px;
    border-radius: 20px;
    background: radial-gradient(circle, rgba(191, 149, 63, 0.35), transparent 70%);
    opacity: 0;
    filter: blur(12px);
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .brand-link:hover .brand-logo-glow,
  .brand-link:focus-visible .brand-logo-glow {
    opacity: 1;
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

  .nav-tab-active .nav-tab-text {
    text-shadow: 0 0 10px rgba(191, 149, 63, 0.3);
  }

  /* Tab Text Transitions */
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

  /* Performance optimizations for fixed positioning */
  .navbar-container {
    /* GPU acceleration for smooth scrolling effects */
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
  }

  /* Smooth transitions for scroll effects */
  .navbar-container:not(.mounted) {
    backdrop-filter: none;
    background-color: transparent;
  }

  /* Mobile-specific optimizations */
  @media (max-width: 1024px) {
    .navbar-container {
      /* Reduce backdrop blur on mobile for better performance */
      backdrop-filter: blur(12px) !important;
    }

    .navbar-container.scrolled {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), 0 1px 8px rgba(191, 149, 63, 0.1);
    }

    /* Slightly reduce gradient height on mobile for better performance */
    .navbar-container::after {
      height: 20px;
      bottom: -20px;
    }
  }

  /* Reduced Motion Support */
  @media (prefers-reduced-motion: reduce) {
    .navbar-container {
      transition: none;
      transform: none !important;
      backdrop-filter: blur(20px) !important;
      background-color: rgba(15, 23, 42, 0.95) !important;
    }

    .navbar-container::after {
      transition: none;
      opacity: 1 !important;
    }

    .nav-tab,
    .mobile-nav-tab,
    .nav-logout-btn,
    .nav-login-btn,
    .mobile-logout-btn,
    .mobile-login-btn,
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
  .nav-tab-text,
  .mobile-nav-tab-text {
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