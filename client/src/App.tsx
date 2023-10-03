import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Preview from "./pages/Preview";
import NotFound from "./pages/NotFound";
import Layout from "./pages/Layout";
import Results from "./pages/Results";
import MyTests from "./pages/MyTests";
import CollabTests from "./pages/CollabTests";
import { useEffect} from "react";
import { useThemeStore } from "./store/themeStore";
import Schedule from "./pages/Schedule";
import RouteGuard from "./components/RouteGuard";

function App() {
  const {theme} = useThemeStore();

  useEffect(() => {
    // On page load or when changing themes, add inline in `head` to avoid FOUC
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Layout><Create/></Layout>} />
        <Route path="/create/:id" element={<Layout><Create/></Layout>}/>
        <Route path="/create/preview" element={<Layout><Preview /></Layout>} />
        <Route path="/create/preview/results" element={<Layout><Results/></Layout>}/>
        <Route path="/tests/:id" element={<Layout><MyTests/></Layout>}/>
        <Route path="/collaborations/:id" element={<Layout><CollabTests/></Layout>}/>
        <Route path="/solve/:id" element={<Preview/>}/>
        <Route path="/solve/results" element={<Results/>}/>
        <Route path="/schedule" element={<Layout><Schedule/></Layout>}/>
      </Routes>
    </div>
  );
}

export default App;
