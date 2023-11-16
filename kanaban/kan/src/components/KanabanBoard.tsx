import PlusIcon from "../icons/PlusIcon";
import { useMemo, useState, useEffect } from "react";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import axios from "axios";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

const API_BASE_URL = "http://localhost:8888";
const defaultCols: Column[] = [
  {
    id: "1",
    title: "Todo",
  },
  {
    id: "2",
    title: "Work in progress",
  },
  {
    id: "3",
    title: "Done",
  },
];

const defaultTasks: Task[] = [];

function KanbanBoard() {
  const [refreshPage, setRefreshPage] = useState(false);

  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useState<Task[]>(defaultTasks);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  useEffect(() => {
    defaultCols.forEach((column) => {
      axios.post(`${API_BASE_URL}/columns`, column)
        .then((response) => {
          console.log('Column created:', response.data);
        })
        .catch((error) => {
          console.error("Error creating column:", error);
        });
    });
  }, []);

   const loadFile=()=>{
    axios.get(`${API_BASE_URL}/tasks`)
      .then((response) => {
        console.log('Fetched tasks:', response.data);
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
   }
  useEffect(() => {
    // Fetch tasks from the backend
    loadFile();

    // Fetch columns from the backend
    axios.get(`${API_BASE_URL}/columns`)
      .then((response) => {
        setColumns(response.data);
      })
      .catch((error) => {
        console.error("Error fetching columns:", error);
      });
  }, []);

  

  const createTask = async (columnId: Id) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, {
        columnId: parseInt(columnId, 10),
        content: `Task ${tasks.length + 1}`,
      });

      if (response.status === 201) {
        const createdTask = response.data;
        setTasks([...tasks, createdTask]);
        loadFile()
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <div
      className="
        m-auto
        flex
        min-h-screen
        w-full
        items-center
        overflow-x-auto
        overflow-y-hidden
        px-[40px]
    "
    >
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
            className="
      h-[60px]
      w-[350px]
      min-w-[350px]
      cursor-pointer
      rounded-lg
      bg-mainBackgroundColor
      border-2
      border-columnBackgroundColor
      p-4
      ring-rose-500
      hover:ring-2
      flex
      gap-2
      "
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

  function deleteTask(id: Id) {
    axios.delete(`${API_BASE_URL}/tasks/${id}`)
      .then(() => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  }

  function updateTask(id: Id, content: string) {
    axios.put(`${API_BASE_URL}/tasks/${id}`, { content })
      .then((response) => {
        setTasks((prevTasks) => prevTasks.map((task) => task.id === id ? {...task, content: response.data.content} : task));
      })
      .catch((error) => {
        console.error("Error updating task:", error);
      });
  }

  function createNewColumn() {
    const columnToAdd = { title: `Column ${columns.length + 1}` };
    axios.post(`${API_BASE_URL}/columns`, columnToAdd)
      .then((response) => {
        setColumns((prevColumns) => [...prevColumns, response.data]);
      })
      .catch((error) => {
        console.error("Error creating column:", error);
      });
  }

  function deleteColumn(id: Id) {
    axios.delete(`${API_BASE_URL}/columns/${id}`)
      .then(() => {
        setColumns((prevColumns) => prevColumns.filter((column) => column.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting column:", error);
      });
  }

  function updateColumn(id: Id, title: string) {
    axios.put(`${API_BASE_URL}/columns/${id}`, { title })
      .then((response) => {
        setColumns((prevColumns) => prevColumns.map((column) => column.id === id ? response.data : column));
      })
      .catch((error) => {
        console.error("Error updating column:", error);
      });
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
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

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    console.log("DRAG END");

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

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // I'm dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          // Make a PUT request to update the task in the backend
          axios.put(`${API_BASE_URL}/tasks/${activeId}`, tasks[activeIndex]);
          return arrayMove(tasks, activeIndex, overIndex - 1);
          setRefreshPage(true);
          

        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // I'm dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId.toString();
        // Make a PUT request to update the task in the backend
        axios.put(`${API_BASE_URL}/tasks/${activeId}`, tasks[activeIndex]);
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
        setRefreshPage(true);

      });
    }
  }
}



export default KanbanBoard;
