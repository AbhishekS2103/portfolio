import { Routes, Route, useLocation } from "react-router-dom"
import Navbar          from "./components/Navbar"
import DotGrid         from "./components/DotGrid"
import ScrollProgress  from "./components/ScrollProgress"
import NeuralCanvas   from "./components/NeuralCanvas"
import PageTransition  from "./components/PageTransition"
import Professional    from "./pages/Professional"
import Personal        from "./pages/Personal"

function App() {
  const location = useLocation()
  const isProfessional = location.pathname === "/"
  return (
    <>
      {/* Global effects */}
      <ScrollProgress />
      {isProfessional && <NeuralCanvas />}
      <DotGrid />
      <div className="ambient" />
      <div className="ambient-2" />

      <Navbar />

      <PageTransition>
        <Routes>
          <Route path="/"         element={<Professional />} />
          <Route path="/personal" element={<Personal />} />
        </Routes>
      </PageTransition>
    </>
  )
}

export default App