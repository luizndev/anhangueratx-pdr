import { RiCloseLargeFill } from "react-icons/ri";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./MultidisciplinarInfo.css";
import { FaCheck } from "react-icons/fa";
import "react-dropdown/style.css";
import Menu from "../Header/Header.jsx"; // Verifique se o caminho está correto

const MultidisciplinarInfo = () => {
  const [role, setRole] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const { id } = useParams();

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

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
            setRole(response.data.user.role);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]); // Adicione 'id' ao array de dependências

  useEffect(() => {
    const fetchInformaticaData = async () => {
      try {
        const response = await axios.get(
          `https://pdr-auth.onrender.com/multidisciplinar`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          console.log(response.data);
          setData(response.data);
          setFilteredData(response.data); // Inicialmente, mostra todos os dados
        }
      } catch (error) {
        console.error("Error fetching informatica data:", error);
      }
    };

    fetchInformaticaData();
  }, []); // Array de dependências vazio para executar apenas uma vez

  useEffect(() => {
    const filterByDate = () => {
      if (selectedDate) {
        const filtered = data.filter((item) => item.data === selectedDate);
        setFilteredData(filtered);
      } else {
        setFilteredData(data); // Se nenhuma data for selecionada, mostra todos os dados
      }
    };

    filterByDate();
  }, [selectedDate, data]); // Atualiza quando selectedDate ou data mudam

  const handleConfirm = async (item) => {
    // Enviar email para Outlook
    const emailBody = `
      Professor: ${item.professor}
      Email: ${item.email}
      Data: ${item.data}
      Modalidade: ${item.modalidade}
      Alunos: ${item.alunos}
      Laboratório: ${item.laboratorio}
      Software: ${item.software}
      Equipamento: ${item.equipamento}
      Observação: ${item.observacao}
      Token: ${item.token}
    `;

    try {
      await axios.post("https://pdr-auth.onrender.com/send-email", {
        to: "destinatario@outlook.com",
        subject: "Confirmação de Solicitação",
        body: emailBody,
      });

      // Atualizar status para "Confirmação"
      await axios.put(
        `https://pdr-auth.onrender.com/multidisciplinar/${item.id}`,
        {
          status: "Confirmação",
        }
      );

      // Atualizar a lista de dados para refletir a mudança
      setData((prevData) =>
        prevData.map((dataItem) =>
          dataItem.id === item.id
            ? { ...dataItem, status: "Confirmação" }
            : dataItem
        )
      );
      setFilteredData((prevFilteredData) =>
        prevFilteredData.map((dataItem) =>
          dataItem.id === item.id
            ? { ...dataItem, status: "Confirmação" }
            : dataItem
        )
      );
    } catch (error) {
      console.error("Error confirming request:", error);
    }
  };

  const handleDeny = async (item) => {
    // Atualizar status para "Negado"
    try {
      await axios.put(
        `https://pdr-auth.onrender.com/multidisciplinar/${item.id}`,
        {
          status: "Negado",
        }
      );

      // Atualizar a lista de dados para refletir a mudança
      setData((prevData) =>
        prevData.map((dataItem) =>
          dataItem.id === item.id ? { ...dataItem, status: "Negado" } : dataItem
        )
      );
      setFilteredData((prevFilteredData) =>
        prevFilteredData.map((dataItem) =>
          dataItem.id === item.id ? { ...dataItem, status: "Negado" } : dataItem
        )
      );
    } catch (error) {
      console.error("Error denying request:", error);
    }
  };

  return (
    <div className="containerDashboard">
      <Menu />
      <div className="dados">
        <h2>Dados de multidisciplinar</h2>
        <div className="inputFilterContainer">
          <div className="inputFilter">
            <label htmlFor="dateFilter">Filtrar por Data:</label>
            <input
              type="date"
              id="dateFilter"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
        </div>
        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>Professor</th>
                <th>Email</th>
                <th>Data</th>
                <th>Modalidade</th>
                <th>Alunos</th>
                <th>Laboratório</th>
                <th>Curso</th>
                <th>Turno</th>
                <th>Semestre</th>
                <th>Disciplinar</th>
                <th>Tema</th>
                <th>Roteiro</th>
                <th>Observação</th>
                <th>Token</th>
              </tr>
            </thead>
            <tbody>
              {filteredData
                .filter((item) => {
                  if (role === "user") {
                    return item.userID === id;
                  } else if (role === "ti" || role === "labs") {
                    return true; // Mostra todos os itens se a role for "ti" ou "labs"
                  }
                  return false; // Caso padrão, não mostra nada
                })
                .map((item, index) => (
                  <tr key={index}>
                    <td>{item.professor}</td>
                    <td>{item.email}</td>
                    <td>{item.data}</td>
                    <td>{item.modalidade}</td>
                    <td>{item.alunos}</td>
                    <td>{item.laboratorio}</td>
                    <td>{item.curso}</td>
                    <td>{item.semestre}</td>
                    <td>{item.disciplina}</td>
                    <td>{item.tema}</td>
                    <td>
                      <Link to={item.roteiro}>Ver Roteiro</Link>
                    </td>
                    <td>{item.observacao}</td>
                    <td>{item.token}</td>
                    <td className="buttonOption">
                      <button onClick={() => handleConfirm(item)}>
                        <FaCheck />
                      </button>
                      <button
                        className="negado"
                        onClick={() => handleDeny(item)}
                      >
                        <RiCloseLargeFill />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MultidisciplinarInfo;
