import { useState,useEffect } from "react";
import {Link} from 'react-router-dom';
const api = import.meta.env.VITE_API;
export default function Todos(){
    const [todos, setTodos] = useState([]);
    
  useEffect(()=>{
    const token = localStorage.getItem("token");
    fetch(api, {
      headers: { Authorization: token }
    }).then(response=>response.json()).then((data)=>{
      if (Array.isArray(data)) {
        setTodos(data);
      }
    }).catch(err => console.error(err));
  }, [])  
  
  return (
    <div>
      <h1>Todo App</h1>
      {
        todos.map(todo=>(
          <div key={todo.id}>
            <span><Link to={`/todo/todoDtl/${todo.id}`}>{todo.title}</Link></span>
            <span>___{todo.completed?"Completed":"Not Completed"}</span>
          </div>
        ))
      }
      <p>Total Todos: {todos.length}</p>
    </div>
  );
}

// function Todos() {
//   return (
//     <div>
//       <h1>All Todos</h1>
//     </div>
//   );
// }

// export default Todos;