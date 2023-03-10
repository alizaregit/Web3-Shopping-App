import Home from "./components/Home";
import { Routes, Route } from "react-router-dom";
import Shop from "./components/Shop";
import QA from "./components/QA";
import NotFound from "./components/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Home />}></Route>
        <Route path="QA" element={<QA />}></Route>
      </Route>
      <Route path="*" element={<NotFound />}></Route>
      <Route path="/Shop/*" element={<Shop />}></Route>
    </Routes>
  );
}

export default App;
