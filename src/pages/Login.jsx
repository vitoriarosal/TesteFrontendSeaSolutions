import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";
import CreateAccountModal from "../components/CreateAccountModal";
import { maskCPF, validateCPF, validatePassword } from "../services/formValidations";

export default function Login() {
  const [showModal, setShowModal] = useState(false);
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (showModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [showModal]);

  const handleLogin = async () => {
    setCpfError("");
    setPasswordError("");

    const cpfValidation = validateCPF(cpf);
    if (cpfValidation !== true) {
      setCpfError(cpfValidation);
      return;
    }

    const passwordValidation = validatePassword(password);
    if (passwordValidation !== true) {
      setPasswordError(passwordValidation);
      return;
    }

    try {
      const response = await axios.get("http://localhost:3001/users");
      const users = response.data;
      const formattedCpf = cpf.replace(/\D/g, "");

      const user = users.find((user) => user.cpf.replace(/\D/g, "") === formattedCpf);

      if (!user) {
        setCpfError("CPF não encontrado.");
        return;
      }

      if (user.password !== password) {
        setPasswordError("Senha incorreta.");
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("auth", "true");
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setCpfError("Erro ao conectar com o servidor!");
    }
  };

  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 11);
    setCpf(maskCPF(value));
    setCpfError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
          <img src="/logo.png" alt="Logo seaPay" className="login-logo" />
          <h3>Acesse sua conta</h3>

          <div className="login-field">
            <label>Login (CPF)</label>
            <InputText
              type="text"
              placeholder="Digite seu CPF"
              className="login-input"
              value={cpf}
              onChange={handleCpfChange}
            />
            {cpfError && <p className="error-message">{cpfError}</p>}
          </div>

          <div className="login-field">
            <label>Senha</label>
            <InputText
              type="password"
              placeholder="Digite sua senha"
              className="login-input"
              value={password}
              onChange={handlePasswordChange}
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>

          <Button label="Entrar" className="login-button" onClick={handleLogin} />

          <p>
            Ainda não é membro? <span className="create-account-text" onClick={() => setShowModal(true)}>Abra sua conta!</span>
          </p>
        </form>
      </div>

      <div className="login-image-container">
        <img src="/rapaz.jpg" alt="Login" className="login-image" />
      </div>

      <CreateAccountModal visible={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
