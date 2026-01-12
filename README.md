# ShopHub - E-Commerce Platform

A modern, full-featured e-commerce application built with Next.js 16, TypeScript, Prisma, and PostgreSQL.

## 🚀 Features

### Authentication & Security
- Google OAuth 2.0 integration
- Email/Password authentication with bcrypt
- Email verification with OTP (10-minute expiry)
- JWT-based session management
- Role-based access control (USER/ADMIN)

### User Features
- Browse products with responsive design
- Shopping cart management
- Order placement and tracking
- Order history
- User profile management

### Admin Features
- Product management (Create, Read, Update, Delete)
- Order management and status updates
- Dashboard with analytics
- Inventory management

## 🛠️ Tech Stack

- **Framework:** Next.js 16.1 (App Router, React Server Components)
- **Language:** TypeScript 5.9
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Auth.js (NextAuth.js) v5
- **Styling:** Tailwind CSS 3.4
- **UI Components:** Radix UI
- **Email:** Nodemailer
- **Deployment:** Vercel-ready

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (local or cloud like Neon)
- Google OAuth credentials (optional)
- Email service credentials (optional)

### Setup

1. **Clone and install dependencies:**
```bash
git clone https://github.com/Vinayak2k03/shophub.git .
npm install
```

2. **Configure environment variables:**
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Auth.js
AUTH_SECRET="your-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email (Optional - for OTP)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@shophub.com"
```

Generate `AUTH_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

3. **Setup database:**
```bash
# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

4. **Run development server:**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 👤 Default Credentials

After seeding, use these credentials:

**Admin Account:**
- Email: `admin@shophub.com`
- Password: `Admin123!`

**User Account:**
- Email: `user@shophub.com`
- Password: `Admin123!`

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Ensure these are set in your deployment platform:
- `DATABASE_URL` - Production PostgreSQL connection string
- `AUTH_SECRET` - Strong random secret
- `NEXTAUTH_URL` - Production URL (e.g., https://yourdomain.com)
- `GOOGLE_CLIENT_ID` - OAuth credentials
- `GOOGLE_CLIENT_SECRET` - OAuth credentials
- `EMAIL_SERVER_*` - Email service credentials

### Database Migration

For production deployments, use migrations:
```bash
npm run db:migrate
```

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── (shop)/            # Customer-facing pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   └── auth/              # Authentication pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature components
├── lib/                   # Utilities and configurations
│   ├── auth.ts           # Auth.js configuration
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema and migrations
├── server/               # Server actions
└── types/                # TypeScript types
```

## 🔒 Security Features

- Password hashing with bcrypt
- CSRF protection
- SQL injection prevention (Prisma)
- XSS protection
- Secure session management
- Role-based access control
- Email verification

## 🎨 UI/UX

- Fully responsive design
- Dark/Light mode support
- Loading states and skeletons
- Toast notifications
- Form validation
- Accessible components (Radix UI)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [Documentation](./DEPLOYMENT.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Auth.js Documentation](https://authjs.dev)

## 💡 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review deployment guide
