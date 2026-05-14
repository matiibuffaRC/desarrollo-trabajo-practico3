// Dependencias
import { Routes, Route } from "react-router-dom";

// Componentes
import Header from "../src/components/Header/Header.jsx";

// Pages
import HomePage from "./pages/HomePage.jsx" 

function App() {
        return (
            <>
                <Header></Header>
                <Routes>
                    <Route path="/" element={<HomePage />}></Route>
                </Routes>
            </>
        )
}

export default App
