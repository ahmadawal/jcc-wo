# WO Interactive Application

A full-stack web application built with Vue.js frontend and Express.js backend, featuring an interactive background and MySQL database integration.

## 🚀 Features

### Frontend (Vue.js + Tailwind CSS)
- **Interactive Background**: Dynamic particles and geometric shapes that respond to user interactions
- **Modern UI**: Beautiful gradient background with floating cards and animations
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Real-time Interactions**: Click, hover, and mouse movement effects
- **Status Tracking**: Live interaction counter and status display

### Backend (Express.js + MySQL)
- **RESTful API**: Complete CRUD operations for users and interactions
- **Database Integration**: MySQL database with connection pooling
- **Security**: Helmet.js, CORS, and rate limiting
- **Statistics**: Real-time application statistics and analytics
- **Health Monitoring**: API health check endpoints

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn** package manager

## 🛠️ Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install all dependencies (frontend + backend)
npm run install:all
```

### 2. Database Setup

First, ensure MySQL is running on your system with the following credentials:
- **Host**: localhost
- **Port**: 3306
- **Username**: devuser
- **Password**: devuser

If you need to create the MySQL user:

```sql
CREATE USER 'devuser'@'localhost' IDENTIFIED BY 'devuser';
GRANT ALL PRIVILEGES ON *.* TO 'devuser'@'localhost';
FLUSH PRIVILEGES;
```

Then set up the database:

```bash
# Set up database and tables
npm run setup:db
```

### 3. Start the Application

#### Development Mode (Recommended)
```bash
# Start both frontend and backend in development mode
npm run dev
```

#### Production Mode
```bash
# Start both frontend and backend in production mode
npm run start
```

## 🌐 Access Points

Once the application is running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health
- **API Documentation**: http://localhost:5000

## 📚 API Endpoints

### Health & Status
- `GET /api/health` - Server health check
- `GET /api/stats` - Application statistics

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user

### Interactions
- `GET /api/interactions` - Get interactions (with filters)
- `POST /api/interactions` - Log user interaction

## 🎮 Interactive Features

### Frontend Interactions
1. **Particles**: Click on floating particles to change their color
2. **Shapes**: Click on geometric shapes to trigger bounce animations
3. **Cards**: Click on feature cards to log interactions
4. **Buttons**: Interactive buttons with hover effects

### Backend Integration
- All frontend interactions are logged to the database
- Real-time statistics tracking
- User management system
- API health monitoring

## 🗂️ Project Structure

```
wo/
├── package.json              # Root package.json with scripts
├── README.md                 # This file
├── client/                   # Vue.js Frontend
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── main.js
│       ├── App.vue
│       └── style.css
└── server/                   # Express.js Backend
    ├── package.json
    ├── server.js
    ├── setup-database.js
    ├── config/
    │   └── database.js
    └── routes/
        └── api.js
```

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run start` - Start both frontend and backend in production mode
- `npm run install:all` - Install dependencies for all packages
- `npm run setup:db` - Set up database and tables

### Frontend (client/)
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend (server/)
- `npm run dev` - Start server with nodemon
- `npm run start` - Start production server
- `npm run setup:db` - Set up database

## 🎨 Customization

### Frontend Styling
- Modify `client/src/style.css` for global styles
- Update `client/tailwind.config.js` for custom animations and colors
- Edit `client/src/App.vue` for component-specific styling

### Backend Configuration
- Update `server/config/database.js` for database settings
- Modify `server/routes/api.js` for API endpoints
- Edit `server/server.js` for server configuration

## 🐛 Troubleshooting

### Database Connection Issues
1. Ensure MySQL is running
2. Verify credentials in `server/config/database.js`
3. Run `npm run setup:db` to initialize database

### Port Conflicts
- Frontend runs on port 3000
- Backend runs on port 5000
- Update ports in respective config files if needed

### Build Issues
1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Check Node.js version compatibility
3. Verify all dependencies are installed

## 📝 License

MIT License - feel free to use this project for your own applications!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Enjoy building with WO Interactive Application! 🚀** 