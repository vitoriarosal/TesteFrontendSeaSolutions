import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TransactionTable from "../components/TransactionTable";
import AccountDetails from "../components/AccountDetails";
import AccountBalance from "../components/AccountBalance";
import Footer from "../components/Footer";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        const transactionsData = await axios.get("http://localhost:3001/transactions");
        setTransactions(transactionsData.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    fetchData();
  }, []);

  if (!user) {
    return <h1 className="loading">Carregando...</h1>;
  }

  return (
    <div className="home-container">
      {}
      <header className="header">
        <h2>Olá, {user.name}!</h2>
        <button className="logout-button" onClick={() => navigate("/login")}>Sair</button>
      </header>

      {}
      <main className="main-content">
        <section className="transactions-section">
          <h3>Últimas Transações</h3>
          <TransactionTable transactions={transactions} />
        </section>

        {}
        <aside className="sidebar">
          <AccountDetails user={user} />
          <AccountBalance user={user} />
        </aside>
      </main>

      {}
      <Footer />
    </div>
  );
}
