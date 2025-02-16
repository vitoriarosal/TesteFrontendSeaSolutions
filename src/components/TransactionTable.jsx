export default function TransactionTable({ transactions }) {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return <p className="no-transactions">Nenhuma transação encontrada.</p>;
  }

  return (
    <div className="transaction-table">
      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Status</th>
            <th>Nome</th>
            <th>Conta</th>
            <th>Chave</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {transactions.slice(0, 10).map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.type || "N/A"}</td>
              <td>R$ {transaction.amount ? transaction.amount.toFixed(2) : "0,00"}</td>
              <td className={`status ${transaction.status?.replace(/\s/g, "") || "Desconhecido"}`}>
            {transaction.status || "Desconhecido"}
              </td>
              <td>{transaction.name || "Não informado"}</td>
              <td>{transaction.accountNumber || "----"}</td>
              <td>{transaction.pixKey ? transaction.pixKey.replace(/.(?=.{4})/g, "*") : "----"}</td>
              <td>{transaction.date ? new Date(transaction.date).toLocaleString("pt-BR") : "----"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
