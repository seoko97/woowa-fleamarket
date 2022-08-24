import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Template from "@components/template";
import ProductWritePage from "./pages/ProductWritePage";
import CategroyPage from "./pages/CategoryPage";
import CoverPage from "./pages/CoverPage";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";

const App = () => {
  const location = useLocation();

  const childFactory = (child: React.ReactElement) => {
    return React.cloneElement(child, { classNames: "fade" });
  };

  return (
    <Template>
      <TransitionGroup className="transition-group" childFactory={childFactory}>
        <CSSTransition key={location.pathname} timeout={350}>
          <Routes location={location}>
            <Route path="/" element={<CoverPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/category" element={<CategroyPage />} />
            <Route path="/product/write" element={<ProductWritePage />} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </Template>
  );
};

export default App;
