import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Projects from "./pages/Projects"
import Community from "./pages/Community"
import Pricing from "./pages/Pricing"
import Preview from "./pages/Preview"
import MyProjects from "./pages/MyProjects"


function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:projectId" element={<Projects />} />
        <Route path="/projects" element={<MyProjects />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/preview/:projectId" element={<Preview />} />
        <Route path="/community" element={<Community />} />
      </Routes>
    </>
  )
}

export default App
