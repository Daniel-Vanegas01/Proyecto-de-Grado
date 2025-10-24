import { useState } from "react";
import { supabase } from "../../supabase";
import "./style.css";

function SubirPrenda() {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [color, setColor] = useState("");
  const [imagen, setImagen] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!imagen) {
      alert("Por favor selecciona una imagen");
      return;
    }

    try {
      setCargando(true);

      // Subir imagen al storage de Supabase
      const fileName = `${Date.now()}_${imagen.name}`;
      const { data: imgData, error: imgError } = await supabase.storage
        .from("prendas")
        .upload(fileName, imagen);

      if (imgError) throw imgError;

      const { data: publicUrl } = supabase.storage
        .from("prendas")
        .getPublicUrl(fileName);

      // Guardar datos de la prenda en la tabla
      const { error: insertError } = await supabase.from("prendas").insert([
        {
          nombre,
          categoria,
          color,
          imagen_url: publicUrl.publicUrl,
        },
      ]);

      if (insertError) throw insertError;

      alert("✅ Prenda subida correctamente");
      setNombre("");
      setCategoria("");
      setColor("");
      setImagen(null);
    } catch (error) {
      console.error(error);
      alert("❌ Error al subir la prenda");
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
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            >
              <option value="">Selecciona una categoría</option>
              <option value="camisa">Camisa</option>
              <option value="pantalon">Pantalón</option>
              <option value="zapatos">Zapatos</option>
              <option value="gorro">Gorro</option>
              <option value="traje">Traje</option>
              <option value="vestido">Vestido</option>
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
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImagen(e.target.files[0])}
              required
            />
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
