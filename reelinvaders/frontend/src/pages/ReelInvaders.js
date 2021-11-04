import { useEffect, useState, useContext } from "react";
import { UserContext } from "../utils/context";
import * as cryptography from "@liskhq/lisk-cryptography";
import { formatBalance } from "../utils/helpers";
import * as api from "../utils/api";
import Reel from "../components/Reel";
import PayTable from "../components/PayTable";
import BonusGame from "../components/BonusGame";
import tripleWins from "../config/tripleWins.json";
import FX from "../assets/sounds";
import { SPINCOST, MINREQBALANCE } from "../config/config.json";
import "./ReelInvaders.css";
const $ = document.getElementById.bind(document);

export default function ReelInvaders({ selectGame }) {
  const { userInfo } = useContext(UserContext);
  const [spinreelTxId, setSpinreelTxId] = useState("none");
  const [spinReelText, setSpinreelText] = useState("SPIN REELS");
  const [eventData, setEventData] = useState({
    symbols: "",
    transactionId: "",
  });
  const [spin, setSpin] = useState(false);
  const [showBonusText, setShowBonusText] = useState(false);
  const [movePlayer, setMovePlayer] = useState(false);
  const [spinButtonEnabled, setSpinButtonEnabled] = useState(true);
  const [credits, setCredits] = useState(0);
  const [paid, setPaid] = useState(0);
  const [enemies, setEnemies] = useState(12);
  const [reelResult, setReelResult] = useState([1, 2, 3]);
  const [enemyPosition, setEnemyPosition] = useState(Array(12).fill(1));

  useEffect(() => {
    login(userInfo.passphrase);
    api.subscribeToSpinreel(checkEvent);
    return function cleanup() {
      // api.unSubscribeToSpinreel();
    };
  }, []);

  useEffect(() => {
    if (eventData.transactionId === spinreelTxId) {
      console.log("received correct tx id of player");
      setSpinreelTxId("playing");
      spinReels(eventData.symbols);
    }
  }, [eventData]);

  const checkEvent = (data) => {
    setEventData(data);
  };

  const login = async (userPassphrase) => {
    let address = cryptography
      .getAddressFromPassphrase(userInfo.passphrase)
      .toString("hex");
    const account = await api.getAccount(address);

    setCredits(formatBalance(account.token.balance));
    setEnemies(account.reelinvaders.enemies);
    setNewEnemyPosition(12 - account.reelinvaders.enemies); // continue last game
  };

  const spinReelsButton = async () => {
    if (credits > SPINCOST + MINREQBALANCE && spinButtonEnabled) {
      setSpinButtonEnabled(false);
      setCredits(credits - SPINCOST); // same in backend
      let newSpinreelTxId = await api.sendSpinReelTransaction(
        userInfo.passphrase
      );
      console.log(newSpinreelTxId);
      setSpinreelTxId(newSpinreelTxId);
    } else if (credits < SPINCOST + MINREQBALANCE) {
      setSpinreelText("LOW BALANCE");
    }
  };

  const spinReels = (randSymbols) => {
    setReelResult(randSymbols);

    console.log("spin");
    setSpin(true);
    let fx_turnReels = $("fx_turnReels");
    fx_turnReels.play();

    let prizesTotal = 0;
    let randSymbolsString = randSymbols.toString();
    let cherries = 0;
    let ammo = 0;
    if (tripleWins[randSymbolsString]) {
      prizesTotal = tripleWins[randSymbolsString];
      if (randSymbolsString === "4,4,4") {
        ammo = 3;
      }
    } else {
      cherries = (randSymbolsString.match(/2/g) || []).length;
      ammo = (randSymbolsString.match(/4/g) || []).length;
      prizesTotal = cherries + ammo;
    }

    setTimeout(resetReelsAnimation, 3000, prizesTotal, credits, ammo);
    setTimeout(enableSpinButton, 5000);
  };

  const setNewEnemyPosition = (enemiesGone) => {
    let newEnemyPosition = [...enemyPosition];
    let i = 12;
    let j = 0;
    do {
      if (enemyPosition[i]) {
        newEnemyPosition[i] = 0;
        j++;
      }
      i--;
    } while (j < enemiesGone);
    setEnemyPosition(newEnemyPosition);
  };

  const resetReelsAnimation = (prizesTotal, credits, enemiesGone) => {
    let fx_win = $("fx_win");
    let fx_winTriple = $("fx_winTriple");
    let fx_hit1 = $("fx_hit1");
    let fx_hit2 = $("fx_hit2");
    let fx_hit3 = $("fx_hit3");

    if (prizesTotal > 3) {
      fx_winTriple.play();
    } else if (prizesTotal > 0) {
      fx_win.play();
    }
    setSpin(false);

    // check if all enemies are gone if true pay bonus or remove enemies, same as on chain
    if (enemies - enemiesGone < 1) {
      fx_hit3.play();
      fx_winTriple.play();
      prizesTotal += 10;
      setEnemies(12);
      setShowBonusText(true);
      let newEnemyPosition = [...enemyPosition];
      newEnemyPosition.fill(1);
      setEnemyPosition(newEnemyPosition);
      setTimeout(removeBonusText, 5000);
    } else {
      setEnemies(Math.max(enemies - enemiesGone, 0));
      if (enemiesGone > 0) {
        setNewEnemyPosition(enemiesGone);
        setMovePlayer(true);
        setTimeout(resetPlayerAnimation, 3500);
      }
      if (enemiesGone === 3) {
        fx_hit3.play();
      } else if (enemiesGone === 2) {
        fx_hit2.play();
      } else if (enemiesGone === 1) {
        fx_hit1.play();
      }
    }

    setPaid(prizesTotal); // make countup animation
    setCredits(credits + prizesTotal);
  };

  const resetPlayerAnimation = () => {
    setMovePlayer(false);
  };

  const removeBonusText = () => {
    setShowBonusText(false);
  };

  const enableSpinButton = () => {
    setSpinButtonEnabled(true);
  };

  return (
    <div>
      <div className="reelInvaders">
        <div className="reels">
          <Reel rollTo={reelResult[0]} reelNumber="1" spin={spin} />
          <Reel rollTo={reelResult[1]} reelNumber="2" spin={spin} />
          <Reel rollTo={reelResult[2]} reelNumber="3" spin={spin} />
        </div>
        <BonusGame
          enemyPosition={enemyPosition}
          movePlayer={movePlayer}
          showBonusText={showBonusText}
        />
        <audio id="fx_turnReels" src={FX.turnReels} preload="auto" />
        <audio id="fx_win" src={FX.win} preload="auto" />
        <audio id="fx_winTriple" src={FX.winTriple} preload="auto" />
        <audio id="fx_hit1" src={FX.hit1} preload="auto" />
        <audio id="fx_hit2" src={FX.hit2} preload="auto" />
        <audio id="fx_hit3" src={FX.hit3} preload="auto" />
      </div>
      <div className="slotButton">
        <span
          className="slotButtonText"
          onClick={() => selectGame("startscreen")}
        >
          CASH OUT
        </span>
      </div>
      <div className="slotDisplay">
        CREDITS:{String(credits).padStart(5, "0")}
      </div>
      <div className="slotDisplay">PAID:{String(paid).padStart(2, "0")}</div>
      <div className="slotDisplay">
        ENEMIES:{String(enemies).padStart(2, "0")}
      </div>
      <div
        onClick={spinReelsButton}
        className={`slotButton ${
          !spinButtonEnabled ? "slotButtonDisabled" : ""
        }`}
      >
        <span className="slotButtonText">{spinReelText}</span>
      </div>
      <PayTable />
    </div>
  );
}
