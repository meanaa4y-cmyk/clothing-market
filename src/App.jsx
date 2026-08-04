import { lazy, Suspense, useLayoutEffect } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";

import SpinnerComponent from './components/spinner/spinner.component.jsx';

const Navigation = lazy(() => import('./routes/navigation/navigation.component'));
const Home = lazy(() => import('./routes/home/home.component'));
const Shop = lazy(() => import('./routes/shop/shop.component'));
const CartComponent = lazy(() => import('./routes/cart/cart.component'));
const Admin = lazy(() => import('./routes/admin/admin.component'));

const App = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <Suspense fallback={<SpinnerComponent />}>
      <Routes>
        <Route path='/' element={<Navigation />}>
          <Route index element={<Home />} />
          <Route path='shop/*' element={<Shop />} />
          <Route path='cart' element={<CartComponent />} />
          <Route path='admin' element={<Admin />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
