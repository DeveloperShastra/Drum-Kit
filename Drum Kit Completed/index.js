var numberOfDrumButtons = document.querySelectorAll(".drum").length;
var recordButton = document.getElementById("record");
var playButton = document.getElementById("play");
var clearButton = document.getElementById("clear");
var speedControl = document.getElementById("speed");
var speedValue = document.getElementById("speedValue");

var isRecording = false;
var recordedSequence = [];
var startTime = null;
var timeDelayFactor = 1; 

if (localStorage.getItem("drumRecording")) {
  recordedSequence = JSON.parse(localStorage.getItem("drumRecording"));
}


for (var i = 0; i < numberOfDrumButtons; i++) {
  document.querySelectorAll(".drum")[i].addEventListener("click", function() {
    var buttonInnerHTML = this.innerHTML;

    makeSound(buttonInnerHTML);  
    buttonAnimation(buttonInnerHTML);  

    if (isRecording) {
      var currentTime = Date.now();
      var timeElapsed = startTime ? (currentTime - startTime) : 0;
      recordedSequence.push({ sound: buttonInnerHTML, time: timeElapsed });
      saveRecording(); 
    }
  });
}

document.addEventListener("keypress", function(event) {
  makeSound(event.key); 
  buttonAnimation(event.key);  

  if (isRecording) {
    var currentTime = Date.now();
    var timeElapsed = startTime ? (currentTime - startTime) : 0;
    recordedSequence.push({ sound: event.key, time: timeElapsed });
    saveRecording(); 
  }
});

function playRecording() {
  var lastTime = 0;
  recordedSequence.forEach(function(entry, index) {
    setTimeout(function() {
      makeSound(entry.sound);  
      buttonAnimation(entry.sound);  
    }, (entry.time - lastTime) * timeDelayFactor); 
    lastTime = entry.time;
  });
}

recordButton.addEventListener("click", function() {
  if (isRecording) {
    isRecording = false;
    recordButton.innerText = "Record";
    console.log("Recording stopped.");
  } else {
    recordedSequence = [];  
    startTime = Date.now(); 
    isRecording = true;
    recordButton.innerText = "Stop Recording";
    console.log("Recording started.");
  }
}
);

playButton.addEventListener("click", function() {
  if (recordedSequence.length > 0) {
    playRecording();  
    console.log("Playing recorded sequence.");
  } else {
    console.log("No recording to play.");
  }
});


clearButton.addEventListener("click", function() {
  localStorage.removeItem("drumRecording");  // Clear localStorage
  recordedSequence = [];
  console.log("Recording cleared.");
});


function saveRecording() {
  localStorage.setItem("drumRecording", JSON.stringify(recordedSequence));
}


function makeSound(key) {
  var audio;
  switch (key) {
    case "w":
      audio = new Audio("sounds/tom-1.mp3");
      break;
    case "a":
      audio = new Audio("sounds/tom-2.mp3");
      break;
    case "s":
      audio = new Audio("sounds/tom-3.mp3");
      break;
    case "d":
      audio = new Audio("sounds/tom-4.mp3");
      break;
    case "j":
      audio = new Audio("sounds/snare.mp3");
      break;
    case "k":
      audio = new Audio("sounds/crash.mp3");
      break;
    case "l":
      audio = new Audio("sounds/kick-bass.mp3");
      break;
    default:
      console.log(key);
      return;
  }

  audio.play(); 
}


function buttonAnimation(currentKey) {
  var activeButton = document.querySelector("." + currentKey);
  activeButton.classList.add("pressed");

  setTimeout(function() {
    activeButton.classList.remove("pressed");
  }, 100);  

}

speedControl.addEventListener("input", function() {
  timeDelayFactor = parseFloat(speedControl.value); 
  speedValue.textContent = timeDelayFactor.toFixed(1);
});
