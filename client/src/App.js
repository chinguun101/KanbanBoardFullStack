import React, { useState } from "react";
import AllLists from "./components/AllListsWindow";
import ApiProvider from "./contexts/ApiProvider";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/auth/Navbar";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AuthProvider from "./contexts/AuthContext";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./Theme";
import "./css/app.css";

const App = () => {
  const [data, setData] = useState({
    columns: {},
  });

  return (
    <Router>
      <ApiProvider>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <Navbar />
            <Routes>
              <Route
                path="/"
                element={<AllLists data={data} setData={setData} />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </ApiProvider>
    </Router>
  );
};

export default App;
