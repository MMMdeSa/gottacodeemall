
import { useEffect, useState } from "react";
import PokemonCard from "./PokemonCard";

const typeColors = {
  Grass: "#568d48",
  Fire: "#b96328",
  Water: "#438fc5",
  Electric: "#c9a020",
  Psychic: "#ba64ac",
  Normal: "#93867a",
  Ghost: "#8264b1",
  Dragon: "#b84c61",
  Fighting: "#b85b43",
  Rock: "#747c83",
};

const width = 640;
const height = 400;

const margin = {
  top: 25,
  right: 25,
  bottom: 55,
  left: 65,
};

const plotWidth = width - margin.left - margin.right;
const plotHeight = height - margin.top - margin.bottom;

const xScale = (hp) =>
  margin.left + (hp / 170) * plotWidth;

const yScale = (attack) =>
  height - margin.bottom - (attack / 150) * plotHeight;

const hpTicks = [0, 40, 80, 120, 160];
const attackTicks = [0, 30, 60, 90, 120, 150];

const PokemonScatterplot = ({ data }) => {
  const [mode, setMode] = useState("hover");
  const [hoveredPokemon, setHoveredPokemon] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // Return to the default inspection mode
  const resetToHover = () => {
    setMode("hover");
    setSelectedIds([]);
    setHoveredPokemon(null);
  };

  // Enter comparison mode with no selections
  const startComparison = () => {
    setMode("compare");
    setSelectedIds([]);
    setHoveredPokemon(null);
  };

  // Handle clicking a dot in comparison mode
  const selectPokemon = (pokemon) => {
    if (mode !== "compare") return;

    // Clicking an already-selected dot resets everything
    if (selectedIds.includes(pokemon.id)) {
      resetToHover();
      return;
    }

    setSelectedIds((previous) => {
      if (previous.length < 2) {
        return [...previous, pokemon.id];
      }

      // Keep the first selection and replace the second
      return [previous[0], pokemon.id];
    });
  };

  // Reset if filtering removes a selected Pokémon
  useEffect(() => {
    if (
      mode === "compare" &&
      selectedIds.some(
        (id) => !data.some((pokemon) => pokemon.id === id)
      )
    ) {
      setMode("hover");
      setSelectedIds([]);
      setHoveredPokemon(null);
    }
  }, [data, selectedIds, mode]);

  // Retrieve the objects corresponding to selected IDs
  const comparedPokemons = selectedIds
    .map((id) => data.find((pokemon) => pokemon.id === id))
    .filter(Boolean);

  return (
    <section className="scatterplot-section">
      <h2>Gotta Plot 'Em All!</h2>

      <div className="scatterplot-toolbar">
        <button
          type="button"
          onClick={resetToHover}
          aria-pressed={mode === "hover"}
        >
          Hover
        </button>

        <button
          type="button"
          onClick={startComparison}
          aria-pressed={mode === "compare"}
        >
          Compare two
        </button>

        {mode === "compare" && (
          <button
            type="button"
            className="reset-button"
            onClick={resetToHover}
          >
            Reset to hover
          </button>
        )}
      </div>

      <div className="scatterplot-layout">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: "100%", height: "auto" }}
          role="group"
          aria-label="Pokémon scatterplot comparing HP and Attack"
        >
          {/* Horizontal gridlines and HP labels */}
          {hpTicks.map((hp) => (
            <g key={hp}>
              <line
                x1={xScale(hp)}
                y1={margin.top}
                x2={xScale(hp)}
                y2={height - margin.bottom}
                stroke="#dddddd"
              />
              <text
                x={xScale(hp)}
                y={height - margin.bottom + 22}
                textAnchor="middle"
                fontSize="12"
                fill="#777"
              >
                {hp}
              </text>
            </g>
          ))}

          {/* Vertical gridlines and Attack labels */}
          {attackTicks.map((attack) => (
            <g key={attack}>
              <line
                x1={margin.left}
                y1={yScale(attack)}
                x2={width - margin.right}
                y2={yScale(attack)}
                stroke="#dddddd"
              />
              <text
                x={margin.left - 12}
                y={yScale(attack) + 4}
                textAnchor="end"
                fontSize="12"
                fill="#777"
              >
                {attack}
              </text>
            </g>
          ))}

          {/* Axes */}
          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={height - margin.bottom}
            stroke="#555"
          />
          <line
            x1={margin.left}
            y1={height - margin.bottom}
            x2={width - margin.right}
            y2={height - margin.bottom}
            stroke="#555"
          />

          {/* Pokémon dots */}
          {data.map((pokemon) => {
            const selectedIndex = selectedIds.indexOf(pokemon.id);
            const isSelected = selectedIndex !== -1;

            return (
              <g key={pokemon.id}>
                <circle
                  cx={xScale(pokemon.hp)}
                  cy={yScale(pokemon.attack)}
                  r={isSelected ? 10 : 7}
                  fill={typeColors[pokemon.type]}
                  stroke={isSelected ? "#222" : "white"}
                  strokeWidth={isSelected ? 3 : 1.5}
                  className="pokemon-dot"
                  tabIndex={0}
                  role={mode === "compare" ? "button" : undefined}
                  aria-pressed={
                    mode === "compare" ? isSelected : undefined
                  }
                  aria-label={`${pokemon.name}: HP ${pokemon.hp}, Attack ${pokemon.attack}`}
                  onMouseEnter={() => {
                    if (mode === "hover") {
                      setHoveredPokemon(pokemon);
                    }
                  }}
                  onMouseLeave={() => {
                    if (mode === "hover") {
                      setHoveredPokemon(null);
                    }
                  }}
                  onFocus={() => {
                    if (mode === "hover") {
                      setHoveredPokemon(pokemon);
                    }
                  }}
                  onBlur={() => {
                    if (mode === "hover") {
                      setHoveredPokemon(null);
                    }
                  }}
                  onClick={() => selectPokemon(pokemon)}
                  onKeyDown={(event) => {
                    if (
                      mode === "compare" &&
                      (event.key === "Enter" || event.key === " ")
                    ) {
                      event.preventDefault();
                      selectPokemon(pokemon);
                    }
                  }}
                >
                  <title>
                    {`${pokemon.name} — HP: ${pokemon.hp}, Attack: ${pokemon.attack}`}
                  </title>
                </circle>

                {mode === "compare" && isSelected && (
                  <text
                    x={xScale(pokemon.hp) + 13}
                    y={yScale(pokemon.attack) - 12}
                    fontSize="15"
                    fontWeight="bold"
                    fill="#333"
                    pointerEvents="none"
                  >
                    {selectedIndex + 1}
                  </text>
                )}
              </g>
            );
          })}

          {/* Axis labels */}
          <text
            x={width / 2}
            y={height - 12}
            textAnchor="middle"
            fill="#555"
          >
            HP
          </text>

          <text
            x="18"
            y={height / 2}
            textAnchor="middle"
            transform={`rotate(-90 18 ${height / 2})`}
            fill="#555"
          >
            Attack
          </text>
        </svg>

        {/* Right-hand preview area */}
        <div className="scatterplot-preview">
          {mode === "hover" ? (
            hoveredPokemon ? (
              <PokemonCard pokemon={hoveredPokemon} />
            ) : (
              <p className="preview-message">
                Hover over a dot to inspect a Pokémon.
              </p>
            )
          ) : (
            <>
              {comparedPokemons.length < 2 && (
                <p className="compare-hint">
                    Select two dots to compare.
                </p>
                )}

              {comparedPokemons.map((pokemon, index) => (
                <div
                  className="comparison-card"
                  key={pokemon.id}
                >
                  <div className="comparison-label">
                    Selection {index + 1}
                  </div>
                  <PokemonCard pokemon={pokemon} />
                </div>
              ))}

              {comparedPokemons.length < 2 && (
                <p className="preview-message">
                  {comparedPokemons.length === 0
                    ? "Choose your first Pokémon."
                    : "Choose your second Pokémon."}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default PokemonScatterplot;
