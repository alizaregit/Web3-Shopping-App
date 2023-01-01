import "../dist/output.css";
import "./otherStyles.css";
import { useState, useEffect } from "react";
import Home from "./components/Home";
import items from "./items.json";
import IMG from "./components/images";
import { Routes, Route } from "react-router-dom";
import Shop from "./components/Shop";
import QA from "./components/QA";
import NotFound from "./components/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Home />}></Route>
        <Route path="Shop" element={<Shop />}></Route>
        <Route path="QA" element={<QA />}></Route>
      </Route>
      <Route path="*" element={<NotFound />}></Route>
    </Routes>
  );
}

export default App;
