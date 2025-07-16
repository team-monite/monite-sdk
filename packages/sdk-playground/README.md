# Monite SDK Playground

The SDK Playground is a development and testing application that provides an interactive environment for exploring and demonstrating the capabilities of the Monite SDK. It showcases both **React Components** and **Drop-in Components** across various Monite features.

## Project Overview

This playground application serves as:
- **Development tool** for testing SDK components during development
- **Demo environment** for showcasing Monite SDK capabilities  
- **Testing platform** for validating component functionality
- **Reference implementation** for SDK integration patterns

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Monite API credentials (client ID, client secret, entity information)

### Installation

1. Navigate to the playground directory:
```bash
cd packages/sdk-playground
```

2. Install dependencies:
```bash
npm install
```

### Environment Configuration

Create a `.env.local` file in the project root with the following environment variables:

```env
# Required: Monite API Configuration
VITE_MONITE_PROJECT_CLIENT_ID=your_client_id_here
VITE_MONITE_PROJECT_CLIENT_SECRET=your_client_secret_here
VITE_MONITE_ENTITY_ID=your_entity_id_here
VITE_MONITE_ENTITY_USER_ID=your_entity_user_id_here

# Optional: API URL (defaults to development environment)
VITE_MONITE_API_URL=https://api.dev.monite.com/v1
```

#### Environment Variables Reference

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `VITE_MONITE_PROJECT_CLIENT_ID` | Yes | Your Monite project client ID | - |
| `VITE_MONITE_PROJECT_CLIENT_SECRET` | Yes | Your Monite project client secret | - |
| `VITE_MONITE_ENTITY_ID` | Yes | The entity ID for testing | - |
| `VITE_MONITE_ENTITY_USER_ID` | Yes | The entity user ID for authentication | - |
| `VITE_MONITE_API_URL` | No | Monite API base URL | `https://api.dev.monite.com/v1` |

> **Note**: You can also configure credentials dynamically through the "Use a different account" button in the sidebar, which will store credentials in localStorage.

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

### Code Quality

Run ESLint:
```bash
npm run lint
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── app-sidebar.tsx # Main navigation sidebar
│   └── login/          # Authentication components
├── pages/              # Page components for each feature
│   ├── Dropin/         # Drop-in component pages
│   └── [feature].tsx   # Individual feature pages
├── services/           # API and authentication services
│   ├── fetch-token.ts  # Token authentication
│   └── login-env-data.ts # Environment data management
└── hooks/              # Custom React hooks
```

## Authentication

The playground uses entity user authentication with the Monite API. Authentication credentials can be provided in two ways:

1. **Environment Variables** (recommended for development)
2. **Runtime Configuration** via the login form (accessible through "Use a different account")

Credentials are automatically managed and stored in localStorage for convenience during development.

## Contributing

When adding new features to the playground:

1. Add the page component in `src/pages/`
2. Update the routing in `src/App.tsx`
3. Add navigation items to `src/components/app-sidebar.tsx`
4. Ensure proper TypeScript types and error handling

## Troubleshooting

### Common Issues

**"Could not fetch token" error**
- Verify your API credentials are correct
- Check that the API URL is accessible
- Ensure entity and entity user IDs are valid

**Component not loading**
- Check browser console for JavaScript errors
- Verify environment variables are properly set
- Try refreshing the page or clearing localStorage

**Build failures**
- Run `npm run lint` to check for TypeScript/ESLint errors
- Ensure all dependencies are properly installed
- Check for missing environment variables in production builds
