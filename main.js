"use strict";
// Author: Bocaletto Luca
// ==================================================
// GLOBAL STATE & VARIABLES
// ==================================================
// Il gioco non si avvia finché l'utente non clicca "New Game" o carica uno stato da file.
let petState = null;
let gameInterval = null;

// ==================================================
// UTILITY FUNCTIONS
// ==================================================
function updateDisplay() {
  if (!petState) return;
  
  // Visualizza le statistiche con 1 decimale ed emoticon
  document.getElementById("statHunger").textContent = "Hunger: " + petState.hunger.toFixed(1) + " 🍽";
  document.getElementById("statHappiness").textContent = "Happiness: " + petState.happiness.toFixed(1) + " 😊";
  document.getElementById("statEnergy").textContent = "Energy: " + petState.energy.toFixed(1) + " ⚡";
  document.getElementById("statCleanliness").textContent = "Cleanliness: " + petState.cleanliness.toFixed(1) + " 🧼";
  
  // Aggiorna progress bar, se esistono
  const bars = [
    { id: "barHunger", value: petState.hunger },
    { id: "barHappiness", value: petState.happiness },
    { id: "barEnergy", value: petState.energy },
    { id: "barCleanliness", value: petState.cleanliness }
  ];
  bars.forEach(function(item) {
    const element = document.getElementById(item.id);
    if (element) {
      element.style.width = item.value + "%";
      element.textContent = item.value.toFixed(1);
    }
  });
  
  // Virtual Time calcolato in base a petState.virtualHours, formattato come HH:MM
  let currentHour = petState.virtualHours % 24;
  let hour = Math.floor(currentHour);
  let minutes = Math.floor((currentHour - hour) * 60);
  document.getElementById("virtualTime").textContent =
    String(hour).padStart(2, "0") + ":" + String(minutes).padStart(2, "0");
  
  // Icona virtuale: ☀️ se tra le 06:00 e le 18:00, altrimenti 🌙
  const iconVT = document.getElementById("iconVirtualTime");
  if (iconVT) {
    iconVT.textContent = (hour >= 6 && hour < 18) ? "☀️" : "🌙";
  }
  
  // Aggiorna i giorni di vita
  document.getElementById("daysAlive").textContent = petState.daysAlive;
  
  // Aggiornamento nell'header
  document.getElementById("playerNameDisplay").textContent = petState.name;
  document.getElementById("daysAliveDisplay").textContent = petState.daysAlive;
}

function addLog(message) {
  const logDiv = document.getElementById("gameLog");
  const p = document.createElement("p");
  p.textContent = message;
  logDiv.appendChild(p);
  logDiv.scrollTop = logDiv.scrollHeight;
}

// Funzione per visualizzare il messaggio d'azione sotto l'immagine
function setActionMessage(text) {
  document.getElementById("actionMessage").textContent = text;
}

// ==================================================
// GAME LOOP
// ==================================================
function gameLoop() {
  if (!petState) return;
  const now = Date.now();
  const elapsed = (now - petState.lastUpdate) / 1000; // elapsed in seconds
  petState.lastUpdate = now;
  
  petState.hunger = Math.max(0, petState.hunger - 0.5 * elapsed);
  petState.happiness = Math.max(0, petState.happiness - 0.3 * elapsed);
  petState.energy = Math.max(0, petState.energy - 0.4 * elapsed);
  petState.cleanliness = Math.max(0, petState.cleanliness - 0.2 * elapsed);
  
  // Ogni 5 secondi reali = 1 ora virtuale
  petState.virtualHours += elapsed / 5;
  if (petState.virtualHours >= 24) {
    petState.daysAlive += 1;
    petState.virtualHours -= 24;
    addLog("A new day has passed! Days Alive: " + petState.daysAlive);
  }
  
  updateDisplay();
  
  // Se hunger ed energy sono entrambi 0, il pet è morto
  if (petState.hunger === 0 && petState.energy === 0) {
    gameOver();
  }
}

function startGameLoop() {
  if (gameInterval) clearInterval(gameInterval);
  petState.lastUpdate = Date.now();
  gameInterval = setInterval(gameLoop, 1000);
}

