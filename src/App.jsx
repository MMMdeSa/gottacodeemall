import { use, useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import pokemons from './data'
import PokemonCard from './PokemonCard';
import PokemonScatterplot from './PokemonScatterplot';




function App() {
  console.log(pokemons);
  const [selectedType, setSelectedType] = useState('All');
  const [view, setView] = useState("cards");
  const filteredPokemons = pokemons.filter((pokemon) => {
  return selectedType === 'All'|| pokemon.type === selectedType;
});
  return (
    <div>
      <h1>We're still a thing!</h1>
      <p>Gotta code 'em all! - Pokémon collection</p>
    <div className="explorer-controls">
    <div className="filter-control">
      <select
        aria-label="Filter Pokémon by type"
        value={selectedType}
        onChange={(event) => setSelectedType(event.target.value)}
      >
        <option value="All">All types</option>
        <option value="Grass">Grass</option>
        <option value="Fire">Fire</option>
        <option value="Water">Water</option>
        <option value="Electric">Electric</option>
        <option value="Psychic">Psychic</option>
        <option value="Normal">Normal</option>
        <option value="Ghost">Ghost</option>
        <option value="Dragon">Dragon</option>
        <option value="Fighting">Fighting</option>
        <option value="Rock">Rock</option>
      </select>
      <span className="filter-icon" aria-hidden="true">⚡</span>
    </div>
  

    <div className="view-switch">
      <button
        onClick={() => setView("cards")}
        aria-pressed={view === "cards"}
      >
        Catch (cards)
      </button>

      <button
        onClick={() => setView("scatter")}
        aria-pressed={view === "scatter"}
      >
        Scatter (plot)
      </button>
    </div>
    </div>
    {view === "cards" ? (
      <div className="pokemon-grid">
        {filteredPokemons.map((pokemon) => {
          return <PokemonCard key={pokemon.id} pokemon={pokemon} />;
        })}
      </div>
    ) : (
      <PokemonScatterplot data={filteredPokemons} />
    )}

  </div>
);
  
}


export default App;



