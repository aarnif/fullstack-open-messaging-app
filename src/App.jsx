import { Routes, Route, Navigate } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { GET_CURRENT_USER } from "../graphql/queries";
import ProtectedRoutes from "./components/ProtectedRoutes";

const App = () => {
  const { data, error, loading } = useQuery(GET_CURRENT_USER);
  console.log("Current user:", data);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chats" replace />} />
      <Route path="/signin" element={<div>Sign In</div>} />
      <Route path="/signup" element={<div>Sign Up</div>} />
      <Route element={<ProtectedRoutes user={data?.me} />}>
        <Route path="/chats" element={<div>Chats</div>} />
        <Route path="/chats/:id" element={<div>Individual Chat</div>} />
        <Route path="/contacts" element={<div>Contacts</div>} />
        <Route path="/contacts/:id" element={<div>Individual Contact</div>} />
        <Route path="/profile" element={<div>Profile</div>} />
        <Route path="/settings" element={<div>Settings</div>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
