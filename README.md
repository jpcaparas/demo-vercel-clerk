# Next.js + Clerk.com Demo

![image](https://github.com/user-attachments/assets/2646879c-2d67-4d0b-812f-c179f9fe794e)

This is a demonstration project showcasing the integration of [Clerk.com](https://clerk.com) with Next.js 15 for robust user management and authentication. It serves as a practical example of implementing user authentication, management, and security features in a modern Next.js application.

## Features

- 🔐 Complete authentication flow (Sign up, Sign in, Sign out)
- 👤 User profile management
- 🔑 Social login providers
- 🛡️ Protected routes and middleware
- 📱 Responsive design
- 🎨 Styled with Tailwind CSS
- ⚡ Server and client components optimization

## Demo Pages

The project includes several demo pages showcasing different Clerk.com features:

- `/` - Home page with authentication status
- `/sign-in` - Sign in page with multiple auth options
- `/sign-up` - User registration page
- `/profile` - Protected user profile page
- `/settings` - Account settings and preferences
- `/dashboard` - Example of a protected dashboard

## Prerequisites

Before you begin, ensure you have:

1. Node.js 18.17 or later
2. A [Clerk.com](https://clerk.com) account
3. Your Clerk.com API keys (available in your Clerk Dashboard)

## Environment Setup

1. Clone this repository
2. Copy `.env.example` to `.env.local`
3. Fill in your Clerk.com credentials in `.env.local`

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Key Features Demonstrated

- **Authentication Flow**: Complete sign-up and sign-in process
- **Protected Routes**: Using Clerk middleware
- **User Management**: Profile updates and settings
- **Social Providers**: Integration with multiple OAuth providers
- **Security Best Practices**: CSRF protection, session management
- **Component Library**: Usage of Clerk's React components

## Learn More

To learn more about the technologies used:

- [Clerk.com Documentation](https://clerk.com/docs) - Learn about Clerk.com features
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js
- [Clerk.com + Next.js Guide](https://clerk.com/docs/quickstarts/nextjs) - Comprehensive integration guide

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new). When deploying, make sure to add your Clerk.com environment variables in your Vercel project settings.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
