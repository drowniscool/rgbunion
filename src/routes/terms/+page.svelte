<script>
  import { page } from "$app/stores";
  import { fade, fly, scale } from "svelte/transition";
  import { ArrowLeft, FileText, Shield, Eye, AlertTriangle, Scale, BookOpen } from "lucide-svelte";
  import { onMount } from "svelte";

  // Get current year for dynamic date
  const currentYear = new Date().getFullYear();

  let mounted = $state(false);
  let activeSection = $state('terms');

  // Table of contents sections
  const sections = [
    { id: 'terms', title: 'Terms of Service', icon: FileText },
    { id: 'privacy', title: 'Privacy Policy', icon: Eye },
    { id: 'disclaimers', title: 'Disclaimers', icon: AlertTriangle },
    { id: 'liability', title: 'Liability', icon: Scale },
    { id: 'usage', title: 'Acceptable Use', icon: Shield }
  ];

  function scrollToSection(sectionId) {
    activeSection = sectionId;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Initialize mounted state
  onMount(() => {
    mounted = true;
  });
</script>

<svelte:head>
  <title>Terms of Service - RGBUNION</title>
  <meta name="description" content="Terms of Service, Privacy Policy, and legal information for RGBUNION platform and services">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="{$page.url.origin}/terms">
</svelte:head>

<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }


</style>

