import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./CardDetails.css";
import Trash from "../../assets/trash.png";
import Api from "../../services/api";
import api from "../../services/api";

function CardDetails() {
  const location = useLocation(); // pega o estado passado pelo link
  const { id, title } = location.state || {}; // pegar o titulo do estado ou vazio se caso não tiver

  const [accounts, setAccount] = useState([]);
  const [card, setCard] = useState(null);
  const [totalNextDue, setTotalNextDue] = useState(0);

  const inputDescription = useRef();
  const inputAmount = useRef();
  const inputParcel = useRef();
  const inputCurrentMonth = useRef();

  /*const handleDelete = (id) => {
    setAccount(accounts.filter((installment) => installment.id !== id));
  };*/

  async function createdAccount() {
    try {
      let amount = parseFloat(inputAmount.current.value);
      let description = inputDescription.current.value;
      let parcel = parseInt(inputParcel.current.value);

      const isChecked = inputCurrentMonth.current.checked;
      console.log("Checkbox está marcado:", isChecked);

      const currentMonth = isChecked;

      console.log(currentMonth);

      const response = await api.post(`/cards/${id}/accounts`, {
        description,
        amount,
        parcel,
        currentMonth,
      });
      console.log(response.data);
      getAccounts();
      getCard();
    } catch (error) {
      console.error("error ao criar conta", error);
    }
  }

  async function deleteAccount(idAccount) {
    try {
      await api.delete(`/cards/${id}/accounts/${idAccount}`);
      getAccounts();
      getCard();
    } catch (error) {
      console.error(
        "Erro ao buscar detalhes do cartão ou deletar conta",
        error
      );
    }
  }

  async function getAccounts() {
    try {
      const response = await Api.get(`/cards/${id}`);

      const parcels = response.data.accounts || [];
      setAccount(parcels); // Atualiza o estado com o array de parcelas
      getCard();
    } catch (error) {
      console.error("Erro ao buscar detalhes do cartão:", error);
    }
  }

  async function getCard() {
    try {
      const response = await api.get(`/cards/${id}`);
      setCard(response.data);
      setTotalNextDue(response.data.totalNextDue);
    } catch (error) {
      console.error("Erro ao buscar os dados do cartão:", error);
    }
  }

  useEffect(() => {
    if (id) {
      getAccounts();
      getCard();
    }
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">{title}</h1>
        <div className="total-next-due">
          <p>Total da Próxima Fatura:</p>
          <h2>{`R$ ${totalNextDue.toFixed(2)}`}</h2>
        </div>
      </div>
      <h1 className="title">Contas</h1>

      {/* Formulário para adicionar novas contas */}
      <div className="form">
        <input
          className="input"
          placeholder="Descrição"
          ref={inputDescription}
        />
        <input className="input" placeholder="Valor" ref={inputAmount} />
        <input className="input" placeholder="Parcel" ref={inputParcel} />
        <input type="checkbox" value={"marcado"} ref={inputCurrentMonth} />
        <button
          className="addButton"
          onClick={() => {
            createdAccount();
            inputDescription.current.value = "";
            inputAmount.current.value = "";
            inputParcel.current.value = "";
            inputCurrentMonth.current.checked = false; // Desmarca o checkbox
          }}
        >
          Adicionar
        </button>
      </div>

      {/* Listagem de contas */}
      <div className="accounts">
        {accounts.map((account) => (
          <div key={account._id} className="account">
            <h2 className="account-title">Conta</h2>
            {/*<p>ID da Conta: {account._id}</p>*/}

            {/* Listagem de parcelas dentro da conta */}
            <div className="buttonDelete">
              <button
                className="deleteButton"
                onClick={() => deleteAccount(account._id)}
              >
                <img src={Trash} width={20} height={20} alt="Deletar" />
              </button>
            </div>

            <div className="installments">
              {account.parcels.map((parcel) => {
                // Função para converter data do formato DD/MM/YYYY para YYYY-MM-DD
                const convertDate = (dateString) => {
                  const [day, month, year] = dateString.split("/"); // Dividir pela "/"
                  return `${year}-${month}-${day}`; // Reorganizar no formato ISO
                };

                // Verificar se a data da parcela já passou
                const dueDate = new Date(convertDate(parcel.dueDate));
                const today = new Date();
                const isOverdue = dueDate < today; // Parcela vencida

                return (
                  <div
                    key={parcel._id}
                    className="card"
                    style={{
                      backgroundColor: isOverdue ? "#afcca8" : "#2b6767", // Vermelho se vencida
                    }}
                  >
                    <div className="column">
                      <h3>Parcelas</h3>
                      <p>{parcel.parcel}</p>
                    </div>
                    <div className="column">
                      <h3>Valor</h3>
                      <p>{`R$ ${parcel.parcelAmount}`}</p>
                    </div>
                    <div className="column">
                      <h3>Vencimento</h3>
                      <p>{parcel.dueDate}</p>
                    </div>
                    <div className="column">
                      <h3>Descrição</h3>
                      <p>{parcel.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardDetails;
