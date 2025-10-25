import { useState, useEffect, useRef } from "react";
import { supabase } from "../../supabase";
import "./style.css";

function Closet() {
  const [user, setUser] = useState(null);
  const [prendas, setPrendas] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("camisa");
  const [seleccionadas, setSeleccionadas] = useState({
    camisa: null,
    pantalon: null,
    calzado: null,
    gorro: null,
    accesorio: null,
  });
  const [outfits, setOutfits] = useState([]);
  const [cargando, setCargando] = useState(true);
  const scrollRef = useRef(null);

  // 🔹 Obtener usuario y prendas
  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        await cargarPrendas(user.id);
        await cargarOutfits(user.id);
      }
      setCargando(false);
    };
    fetchData();
  }, []);

  // 🔹 Cargar prendas del usuario
  const cargarPrendas = async (userId) => {
    const { data, error } = await supabase
      .from("prendas")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) console.error("Error al cargar prendas:", error);
    else setPrendas(data);
  };

  // 🔹 Cargar outfits guardados
  const cargarOutfits = async (userId) => {
    const { data, error } = await supabase
      .from("outfits")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) console.error("Error al cargar outfits:", error);
    else setOutfits(data);
  };

  // 🔹 Seleccionar prenda
  const handleSelectPrenda = (prenda) => {
    setSeleccionadas((prev) => ({
      ...prev,
      [prenda.categoria]: prenda,
    }));
  };

  // 🔹 Deseleccionar prenda
  const handleDeselectPrenda = (categoria) => {
    setSeleccionadas((prev) => ({
      ...prev,
      [categoria]: null,
    }));
  };

  // 🔹 Generar look aleatorio
  const generarLook = () => {
    const categorias = ["camisa", "pantalon", "calzado"];
    const nuevoLook = { ...seleccionadas };
    categorias.forEach((cat) => {
      const prendasCat = prendas.filter((p) => p.categoria === cat);
      if (prendasCat.length > 0) {
        const randomIndex = Math.floor(Math.random() * prendasCat.length);
        nuevoLook[cat] = prendasCat[randomIndex];
      }
    });
    setSeleccionadas(nuevoLook);
  };

  // 🔹 Guardar look
  const guardarLook = async () => {
    if (!user) return alert("❌ No hay usuario autenticado");

    const prendasSeleccionadas = Object.values(seleccionadas).filter(Boolean);

    if (prendasSeleccionadas.length === 0)
      return alert("👕 No hay prendas seleccionadas para guardar.");

    try {
      const { error } = await supabase.from("outfits").insert([
        {
          user_id: user.id,
          nombre: `Outfit ${outfits.length + 1}`,
          combinacion: prendasSeleccionadas,
        },
      ]);

      if (error) throw error;

      alert("✅ Outfit guardado exitosamente");
      await cargarOutfits(user.id); // recargar lista de outfits
    } catch (error) {
      console.error(error);
      alert("❌ Error al guardar el outfit");
    }
  };

  // 🔹 Scroll catálogo
  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "right" ? 200 : -200,
        behavior: "smooth",
      });
    }
  };

  // 🔹 Cargar outfit seleccionado en prendas seleccionadas
  const cargarOutfitSeleccionado = (outfit) => {
    const nuevoSeleccionadas = {
      camisa: null,
      pantalon: null,
      calzado: null,
      gorro: null,
      accesorio: null,
    };
    outfit.combinacion.forEach((prenda) => {
      nuevoSeleccionadas[prenda.categoria] = prenda;
    });
    setSeleccionadas(nuevoSeleccionadas);
  };

  if (cargando) return <p className="loading-text">Cargando tu closet...</p>;

  return (
    <div className="closet-wrapper">
      {/* 🟢 Prendas Seleccionadas */}
      <div className="selected-prendas-container">
        <h2>Prendas Seleccionadas</h2>
        <div className="seleccionadas-grid">
          {Object.entries(seleccionadas).map(([cat, prenda]) =>
            prenda ? (
              <div
                key={cat}
                className="prenda-seleccionada"
                onClick={() => handleDeselectPrenda(cat)}
              >
                <img src={prenda.imagen_url} alt={prenda.nombre} />
                <p>{prenda.nombre}</p>
              </div>
            ) : (
              <div key={cat} className="prenda-vacia">
                <p>{cat.toUpperCase()}</p>
              </div>
            )
          )}
        </div>

        <div className="buttons-container">
          <button className="btn-look" onClick={generarLook}>🎲 Generar Look</button>
          <button className="btn-save" onClick={guardarLook}>💾 Guardar Outfit</button>
        </div>
      </div>

      {/* 🟢 Catálogo */}
      <div className="catalogo-container">
        <h2>Tu Catálogo</h2>
        <div className="categorias-wrapper">
          <button className="scroll-btn left" onClick={() => scroll("left")}>‹</button>
          <div className="categorias-scroll" ref={scrollRef}>
            {["gorro", "camisa", "pantalon", "calzado", "traje", "vestido", "accesorio"].map((cat) => (
              <button
                key={cat}
                className={`cat-btn ${categoriaSeleccionada === cat ? "active" : ""}`}
                onClick={() => setCategoriaSeleccionada(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          <button className="scroll-btn right" onClick={() => scroll("right")}>›</button>
        </div>

        <div className="prendas-grid">
          {prendas.filter((p) => p.categoria === categoriaSeleccionada).length > 0 ? (
            prendas
              .filter((p) => p.categoria === categoriaSeleccionada)
              .map((prenda) => (
                <div
                  key={prenda.id}
                  className="prenda-item"
                  onClick={() => handleSelectPrenda(prenda)}
                >
                  <img src={prenda.imagen_url} alt={prenda.nombre} />
                  <p>{prenda.nombre}</p>
                </div>
              ))
          ) : (
            <p className="sin-prendas">No tienes prendas en esta categoría.</p>
          )}
        </div>
      </div>

      {/* 🟢 Outfits Guardados (Lista) */}
      <div className="outfits-container">
        <h2>Outfits Guardados</h2>
        {outfits.length > 0 ? (
          <ul className="outfits-list">
            {outfits.map((outfit, index) => (
              <li
                key={outfit.id}
                className="outfit-list-item"
                onClick={() => cargarOutfitSeleccionado(outfit)}
              >
                Outfit {index + 1}
              </li>
            ))}
          </ul>
        ) : (
          <p>No tienes outfits guardados aún.</p>
        )}
      </div>
    </div>
  );
}

export default Closet;
