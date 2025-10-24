import { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import "./style.css";

function Closet() {
  const [prendas, setPrendas] = useState([]);
  const [avatarPrendas, setAvatarPrendas] = useState({});
  const [categoria, setCategoria] = useState("Camisas");
  const [outfitsGuardados, setOutfitsGuardados] = useState([]);
  const avatarDummy = "https://github.com/Daniel-Vanegas01/Proyecto-final/blob/main/dummy_m.png?raw=true";

  const categorias = ["Gorros", "Camisas", "Pantalones", "Zapatos", "Trajes", "Accesorios"];
  const ordenCapas = ["Pantalones", "Zapatos", "Camisas", "Accesorios", "Gorros", "Trajes"];

  useEffect(() => {
    async function obtenerPrendas() {
      const { data, error } = await supabase.from("prendas").select("*");
      if (!error) setPrendas(data);
    }
    obtenerPrendas();
  }, []);

  const seleccionarPrenda = (prenda) => {
    setAvatarPrendas(prev => ({ ...prev, [prenda.categoria]: prenda.imagen }));
  };

  const generarCombinacion = () => {
    const nuevaCombinacion = {};
    categorias.forEach(cat => {
      const prendasCat = prendas.filter(p => p.categoria === cat);
      if (prendasCat.length > 0) {
        const aleatoria = prendasCat[Math.floor(Math.random() * prendasCat.length)];
        nuevaCombinacion[cat] = aleatoria.imagen;
      }
    });
    setAvatarPrendas(nuevaCombinacion);
  };

  const guardarOutfit = () => {
    if (Object.keys(avatarPrendas).length === 0) return alert("Selecciona prendas primero");
    setOutfitsGuardados(prev => [...prev, avatarPrendas]);
    alert("Outfit guardado!");
  };

  return (
    <div className="closet-container">
      <div className="avatar-section">
        <div className="avatar-cuadro">
          <img src={avatarDummy} alt="Avatar" className="avatar-base" />
          {ordenCapas.map(cat =>
            avatarPrendas[cat] ? (
              <img key={cat} src={avatarPrendas[cat]} alt={cat} className={`avatar-${cat.toLowerCase()}`} />
            ) : null
          )}
        </div>
        <div className="botones-avatar">
          <button onClick={generarCombinacion}>🎲 Generar combinación</button>
          <button onClick={guardarOutfit}>💾 Guardar outfit</button>
          <button onClick={() => alert("Aquí se mostrarían los avatares guardados")}>👗 Avatares guardados</button>
        </div>
      </div>

      <div className="catalogo-section">
        <h3>Catálogo: {categoria}</h3>
        <div className="categorias-scroll">
          {categorias.map(cat => (
            <button
              key={cat}
              className={cat === categoria ? "cat-activa" : ""}
              onClick={() => setCategoria(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="prendas-scroll">
          {prendas
            .filter(p => p.categoria === categoria)
            .map(prenda => (
              <img
                key={prenda.id}
                src={prenda.imagen}
                alt={prenda.nombre}
                className="prenda-item"
                onClick={() => seleccionarPrenda(prenda)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Closet;
