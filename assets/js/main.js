var userToken = Math.floor(Math.random()*1000000);
var userNode = {};
var usersArray = [];
var time;
var me;
var opponent;
var opponentId;
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
var myConnectionsRef = firebase.database().ref('users');

database.ref().on("value", function(snapshot) {
    //If you array exists lets use it
    if (snapshot.child("users/usersArray").exists()) {
        usersArray = snapshot.val().users.usersArray;
        //We need to maintain the array
        userNode["usersArray"] = usersArray;
        //If there are less than two players and if I am not in the array
        if(usersArray.length < 2 && usersArray.indexOf(userToken) == -1) {
            //add me to the array
            usersArray.push(userToken);
            database.ref().child("users/usersArray").set(usersArray);
            //Need to figure out our index
            me = Math.floor(usersArray.indexOf(userToken)+0.5);
            switch(me) {
                case 0 :
                    opponent = 1;
                    break;
                case 1 :
                    opponent = 0;
                    break;
            }
            opponentId = snapshot.val().users.usersArray[opponent];
        }
        //get my index in the array
        let temp = snapshot.val().users.usersArray.indexOf(userToken);
        //If I exist in the array
        if(temp > -1) {
            //If my opponents haven't changed
            if(temp == me && opponentId == snapshot.val().users.usersArray[opponent])
            {
                
            }
            else {
                clearInterval(time);
                init();
            }
        }
    }
    //We need to initialize our array
    else {
        userNode["usersArray"] = [userToken];
        myConnectionsRef.set(userNode);
    }
    //Remove ourselves from the array so that on disconnect we allow new people in
    usersArray.splice(usersArray.indexOf(userToken), 1);
    userNode["usersArray"] = usersArray;
    playerOne = userToken;
    myConnectionsRef.onDisconnect().set(userNode);
});

function init() {

}