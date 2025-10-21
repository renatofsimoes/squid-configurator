import { useState } from "react";
import "./LoginArea.css";
import fundo from "../assets/fundo.png";
import logo from "../assets/squid_configurator-logo.png";

const LoginArea = ({ onLoginSuccess }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/login/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: userName, password }),
      });

      if (response.ok) {
        localStorage.setItem("loggedIn", "true");
        setError(false);
        onLoginSuccess();
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Erro ao conectar com o servidor:", err);
      setError(true);
    }
  };

  return (
    <div id="login-page">
      <div id="main-container">
        <div id="container-img-login">
          <img id="fundo" src={fundo} alt="fundo" />
          <img id="logo" src={logo} alt="logo" />
        </div>

        <div id="container-login">
          <h1>Bem Vindo!</h1>
          <h2>Efetue seu login:</h2>

          <form id="login-form" onSubmit={handleSubmit}>
            <div id="login-inputs">
              <label htmlFor="userName">Nome:</label>
              <input
                type="text"
                name="userName"
                className="login-input"
                placeholder="Nome do usuário"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />

              <label htmlFor="password">Senha:</label>
              <input
                type="password"
                name="password"
                className="login-input"
                placeholder="Senha do usuário"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div id="login-error-msg" className={error ? "show" : ""}>
              <p>*Nome/Senha incorretos! Tente novamente.</p>
            </div>

            <input type="submit" id="submit-input" value="ENTRAR" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginArea;
