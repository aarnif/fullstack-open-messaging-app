import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { GET_CURRENT_USER } from "../graphql/queries";
import Header from "./components/Header";
import Home from "./components/Home";
import ProtectedRoutes from "./components/ProtectedRoutes";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Footer from "./components/Footer";
import ChatsMenu from "./components/ChatsMenu";
import ContactsMenu from "./components/ContactsMenu";

import Chats from "./components/Chats/Chats";
import Chat from "./components/Chat/Chat";
import Contacts from "./components/Contacts/Contacts";
import Contact from "./components/Contact/Contact";
import Profile from "./components/Profile/Profile";

const App = () => {
  const [activeMenuComponent, setActiveMenuComponent] = useState("chats");
  const { data, error, loading } = useQuery(GET_CURRENT_USER);
  console.log("Current user:", data);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header user={data?.me} />
      <Routes>
        <Route path="/" element={<Navigate to="/chats" replace />} />
        <Route
          path="/signin"
          element={data?.me ? <Navigate to="/chats" replace /> : <SignIn />}
        />
        <Route
          path="/signup"
          element={data?.me ? <Navigate to="/chats" replace /> : <SignUp />}
        />
        <Route element={<ProtectedRoutes user={data?.me} />}>
          <Route
            path="/"
            element={
              <Home
                user={data?.me}
                setActiveMenuComponent={setActiveMenuComponent}
              />
            }
          >
            <Route path="/chats" element={<Chats user={data?.me} />} />
            <Route path="/chats/:id" element={<Chat user={data?.me} />} />
            <Route path="/contacts" element={<Contacts user={data?.me} />} />
            <Route path="/contacts/:id" element={<Contact user={data?.me} />} />
            <Route
              path="/profile"
              element={
                <Profile
                  user={data?.me}
                  menuComponent={
                    activeMenuComponent === "chats" ? (
                      <ChatsMenu user={data?.me} />
                    ) : (
                      <ContactsMenu user={data?.me} />
                    )
                  }
                />
              }
            />
            <Route path="/settings" element={<div>Settings</div>} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
