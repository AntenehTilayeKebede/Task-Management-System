import React, { useState } from 'react';
import { Column, Id, Task } from '../types';
import TrashIcon from '../icons/TrashIcon';
import PlusIcon from '../icons/PlusIcon';
import TaskCard from './TaskCard';

interface Props {
  
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  updateTask: (id: Id, content: string) => void;
  deleteTask: (id: Id) => void;
  tasks: Task[];
}

function ColumnContainer({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}: Props) {
  console.log(tasks); // Debugging log
  console.log(tasks.filter(task => task.columnId === column.id));

  const [editMode, setEditMode] = useState(false);

  const editColumnTitle = (newTitle: string) => {
    updateColumn(column.id, newTitle);
  };

  const removeColumn = () => {
    deleteColumn(column.id);
  };

  const removeTask = (taskId: string) => {
    deleteTask(taskId);
  };


  return (
    <div className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col">
      <div className="bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full">
            0
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-black focus:border-rose-500 border rounded outline-none px-2"
              value={column.title}
              onChange={(e) => editColumnTitle(e.target.value)}
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return;
                setEditMode(false);
              }}
            />
          )}
        </div>

        <button
          onClick={removeColumn}
          className="stroke-gray-500 hover:stroke-white hover-bg-columnBackgroundColor rounded px-1 py-2"
        >
          <TrashIcon />
        </button>
      </div>

      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        
      
        {tasks.filter((task) => task.columnId === column.id).map((task) => {
  console.log(task); // Log the rendered task
  return (
    <TaskCard
      key={task.id}
      task={task}
      deleteTask={deleteTask}
      updateTask={updateTask}
    />
  );
})}
      </div>
      <button
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover-bg-mainBackgroundColor hover-text-rose-500 active-bg-black"
        onClick={() => {
          console.log('Add button clicked for column:', column.id);
          createTask(column.id);
        }}
      >
        <PlusIcon />
        Add task
      </button>
    </div>
  );
}

export default ColumnContainer;