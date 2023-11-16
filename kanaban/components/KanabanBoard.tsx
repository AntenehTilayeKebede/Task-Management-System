import axios from 'axios';
import React, { useState, useMemo ,useEffect} from 'react';
import { Column, Id, Task } from '../types';
import ColumnContainer from './ColumnContainer';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import TaskCard from './TaskCard';
import PlusIcon from '../icons/PlusIcon'; // Import your PlusIcon

// Define the base URL for your backend server.
const apiUrl = 'http://localhost:8888';

const defaultCols: Column[] = [
  {
    id: '1',
    title: 'Todo',
    description: 'doing',
  },
  {
    id: '2',
    title: 'Work in progress',
    description: 'done',
  },
  {
    id: '3',
    title: 'Done',
    description: '',
  },
];

const defaultTasks: Task[] = [];

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useState<Task[]>(defaultTasks);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
  
  function createTask(columnId: Id) {
    console.log('Creating task for column:', columnId);
    const newTask = {
      columnId,
      content: '',
    };
  
    axios
      .post(`${apiUrl}/tasks`, newTask)
      .then((response) => {
        const createdTask = response.data;
        setTasks([...tasks, createdTask]);
        console.log(tasks);
      })
      .catch((error) => {
        console.error('Error creating task:', error);
      });
  }
  
  useEffect(() => {
    axios.get(`${apiUrl}/tasks?columnId=${columnsId}`)
    .then((response) => {
      const fetchedTasks = response.data;
      setTasks(fetchedTasks);
    })
    .catch((error) => {
      console.error(`Error fetching tasks for column ${columnsId}:`, error);
    });   
  }, []); // Empty dependency array means this effect runs once when the component mounts
  function deleteTask(id: Id) {
    axios
      .delete(`${apiUrl}/tasks/${id}`)
      .then(() => {
        const newTasks = tasks.filter((task) => task.id !== id);
        setTasks(newTasks);
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
      });
  }

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId().toString(),
      title: `Column ${columns.length + 1}`,
      description: '',
    };

    axios
      .post(`${apiUrl}/columns`, columnToAdd)
      .then((response) => {
        const addedColumn = response.data;
        setColumns([...columns, addedColumn]);
      })
      .catch((error) => {
        console.error('Error creating column:', error);
      });
  }

  function deleteColumn(id: Id) {
    axios
      .delete(`${apiUrl}/columns/${id}`)
      .then(() => {
        const filteredColumns = columns.filter((col) => col.id !== id);
        setColumns(filteredColumns);

        const newTasks = tasks.filter((t) => t.columnId !== id);
        setTasks(newTasks);
      })
      .catch((error) => {
        console.error('Error deleting column:', error);
      });
  }

  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  }

  function updateTask(id: Id, content: string) {
    console.log('Updating task:', id, 'with content:', content); // Add this line
    const updatedTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });
  
    setTasks(updatedTasks);
  }
  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === 'Column';
    if (!isActiveAColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === 'Task';
    const isOverATask = over.data.current?.type === 'Task';

    if (!isActiveATask) return;

    // I'm dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        // Ensure that both columnId properties are strings
        const activeTask = tasks[activeIndex];
        const overTask = tasks[overIndex];

        // Assuming UniqueIdentifier is a type that can be converted to a string
        const activeTaskColumnId = activeTask.columnId.toString();
        const overTaskColumnId = overTask.columnId.toString();

        if (activeTaskColumnId !== overTaskColumnId) {
          tasks[activeIndex].columnId = overTaskColumnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
  }

  function generateId() {
    return Math.floor(Math.random() * 10001);
  }

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => {
              createNewColumn();
            }}
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2"
          >
            <PlusIcon />
            Add Column
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
