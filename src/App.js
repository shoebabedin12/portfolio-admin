import "./App.css";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
          <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
