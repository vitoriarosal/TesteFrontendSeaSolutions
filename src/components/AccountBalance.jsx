import { useState } from "react";
import { PiUserBold, PiEnvelopeBold, PiBankBold, PiEyeBold, PiEyeSlashBold, PiCopySimpleBold } from "react-icons/pi";
import { Button } from "primereact/button";
import "primeicons/primeicons.css";
import "../styles/cards.css";

export default function AccountBalance({ user, account }) {  
  const [showBalance, setShowBalance] = useState(false);

  const saldo = account?.balance ?? 2500; 

  const copyToClipboard = () => {
    if (account?.pixKey) {
      navigator.clipboard.writeText(account.pixKey);
      alert("Chave PIX copiada!");
    }
  };

  return (
    <div className="account-section">
      {}
      <div className="account-details">
        <h3>Detalhes</h3>
        <p className="icon-text">
          <PiUserBold className="icon" /> {user?.name || "Usuário Teste"}
        </p>
        <p className="icon-text">
          <PiEnvelopeBold className="icon" /> {user?.email || "teste@email.com"}
        </p>
        <p className="icon-text">
          <PiBankBold className="icon" /> Conta Pessoal
        </p>
      </div>

      {}
      <div className="account-card">
        <h3>Conta</h3>
        <p><strong>Número:</strong> {account?.accountNumber || "Carregando..."}</p>

        <div className="saldo-container">
          <span>
            <strong>Saldo:</strong> 
            {showBalance ? (
              <span className="saldo-valor"> R$ {saldo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} </span>
            ) : " *****"}
          </span>
          <button className="toggle-balance" onClick={() => setShowBalance(!showBalance)}>
            {showBalance ? <PiEyeBold size={18} /> : <PiEyeSlashBold size={18} />}
          </button>
        </div>

        <p className="chave-container">
          <span><strong>Chave:</strong> {account?.pixKey || "Sem chave"}</span>
          {account?.pixKey && (
            <Button icon="pi pi-copy" className="copy-key" onClick={copyToClipboard} />
          )}
        </p>
      </div>
    </div>
  );
}
