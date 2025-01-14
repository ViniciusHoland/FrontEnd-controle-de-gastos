import{ useState } from "react";
import "./CardDetails.css";

function CardDetails() {
  const [installments, setInstallments] = useState([
    {
      id: 1,
      parcel: 1,
      dueDate: "10/02/2025",
      description: "Magazine",
    },
    {
      id: 2,
      parcel: 2,
      dueDate: "10/03/2025",
      description: "Magazine",
    },
  ]);

  const handleDelete = (id) => {
    setInstallments(installments.filter((installment) => installment.id !== id));
  };

  return (
    <div className="container">
      <h1 className="title">NUBANK</h1>
      <div className="form">
        <input className="input" placeholder="Descrição" />
        <input className="input" placeholder="Amount" />
        <input className="input" placeholder="Parcel" />
        <button className="addButton">Adicionar</button>
      </div>
      {installments.map((installment) => (
        <div key={installment.id} className="card">
          <div className="column">
            <h3>Parcelas</h3>
            <p>{installment.parcel}</p>
          </div>
          <div className="column">
            <h3>Vencimento</h3>
            <p>{installment.dueDate}</p>
          </div>
          <div className="column">
            <h3>Descrição</h3>
            <p>{installment.description}</p>
          </div>
          <div className="column">
            <button
              className="deleteButton"
              onClick={() => handleDelete(installment.id)}
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CardDetails;
