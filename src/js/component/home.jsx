import React, { useState, useEffect } from "react";

const TodoList = () => {
  const [inputValue, setInputValue] = useState("");
  const [list, setList] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json())
      .then((data) => setList(data))
      .catch((error) => console.log(error));
  };

  const addTask = (task) => {
    const updatedTodos = [...list, task];
    setList(updatedTodos);
    syncTasksWithServer(updatedTodos, "POST");
  };

  const syncTasksWithServer = (updatedTodos, method) => {
    fetch("https://jsonplaceholder.typicode.com/todos", {
      method: method,
      body: JSON.stringify(updatedTodos),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  };

  const addTaskHandler = () => {
    if (inputValue.trim() !== "") {
      const newTask = {
        title: inputValue,
        completed: false,
      };
      addTask(newTask);
      setInputValue("");
    }
  };

  const handleEnterKey = (event) => {
    if (event.key === "Enter") {
      addTaskHandler();
    }
  };

  const deleteTaskHandler = (taskId) => {
    const updatedTodos = list.filter((task) => task.id !== taskId);
    setList(updatedTodos);
    syncTasksWithServer(updatedTodos, "DELETE");
  };

  const deleteAllTasksHandler = () => {
    const updatedTodos = [];
    setList(updatedTodos);
    syncTasksWithServer(updatedTodos, "DELETE");
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
