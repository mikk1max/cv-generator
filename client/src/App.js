import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/SignUp";
import Login from "./components/Login";

function App() {
  const userToken = localStorage.getItem("token");

  return (
    <Routes>
      {/* Route for Main component accessible only if user is logged in */}
      {userToken ? (<Route path="/" element={<Main />} />
      ) : (
        <Route path="/" element={<Navigate replace to="/login" />} />
      )}

      {/* Public routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Default route to redirect to login if no matching route */}
      <Route path="*" element={<Navigate replace to="/login" />} />
    </Routes>
  );
}

export default App;
