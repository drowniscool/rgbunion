<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { fade, slide, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import {
    Home,
    LayoutDashboard,
    User,
    LogOut,
    LogIn,
    Store,
    Settings,
    Menu,
    X
  } from 'lucide-svelte';

  let { user, loggedIn, isAdmin } = $props();

  let mobileMenuOpen = $state(false);
  let mounted = $state(false);

  // Get current route for active state highlighting
  let currentPath = $derived($page.url.pathname);

  // Navigation items for different user types
  const publicNavItems = [
    { href: '/', label: 'Home', icon: Home }
  ];

  const userNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/account', label: 'Account', icon: Settings }
  ];

  const adminNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin', label: 'Admin', icon: User },
    { href: '/shop', label: 'Shop', icon: Store },
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
          onclick={() => handleNavigation(loggedIn ? '/dashboard' : '/')}
          class="brand-link group flex items-center focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg p-2"
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
      <div class="navbar-desktop hidden lg:flex items-center space-x-1">
        {#each navItems as item}
          <button
            onclick={() => handleNavigation(item.href)}
            class="nav-item group flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            class:nav-item-active={isActive(item.href)}
            aria-label={item.label}
          >
            <svelte:component this={item.icon} class="nav-icon w-5 h-5 transition-transform group-hover:scale-110" />
            <span class="nav-text font-medium tracking-wide">{item.label}</span>
          </button>
        {/each}

        {#if loggedIn}
          <div class="nav-divider w-px h-6 bg-slate-600 mx-2"></div>
          <button
            onclick={handleLogout}
            class="nav-item logout-item group flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label="Logout"
          >
            <LogOut class="nav-icon w-5 h-5 transition-transform group-hover:scale-110" />
            <span class="nav-text font-medium tracking-wide">Logout</span>
          </button>
        {:else}
          <div class="nav-divider w-px h-6 bg-slate-600 mx-2"></div>
          <button
            onclick={() => handleNavigation('/login')}
            class="login-button group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/25 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label="Login"
          >
            <LogIn class="w-5 h-5 transition-transform group-hover:scale-110" />
            <span class="tracking-wide">Login</span>
          </button>
        {/if}
      </div>

      <!-- Mobile Menu Toggle -->
      <div class="navbar-mobile lg:hidden">
        <button
          onclick={() => mobileMenuOpen = !mobileMenuOpen}
          class="navbar-mobile-toggle p-2 rounded-lg text-slate-300 hover:text-amber-400 hover:bg-slate-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900"
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
        <div class="mobile-menu-content px-2 pt-2 pb-4 space-y-1 bg-slate-900/95 backdrop-blur-md rounded-b-xl border-t border-slate-700/50">
          {#each navItems as item, index}
            <button
              onclick={() => handleNavigation(item.href)}
              class="mobile-nav-item group flex items-center gap-4 w-full px-4 py-3 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              class:mobile-nav-item-active={isActive(item.href)}
              style="animation-delay: {index * 50}ms"
              aria-label={item.label}
              in:fly={{ x: -20, duration: 300, delay: index * 50 }}
            >
              <svelte:component this={item.icon} class="mobile-nav-icon w-5 h-5 transition-transform group-hover:scale-110" />
              <span class="mobile-nav-text font-medium tracking-wide">{item.label}</span>
            </button>
          {/each}

          <div class="mobile-menu-divider h-px bg-slate-700/50 my-2"></div>

          {#if loggedIn}
            <button
              onclick={handleLogout}
              class="mobile-nav-item logout-item group flex items-center gap-4 w-full px-4 py-3 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              aria-label="Logout"
              in:fly={{ x: -20, duration: 300, delay: navItems.length * 50 }}
            >
              <LogOut class="mobile-nav-icon w-5 h-5 transition-transform group-hover:scale-110" />
              <span class="mobile-nav-text font-medium tracking-wide">Logout</span>
            </button>
          {:else}
            <button
              onclick={() => handleNavigation('/login')}
              class="mobile-login-button group flex items-center gap-4 w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-500/25 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900"
              aria-label="Login"
              in:fly={{ x: -20, duration: 300, delay: navItems.length * 50 }}
            >
              <LogIn class="w-5 h-5 transition-transform group-hover:scale-110" />
              <span class="tracking-wide">Login</span>
            </button>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</nav>

<style>
  .navbar-container {
    background: rgba(2, 6, 23, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(148, 163, 184, 0.1);
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

  /* Desktop Navigation Styles */
  .nav-item {
    color: rgb(148, 163, 184);
    position: relative;
    overflow: hidden;
  }

  .nav-item:hover {
    color: rgb(251, 191, 36);
    background: rgba(251, 191, 36, 0.1);
    transform: translateY(-1px);
  }

  .nav-item-active {
    color: rgb(251, 191, 36);
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.1));
    box-shadow: inset 0 1px 0 0 rgba(251, 191, 36, 0.3);
  }

  .nav-item-active .nav-icon,
  .nav-item-active .nav-text {
    color: rgb(251, 191, 36);
    text-shadow: 0 0 10px rgba(251, 191, 36, 0.3);
  }

  .logout-item:hover {
    color: rgb(248, 113, 113);
    background: rgba(248, 113, 113, 0.1);
  }

  .login-button {
    box-shadow: 0 4px 14px 0 rgba(251, 191, 36, 0.2);
  }

  .login-button:hover {
    box-shadow: 0 6px 20px 0 rgba(251, 191, 36, 0.4);
  }

  /* Mobile Navigation Styles */
  .mobile-nav-item {
    color: rgb(148, 163, 184);
    background: rgba(51, 65, 85, 0.3);
    border: 1px solid rgba(148, 163, 184, 0.1);
  }

  .mobile-nav-item:hover {
    color: rgb(251, 191, 36);
    background: rgba(251, 191, 36, 0.1);
    border-color: rgba(251, 191, 36, 0.3);
    transform: translateX(4px);
  }

  .mobile-nav-item-active {
    color: rgb(251, 191, 36);
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.1));
    border-color: rgba(251, 191, 36, 0.4);
    box-shadow: inset 3px 0 0 0 rgb(251, 191, 36);
  }

  .mobile-nav-item-active .mobile-nav-icon,
  .mobile-nav-item-active .mobile-nav-text {
    text-shadow: 0 0 10px rgba(251, 191, 36, 0.3);
  }

  .mobile-nav-item.logout-item:hover {
    color: rgb(248, 113, 113);
    background: rgba(248, 113, 113, 0.1);
    border-color: rgba(248, 113, 113, 0.3);
  }

  .mobile-login-button {
    box-shadow: 0 4px 14px 0 rgba(251, 191, 36, 0.3);
  }

  .mobile-login-button:hover {
    box-shadow: 0 6px 20px 0 rgba(251, 191, 36, 0.4);
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    .brand-title {
      font-size: 1.125rem;
    }
  }

  /* Focus styles for accessibility */
  .nav-item:focus,
  .mobile-nav-item:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.5);
  }

  .navbar-mobile-toggle:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.5);
  }

  /* Animation improvements */
  .nav-icon,
  .mobile-nav-icon {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .nav-text,
  .mobile-nav-text {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
</style>