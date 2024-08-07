import { useState } from "react";
import LogoTypeBranco from "../assets/Logotype-Branco.png";
import { FaChevronRight } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Make sure you have axios installed
import "./Login.css";
import { BiSolidErrorAlt } from "react-icons/bi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "https://auth-6o53.onrender.com/auth/login",
        {
          email,
          password,
        }
      );

      if (response.status === 200) {
        const idVerify = response.data.userId; // Aqui está o id do usuário
        const token = response.data.token; // Aqui está o token
        localStorage.setItem("token", token); // Armazenando o token no localStorage
        localStorage.setItem("id", idVerify); // Armazenando o id no localStorage
        // console.log(response.data);
        navigate(`/dashboard/${idVerify}`); // Navegando para o dashboard do usuário
      }
    } catch (error) {
      if (error.response) {
        // If the server responds with an error status
        setError(error.response.data.message);
      } else {
        // Other errors (network issues, etc.)
        setError("Erro ao logar. Tente novamente.");
      }
    }
  };

  return (
    <div className="container-login">
      <div className="left">
        <img
          src={LogoTypeBranco}
          alt="Logotipo Branco"
          className="logotype-login"
        />
      </div>
      <div className="right">
        <form className="logincontainer" onSubmit={handleSubmit}>
          <h1>Login</h1>
          <p>Preencha os campos para realizar o login</p>
          {error && (
            <p className="error-message">
              <BiSolidErrorAlt /> {error}
            </p>
          )}
          <div className="inputType">
            <MdEmail className="icone" />
            <input
              type="email"
              name="login"
              id="login"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="inputType">
            <RiLockPasswordFill className="icone" />
            <input
              type="password"
              name="senha"
              id="senha"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="containerButton">
            <button type="submit">
              Entrar <FaChevronRight />
            </button>
          </div>
          <div className="dicas">
            <p>Não tem uma conta?</p>
            <Link to="/register">Criar sua conta</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
