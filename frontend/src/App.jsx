import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { AnimatePresence, motion } from "framer-motion";

import ConfirmModalProvider from "./components/ConfirmModalProvider";
import { CURRENT_USER } from "./graphql/queries";
import LoadingPage from "./components/LoadingPage";
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
import NewChat from "./components/NewChat/NewChat";
import Contacts from "./components/Contacts/Contacts";
import Contact from "./components/Contact/Contact";
import Profile from "./components/Profile/Profile";
import Settings from "./components/Settings/Settings";

import NewChatDropDownBox from "./components/Modals/NewChatDropDownBox";
import NewPrivateChatModal from "./components/Modals/NewPrivateChatModal/NewPrivateChatModal";
import NewGroupChatModal from "./components/Modals/NewGroupChatModal/NewGroupChatModal";
import NewContactModal from "./components/Modals/NewContactModal";

const App = () => {
  const [activePath, setActivePath] = useState("chats");
  const [activeMenuComponent, setActiveMenuComponent] = useState("chats");
  const [showNewChatDropdownBox, setShowNewChatDropdownBox] = useState(false);
  const [showNewPrivateChatModal, setShowNewPrivateChatModal] = useState(false);
  const [showNewGroupChatModal, setShowNewGroupChatModal] = useState(false);
  const [showNewContactModal, setShowNewContactModal] = useState(false);

  const { data, error, loading } = useQuery(CURRENT_USER);
  console.log("Current user:", data);

  useEffect(() => {
    const toggleDarkMode = () => {
      if (data?.me?.settings.theme === "dark") {
        document.documentElement.classList.add("dark");
      }
    };
    toggleDarkMode();
  }, [data]);

  const handleClickNewChat = () => {
    console.log("Clicked new chat");
    setShowNewChatDropdownBox(true);
  };

  const handleClickNewContact = () => {
    console.log("Clicked new contact");
    setShowNewContactModal(true);
  };

  return (
    <ConfirmModalProvider>
      <AnimatePresence>
        {loading ? (
          <LoadingPage key="loading-page" />
        ) : (
          <motion.div
            key="front-page"
            className="h-screen flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.5 } }}
          >
            <Header />
            <Routes>
              <Route path="/" element={<Navigate to="/chats" replace />} />
              <Route
                path="/signin"
                element={
                  data?.me ? (
                    <Navigate to="/chats" replace />
                  ) : (
                    <SignIn setActivePath={setActivePath} />
                  )
                }
              />
              <Route
                path="/signup"
                element={
                  data?.me ? <Navigate to="/chats" replace /> : <SignUp />
                }
              />
              <Route element={<ProtectedRoutes user={data?.me} />}>
                <Route
                  path="/"
                  element={
                    <Home
                      user={data?.me}
                      activePath={activePath}
                      setActivePath={setActivePath}
                      setActiveMenuComponent={setActiveMenuComponent}
                    />
                  }
                >
                  <Route
                    path="/chats"
                    element={
                      <Chats
                        user={data?.me}
                        menuComponent={
                          <ChatsMenu
                            user={data?.me}
                            handleClickNewChat={handleClickNewChat}
                          />
                        }
                      />
                    }
                  />
                  <Route
                    path="/chats/:id"
                    element={
                      <Chat
                        user={data?.me}
                        setActivePath={setActivePath}
                        menuComponent={
                          <ChatsMenu
                            user={data?.me}
                            handleClickNewChat={handleClickNewChat}
                          />
                        }
                      />
                    }
                  />
                  <Route
                    path="/chats/new"
                    element={
                      <NewChat
                        user={data?.me}
                        setActivePath={setActivePath}
                        menuComponent={
                          <ChatsMenu
                            user={data?.me}
                            handleClickNewChat={handleClickNewChat}
                          />
                        }
                      />
                    }
                  />
                  <Route
                    path="/contacts"
                    element={
                      <Contacts
                        menuComponent={
                          <ContactsMenu
                            user={data?.me}
                            handleClickNewContact={handleClickNewContact}
                          />
                        }
                      />
                    }
                  />
                  <Route
                    path="/contacts/:id"
                    element={
                      <Contact
                        user={data?.me}
                        setActivePath={setActivePath}
                        menuComponent={
                          <ContactsMenu
                            user={data?.me}
                            handleClickNewContact={handleClickNewContact}
                          />
                        }
                      />
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <Profile
                        user={data?.me}
                        menuComponent={
                          activeMenuComponent === "chats" ? (
                            <ChatsMenu
                              user={data?.me}
                              handleClickNewChat={handleClickNewChat}
                            />
                          ) : (
                            <ContactsMenu
                              user={data?.me}
                              handleClickNewContact={handleClickNewContact}
                            />
                          )
                        }
                      />
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <Settings
                        user={data?.me}
                        menuComponent={
                          activeMenuComponent === "chats" ? (
                            <ChatsMenu
                              user={data?.me}
                              handleClickNewChat={handleClickNewChat}
                            />
                          ) : (
                            <ContactsMenu
                              user={data?.me}
                              handleClickNewContact={handleClickNewContact}
                            />
                          )
                        }
                      />
                    }
                  />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            {showNewChatDropdownBox && (
              <NewChatDropDownBox
                setShowNewChatDropdownBox={setShowNewChatDropdownBox}
                setShowNewPrivateChatModal={setShowNewPrivateChatModal}
                setShowNewGroupChatModal={setShowNewGroupChatModal}
              />
            )}
            {showNewPrivateChatModal && (
              <NewPrivateChatModal
                user={data?.me}
                setShowNewPrivateChatModal={setShowNewPrivateChatModal}
              />
            )}
            {showNewGroupChatModal && (
              <NewGroupChatModal
                user={data?.me}
                setShowNewGroupChatModal={setShowNewGroupChatModal}
              />
            )}
            {showNewContactModal && (
              <NewContactModal
                user={data?.me}
                setShowNewContactModal={setShowNewContactModal}
              />
            )}
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </ConfirmModalProvider>
  );
};

export default App;
