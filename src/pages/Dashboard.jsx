import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import TransactionTable from "../components/TransactionTable";
import AccountDetails from "../components/AccountDetails";
import AccountBalance from "../components/AccountBalance";
import Footer from "../components/Footer";
import axios from "axios";
import "../styles/dashboard.css";
import "../styles/table.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };

    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://localhost:3001/transactions");
        setTransactions(response.data);
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      }
    };

    fetchUserData();
    fetchTransactions();
  }, [navigate]);

  const generateAccountNumber = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const generatePixKey = () => {
    return `${Math.random().toString(36).substr(2, 10).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  };

  const generateInitialBalance = () => {
    return Math.floor(500 + Math.random() * 4500); 
  };

  useEffect(() => {
    let isMounted = true; 
  
    const fetchAccountData = async () => {
      if (user?.id) {
        try {
          const response = await axios.get(`http://localhost:3001/accounts?userId=${user.id}`);
  
          if (isMounted) {
            if (response.data.length > 0) {
              setAccount(response.data[0]); 
            } else {
              
              const newAccount = {
                userId: user.id,
                accountNumber: Math.floor(1000 + Math.random() * 9000).toString(),
                balance: Math.floor(500 + Math.random() * 4500), 
                pixKey: `${Math.random().toString(36).substr(2, 10).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
              };
  
              console.log("Criando nova conta:", newAccount); 
  
              const createResponse = await axios.post("http://localhost:3001/accounts", newAccount);
              if (isMounted) {
                setAccount(createResponse.data);
                console.log("Conta bancária criada com sucesso!", createResponse.data);
              }
            }
          }
        } catch (error) {
          console.error("Erro ao buscar ou criar conta:", error);
        }
      }
    };
  
    fetchAccountData();
  
    return () => {
      isMounted = false; 
    };
  }, [user]);
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-container">
            <img src="/logoversao.png" alt="seaPay Logo" className="logo" />
          </div>
        </div>
        <div className="user-info">
          {user ? <span>Olá, {user.name}!</span> : <span>Carregando...</span>}
          <button className="logout-button" onClick={handleLogout}>Sair</button>
        </div>
      </header>

      {}
      <main className="dashboard-content">
        <div className="left-content">
          <section className="transactions-section">
            <div className="transactions-header">
              <h3>Últimas Transações</h3>
              <button className="ver-todas">
                Ver todas <FontAwesomeIcon icon={faChevronRight} className="arrow-icon" />
              </button>
            </div>
            <TransactionTable transactions={transactions} />
          </section>
        </div>

        <div className="right-content">
          <aside className="account-section">
            {user && <AccountDetails user={user} />}
            {user && account && <AccountBalance user={user} account={account} />}
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
