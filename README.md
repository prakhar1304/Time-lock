# Time Lock 🕒

> **A Modern AI-Powered Task Management Application**

Time Lock is a comprehensive, open-source task management platform that combines beautiful design with intelligent AI assistance. Built with Next.js 16, MongoDB, and cutting-edge AI integration, it provides users with a complete productivity ecosystem.

![Time Lock Preview](public/timelock.png)

## ✨ Features

### 🎯 **Core Task Management**
- **Smart Task Creation** - Create tasks with categories, time blocks, and priorities
- **Recurring Tasks** - Support for daily, weekly, monthly, and yearly recurring tasks
- **Task Categories** - Organize tasks by Work, Study, Personal, Health, and Review
- **Time Blocking** - Visual calendar with time-blocking capabilities
- **Task Analytics** - Comprehensive productivity insights and completion tracking

### 🤖 **AI-Powered Intelligence**
- **AI Assistant** - Built-in chat assistant for task management help
- **Smart Suggestions** - AI-generated task recommendations based on your patterns
- **Memory System** - AI remembers your goals and preferences across sessions
- **Multi-Model Support** - Choose between GPT-4o Mini and Gemini Flash 2.0
- **Contextual Help** - AI understands your schedule and provides personalized advice

### 📊 **Analytics & Insights**
- **Productivity Dashboard** - Visual charts and statistics
- **Completion Tracking** - Monitor your task completion rates
- **Category Analysis** - Understand your productivity patterns
- **Streak Tracking** - Maintain motivation with completion streaks
- **Performance Metrics** - Detailed analytics on your work habits

### 🎨 **Beautiful Design**
- **Multi-Color Theme** - Beautiful pastel color palette
- **Glass Morphism** - Modern glass-card design elements
- **Responsive Design** - Seamless experience across all devices
- **Dark/Light Mode** - Adaptive theming support
- **Smooth Animations** - Polished user interactions

### 🔐 **User Management**
- **Authentication System** - Secure user registration and login
- **User Profiles** - Customizable user settings and preferences
- **Data Persistence** - MongoDB integration with localStorage fallback
- **Privacy Focused** - Your data stays secure and private

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **pnpm**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/time-lock.git
   cd time-lock
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/time-lock
   # Alternative: MongoDB Atlas connection string
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/time-lock?retryWrites=true&w=majority

   # Next.js Configuration
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000

   # AI Configuration (Optional)
   OPENAI_API_KEY=your-openai-api-key
   GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Start MongoDB**
   - **Local MongoDB**: Start your MongoDB service
   - **MongoDB Atlas**: Use the connection string in your `.env.local`

5. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - Primary database with native driver
- **Mongoose** - MongoDB object modeling
- **NextAuth.js** - Authentication framework

### **AI Integration**
- **OpenAI API** - GPT-4o Mini integration
- **Google Gemini** - Gemini Flash 2.0 support
- **AI SDK** - Vercel AI SDK for chat functionality
- **Memory System** - Persistent AI context

### **Development Tools**
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Vercel Analytics** - Performance monitoring

## 📁 Project Structure

```
time-lock/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── ai/           # AI chat and memory endpoints
│   │   ├── tasks/        # Task CRUD operations
│   │   └── user/         # User management
│   ├── analytics/        # Analytics dashboard
│   ├── calendar/         # Calendar and time-blocking
│   ├── login/            # Authentication pages
│   └── signup/           # User registration
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── ai-assistant.tsx # AI chat interface
│   ├── analytics-charts.tsx # Data visualization
│   └── task-list.tsx    # Task management components
├── lib/                 # Utilities and contexts
│   ├── mongodb.ts       # Database connection
│   ├── task-context.tsx # Task state management
│   ├── auth-context.tsx # Authentication context
│   └── ai-context.ts    # AI configuration
└── public/             # Static assets
```

## 🤝 Contributing to Time Lock

