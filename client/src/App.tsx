import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Preview from "./pages/Preview";
import NotFound from "./pages/NotFound";
import Layout from "./pages/Layout";
import Results from "./pages/Results";

function App() {
  return (
    <div>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Layout><Create /></Layout>} />
        <Route path="/create/preview" element={<Layout><Preview /></Layout>} />
        <Route path="/create/preview/results" element={<Layout><Results/></Layout>}/>
      </Routes>
    </div>
  );
}

export default App;
