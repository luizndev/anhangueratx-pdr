import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Header.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { FaBook } from "react-icons/fa6";
import { FaListCheck } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { IoSearchSharp } from "react-icons/io5";

const Menu = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();
  const [searchToken, setSearchToken] = useState("");
  const id = localStorage.getItem("id"); // Obtendo o id do localStorage

  useEffect(() => {
    if (!id) {
      navigate("/login"); // Redireciona para /login se não existir id no localStorage
    }
  }, [id, navigate]);

  const handleInputChange = (event) => {
    setSearchToken(event.target.value);
  };

  const options = ["Informatica", "Multidisciplinar", "Equipamento"];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (id) {
          const response = await axios.get(
            `https://pdr-auth.onrender.com/auth/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.status === 200) {
            console.log(response.data);
            setUsername(response.data.user.name);
            setRole(response.data.user.role);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleSelect = (option) => {
    setSelectedOption(option);
    switch (option.value) {
      case "Informatica":
        navigate(`/informatica/${id}`);
        break;
      case "Multidisciplinar":
        navigate(`/multidisciplinar/${id}`);
        break;
      case "Equipamento":
        navigate(`/equipamento/${id}`);
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    navigate("/login");
  };

  return (
    <div className="containerDashboard">
      <header>
        <div className="dashboardLeft">
          <Link to={`/dashboard/${id}`}>
            <img src="/logotipo.svg" alt="Logotipo" />
          </Link>
          <div className="groupPesquisa">
            <input
              type="text"
              placeholder="Pesquise o seu token..."
              value={searchToken}
              onChange={handleInputChange}
            />
            <button>
              <Link to={`/buscartoken/${searchToken}`}>
                Buscar <IoSearchSharp />
              </Link>
            </button>
          </div>
        </div>
        <div className="dashboardRight">
          <ul>
            {role === "ti" ? (
              <li>
                <Link to={`/solicitacoes/${id}`}>
                  <FaListCheck /> Solicitações
                </Link>
              </li>
            ) : role === "labs" ? (
              <li>
                <Link to={`/multidisciplinarinfo/${id}`}>
                  <FaListCheck /> Solicitações
                </Link>
              </li>
            ) : (
              <Dropdown
                className="dropdownX"
                options={options}
                onChange={handleSelect}
                value={selectedOption}
                placeholder="Realizar Solicitações"
              />
            )}

            <li className="orientacoes">
              <Link to={`/orientacoes`}>
                <FaBook /> Orientações
              </Link>
            </li>
            <li className="logout" onClick={handleLogout}>
              <IoLogOut /> Logout
            </li>
          </ul>
          <div className="profile">
            <img src="/profile.png" alt="Perfil" />
            <p>{username}</p>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Menu;