// ==================================================
// ACTION FUNCTIONS
// ==================================================
function feedPet() {
  if (!petState) return;
  if (petState.hunger < 100) {
    petState.hunger = Math.min(100, petState.hunger + 20);
    addLog("You fed your pet. Yum! 🍔");
    setActionMessage("Feeding 🍔");
  } else {
    addLog("Your pet is not hungry.");
    setActionMessage("");
  }
  updateDisplay();
}

function playWithPet() {
  if (!petState) return;
  if (petState.energy > 10) {
    petState.happiness = Math.min(100, petState.happiness + 15);
    petState.energy = Math.max(0, petState.energy - 10);
    addLog("You played with your pet. So fun! 🎮");
    setActionMessage("Playing 🎮");
  } else {
    addLog("Your pet is too tired to play.");
    setActionMessage("");
  }
  updateDisplay();
}

function putPetToSleep() {
  if (!petState) return;
  petState.energy = Math.min(100, petState.energy + 30);
  petState.hunger = Math.max(0, petState.hunger - 5);
  addLog("Your pet is sleeping... Zzz 😴");
  setActionMessage("Sleeping 😴");
  updateDisplay();
}

function cleanPet() {
  if (!petState) return;
  petState.cleanliness = 100;
  addLog("You cleaned your pet. Sparkling clean! 🧼");
  setActionMessage("Cleaning 🧼");
  updateDisplay();
}

function takePetToPark() {
  if (!petState) return;
  petState.happiness = Math.min(100, petState.happiness + 10);
  petState.energy = Math.max(0, petState.energy - 15);
  petState.hunger = Math.max(0, petState.hunger - 5);
  addLog("Your pet enjoyed a walk in the park! 🚶");
  setActionMessage("Walking 🚶");
  updateDisplay();
}

// ==================================================
// GAME OVER & RECORD MANAGEMENT
// ==================================================
function gameOver() {
  clearInterval(gameInterval);
  addLog("GAME OVER: " + petState.name + " survived " + petState.daysAlive + " days.");
  alert("Game Over! " + petState.name + " survived " + petState.daysAlive + " days.");
  // Rimuove il salvataggio in localStorage per evitare che si riprenda uno stato morto
  localStorage.removeItem("tamagotchiSave");
  // Invia il record al server in modo da salvarlo in record.json
  fetch("index.php?action=saveRecord", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: petState.name, days: petState.daysAlive })
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === "ok") {
      addLog("Record saved successfully!");
    } else {
      addLog("Failed to save record.");
    }
  })
  .catch(err => {
    console.error("Record save error:", err);
    addLog("Error saving record.");
  });
  // Blocca ulteriori aggiornamenti
  petState = null;
}

