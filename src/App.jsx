import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useQuery, useApolloClient } from "@apollo/client";

import { GET_CURRENT_USER } from "../graphql/queries";
import Header from "./components/Header";
import ProtectedRoutes from "./components/ProtectedRoutes";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Footer from "./components/Footer";

const App = () => {
  const client = useApolloClient();
  const { data, error, loading } = useQuery(GET_CURRENT_USER);
  const navigate = useNavigate();
  console.log("Current user:", data);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem("messaging-app-user-token");
    client.resetStore();
    navigate("/signin");
  };

  return (
    <>
      <Header user={data?.me} />
      <main className="flex-grow flex">
        <Routes>
          <Route path="/" element={<Navigate to="/chats" replace />} />
          <Route
            path="/signin"
            element={data?.me ? <Navigate to="/chats" replace /> : <SignIn />}
          />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<ProtectedRoutes user={data?.me} />}>
            <Route path="/chats" element={<div>Chats</div>} />
            <Route path="/chats/:id" element={<div>Individual Chat</div>} />
            <Route path="/contacts" element={<div>Contacts</div>} />
            <Route
              path="/contacts/:id"
              element={<div>Individual Contact</div>}
            />
            <Route path="/profile" element={<div>Profile</div>} />
            <Route path="/settings" element={<div>Settings</div>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {data?.me && <button onClick={handleLogout}>Logout</button>}
      <Footer />
    </>
  );
};

export default App;
