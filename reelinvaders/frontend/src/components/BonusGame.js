import "./BonusGame.css";
import { useEffect, useState } from "react";
import imageEnemy1 from "../assets/enemyBlueFrame1.png";
import imageEnemy2 from "../assets/enemyGreenFrame1.png";
import imageEnemy3 from "../assets/enemyYellowFrame1.png";
import imageEmptyFrame from "../assets/emptyFrame.png";

export default function BonusGame({
  enemyPosition,
  movePlayer,
  showBonusText,
}) {
  const [enemySprites, setEnemySprites] = useState("");

  useEffect(() => {
    const newEnemySprites = (
      <div>
        {enemyPosition.map((data, index) => {
          if (data && index > 7) {
            return (
              <img
                src={imageEnemy3}
                className="enemyImage"
                alt="enemy"
                key={index}
              />
            );
          } else if (data && index > 3) {
            return (
              <img
                src={imageEnemy2}
                className="enemyImage"
                alt="enemy"
                key={index}
              />
            );
          } else if (data) {
            return (
              <img
                src={imageEnemy1}
                className="enemyImage"
                alt="enemy"
                key={index}
              />
            );
          } else if (!data) {
            return (
              <img
                src={imageEmptyFrame}
                className="enemyImage"
                alt="enemy"
                key={index}
              />
            );
          }
        })}
      </div>
    );

    setEnemySprites(newEnemySprites);
  }, [enemyPosition]);

  return (
    <div className="bonusBgnd">
      {enemySprites}
      <div className={`player ${movePlayer ? "playerMoveToShoot" : ""}`} />
      <div className={`bonusText ${showBonusText ? "showBonusText" : ""}`}>
        10 Bonus credits!
      </div>
    </div>
  );
}
