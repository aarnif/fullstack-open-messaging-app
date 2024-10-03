import { Routes, Route, Navigate } from "react-router-dom";

const App = () => {
  return (
    <>
      <h1 className="text-3xl font-bold text-red-600">
        This is a Vite + React + Tailwind CSS app!
      </h1>
      <Routes>
        <Route path="/" element={<Navigate to="/chats" replace />} />
        <Route path="/signin" element={<div>Sign In</div>} />
        <Route path="/signup" element={<div>Sign Up</div>} />
        <Route path="/chats" element={<div>Chats</div>} />
        <Route path="/chats/:id" element={<div>Chat with ID</div>} />
        <Route path="/contacts" element={<div>Contacts</div>} />
        <Route path="/contacts/:id" element={<div>Contact with ID</div>} />
        <Route path="/profile" element={<div>Profile</div>} />
        <Route path="/settings" element={<div>Settings</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
