# Tama-Pets-JS
### Author: Bocaletto Luca

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)&nbsp;
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)&nbsp;
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)&nbsp;
[![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net/)&nbsp;
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)

Tama-Pets-JS is a modern tamagotchi web app that lets you manage a virtual pet in real time! Enjoy interactive actions, a virtual clock, save/load features, and leaderboard record management—all built with HTML5, CSS3, JavaScript, and PHP.

<p>
  <a href="https://bocaletto-luca.github.io/Tama-Pets/index.html" target="_blank" rel="noopener">
    <img src="https://img.shields.io/badge/Test%20Online-English-Click%20Here-brightgreen?style=for-the-badge"
         alt="Test Online ENGLISH" />
  </a>
  <a href="https://bocaletto-luca.github.io/Tama-Pets/index-ita.html" target="_blank" rel="noopener">
    <img src="https://img.shields.io/badge/Test%20Online-Italian-Click%20Here-brightgreen?style=for-the-badge"
         alt="Test Online ITALIAN" />
  </a>
</p>


##### This Demo is index.html no have save data, for enable save-data please download in you server index.php, GitHub not have module php. 

## Features

- **Real-Time Pet Status:**  
  Displays Hunger, Happiness, Energy, and Cleanliness with progress bars and single-decimal precision.
  
- **Virtual Clock & Day Counter:**  
  Every 5 real seconds equals 1 virtual hour. After 24 virtual hours, Days Alive increases; an icon shows ☀️ (06:00–18:00) or 🌙 (otherwise).

- **Interactive Actions:**  
  Use buttons for Feed, Play, Sleep, Clean, and Park. The corresponding action text and emoticon appear beneath the pet image.

- **Save & Load Functionality:**  
  Save game state automatically to localStorage (every 10 seconds and on page unload) and manually via file download/upload. The load feature resets the file input so you can use it repeatedly.

- **Record Management:**  
  When your pet dies (if Hunger and Energy are 0), the game stops and your record (name and days survived) is stored on the server. View the leaderboard with the "Record" button.

- **Gamepad Support:**  
  Basic support (with 250ms debounce) simulates key events for improved playability.

## Installation

1. **Clone the Repository:**

git clone https://github.com/bocaletto-luca/Tama-Pets-JS.git


2. **Server Setup:**

- Ensure you have a PHP-enabled server (such as Apache).
- Copy the repository into your web server’s root directory.
- Verify that the image `img/pets.png` exists (or update its path).
- Ensure your server has write permissions for `record.json`.

3. **Launch in Browser:**

Navigate to `http://your-server-address/Tama-Pets-JS/` to run the application.

## Usage

- Click **New Game** and enter your name via the modal to start a game.
- Interact with your pet by clicking action buttons (Feed, Play, Sleep, Clean, Park). The action message with its emoticon displays under the pet image.
- Click **Save Game** to download the current state as a JSON file.
- Click **Load Game** to load a previously saved state from file. (The load input resets after each use.)
- Follow the on-screen instructions; when your pet dies, the game stops and your record is saved automatically. Use **Record** to view the leaderboard.

## License

This project is licensed under the GPLv3 License.
