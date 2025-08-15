import "./LoginArea.css";

const LoginArea = () => {
  return (
    <div id="main-container">
      <div id="container-img-login">
        <h1>img</h1>
      </div>
      <div id="container-login">
        <h1>Bem Vindo!</h1>
        <h2>Efetue seu login:</h2>
        <form id="login-form">
          <div id="login-inputs">
            <label htmlFor="userName">Nome:</label>
            <input
              type="text"
              name="userName"
              className="login-input"
              placeholder="Nome do usuário"
            />
            <label htmlFor="password">Senha:</label>
            <input
              type="text"
              name="password"
              className="login-input"
              placeholder="Senha do usuário"
            />
          </div>
          <div id="login-error-msg">
            <p>*Nome/Senha incorretos! Tente novamente.</p>
          </div>
          <input type="submit" id="submit-input" value="ENTRAR" />
        </form>
      </div>
    </div>
  );
};

export default LoginArea;
