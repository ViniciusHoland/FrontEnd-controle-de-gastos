import "./style.css";
import Trash from '../../assets/trash.png'
import Pincel from '../../assets/pincel.png'

function Home() {

  const id = 'gsg4g4a45g5'
  const title = "Magazine"
  const dueDate = 10

  return (
    <>
      <div className="container">
        
          <h1>Cadastre Cartão</h1>
            <form>
              <input type="text" placeholder="Title" className="form-input" />
              <input
                type="number"
                className="form-input"
                placeholder="Data de Vencimento"
              />
              <button type="submit" className="form-button">
                Cadastrar
              </button>
            </form>
       
          <div key={id} className="cards">
            <div>
            <p><span>  {title} </span></p>
            <p><span> {dueDate} </span></p>
            </div>
            <button><img src={Trash} width={20} height={20}/></button>
            <button><img src={Pincel} width={20} height={20}/></button> 
          </div>
         
        
      </div>
    </>
  );
}

export default Home;
