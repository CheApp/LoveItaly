NUOVE FUNZIONALITÀ:

1) Gestione delle quantità dei prodotti (nel carrello e nella vista del singolo prodotto).
2) Info azienda: la descrizione risultante dalla chiamata AJAX viene manipolata per spostare le immagini in alto e renderle scrollabili.
3) Utilizzo delle API di google per la conversione dell'indirizzo in coordinate utili per la mappa.
4) CSS di lista prodotti sistemato, con aggiunta di excerpt.
5) RIferimento all'azienda interno ad info prodotto cliccabile.
6) Gestione di ricerca senza risultati (viene mostrata la scritta "Nessun prodotto trovato!").
7) Eliminazione dei prodotti dal carrello.
8) aggiunto checkout
9) aggiunti profilo (ordini, indirizzi) senza parte server
10) aggiunti login e registrazione


PROBLEMI:

1) Dopo l'aggiunta di un prodotto nel carrello, questo non viene aggiornato se non dopo il refresh dell'home. (RISOLTO)
2) Dopo aver cliccato sul riferimento all'azienda presente in Info prodotto, rimangono la barra di "Aggiungi al carrello" e il cuoricino della wishlist. (RISOLTO)
3) Gli id delle aziende nel menu "Ricerca per aziende" non corrispondono a quelli reali (RISOLTO)
4) date di consegna non funzionanti nel checkout (getDate non definita???) (RISOLTO)
5) nello step 1 del checkout, premendo inditro dovrebbe tornare al carrelo (RISOLTO)
6) Quando si sceglie un' azienda dal menu dovrebbe aprire InfoAzienda nel tab dei prodotti e non ListaProdotti
7) si riescono a piazzare solo ordini con un solo prodotto
