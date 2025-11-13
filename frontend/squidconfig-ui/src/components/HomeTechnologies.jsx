import React from "react";
import java from "../assets/java.webp";
import spring from "../assets/spring.png";
import html from "../assets/html-css-js.png";
import reactJs from "../assets/reactJS.png";
import "./HomeTechnologies.css";

const HomeTechnologies = () => {
  return (
    <div id="technologies">
      <h1>Tecnologias Utilizadas:</h1>
      <div id="home-techs">
        <div className="tech">
          <img id="java" src={java} alt="java-logo" />
          <p>
            Backend implementado utilizando Java, responsável por receber as
            requisições do usuário, tratar exceções, construir as linhas das
            regras e validar e editar o arquivo de configuração do servidor.
            Além disso, verifica o status do servidor e a lista de usuários.
          </p>
        </div>
        <div className="tech">
          <img id="spring" src={spring} alt="spring-logo" />
          <p>
            O framework em Java foi utilizado pois facilita a criação de
            aplicações web modernas, rápidas e escaláveis. Sua principal atuação
            está na exposição de uma API REST, deixando disponíveis endpoints
            que lidam com as requisições GET, POST, PUT e DELETE.
          </p>
        </div>
        <div className="tech">
          <img id="html" src={html} alt="html-css-js-logo" />
          <p>
            Frontend implementado usando esse conjunto de tecnologias,
            essenciais para estruturar, estilizar e dar interatividade às
            páginas da web.
          </p>
        </div>
        <div className="tech">
          <img id="react" src={reactJs} alt="ractJs-logo" />
          <p>
            A biblioteca JavaScript foi usada para a construção de uma interface
            moderna e dinâmica, utilizando da Componentização promovida por ela
            e recursos como Fetch e Hooks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeTechnologies;
