/**
 *Enable string formating
 *First, checks if it isn't implemented yet.
 */
/*if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}*/

// Class game. Controls the input/output and interface
function Game() {
    var processor;
    var maxLength = 9;
    // Starting view and input
    var setUp = document.getElementById('initial');
    var setUpInput = document.getElementById('guessLength');
    // In game view and input
    var inGame = document.getElementById('inGame');
    var inGameFields = document.getElementById('userInput');
    var inGameInput = document.getElementById('userGuess');
    // result, errors view and extra output
    var results = document.getElementById('log');
    var errors = document.getElementById('error');
    var hidden = document.getElementById('pcGuess');
    var success = document.getElementById('success');

    // Add the listeners
    var start = document.getElementById("start");
    start.addEventListener('click', function() {
        if (isNaN(setUpInput.value) || setUpInput.value > maxLength) {
            showError("Add a number please, of maximum length " + maxLength + ".");
            return;
        } else {
            processor = new Processor(setUpInput.value);
            hideError();
            hide(setUp);
            show(inGame);
            show(inGameFields);
            hidden.value = processor.getPcGuess();
        }
    });
    var guess = document.getElementById("guess");
    guess.addEventListener('click', function() {
        var l = inGameInput.value;
        if (isNaN(l) || l.length != processor.getGuessLength()) {
            showError("Add a number please, of maximum length " + processor.getGuessLength() + ".");
            return;
        } else {
            processor.setInput(inGameInput.value);
            hideError();
        }
        if (processor.getResult())
            won();
        printResult();
    });
    var reset = document.getElementById("reset");
    reset.addEventListener('click', function() {
        processor = null;
        show(setUp);
        hide(inGame);
        results.innerHTML = '';
        hide(results);
        inGameInput.value = '';
        hideError();
        hide(success);
    });
    //var userTry = document.getElementById("guess").addEventListener("onclick", this.guess);

    //document.getElementById("reset").addEventListener("onclick", reset);
    var won = function() {
        //hide(inGameFields);
        success.innerHTML = "<p><strong>Congratulations!</strong> You won in "+processor.getLastResult().turn + " turns.</p>";
        show(success);
    };
    var printResult = function() {
        results.innerHTML = processor.getRounds();
        show(results);
    };

    var showError = function(msg) {
        errors.innerHTML = msg;
        show(errors);
    };
    this.getProcessor = function() {
        return processor;
    };
    var hideError = function() {
        errors.innerHTML = '';
        hide(errors);
    };
    var show = function(e) {
        e.style.display = 'block';
    };
    var hide = function(e) {
        e.style.display = 'none';
    };
    hide(inGame);
};

// Cow Bulls internals
function Processor(length) {
    // Required variables
    var pcGuess = new Array();
    var userGuess = new Array();
    var userValue;
    var guessLength = parseInt(length);
    var round = new Array();
    // Result variables
    var cows = 0;
    var bulls = 0;
    var bullPosition = new Array();
    var round = new Array();

    var won = false;

    for (var i = 0; i < guessLength; i++) {
        var exists = false;
        var guess;
        do {
            guess = Math.floor(Math.random() * 9 + 0);
            for (var e = 0; e < pcGuess.length; e++) {
                exists = pcGuess[e] == guess ? true : false;
                if (exists) break;
            }
        } while (exists)
        pcGuess[i] = guess;
    }
    this.getPcGuess = function() {
        return pcGuess;
    };

    this.getGuessLength = function() {
        return guessLength;
    };

    this.setInput = function(userInput) {
        for (var i = 0; i < guessLength; i++)
            userGuess[i] = parseInt(userInput[i]);
        userValue = parseInt(userInput);
    };
    this.getResult = function() {
        //Store the round
        var index = round.length;
        round[index] = {};
        round[index].bulls = findBulls();
        round[index].cows = findCows();
        round[index].userInput = userValue;
        round[index].turn = index+1;
        // Return the list of rounds
        return round[index].bulls === guessLength;
    };
    // Returns an order lists with all the user turns
    this.getRounds = function() {
        var result = "<table id='entries' class='table table-condensed'><tbody><tr><th>Turn</th><th>Input</th><th>Cows</th><th>Bulls</th></tr>";
        //debugger;
        for (var i = 0, max = round.length; i < max; i++) {
            result += round[i].bulls === guessLength ? '<tr class="success">' : '<tr>';
            // If the user typed zero as a first number, pad it to the string otherwise it doesn't show.
            var input = String(round[i].userInput).length === guessLength ? round[i].userInput : "0" + round[i].userInput;
            result += to_td(round[i].turn);
            result += to_td(input);
            result += to_td(round[i].cows);
            result += to_td(round[i].bulls);
            result += "</tr>";
        }
        result += "</tbody></table>"
        return result;
    };

    var to_td = function(data, attr) {
        data = data || '';
        return "<td class='"+ String(attr) +"'>" + String(data) + "</td>";
    };

    var findBulls = function() {
        var bullsFound = 0;
        for (var i = 0; i < guessLength; i++) {
            bullsFound += userGuess[i] === pcGuess[i] ? 1 : 0;
        }
        return bullsFound;
    };
    this.setPcGuess = function(number) {
        for (var i = 0; i < guessLength; i++)
            pcGuess[i] = parseInt(number[i]);
    };
    this.getLastResult = function() {
        return round[round.length - 1];
    };
    var findCows = function() {
        var cowsFound = 0;
        for (var i = 0; i < guessLength; i++) {

            for (var j = 0; j < guessLength; j++) {
                if (userGuess[i] === pcGuess[j] && i != j) {
                    cowsFound += 1;
                    break;
                }
            }
        }
        return cowsFound;
    };
}

function BrootForcer(processor) {
    var proc = processor;
    // Timers
    var startTime;
    var endTime;
    var timeout;
    // Guess Results
    var results = {
        input: [],
        round: [],
        bulls: [],
        cows: []
    };
    var getRound = function() {};
    var setRound = function() {};
    var tryOnce = function() {};
    this.findNoBull = function() {
        var found = false;
        debugger;
        do {
            var noBulls = Math.floor(Math.random() * 9 + 0);
            proc.setInput(String(noBulls));
            proc.getResult();
            if (proc.getLastResult().bulls === 0) {
                found = true;
            }
        } while (!found)
    };
    this.
    break = function() {};

}