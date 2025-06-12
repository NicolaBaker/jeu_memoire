import React, { useEffect, useState } from 'react';
import monImg from './Page/question.png';
import styles from './Jeu.module.css';

// Les 3 types d'emojis selon le choix
const EMOJIS = {
  Visage: ['😀',"🥳", '😎',"😛", '😡', '😢', '😍', '🙂',"😈","🤢","😱","🧐","🫣"],
  Manger: ['🍎', '🍔', '🍕',"🍭", '🍩', '🍉', '🍟',"🍐","🌭","🥪","🍊","🥕","🍓","🌽"],
  Animal: ['🐶', '🐱', '🦊', '🐷', '🐸', '🐵',"🐺","🦝","🐰","🐹","🐨","🐻","🐮"],
};
function melanger(array) {
  return array.sort(() => Math.random() - 0.5);
}

export default function Jeu({ parametres, onRestart }) {
  const { difficulte, emojiType, erreursMax } = parametres;

  const [cartes, setCartes] = useState([]);
  const [selection, setSelection] = useState([]);
  const [trouvees, setTrouvees] = useState([]);
  const [erreurs, setErreurs] = useState(0);
  const [gagne, setGagne] = useState(false);
  const [perdu, setPerdu] = useState(false);

  // Préparer les cartes au début du jeu
  useEffect(() => {
    let tousEmojis = EMOJIS[emojiType];
    let emojisAleatoires = melanger([...tousEmojis]).slice(0, difficulte);
    let cartesMelangees = [...emojisAleatoires, ...emojisAleatoires]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji, cachee: true }));

    setCartes(cartesMelangees);
  }, [difficulte, emojiType]);

  // Vérifie si toutes les paires sont trouvées
  useEffect(() => {
    if (trouvees.length === difficulte) {
      setGagne(true);
    }
  }, [trouvees]);

  // Vérifie si on a perdu
  useEffect(() => {
    if (erreurs >= erreursMax) {
      setPerdu(true);
    }
  }, [erreurs, erreursMax]);

  // Quand on clique sur une carte
  const handleClick = (carte) => {
    if (!carte.cachee || selection.length === 2 || perdu || gagne) return;

    const newSelection = [...selection, carte];
    setSelection(newSelection);

    const cartesAffichees = cartes.map((c) =>
      c.id === carte.id ? { ...c, cachee: false } : c
    );
    setCartes(cartesAffichees);

    if (newSelection.length === 2) {
      const [c1, c2] = newSelection;

      if (c1.emoji === c2.emoji) {
        setTrouvees([...trouvees, c1.emoji]);
        setSelection([]);
      } else {
        setTimeout(() => {
          const cartesCachees = cartesAffichees.map((c) =>
            c.id === c1.id || c.id === c2.id ? { ...c, cachee: true } : c
          );
          setCartes(cartesCachees);
          setSelection([]);
        }, 1000);
        setErreurs(erreurs + 1);
      }
    }
  };
  const getGridClass = () => {
    if (difficulte === 2) return styles.col2;
    if (difficulte === 3) return styles.col3;
    if (difficulte === 4 || difficulte === 6 || difficulte === 8) return styles.col4;
    if (difficulte === 10) return styles.grille5colonnes;
    return styles.col4;
  };

  return (
    <div className={styles.conteneur}>
      {/* Menu du haut */}
      <div className={styles.boiteBlanche}>
        <h2 className={styles.titre}>Jeu de Mémoire</h2>

        <div className={styles.infos}>
          <div>Paires trouvées : {trouvees.length}/{difficulte}</div>
          <div>Erreurs : {erreurs}/{erreursMax}</div>
        </div>

        {/* Barre d'erreur */}
        <div className={styles.barreErreurFond}>
          <div
            className={styles.barreErreur}
            style={{ width: `${(erreurs / erreursMax) * 100}%` }}
          ></div>
        </div>

        {/* Boutons */}
        <div className={styles.boutons}>
          <button className={styles.boutonBleu} onClick={onRestart}>Paramètre</button>
          <button className={styles.boutonBleu} onClick={() => window.location.reload()}>
            Recommencer
          </button>
        </div>
      </div>

      {/* Grille des cartes */}
      <div className={`${styles.grilleCartes} ${getGridClass()}`}>

        {cartes.map((carte) => (
          <div
            key={carte.id}
            className={styles.carte}
            onClick={() => handleClick(carte)}
          >
            <div className={`${styles.face} ${!carte.cachee ? styles.faceRetournee : ''}`}>
              <div className={styles.faceAvant}><img src={monImg} alt="?" className={styles.imageCentre} /></div>
              <div className={styles.faceArriere}>{carte.emoji}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Message si on gagne */}
      {(gagne || perdu) && (
        <div className={styles.popup}>
          <div className={styles.popupContenu}>
            <h2>{gagne ? "🎉 Bravo t'as gagné !" : "💥 Oups t'as perdu 😢"}</h2>
            <button className={styles.boutonBleu} onClick={onRestart}>
              Rejouer
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
