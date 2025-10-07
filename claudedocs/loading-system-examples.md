# Loading Animation System - Usage Examples

## Quick Start

### 1. Automatic Loading on Navigation
The loading system is already integrated in the root layout. It automatically shows:
- On initial page load (600ms)
- During route navigation
- Custom messages per route

**No code needed - it just works!**

### 2. Manual Loading Control in Components

```svelte
<script>
  import { loading } from '$lib/stores/loading';

  async function handleAction() {
    // Start loading
    loading.start('Processing your request');

    try {
      await someAsyncOperation();
      loading.setMessage('Almost done...');
      await finalStep();
    } catch (error) {
      console.error(error);
    } finally {
      // Always stop loading
      loading.stop();
    }
  }
</script>

<button onclick={handleAction}>
  Process Data
</button>
```

### 3. Form Submission with Loading

```svelte
<script>
  import { enhance } from '$app/forms';
  import { loading } from '$lib/stores/loading';

  let isSubmitting = $state(false);
</script>

<form
  method="post"
  use:enhance={() => {
    isSubmitting = true;
    loading.start('Submitting form');

    return async ({ update, result }) => {
      await update();
      isSubmitting = false;
      loading.stop();

      if (result.type === 'redirect') {
        // Navigation will show loader automatically
      }
    };
  }}
>
  <button type="submit" disabled={isSubmitting}>
    {isSubmitting ? 'Submitting...' : 'Submit'}
  </button>
</form>
```

### 4. Progress-Based Loading

```svelte
<script>
  import { loading } from '$lib/stores/loading';

  async function uploadFile(file) {
    loading.start('Preparing upload');

    for (let progress = 0; progress <= 100; progress += 10) {
      loading.setProgress(progress);
      loading.setMessage(`Uploading: ${progress}%`);
      await simulateUploadChunk();
    }

    loading.setMessage('Upload complete!');
    setTimeout(() => loading.stop(), 1000);
  }
</script>
```

### 5. Multi-Step Process

```svelte
<script>
  import { loading } from '$lib/stores/loading';

  async function processOrder() {
    loading.start('Validating order');

    await validateOrder();

    loading.setMessage('Processing payment');
    await processPayment();

    loading.setMessage('Confirming order');
    await confirmOrder();

    loading.setMessage('Sending confirmation');
    await sendConfirmation();

    loading.stop();
  }
</script>
```

## Animation Utilities

### Button Ripple Effect

```svelte
<button class="btn-ripple bg-gradient-to-r from-[#BF953F] to-[#B38728] px-6 py-3 rounded-lg">
  Click for ripple effect
</button>
```

### Hover Glow

```svelte
<div class="hover-glow bg-slate-800 border border-slate-700 rounded-xl p-6">
  Hover me for gold glow
</div>
```

### Gold Shimmer Text

```svelte
<h1 class="gold-shimmer text-5xl font-bold font-cinzel">
  Premium Animated Title
</h1>
```

### Skeleton Loading Placeholders

```svelte
<!-- Loading state -->
{#if loading}
  <div class="space-y-4">
    <div class="skeleton h-20 w-full"></div>
    <div class="skeleton h-40 w-full"></div>
    <div class="skeleton h-12 w-2/3"></div>
  </div>
{:else}
  <!-- Actual content -->
{/if}
```

### Page Transitions

```svelte
<script>
  import { pageTransition } from '$lib/motion/transitions';
</script>

<div in:pageTransition={{ direction: 'up', duration: 400 }}>
  <!-- Page content with smooth entrance -->
</div>
```

### Enhanced Fade with Direction

```svelte
<script>
  import { enhancedFade } from '$lib/motion/transitions';
</script>

<div in:enhancedFade={{ direction: 'up', distance: 20 }}>
  Content fades in with upward motion
</div>
```

### Staggered List Animation

```svelte
<script>
  import { staggeredSlide } from '$lib/motion/transitions';

  let items = ['Item 1', 'Item 2', 'Item 3'];
</script>

<ul>
  {#each items as item, i}
    <li in:staggeredSlide={{ index: i, direction: 'left' }}>
      {item}
    </li>
  {/each}
</ul>
```

### Scale In for Modals

```svelte
<script>
  import { scaleIn } from '$lib/motion/transitions';

  let showModal = $state(false);
</script>

{#if showModal}
  <div class="modal-backdrop">
    <div class="modal-content" in:scaleIn={{ scale: 0.9, duration: 300 }}>
      <!-- Modal content -->
    </div>
  </div>
{/if}
```

### Toast Notifications

```svelte
<script>
  import { toastSlide } from '$lib/motion/transitions';

  let showToast = $state(false);
  let toastMessage = $state('');

  function showNotification(message) {
    toastMessage = message;
    showToast = true;
    setTimeout(() => showToast = false, 3000);
  }
</script>

{#if showToast}
  <div
    class="toast"
    in:toastSlide={{ direction: 'right' }}
    out:toastSlide={{ direction: 'right' }}
  >
    {toastMessage}
  </div>
{/if}
```

### Blur Reveal for Premium Content

```svelte
<script>
  import { blurReveal } from '$lib/motion/transitions';

  let showPremium = $state(false);
</script>

{#if showPremium}
  <div in:blurReveal={{ blurAmount: 10, duration: 600 }}>
    Premium content revealed with blur effect
  </div>
{/if}
```

## Accessibility Examples

### Respecting Reduced Motion

