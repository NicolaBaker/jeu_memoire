import React, { useState } from "react";
import styles from "./Parametre.module.css";

export default function Parametre({ onStart }) {
  const [difficulte, setDifficulte] = useState(6);
  const [emojiType, setEmojiType] = useState("Visage");
  const [erreursMax, setErreursMax] = useState(3);

  // Quand on clique sur "Jouer"
  const handleStart = () => {
    onStart({ difficulte, emojiType, erreursMax });
  };

  return (
    <div className={styles.boiteBlanche}>
      <h1 className={styles.titre}>Jeu de Mémoire</h1>

      {/* Slider difficulté */}
      <div className={styles.section}>
        <label className={styles.label}>Difficulté</label>
        <input
          type="range"
          min="2"
          max="10"
          value={difficulte}
          onChange={(e) => {
            const val = Number(e.target.value);
            // Bloque
            if (val === 5) return;
            if (val === 7) return;
            if (val === 9) return;
            setDifficulte(val);
          }}
          className={styles.range}
        />
        <div className={styles.rangeLabel}>
          <span>Débutant</span>
          <span>Avancé</span>
        </div>
      </div>

      {/* Choix emojis*/}
      <div className={styles.boutonChoix}>
        {[
          { label: "🍉🍟🌭", value: "Manger" }, { label: "😍😡🙂", value: "Visage" },
          { label: "🐶🐷🐱", value: "Animal" }
        ].map(({ label, value }) => (
          <button key={value} onClick={() => setEmojiType(value)} className={emojiType === value ? styles.boutonViolet : styles.boutonBleu}>{label}</button>
        ))}
      </div>

      {/* Slider erreurs*/}
      <div className={styles.section}>
        <label className={styles.label}>Erreurs permises</label>
        <input
          type="range"
          min="1"
          max="20"
          value={erreursMax}
          onChange={(e) => setErreursMax(Number(e.target.value))}
          className={styles.range}
        />
        <div className={styles.rangeLabel}>
          <span>1</span>
          <span>20</span>
        </div>
      </div>

      {/*Button pour jouer*/}
      <button onClick={handleStart} className={styles.boutonNoir}>Jouer</button>
    </div>
  );
}
