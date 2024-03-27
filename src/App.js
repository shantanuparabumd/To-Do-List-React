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
  
  const [statusFilter, setStatusFilter] = useState('incomplete');// Updated to use a string for easier comparison
  const [categories, setCategories] = useState(['None']);
  const [searchQuery, setSearchQuery] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(['None']);
  const [allTask,setAllFilter] = useState(true);

  
  const [priorityFilter, setPriorityFilter] = useState([]);


  const handleChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    const task = {
      id: uuidv4(),
      text: newTask,
      category: 'None',
      priority: 'low',
      dueDate: dueDate,
      completed: false
    };
    setTasks([...tasks, task]);
    setNewTask('');
    setDueDate(null);
    
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
    if (selectedCategory.includes(category)) {
      // If it exists, remove it from the array
      setSelectedCategory(selectedCategory.filter((p) => p !== category));
    } else {
      // If it doesn't exist, add it to the array
      setSelectedCategory([...selectedCategory, category]);
    }
  };

  const handleFilterByPriority = (priority) => {
      if(priorityFilter.includes(priority)){
        setPriorityFilter(priorityFilter.filter((p)=> p!==priority));
      }
      else{
        setPriorityFilter([...priorityFilter,priority]);
      }
  };


  const handleAddCategory = () => {
    if (newCategory.trim() === '') return;
    setCategories([...categories, newCategory]);
    console.log(categories);
    setNewCategory('');
  };

  const handleTogglePriority = (taskId, newPriority) => {
    setTasks(tasks.map((task) =>
      task.id === taskId ? { ...task, priority: newPriority } : task
    ));
  };

  const handleAllChange = ()=>{
    setAllFilter(!allTask);
  }

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
    if (allTask){
      return true;
    }
    // if (task.category === 'None') {
    //   return true; // Return true to include all tasks when 'All Categories' is selected
    // }
    if (!selectedCategory.includes(task.category)) {
      return false;
    }
    if (!priorityFilter.includes(task.priority)) {
      return false;
    }
    if (searchQuery !== '' && !task.text.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (!task.completed && (statusFilter === 'complete')) {
      return false;
    }
    if (task.completed && (statusFilter === 'incomplete')) {
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

 

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
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
        {/* <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select> */}
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
              <DatePicker class="date-picker"
                selected={task.dueDate}
                onChange={(date) => handleDueDateChange(task.id, date)}
                dateFormat="MM/dd/yyyy"
                placeholderText="Due Date"
              />
              <button onClick={() => handleToggleComplete(task.id)} style={{ backgroundColor: task.completed ? 'green' : '#dc3545' }}>
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
      <button onClick={() => handleAllChange()}
        style={{ backgroundColor: allTask? 'green' : '#dc3545' }}
        >All Tasks</button>
      <div class="filter-section">
                  <h3>Priority</h3>
                  <div class="filter-content">
                  <div class="filter-buttons">
        <button onClick={() => handleFilterByPriority('high')}
        style={{ backgroundColor: priorityFilter.includes('high') ? 'green' : '#dc3545' }}
        >High Priority</button>
        <button onClick={() => handleFilterByPriority('medium')}
        style={{ backgroundColor: priorityFilter.includes('medium') ? 'green' : '#dc3545' }}
        >Medium Priority</button>
        <button onClick={() => handleFilterByPriority('low')}
        style={{ backgroundColor: priorityFilter.includes('low') ? 'green' : '#dc3545' }}
        >Low Priority</button>
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
      </div>
      </div>
    </div>
    
  );
}

export default App;
