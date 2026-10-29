
// import Navbar from '../components/Navbar';
import { useNavigate } from "react-router-dom";
function Home() {
  const navi = useNavigate()
  function handSignUp(){
    navi("/reg")
  }
  function handSignIn(){
    navi("/login")
  }
  return (
    <div>
      {/* <Navbar/> */}
      <h1>Todo App</h1>
      <p>Welcome to my Todo application.</p>
      <button onClick={handSignUp}>Sign up</button>
      <button onClick={handSignIn}>Sign in</button>
    </div>
  );
}

export default Home;