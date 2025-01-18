import "./style.css";
import Trash from "../../assets/trash.png";
import Pincel from "../../assets/pincel.png";
import api from "../../services/api";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [cards, setCards] = useState([]);
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editingCardId, setEditingCardId] = useState(null); // ID do card em edição


  const inputTitle = useRef();
  const inputDate = useRef();

  async function getCards() {
    const cardsFromApi = await api.get("/cards");

    setCards(cardsFromApi.data);
  }

  async function createdCard() {
    console.log("Título:", inputTitle.current.value);
    console.log("Data:", inputDate.current.value);

    try {
      const title = inputTitle.current.value.trim();
      const date = Number(inputDate.current.value); // Converte para número no frontend

      if (!title) {
        alert("O título não pode estar vazio.");
        return;
      }

      if (!date || date < 1 || date > 31) {
        alert("A data de vencimento deve ser um número entre 1 e 31.");
        return;
      }

      const response = await api.post("/cards", { title, date });
      console.log("Card criado:", response.data.card);

      getCards(); // Atualiza a lista de cards
    } catch (error) {
      console.error(
        "Erro ao criar o card:",
        error.response?.data?.error || error.message
      );
    }
  }

  const saveCard = () => {
    if(!editingCardId) return; 

    const update = {title, date}
    updateCard(editingCardId, update.title, update.date)

    getCards()

  }

  async function updateCard(idCard, titleEdit, dateEdit){

    try{

      const title = titleEdit
      const date = Number(dateEdit)

      await api.put(`/cards/${idCard}`, {title, date})

      console.log("card editado com sucesso")
    } catch (error){
      console.error("não foi possivel editar card", error)
    }

    getCards()
  }

  async function deleteCard(id) {
    

    if(confirm("Deseja excluir o cartão? ")){
      await api.delete(`/cards/${id}`);
    } else {
      return
    }
    

    getCards();
  }

  useEffect(() => {
    getCards();
  }, []);

  return (
    <>
      <div className="containerHome">
        <h1>Cadastre Cartão</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Título"
            className="form-input"
            ref={inputTitle}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="number"
            placeholder="Data de Vencimento"
            className="form-input"
            ref={inputDate}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          {isEditing ? (
                <button
                type="button"
                className="form-button"
                onClick={() => {
                  saveCard(); // Função para salvar as mudanças
                  setIsEditing(false); // Sai do modo de edição após salvar
                  }}
                >
                Salvar
              </button>
            ) : (
              <button type="button" className="form-button" onClick={createdCard}>
                Cadastrar
              </button> 
          )}
      
        </form>

        <div className="cards-container">
          {cards.map((card) => (
            <Link
              to={`/cards/${card._id}`}
              key={card._id}
              className="card-link"
              state={{ id: card._id, title: card.title }}
            >
         
              <div className="cards">
                <div className="card-info">
                  <p>
                    <span>{card.title}</span>
                  </p>
                  <p>
                    <span>{card.date}</span>
                  </p>
                </div>
                <div className="icon-buttons">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      deleteCard(card._id);
                    }}
                  >
                    <img src={Trash} alt="Deletar" width={20} height={20} />
                  </button>
                  <button>
                    <img src={Pincel} alt="Editar" width={20} height={20} onClick={(e) => { e.preventDefault(); 
                      setTitle(card.title);
                       setDate(card.date);
                      setIsEditing(true);
                      setEditingCardId(card._id)
                       }} />
          
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
