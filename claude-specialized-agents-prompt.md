# RGBUnion Specialized Agents Coordination Prompt

## Project Overview
You are coordinating specialized Claude agents for RGBUnion, a SvelteKit 5 + Tailwind CSS + Cloudflare Pages/Workers application. The project has comprehensive development infrastructure in place and needs focused UI/UX improvements via task-specific agents.

## Current Project State Analysis

### Technology Stack
- **Frontend**: SvelteKit 5 with Svelte runes ($state, $props, $effect, @render)
- **Styling**: Tailwind CSS with custom gold theme (#BF953F, #FCF6BA, #B38728)
- **Backend**: Cloudflare Workers + D1 database + R2 storage
- **Database**: Drizzle ORM with Lucia v3 authentication
- **Deployment**: Cloudflare Pages via Wrangler CLI

### Infrastructure Status ✅
- [x] Database populated with realistic shop and community data
- [x] Authentication system fully functional with role-based access
- [x] Admin dashboard with dual-tab CRUD interface
- [x] Modern Navbar component with conditional authentication
- [x] Comprehensive documentation for AI agents
- [x] Development scripts and database population tools

### Critical Files for Agents
```
src/routes/+page.svelte          # Landing page needing header/content fixes
src/routes/+layout.svelte        # Global layout and styling
src/lib/components/Navbar.svelte # Authentication-aware navigation
src/app.css                      # Global styles and Tailwind config
src/routes/+page.server.js       # Landing page data loading
```

### Database Schema
```sql
-- shop_categories: enrolls, fraud-logs, tools, services
-- shop_subcategories: 10 subcategories with hierarchy
-- shop_items: 21 items with pricing and descriptions
-- websites: 8 Telegram community links
-- user/session: Lucia v3 authentication
```

## Specialized Agent Tasks

### 🎨 AGENT 1: Landing Page UI Specialist
**Task**: Fix root (/) landing page design and content display issues
- **Files**: `src/routes/+page.svelte`, `src/routes/+page.server.js`, `src/app.css`
- **Issues**: 
  - Header and subheader styling needs improvement
  - Page claims to show "shop links" but displays social/Telegram links
  - Color scheme inconsistencies with gold theme
- **Requirements**: 
  - Implement proper landing page with clear value proposition
  - Fix content-description mismatch
  - Ensure gold theme consistency (#BF953F, #FCF6BA, #B38728)

### 🧭 AGENT 2: Navigation & Color Scheme Specialist  
**Task**: Integrate Navbar throughout site and fix color scheme inconsistencies
- **Files**: `src/lib/components/Navbar.svelte`, `src/routes/+layout.svelte`, `src/app.css`
- **Issues**:
  - Navbar not implemented on root homepage
  - Dark navy color conflicts with gold theme
  - Inconsistent color application across pages
- **Requirements**:
  - Integrate Navbar component into all pages via layout
  - Replace dark navy (#1e293b, #334155) with gold theme variants
  - Ensure responsive design and accessibility compliance

### 🛠️ AGENT 3: Admin Dashboard Enhancement Specialist
**Task**: Redesign admin dashboard for improved UX and functionality
- **Files**: `src/routes/admin/+page.svelte`, `src/routes/dashboard/+page.svelte`
- **Issues**:
  - Dashboard UX could be more intuitive
  - Form validation feedback needs improvement  
  - Mobile responsiveness optimization needed
- **Requirements**:
  - Enhance dual-tab interface design
  - Improve form validation and error states
  - Add loading states and better feedback
  - Optimize for mobile devices

## Agent Coordination Protocol

### Step 1: Task Assignment
Use the `manage_todo_list` tool to create specialized agents:
```
1. Spawn Landing Page UI Specialist for root page fixes
2. Spawn Navigation & Color Scheme Specialist for theme consistency  
3. Spawn Admin Dashboard Enhancement Specialist for UX improvements
```

### Step 2: Agent Context Sharing
Each agent receives:
- This coordination prompt
- Relevant file paths and current issues
- Gold theme specifications (#BF953F, #FCF6BA, #B38728)
- SvelteKit 5 component patterns and rune syntax
- Authentication context (user/loggedIn/isAdmin stores)

### Step 3: Implementation Guidelines
- **Preserve existing functionality**: Authentication, CRUD operations, data integrity
- **Follow established patterns**: Svelte 5 runes, Tailwind classes, component structure
- **Maintain consistency**: Gold theme, responsive design, accessibility
- **Test thoroughly**: Verify changes don't break existing features

### Step 4: Quality Assurance
- Each agent validates their changes don't conflict with others
- Comprehensive testing of authentication flows
- Responsive design verification across breakpoints
- Color scheme consistency validation

## Development Context

### Key Commands
```bash
npm run dev          # Start development server
npm run proxy        # Start D1 database proxy
npm run build        # Build for production
npm run preview      # Preview production build
```

### Database Operations
```bash
npm run dev:populate  # Populate with development data
npm run db:gen       # Generate migrations
npm run db:mig:local # Apply local migrations
```

### Authentication States
- `locals.user`: Current user object (server-side)
- `$user`: User store (client-side)  
- `$loggedIn`: Authentication status
- `$isAdmin`: Admin role status

## Success Criteria

### Landing Page Agent Success ✅
- [ ] Root page displays proper content matching description
- [ ] Header/subheader styling follows gold theme
- [ ] Content accurately reflects site purpose (not showing "shop links" for social links)
- [ ] Responsive design maintained

### Navigation Agent Success ✅
- [ ] Navbar integrated on all pages including root
- [ ] Dark navy colors replaced with gold theme variants
- [ ] Consistent color scheme across entire application
- [ ] Mobile menu functionality preserved

### Admin Dashboard Agent Success ✅
- [ ] Enhanced UX with improved visual hierarchy
- [ ] Better form validation feedback and error states
- [ ] Optimized mobile responsiveness
- [ ] Loading states and user feedback improvements

## Critical Notes for Agents

1. **Preserve Authentication**: Never modify authentication logic or session handling
2. **Maintain Data Integrity**: Don't alter database schemas or CRUD operations  
3. **Follow Svelte 5 Patterns**: Use runes syntax, not legacy reactive statements
4. **Respect Component Architecture**: Maintain existing component boundaries and props
5. **Test Authentication Flows**: Verify login/logout still works after changes
6. **Gold Theme Consistency**: Use established color palette throughout

## Implementation Priority
1. **HIGH**: Landing page content/header fixes (affects user first impression)
2. **HIGH**: Navigation integration on root page (basic UX requirement)
3. **MEDIUM**: Color scheme consistency (visual polish)
4. **MEDIUM**: Admin dashboard enhancements (power user experience)

Begin by using the `manage_todo_list` tool to create and assign these specialized tasks, then spawn the appropriate agents with focused context for their specific domain.