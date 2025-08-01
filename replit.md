# Overview

This is a comprehensive business compliance and government service management platform called "BizEase". The application helps businesses navigate government licensing, regulatory compliance, scheme applications, and document management in India. It serves as a digital assistant for business owners to streamline their interactions with various government departments and stay compliant with regulations.

The platform provides features for managing business profiles, tracking license applications, monitoring compliance deadlines, exploring government schemes, document storage, export-import (EXIM) guidance, and expert consultations. It includes multilingual support (English/Hindi) and an AI-powered assistant to help users navigate complex regulatory requirements.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built using **React 18** with **TypeScript** in a single-page application (SPA) architecture. The application uses:

- **Vite** as the build tool and development server for fast builds and hot module replacement
- **Wouter** for lightweight client-side routing instead of React Router
- **TailwindCSS** with **shadcn/ui** component library for consistent, accessible UI components
- **TanStack Query (React Query)** for server state management, caching, and API interactions
- **Zustand** with persistence for client-side state management (authentication, user preferences)
- **React Hook Form** with **Zod** validation for form handling and data validation

The frontend follows a feature-based folder structure with reusable components, custom hooks, and utility functions. The application supports responsive design and includes a comprehensive design system with CSS custom properties for theming.

## Backend Architecture

The backend uses **Express.js** with **TypeScript** in an ESM (ES Modules) configuration. Key architectural decisions include:

- **RESTful API** design with consistent error handling and logging middleware
- **Modular route organization** with separate route handlers and business logic
- **Storage abstraction layer** through an `IStorage` interface, allowing for easy database swapping
- **Request/response logging** with performance monitoring for API endpoints
- **Validation** using Zod schemas shared between frontend and backend
- **Session-based authentication** with secure credential management

The server integrates with Vite in development mode for seamless full-stack development experience while supporting production builds with static file serving.

## Data Storage Solutions

The application uses **PostgreSQL** as the primary database with **Drizzle ORM** for type-safe database operations. The database architecture includes:

- **Neon Database** as the PostgreSQL provider (configured in drizzle.config.ts)
- **Schema-first approach** with shared TypeScript types between frontend and backend
- **Migration support** through Drizzle Kit for database schema versioning
- **Connection pooling** and serverless-compatible database connections

The database schema includes tables for users, business profiles, applications, compliance items, documents, schemes, and notifications with proper foreign key relationships and indexing.

## Authentication and Authorization

The system implements a **session-based authentication** mechanism with:

- **Username/password authentication** with server-side credential verification
- **Persistent client state** using Zustand with localStorage persistence
- **Business profile association** linking users to their business information
- **Route protection** with authentication guards on sensitive pages
- **Language preference management** stored in client state

Authentication state is managed client-side but validated server-side for each API request.

# External Dependencies

## UI and Styling
- **@radix-ui/react-*** - Headless UI components for accessibility and functionality
- **tailwindcss** - Utility-first CSS framework for styling
- **class-variance-authority** - Type-safe variant-based component styling
- **lucide-react** - Icon library for consistent iconography

## State Management and Data Fetching
- **@tanstack/react-query** - Server state management and caching
- **zustand** - Lightweight client-side state management
- **react-hook-form** - Performant form handling
- **@hookform/resolvers** - Form validation resolvers

## Database and ORM
- **drizzle-orm** - Type-safe ORM for PostgreSQL
- **drizzle-zod** - Zod integration for database schema validation
- **@neondatabase/serverless** - Serverless PostgreSQL connection driver

## Development and Build Tools
- **vite** - Fast build tool and development server
- **typescript** - Type safety and developer experience
- **tsx** - TypeScript execution for development
- **esbuild** - Fast JavaScript bundler for production builds

## Validation and Utilities
- **zod** - Runtime type validation and schema definition
- **date-fns** - Date manipulation and formatting
- **clsx** and **tailwind-merge** - Conditional CSS class handling

## Development-Specific
- **@replit/vite-plugin-runtime-error-modal** - Development error handling
- **@replit/vite-plugin-cartographer** - Replit-specific development features

The application is designed to run on Replit with specific optimizations for that environment while maintaining compatibility with standard Node.js deployments.