All animations automatically respect `prefers-reduced-motion: reduce`. Users who prefer reduced motion will see:
- Instant fades instead of slides
- No rotation or complex animations
- Simple state changes

### Screen Reader Announcements

```svelte
<script>
  import { loading } from '$lib/stores/loading';

  // Loading state is announced to screen readers automatically
  loading.start('Loading products');
</script>

<!-- The PageLoader component includes proper ARIA attributes:
- role="status"
- aria-live="polite"
- aria-label="Loading content"
- Hidden text for screen readers
-->
```

### Focus Management

```svelte
<!-- Add focus-ring-gold class for accessible focus indicators -->
<button class="focus-ring-gold">
  Accessible Button with Gold Focus Ring
</button>

<input
  type="text"
  class="focus-ring-gold"
  placeholder="Accessible Input"
/>
```

## Real-World Scenarios

### Shopping Cart Checkout

```svelte
<script>
  import { loading } from '$lib/stores/loading';

  async function checkout() {
    loading.start('Preparing checkout');

    // Validate cart
    await validateCart();
    loading.setMessage('Validating items');

    // Calculate totals
    await calculateTotals();
    loading.setMessage('Calculating totals');

    // Process payment
    await processPayment();
    loading.setMessage('Processing payment');

    // Create order
    await createOrder();
    loading.setMessage('Creating order');

    loading.stop();
  }
</script>
```

### Image Gallery Loading

```svelte
<script>
  import { staggeredSlide } from '$lib/motion/transitions';

  let images = $state([]);
  let isLoading = $state(true);

  async function loadGallery() {
    loading.start('Loading gallery');
    images = await fetchImages();
    isLoading = false;
    loading.stop();
  }
</script>

{#if isLoading}
  <div class="grid grid-cols-3 gap-4">
    {#each Array(9) as _, i}
      <div class="skeleton aspect-square"></div>
    {/each}
  </div>
{:else}
  <div class="grid grid-cols-3 gap-4">
    {#each images as image, i}
      <img
        src={image.url}
        alt={image.alt}
        in:staggeredSlide={{ index: i }}
      />
    {/each}
  </div>
{/if}
```

### Admin Dashboard Data Refresh

```svelte
<script>
  import { loading } from '$lib/stores/loading';

  async function refreshDashboard() {
    loading.start('Refreshing dashboard');
    loading.setProgress(0);

    // Fetch users
    await fetchUsers();
    loading.setProgress(25);

    // Fetch analytics
    await fetchAnalytics();
    loading.setProgress(50);

    // Fetch orders
    await fetchOrders();
    loading.setProgress(75);

    // Update charts
    await updateCharts();
    loading.setProgress(100);

    loading.stop();
  }
</script>
```

## Tips and Best Practices

### Always Stop Loading
```svelte
// ✅ Good - use try/finally
async function action() {
  loading.start('Processing');
  try {
    await doWork();
  } finally {
    loading.stop(); // Always executes
  }
}

// ❌ Bad - might not stop if error occurs
async function action() {
  loading.start('Processing');
  await doWork();
  loading.stop(); // Might not reach here
}
```

### Meaningful Messages
```svelte
// ✅ Good - specific and helpful
loading.start('Uploading product images');
loading.setMessage('Optimizing images');
loading.setMessage('Saving to database');

// ❌ Bad - generic and not helpful
loading.start('Loading');
loading.start('Please wait');
```

### Avoid Flashing
```svelte
// ✅ Good - only show for longer operations
async function quickAction() {
  const result = await fetch('/api/quick');
  return result; // No loader needed
}

async function slowAction() {
  loading.start('Processing large dataset');
  const result = await fetch('/api/slow');
  loading.stop();
  return result;
}

// Rule of thumb: Show loader if operation takes >500ms
```

### Combine with Optimistic UI
```svelte
<script>
  import { loading } from '$lib/stores/loading';

  let items = $state([...existingItems]);

  async function addItem(newItem) {
    // Optimistically add to UI
    items = [...items, { ...newItem, optimistic: true }];

    loading.start('Saving item');

    try {
      const saved = await saveItem(newItem);
      // Replace optimistic with real data
      items = items.map(i =>
        i.optimistic ? saved : i
      );
    } catch (error) {
      // Remove optimistic item
      items = items.filter(i => !i.optimistic);
    } finally {
      loading.stop();
    }
  }
</script>
```

## Testing Animations

### Test Reduced Motion
```javascript
// In browser DevTools
// Application > Local Storage or Console:
matchMedia('(prefers-reduced-motion: reduce)').matches = true;

// Or add to system preferences:
// macOS: System Preferences > Accessibility > Display > Reduce motion
// Windows: Settings > Ease of Access > Display > Show animations
```

### Test Loading States
```svelte
<script>
  import { loading } from '$lib/stores/loading';

  // Development helper
  function testLoading() {
    loading.start('Test loading state');
    setTimeout(() => loading.stop(), 5000);
  }
</script>

{#if import.meta.env.DEV}
  <button onclick={testLoading}>Test Loader</button>
{/if}
```

## Performance Monitoring

```svelte
<script>
  import { loading } from '$lib/stores/loading';

  async function monitoredAction() {
    const startTime = performance.now();
    loading.start('Processing');

    try {
      await doWork();
    } finally {
      const duration = performance.now() - startTime;
      console.log(`Operation took ${duration}ms`);
      loading.stop();

      // Alert if operation is too slow
      if (duration > 3000) {
        console.warn('Operation exceeded 3s threshold');
      }
    }
  }
</script>
```
