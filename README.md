# Voter Management System - Frontend

A modern, responsive voter management application built with Next.js 15, TypeScript, and Tailwind CSS. This frontend integrates with a NestJS backend API to provide comprehensive voter management capabilities.

## 🚀 Features

### Authentication & Authorization
- **OTP-based Authentication**: Secure login using mobile OTP verification
- **Role-based Access Control**: Support for Admin, Booth Manager, and Candidate roles
- **JWT Token Management**: Automatic token refresh and secure storage
- **Session Management**: Persistent login state with cookie-based storage

### Voter Management
- **Voter Registration**: Complete voter information management
- **Voter Search & Filtering**: Advanced search by name, ID, status, and category
- **Status Tracking**: Track voter sentiment (Favour, Against, Neutral)
- **Bulk Operations**: Bulk status updates and management
- **Mobile Verification**: OTP-based mobile number verification

### Booth Activity Tracking
- **Activity Recording**: Track various types of booth activities
- **Activity History**: Complete audit trail of voter interactions
- **Real-time Statistics**: Live activity metrics and performance tracking
- **Activity Types**: Support for visits, calls, meetings, campaigns, and more

### Analytics & Reporting
- **Dashboard Statistics**: Real-time metrics and KPIs
- **Voter Demographics**: Comprehensive demographic analysis
- **Performance Metrics**: Booth and user performance tracking
- **Activity Trends**: Historical activity analysis

### User Management
- **User Roles**: Admin, Booth Manager, and Candidate role management
- **User Assignment**: Assign users to specific constituencies and polling stations
- **Profile Management**: Complete user profile management

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios with interceptors
- **Authentication**: JWT with refresh tokens
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner toast notifications

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd voter-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

## 🔧 Configuration

### API Configuration
The application connects to a NestJS backend API. Update the `NEXT_PUBLIC_API_URL` environment variable to point to your backend server.

### Authentication Flow
1. User selects their role (Admin, Booth Manager, Candidate)
2. Enters mobile number for OTP verification
3. Receives OTP via SMS/backend
4. Verifies OTP and logs in
5. JWT tokens are stored securely for API authentication

## 🏗️ Project Structure

```
voter-management-app/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── admin/             # Admin-specific components
│   ├── auth/              # Authentication components
│   ├── booth-manager/     # Booth manager components
│   ├── dashboards/        # Dashboard components
│   ├── forms/             # Form components
│   ├── shared/            # Shared components
│   └── ui/                # UI component library
├── lib/                   # Utility libraries
│   ├── api-client.ts      # Axios configuration
│   ├── api-services.ts    # API service functions
│   ├── hooks.ts           # React Query hooks
│   ├── providers.tsx      # Context providers
│   └── types.ts           # TypeScript type definitions
├── hooks/                 # Custom React hooks
└── public/                # Static assets
```

## 🔌 API Integration

### Service Layer Architecture
- **API Client**: Centralized Axios instance with interceptors
- **Service Functions**: Organized by feature (auth, voters, activities, etc.)
- **React Query Hooks**: Data fetching and caching
- **Type Safety**: Full TypeScript integration

### Key API Endpoints
- **Authentication**: `/auth/send-otp`, `/auth/verify-otp`, `/auth/profile`
- **Voters**: `/voters`, `/voters/{id}`, `/voters/bulk-update-status`
- **Activities**: `/booth-activities`, `/booth-activities/stats`
- **Statistics**: `/stats/dashboard`, `/stats/voter-demographics`
- **Users**: `/users`, `/users/{id}`, `/users/assign-candidate`

## 🎨 UI/UX Features

### Design System
- **Consistent Color Palette**: Violet-based primary colors
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant components
- **Dark Mode Ready**: Theme provider integration

### Component Library
- **Reusable Components**: Consistent UI patterns
- **Form Components**: Validation and error handling
- **Data Tables**: Sortable, filterable, paginated tables
- **Charts & Graphs**: Data visualization components

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Automatic Token Refresh**: Seamless session management
- **Role-based Authorization**: Feature access control
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Sanitized user inputs

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Responsive tablet layouts
- **Desktop Experience**: Full-featured desktop interface
- **Touch-Friendly**: Mobile-optimized interactions

## 🚀 Performance Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Caching Strategy**: React Query caching
- **Bundle Optimization**: Tree shaking and minification

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality
- **TypeScript**: Strict type checking
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks

## 🔄 State Management

### React Query Integration
- **Server State**: Automatic caching and synchronization
- **Optimistic Updates**: Immediate UI feedback
- **Background Refetching**: Keep data fresh
- **Error Handling**: Comprehensive error management

### Context Providers
- **Authentication Context**: User state and auth methods
- **Theme Context**: Dark/light mode support
- **Query Client**: Centralized data fetching

## 📊 Data Flow

1. **User Action** → Component Event Handler
2. **API Call** → React Query Hook
3. **Service Function** → Axios Request
4. **Backend API** → Response
5. **Cache Update** → UI Re-render

## 🎯 Best Practices Implemented

- **Type Safety**: Full TypeScript coverage
- **Error Boundaries**: Graceful error handling
- **Loading States**: User feedback during operations
- **Optimistic Updates**: Immediate UI responses
- **Accessibility**: ARIA labels and keyboard navigation
- **Performance**: Lazy loading and code splitting
- **Security**: Input sanitization and validation

## 🔧 Customization

### Theming
- **CSS Variables**: Customizable color scheme
- **Tailwind Config**: Extensible design system
- **Component Variants**: Flexible component styling

### Adding New Features
1. Create API service functions in `lib/api-services.ts`
2. Add React Query hooks in `lib/hooks.ts`
3. Create TypeScript types in `lib/types.ts`
4. Build UI components in `components/`
5. Integrate with existing dashboards

## 📈 Monitoring & Analytics

- **Vercel Analytics**: Built-in performance monitoring
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Core Web Vitals tracking
- **User Analytics**: Usage pattern analysis

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy automatically on push

### Other Platforms
- **Netlify**: Static site deployment
- **AWS Amplify**: Full-stack deployment
- **Docker**: Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API documentation

## 🔮 Future Enhancements

- **Real-time Updates**: WebSocket integration
- **Offline Support**: PWA capabilities
- **Advanced Analytics**: More detailed reporting
- **Mobile App**: React Native version
- **Multi-language**: Internationalization support