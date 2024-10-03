import { Routes, Route, Navigate } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chats" replace />} />
      <Route path="/signin" element={<div>Sign In</div>} />
      <Route path="/signup" element={<div>Sign Up</div>} />
      <Route path="/chats" element={<div>Chats</div>} />
      <Route path="/chats/:id" element={<div>Individual Chat</div>} />
      <Route path="/contacts" element={<div>Contacts</div>} />
      <Route path="/contacts/:id" element={<div>Individual Contact</div>} />
      <Route path="/profile" element={<div>Profile</div>} />
      <Route path="/settings" element={<div>Settings</div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
