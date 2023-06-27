import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Preview from "./pages/Preview";
import NotFound404 from "./pages/NotFound404";
import Layout from "./pages/Layout";

function App() {
  return (
    <div>
      <Routes>
        <Route path="*" element={<NotFound404 />} />
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Layout><Create /></Layout>} />
        <Route path="/create/preview" element={<Layout><Preview /></Layout>} />
      </Routes>
    </div>
  );
}

export default App;
