import React, { useState, useEffect } from "react";

const TodoList = () => {
  const [inputValue, setInputValue] = useState(""); // State for the input value
  const [list, setList] = useState([]); // State for the list of tasks

  useEffect(() => { // Fetch the tasks from the server
    fetchTasks(); 
  }, []);
 
  const fetchTasks = () => {
    fetch("https://assets.breatheco.de/apis/fake/todos/user/alesanchezr")
      .then((response) => response.json()) // Convert the response to JSON
      .then((data) => setList(data)) // Set the list with the data from the server
      .catch((error) => console.log(error)); // Catch any errors
  };

  const syncTasksWithServer = (updatedTodos, method) => {
    fetch("https://assets.breatheco.de/apis/fake/todos/user/alesanchezr", {
      method: method, // a type of method
      body: JSON.stringify(updatedTodos), 
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  };
  // update on the frontend and synchronize with the server. 
  const Input = (task) => { 
    const updatedTodos = [...list, task]; // Add the new task to the list
    setList(updatedTodos); // Update the list
    syncTasksWithServer(updatedTodos, "PUT"); // Update the server with method PUT
  };
  // Function to add a new task from user input
  const AddTask = () => { 
    if (inputValue.trim() !== "") { // Check if the input value is not empty
      const newTask = { // Create a new task
        label: inputValue, // Set the label of the task
        done: false, // Set the task as not done
      };
      Input(newTask); // Add the new task to the list
      setInputValue(""); // Reset the input value
    }
  };

  const EnterKey = (event) => { // Function to add a new task by pressing Enter key
    if (event.key === "Enter") {
      AddTask();
    }
  };
  // delete a task from the list
  const DeleteTheTask = (taskIndex) => {
    const updatedTodos = list.filter((_, index) => index !== taskIndex);
    setList(updatedTodos);
    syncTasksWithServer(updatedTodos, "DELETE");
  };
  // delete all tasks from the list
  const DeleteAllTasks = () => {
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
                  onKeyDown={EnterKey}
                />
              </div>
              <button
                onClick={AddTask}
                className="btn btn-sm btn-primary"
              >
                Add Task
              </button>
              <button
                onClick={DeleteAllTasks}
                className="btn btn-sm btn-danger ml-2"
              >
                Delete All Tasks
              </button>
              <ul className="list-group mt-3">
                {list.map((task, index) => (
                  <li key={index} className="list-group-item">
                    {task.label}
                    <button
                      onClick={() => DeleteTheTask(index)}
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
