import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router";
import { useQuery } from "@apollo/client";
import { AnimatePresence, motion } from "framer-motion";

import ModalProvider from "./components/ModalProvider";
import { CURRENT_USER } from "./graphql/queries";
import LoadingPage from "./components/LoadingPage";
import Header from "./components/Header";
import Home from "./components/Home";
import ProtectedRoutes from "./components/ProtectedRoutes";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ChatsMenu from "./components/ChatsMenu";
import ContactsMenu from "./components/ContactsMenu";

import Chats from "./components/Chats/Chats";
import Chat from "./components/Chat/Chat";
import NewChat from "./components/NewChat/NewChat";
import Contacts from "./components/Contacts/Contacts";
import Contact from "./components/Contact";
import Profile from "./components/Profile";
import Settings from "./components/Settings/Settings";

import NewChatDropDownBox from "./components/Modals/NewChatDropDownBox";
import NewPrivateChatModal from "./components/Modals/NewPrivateChatModal/NewPrivateChatModal";
import NewGroupChatModal from "./components/Modals/NewGroupChatModal";
import AddNewContactsModal from "./components/Modals/AddNewContactsModal";

const App = () => {
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState(
    location.pathname.replace("/", "")
  );
  const [activeListMenuComponent, setActiveListMenuComponent] =
    useState("chats");
  const [activeChatOrContactId, setActiveChatOrContactId] = useState(null);
  const [showNewChatDropdownBox, setShowNewChatDropdownBox] = useState(false);
  const [showNewPrivateChatModal, setShowNewPrivateChatModal] = useState(false);
  const [showNewGroupChatModal, setShowNewGroupChatModal] = useState(false);
  const [showAddNewContactsModal, setShowAddNewContactsModal] = useState(false);

  const { data, loading } = useQuery(CURRENT_USER);

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
    setShowAddNewContactsModal(true);
  };

  return (
    <ModalProvider>
      <AnimatePresence>
        {loading ? (
          <LoadingPage key="loading-page" />
        ) : (
          <motion.div
            key="front-page"
            className="h-screen flex flex-col bg-light dark:bg-dark"
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
                    <SignIn setActiveMenuItem={setActiveMenuItem} />
                  )
                }
              />
              <Route
                path="/signup"
                element={
                  data?.me ? (
                    <Navigate to="/chats" replace />
                  ) : (
                    <SignUp setActiveMenuItem={setActiveMenuItem} />
                  )
                }
              />
              <Route element={<ProtectedRoutes user={data?.me} />}>
                <Route
                  path="/"
                  element={
                    <Home
                      user={data?.me}
                      activeMenuItem={activeMenuItem}
                      setActiveMenuItem={setActiveMenuItem}
                      setActiveListMenuComponent={setActiveListMenuComponent}
                      setActiveChatOrContactId={setActiveChatOrContactId}
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
                            activeChatOrContactId={activeChatOrContactId}
                            setActiveChatOrContactId={setActiveChatOrContactId}
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
                        setActiveMenuItem={setActiveMenuItem}
                        setActiveChatOrContactId={setActiveChatOrContactId}
                        menuComponent={
                          <ChatsMenu
                            user={data?.me}
                            handleClickNewChat={handleClickNewChat}
                            activeChatOrContactId={activeChatOrContactId}
                            setActiveChatOrContactId={setActiveChatOrContactId}
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
                        setActiveMenuItem={setActiveMenuItem}
                        menuComponent={
                          <ChatsMenu
                            user={data?.me}
                            handleClickNewChat={handleClickNewChat}
                            activeChatOrContactId={activeChatOrContactId}
                            setActiveChatOrContactId={setActiveChatOrContactId}
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
                            activeChatOrContactId={activeChatOrContactId}
                            setActiveChatOrContactId={setActiveChatOrContactId}
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
                        setActiveMenuItem={setActiveMenuItem}
                        menuComponent={
                          <ContactsMenu
                            user={data?.me}
                            handleClickNewContact={handleClickNewContact}
                            activeChatOrContactId={activeChatOrContactId}
                            setActiveChatOrContactId={setActiveChatOrContactId}
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
                          activeListMenuComponent === "chats" ? (
                            <ChatsMenu
                              user={data?.me}
                              handleClickNewChat={handleClickNewChat}
                              activeChatOrContactId={activeChatOrContactId}
                              setActiveChatOrContactId={
                                setActiveChatOrContactId
                              }
                            />
                          ) : (
                            <ContactsMenu
                              user={data?.me}
                              handleClickNewContact={handleClickNewContact}
                              activeChatOrContactId={activeChatOrContactId}
                              setActiveChatOrContactId={
                                setActiveChatOrContactId
                              }
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
                          activeListMenuComponent === "chats" ? (
                            <ChatsMenu
                              user={data?.me}
                              handleClickNewChat={handleClickNewChat}
                              activeChatOrContactId={activeChatOrContactId}
                              setActiveChatOrContactId={
                                setActiveChatOrContactId
                              }
                            />
                          ) : (
                            <ContactsMenu
                              user={data?.me}
                              handleClickNewContact={handleClickNewContact}
                              activeChatOrContactId={activeChatOrContactId}
                              setActiveChatOrContactId={
                                setActiveChatOrContactId
                              }
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
            <AnimatePresence>
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
              {showAddNewContactsModal && (
                <AddNewContactsModal
                  user={data?.me}
                  setShowAddNewContactsModal={setShowAddNewContactsModal}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalProvider>
  );
};

export default App;
