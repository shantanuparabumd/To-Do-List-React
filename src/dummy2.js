import React, { useState } from 'react';
import './App.css';
import { MdAddCircle} from 'react-icons/md';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaCheck } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

function App() {
  // State variables
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [priorityFilter, setPriorityFilter] = useState(['all']);
  const [statusFilter, setStatusFilter] = useState('incomplete');
  const [allTask,setAllFilter] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);
    setTasks(reorderedTasks);
  };

  // Event handlers
  const handleChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() === '') return;
    setCategories([...categories, newCategory]);
    setNewCategory('');
  };

  const handleFilterByCategory = (category) => {

    if (selectedCategory.includes(category)) {
      // If it exists, remove it from the array
      setSelectedCategory(selectedCategory.filter((p) => p !== category));
    } else {
      // If it doesn't exist, add it to the array
      setSelectedCategory([...selectedCategory, category]);
    }
    console.log('Selected categories:', selectedCategory);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    const task = {
      id: uuidv4(), // You can use uuidv4 for generating unique IDs
      text: newTask,
      category: 'none', // Default category
      priority: 'low', // Default priority
      completed: false, // Default status
    };
    setTasks([...tasks, task]);
    setNewTask('');
  };

  const handleToggleComplete = (taskId) => {
    setTasks(tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleTogglePriority = (taskId, c_priority) => {
    setTasks(tasks.map((task) =>
      task.id === taskId ? { ...task, priority: c_priority } : task
    ));
  };

  const handlePriorityFilterChange = (priority) => {
    if (priorityFilter.includes(priority)) {
      // If it exists, remove it from the array
      setPriorityFilter(priorityFilter.filter((p) => p !== priority));
    } else {
      // If it doesn't exist, add it to the array
      setPriorityFilter([...priorityFilter, priority]);
    }
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };
  
  const handleAllChange = ()=>{
    setAllFilter(!allTask);
  }

  const handleCategoryChange = (taskId, newCategory) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, category: newCategory };
      }
      return task;
    });
    setTasks(updatedTasks);
  };
  
  // Filtered tasks based on priority and status
  const filteredTasks = tasks.filter((task) => {
    if(allTask){
      return true;
    }
    if (!selectedCategory.includes(task.category)) {
      return false;
    }
    if (!priorityFilter.includes(task.priority)) {
      return false;
    }
    
    if (task.completed !== (statusFilter === 'complete')) {
      return false;
    }
    if (task.completed === (statusFilter === 'incomplete')) {
      return false;
    }
    if (searchQuery !== '' && !task.text.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  

  return (
    <div className="app">
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
              <select
                class="category-select"
                value={task.category} // Set the selected category to the task's current category
                onChange={(e) => handleCategoryChange(task.id, e.target.value)} // Call handleCategoryChange on category selection
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
               value={task.priority} onChange={(e) => handleTogglePriority(task.id, e.target.value)}
               className={`priority-select ${task.priority}`}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button onClick={() => handleToggleComplete(task.id)} style={{ backgroundColor: task.completed ? 'green' : 'red' }}>
                <FaCheck />
              </button>
              {/* Add a select element to allow users to change the category */}
              
              {/* End of select element */}
              
              
             
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
      <button onClick={() => handleAllChange('incomplete')}
        style={{ backgroundColor: allTask? 'green' : '#dc3545' }}
        >All Tasks</button>

      <div class="filter-section">
                  <h3>Priority</h3>
                  <div class="filter-content">
                  <div class="filter-buttons">
        <button onClick={() => handlePriorityFilterChange('high')} 
        style={{ backgroundColor: priorityFilter.includes('high') ? 'green' : '#dc3545' }}>High Priority</button>
        <button onClick={() => handlePriorityFilterChange('medium')}
        style={{ backgroundColor: priorityFilter.includes('medium') ? 'green' : '#dc3545' }}>Medium Priority</button>
        <button onClick={() => handlePriorityFilterChange('low')}
        style={{ backgroundColor: priorityFilter.includes('low') ? 'green' : '#dc3545' }}>Low Priority</button>
      </div>
         
          </div>
      </div>
      <div class="filter-section">
                  <h3>Status</h3>
                  <div class="filter-content">
                  <div class="filter-buttons">
        <button onClick={() => handleStatusFilterChange('complete')}
        style={{ backgroundColor: statusFilter==='complete'? 'green' : '#dc3545' }}
        >Complete</button>
        <button onClick={() => handleStatusFilterChange('incomplete')}
        style={{ backgroundColor: statusFilter==='incomplete'? 'green' : '#dc3545' }}>Incomplete</button>
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
        {categories.map((category) => (
          <button key={category} onClick={() => handleFilterByCategory(category)}
          style={{ backgroundColor: selectedCategory.includes(category)? 'green' : '#dc3545' }}>
            {category}
          </button>
        ))}
      </div>
          </div>

      
      
        
          <div class="filter-content">
          <div class="filter-buttons">
        
        
        </div>
          </div>
      </div>
      </div>
    </div>
  );
}

export default App;
