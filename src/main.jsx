import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Login from "./Login/Login.jsx";
import Register from "./Register/Register.jsx";
import Multidisciplinar from "./Multidisciplinar/Multidisciplinar.jsx";
import Dashboard from "./Dashboard/Dashboard.jsx";
import BaseInformatica from "./BaseInformatica/BaseInformatica.jsx";
import Solicitacoes from "./Solicitacoes/Solicitacoes.jsx";
import MultidisciplinarInfo from "./MultidisciplinarInfo/MultidisciplinarInfo.jsx";
import Informatica from "./Informatica/Informatica.jsx";
import BuscarToken from "./Buscartoken/Index.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/multidisciplinar/:id" element={<Multidisciplinar />} />
        <Route path="/admininfo" element={<BaseInformatica />} />
        <Route path="/solicitacoes/:id" element={<Solicitacoes />} />
        <Route
          path="/multidisciplinarinfo/:id"
          element={<MultidisciplinarInfo />}
        />
        <Route path="/dashboard/:id" element={<Dashboard />} />
        <Route path="/Informatica/:id" element={<Informatica />} />
        <Route path="/buscartoken/:id" element={<BuscarToken />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
