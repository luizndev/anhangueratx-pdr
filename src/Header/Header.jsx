import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Header.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const Menu = () => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();
  const id = localStorage.getItem("id");
  const [profileImage, setProfileImage] = useState("/profile.png");

  useEffect(() => {
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) {
      setProfileImage(storedImage);
    }
  }, []);

  const handleImageChange = () => {
    const newImage = prompt(
      "Por favor, insira o link da sua imagem de perfil:"
    );
    if (newImage) {
      localStorage.setItem("profileImage", newImage);
      setProfileImage(newImage);
    }
  };

  useEffect(() => {
    if (!id) {
      navigate("/login"); // Redireciona para /login se não existir id no localStorage
    }
  }, [id, navigate]);

  const options = ["Informatica", "Multidisciplinar", "Equipamento"];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (id) {
          const response = await axios.get(
            `https://pdr-auth-ofc.vercel.app/auth/${id}`,
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
        window.open(
          "https://anhangueratx.github.io/reservas/pages/equipamentos.html",
          "_blank",
          "noopener,noreferrer"
        );
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

            <li className="orientacoes">
              <Link to={`/orientacoes`}>Orientações</Link>
            </li>
            <li className="logout" onClick={handleLogout}>
              Logout
            </li>
          </ul>
          <div
            className="profile"
            onClick={handleImageChange}
            style={{ cursor: "pointer" }}
          >
            <img src={profileImage} alt="Perfil" />
            <p>{username}</p>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Menu;
