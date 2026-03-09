import { NavLink, useLocation } from "react-router-dom"

const scrollTop = () => window.scrollTo({ top: 0, behavior: "instant" })

function Navbar() {
  const location = useLocation()
  const isPersonal = location.pathname === "/personal"

  return (
    <nav className="navbar">
      <div className={`nav-container${isPersonal ? " nav-personal" : ""}`}>
        <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""} onClick={scrollTop}>
          Professional
        </NavLink>
        <NavLink to="/personal" className={({ isActive }) => isActive ? "active" : ""} onClick={scrollTop}>
          Personal
        </NavLink>
      </div>
    </nav>
  )
}

export default Navbar