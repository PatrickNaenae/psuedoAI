const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");

const speechBtnDiv = document.querySelector("#speech-btn");
const micBtn = document.querySelector(".btn .fas");
const instruction = document.querySelector(".instruction");

const speechRecognition =
	window.SpeechRecognition || window.webkitSpeechRecognition;

const speechSynthesis = window.speechSynthesis;
const recognition = new speechRecognition();

if (speechRecognition && speechSynthesis) {

	micBtn.addEventListener("click", micBtnClicked);
	function micBtnClicked(e) {
		e.preventDefault();
		if (micBtn.classList.contains("fa-microphone")) {
			recognition.start();
		} else {
			recognition.stop();
		}
	}

	//   Start Speech Recognition
	recognition.addEventListener("start", () => {
		micBtn.classList.replace("fa-microphone", "fa-microphone-slash");
		// micBtn.classList.add("fa-microphone-slash");
		instruction.textContent = "Recording... Press Ctrl + M to stop.";
		searchInput.focus();
	});

	//   Stop Speech Recognition
	recognition.addEventListener("end", () => {
		micBtn.classList.replace("fa-microphone-slash", "fa-microphone" );
		// micBtn.classList.add("fa-microphone");
		instruction.textContent = "Press Ctrl + X or Click the Mic icon to start";
		searchInput.focus();
	});
	recognition.continuous = true;
	const recognitionOn = setInterval(() => {
		if (instruction.textContent.includes("start")) {
			recognition.start();
		}
	}, (1000));
  // speech recognition shortcut
  speechRecognitionKeys();
  loadTranscript();

} else {
  speechBtnDiv.getElementsByClassName.visibility = "hidden";
}

// speech recognition shortcuts function
function speechRecognitionKeys() {
  document.addEventListener("keydown", (e) => {
		if (e.ctrlKey && e.key === "x") {
			recognition.start();
		}
		if (e.ctrlKey && e.key === "m") {
			recognition.stop();
		}
	});
}

function loadTranscript() {
  recognition.addEventListener("result", (e) => {
    const current = e.resultIndex;
		const transcript = e.results[current][0].transcript;
		showTranscript(transcript);
		for (let i = 0; i < lists.length; i++) {
			let askedQuestion = transcript.toLowerCase().trim();
			if (askedQuestion.includes(lists[i].question)) {
				respond(lists[i].answer);
				break;
			}
			if (askedQuestion.startsWith("what is", 0) && askedQuestion !== lists[i].question && (i = 1)) {
				console.log("Error");
				let errorMsg = "Apologies, I do not have enough data to answer your question at this time";
				respond(errorMsg);
				break;
			}
		}
  }
)};

function respond(res) {
  let voices = window.speechSynthesis.getVoices();
	const speech = new SpeechSynthesisUtterance();
	speech.lang = "en-US";
	speech.text = res;
	speech.volume = "1";
	speech.rate = "1";
  speech.pitch = "2";
  
  if (voices) {
    speech.voice = voices[2];
  } else {
    speech.voice = voices[6];
  }
  window.speechSynthesis.speak(speech);
}


function showTranscript(transcript) {
	if (transcript.toLowerCase().trim() === "stop recording") {
			recognition.stop();
		} else if (!searchInput.value) {
			searchInput.value = transcript;
		} else {
			if (transcript.toLowerCase().trim() === "search") {
				searchForm.submit();
			} else if (transcript.toLowerCase().trim() === "reset form") {
				searchInput.value = "";
			} else {
				searchInput.value = transcript;
			}
		}
}

