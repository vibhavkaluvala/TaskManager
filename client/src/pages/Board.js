import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AddTask from "../components/AddTask";

function Board() {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from the backend on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tasks");
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, []);

  // Handle drag-and-drop functionality
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(source.index, 1);
    movedTask.status = destination.droppableId;
    reorderedTasks.splice(destination.index, 0, movedTask);

    // Update task status in the backend
    try {
      await axios.put(`http://localhost:5000/api/tasks/${movedTask._id}`, movedTask);
      setTasks(reorderedTasks);
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  return (
    <div className="board">
      {/* AddTask Component */}
      <AddTask onTaskAdded={(newTask) => setTasks([...tasks, newTask])} />

      {/* Drag and Drop Context */}
      <DragDropContext onDragEnd={onDragEnd}>
        {["To Do", "In Progress", "Completed"].map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="column"
              >
                <h2>{status}</h2>
                {tasks
                  .filter((task) => task.status === status)
                  .map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="task"
                        >
                          {task.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
}

export default Board;