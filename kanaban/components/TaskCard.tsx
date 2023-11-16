import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import { Id, Task } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import Axios from 'axios'; // Make sure to import Axios



interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

function TaskCard({ task, deleteTask, updateTask }: Props) {
  console.log(task);
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const {setNodeRef,attributes,listeners,transform,transition,isDragging}= useSortable({
    id:task.id,
    data:{
        type:"Task",
        task,
    },
    disabled:editMode,
});

const style={
    transition,
    transform:CSS.Transform.toString(transform),
};

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };
   if(isDragging){
    return <div ref={setNodeRef} style={style} className="bg-[#0D1117] p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl  cursor-grab border-2 border-rose-500 relative task opacity-30"/>
   }
  const handleMouseEnter = () => {
    setMouseIsOver(true);
  };

   
  const handleMouseLeave = () => {
    setMouseIsOver(false);
  };

  if (editMode) {
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-[#0D1117] p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative">
        <textarea
          className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
          value={task.content}
          autoFocus
          placeholder="Task content here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
                toggleEditMode();
            }
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        ></textarea>

      





<p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">{task.content}</p>
<input
        value={task.content}
        onChange={(e) => updateTask(task.id, e.target.value)}
        className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap"
      />

      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={toggleEditMode}
      className="bg-[#0D1117] p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative task"
      onMouseEnter={()=>{
        setMouseIsOver(true);
      }}
      onMouseLeave={()=>{
        setMouseIsOver(false);
      }}
    >
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">{task.content}</p>
      {mouseIsOver && (
        <button
          onClick={() => {
            deleteTask(task.id);
          }}
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-[#161c22] p-2 rounded opacity-60 hover:opacity-100"
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
}

export default TaskCard;