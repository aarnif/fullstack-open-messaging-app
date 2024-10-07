import { Outlet } from "react-router-dom";

import Menu from "./Menu";

const Home = ({ user }) => {
  return (
    <main className="flex-grow flex">
      {user && <Menu />}
      <div className="flex-grow flex">
        <Outlet />
      </div>
    </main>
  );
};

export default Home;
