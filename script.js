// Quiz Questions Database
const questions = [
  {
    question: "What is typically the most common degree awarded at universities? 📜",
    options: ["Bachelor's Degree", "Master's Degree", "Associate Degree", "Doctoral Degree"],
    correct: 0,
  },
  {
    question: "Which building is usually the heart of academic life on campus? 🏛️",
    options: ["Dormitory", "Library", "Cafeteria", "Gymnasium"],
    correct: 1,
  },
  {
    question: "What does 'GPA' stand for in academic terms? 📊",
    options: [
      "General Performance Average",
      "Grade Point Average",
      "Graduate Program Assessment",
      "Global Performance Analysis",
    ],
    correct: 1,
  },
  {
    question: "When do most universities hold their main graduation ceremony? 🎓",
    options: ["Fall", "Winter", "Spring", "Summer"],
    correct: 2,
  },
  {
    question: "What is the traditional name for a university's dining hall? 🍽️",
    options: ["Cafeteria", "Mess Hall", "Refectory", "Food Court"],
    correct: 0,
  },
  {
    question: "Which academic term typically comes first in the school year? 📅",
    options: ["Spring Semester", "Fall Semester", "Summer Session", "Winter Term"],
    correct: 1,
  },
  {
    question: "What is the name for the ceremony where new students are officially welcomed? 🎊",
    options: ["Orientation", "Convocation", "Matriculation", "Induction"],
    correct: 0,
  },
  {
    question: "What does 'Dean's List' recognize? ⭐",
    options: ["Athletic Achievement", "Community Service", "Academic Excellence", "Leadership Skills"],
    correct: 2,
  },
  {
    question: "What is the typical duration of a standard college course credit hour? ⏰",
    options: ["45 minutes", "50 minutes", "60 minutes", "90 minutes"],
    correct: 1,
  },
  {
    question: "What is the name for the area where students live on campus? 🏠",
    options: ["Dormitory", "Residence Hall", "Student Housing", "All of the above"],
    correct: 3,
  },
  {
    question: "What does 'Alma Mater' refer to? 🎵",
    options: ["School Song", "School Building", "School Founded", "School Spirit"],
    correct: 0,
  },
  {
    question: "What is the traditional academic dress worn at graduation called? 👨‍🎓",
    options: ["Academic Regalia", "Graduation Uniform", "Ceremonial Dress", "Scholar's Robe"],
    correct: 0,
  },
  {
    question: "What does 'Magna Cum Laude' mean? 🏆",
    options: ["With Honor", "With High Honor", "With Great Honor", "With Highest Honor"],
    correct: 2,
  },
  {
    question: "What is the name for the head of a university? 👔",
    options: ["Principal", "President", "Chancellor", "Both B and C"],
    correct: 3,
  },
  {
    question: "What is 'Rush Week' associated with? 🤝",
    options: ["Final Exams", "Greek Life", "Sports Tryouts", "Job Fair"],
    correct: 1,
  },
]

// Game State Variables
let currentQuestionIndex = 0
let score = 0
let timeLeft = 15
let timer
let shuffledQuestions = []
let soundEnabled = true
let answered = false

// DOM Elements
const startScreen = document.getElementById("startScreen")
const quizScreen = document.getElementById("quizScreen")
const endScreen = document.getElementById("endScreen")
const startBtn = document.getElementById("startBtn")
const playAgainBtn = document.getElementById("playAgainBtn")
const soundToggle = document.getElementById("soundToggle")
const progressBar = document.getElementById("progressBar")
const questionCounter = document.getElementById("questionCounter")
const timerDisplay = document.getElementById("timer")
const questionText = document.getElementById("questionText")
const optionsContainer = document.getElementById("optionsContainer")
const scoreDisplay = document.getElementById("scoreDisplay")
const scorePercentage = document.getElementById("scorePercentage")
const scoreMessage = document.getElementById("scoreMessage")

// Sound Effects Function (using Web Audio API)
function playSound(frequency, duration) {
  if (!soundEnabled) return

  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)
  } catch (error) {
    console.log("Audio not supported")
  }
}

// Shuffle Array Function (Fisher-Yates Algorithm)
function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Initialize Game
function initGame() {
  currentQuestionIndex = 0
  score = 0
  shuffledQuestions = shuffleArray(questions).slice(0, 10) // Take 10 random questions
  updateProgressBar()
}

// Show Screen with Animation
function showScreen(screen) {
  // Hide all screens
  document.querySelectorAll(".screen").forEach((s) => {
    s.classList.remove("active")
    s.classList.add("hidden")
  })

  // Show selected screen with animation
  setTimeout(() => {
    screen.classList.remove("hidden")
    setTimeout(() => screen.classList.add("active"), 50)
  }, 300)
}

