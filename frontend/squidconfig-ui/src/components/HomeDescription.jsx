import React from "react";
import "./HomeDescription.css";

const HomeDescription = () => {
  return (
    <div id="home-description">
      <p>
        O <strong>Squid Configurator</strong> foi desenvolvido para
        <strong> simplificar</strong> a administração do servidor Squid Proxy,
        tornando a configuração muito mais <strong> prática</strong>,
        <strong> acessível</strong> e <strong> segura</strong>. Com ele, você
        não precisa editar arquivos manualmente ou lidar diretamente com
        comandos complexos: todas as regras podem ser criadas, editadas e
        removidas de forma intuitiva através de uma interface clara e
        organizada. O objetivo é
        <strong> automatizar tarefas repetitivas</strong>,
        <strong> reduzir erros</strong> de configuração e
        <strong> economizar tempo</strong>, permitindo que administradores de
        rede foquem no que mais importa: a performance e a segurança do
        ambiente. As funcionalidades contempladas são:
      </p>
      <br />
      <ul id="funcs-list">
        <li>
          <h3>Gerenciamento de ACLs:</h3>
          <p>
            crie e personalize regras de acesso para controlar quem pode ou não
            utilizar a rede.
          </p>
        </li>
        <li>
          <h3>Configuração de Cache:</h3>
          <p>
            defina parâmetros de cache, ajustando memória, diretórios e padrões
            de atualização com facilidade.
          </p>
        </li>
        <li>
          <h3>Controle de Largura de Banda:</h3>
          <p>
            organize pools de delay e limites de velocidade para otimizar o uso
            da rede.
          </p>
        </li>
        <li>
          <h3>Autenticação de Usuários:</h3>
          <p>
            adicione e gerencie usuários, garantindo acesso controlado ao proxy.
          </p>
        </li>
      </ul>
    </div>
  );
};

export default HomeDescription;
