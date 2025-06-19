import React, { useEffect, useState } from "react";
import monImg from "./Page/question.png";
import styles from "./Jeu.module.css";

// Les 3 emojis
const EMOJIS = {
  Visage: ["😀","🥳", "😎","😛", "😡", "😢", "😍", "🙂","😈","🤢","😱","🧐","🫣"],
  Manger: ["🍎", "🍔", "🍕","🍭", "🍩", "🍉", "🍟","🍐","🌭","🥪","🍊","🥕","🍓","🌽"],
  Animal: ["🐶", "🐱", "🦊", "🐷", "🐸", "🐵","🐺","🦝","🐰","🐹","🐨","🐻","🐮"],
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

  // Préparer les cartes
  useEffect(() => {
    const tous = EMOJIS[emojiType];
    const choisis = melanger([...tous]).slice(0, difficulte);
    const paires = [...choisis, ...choisis];

    const cartesMelangees = paires.sort(() => Math.random() - 0.5).map((emoji, index) => ({
        id: index,
        emoji: emoji,
        cachee: true,
      }));

    setCartes(cartesMelangees);
  }, [difficulte, emojiType]);

  // Si toutes les paires sont trouvées
  useEffect(() => {
    if (trouvees.length === difficulte) {
      setGagne(true);
    }
  }, [trouvees, difficulte]);

  // Si on a fait trop derreurs
  useEffect(() => {
    if (erreurs >= erreursMax) {
      setPerdu(true);
    }
  }, [erreurs, erreursMax]);

  // Quand on clique sur une carte
  const handleClick = (carte) => {
    if (!carte.cachee || selection.length === 2 || gagne || perdu) return;

    const noSelection = [...selection, carte];
    setSelection(noSelection);

    const noCartes = cartes.map((c) => {
      let nouvelleCarte;

      if (c.id === carte.id) {
        // On recrée l'objet
        nouvelleCarte = {
          id: c.id,
          emoji: c.emoji,
          cachee: false
        };
      } 
      else {
        // Si ce n'est pas la bonne carte
        nouvelleCarte = c;
      }

      return nouvelleCarte;
    });

    setCartes(noCartes);

    if (noSelection.length === 2) {
      const [c1, c2] = noSelection;

      if (c1.emoji === c2.emoji) {
        setTrouvees([...trouvees, c1.emoji]);
        setSelection([]);
      } 
      else {
        setTimeout(() => {
          const cartesCachees = noCartes.map((c) => {
            let nouvelleCarte;

            if (c.id === c1.id) {
              nouvelleCarte = {
                id: c.id,
                emoji: c.emoji,
                cachee: true
              };
            } 
            else if (c.id === c2.id) {
              nouvelleCarte = {
                id: c.id,
                emoji: c.emoji,
                cachee: true
              };
            } 
            else {
              nouvelleCarte = c;
            }

            return nouvelleCarte;
          });

          setCartes(cartesCachees);
          setSelection([]);

        }, 1000);

        setErreurs(erreurs + 1);
      }
    }
  };

  const resetGame = () => {
    // retourner toutes les cartes face visible
    const cartesRetournees = cartes.map((c) => ({
      ...c,
      cachee: false,
    }));
    setCartes(cartesRetournees);

    // cacher toutes les cartes
    setTimeout(() => {
      const cartesCachees = cartesRetournees.map((c) => ({
        ...c,
        cachee: true,
      }));
      setCartes(cartesCachees);

      // mélanger et redémarrer
      setTimeout(() => {

        const tous = EMOJIS[emojiType];
        const choisis = melanger([...tous]).slice(0, difficulte);
        const paires = [...choisis, ...choisis];

        const cartesMelangees = paires.sort(() => Math.random() - 0.5).map((emoji, index) => ({
            id: index,
            emoji: emoji,
            cachee: true,
          }));

        setSelection([]);
        setTrouvees([]);
        setErreurs(0);
        setGagne(false);
        setPerdu(false);
        setCartes(cartesMelangees);

      }, 300); 
    }, 1500);

  };




  // Choisir la bonne grille selon la difficulté
  const getGridClass = () => {
    if (difficulte === 2) return styles.col2;
    if (difficulte === 3) return styles.col3;
    if ([4, 6, 8].includes(difficulte)) return styles.col4;
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

        {/* Boutons*/}
        <div className={styles.boutons}>
          <button className={styles.boutonBleu} onClick={onRestart}>Paramètre</button>
          <button className={styles.boutonVio} onClick={resetGame}>Recommencer</button>

        </div>
      </div>

      {/* Grille des cartes*/}
      <div className={`${styles.grilleCartes} ${getGridClass()}`}>

        {cartes.map((carte) => (
          <div
            key={carte.id}
            className={styles.carte}
            onClick={() => handleClick(carte)}
          >
            <div className={`${styles.face} ${!carte.cachee ? styles.faceRetournee : ''}`}>
              <div className={styles.faceAvant}>
                <img src={monImg} alt="?" className={styles.imageCentre} />
              </div>
              <div className={styles.faceArriere}>{carte.emoji}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Message si on gagne NB*/}
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
