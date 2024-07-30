import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import './App.css';

function App() {
  const [herois, setHerois] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedHero, setSelectedHero] = useState(null);
  const [selectedHeroes, setSelectedHeroes] = useState([]);

  useEffect(() => {
    const fetchHerois = async () => {
      try {
        const savedHerois = localStorage.getItem('herois');
        if (savedHerois) {
          setHerois(JSON.parse(savedHerois));
        } else {
          const response = await fetch('https://homologacao3.azapfy.com.br/api/ps/metahumans');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setHerois(data);
          localStorage.setItem('herois', JSON.stringify(data));
          cacheImages(data);
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchHerois();
  }, []);

  const cacheImages = (data) => {
    data.forEach(heroi => {
      const img = new Image();
      img.src = heroi.images.lg;
    });
  };

  const toggleHeroSelection = (heroi) => {
    setSelectedHeroes((prevSelected) => {
      if (prevSelected.includes(heroi)) {
        return prevSelected.filter(h => h !== heroi);
      } else {
        return [...prevSelected, heroi];
      }
    });
  };

  const determineWinner = () => {
    if (selectedHeroes.length < 2) {
      alert('Selecione pelo menos dois heróis para a batalha.');
      return;
    }

    let winner = selectedHeroes[0];
    let maxPower = Object.values(selectedHeroes[0].powerstats).reduce((a, b) => a + b, 0);

    selectedHeroes.forEach(heroi => {
      const totalPower = Object.values(heroi.powerstats).reduce((a, b) => a + b, 0);
      if (totalPower > maxPower) {
        winner = heroi;
        maxPower = totalPower;
      }
    });

    setSelectedHero(winner);
    setOpen(true);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClickOpen = (heroi) => {
    setSelectedHero(heroi);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedHero(null);
  };

  const filteredHerois = herois.filter(heroi =>
    heroi.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">

      <div class="header">
        <h1>Hero<span>List</span><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="red" d="M458.949 16.902c-21.23 45.511-62.196 13.713-94.89 12.604c-92.464-.8-95.254 47.352-141.296 77.017c-9.189-10.02-23.774-16.38-46.738-15.117c-15.928.876-30.343 6.34-40.974 15.895c-12.34 10.738-21.335 25.549-21.942 39.84c21.03-5.316 41.304-4.385 45.871 5.46c11.508 24.813-21.37 15.961-44.745 23.397c-1.248.396-2.472.81-3.684 1.225c-2.757 7.733-6.024 15.131-6.024 20.482c0 16.945 13.686 6.16 19.648 20.88c.85 2.099 3.778 8.625 12.238 16.833c1.367 1.328 46-35.114 47.487-33.9c-14.835 31.6-38.787 42.74-41.127 43.975c-21.237 11.202-46.726 20.42-55.691 38.13l-.522-.168s-27.58 65.425-33.509 97.908c.575 16.747 25.672 12.545 25.672 12.545l39.527-11.785l4.686 16.94l119.482-150.627c-26.122-15.67-18.045-38.588-21.927-58.778c13.787-22.475 21.9-34.062 14.597-56.68c7.122-7.318 16.216-14.785 26.61-16.779c21.267-4.08 60.016 16.198 80.997 16.47c27.78.362 42.716-14.296 54.352-31.905c-10.666 3.502-14.712 3.5-8.703-15.065c-14.177 5.175-23.315 22.6-48.998 18.526c-23.87-3.787-60.077-11.021-80.065-4.354c33.926-17.423 60.548-35.253 96.777-39.463c42.453 3.026 80.56 32.916 102.89-17.031zM340.169 153.78l-39.003 49.065l16.54 11.713l39.008-49.067zm-205.509 1.657c-5.303 0-10.607 1.195-10.607 3.584c2.163 2.943 9.788 5.337 13.459 5.42c5.858 0 7.755-.644 7.755-5.42c0-2.389-5.304-3.584-10.607-3.584m140.864 47.156l-11.702 14.172L312.9 250.85l11.701-14.172zm-4.423 35.984L100.574 453.551s-10.247 8.425-.05 16.773c10.47 8.57 18.622-3.654 18.622-3.654L289.67 251.695zm18.932 41.914s-20.687 26.845-31.22 40.12c-42.147 53.119-125.718 156.698-127.942 158.156l.068 16.332H240.24l15.365-115.264l44.661 9.677s17.915 1.914 17.186-13.823c-4.626-21.768-19.228-74.864-27.42-95.198zm-22.714 48.874l8.746 21.61l-14.493-3.73z" /></svg></h1>
        <input
          type="text"
          placeholder="Buscar herói..."
          value={searchTerm}
          onChange={handleSearchChange}

        />
        <button class="btn-win" onClick={determineWinner} disabled={selectedHeroes.length < 2}>
          Determinar Vencedor
        </button>
      </div>
      {error ? (
        <div className="error">Erro ao buscar dados: {error}</div>
      ) : (
        <div className="cards-container">
          {filteredHerois.map(heroi => (
            <div className="card" key={heroi.id}>

              <img src={heroi.images.lg} alt={heroi.name} />
              <div className="card-content">
                <div className="card-title">{heroi.name}</div>
                <button class="btn" onClick={() => handleClickOpen(heroi)}>Ver Detalhes</button>
                <button class="btn" onClick={() => toggleHeroSelection(heroi)}>
                  {selectedHeroes.includes(heroi) ? 'Remover da Batalha' : 'Adicionar à Batalha'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}


      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedHero?.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedHero && (
              <>
                <p><strong>Inteligência:</strong> {selectedHero.powerstats.intelligence}</p>
                <p><strong>Força:</strong> {selectedHero.powerstats.strength}</p>
                <p><strong>Velocidade:</strong> {selectedHero.powerstats.speed}</p>
                <p><strong>Durabilidade:</strong> {selectedHero.powerstats.durability}</p>
                <p><strong>Potência:</strong> {selectedHero.powerstats.power}</p>
                <p><strong>Combate:</strong> {selectedHero.powerstats.combat}</p>
                <img src={selectedHero.images.lg} alt={selectedHero.name} />
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;
