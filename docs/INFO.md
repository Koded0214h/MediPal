# MediPal Project Information

## Architecture Overview

### Backend (Python)
- RESTful API built with FastAPI
- PostgreSQL database
- Authentication using JWT
- API documentation with Swagger/OpenAPI

### Frontend (Web)
- React-based SPA
- Material-UI components
- Redux for state management
- Responsive design for all devices

### Mobile (React Native)
- Cross-platform mobile application
- Native UI components
- Offline support
- Push notifications

## Directory Structure Details

### Backend Structure
```
backend/
├── app/
│   ├── api/          # API endpoints
│   ├── core/         # Core functionality
│   ├── models/       # Database models
│   └── services/     # Business logic
├── tests/            # Test files
└── requirements.txt  # Dependencies
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/   # Reusable components
│   ├── pages/        # Page components
│   ├── services/     # API services
│   ├── store/        # Redux store
│   └── utils/        # Utility functions
├── public/           # Static files
└── package.json      # Dependencies
```

### Mobile Structure (To be created)
```
mobile/
├── src/
│   ├── components/   # Reusable components
│   ├── screens/      # Screen components
│   ├── services/     # API services
│   ├── store/        # State management
│   └── utils/        # Utility functions
├── assets/          # Images, fonts, etc.
└── package.json     # Dependencies
```

## Development Workflow

1. **Branch Naming Convention**
   - feature/feature-name
   - bugfix/bug-description
   - hotfix/issue-description

2. **Commit Message Format**
   ```
   type(scope): description
   
   [optional body]
   [optional footer]
   ```
   Types: feat, fix, docs, style, refactor, test, chore

3. **Code Review Process**
   - Create pull request
   - At least one reviewer approval required
   - All tests must pass
   - No merge conflicts

## API Documentation

API documentation is available at `/docs` when running the backend server locally.

## Environment Variables

### Backend
- DATABASE_URL
- SECRET_KEY
- DEBUG
- ALLOWED_HOSTS

### Frontend
- REACT_APP_API_URL
- REACT_APP_ENV

### Mobile
- API_URL
- ENV

## Testing

- Backend: pytest
- Frontend: Jest + React Testing Library
- Mobile: Jest + React Native Testing Library

## Deployment

- Backend: Docker container
- Frontend: Static hosting
- Mobile: App Store / Play Store

## Security Considerations

1. All API endpoints must be authenticated
2. Sensitive data must be encrypted
3. Regular security audits
4. Follow OWASP guidelines

## Performance Guidelines

1. Implement caching where appropriate
2. Optimize database queries
3. Use lazy loading for images
4. Implement pagination for large datasets

## Mobile Development Guidelines

1. Follow React Native best practices
2. Implement proper error handling
3. Ensure offline functionality
4. Optimize for both iOS and Android
5. Follow platform-specific design guidelines 