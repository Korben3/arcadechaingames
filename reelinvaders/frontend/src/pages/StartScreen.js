import { useEffect, useState, useContext } from "react";
import { UserContext } from "../utils/context";
import * as cryptography from "@liskhq/lisk-cryptography";
import * as passphrase from "@liskhq/lisk-passphrase";
import { formatBalance, generateNewAccount } from "../utils/helpers";
import * as api from "../utils/api";
import "./StartScreen.css";

export default function StartScreen({ selectGame }) {
  const [userPassphrase, setUserPassphrase] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [enableLogin, setEnableLogin] = useState(true);
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [messageMain, setMessageMain] = useState(
    "Login with your passphrase or create a new account."
  );
  const [accountInfo, setAccountInfo] = useState("");

  useEffect(() => {
    if (userInfo) {
      login(userInfo.passphrase);
    }
  }, []);

  const handleChange = (data) => {
    setUserPassphrase(data.target.value.trim());
  };

  const handleLogin = () => {
    if (enableLogin) {
      login(userPassphrase);
    }
  };

  const handleNewAccount = () => {
    setEnableLogin(false);
    let userPass = generateNewAccount();
    setUserPassphrase(userPass);
    console.log(
      cryptography.getAddressFromPassphrase(userPass).toString("hex")
    );
    api.fundAccount(cryptography.getAddressFromPassphrase(userPass));
    setMessageMain(
      `New account created, now adding ACG test tokens. Please wait...`
    );
    setTimeout(fundingDone, 5000, userPass);
  };

  const fundingDone = (userPass) => {
    setMessageMain(
      "Account funded, please keep your passphrase save and click login."
    );
    setEnableLogin(true);
  };

  const login = async (userPass) => {
    const errors = passphrase.validation.getPassphraseValidationErrors(
      userPass
    );
    if (!errors.length) {
      setUserInfo({ passphrase: userPass });
      let address = cryptography.getBase32AddressFromPassphrase(userPass);
      const account = await api.getAccount(
        cryptography.getAddressFromPassphrase(userPass)
      );
      if (account === "notFound") {
        setMessageMain(
          `New account, add balance or login with a different account.`
        );
      } else {
        let balance = formatBalance(account.token.balance);
        setMessageMain(`Click on a game to start playing`);
        setAccountInfo(`Account: ${address} Balance: ${balance} ACG`);
        setLoggedIn(true);
      }
    } else {
      setMessageMain("Incorrect passphrase.");
    }
  };

  return (
    <div>
      <div className="title" />
      <div className="gameSelect">
        <div className="game_reelinvaders game_greyLeft"></div>
        <div
          className={`game_reelinvaders game_center ${
            loggedIn ? "game_clickable" : ""
          }`}
          onClick={() => selectGame("reelinvaders")}
        ></div>
        <div className="game_reelinvaders game_greyRight"></div>
      </div>
      {!loggedIn ? (
        <div>
          <div className="loginContainer">
            <input
              type="text"
              id="passhphrase"
              onChange={handleChange}
              value={userPassphrase}
            />
            <div
              className={`buttonLogin ${
                !enableLogin ? "buttonLoginDisabled" : ""
              }`}
              onClick={handleLogin}
            />
          </div>
          <div className="buttonNewAccount" onClick={handleNewAccount} />
        </div>
      ) : (
        ""
      )}
      <div className="infoText">- {messageMain} -</div>
      <div className="infoTextAccount">{accountInfo}</div>
    </div>
  );
}
