import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Header.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const Menu = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchToken, setSearchToken] = useState("");

  // Log the id to verify it's being received correctly
  console.log("Received id:", id);

  const handleInputChange = (event) => {
    setSearchToken(event.target.value);
  };

  const options = ["Informatica", "Multidisciplinar", "Equipamento"];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (id) {
          const response = await axios.get(
            `https://auth-6o53.onrender.com/auth/${id}`,
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

  return (
    <div className="containerDashboard">
      <header>
        <div className="dashboardLeft">
          <img src="/logotipo.svg" alt="Logotipo" />
          <div className="groupPesquisa">
            <input
              type="text"
              placeholder="Pesquise o seu token..."
              value={searchToken}
              onChange={handleInputChange}
            />
            <button>
              <Link to={`/buscartoken/${id}/${searchToken}`}>Buscar</Link>
            </button>
          </div>
        </div>
        <div className="dashboardRight">
          <ul>
            {role === "ti" ? (
              <li>
                <Link to={`/solicitacoes/${id}`}>Solicitações</Link>
              </li>
            ) : role === "labs" ? (
              <li>
                <Link to={`/multidisciplinarinfo/${id}`}>Solicitações</Link>
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

            <li className="orientacoes">Orientações</li>
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
