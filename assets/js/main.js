var userToken = Math.floor(Math.random()*1000000);
var counter = 2;
var decrementedFlag = false;
var initCalled = false;
var userNode = {};
var usersArray = [];
var moves = [""];
var myMove;
var timer = 5;
var time;
var me;
var opponent;
var opponentId;
var rock;
var paper;
var sword;

console.log(userToken);

var config = {
    apiKey: "AIzaSyCXFell3xCtYKVU64d1Shq_596P4vxUN6E",
    authDomain: "rock-paper-sword.firebaseapp.com",
    databaseURL: "https://rock-paper-sword.firebaseio.com",
    projectId: "rock-paper-sword",
    storageBucket: "",
    messagingSenderId: "229835846823"
};

firebase.initializeApp(config);
var database = firebase.database();
var myConnectionsRef = firebase.database().ref('users/count');
var movesRef = firebase.database().ref("moves");
//Remove ourselves from the array so that on disconnect we allow new people in
myConnectionsRef.onDisconnect().set(2);

myConnectionsRef.on("value", function(snapshot) {
    counter = snapshot.val();
    if(counter == 2) {
        decrementedFlag = false;
    }
    if(counter > 0 && !decrementedFlag) {
        //get the count and decrement it before sending it back
        decrementedFlag = true;
        counter--;
        myConnectionsRef.set(counter);
    }
    if(counter == 0 && decrementedFlag && !initCalled) {
        init();
    }
});

movesRef.on("value", function(snapshot) {
    console.log("Setting moves");
    moves = snapshot.val();
    console.log(moves);
    if(counter < 1) {  
        console.log("Evaluating Moves")
        if(moves != null && moves.length == 2) {
            clearInterval(time);
            let opIndex;
            let index = Math.floor(moves.indexOf(myMove)+0.5);
            console.log("Index is: " + index);
            switch(index) {
                case 0 :
                    opIndex = 1;
                    break;
                case 1 :
                    opIndex = 0;
                    break;
            }

            console.log("opINDEX: " + opIndex);
            let opMove = moves[opIndex];
            console.log("opMOVES: " + opMove);
            if(myMove == "sword"){
                if(opMove == "rock") {
                    alert("You lost!");
                }
                if(opMove == "paper") {
                    alert("You won");
                }
                if(opMove == "sword") {
                    alert("Draw");
                }
            }

            else if(myMove == "paper") {
                if(opMove == "paper") {
                    alert("Draw");
                }
                if(opMove == "rock") {
                    alert("You won!");
                }
                if(opMove == "sword") {
                    alert("You lost");
                }
            }

            else {
                if(opMove == "rock") {
                    alert("Draw!");
                }
                if(opMove == "paper") {
                    alert("You lost");
                }
                if(opMove == "sword") {
                    alert("You won!");
                }
            }

            movesRef.remove();
            moves = [];
            //init();
        }
    }
});

function init() {
    rock = document.getElementById("rock");
    paper = document.getElementById("paper");
    sword = document.getElementById("sword");
    sword.onclick = swordClick;
    paper.onclick = paperClick;
    rock.onclick = rockClick;
    initCalled = true;
    time = setInterval(count, 1000);
}

function swordClick() {
    clearInterval(time);
    myMove="sword";
    clearClicks();
    pushMove(myMove);
}

function paperClick() {
    clearInterval(time);
    myMove="paper";
    clearClicks();
    pushMove(myMove);
}

function rockClick() {
    clearInterval(time);
    myMove="rock";
    clearClicks();
    pushMove(myMove);
}

function clearClicks() {
    rock.onclick = "";
    sword.onclick = "";
    paper.onclick = "";
}

function pushMove(move) {
    if(moves == null || moves.length == 0)
    {
        moves = [move];
    }
    else {
        moves.push(move);
    }
    let newObj = {};
    newObj["moves"] = moves;
    database.ref().set(newObj);
}

function count() {
    if(timer == 0)
    {
        clearInterval(time);
        rockClick();
    }
    else {
        timer--;
        document.getElementById("timer").textContent = "Time Left: " + timer;
    }
}