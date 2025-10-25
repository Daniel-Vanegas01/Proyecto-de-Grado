import { useState } from "react";
import { supabase } from "../../supabase";
import "./style.css";

function SubirPrenda() {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [estilo, setEstilo] = useState("");
  const [color, setColor] = useState("");
  const [imagen, setImagen] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Mapa de categorías a estilos actualizado
  const estilosPorCategoria = {
    gorro: ["Beanie", "Boinas", "Gorra de béisbol", "Sombrero de ala", "Visera", "Otros"].sort(),
    camisa: [
      "Blusa elegante",
      "Camisa casual (cuadros, lino, denim)",
      "Camisa formal",
      "Camiseta básica",
      "Camiseta deportiva / atlética",
      "Camiseta gráfica / estampada",
      "Camiseta oversize",
      "Crop top",
      "Polo",
      "Tank top / sin mangas",
      "Top de tirantes / corset / bandeau"
    ].sort(),
    pantalon: [
      "Cargo",
      "Culotte",
      "Deportivos",
      "Jogger",
      "Jeans / Vaqueros",
      "Leggings",
      "Mom jeans",
      "Palazzo",
      "Pinzados",
      "Recto / Regular",
      "Ripped / Rotos",
      "Sastre",
      "Skinny",
      "Slim fit",
      "Streetwear",
      "Wide leg / Pata ancha",
      "Yoga pants",
      "Jogging / Chándal",
      "Pantalones formales / de vestir"
    ].sort(),
    calzado: [
      "Aguja",
      "Bloque",
      "Botas",
      "Botines",
      "Chanclas / slides",
      "Cowboy",
      "Derby",
      "De plataforma",
      "De montaña",
      "Militares",
      "Mocasin",
      "Oxford",
      "Planas",
      "Plataforma",
      "Sandalias",
      "Tacones",
      "Zapatillas deportivas / sneakers",
      "Zapatos formales",
      "Góticas"
    ].sort(),
    traje: ["Business casual", "Casual", "Formal", "Streetwear"].sort(),
    vestido: ["Casual", "Elegante", "Maxi", "Mini", "Midi", "Streetwear"].sort(),
    accesorio: ["Bufanda", "Cinturón", "Collar", "Gafas", "Pulsera", "Reloj", "Otros"].sort()
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!imagen) return alert("Por favor selecciona una imagen");
    if (!categoria) return alert("Selecciona una categoría antes de subir");
    if (!estilo) return alert("Selecciona un estilo de prenda");

    try {
      setCargando(true);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("Usuario no autenticado");

      const fileName = `${user.id}_${Date.now()}_${imagen.name}`;
      const filePath = `${categoria}/${fileName}`;

      const { error: imgError } = await supabase.storage.from("prendas").upload(filePath, imagen);
      if (imgError) throw imgError;

      const { data: publicUrl } = supabase.storage.from("prendas").getPublicUrl(filePath);

      const { error: insertError } = await supabase.from("prendas").insert([
        {
          user_id: user.id,
          nombre,
          categoria,
          estilo,
          color,
          imagen_url: publicUrl.publicUrl,
        },
      ]);

      if (insertError) throw insertError;

      alert("✅ Prenda subida correctamente");
      setNombre(""); setCategoria(""); setEstilo(""); setColor(""); setImagen(null);

    } catch (error) {
      console.error("❌ Error al subir la prenda:", error.message);
      alert("❌ Error al subir la prenda. Revisa la consola.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="form-wrapper">
        <h2>Subir Nueva Prenda</h2>
        <form onSubmit={handleUpload}>
          <div className="input-group">
            <label>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ejemplo: Camisa blanca"
              required
            />
          </div>

          <div className="input-group">
            <label>Categoría</label>
            <select value={categoria} onChange={(e) => { setCategoria(e.target.value); setEstilo(""); }} required>
              <option value="">Selecciona una categoría</option>
              {Object.keys(estilosPorCategoria).sort().map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Estilo</label>
            <select value={estilo} onChange={(e) => setEstilo(e.target.value)} required>
              <option value="">Selecciona un estilo</option>
              {categoria && estilosPorCategoria[categoria].map(est => (
                <option key={est} value={est}>{est}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Color</label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Ejemplo: Azul marino"
              required
            />
          </div>

          <div className="input-group">
            <label>Imagen</label>
            <input type="file" accept="image/*" onChange={(e) => setImagen(e.target.files[0])} required />
          </div>

          <button type="submit" className="btn-submit" disabled={cargando}>
            {cargando ? "Subiendo..." : "Subir Prenda"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubirPrenda;
