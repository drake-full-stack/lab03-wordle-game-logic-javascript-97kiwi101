// ===== GAME STATE VARIABLES =====
const TARGET_WORD = "KIWIS";  // Our secret word for testing
let currentRow = 0;           // Which row we're filling (0-5)
let currentTile = 0;          // Which tile in the row (0-4)
let gameOver = false;         // Is the game finished?

// DOM element references (set up on page load)
let gameBoard, rows, debugOutput;

// ===== HELPER FUNCTIONS (PROVIDED) =====

// Debug/Testing Functions
function logDebug(message, type = 'info') {
    // Log to browser console
    console.log(message);
    
    // Also log to visual testing area
    if (!debugOutput) {
        debugOutput = document.getElementById('debug-output');
    }
    
    if (debugOutput) {
        const entry = document.createElement('div');
        entry.className = `debug-entry ${type}`;
        entry.innerHTML = `
            <span style="color: #666; font-size: 12px;">${new Date().toLocaleTimeString()}</span> - 
            ${message}
        `;
        
        // Add to top of debug output
        debugOutput.insertBefore(entry, debugOutput.firstChild);
        
        // Keep only last 20 entries for performance
        const entries = debugOutput.querySelectorAll('.debug-entry');
        if (entries.length > 20) {
            entries[entries.length - 1].remove();
        }
    }
}

function clearDebug() {
    const debugOutput = document.getElementById('debug-output');
    if (debugOutput) {
        debugOutput.innerHTML = '<p style="text-align: center; color: #999; font-style: italic;">Debug output cleared - ready for new messages...</p>';
    }
}

// Helper function to get current word being typed
function getCurrentWord() {
    const currentRowElement = rows[currentRow];
    const tiles = currentRowElement.querySelectorAll('.tile');
    let word = '';
    tiles.forEach(tile => word += tile.textContent);
    return word;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    gameBoard = document.querySelector('.game-board');
    rows = document.querySelectorAll('.row');
    debugOutput = document.getElementById('debug-output');
    
    logDebug("🎮 Game initialized successfully!", 'success');
    logDebug(`🎯 Target word: ${TARGET_WORD}`, 'info');
    logDebug("💡 Try typing letters, pressing Backspace, or Enter", 'info');
});


// ===== YOUR CHALLENGE: IMPLEMENT THESE FUNCTIONS =====

// TODO: Add keyboard event listener
// document.addEventListener("keydown", (event) => {
//     // Your code here!
// });


document.addEventListener("keydown", (event) => {
    if(gameOver == false){
        let input = event.key;
        input = input.toUpperCase();
        logDebug(input);
        if(input.length === 1 && input >= 'A' && input <= 'Z'){
            logDebug('is a letter');
            addLetter(input);
        }
        else if(input == 'BACKSPACE'){
            logDebug('Backspace does work');
            deleteLetter();
        }
        else if(input == 'ENTER'){
            logDebug('enter was hit');
            submitGuess();
        }
        else{
            logDebug('was ignored');
        }
    }
});


// TODO: Implement addLetter function
// function addLetter(letter) {
//     // Your code here!
// }


function addLetter(letter) {
    logDebug(`🎯 addLetter("${letter}") called`, 'info');

    if(currentTile >= 5){
        logDebug("full");
        return;
    }

    const rowElement = rows[currentRow];
    const tiles = rowElement.querySelectorAll('.tile');
    const specificTile = tiles[currentTile];
    specificTile.textContent = letter;
    specificTile.classList.add('filled');
    logDebug(`"${letter}" was added at "${currentTile}" tile`);
    currentTile += 1;
    logDebug(`"${getCurrentWord()}" current word status`)
}


// TODO: Implement deleteLetter function  
// function deleteLetter() {
//     // Your code here!
// }


function deleteLetter() {
    logDebug(`🗑️ deleteLetter() called`, 'info');
    if (currentTile <= 0) {
        logDebug("No letters in current row")
        return;
    }
    
    currentTile--;
    const rowElement = rows[currentRow];
    const tiles = rowElement.querySelectorAll('.tile');
    const specificTile = tiles[currentTile];
    logDebug(`"${specificTile.textContent}" was removed at "${currentTile}" tile`);
    specificTile.textContent = '';
    specificTile.classList.remove('filled');
    logDebug(`"${getCurrentWord()}" current word status`)
}


// TODO: Implement submitGuess function
// function submitGuess() {
//     // Your code here!
// }


function submitGuess() {
    logDebug(`📝 submitGuess() called`, 'info');
    if (currentTile !== 5) {
        alert("Please enter 5 letters!");
        return;
    }
    const currentRowElement = rows[currentRow];
    const tiles = currentRowElement.querySelectorAll('.tile');
    let guess = '';

    tiles.forEach(tile => {
        guess += tile.textContent; 
    });
    logDebug(`guess is "${guess}" target is "${TARGET_WORD}"`)
    logDebug(checkGuess(guess, tiles));
    currentRow += 1;
    currentTile = 0;
    if (guess === TARGET_WORD) {
        gameOver = true;
        setTimeout(alert("YOU HAVE WON!"), 500);
        logDebug("won");
    } else if (currentRow >= 6) {
        gameOver = true; 
        setTimeout(alert("loser :("), 500);
        logDebug("lose");
    }
    else{
        logDebug("continuing");
    }

}


// TODO: Implement checkGuess function (the hardest part!)
// function checkGuess(guess, tiles) {
//     // Your code here!
//     // Remember: handle duplicate letters correctly
//     // Return the result array
// }


function checkGuess(guess, tiles) {
    logDebug(`🔍 Starting analysis for "${guess}"`, 'info');
    
    // TODO: Split TARGET_WORD and guess into arrays
    const target = TARGET_WORD.split("");
    const guessArray = guess.split("");
    const result = ['absent', 'absent', 'absent', 'absent', 'absent'];
    
    // STEP 1: Find exact matches
    for (let i = 0; i < 5; i++) {
        if (target[i] === guessArray[i]) {
            logDebug("it works")
            result[i] = 'correct';
            target[i] = null;
            guessArray[i] = null;
        }
    }
    
    // STEP 2: Find wrong position matches  
    for (let i = 0; i < 5; i++) {
        if (guessArray[i] !== null) { // only check unused letters
            if(target.includes(guessArray[i])){
                result[i] = 'present';
                const targetIndex = target.indexOf(guessArray[i]);
                target[targetIndex] = null;
            }
            else{
                result[i] = 'wrong'
            }
            
        }
    }
    
    tiles.forEach((tile, index) => {
        // Use setTimeout to create a staggered, one-by-one reveal effect
        setTimeout(() => {
            const status = result[index];
            tile.classList.add(status);
        }, index * 300); // Delay each tile flip by 300ms
    });

    // It's still good practice to return the final result array
    return result;


}