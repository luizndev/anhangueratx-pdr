import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Informatica.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Menu from "../Header/Header.jsx"; // Corrected path

const InformaticaForm = () => {
  const [formData, setFormData] = useState({
    professor: "",
    email: "",
    data: "",
    modalidade: "",
    alunos: "",
    laboratorio: "",
    software: "",
    equipamento: "",
    observacao: "",
    token: "Não",
    status: "Não",
    userID: "",
  });

  const [message, setMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState(""); // Novo estado para detalhes do erro
  const { id } = useParams(); // Obter o parâmetro ID da URL
  const [selectedOption, setSelectedOption] = useState(null);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  const options = ["Informatica", "Multidisciplinar", "Equipamento"];
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

  // Buscar dados quando o ID estiver disponível
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `https://auth-6o53.onrender.com/auth/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.status === 200) {
            setUsername(response.data.user.name);
            setRole(response.data.user.role);

            // Atualize o estado do formulário com os dados retornados
            setFormData((prevData) => ({
              ...prevData,
              professor: response.data.user.name,
              userID: id,
              // Defina outros campos conforme necessário
            }));
          }
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        }
      };

      fetchData();
    }
  }, [id]);

  // Função para validar e ajustar a data
  const validateDate = (date) => {
    const today = new Date();
    const selectedDate = new Date(date);
    today.setHours(0, 0, 0, 0); // Ajustar para o início do dia

    if (selectedDate < today) {
      return today.toISOString().split("T")[0]; // Ajustar para hoje se a data estiver no passado
    }

    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 7); // Data mínima permitida é hoje + 7 dias

    if (selectedDate < minDate) {
      const newDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 7
      );
      return newDate.toISOString().split("T")[0]; // Ajustar para a data mínima se a data estiver antes disso
    }

    return date;
  };

  const isDateValid = (date) => {
    const today = new Date();
    const selectedDate = new Date(date);
    today.setHours(0, 0, 0, 0); // Ajustar para o início do dia

    if (selectedDate < today) {
      return false; // Data está no passado
    }

    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 7); // Data mínima permitida é hoje + 7 dias

    if (selectedDate < minDate) {
      return false; // Data está antes da data mínima permitida
    }

    return true; // Data é válida
  };

  // Função para gerar um token aleatório
  const generateToken = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "LABS-";
    for (let i = 0; i < 6; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
  };

  // Manipulador de mudanças no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "data" ? validateDate(value) : value;

    setFormData({ ...formData, [name]: newValue });
  };

  // Manipulador de submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação da data
    if (!isDateValid(formData.data)) {
      setErrorDetails(
        "A reserva deve ser feita com pelo menos 7 dias de antecedência e não pode ser para uma data no passado."
      );
      return;
    }

    // Gerar um token aleatório antes de enviar
    const token = generateToken();
    setFormData((prevData) => ({ ...prevData, token }));

    try {
      const response = await axios.post(
        "https://auth-6o53.onrender.com/informatica/register",
        { ...formData, token } // Incluir o token gerado na solicitação
      );
      setMessage(response.data.message);
      setErrorDetails(""); // Limpar detalhes de erro em caso de sucesso
      setFormData({
        professor: "",
        email: "",
        data: "",
        modalidade: "",
        alunos: "",
        laboratorio: "",
        software: "",
        equipamento: "",
        observacao: "",
        token: "Não",
        status: "Não",
      });
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorDetails(error.response.data.message); // Configurar detalhes do erro
      } else {
        setErrorDetails("Erro ao registrar formulário"); // Mensagem de erro genérica
      }
    }
  };

  return (
    <div className="containerDashboard">
      <Menu props={useParams()} />
      <form className="informatica" onSubmit={handleSubmit}>
        <div className="title-solic">
          <h1>Laboratório DE INFORMáTICA</h1>
          <span>
            Responda esse formulario e irá receber em seu e-mail a resposta da
            sua reserva!
          </span>
        </div>
        <div className="inputbox">
          <input
            type="text"
            placeholder="Nome do Professor"
            name="professor"
            value={formData.professor}
            onChange={handleChange}
            readOnly // Campo somente leitura
          />
          <span>Nome do Professor</span>
        </div>
        <div className="inputbox">
          <div className="inputContainer">
            <input
              type="text"
              placeholder="E-mail Institucional"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <span>E-mail Institucional</span>
        </div>
        <div className="inputbox">
          <input
            type="date"
            placeholder="Data"
            name="data"
            value={formData.data}
            onChange={handleChange}
            required
          />
          <span>Data (realização da aula).</span>
        </div>
        <div className="inputbox">
          <select
            name="modalidade"
            value={formData.modalidade}
            onChange={handleChange}
            required
          >
            <option value="">Qual Modalidade?</option>
            <option value="100% Online">100% Online</option>
            <option value="Semi Presencial">Semi Presencial</option>
            <option value="Presencial">Presencial</option>
          </select>
          <span>Modalidade</span>
        </div>
        <div className="inputbox">
          <input
            type="number"
            placeholder="Quantidade de Alunos"
            name="alunos"
            value={formData.alunos}
            onChange={handleChange}
            required
          />
          <span>Quantidade de Alunos</span>
        </div>
        <div className="inputbox">
          <select
            name="laboratorio"
            value={formData.laboratorio}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma opção</option>
            <option value="Laboratório 1 (Informatica Básica)">
              Laboratório 1 (Informatica Básica)
            </option>
            <option value="Laboratório 2 (Informatica Básica)">
              Laboratório 2 (Informatica Básica)
            </option>
            <option value="Laboratório 3 (Informatica Básica)">
              Laboratório 3 (Informatica Básica)
            </option>
            <option value="Laboratório 5 (Informatica Avançada)">
              Laboratório 5 (Informatica Avançada)
            </option>
            <option value="Laboratório 8 (Informatica Avançada)">
              Laboratório 8 (Informatica Avançada)
            </option>
            <option value="Laboratório 9 (Informatica Avançada)">
              Laboratório 9 (Informatica Avançada)
            </option>
          </select>
          <span>Laboratório</span>
        </div>
        <div className="inputbox">
          <input
            type="text"
            placeholder="Software Específico"
            name="software"
            value={formData.software}
            onChange={handleChange}
            required
          />
          <span>Software Específico</span>
        </div>
        <div className="inputbox">
          <input
            type="text"
            placeholder="Equipamento"
            name="equipamento"
            value={formData.equipamento}
            onChange={handleChange}
            required
          />
          <span>Equipamento</span>
        </div>
        <div className="inputbox">
          <input
            type="text"
            placeholder="Digite sua Observação"
            name="observacao"
            value={formData.observacao}
            onChange={handleChange}
            required
          />
          <span>Observação:</span>
        </div>
        <div className="inputbox" style={{ display: "none" }}>
          <input
            type="text"
            placeholder="Insira sua Resposta"
            name="token"
            value={formData.token}
            onChange={handleChange}
            required
          />
          <span>Token de Reserva:</span>
        </div>
        <div className="inputbox" style={{ display: "none" }}>
          <input type="text" value={formData.status} name="status" readOnly />
        </div>
        <div className="inputbox">
          <input
            id="button-box-sucess"
            type="submit"
            value="FINALIZAR SUA SOLICITAÇÃO"
          />
        </div>
        {message && <div className="message">{message}</div>}
        {errorDetails && (
          <div className="error-details">{errorDetails}</div>
        )}{" "}
        {/* Exibir detalhes do erro */}
      </form>
    </div>
  );
};

export default InformaticaForm;
