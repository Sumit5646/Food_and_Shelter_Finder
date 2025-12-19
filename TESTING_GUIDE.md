# Testing Guide - Food & Shelter Finder CRUD Operations

## Current Setup ✅

- **React Dev Server**: http://localhost:5173
- **JSON Server**: http://localhost:3001
- **Database**: `db.json` (located in myapp folder)

## Servers Running

Both servers are now running. Make sure they stay active during testing.

## Test Credentials

Use these credentials to test login:

```
Username: admin
Password: admin123
```

## Testing Workflow

### 1. Test Login
1. Go to http://localhost:5173
2. Click "Login"
3. Enter username: `admin`
4. Enter password: `admin123`
5. Click "Login" button
6. ✅ Should redirect to /home dashboard

### 2. Test Register
1. Go to http://localhost:5173
2. Click "Sign up" link
3. Fill in form:
   - Username: `testuser` (or any unique name)
   - Email: `test@example.com`
   - Mobile: `9876543210`
   - Password: `test123`
   - Confirm Password: `test123`
4. Click "Register"
5. ✅ Should show success message and redirect to login

### 3. Test Food List CRUD
1. After login, go to "Food Meals" or click Foods link
2. **Create**: Click "+ Add Food" button
   - Fill form with food details
   - Click "Save"
   - ✅ Food should appear in grid
3. **Read**: Food items display with search/sort
4. **Update**: Click "✏️ Edit" on any food card
   - Modify details
   - Click "Save"
   - ✅ Changes should be reflected
5. **Delete**: Click "🗑️ Delete" on any food card
   - Confirm deletion
   - ✅ Item should be removed

### 4. Test Shelter List CRUD
1. Go to "Shelters" or click Shelters link
2. Same workflow as Food List:
   - Add new shelter with "+ Add Shelter"
   - Edit existing shelter
   - Delete shelter

### 5. Test Admin Dashboard
1. Go to "Admin" after login
2. **Users Tab**: View all users, Edit user info, Delete users
3. **Food Items Tab**: View all food, Edit food, Delete food
4. **Shelters Tab**: View all shelters, Edit shelter, Delete shelter

## API Endpoints

All endpoints are accessible via http://localhost:3001:

- `GET /users` - Get all users
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

- `GET /food` - Get all food items
- `POST /food` - Create food item
- `PUT /food/:id` - Update food item
- `DELETE /food/:id` - Delete food item

- `GET /shelter` - Get all shelters
- `POST /shelter` - Create shelter
- `PUT /shelter/:id` - Update shelter
- `DELETE /shelter/:id` - Delete shelter

## Troubleshooting

### Login/Register Not Working
1. Check if JSON Server is running: http://localhost:3001/users
2. Check if React dev server is running: http://localhost:5173
3. Open browser console (F12) and check for error messages
4. Make sure db.json has proper structure with "users" array

### CRUD Operations Not Working
1. Verify JSON Server is still running
2. Check Network tab in DevTools to see actual API requests
3. Verify axios is imported correctly in components
4. Check API_BASE_URL is set to `http://localhost:3001`

### Port Already in Use
If port 5173 or 3001 is already in use:
```bash
# Kill process on specific port (Windows)
# For port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# For port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

## Expected Behavior

After fixing the server issues:
- ✅ Login with admin/admin123 should work
- ✅ Register new user should create entry in db.json
- ✅ Food/Shelter add, edit, delete should update db.json in real-time
- ✅ Admin dashboard should show live data
- ✅ All operations should persist when you refresh the page (data comes from db.json)
