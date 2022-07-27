import waxlogo from './wax-logo.png';
import './App.css';
import React from 'react';
import * as waxjs from "@waxio/waxjs/dist";
import ResourceStart from './ResourceStart.jsx'
import GoldmandGame from './GoldmandGame.jsx'
import {execute_mine, fetch_staked, fetch_unstaked_sest_and_cbit, fetch_food_count, execute_staking} from "./WaxWrapper.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import GoldmandGamePage from "./pages/GoldmandGamePage";
import FarmingTalesPage from "./pages/FarmingTalesPage";
import Team from "./pages/Team";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    // <BaseApp />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="GoldmandGamePage" element={<GoldmandGamePage />} />
          <Route path="FarmingTalesPage" element={<FarmingTalesPage />} />
          <Route path="team" element={<Team />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;