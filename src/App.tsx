import {Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar/Navbar";
import NewTest from "./pages/NewTest";

function App() {

  return (
    <div className="flex">
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/create" element={<NewTest/>}/>
    </Routes>
    </div>
  )
}

export default App
