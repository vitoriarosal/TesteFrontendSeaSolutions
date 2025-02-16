import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { validateEmail, validatePassword, validateCPF, validateConfirmPassword, validateFullName, maskCPF } from "../services/formValidations";

export default function CreateAccountModal({ visible, onClose }) {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formVisible, setFormVisible] = useState(true); 
  const generateAccountNumber = () => {
    return Math.floor(1000 + Math.random() * 9000).toString(); 
  };

  const generateSaldoAleatorio = () => {
    return Math.floor(10 + Math.random() * 900000); 
  };

  const generatePixKey = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase() + 
           "-" + 
           Math.random().toString(36).substring(2, 6).toUpperCase();
  };


  const onSubmit = async (data) => {
    setLoading(true);
    try {
     
      const userResponse = await axios.post("http://localhost:3001/users", {
        name: data.nome,
        cpf: data.cpf,
        email: data.email,
        password: data.senha
      });

      const newUser = userResponse.data; 

      const accountData = {
        userId: newUser.id,
        accountNumber: generateAccountNumber(),
        balance: generateSaldoAleatorio(), 
        pixKey: generatePixKey() 
      };

      const accountResponse = await axios.post("http://localhost:3001/accounts", accountData);
      console.log("Conta bancária criada com sucesso!", accountResponse.data);

      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("account", JSON.stringify(accountResponse.data));
      localStorage.setItem("auth", "true");

      setShowSuccessModal(true);
      setFormVisible(false); 
    } catch (error) {
      console.error("Erro ao criar conta:", error.response?.data || error.message);
      alert("Erro ao criar conta. Veja o console para mais detalhes.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setFormVisible(true); 
    reset(); 
    onClose();
    navigate("/dashboard");
  };

  return (
    <>
      {}
      <Dialog 
        header={<span className="modal-title">Abra sua conta no <img src="/logo.png" alt="seaPay" className="modal-logo" /></span>}
        visible={visible && formVisible} 
        className="modal-container"
        onHide={onClose} 
        dismissableMask
      >
        <p>Complete os campos abaixo para abrir sua conta seaPay:</p>

        <form onSubmit={handleSubmit(onSubmit)} className="p-dialog-content">
          <label>E-mail*</label>
          <InputText {...register("email", { validate: validateEmail })} placeholder="exemplo@email.com" disabled={loading} />
          {errors.email && <p className="error-message">{errors.email.message}</p>}

          <label>Senha*</label>
          <InputText {...register("senha", { validate: validatePassword })} type="password" placeholder="Digite sua senha" disabled={loading} />
          {errors.senha && <p className="error-message">{errors.senha.message}</p>}

          <label>Confirme sua senha*</label>
          <InputText {...register("confirmSenha", { validate: (value) => validateConfirmPassword(watch("senha"), value) })} type="password" placeholder="Digite sua senha novamente" disabled={loading} />
          {errors.confirmSenha && <p className="error-message">{errors.confirmSenha.message}</p>}

          <label>Nome Completo*</label>
          <InputText {...register("nome", { validate: validateFullName })} placeholder="Digite seu nome completo" disabled={loading} />
          {errors.nome && <p className="error-message">{errors.nome.message}</p>}

          <label>CPF*</label>
          <InputText
            {...register("cpf", { validate: validateCPF })}
            placeholder="000.000.000-00"
            onChange={(e) => setValue("cpf", maskCPF(e.target.value))}
            disabled={loading}
          />
          {errors.cpf && <p className="error-message">{errors.cpf.message}</p>}

          <Button label={loading ? "Enviando..." : "Enviar"} type="submit" className="modal-button" disabled={loading} />
        </form>
      </Dialog>

      {}
      <Dialog
        header={<div className="success-title">Abertura de conta</div>}
        visible={showSuccessModal}
        className="success-modal"
        onHide={handleCloseSuccessModal}
        dismissableMask
      >
        <div className="success-container">
          <div className="success-icon-container">
            <div className="success-icon"></div>
          </div>
          <p className="success-text">
            Tudo pronto, agora você já pode acessar a sua conta através do painel de Login.
          </p>
        </div>
        <div className="success-footer">
          <Button label="Ok" onClick={handleCloseSuccessModal} className="success-button" />
        </div>
      </Dialog>
    </>
  );
}