<!-- Modern dark slate background with subtle pattern -->
<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
  <!-- Subtle Background Pattern -->
  <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNCRjk1M0YiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

  <div class="relative z-10 p-4 sm:p-6 max-w-7xl mx-auto min-h-screen flex flex-col">

    <!-- Breadcrumb Navigation -->
    {#if mounted}
      <div class="mb-8 mt-4" in:fly={{ y: -20, duration: 600 }}>
        <a
          href="/shop"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:text-[#BF953F] hover:bg-slate-800/50 transition-all duration-300 group"
        >
          <ArrowLeft class="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span class="text-sm font-medium">Back to Shop</span>
        </a>
      </div>
    {/if}

    <!-- Page Header -->
    {#if mounted}
      <div class="text-center mb-12" in:fly={{ y: 30, duration: 800, delay: 200 }}>
        <div class="w-20 h-20 bg-gradient-to-br from-[#BF953F]/20 to-[#B38728]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#BF953F]/30">
          <FileText class="w-10 h-10 text-[#BF953F]" />
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] mb-4" style="font-family: 'Cinzel', serif;">
          Legal Information
        </h1>
        <p class="text-slate-300 text-lg max-w-2xl mx-auto">
          Terms of Service, Privacy Policy, and important legal information for <b>RGBUNION</b>
        </p>
        <p class="text-slate-400 text-sm mt-2">
          Last updated: <b>September 27th, 2025</b>
        </p>
      </div>
    {/if}

    <div class="flex flex-col lg:flex-row gap-8">

      <!-- Table of Contents - Desktop Sidebar -->
      {#if mounted}
        <div class="lg:w-80 flex-shrink-0" in:fly={{ x: -30, duration: 800, delay: 400 }}>
          <div class="sticky top-8 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <h2 class="text-xl font-semibold text-[#FCF6BA] mb-4 flex items-center gap-3">
              <BookOpen class="w-5 h-5 text-[#BF953F]" />
              Table of Contents
            </h2>
            <nav class="space-y-2">
              {#each sections as section, index}
                <button
                  onclick={() => scrollToSection(section.id)}
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 hover:bg-slate-700/50 group"
                  class:bg-gradient-to-r={activeSection === section.id}
                  class:from-yellow-600={activeSection === section.id}
                  class:to-yellow-700={activeSection === section.id}
                  class:border={activeSection === section.id}
                  class:border-yellow-600={activeSection === section.id}
                  class:text-yellow-200={activeSection === section.id}
                  class:text-slate-300={activeSection !== section.id}
                  in:fly={{ x: -20, duration: 300, delay: 600 + (index * 100) }}
                >
                  {@render section.icon({ class: `w-4 h-4 transition-colors duration-300 ${activeSection === section.id ? 'text-yellow-600' : 'text-slate-400'}` })}
                  <span class="text-sm font-medium">{section.title}</span>
                </button>
              {/each}
            </nav>
          </div>
        </div>
      {/if}

      <!-- Main Content -->
      <div class="flex-1">
        {#if mounted}
          <div class="space-y-12" in:fly={{ x: 30, duration: 800, delay: 600 }}>

            <!-- Terms of Service Section -->
            <section id="terms" class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
              <div class="flex items-center gap-3 mb-6">
                <FileText class="w-6 h-6 text-[#BF953F]" />
                <h2 class="text-2xl font-bold text-[#FCF6BA]" style="font-family: 'Cinzel', serif;">Terms of Service</h2>
              </div>

              <div class="prose prose-invert prose-slate max-w-none">
                <div class="space-y-8 text-slate-300 leading-relaxed">
                  <p>
                    These Terms of Service (&ldquo;Terms&rdquo;) govern your access to the <b>RGBUNION</b> catalogue and the purchase of any digital material offered through our platform. By placing an order, <b>you</b> confirm that <b>you</b> understand and accept these Terms in full.
                  </p>

                  <h3 class="text-xl font-semibold text-[#FCF6BA] border-b border-slate-600 pb-2">1. Verification Window &amp; Warranty</h3>
                  <p>
                    A verification window of <b>ten</b> (<b>10</b>) minutes begins as soon as product access is issued. During this period we provide a live screen of the account or card and, upon request, may verify balance information using reputable balance-only checkers. Any attempt to complete transactions, interact with external applications, or otherwise use the material beyond verification immediately voids the warranty. For transparency, customers are expected to screen-record their login session during this window.
                  </p>

                  <h3 class="text-xl font-semibold text-[#FCF6BA] border-b border-slate-600 pb-2">2. Use of Products</h3>
                  <p>
                    <b>RGBUNION</b> supplies material only. We do not provide consultation, coaching, or instruction on how to cash out, redeem balances, or deploy the data <b>you</b> purchase. Success rates, redemption outcomes, and any downstream activity remain entirely your responsibility. Purchase only if <b>you</b> already possess the necessary operational knowledge.
                  </p>

                  <h3 class="text-xl font-semibold text-[#FCF6BA] border-b border-slate-600 pb-2">3. Pricing &amp; Balance Accuracy</h3>
                  <p>
                    Pricing reflects the balance confirmed at the time we perform our internal check. Because balances can fluctuate rapidly, we reserve the right to adjust the final price upward or downward if the available funds differ from the amount shown in the listing. After delivery, <b>you</b> assume full responsibility for balance changes; <b>RGBUNION</b> does not guarantee that funds will remain available beyond the verification window.
                  </p>

                  <h3 class="text-xl font-semibold text-[#FCF6BA] border-b border-slate-600 pb-2">4. Right to Refuse Service</h3>
                  <p>
                    <b>RGBUNION</b> may decline or cancel any order at our discretion, with or without providing a reason. Attempts to bypass verification safeguards, submit fraudulent claims, or otherwise abuse our process may result in permanent denial of service.
                  </p>

                  <h3 class="text-xl font-semibold text-[#FCF6BA] border-b border-slate-600 pb-2">5. Fulfilment Process</h3>
                  <p>
                    Product delivery occurs only after we receive a single on-chain confirmation for the agreed payment. Once confirmation is complete, the associated access details are transmitted through the agreed communication channel. All fulfilment steps are timestamped for record keeping.
                  </p>

                  <h3 class="text-xl font-semibold text-[#FCF6BA] border-b border-slate-600 pb-2">6. Special Card Types</h3>
                  <p>
                    Apple Pay and non-VBV (3-D Secure disabled) cards require advanced configuration. We cannot guarantee that these cards will enroll automatically or behave consistently across merchants, devices, or geographic locations. If a card subsequently prompts for VBV/3DS, that outcome is typically attributable to configuration choices made after delivery and falls outside our warranty.
                  </p>

                  <h3 class="text-xl font-semibold text-[#FCF6BA] border-b border-slate-600 pb-2">7. Payment Methods</h3>
                  <p>
                    Accepted settlement methods are <b>BTC</b>, <b>LTC</b>, and <b>USDT (TRC-20)</b>. Payments must clear in full; partial payments or attempts to settle with unsupported assets will delay fulfilment until resolved. Network fees are the responsibility of the purchaser.
                  </p>

                  <h3 class="text-xl font-semibold text-[#FCF6BA] border-b border-slate-600 pb-2">8. Customer Responsibilities</h3>
                  <p>
                    <b>You</b> agree to maintain secure storage of any material received, to respect all applicable laws in your jurisdiction, and to refrain from representing <b>RGBUNION</b> in any capacity. Any losses resulting from improper storage, unauthorized disclosure, or operational mishandling are exclusively your responsibility.
                  </p>
                </div>
              </div>
            </section>

            <!-- Privacy Policy Section -->
            <section id="privacy" class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
              <div class="flex items-center gap-3 mb-6">
                <Eye class="w-6 h-6 text-[#BF953F]" />
                <h2 class="text-2xl font-bold text-[#FCF6BA]" style="font-family: 'Cinzel', serif;">Privacy Policy</h2>
              </div>

              <div class="prose prose-invert prose-slate max-w-none">
                <div class="space-y-6 text-slate-300 leading-relaxed">
                  <p>
                    <b>RGBUNION</b> limits data collection to the minimum required to verify orders, deliver material, and resolve support inquiries. We do not maintain marketing lists or share customer details with third parties, and we retain operational logs only for as long as necessary to satisfy compliance or fraud-prevention requirements.
                  </p>

                  <h3 class="text-xl font-semibold text-[#FCF6BA] border-b border-slate-600 pb-2">Collection &amp; Use</h3>
                  <p>
                    Information <b>you</b> provide (such as wallet proofs, usernames, or contact handles) is used solely to confirm payment and transmit deliverables. We do not request government-issued identification. Aggregated, non-identifying telemetry may be used to refine inventory planning and detect abuse.
                  </p>

                  <h3 class="text-xl font-semibold text-[#FCF6BA] border-b border-slate-600 pb-2">Storage &amp; Security</h3>
                  <p>
                    Access credentials are transferred via encrypted channels. Internal staff access is role-based and logged. Archived records are purged on a rolling schedule once verification disputes are no longer possible. Customers should still delete copies of any material they no longer need and secure their own devices.
                  </p>

                  <h3 class="text-xl font-semibold text-[#FCF6BA] border-b border-slate-600 pb-2">Your Choices</h3>
                  <p>
                    <b>You</b> may request deletion of support transcripts and transaction notes after your order is complete, provided the request does not conflict with an active investigation or legal obligation. Contact our support channel with proof of purchase to initiate a privacy request.
                  </p>
                </div>
              </div>
            </section>

            <!-- Disclaimers Section -->
            <section id="disclaimers" class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
              <div class="flex items-center gap-3 mb-6">
                <AlertTriangle class="w-6 h-6 text-[#BF953F]" />
                <h2 class="text-2xl font-bold text-[#FCF6BA]" style="font-family: 'Cinzel', serif;">Disclaimers</h2>
              </div>

              <div class="prose prose-invert prose-slate max-w-none">
                <div class="space-y-6 text-slate-300 leading-relaxed">
                  <p>
                    <b>RGBUNION</b> supplies digital material on an &ldquo;as-is&rdquo; basis. Balances, account status, merchant compatibility, and regional acceptance can change without notice. We do not guarantee successful cash-out, card enrollment, or downstream profitability.
                  </p>

                  <p>
                    Our role ends once the verification window closes and delivery data is confirmed. We are not responsible for failures arising from carding tools, mobile wallets, two-factor prompts, device fingerprinting, or other external systems. Third-party brands, logos, and bank names remain the property of their respective owners and are referenced strictly for descriptive purposes.
                  </p>

                  <p>
                    Nothing on this page should be interpreted as financial, legal, or operational advice. Evaluate every purchase against your local laws and risk tolerance before proceeding.
                  </p>
                </div>
              </div>
            </section>

            <!-- Liability Section -->
            <section id="liability" class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
              <div class="flex items-center gap-3 mb-6">
                <Scale class="w-6 h-6 text-[#BF953F]" />
                <h2 class="text-2xl font-bold text-[#FCF6BA]" style="font-family: 'Cinzel', serif;">Limitation of Liability</h2>
              </div>

              <div class="prose prose-invert prose-slate max-w-none">
                <div class="space-y-6 text-slate-300 leading-relaxed">
                  <p>
                    To the fullest extent permitted by law, <b>RGBUNION</b> and its operators are not liable for indirect, incidental, special, consequential, exemplary, or punitive damages, including lost profits, lost balances, or business interruption stemming from the use or inability to use delivered material.
                  </p>

                  <p>
                    In jurisdictions where limitations on liability are restricted, our total aggregate liability is capped at the lesser of (a) the amount <b>you</b> paid for the specific order giving rise to the claim, or (b) one hundred (100) USD equivalent. Some regions do not allow exclusion of implied warranties; if those laws apply to you, some disclaimers may not.
                  </p>
                </div>
              </div>
            </section>

            <!-- Acceptable Use Section -->
            <section id="usage" class="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
              <div class="flex items-center gap-3 mb-6">
                <Shield class="w-6 h-6 text-[#BF953F]" />
                <h2 class="text-2xl font-bold text-[#FCF6BA]" style="font-family: 'Cinzel', serif;">Acceptable Use Policy</h2>
              </div>

              <div class="prose prose-invert prose-slate max-w-none">
                <div class="space-y-6 text-slate-300 leading-relaxed">
                  <h3 class="text-xl font-semibold text-[#FCF6BA] border-b border-slate-600 pb-2">Prohibited Conduct</h3>
                  <ul class="list-disc list-inside space-y-2 text-slate-300">
                    <li>Submitting fraudulent verification evidence or falsifying payment confirmations.</li>
                    <li>Attempting chargebacks or reversals after access has been delivered.</li>
                    <li>Harassing support staff, threatening partners, or disclosing internal processes publicly.</li>
                    <li>Breaching applicable laws, card-network rules, or platform Terms where you deploy purchased data.</li>
                  </ul>

                  <h3 class="text-xl font-semibold text-[#FCF6BA] border-b border-slate-600 pb-2">Enforcement</h3>
                  <p>
                    Breaches of this policy may result in immediate order cancellation, lifetime bans, or referral to investigative partners. We cooperate with authorities where legally compelled and reserve all available contractual remedies.
                  </p>
                </div>
              </div>
            </section>

          </div>
        {/if}
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-16 pt-12 border-t border-slate-700/50">
      <div class="text-center">
        <p class="text-slate-400 text-sm mb-2">
          © {currentYear} <b>RGBUNION</b>. All Rights Reserved.
        </p>
        <p class="text-slate-500 text-xs">
          For legal questions or concerns, please contact our support team
        </p>
      </div>
    </div>

  </div>
</div>