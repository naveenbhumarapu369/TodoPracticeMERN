import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const api = import.meta.env.VITE_API;
export default function AddTodo(){
    const [lod,setLod] = useState(true)
    const [title,setTitle] = useState("");
    const [id,setId] = useState(0);
    const navi = useNavigate();
    async function handSub(e){
        e.preventDefault()
        setLod(false)
        // const res = await fetch(api,{
        //     method:"post",
        //     headers:{
        //         "Content-Type":"application/json"
        //     },
        //     body:JSON.stringify({
        //         title:title
        //     })
        // })
        const token = localStorage.getItem("token");
        const resp = await axios.post(api, {
            id: id,
            title: title
        }, {
            headers: { Authorization: token }
        });
        setLod(true);
        console.log(resp.data);
        setTitle("");
        navi("/todos");
    }
    function handCh(e){
        setTitle(e.target.value);
    }
    function handChId(e){
        setId(e.target.value);
    }
    if(!lod){
        return(
            <>
                <h1>Loding.......</h1>
            </>
        )
    }
    return(
        <div>
            <h1> add todo</h1>
            <form onSubmit={(e)=>(handSub(e))}>
                <input type="text" id = 'tit' value={title} onChange={handCh}/>
                <input type="Number" id = 'id' value={id} onChange={handChId}/>
                <button>sub</button>
            </form>
        </div>
    )
}