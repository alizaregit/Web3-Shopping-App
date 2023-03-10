import { Routes, Route } from "react-router-dom";
import ShopLayout from "./ShopLayout";
import NotFound from "./NotFound";
import Products from "./Products";
import Start from "./Start";
import ProductPage from "./ProductPage";
import Cart from "./Cart";
import Bonus from "./Bonus";
import Faucet from "./Faucet";

const Shop = () => {
  return (
    <div className="bg-black h-full pb-10 text-white">
      <Routes>
        <Route path="/" element={<ShopLayout />}>
          <Route index element={<Start />}></Route>
          <Route path=":id" element={<Products />}></Route>
          <Route path=":id/:id2" element={<ProductPage />}></Route>
          <Route path="/Cart" element={<Cart />}></Route>
          <Route path="/Bonus" element={<Bonus />}></Route>
          <Route path="/Faucet" element={<Faucet />}></Route>
        </Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
};

export default Shop;
