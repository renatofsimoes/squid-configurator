import React from "react";
import { useNavigate } from "react-router-dom";
import LoginArea from "../components/LoginArea";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    // Redireciona o usuário para a página principal após login bem-sucedido
    navigate("/home");
  };

  return (
    <div id="page-login">
      <LoginArea onLoginSuccess={handleLoginSuccess} />
    </div>
  );
};

export default LoginPage;
