<?php
// Author: Bocaletto Luca
// ==================================================
// PHP: Gestione dei Record (salvataggio e recupero)
// ==================================================
if (isset($_GET['action'])) {
    $action = $_GET['action'];
    $recordFile = "record.json";
    if (!file_exists($recordFile)) {
        file_put_contents($recordFile, json_encode([]));
    }
    if ($action === "getRecords") {
        header("Content-Type: application/json");
        echo file_get_contents($recordFile);
        exit;
    } elseif ($action === "saveRecord") {
        $input = file_get_contents("php://input");
        $data = json_decode($input, true);
        if ($data && isset($data["name"]) && isset($data["days"])) {
            $records = json_decode(file_get_contents($recordFile), true);
            if (!$records) { 
                $records = []; 
            }
            $records[] = [
                "name" => $data["name"],
                "days" => $data["days"],
                "timestamp" => date("c")
            ];
            // Ordina i record per giorni decrescenti
            usort($records, function($a, $b){ return $b["days"] - $a["days"]; });
            file_put_contents($recordFile, json_encode($records, JSON_PRETTY_PRINT));
            header("Content-Type: application/json");
            echo json_encode(["status" => "ok"]);
            exit;
        } else {
            header("Content-Type: application/json");
            echo json_encode(["status" => "error", "message" => "Invalid record data"]);
            exit;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<title>Tama-Pets – Gioco Tamagotchi Virtuale</title>
  <meta name="keywords" content="Tama-Pets, Tamagotchi, gioco virtuale, pet virtuale, cura animale, divertimento, JS">
  <meta name="author" content="Bocaletto Luca">
  <meta name="description" content="Tama-Pets è un gioco digitale in JavaScript dove alimenti, fai giocare, fai dormire e pulisci il tuo animale virtuale per mantenerlo felice.">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- Bootstrap CSS (CDN) -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <!-- FontAwesome Icons (CDN) -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <link rel="stylesheet" href="style.css">  
</head>
<body>
  <!-- Navbar/Header -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-success">
    <a class="navbar-brand" href="#"><i class="fas fa-smile"></i>Tama-Pets</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" 
            data-target="#navbarNav" aria-controls="navbarNav" 
            aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav mr-auto">
         <li class="nav-item me-2">
           <button id="newGameBtn" class="btn btn-light btn-sm">New Game</button>
         </li>
         <li class="nav-item me-2">
           <button id="saveGameBtn" class="btn btn-light btn-sm">Save Game</button>
         </li>
         <li class="nav-item me-2">
           <button id="loadGameBtn" class="btn btn-light btn-sm">Load Game</button>
         </li>
         <li class="nav-item">
           <button id="recordBtn" class="btn btn-light btn-sm">Record</button>
         </li>
      </ul>
      <span class="navbar-text">
        <i class="fas fa-user"></i> Name: <span id="playerNameDisplay"></span> | Days Alive: <span id="daysAliveDisplay">0</span>
      </span>
    </div>
  </nav>
  
  <!-- Main Dashboard -->
  <div class="container-fluid mt-3">
    <div class="app-container">
      <!-- Panel 1: Stato del Pets -->
      <div class="panel" id="statePanel">
        <h4 class="text-center">My Pet <i class="fas fa-paw"></i></h4>
        <div class="text-center mb-3">
          <img id="petImage" src="img/pets.jpg" alt="Tamagotchi" class="img-fluid" style="max-width: 150px;">
          <!-- Campo per mostrare l'azione corrente -->
          <div id="actionMessage" class="mt-2 h5 text-primary"></div>
        </div>
        <div id="petStats">
          <p id="statHunger">Hunger: 100.0 🍽</p>
          <div class="progress mb-2">
            <div id="barHunger" class="progress-bar bg-danger" role="progressbar" style="width: 100%;">100.0</div>
          </div>
          <p id="statHappiness">Happiness: 100.0 😊</p>
          <div class="progress mb-2">
            <div id="barHappiness" class="progress-bar bg-warning" role="progressbar" style="width: 100%;">100.0</div>
          </div>
          <p id="statEnergy">Energy: 100.0 ⚡</p>
          <div class="progress mb-2">
            <div id="barEnergy" class="progress-bar bg-info" role="progressbar" style="width: 100%;">100.0</div>
          </div>
          <p id="statCleanliness">Cleanliness: 100.0 🧼</p>
          <div class="progress mb-2">
            <div id="barCleanliness" class="progress-bar bg-success" role="progressbar" style="width: 100%;">100.0</div>
          </div>
          <p>Virtual Time: <span id="virtualTime">00:00</span> <span id="iconVirtualTime"></span></p>
          <p>Days Alive: <span id="daysAlive">0</span></p>
        </div>
      </div>
      
      <!-- Panel 2: Azioni -->
      <div class="panel" id="actionPanel">
        <h4 class="text-center">Actions <i class="fas fa-hand-pointer"></i></h4>
        <div class="d-flex flex-column align-items-center">
          <button id="feedBtn" class="btn btn-primary mb-2 w-100">Feed 🍔</button>
          <button id="playBtn" class="btn btn-secondary mb-2 w-100">Play 🎮</button>
          <button id="sleepBtn" class="btn btn-info mb-2 w-100">Sleep 😴</button>
          <button id="cleanBtn" class="btn btn-success mb-2 w-100">Clean 🧼</button>
          <button id="parkBtn" class="btn btn-warning mb-2 w-100">Park 🚶</button>
        </div>
      </div>
      
      <!-- Panel 3: Game Log -->
      <div class="panel" id="logPanel">
        <h4 class="text-center">Game Log 📜</h4>
        <div id="gameLog" style="height:300px; overflow-y:auto;"></div>
      </div>
    </div>
  </div>
  
  <!-- Modal: Inserisci Nome Giocatore -->
  <div class="modal fade" id="nameModal" tabindex="-1" role="dialog" aria-labelledby="nameModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="nameModalLabel">Enter Your Name</h5>
        </div>
        <div class="modal-body">
          <input type="text" id="playerNameInput" class="form-control" placeholder="Your name" required>
        </div>
        <div class="modal-footer">
          <button id="saveNameBtn" class="btn btn-primary">Save Name</button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Modal: Record -->
  <div class="modal fade" id="recordModal" tabindex="-1" role="dialog" aria-labelledby="recordModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="recordModalLabel">Records</h5>
        </div>
        <div class="modal-body" id="recordContent">
          <!-- Classifica dei record verrà mostrata qui -->
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>

  <footer style="background-color:#f8f9fa; text-align:center; padding:10px 0; position:relative; bottom:0; width:100%;">
  <div style="font-size:0.9rem; color:#333;">
    Copytight 2025 Bocaletto Luca
  </div>
  <div style="font-size:0.85rem;">
    <a href="https://github.com/bocaletto-luca" target="_blank" rel="noopener" 
       style="color:#007bff; text-decoration:none; margin:0 5px;">
      GitHub Profile
    </a> |
    <a href="https://bocaletto-luca.github.io" target="_blank" rel="noopener" 
       style="color:#007bff; text-decoration:none; margin:0 5px;">
      GitHub Pages
    </a> |
    <a href="https://bocalettoluca.altervista.org" target="_blank" rel="noopener" 
       style="color:#007bff; text-decoration:none; margin:0 5px;">
      Personal Website
    </a>
  </div>
</footer>
    
  <!-- Input file nascosto per Load Game -->
  <input type="file" id="loadFileInput" accept=".json" style="display:none">
  
  <!-- jQuery, Popper e Bootstrap JS -->
  <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
  
  <!-- Include main.js -->
  <script src="main.js"></script>
</body>
</html>
