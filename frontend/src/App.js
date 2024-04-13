import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';

function App() {

  const [tasks, setTasks] = useState({
    todo: [],
    doing: [],
    done: [],
    dropped: []
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/get_tasks')
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data[0]);
        setTasks(data[0]);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);


  if (loading) {
    return <div>Loading...<h1>here comes an animation</h1></div>;
  }

  const updateBackend = () => {
    fetch('http://localhost:8080/update_tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tasks),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const handleEdit = (task, index, status) => {
    const newTask = prompt('Edit task', task);
    if (newTask) {
      setTasks(prevTasks => {
        const newTasks = { ...prevTasks };
        newTasks[status][index] = newTask;
        return newTasks;
      });
      updateBackend();
    }
    setEditing(null);
  };

  const handleDelete = (index, status) => {
    setTasks(prevTasks => {
      const newTasks = { ...prevTasks };
      newTasks[status].splice(index, 1);
      return newTasks;
    });
    updateBackend();
  };

  const handleClick = (task, index, status) => {
    setSelectedTask({ task, index, status });
    setShowModal(true);
  };
  

  return (
    <div className="kanban-board">
      <Popup
          open={showModal}
          closeOnDocumentClick
          onClose={() => setShowModal(false)}
        >
          <div>
            <h2>Do you want to edit or delete this task?</h2>
            <button onClick={() => { setEditing(selectedTask); setShowModal(false); }}>Edit</button>
            <button onClick={() => { handleDelete(selectedTask.index, selectedTask.status); setShowModal(false); }}>Delete</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </Popup>
      <div className="kanban-column">
            <h2>Todo</h2>
            {tasks.todo.map((task, index) => (
              <div key={index} className="task-item" onClick={() => handleClick(task, index, 'todo')}>
                {editing && editing.task === task && editing.index === index && editing.status === 'todo' ? (
                  <input type="text" defaultValue={task} onBlur={(e) => handleEdit(e.target.value, index, 'todo')} />
                ) : (
                  task
                )}
              </div>
            ))}
          </div>
          <div className="kanban-column">
            <h2>Doing</h2>
            {tasks.doing.map((task, index) => (
              <div key={index} className="task-item" onClick={() => handleClick(task, index, 'doing')}>
                {editing && editing.task === task && editing.index === index && editing.status === 'doing' ? (
                  <input type="text" defaultValue={task} onBlur={(e) => handleEdit(e.target.value, index, 'doing')} />
                ) : (
                  task
                )}
              </div>
            ))}
          </div>
          <div className="kanban-column">
            <h2>Done</h2>
            {tasks.done.map((task, index) => (
              <div key={index} className="task-item" onClick={() => handleClick(task, index, 'done')}>
                {editing && editing.task === task && editing.index === index && editing.status === 'done' ? (
                  <input type="text" defaultValue={task} onBlur={(e) => handleEdit(e.target.value, index, 'done')} />
                ) : (
                  task
                )}
              </div>
            ))}
          </div>
          <div className="kanban-column">
            <h2>Dropped</h2>
            {tasks.dropped.map((task, index) => (
              <div key={index} className="task-item" onClick={() => handleClick(task, index, 'dropped')}>
                {editing && editing.task === task && editing.index === index && editing.status === 'dropped' ? (
                  <input type="text" defaultValue={task} onBlur={(e) => handleEdit(e.target.value, index, 'dropped')} />
                ) : (
                  task
                )}
              </div>
            ))}
          </div>
    </div>
  );
}

export default App;
