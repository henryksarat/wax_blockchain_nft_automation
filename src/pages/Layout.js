import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/GoldmandGamePage">Goldmand Game</Link>
          </li>
          <li>
            <Link to="/FarmingTalesPage">Farming Tales Game</Link>
          </li>
          <li>
            <Link to="/Team">Team</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;