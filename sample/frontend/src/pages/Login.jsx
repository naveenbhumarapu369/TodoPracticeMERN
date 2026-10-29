import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom";
const api = import.meta.env.VITE_API;
export default function Login(){
    const navi = useNavigate()
    let [uName,setuName] = useState("")
    let [pass,setPass] = useState("")
    function handU(e){
        setuName(e.target.value);
    }
    function handP(e){
        setPass(e.target.value);
    }
    async function handSub(e){
        e.preventDefault()
        const resp = await axios.post(api+"users/login",{
            name : uName,
            pass : pass
        })
        const x = resp.data
        if(x.msg=="Invalid Cridentials" || x.msg=="Login failed"){
            return navi("/login")
        }
        console.log("from login"+ x)
        localStorage.setItem("token","Bearer "+x.token);
        navi("/profile")
    }
    return(
        <>
            <form onSubmit={handSub}>
                uName : <input type="text" id="nme" value = {uName} onChange={handU}/>
                PassWord: <input type="password" id="pass" value={pass} onChange={handP}/>
                <button>login</button>
            </form>
        </>
    )
}