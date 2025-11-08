# AI WebApp Builder

A production-ready AI-powered web application builder that allows users to create stunning web applications using React, Next.js, and Tailwind CSS with AI assistance.

## Features

- 🤖 **AI-Powered Code Generation** - Generate production-ready code using natural language prompts
- ⚡ **Multiple Frameworks** - Support for React + Vite, Next.js, and Tailwind CSS
- 🎨 **Live Preview** - Real-time preview of your application as you build
- 💾 **Project Management** - Create, save, and manage multiple projects
- 🔗 **Export Options** - Export projects as ZIP, deploy to Vercel, or push to GitHub
- 👥 **Collaboration** - Share projects and collaborate with team members
- 💳 **Credit System** - Usage-based pricing with flexible plans
- 🔐 **Authentication** - Secure authentication with email verification and OAuth
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **UI Components**: Custom components with Radix UI
- **Animations**: Framer Motion
- **Code Editor**: Monaco Editor
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- npm or yarn package manager
- Supabase account
- Environment variables configured

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-webapp-builder.git
cd ai-webapp-builder
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AI WebApp Builder

# AI Provider API Keys (Optional)
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── blog/              # Blog pages
│   └── ...
├── components/            # Reusable React components
├── lib/                   # Utility functions and configurations
├── stores/                # Zustand state stores
├── types/                 # TypeScript type definitions
├── middleware.ts          # Next.js middleware
└── ...
```

## Key Features Implementation

### Authentication System
- Email/password authentication with verification
- Google OAuth integration
- Magic link authentication
- Session management with middleware protection

### AI Integration
- Natural language to code generation
- Real-time code updates
- Support for multiple AI providers (OpenAI, Anthropic)
- Intelligent code suggestions and improvements

### Project Management
- Create and manage multiple projects
- Project templates and types
- Version history and backups
- Export and deployment options

### Credit System
- Usage tracking and billing
- Credit balance management
- Payment integration with Stripe
- Automatic credit deduction for AI usage

### Security Features
- Rate limiting (10 requests/minute per IP)
- IP blocking system
- JWT token validation
- CSRF protection
- Input validation and sanitization

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The application can also be deployed to:
- Netlify
- Railway
- Digital Ocean App Platform
- AWS Amplify

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `NEXT_PUBLIC_SITE_URL` | Your site URL | Yes |
| `OPENAI_API_KEY` | OpenAI API key (optional) | No |
| `ANTHROPIC_API_KEY` | Anthropic API key (optional) | No |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Guidelines

1. Follow the existing code style and conventions
2. Write clear, descriptive commit messages
3. Add tests for new features
4. Update documentation as needed
5. Ensure all CI checks pass

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📚 [Documentation](https://docs.aiwebappbuilder.com)
- 💬 [Community Forum](https://community.aiwebappbuilder.com)
- 🐛 [Issue Tracker](https://github.com/yourusername/ai-webapp-builder/issues)
- 📧 [Email Support](mailto:support@aiwebappbuilder.com)

## Roadmap

- [ ] React Native support
- [ ] Team collaboration features
- [ ] Advanced AI models integration
- [ ] Plugin marketplace
- [ ] Desktop application
- [ ] Mobile app

## Acknowledgments

- Thanks to all our contributors and community members
- Inspired by modern development tools and AI advancements
- Built with love for the developer community

---

Built with ❤️ by the AI WebApp Builder team