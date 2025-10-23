# Time Lock - Task Management with MongoDB

A modern task management application built with Next.js, MongoDB, and a beautiful multi-color pastel theme.

## Features

- ✅ **MongoDB Integration**: Full database persistence with fallback to localStorage
- 🎨 **Multi-Color Theme**: Beautiful pastel color palette inspired by modern dashboard designs
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🔄 **Recurring Tasks**: Support for daily, weekly, monthly, and yearly recurring tasks
- 📊 **Analytics**: Task completion tracking and insights
- 📅 **Calendar View**: Visual calendar for task scheduling
- 🤖 **AI Assistant**: Built-in AI chat for task management help

## Setup

### Prerequisites

- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- npm or pnpm

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/time-lock
   # Alternative: MongoDB Atlas connection string
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/time-lock?retryWrites=true&w=majority

   # Next.js Configuration
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Start MongoDB:**
   - **Local MongoDB**: Start your MongoDB service
   - **MongoDB Atlas**: Use the connection string in your `.env.local`

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## MongoDB Configuration

The app uses MongoDB for persistent data storage with the following features:

- **Automatic Connection**: Connects to MongoDB on first API call
- **Fallback Support**: Falls back to localStorage if MongoDB is unavailable
- **Error Handling**: Graceful error handling with user-friendly messages
- **ObjectId Management**: Proper handling of MongoDB ObjectIds

### Database Schema

The app uses a `tasks` collection with the following structure:
```javascript
{
  _id: ObjectId,
  id: String, // String version of _id for frontend
  title: String,
  description: String,
  category: String, // Work, Study, Personal, Health, Review
  time: String, // HH:MM format
  recurring: String, // once, daily, weekly, monthly, yearly
  completed: Boolean,
  userId: String,
  createdAt: String, // ISO date string
  dueDate: String, // ISO date string (optional)
  lastCompletedDate: String, // ISO date string (optional)
  parentTaskId: String, // For recurring task instances
  recurrenceRule: Object // Recurrence configuration
}
```

## Color Theme

The app features a beautiful multi-color pastel theme with:

- **Purple**: Primary actions and Work category
- **Blue**: Calendar and Study category  
- **Pink**: Completed tasks and Personal category
- **Green**: Analytics and Health category
- **Orange**: Delete actions and Review category
- **Cyan**: Additional UI elements

## API Endpoints

- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks` - Update an existing task
- `DELETE /api/tasks?id={id}` - Delete a task

## Development

### Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/tasks/         # MongoDB API routes
│   ├── globals.css        # Global styles and theme
│   └── ...
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...
├── lib/                  # Utilities and contexts
│   ├── mongodb.ts        # MongoDB connection
│   ├── task-context.tsx  # Task state management
│   └── ...
└── ...
```

### Key Technologies

- **Next.js 16**: React framework with App Router
- **MongoDB**: Database with native driver
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **TypeScript**: Type safety
- **Lucide React**: Beautiful icons

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.