// Update Progress Bar
function updateProgressBar() {
  const progress = (currentQuestionIndex / shuffledQuestions.length) * 100
  progressBar.style.width = progress + "%"
}

// Start Quiz Function
function startQuiz() {
  initGame()
  showScreen(quizScreen)
  loadQuestion()
}

// Load Current Question
function loadQuestion() {
  answered = false
  const question = shuffledQuestions[currentQuestionIndex]

  // Update question counter
  questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${shuffledQuestions.length}`

  // Set question text
  questionText.textContent = question.question

  // Clear previous options
  optionsContainer.innerHTML = ""

  // Create option buttons
  question.options.forEach((option, index) => {
    const optionBtn = document.createElement("button")
    optionBtn.className = "option"
    optionBtn.textContent = option
    optionBtn.addEventListener("click", () => selectAnswer(index))
    optionsContainer.appendChild(optionBtn)
  })

  // Start timer and update progress
  startTimer()
  updateProgressBar()
}

// Start Countdown Timer
function startTimer() {
  timeLeft = 15
  timerDisplay.textContent = timeLeft
  timerDisplay.classList.remove("warning")

  timer = setInterval(() => {
    timeLeft--
    timerDisplay.textContent = timeLeft

    // Add warning animation when time is low
    if (timeLeft <= 5) {
      timerDisplay.classList.add("warning")
    }

    // Time's up!
    if (timeLeft <= 0) {
      clearInterval(timer)
      if (!answered) {
        timeUp()
      }
    }
  }, 1000)
}

// Handle Answer Selection
function selectAnswer(selectedIndex) {
  if (answered) return // Prevent multiple selections

  answered = true
  clearInterval(timer)

  const question = shuffledQuestions[currentQuestionIndex]
  const options = document.querySelectorAll(".option")

  // Disable all options
  options.forEach((option) => option.classList.add("disabled"))

  // Show correct and wrong answers
  options.forEach((option, index) => {
    if (index === question.correct) {
      option.classList.add("correct")
    } else if (index === selectedIndex && selectedIndex !== question.correct) {
      option.classList.add("wrong")
    }
  })

  // Update score and play appropriate sound
  if (selectedIndex === question.correct) {
    score++
    playSound(800, 0.2) // High pitch for correct answer
  } else {
    playSound(300, 0.5) // Low pitch for wrong answer
  }

  // Move to next question after a delay
  setTimeout(() => {
    nextQuestion()
  }, 2000)
}

// Handle Time Up Scenario
function timeUp() {
  answered = true
  const question = shuffledQuestions[currentQuestionIndex]
  const options = document.querySelectorAll(".option")

  // Show correct answer
  options.forEach((option, index) => {
    option.classList.add("disabled")
    if (index === question.correct) {
      option.classList.add("correct")
    }
  })

  // Play wrong answer sound
  playSound(300, 0.5)

  // Move to next question after delay
  setTimeout(() => {
    nextQuestion()
  }, 2000)
}

// Move to Next Question or End Quiz
function nextQuestion() {
  currentQuestionIndex++

  if (currentQuestionIndex < shuffledQuestions.length) {
    loadQuestion()
  } else {
    endQuiz()
  }
}

// End Quiz and Show Results
function endQuiz() {
  const percentage = Math.round((score / shuffledQuestions.length) * 100)

  // Display final score
  scoreDisplay.textContent = `${score}/${shuffledQuestions.length}`
  scorePercentage.textContent = `${percentage}%`

  // Set motivational message based on score
  let message = ""
  if (percentage >= 90) {
    message = "Outstanding! You're a true campus expert! 🌟"
  } else if (percentage >= 80) {
    message = "Excellent work! You know your campus well! 👏"
  } else if (percentage >= 70) {
    message = "Good job! You have solid campus knowledge! 👍"
  } else if (percentage >= 60) {
    message = "Not bad! Keep exploring your campus! 📚"
  } else {
    message = "Time to get more involved in campus life! 💪"
  }

  scoreMessage.textContent = message
  showScreen(endScreen)

  // Play completion sound sequence
  playSound(600, 0.3)
  setTimeout(() => playSound(800, 0.3), 200)
}

// Toggle Sound On/Off
function toggleSound() {
  soundEnabled = !soundEnabled
  soundToggle.textContent = soundEnabled ? "🔊" : "🔇"
}

// Event Listeners
startBtn.addEventListener("click", startQuiz)
playAgainBtn.addEventListener("click", () => {
  showScreen(startScreen)
})
soundToggle.addEventListener("click", toggleSound)

// Initialize Game When Page Loads
document.addEventListener("DOMContentLoaded", () => {
  // Add initial animation to start screen
  setTimeout(() => {
    startScreen.classList.add("active")
  }, 100)
})
