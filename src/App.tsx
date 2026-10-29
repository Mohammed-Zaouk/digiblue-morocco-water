import { Route, Routes } from "react-router";

import Footer from "./components/Footer";
import Header from "./components/Header";
import Story from "./pages/Story";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Story />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;