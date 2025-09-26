# RGBUnion - Cloudflare Pages + Workers Setup

This project is now configured for Cloudflare Pages with Workers and D1 database.

## ✅ Project Initialization Complete

The following has been set up:

### 🛠️ Development Environment
- ✅ Dependencies installed
- ✅ Database schema defined
- ✅ Migrations generated and applied locally
- ✅ SvelteKit configured with Cloudflare adapter
- ✅ Wrangler configuration file ready
- ✅ Development server tested and working
- ✅ Production build tested and working

### 📊 Database Configuration
- ✅ D1 database configured (`rgbunion`)
- ✅ Drizzle ORM set up
- ✅ Local database migrations applied
- ✅ Database includes: users, websites, shop categories/items, sessions

### 🚀 Cloudflare Integration
- ✅ Wrangler configuration ready
- ✅ Pages build output directory configured
- ✅ D1 database bindings configured
- ✅ Environment variables configured

## 🔧 Manual Steps Required

### 1. Cloudflare Account Setup
You need to:
1. **Create a Cloudflare account** (if you don't have one)
2. **Install Wrangler CLI globally** (if not already done): `npm install -g wrangler`
3. **Log in to Wrangler**: `wrangler login`

### 2. Create Cloudflare D1 Database
```bash
# Create the D1 database (if not already created)
wrangler d1 create rgbunion

# Update wrangler.jsonc with the database ID from the command above
```

### 3. Update Wrangler Configuration
Update `wrangler.jsonc` with your actual values:
- Replace `database_id` with your actual D1 database ID
- Update `CLOUDFLARE_ACCOUNT_ID` in vars section
- Update `CLOUDFLARE_DATABASE_ID` with your database ID
- Generate and add `CLOUDFLARE_D1_TOKEN` if needed

### 4. Apply Database Migrations to Production
```bash
# Apply migrations to remote D1 database
bun run db:mig:prod
```

### 5. Create Cloudflare Pages Project
1. Go to Cloudflare Dashboard → Pages
2. Create a new project
3. Connect to your Git repository
4. Configure build settings:
   - **Build command**: `bun run build`
   - **Build output directory**: `.svelte-kit/cloudflare`
   - **Environment variables**: Add any needed env vars

### 6. Environment Variables for Production
In Cloudflare Pages dashboard, add these environment variables:
- `NODE_ENV=production`
- Any other custom environment variables your app needs

## 🛠️ Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build with Wrangler
- `bun run deploy` - Deploy to Cloudflare Pages
- `bun run db:gen` - Generate database migrations
- `bun run db:mig:local` - Apply migrations locally
- `bun run db:mig:prod` - Apply migrations to production
- `bun run db:studio:dev` - Open Drizzle Studio for local DB
- `bun run db:studio:prd` - Open Drizzle Studio for production DB

## 🔄 Development Workflow

1. **Local Development**: `bun run dev`
2. **Test Build**: `bun run build`
3. **Preview**: `bun run preview`
4. **Deploy**: `bun run deploy` (after completing manual steps above)

## 🗄️ Database Management

- **Local development**: Uses Wrangler's local D1 database
- **Schema changes**: Update `src/lib/server/db/schema.js`, then run `bun run db:gen`
- **Apply migrations**: 
  - Local: `bun run db:mig:local`
  - Production: `bun run db:mig:prod`

Your project is ready for development! Complete the manual steps above to deploy to production.
