import { Link } from "react-router-dom";



export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404 - Puslapis nerastas</h1>
      <p>Atrodo, kad šis puslapis neegzistuoja.</p>
      <Link to="/">Grįžti į pradžią</Link>
    </div>
  );
}
