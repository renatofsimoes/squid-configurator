import "./App.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div id="page">
      <NavBar />
      <div id="content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
