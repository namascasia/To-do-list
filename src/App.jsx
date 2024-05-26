import { useEffect, useState } from 'react';
import './App.css';
import { styles } from './stylesComponents.js';
import {Container, Header, Button, Input, List, Select} from 'semantic-ui-react';
import toast, { Toaster } from 'react-hot-toast';
import { RowItem } from './components/RowItem/RowItem.jsx';

const filterOptions = [
  {key: 'all', value: 'all', text: 'All'},
  {key: 'completed', value: 'completed', text: 'Completed'},
  {key: 'pending', value: 'pending', text: 'Pending'}
];
const notify = () => toast.success('Updating task!');
const notifyRemove = () => toast.success('Deleting task!');

function App() {

  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) return JSON.parse(storedTasks);
    return [];
  });

  const [tasksInput, setTasksInput] = useState('');
  const [filter, setFilter] = useState('all');
  
  const addTask = () => {
    
    if(tasksInput.trim().length > 0 ) {
      setTasks([...tasks, {id: crypto.randomUUID(), description: tasksInput, date: new Date().toLocaleString(), completed: false}]);
      setTasksInput('');
    }
  }

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    notifyRemove();
  }

  const toggleTask = (id) => {
    setTasks(tasks.map(task => {
      if(task.id === id){
        task.completed = !task.completed;
      }
      return task;
    }))
  }

  const filterTasks = (filter) => {
    if(filter === 'all') return tasks;
    if(filter === 'completed') return tasks.filter(task => task.completed);
    if(filter === 'pending') return tasks.filter(task => !task.completed);
  }

  const updatedTask = (id, newDescription) => {
    
    if(newDescription.length > 0){ 
      setTasks(tasks.map(task => {
        if(task.id === id){
          task.description = newDescription;
          task.date = new Date().toLocaleString();
        }
        return task;
      }))
      notify();
    }
  }

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  const confirmRemove = (id) => {
    toast((t) => (
      <div>
        <span>Do you want to delete this task?</span>
        <div style={styles.confirmButton}>
          <button style={styles.buttonRemove} onClick={() => {
            removeTask(id);
            toast.dismiss(t.id);
          }}>
            Yes
          </button>
          <button style={styles.buttonRemove} onClick={() => toast.dismiss(t.id)}>
            No
          </button>
        </div>
      </div>
    ));
  };

  let taskList;

  if (tasks.length) {
    taskList = (
      <List className='listTasks'> 
        {
          filterTasks(filter).map(task => (
            <RowItem
              key={task.id}
              task={task}
              toggleTask={toggleTask}
              confirmRemove={confirmRemove}
              updatedTask={updatedTask}
            />
          ))
        }
      </List>
    );
  }

  return (
    <>
      <Container>
        <Header style={styles.header}>To Do List</Header>
        <div className='taskAndFilter'>  
          <Input
            style={styles.inputTask}
            placeholder='Add a task...'
            value={tasksInput}
            onChange={(e) => setTasksInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            action={<Button style={styles.save} onClick={addTask}>Save</Button>} />
          <Select 
          style={styles.filterTask}
          placeholder='Select option...' 
          options={filterOptions} 
          onChange={(e, data) => setFilter(data.value)} />
        </div>
        <div className='containerTasks'>
          {
            tasks.length === 0 ? (
              <label className='title'> No tasks</label>
            ):(
              <label className='title'>Tasks</label>
            )  
          }
          { taskList }
        </div>
      </Container>
      <div>
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
      </div>
    </>
  )
}

export default App;
