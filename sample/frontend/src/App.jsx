
import {BrowserRouter,Routes,Route,Link} from "react-router-dom";
import Home from './pages/Home'
import Todos from './pages/Todos'
import TodoDtl from './pages/TodoDtl'
import AddTodo from './pages/AddTodo'
import Login from './pages/Login';
import Profile from "./pages/Profile";
import Protect from "./pages/Protect";
import Reg from "./pages/Reg";
function App() {
    return(
      
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/reg" element={<Reg/>}/>
          <Route path="/" element={<Home/>}/>
          <Route path="/profile" element={<Protect><Profile/></Protect>}/>
          <Route path="/todos" element={<Protect><Todos/></Protect>}/>
          <Route path="/todo/todoDtl/:id" element={<Protect><TodoDtl/></Protect>}/>
          <Route path="/add" element={<Protect><AddTodo/></Protect>}/>
        </Routes>
      </BrowserRouter>
    )
  

}

export default App;