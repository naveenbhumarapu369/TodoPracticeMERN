import { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";
const api = import.meta.env.VITE_API;
export default function Reg(){
    let [user,setUser] = useState("");
    let [pass,setPass] = useState("");
    const navi = useNavigate();
    function handUsr(e){
        setUser(e.target.value)
    }
    function handPass(e){
        setPass(e.target.value)
    }
    async function handSub(e){
        e.preventDefault();
        const resp = await axios.post(api+"users/reg",{
            name:user,
            pass : pass
        })
        console.log(resp.data);
        navi("/login");
    }
    return(
        <>
            <form onSubmit={handSub}>
                UserName : <input type="text" onChange={handUsr} value={user} />
                Password : <input type="password" onChange={handPass} value={pass}/>
                <button>sub</button>
            </form>
        </>
    )
}