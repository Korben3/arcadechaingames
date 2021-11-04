import "./PayTable.css";
import symbolImages from "../assets/symbols/";

export default function PayTable() {
  return (
    <div className="payTable">
      <div className="symbolImageContainer">
        <img className="symbolImage" src={symbolImages[0]} alt="lisk" />
        <img className="symbolImage" src={symbolImages[0]} alt="lisk" />
        <img className="symbolImage" src={symbolImages[0]} alt="lisk" />
        <span className="symbolCredits">50</span>
      </div>
      <div className="symbolImageContainer">
        ANY ONE
        <img className="symbolImage" src={symbolImages[1]} alt="cherry" />
        <span className="symbolCredits">1</span>
      </div>
      <div className="symbolImageContainer">
        ANY TWO
        <img className="symbolImage" src={symbolImages[1]} alt="cherry" />
        <span className="symbolCredits">2</span>
      </div>
      <div className="symbolImageContainer">
        <img className="symbolImage" src={symbolImages[1]} alt="cherry" />
        <img className="symbolImage" src={symbolImages[1]} alt="cherry" />
        <img className="symbolImage" src={symbolImages[1]} alt="cherry" />
        <span className="symbolCredits">5</span>
      </div>
      <div className="symbolImageContainer">
        ANY ONE
        <img className="symbolImage" src={symbolImages[3]} alt="ammo" />
        <span className="symbolCredits">1</span>
      </div>
      <div className="symbolImageContainer">
        ANY TWO
        <img className="symbolImage" src={symbolImages[3]} alt="ammo" />
        <span className="symbolCredits">2</span>
      </div>
      <div className="symbolImageContainer">
        <img className="symbolImage" src={symbolImages[3]} alt="ammo" />
        <img className="symbolImage" src={symbolImages[3]} alt="ammo" />
        <img className="symbolImage" src={symbolImages[3]} alt="ammo" />
        <span className="symbolCredits">3</span>
      </div>
      <div className="symbolImageContainer">
        <img className="symbolImage" src={symbolImages[4]} alt="health" />
        <img className="symbolImage" src={symbolImages[4]} alt="health" />
        <img className="symbolImage" src={symbolImages[4]} alt="health" />
        <span className="symbolCredits">8</span>
      </div>
    </div>
  );
}
