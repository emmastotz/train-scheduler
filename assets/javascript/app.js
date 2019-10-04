$(document).ready(function(){
// ================================================================
  // Initialize Firebase and create references for firebase data
  var config = {
    apiKey: "AIzaSyCZXCPpVoMSMu4qcyuZpxuzESi0lOlOTCo",
    authDomain: "hogwarts-express-train.firebaseapp.com",
    databaseURL: "https://hogwarts-express-train.firebaseio.com",
    projectId: "hogwarts-express-train",
    storageBucket: "",
    messagingSenderId: "72043497661",
    appId: "1:72043497661:web:3f042474c5f9ec1a310fd4"
  };
  
  firebase.initializeApp(config);

  var database = firebase.database();
  var train = database.ref("/train");
// ================================================================
  // Function that reads when a value has changed within the database
  database.ref().on("value", function(snapshot) {
    if (snapshot.child("train").exists()){
      // Loop that pulls the info from the database and dynamically displays it in our html.
      for (var i in snapshot.val().train) {
        
        // Create a new row for data to live in
        var newRow = $("<tr>");
        
        // Create new columns for data to live in
        var tdTrainNumber = $("<td>");
        var tdTrainDestination = $("<td>");
        var tdTrainDepartureTime = $("<td>");
        var tdTrainFrequency = $("<td>");
        var tdNextTrain = $("<td>");

        var trainNum = snapshot.val().train[i].number;
        var trainDest = snapshot.val().train[i].destination;
        var trainDepart = snapshot.val().train[i].departureTime;
        var trainFreq = snapshot.val().train[i].frequency;
        
        // ================================================================
        // Using moment to determine when the next train will arrive
        var currentTime = moment();
        console.log("The current time is: " + moment(currentTime).format("hh:mm"));
        var timeConvert = moment(trainDepart, "hh:mm").subtract(1, "years");
        console.log(timeConvert);
        var diffTime = moment().diff(moment(timeConvert), "minutes");
        var tRemainder = diffTime % trainFreq;
        console.log(tRemainder);
        var tMinToTrain = trainFreq - tRemainder;
        console.log("Minutes until next train: " + tMinToTrain);
        var nextTrain = currentTime.add(tMinToTrain, "minute");
        console.log("Time to next train: " + nextTrain);
        //var nextTrain = moment(tMinToTrain).format("hh:mm");
        // ================================================================
        
        // Adds the data from firebase to the new columns
        tdTrainNumber.text(trainNum);
        tdTrainDestination.text(trainDest);
        tdTrainDepartureTime.text(trainDepart);
        tdTrainFrequency.text(trainFreq);
        tdNextTrain.text(tMinToTrain);

        // Appends the new columns to the new row
        newRow.append(tdTrainNumber);
        newRow.append(tdTrainDestination);
        newRow.append(tdTrainDepartureTime);
        newRow.append(tdTrainFrequency);
        newRow.append(tdNextTrain);

        // Appends the new row to the table
        $(".train-data-display").append(newRow)
      }
      
    }

  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
// ================================================================
  // Handles the form information input by the user
  $(".submit-btn").on("click", function(event){
    event.preventDefault();

    // Capture and log the values input by user
    number = $("#train-number-input").val().trim();
    //console.log(trainNumber);
    destination = $("#destination-input").val().trim();
    //console.log(destination);
    departureTime = $("#departure-time-input").val().trim();
    //console.log(departureTime);
    frequency = $("#frequency-input").val().trim();
    //console.log(frequency);

    renderNewTrain(number,destination,departureTime,frequency);
   });
// ================================================================ 
  // Adds train info as an object and pushes it to the database
  function renderNewTrain(number, destination, departureTime, frequency) {
    
    var trainInfo = {
      number: number,
      destination: destination,
      departureTime: departureTime,
      frequency: frequency,
    };

    train.push(trainInfo);
  };
// ================================================================ 
});