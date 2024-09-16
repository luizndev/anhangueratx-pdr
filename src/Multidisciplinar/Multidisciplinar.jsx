import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Importar useNavigate
import "./Multidisciplinar.css";
import "react-dropdown/style.css";
import Menu from "../Header/Header.jsx"; // Caminho corrigido

const MultidisciplinarForm = () => {
  const [formData, setFormData] = useState({
    professor: "",
    email: "",
    data: "",
    modalidade: "",
    alunos: "",
    laboratorio: "",
    curso: "",
    turno: "",
    semestre: "",
    disciplina: "",
    tema: "",
    roteiro: "",
    observacao: "",
    token: "Não",
    status: "Não",
  });

  const [message, setMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState(""); // Novo estado para detalhes do erro
  const { id } = useParams(); // Obter o parâmetro ID da URL
  const navigate = useNavigate(); // Usar useNavigate para redirecionamento

  // Buscar dados quando o ID estiver disponível
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `https://pdr-auth-ofc.vercel.app/auth/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.status === 200) {
            setFormData((prevData) => ({
              ...prevData,
              professor: response.data.user.name,
              email: response.data.user.email,
            }));
          }
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        }
      };

      fetchData();
    }
  }, [id]);

  // Adicionar o listener do evento após o componente ser montado
  useEffect(() => {
    const link = document.getElementById("open-new-tab");

    const handleClick = (event) => {
      event.preventDefault();
      window.open(
        "https://uploadnow.io/pt?utm_source=gads&utm_medium=pt&gclid=CjwKCAiAxP2eBhBiEiwA5puhNVrJySdfeYLebcBtvOQA3A1oiM6cFCefv2Xc0oMw1YMf1YySIDqRTxoCoCkQAvD_BwE",
        "_blank"
      );
    };

    if (link) {
      link.addEventListener("click", handleClick);
    }

    // Cleanup function
    return () => {
      if (link) {
        link.removeEventListener("click", handleClick);
      }
    };
  }, []);

  // Função para validar e ajustar a data
  const validateDate = (date) => {
    const today = new Date();
    const selectedDate = new Date(date);
    today.setHours(0, 0, 0, 0); // Ajustar para o início do dia

    if (selectedDate < today) {
      return today.toISOString().split("T")[0]; // Ajustar para hoje se a data estiver no passado
    }

    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 6); // Data mínima permitida é hoje + 7 dias

    if (selectedDate < minDate) {
      return minDate.toISOString().split("T")[0]; // Ajustar para a data mínima se a data estiver antes disso
    }

    return date;
  };

  const isDateValid = (date) => {
    const today = new Date();
    const selectedDate = new Date(date);
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return false;
    }

    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 6);

    if (selectedDate < minDate) {
      return false;
    }

    return true;
  };

  const generateToken = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "LABS-";
    for (let i = 0; i < 6; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "data" ? validateDate(value) : value;

    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isDateValid(formData.data)) {
      setErrorDetails(
        "A reserva deve ser feita com pelo menos 7 dias de antecedência e não pode ser para uma data no passado."
      );
      return;
    }

    const token = generateToken();
    setFormData((prevData) => ({ ...prevData, token }));

    try {
      const response = await axios.post(
        "https://pdr-auth-ofc.vercel.app/multidisciplinar/register",
        { ...formData, token }
      );
      setMessage(response.data.message);
      setErrorDetails("");
      setFormData({
        professor: "",
        email: "",
        data: "",
        modalidade: "",
        alunos: "",
        laboratorio: "",
        curso: "",
        turno: "",
        semestre: "",
        disciplina: "",
        tema: "",
        roteiro: "",
        observacao: "",
        token: "Não",
        status: "Não",
      });
      navigate(`/sucesso/${token}`);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorDetails(error.response.data.message);
      } else {
        setErrorDetails("Erro ao registrar formulário");
      }
    }
  };

  return (
    <div className="containerDashboard">
      <Menu props={useParams()} />
      <form className="multidisciplinar" onSubmit={handleSubmit}>
        <div className="title-solic">
          <h1>Laboratório DE MULTIDISCIPLINAR</h1>
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
            readOnly
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
            <option value="Analises Clinicas e Parasitologia e Líquidos Corporais">
              Analises Clinicas e Parasitologia e Líquidos Corporais
            </option>
            <option value="Anatomia I">Anatomia I</option>
            <option value="Anatomia II">Anatomia II</option>
            <option value="Auditorio">Auditorio</option>
            <option value="Biodiversidade e Biotecnologia">
              Biodiversidade e Biotecnologia
            </option>
            <option value="Bioquímica / Microbiologia">
              Bioquímica / Microbiologia
            </option>
            <option value="Bromatologia">Bromatologia</option>
            <option value="Ciências Morfofuncionais">
              Ciências Morfofuncionais
            </option>
            <option value="Clinica de Estética">Clinica de Estética</option>
            <option value="Clinica de Farmacia">Clinica de Farmacia</option>
            <option value="Clinica de Nutrição">Clinica de Nutrição</option>
            <option value="Clinica de Odontologia">
              Clinica de Odontologia
            </option>
            <option value="Clinica de Piscologia">Clinica de Piscologia</option>
            <option value="Construção Civil">Construção Civil</option>
            <option value="Cozinha Pedagógica / Tecnologia de alimentos">
              Cozinha Pedagógica / Tecnologia de alimentos
            </option>
            <option value="Desenho Técnico I">Desenho Técnico I</option>
            <option value="Desenho Técnico II">Desenho Técnico II</option>
            <option value="Elétrica e Eletrônica">Elétrica e Eletrônica</option>
            <option value="Enfermagem">Enfermagem</option>
            <option value="Estética Facial e Corporal">
              Estética Facial e Corporal
            </option>
            <option value="Física e Resistencia de Materiais I">
              Física e Resistencia de Materiais I
            </option>
            <option value="Física e Resistencia de Materiais II">
              Física e Resistencia de Materiais II
            </option>
            <option value="Fisioterapia I">Fisioterapia I</option>
            <option value="Fisioterapia  II">Fisioterapia II</option>
            <option value="Hardware e Telecomunicações">
              Hardware e Telecomunicações
            </option>
            <option value="Hidráulica">Hidráulica</option>
            <option value="Imagem Pessoal">Imagem Pessoal</option>
            <option value="Maquetaria">Maquetaria</option>
            <option value="Microscopia I">Microscopia I</option>
            <option value="Microscopia II">Microscopia II</option>
            <option value="Motores e Tecnologia de Soldagem">
              Motores e Tecnologia de Soldagem
            </option>
            <option value="NPJ">NPJ</option>
            <option value="Pista de Atletismo">Pista de Atletismo</option>
            <option value="Pré-clínico de Odontologia">
              Pré-clínico de Odontologia
            </option>
            <option value="Processos Químicos">Processos Químicos</option>
            <option value="Quadra Poliesportiva">Quadra Poliesportiva</option>
            <option value="Química I">Química I</option>
            <option value="Química I">Química II</option>
            <option value="Química III">Química III</option>
            <option value="Sala de Dança">Sala de Dança</option>
            <option value="Sementes">Sementes</option>
            <option value="Sistemas Térmicos">Sistemas Térmicos</option>
            <option value="Solos e Topografia">Solos e Topografia</option>
            <option value="Tecnologia Farmacêutica / Cosmetologia">
              Tecnologia Farmacêutica / Cosmetologia
            </option>
            <option value="Viveiro">Viveiro</option>
          </select>
          <span>Laboratório</span>
        </div>
        <div className="inputbox">
          <input
            type="text"
            placeholder="Curso"
            name="curso"
            value={formData.curso}
            onChange={handleChange}
            required
          />
          <span>Curso</span>
        </div>
        <div className="inputbox">
          <select
            name="turno"
            value={formData.turno}
            onChange={handleChange}
            required
          >
            <option value="">Turno</option>
            <option value="Matutino">Matutino</option>
            <option value="Vespertino">Vespertino</option>
            <option value="Noturno">Noturno</option>
          </select>
          <span>Turno</span>
        </div>
        <div className="inputbox">
          <input
            type="text"
            placeholder="Semestre"
            name="semestre"
            value={formData.semestre}
            onChange={handleChange}
            required
          />
          <span>Semestre</span>
        </div>
        <div className="inputbox">
          <input
            type="text"
            placeholder="Disciplina"
            name="disciplina"
            value={formData.disciplina}
            onChange={handleChange}
            required
          />
          <span>Disciplina</span>
        </div>
        <div className="inputbox">
          <input
            type="text"
            placeholder="Tema"
            name="tema"
            value={formData.tema}
            onChange={handleChange}
            required
          />
          <span>Tema</span>
        </div>
        <div className="inputbox" id="uploaded">
          <input
            id="open-new-tab"
            type="submit"
            value="FAZER UPLOAD DO ROTEIRO"
          />
          <span>Anexar roteiro.</span>
        </div>
        <div className="inputbox">
          <input
            type="text"
            placeholder="Roteiro"
            name="roteiro"
            value={formData.roteiro}
            onChange={handleChange}
            required
          />
          <span>Roteiro</span>
        </div>
        <div className="inputbox">
          <input
            placeholder="Observação"
            name="observacao"
            value={formData.observacao}
            onChange={handleChange}
          />
          <span>Observação</span>
        </div>
        {errorDetails && <p className="error-message">{errorDetails}</p>}
        {message && <p className="success-message">{message}</p>}
        <div className="inputbox">
          <input
            id="button-box-sucess"
            type="submit"
            value="FINALIZAR SUA SOLICITAÇÃO"
          />
        </div>
      </form>
    </div>
  );
};

export default MultidisciplinarForm;
