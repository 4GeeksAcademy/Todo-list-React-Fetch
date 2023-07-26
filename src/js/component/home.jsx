import React, { useState, useEffect } from "react";

const TodoList = () => { 
  const [inputValue, setInputValue] = useState(""); // input value
  const [list, setList] = useState([]); // list of tasks
 
  useEffect(() => { 
    fetchTasks(); // fetch tasks from server
  }, []);

  const fetchTasks = () => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json()) // convert response to json
      .then((data) => setList(data)) // set list with data from server
      .catch((error) => console.log(error)); // catch errors
  };
  // addTaskHandler is called when the user clicks on the Add Task button
  const addTaskHandler = () => {
    if (inputValue.trim() !== "") { // check if input value is not empty
      const newTask = { // create new task object
        id: Date.now(), // generate unique id
        title: inputValue, // get input value
        completed: false, // set completed to false
      };
      const updatedTodos = [...list, newTask]; // add new task to list
      setList(updatedTodos); // update list
      setInputValue(""); // clear input value
      syncTasksWithServer(newTask, "POST"); // use POST method to add new task to server
    }
  };
  // use ENTET key to add new task
    const handleEnterKey = (event) => {
    if (event.key === "Enter") {
      addTaskHandler();
    }
  };

  const deleteTaskHandler = (taskId) => {
    const updatedTodos = list.filter((task) => task.id !== taskId);
    setList(updatedTodos);
    syncTasksWithServer(taskId, "DELETE");
  };

  const deleteAllTasksHandler = () => {
    setList([]);
    syncTasksWithServer(list.map((task) => task.id), "DELETE");
  };

  const syncTasksWithServer = (taskId, method) => {
    fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  };

  return (
    <div className="container">
      <h1 className="text-center mt-5">To-Do List</h1>
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="card">
            <div className="card-body">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter new task..."
                  onKeyDown={handleEnterKey}
                />
              </div>
              <button onClick={addTaskHandler} className="btn btn-sm btn-primary">
                Add Task
              </button>
              <button onClick={deleteAllTasksHandler} className="btn btn-sm btn-danger ml-2">
                Delete All Tasks
              </button>
              <ul className="list-group mt-3">
                {list.map((task) => (
                  <li key={task.id} className="list-group-item">
                    {task.title}
                    <button
                      onClick={() => deleteTaskHandler(task.id)}
                      className="btn btn-sm btn-danger float-right"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