function showRecordModal() {
  fetch("index.php?action=getRecords")
  .then(response => response.json())
  .then(records => {
    const recordContent = document.getElementById("recordContent");
    recordContent.innerHTML = "";
    if (records.length > 0) {
      const table = document.createElement("table");
      table.className = "table table-sm";
      table.innerHTML = `<thead>
                           <tr>
                             <th>Name</th>
                             <th>Days</th>
                             <th>Date</th>
                           </tr>
                         </thead>`;
      const tbody = document.createElement("tbody");
      records.forEach(record => {
        let tr = document.createElement("tr");
        tr.innerHTML = `<td>${record.name}</td><td>${record.days}</td><td>${new Date(record.timestamp).toLocaleString()}</td>`;
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      recordContent.appendChild(table);
    } else {
      recordContent.innerHTML = "<p>No records found.</p>";
    }
    $("#recordModal").modal("show");
  })
  .catch(err => {
    console.error("Error loading records:", err);
    addLog("Error loading records.");
  });
}

// ==================================================
// SAVE & LOAD GAME FUNCTIONALITY (File & localStorage)
// ==================================================
function downloadSaveFile() {
  if (!petState) return;
  const saveData = { petState: petState };
  const dataStr = JSON.stringify(saveData, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tamagotchiSave.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

document.getElementById("saveGameBtn").addEventListener("click", downloadSaveFile);

document.getElementById("loadGameBtn").addEventListener("click", () => {
  const inputElem = document.getElementById("loadFileInput");
  inputElem.value = ""; // Resetta l'input per permettere ricaricamenti multipli
  inputElem.click();
});

document.getElementById("loadFileInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const data = JSON.parse(evt.target.result);
      if (!data.petState) throw new Error("Invalid save format");
      // Se esiste un loop precedente lo fermiamo
      if (gameInterval) clearInterval(gameInterval);
      petState = data.petState;
      addLog("Game loaded from file.");
      updateDisplay();
      startGameLoop();
    } catch (ex) {
      console.error("Error loading save file:", ex);
      addLog("Failed to load save file.");
    }
  };
  reader.readAsText(file);
});

function saveGameToLocalStorage() {
  if (!petState) return;
  const saveData = { petState: petState };
  localStorage.setItem("tamagotchiSave", JSON.stringify(saveData));
  console.log("Game state saved to localStorage:", saveData);
}

window.addEventListener("beforeunload", saveGameToLocalStorage);
setInterval(saveGameToLocalStorage, 10000);

// ==================================================
// GAMEPAD INTEGRATION (debounce 250ms)
// ==================================================
let lastGamepadPoll = 0;
function pollGamepad() {
  const now = Date.now();
  const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
  if (gamepads[0]) {
    const gp = gamepads[0];
    if (gp.buttons[12] && gp.buttons[12].pressed && now - lastGamepadPoll > 250) {
      simulateKeyEvent("ArrowUp");
      lastGamepadPoll = now;
    }
    if (gp.buttons[13] && gp.buttons[13].pressed && now - lastGamepadPoll > 250) {
      simulateKeyEvent("ArrowDown");
      lastGamepadPoll = now;
    }
    if (gp.buttons[0] && gp.buttons[0].pressed && now - lastGamepadPoll > 250) {
      simulateKeyEvent("Enter");
      lastGamepadPoll = now;
    }
    if (gp.buttons[1] && gp.buttons[1].pressed && now - lastGamepadPoll > 250) {
      simulateKeyEvent(" ");
      lastGamepadPoll = now;
    }
  }
  requestAnimationFrame(pollGamepad);
}

function simulateKeyEvent(key) {
  const evt = new KeyboardEvent("keydown", { key: key, bubbles: true, cancelable: true });
  document.dispatchEvent(evt);
}

if (navigator.getGamepads) {
  requestAnimationFrame(pollGamepad);
}

// ==================================================
// EVENT LISTENERS PER AZIONI & SETTING DEL NOME
// ==================================================
document.getElementById("feedBtn").addEventListener("click", feedPet);
document.getElementById("playBtn").addEventListener("click", playWithPet);
document.getElementById("sleepBtn").addEventListener("click", putPetToSleep);
document.getElementById("cleanBtn").addEventListener("click", cleanPet);
document.getElementById("parkBtn").addEventListener("click", takePetToPark);
document.getElementById("recordBtn").addEventListener("click", showRecordModal);

document.getElementById("newGameBtn").addEventListener("click", () => {
  // Resetta lo stato per un nuovo gioco
  petState = {
    name: "",
    hunger: 100.0,
    happiness: 100.0,
    energy: 100.0,
    cleanliness: 100.0,
    virtualHours: 0,
    daysAlive: 0,
    lastUpdate: Date.now()
  };
  $("#nameModal").modal("show");
});

document.getElementById("saveNameBtn").addEventListener("click", () => {
  const inputName = document.getElementById("playerNameInput").value.trim();
  if (inputName === "") {
    alert("Please enter your name!");
    return;
  }
  petState.name = inputName;
  $("#nameModal").modal("hide");
  addLog("New game started for " + petState.name);
  updateDisplay();
  startGameLoop();
  saveGameToLocalStorage();
});

// ==================================================
// INITIALIZATION
// ==================================================
// Se c'è un salvataggio in localStorage, riavvia il game loop solo se lo stato è attivo (non morto)
document.addEventListener("DOMContentLoaded", () => {
  const savedData = localStorage.getItem("tamagotchiSave");
  if (savedData) {
    try {
      const data = JSON.parse(savedData);
      petState = data.petState;
      // Se lo stato salvato è valido e non è Game Over (hunger ed energy > 0) allora riprendi il gioco.
      if (petState && (petState.hunger > 0 || petState.energy > 0)) {
        addLog("Resumed game state from localStorage.");
        startGameLoop();
      } else {
        petState = null; // Lo stato è morto, non ripartire
      }
    } catch (e) {
      console.error("Error parsing saved game:", e);
      petState = null;
    }
  }
  updateDisplay();
});
