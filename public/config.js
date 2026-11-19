/* Instellingen die je zelf invult. */
const CONFIG = {
  /* Codes die na post 4 en 5 verschijnen, per voorwerp (voorwerp 4 = post 4). Dit zijn de codes van de cijferslotjes. */
  CODES: { 4: ['4', '1', '7'], 5: ['4', '1', '7'] },

  /* Post 4: locatie van het voorwerp (graden). null = nog niet ingevuld; dan werkt post 4 alleen in testmodus. */
  POST4: { lat: null, lng: null, foundM: 6, rangeM: 60 },

  /* Post 5: eindpunt van het pad. null = geen eindpunt; dan is de opdracht gelukt na 'secondsIfNoEnd' seconden stil lopen. */
  POST5: { endLat: null, endLng: null, endM: 6, noiseMax: 4, secondsIfNoEnd: 20 }
};
