import {Link} from "react-router-dom";
export default function Navbar(){
    return(
        <nav>
            {/* <Link to="/profile/home">Home</Link> {" | "} */}
            <Link to="/todos">Todos</Link>{" | "}
            <Link to="/add">Add</Link>{" | "}
            
        </nav>
    )
}