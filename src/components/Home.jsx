import { Outlet } from "react-router-dom";

import Menu from "./Menu";

const Home = ({ user, activePath, setActivePath, setActiveMenuComponent }) => {
  return (
    <main className="flex-grow flex">
      {user && (
        <Menu
          activePath={activePath}
          setActivePath={setActivePath}
          setActiveMenuComponent={setActiveMenuComponent}
        />
      )}
      <div className="flex-grow flex">
        <Outlet />
      </div>
    </main>
  );
};

export default Home;
