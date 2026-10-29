import { useState,useEffect } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import axios from 'axios';
const api = import.meta.env.VITE_API;
export default function TodoDtl(){
    const [todo,setTodo] = useState(null);
    let {id} = useParams();
    const navi = useNavigate();
    useEffect(()=>{
        const token = localStorage.getItem("token");
        fetch(api+id, {
            headers: { Authorization: token }
        }).
        then(res=>res.json()).then(data=>{
            setTodo(data);
        })
    },[id])
    async function handClk(){
        const token = localStorage.getItem("token");
        const resp = await axios.put(api+""+id,{
                id:todo.id,
                completed:!todo.completed,
                title:todo.title
        }, {
            headers: { Authorization: token }
        })
        setTodo(resp.data);
    }

    async function handDel() {
        const token = localStorage.getItem("token");
        const resp = await axios.delete(api+""+id,{
            headers: { Authorization: token }
        })
        console.log(resp.data);
        navi("/todos");
    }

    if (todo === null) { return <h2>Loading...</h2>; }

    return(
        <>
            <h1>Todo Dtls</h1>
            <h2>id = {todo.id}</h2>
            <h2>title = {todo.title}</h2>
            <h2 onClick={handClk}>status = {todo.completed?"Completed":"Not"}</h2>
            <h2 onClick={handDel}>Delete</h2>
        </>
    )
}