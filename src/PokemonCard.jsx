
const typeSymbols = {
  Grass: "🌿",
  Fire: "🔥",
  Water: "💧",
  Electric: "⚡",
  Psychic: "✨",
  Normal: "⭐",
  Ghost: "👻",
  Dragon: "🐉",
  Fighting: "🥊",
  Rock: "🪨"
};

const PokemonCard = ({ pokemon }) => {
  const cardClass = `pokemon-card ${pokemon.type.toLowerCase()}`;
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

  return (
    <div className={cardClass}>

      <div className="card-top">
        <span>#{String(pokemon.id).padStart(3, "0")}</span>
        <span className="card-type">
          {typeSymbols[pokemon.type]} {pokemon.type}
        </span>
      </div>

      <div className="card-art">
        <img src={imageUrl} alt={`Sprite of ${pokemon.name}`} />
      </div>

      <div className="card-details">
        <h3>{pokemon.name}</h3>
        <div className="card-stats">
          <span>HP <strong>{pokemon.hp}</strong></span>
          <span>ATK <strong>{pokemon.attack}</strong></span>
        </div>
      </div>

    </div>
  );
};

export default PokemonCard;
