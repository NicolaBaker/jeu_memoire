// App.jsx
import React, { useState } from 'react';
import Parametre from './Parametre';
import Jeu from './Jeu';
import styles from './App.css'; // Import des styles

export default function App() {
  const [jeuCommence, setJeuCommence] = useState(false); // Si le jeu est lancé
  const [parametres, setParametres] = useState({}); // Stocke les choix du joueur

  // Quand on clique sur "Jouer", on sauvegarde les paramètres
  const lancerJeu = (settings) => {
    setParametres(settings);
    setJeuCommence(true);
  };

  return (
    <div className={styles.appWrapper}>
      {!jeuCommence ? (
        // Écran des paramètres
        <Parametre onStart={lancerJeu} />
      ) : (
        // Écran du jeu
        <Jeu parametres={parametres} onRestart={() => setJeuCommence(false)} />
      )}
      
    </div>
  );
}
