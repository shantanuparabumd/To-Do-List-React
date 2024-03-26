import React, { useState } from 'react';
import { MdAddCircle} from 'react-icons/md';
import { FaCheck } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  // const [selectedCategory, setSelectedCategory] = useState('all');
  const [newCategory, setNewCategory] = useState('');
  // const [priority, setPriority] = useState('low');
  const [completed, setCompleted] = useState('false'); // Updated to use a string for easier comparison
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [priorityFilter, setPriority] = useState([]);


  const handleChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    const task = {
      id: uuidv4(),
      text: newTask,
      category: selectedCategory,
      priority: priorityFilter,
      dueDate: dueDate
    };
    setTasks([...tasks, task]);
    setNewTask('');
    setDueDate(null);
    setPriority(['low']);
  };

  const handleRemove = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleToggleComplete = (taskId) => {
    setTasks(tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleFilterByCategory = (category) => {
    setSelectedCategory(category);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() === '') return;
    setCategories([...categories, newCategory]);
    setNewCategory('');
  };

  const handleTogglePriority = (taskId, newPriority) => {
    setTasks(tasks.map((task) =>
      task.id === taskId ? { ...task, priority: newPriority } : task
    ));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);
    setTasks(reorderedTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    if (task.category === 'all') {
      return true; // Return true to include all tasks when 'All Categories' is selected
    }
    if (selectedCategory.length > 0 && !selectedCategory.includes(task.category)) {
      return false;
    }
    if (priority.length > 0 && !priority.includes(task.priority)) {
      return false;
    }
    if (searchQuery !== '' && !task.text.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (completed === 'true' && !task.completed) {
      return false;
    }
    if (completed === 'false' && task.completed) {
      return false;
    }
    
    return true;
  });

  const handleDueDateChange = (taskId, date) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, dueDate: date };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleCategoryChange = (taskId, newCategory) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, category: newCategory };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleFilterByPriority = (priority) => {
      const updatedPriorities = priority.includes(priority)
      ? priority.filter((p) => p !== priority)
      : [...priority, priority];
    setPriority(updatedPriorities);
  };

  const handleFilterByStatus = (status) => {
    setCompleted(status);
  };
  
  

  return (
    <div class="app">
      <div class="header">
      <h1 >To-Do List</h1>
      </div>
      
      <div class="search-bar">
        <input
          type="text"
          placeholder="Search for tasks"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div class="main-content">
      <div class="tasks">
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add a new task"
          value={newTask}
          onChange={handleChange}
        />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <button type="submit"><MdAddCircle /></button>
      </form>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {filteredTasks.map((task, index) => (
        <Draggable key={task.id} draggableId={task.id} index={index}>
          {(provided) => (
            <li
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={task.completed ? 'completed' : ''}
            >
              <span>{task.text}</span>
              {/* Add a select element to allow users to change the category */}
              <select
                class="category-select"
                value={task.category} // Set the selected category to the task's current category
                onChange={(e) => handleCategoryChange(task.id, e.target.value)} // Call handleCategoryChange on category selection
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {/* End of select element */}
              
              <select
               value={task.priority} onChange={(e) => handleTogglePriority(task.id, e.target.value)}
               className={`priority-select ${task.priority}`}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <DatePicker
                selected={task.dueDate}
                onChange={(date) => handleDueDateChange(task.id, date)}
                dateFormat="MM/dd/yyyy"
                placeholderText="Due Date"
              />
              <button onClick={() => handleToggleComplete(task.id)} style={{ backgroundColor: task.completed ? 'green' : 'red' }}>
                <FaCheck />
              </button>
              <button onClick={() => handleRemove(task.id)}>
                <FaTrash/></button>
            </li>
          )}
        </Draggable>
        ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        
      </div>

      
      <div class="filter">

      <div class="filter-section">
                  <h3>Priority</h3>
                  <div class="filter-content">
                  <div class="filter-buttons">
        <button onClick={() => handleFilterByPriority(['high'])}>High Priority</button>
        <button onClick={() => handleFilterByPriority(['medium'])}>Medium Priority</button>
        <button onClick={() => handleFilterByPriority(['low'])}>Low Priority</button>
      </div>
         
          </div>
      </div>
      <div class="filter-section">
                  <h3>Status</h3>
                  <div class="filter-content">
                  <div class="filter-buttons">
        <button onClick={() => handleFilterByStatus('true')}>Complete</button>
        <button onClick={() => handleFilterByStatus('false')}>Incomplete</button>
      </div>
         
          </div>
      </div>

      <div class="filter-section">
                  <h3>Category</h3>
      </div>

      <div class="category-input">
        <input
          type="text"
          placeholder="Add a new category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleAddCategory}>Add Category</button>
      </div>
      
        
          <div class="filter-content">
          <div class="filter-buttons">
        <button onClick={() => handleFilterByCategory('all')}>All Tasks</button>
        {categories.map((category) => (
          <button key={category} onClick={() => handleFilterByCategory(category)}>
            {category}
          </button>
        ))}
      </div>
          </div>
      </div>
      </div>
    </div>
    
  );
}

export default App;
