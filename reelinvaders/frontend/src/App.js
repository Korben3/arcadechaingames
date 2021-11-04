import "./App.css";
import { useState } from "react";
import ReelInvaders from "./pages/ReelInvaders";
import StartScreen from "./pages/StartScreen";
import DesktopOnly from "./components/DesktopOnly";
import Footer from "./components/Footer";
import { UserContext } from "./utils/context";

function App() {
  const [page, setPage] = useState("startscreen");
  const [userInfo, setUserInfo] = useState(null);

  const selectGame = (option) => {
    if (userInfo) {
      setPage(option);
    }
  };

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      <div className="App">
        <DesktopOnly />

        {
          {
            startscreen: <StartScreen selectGame={selectGame} />,
            reelinvaders: <ReelInvaders selectGame={selectGame} />,
          }[page]
        }
        <Footer />
      </div>
    </UserContext.Provider>
  );
}

export default App;
