import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router";
import { useQuery } from "@apollo/client";
import { AnimatePresence, motion } from "framer-motion";

import ModalProvider from "./components/ModalProvider";
import { CURRENT_USER } from "./graphql/queries";
import LoadingPage from "./components/LoadingPage";
import Home from "./components/Home";
import ProtectedRoutes from "./components/ProtectedRoutes";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Title from "./components/ui/Title";
import ListMenu from "./components/ui/ListMenu";

import ListPage from "./components/ListPage";
import Chat from "./components/Chat";
import Contact from "./components/Contact";
import Profile from "./components/Profile";
import Settings from "./components/Settings";

import NewChatDropDownBox from "./components/NewChatDropDownBox";
import NewChatModal from "./components/Modals/NewChatModal";
import AddNewContactsModal from "./components/Modals/AddNewContactsModal";

export const Header = () => {
  const location = useLocation();
  const condition =
    location.pathname !== "/signin" && location.pathname !== "/signup";
  return (
    <header
      data-testid="header"
      className={`py-2 w-full flex justify-center items-center ${
        condition && "bg-white shadow-lg dark:bg-slate-900"
      }`}
    >
      <Title variant="primary" testId="header-title" text="Messaging App" />
    </header>
  );
};

const App = () => {
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState(
    location.pathname.replace("/", "")
  );
  const [activeListMenuComponent, setActiveListMenuComponent] =
    useState("chats");
  const [activeChatOrContactId, setActiveChatOrContactId] = useState(null);
  const [showNewChatDropdownBox, setShowNewChatDropdownBox] = useState(false);
  const [newChatModalType, setNewChatModalType] = useState(null);
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
          <div className="bg-light dark:bg-dark">
            <motion.div
              data-testid="front-page"
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
                        <ListPage
                          type="chats"
                          menuComponent={
                            <ListMenu
                              user={data?.me}
                              menuType="chats"
                              handleClickCallback={handleClickNewChat}
                              activeChatOrContactId={activeChatOrContactId}
                              setActiveChatOrContactId={
                                setActiveChatOrContactId
                              }
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
                            <ListMenu
                              user={data?.me}
                              menuType="chats"
                              handleClickCallback={handleClickNewChat}
                              activeChatOrContactId={activeChatOrContactId}
                              setActiveChatOrContactId={
                                setActiveChatOrContactId
                              }
                            />
                          }
                        />
                      }
                    />
                    <Route
                      path="/chats/new"
                      element={
                        <Chat
                          user={data?.me}
                          setActiveMenuItem={setActiveMenuItem}
                          setActiveChatOrContactId={setActiveChatOrContactId}
                          menuComponent={
                            <ListMenu
                              user={data?.me}
                              menuType="chats"
                              handleClickCallback={handleClickNewChat}
                              activeChatOrContactId={activeChatOrContactId}
                              setActiveChatOrContactId={
                                setActiveChatOrContactId
                              }
                            />
                          }
                        />
                      }
                    />
                    <Route
                      path="/contacts"
                      element={
                        <ListPage
                          type="contacts"
                          menuComponent={
                            <ListMenu
                              user={data?.me}
                              menuType="contacts"
                              handleClickCallback={handleClickNewContact}
                              activeChatOrContactId={activeChatOrContactId}
                              setActiveChatOrContactId={
                                setActiveChatOrContactId
                              }
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
                            <ListMenu
                              user={data?.me}
                              menuType="contacts"
                              handleClickCallback={handleClickNewContact}
                              activeChatOrContactId={activeChatOrContactId}
                              setActiveChatOrContactId={
                                setActiveChatOrContactId
                              }
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
                            <ListMenu
                              user={data?.me}
                              menuType={activeListMenuComponent}
                              handleClickCallback={
                                activeListMenuComponent === "chats"
                                  ? handleClickNewChat
                                  : handleClickNewContact
                              }
                              activeChatOrContactId={activeChatOrContactId}
                              setActiveChatOrContactId={
                                setActiveChatOrContactId
                              }
                            />
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
                            <ListMenu
                              user={data?.me}
                              menuType={activeListMenuComponent}
                              handleClickCallback={
                                activeListMenuComponent === "chats"
                                  ? handleClickNewChat
                                  : handleClickNewContact
                              }
                              activeChatOrContactId={activeChatOrContactId}
                              setActiveChatOrContactId={
                                setActiveChatOrContactId
                              }
                            />
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
                    setNewChatModalType={setNewChatModalType}
                  />
                )}
                {newChatModalType && (
                  <NewChatModal
                    user={data?.me}
                    chatType={newChatModalType}
                    setShowNewChatModal={() => setNewChatModalType(null)}
                  />
                )}
                {showAddNewContactsModal && (
                  <AddNewContactsModal
                    setShowAddNewContactsModal={setShowAddNewContactsModal}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ModalProvider>
  );
};

export default App;
