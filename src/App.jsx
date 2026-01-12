import { BrowserRouter, Route, Routes } from "react-router-dom";
import UnderConstruction from "./pages/UnderConstruction.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<UnderConstruction />} />
      </Routes>
    </BrowserRouter>
  );
}
