import "./style.css";
import Trash from "../../assets/trash.png";
import Pincel from "../../assets/pincel.png";
import api from "../../services/api";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [cards, setCards] = useState([]);

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

  async function deleteCard(id) {
    await api.delete(`/cards/${id}`);

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
          />
          <input
            type="number"
            placeholder="Data de Vencimento"
            className="form-input"
            ref={inputDate}
          />
          <button type="button" className="form-button" onClick={createdCard}>
            Cadastrar
          </button>
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
                    <img src={Pincel} alt="Editar" width={20} height={20} />
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
