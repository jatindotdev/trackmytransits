# TrackMyTransits

TrackMyTransits is a role-based transit tracking app built with Expo, React Native, Tamagui, and Supabase. It helps teams manage incoming transits, track inventory that has reached its destination, and keep user access organized across admin, receptionist, and worker workflows.

## What It Does

TrackMyTransits is designed for teams that need a simple mobile-first system to monitor shipments and related operational activity. Users log in with a Supabase-backed account and are routed to the correct experience based on their role.

### Key Features

- Role-based authentication and navigation for `admin`, `receptionist`, and `worker` users
- Incoming transit dashboards with detailed transit views
- Inventory views for transits that have reached their destination
- Transit status and container tracking
- User management for admin accounts
- CSV export for transit and inventory data
- Persistent Supabase auth sessions
- Bottom-sheet driven detail and action flows

## Screenshots

If you want a quick visual preview, start here:

https://github.com/jatindotdev/trackmytransits/assets/59236972/8ccd8b01-59bc-490a-8d6f-c4ae6055295a

## Tech Stack

- Expo / React Native
- Expo Router
- Tamagui
- Supabase
- React Hook Form
- Zod

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- A Supabase project

### 1. Clone the repository

```bash
git clone https://github.com/jatindotdev/trackmytransits.git
cd trackmytransits
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Required variables:

```bash
EXPO_PUBLIC_SUPABASE_URL=<YOUR_SUPABASE_URL>
EXPO_PUBLIC_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
```

### 4. Start the app

```bash
pnpm start
```

Then open the app on iOS, Android, or web from the Expo menu.

## Project Structure

- `app/` - Expo Router screens and role-based route layouts
- `components/` - UI for transits, inventory, and bottom sheets
- `lib/` - Supabase client, fetchers, and utilities
- `hooks/` - Shared React hooks
- `types/` - Supabase-generated TypeScript types

## Data Model

The app expects Supabase tables for transit tracking and user management. The main queries touch:

- `transit`
- `users`
- `status`
- `container`

If you are setting up a fresh backend, make sure these tables and their relationships match the queries in `lib/fetchers.ts` and the transit components.

## Notes

- Login is powered by Supabase email/password auth.
- User roles drive routing after sign-in.
- The app stores session state locally so users stay signed in across launches.

