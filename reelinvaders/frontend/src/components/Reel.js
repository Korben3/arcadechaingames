import "./Reel.css";
import { useEffect, useState } from "react";
import symbolImages from "../assets/symbols/";

export default function Reel({ rollTo, reelNumber, spin }) {
  const [symbols, setSymbols] = useState("");

  useEffect(() => {
    // add "random" symbols, this is just to fill until we show the symbol chosen by the blockchain
    let randSymbols = [];
    let randStart = Math.floor(Math.random() * 5);
    for (let i = 0; i < 10; i++) {
      randSymbols[i] = randStart;
      randStart += 1;
      if (randStart === 5) {
        randStart = 0;
      }
    }
    // now add the symbol detemined by the chain
    randSymbols.unshift(rollTo - 1);
    // and add another one to make sure the chosen one is in the middle
    randSymbols.unshift(Math.floor(Math.random() * 5));

    const newSymbols = randSymbols.map((data, index) => (
      <img src={symbolImages[data]} alt="symbol" key={index} />
    ));
    setSymbols(newSymbols);
  }, [rollTo]);

  return (
    <div className="reel">
      <div
        className={`symbolsContainer ${
          spin
            ? reelNumber === "1"
              ? "reel1spin"
              : reelNumber === "2"
              ? "reel2spin"
              : "reel3spin"
            : "reelStart"
        }`}
      >
        {symbols}
      </div>
      <div className="reelEdge"></div>
    </div>
  );
}
