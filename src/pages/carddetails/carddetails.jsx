import { useState, useEffect , useRef } from "react";
import { useLocation } from "react-router-dom";
import "./CardDetails.css";
import Trash from "../../assets/trash.png";
import Api from "../../services/api";
import api from "../../services/api";

function CardDetails() {
  const location = useLocation(); // pega o estado passado pelo link
  const { id, title } = location.state || {}; // pegar o titulo do estado ou vazio se cao não tiver

  const [accounts, setAccount] = useState([]);

  const inputDescription = useRef()
  const inputAmount  = useRef()
  const inputParcel  = useRef()
  const inputCurrentMonth  = useRef()

  /*const handleDelete = (id) => {
    setAccount(accounts.filter((installment) => installment.id !== id));
  };*/

  async function createdAccount(){

    try{
      let amount =  inputAmount.current.value
      let description =  inputDescription.current.value
      let parcel = inputParcel.current.value
      let current = inputCurrentMonth.current.value

      if(current === "marcado"){
        current = "true"
      }else {
        current = "false"
      }


      if(!amount || !description || !parcel){
        return alert("Preencha todos os campos")
      }

      const response = await api.post(`/cards/${id}/accounts`, {description,amount,parcel, current})
      console.log(response.data)
      getAccounts()



    } catch(error){
      console.error("error ao criar conta", error)
    }
     





  }

  async function deleteAccount(idAccount){
    
    try{
        
        await api.delete(`/cards/${id}/accounts/${idAccount}`)
        getAccounts()
    } catch (error){
        console.error("Erro ao buscar detalhes do cartão ou deletar conta", error);
    }

   

  }

  async function getAccounts() {
    try {
      const response = await Api.get(`/cards/${id}`);

      const parcels = response.data.accounts || [];
      setAccount(parcels); // Atualiza o estado com o array de parcelas
    } catch (error) {
      console.error("Erro ao buscar detalhes do cartão:", error);
    }
  }

  useEffect(() => {
    if (id) {
      getAccounts();
    }
  }, []);


  return (
    <div className="container">
      <h1 className="title">{title}</h1>

      {/* Formulário para adicionar novas contas */}
      <div className="form">
        <input className="input" placeholder="Descrição" ref={inputDescription} />
        <input className="input" placeholder="Valor" ref={inputAmount} />
        <input className="input" placeholder="Parcel" ref={inputParcel}/>
        <input type="checkbox" value={"marcado"} ref={inputCurrentMonth}/>
        <button className="addButton" onClick={() => { createdAccount();
          inputDescription.current.value = "";
          inputAmount.current.value = "";
          inputParcel.current.value = "";
          inputCurrentMonth.current.checked = false; // Desmarca o checkbox
        }}>Adicionar</button>
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
              {account.parcels.map((parcel) => (
                <div key={parcel._id} className="card">
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
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardDetails;