We welcome contributions from developers of all skill levels! Time Lock is an open-source project that thrives on community involvement.

### **How to Contribute**

#### 1. **Fork and Clone**
```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/time-lock.git
cd time-lock
```

#### 2. **Set Up Development Environment**
```bash
# Install dependencies
npm install

# Create a development branch
git checkout -b feature/your-feature-name

# Set up your environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

#### 3. **Make Your Changes**
- Follow our coding standards (TypeScript, ESLint)
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

#### 4. **Test Your Changes**
```bash
# Run the development server
npm run dev

# Run linting
npm run lint

# Test your changes thoroughly
```

#### 5. **Submit a Pull Request**
- Push your changes to your fork
- Create a pull request with a clear description
- Link any related issues
- Wait for review and feedback

### **Types of Contributions We Welcome**

#### 🐛 **Bug Fixes**
- Fix existing bugs and issues
- Improve error handling
- Enhance performance

#### ✨ **New Features**
- Add new task management features
- Implement additional AI capabilities
- Create new analytics visualizations
- Add integrations with external services

#### 🎨 **UI/UX Improvements**
- Enhance the design system
- Improve accessibility
- Add new themes or customization options
- Optimize mobile experience

#### 📚 **Documentation**
- Improve README and documentation
- Add code comments
- Create tutorials and guides
- Translate documentation

#### 🔧 **Infrastructure**
- Improve build and deployment processes
- Add CI/CD pipelines
- Enhance testing coverage
- Optimize performance

### **Development Guidelines**

#### **Code Style**
- Use TypeScript for type safety
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

#### **Commit Convention**
```
feat: add new AI model support
fix: resolve task completion bug
docs: update installation guide
style: improve button hover effects
refactor: optimize database queries
test: add unit tests for task context
```

#### **Pull Request Process**
1. **Clear Title** - Describe what your PR does
2. **Detailed Description** - Explain changes and motivation
3. **Screenshots** - For UI changes, include before/after screenshots
4. **Testing** - Describe how you tested your changes
5. **Breaking Changes** - Note any breaking changes

### **Getting Help**

#### **Community Support**
- **GitHub Discussions** - Ask questions and share ideas
- **Issues** - Report bugs and request features
- **Discord** - Join our community chat (coming soon)

#### **Resources**
- **Documentation** - Comprehensive guides in `/docs`
- **API Reference** - Detailed API documentation
- **Component Library** - UI component examples
- **Tutorials** - Step-by-step guides for common tasks

### **Recognition**

Contributors are recognized in several ways:
- **Contributors List** - Featured in README
- **Release Notes** - Acknowledged in version releases
- **Community Badges** - Special recognition for active contributors
- **Maintainer Opportunities** - Long-term contributors may become maintainers

## 📊 Project Status

- **Version**: 0.1.0
- **Status**: Active Development
- **License**: MIT
- **Maintainers**: [Your Name](https://github.com/yourusername)

### **Roadmap**

#### **Phase 1: Core Features** ✅
- [x] Task management system
- [x] User authentication
- [x] MongoDB integration
- [x] Basic AI assistant

#### **Phase 2: Advanced Features** 🚧
- [ ] Team collaboration
- [ ] Advanced AI features
- [ ] Mobile app
- [ ] Third-party integrations

#### **Phase 3: Enterprise** 📋
- [ ] Enterprise features
- [ ] Advanced analytics
- [ ] Custom workflows
- [ ] API for developers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Vercel** - For hosting and deployment
- **MongoDB** - For database services
- **OpenAI** - For AI capabilities
- **Google** - For Gemini AI support
- **Radix UI** - For accessible components
- **Tailwind CSS** - For styling framework

## 📞 Contact

- **Project Maintainer**: [Your Name](mailto:your.email@example.com)
- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Twitter**: [@yourusername](https://twitter.com/yourusername)

---

**Made with ❤️ by the Time Lock community**

*Start managing your time better today!*