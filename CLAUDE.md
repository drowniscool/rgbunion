# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RGBUnion is a SvelteKit application deployed on Cloudflare Pages with D1 database, featuring user authentication, link management, and e-commerce shop functionality. The application uses Lucia for authentication, Drizzle ORM for database operations, and includes HTML obfuscation for the landing page.

## Technology Stack

- **Frontend**: SvelteKit 5 with Svelte stores and modern syntax
- **Styling**: Tailwind CSS with custom gold theme (#BF953F, #FCF6BA, #B38728)
- **Database**: Cloudflare D1 with Drizzle ORM
- **Authentication**: Lucia with PBKDF2 password hashing
- **Deployment**: Cloudflare Pages with Workers
- **Package Manager**: Bun (not npm)
- **CLI**: Wrangler for Cloudflare operations

## Critical Development Commands

### Database Operations
```bash
# Start Wrangler proxy for local D1 database (ALWAYS run before development)
bun run proxy

# Generate new database migrations after schema changes
bun run db:gen

# Apply migrations locally
bun run db:mig:local

# Apply migrations to production
bun run db:mig:prod

# Database studio access
bun run db:studio:dev     # Local database
bun run db:studio:prd     # Production database
```

### Development Workflow
```bash
# Start development server (requires proxy running in separate terminal)
bun run dev

# Build for production
bun run build

# Preview production build locally
bun run preview

# Deploy to Cloudflare Pages
bun run deploy
```

### Admin User Management
```bash
# Create admin user in local database
bun run admin:create

# Create admin user in production database
bun run admin:create:prod
```

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`
- Email: `admin@rgbunion.local`

## Architecture Overview

### Database Schema
The application uses five main tables:
- `userTable` - User authentication (id, username, email, password)
- `sessionTable` - Lucia session management (id, userId, expiresAt)
- `websitesTable` - Link management system (id, title, link, description, user_id)
- `shopCategoriesTable` - E-commerce categories (id, tag)
- `shopSubcategoriesTable` - E-commerce subcategories (id, name, category_id)
- `shopItemsTable` - E-commerce items (id, name, price, link, category_id, subcategory_id)

### Authentication Flow
- Uses Lucia v3 with SQLite adapter
- Session validation in `hooks.server.js`
- PBKDF2 password hashing with 100,000 iterations
- Sessions stored in D1 database

### Route Structure
- `/` - Landing page (obfuscated HTML)
- `/login` - Authentication
- `/logout` - Session termination
- `/dashboard` - User link management
- `/admin` - Admin panel
- `/admin/account` - Admin account management
- `/shop` - E-commerce interface

### Special Features
- **HTML Obfuscation**: Landing page content is obfuscated with hex encoding and dragon ASCII art
- **Responsive Design**: Tailwind CSS with mobile-first approach
- **Session Management**: Automatic session validation and cookie handling
- **Database Bindings**: Local development uses Wrangler bridge, production uses platform bindings

## Development Environment Setup

### Prerequisites
1. **Wrangler Proxy**: MUST be running for local database access
2. **Database Migrations**: Apply locally before development
3. **Admin User**: Create using provided script
4. **Environment Variables**: Configure in `.env` for production database studio access

### Local Development Pattern
```bash
# Terminal 1: Start proxy
bun run proxy

# Terminal 2: Start dev server
bun run dev
```

### Database Schema Changes
1. Modify `src/lib/server/db/schema.js`
2. Run `bun run db:gen` to generate migrations
3. Apply locally: `bun run db:mig:local`
4. Test thoroughly before applying to production
5. Apply to production: `bun run db:mig:prod`

## File Structure Key Points

### Server-Side Code
- `src/hooks.server.js` - Global request handling, auth, database initialization, HTML obfuscation
- `src/lib/server/` - Server-only code (auth, database, utilities)
- `src/lib/server/db/schema.js` - Database schema definitions
- `src/lib/server/lucia.js` - Lucia auth configuration
- `src/lib/server/auth.js` - Authentication utilities

### Route Handlers
- `+page.server.js` files handle server-side logic
- `+layout.server.js` provides shared data to child routes
- Authentication state passed via `locals.user` and `locals.session`

### Configuration Files
- `wrangler.jsonc` - Cloudflare Workers/Pages configuration
- `drizzle.config.js` - Database configuration (local vs production)
- `svelte.config.js` - SvelteKit with Cloudflare adapter
- `vite.config.js` - Includes Tailwind CSS plugin

## Common Debugging Issues

### Database Connection Errors
- Ensure Wrangler proxy is running: `bun run proxy`
- Check local D1 database exists in `.wrangler` directory
- Verify migrations are applied: `bun run db:mig:local`

### Authentication Issues
- Check session table exists and is populated
- Verify Lucia configuration matches database schema
- Ensure password hashing is working correctly

### Production Deployment
- Always run `bun run db:mig:prod` before deploying
- Verify Wrangler configuration has correct database IDs
- Check environment variables in Cloudflare Pages dashboard

## Security Considerations

- Never commit `.env` files or API tokens
- Admin credentials should be changed in production
- Database studio tokens have full database access
- HTML obfuscation is for presentation only, not security
- All user inputs are validated with Zod schemas
- Sessions have proper expiration and cleanup