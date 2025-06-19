import React, { useState } from "react";
import Parametre from "./Parametre";
import Footer from "./Footer";
import Jeu from "./Jeu";
import styles from "./App.css";

export default function App() {
  const [jeuCommence, setJeuCommence] = useState(false);
  const [parametres, setParametres] = useState({}); 

  // Quand on clique sur Jouer
  const lancerJeu = (settings) => {
    setParametres(settings);
    setJeuCommence(true);
  };

  return (
    <div className={styles.appWrapper}>
      {!jeuCommence ? (
        
        // Paramètres
        <Parametre onStart={lancerJeu} />
      ) : (

        // Jeu
        <Jeu parametres={parametres} onRestart={() => setJeuCommence(false)} />
      )}

      <Footer />
    </div>
  );
}
