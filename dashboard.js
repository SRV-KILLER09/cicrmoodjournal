/* USERNAME */
const username = localStorage.getItem("username") || "User";
document.getElementById("username-placeholder").textContent = username;

/* LOGOUT */
function logout() {
  localStorage.removeItem("username");
  window.location.href = "index.html";
}

/* DATE & TIME */
function updateDateTime() {
  const now = new Date();
  document.getElementById("date").textContent = now.toLocaleDateString();
  document.getElementById("time").textContent = now.toLocaleTimeString();
}
setInterval(updateDateTime, 1000);
updateDateTime();

/* REMINDER LOGIC */
const reminderBtn = document.getElementById("reminderBtn");
const reminderPopup = document.getElementById("reminderPopup");

reminderBtn.addEventListener("click", () => { reminderPopup.style.display = "block"; });
function closeReminder() { reminderPopup.style.display = "none"; }
function setReminder() {
  const time = document.getElementById("reminderTime").value;
  if (!time) { alert("Please select a time"); return; }
  const [hours, minutes] = time.split(":");
  const now = new Date();
  const reminderTime = new Date();
  reminderTime.setHours(hours, minutes, 0, 0);
  if (reminderTime <= now) { reminderTime.setDate(reminderTime.getDate() + 1); }
  const delay = reminderTime - now;
  setTimeout(() => {
    if (Notification.permission === "granted") {
      new Notification("CICR Mood Journal", { body: "⏰ Time to log your mood!" });
    }
  }, delay);
  closeReminder();
  alert("Reminder set successfully!");
}
if ("Notification" in window) { Notification.requestPermission(); }

/* WEBCAM & REAL-TIME MOOD DETECTION */
const video = document.getElementById("webcam");
const moodResult = document.getElementById("moodResult");

async function startWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    alert("Cannot access webcam: " + err);
  }
}

async function loadFaceAPI() {
  const MODEL_URL = "https://justadudewhohacks.github.io/face-api.js/models/";
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
}

async function detectMood() {
  const detection = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceExpressions();

  if (detection && detection.expressions) {
    const exp = detection.expressions;
    let mood = "Neutral";
    if (exp.happy > 0.5) mood = "😊 Happy";
    else if (exp.sad > 0.5) mood = "😔 Sad";
    else if (exp.angry > 0.5) mood = "😡 Angry";
    moodResult.textContent = mood;

    if (mood.includes("Sad") && Notification.permission === "granted") {
      new Notification("CICR Mood Journal", { body: "It seems you're sad. Take a moment ❤️" });
    }
  } else {
    moodResult.textContent = "Detecting mood...";
  }
}

async function runMoodDetection() {
  await loadFaceAPI();
  await startWebcam();
  setInterval(detectMood, 2000); // detect every 2 seconds
}

runMoodDetection();
