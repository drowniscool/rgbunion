# Rgbunion

## Technologies used:

- Framework: [Sveltekit](https://github.com/sveltejs/kit)
- UI: [Tailwind Css](https://github.com/tailwindlabs/tailwindcss)
- Database: [Cloudflare D1](https://developers.cloudflare.com/d1)
- Hosting: [Cloudflare Pages](https://pages.cloudflare.com)
- CLI: [Wrangler](https://github.com/cloudflare/workers-sdk)
- Authentication: [Lucia](https://github.com/lucia-auth/lucia)
- ORM: [Drizzle](https://github.com/drizzle-team/drizzle-or)
- Data validation: [Zod](https://github.com/colinhacks/zod)

## Getting Started

### 1. Clone the Repository

```bash
git https://github.com/tufcoding/rgbunion-svelte-cloudflare.git
cd rgbunion-svelte-cloudflare
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Cloudflare

- **Login**:

  ```bash
  wrangler login
  ```

  > Follow the prompts to log in to your Cloudflare account.

- **Create Project** (Skip if already exist)

  ```bash
  wrangler pages project create project-name
  ```

  > You can create a project via the Cloudflare dashboard or using the CLI.

- **Create Database**: (Skip if already exist)

  ```bash
  wrangler d1 create project-name-db
  ```

  > You can create a database via the Cloudflare dashboard or using the CLI.

### 4. Configure Wrangler

- Copy `wrangler.toml.example` to `wrangler.toml` and update it with your database name, ID.

### 5. Configure Environment Variables

Modify the environment variables by copying `.env.example` to `.env` and updating it with necessary details

- **CLOUDFLARE_ACCOUNT_ID** Go to Workers & Pages -> Overview -> copy Account ID from the right sidebar.
- **CLOUDFLARE_DATABASE_ID** Open D1 database you want to connect to and copy Database ID.
- **CLOUDFLARE_D1_TOKEN** Go to My profile -> API Tokens and create token with D1 edit permissions.

### 6. Setup the Database

run

```bash
npm run db:gen
```

then run

```bash
npm run db:mig:local
```

and to view and edit the Database in your browser using [Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview), run

```bash
npm run db:studio:dev
```

### 7. Local Development

To bind the D1 database and R2 bucket locally, run:

```bash
npm run proxy
```

In another command line window, run:

```bash
npm run dev
```

### 8. Deployment

For database migration to production, run

```bash
npm run db:mig:prod
```

Then, deploy your project by running

```bash
npm run deploy
```
