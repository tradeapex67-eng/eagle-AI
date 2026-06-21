# 🦅 Eagle Tasks - To-Do List Application

A modern, feature-rich to-do list application with local storage functionality. Built with vanilla HTML, CSS, and JavaScript.

## ✨ Features

### Core Features
- ✅ **Add Tasks** - Create new tasks with categories
- 📋 **Task Management** - Complete, edit, and delete tasks
- 💾 **Local Storage** - All tasks are automatically saved to your browser
- 🔍 **Search** - Find tasks by keyword
- 🏷️ **Categories** - Organize tasks (Work, Personal, Shopping, Health, Other)
- 📊 **Statistics** - Track total and completed tasks

### Filtering & Sorting
- **Status Filters** - View All, Active, or Completed tasks
- **Category Filters** - Filter by task category
- **Smart Search** - Search across all tasks in real-time

### Additional Features
- 🎨 **Dark Theme** - Easy on the eyes with gold accents
- ⚡ **Fast & Responsive** - Works on desktop, tablet, and mobile
- 💾 **Export Tasks** - Download tasks as JSON file
- 🗑️ **Clear Completed** - Remove all completed tasks at once
- 📱 **Mobile Optimized** - Full functionality on all devices
- 🔔 **Notifications** - Toast notifications for actions
- 🖱️ **Confirmation Dialogs** - Confirm before deleting

## 🚀 Getting Started

### Installation

1. Clone or download the repository
2. Navigate to the `todo-app` directory
3. Open `index.html` in your web browser

```bash
# Simple way - just open the file
open index.html

# Or use a local server
python -m http.server 8000
# Then visit http://localhost:8000/todo-app/
```

## 📖 How to Use

### Adding Tasks
1. Type your task in the input field
2. Select a category from the dropdown
3. Click "Add Task" or press Enter

### Managing Tasks
- **Complete**: Check the checkbox next to a task
- **Edit**: Click the "Edit" button to modify a task
- **Delete**: Click the "Delete" button to remove a task

### Filtering & Searching
- Click filter buttons to view: All, Active, or Completed tasks
- Click category badges to filter by category
- Use the search box to find specific tasks

### Bulk Actions
- **Clear Completed**: Remove all completed tasks
- **Delete All**: Delete all tasks (with confirmation)
- **Export Tasks**: Download tasks as JSON file

## 🎨 Color Scheme

- **Primary Gold**: #D4AF37 (Eagle accent)
- **Secondary Gold**: #FFD700 (Gradient highlight)
- **Dark Background**: #1A1A1A, #0F0F0F
- **Text**: #FFFFFF

## 📁 File Structure

```
todo-app/
├── index.html      # HTML structure
├── styles.css      # Complete styling
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## 💾 Local Storage

All tasks are automatically saved to your browser's local storage:
- Storage Key: `eagle-tasks`
- Format: JSON array of task objects
- Persists: Across browser sessions

### Task Object Structure
```javascript
{
  id: 1234567890,           // Unique timestamp ID
  text: "Task description",  // Task text
  category: "work",          // Category (work, personal, shopping, health, other)
  completed: false,          // Completion status
  createdAt: "ISO string",   // Creation date
  updatedAt: "ISO string"    // Last update date
}
```

## 🎯 Categories

- 💼 **Work** - Work-related tasks
- 👤 **Personal** - Personal tasks
- 🛒 **Shopping** - Shopping list items
- 🏥 **Health** - Health and wellness tasks
- 📝 **Other** - Miscellaneous tasks

## 📱 Responsive Design

- **Desktop** (1024px+) - Full layout with all features
- **Tablet** (768px - 1024px) - Optimized layout
- **Mobile** (Below 768px) - Stacked layout for easy use

## 🔧 Browser Compatibility

- ✅ Chrome/Chromium (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Edge (Latest)
- ✅ Mobile browsers

## 🚀 Features Breakdown

### JavaScript OOP Architecture
- **TodoApp Class** - Main application class
- **Constructor** - Initialization logic
- **Methods** - Organized, reusable functions
- **Event Delegation** - Efficient event handling

### Local Storage Operations
```javascript
// Save tasks
saveTasks() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
}

// Load tasks
loadTasks() {
    const stored = localStorage.getItem(this.storageKey);
    this.tasks = stored ? JSON.parse(stored) : [];
}
```

### Search & Filter
- Real-time search functionality
- Multiple filter criteria
- Combined filtering (status + category + search)

### User Feedback
- Success/error toast notifications
- Confirmation dialogs for destructive actions
- Visual feedback on interactions
- Real-time statistics updates

## 🎓 Learning Points

This application demonstrates:
- ✅ DOM manipulation with vanilla JavaScript
- ✅ Local Storage API
- ✅ Event handling and delegation
- ✅ Object-Oriented Programming (OOP)
- ✅ CSS Grid and Flexbox layouts
- ✅ Responsive design principles
- ✅ Form input handling
- ✅ Data persistence

## 🔐 Data Privacy

- ✅ All data stored locally in your browser
- ✅ No server communication
- ✅ No tracking or analytics
- ✅ Your tasks remain private
- ✅ Clear browser data to delete tasks

## 📊 Statistics

- Display total number of tasks
- Display number of completed tasks
- Real-time updates as tasks change
- Percentage-based progress (in header)

## 🎨 Customization

### Change Colors
Edit `styles.css`:
```css
--primary-gold: #D4AF37;
--secondary-gold: #FFD700;
```

### Add New Categories
Edit `index.html` select element:
```html
<option value="custom">Custom Category</option>
```

Then update the emoji mapping in `script.js`:
```javascript
emojis = {
    custom: '🎯'
}
```

## 🐛 Troubleshooting

### Tasks Not Saving?
- Check if localStorage is enabled in your browser
- Check browser console for errors
- Clear browser cache and refresh

### UI Not Loading Properly?
- Ensure all files are in the same directory
- Check browser compatibility
- Clear browser cache

### Search Not Working?
- Ensure task input contains text
- Check if filters are preventing results
- Try clearing filters

## 📝 Future Enhancements

- [ ] Due dates and reminders
- [ ] Priority levels
- [ ] Recurring tasks
- [ ] Cloud sync (Firebase)
- [ ] Dark/Light theme toggle
- [ ] Drag & drop reordering
- [ ] Subtasks
- [ ] Time tracking
- [ ] Tags/Labels
- [ ] Collaboration features

## 📄 License

MIT License - Feel free to use and modify

## 👤 Author

**Eagle Tasks** - Built by tradeapex67-eng

---

**Built with ❤️ using HTML5, CSS3, and Vanilla JavaScript**

🦅 **Start organizing your tasks today with Eagle Tasks!**