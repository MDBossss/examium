import {Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import Create from "./pages/Create";

function App() {

  return (
    <div className="flex">
    <Sidebar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/create" element={<Create/>}/>
    </Routes>
    </div>
  )
}

export default App
