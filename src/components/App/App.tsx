// import { useState } from "react";
// import reactLogo from "../../assets/react.svg";
// import viteLogo from "../../assets/vite.svg";

import "./App.scss";

import Hero from "../Hero/Hero";
import Form from "../Form/Form";
import Result from "../Result/Result";

function App() {
  return (
    <div className="app">
      <Hero />
      <Form />
      <Result />
    </div>
  );
}

export default App;
