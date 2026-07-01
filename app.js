const notesInput = document.getElementById('notesInput');
const fileInput = document.getElementById('fileInput');
const summaryOutput = document.getElementById('summaryOutput');
const quizOutput = document.getElementById('quizOutput');
const flashOutput = document.getElementById('flashOutput');
const planOutput = document.getElementById('planOutput');
const weakOutput = document.getElementById('weakOutput');
const checkQuizBtn = document.getElementById('checkQuizBtn');
const examDateInput = document.getElementById('examDate');
const dailyTimeInput = document.getElementById('dailyTime');

const demoNotes = `Quantum key distribution is a secure communication method that uses quantum physics to share encryption keys. In the BB84 protocol, Alice sends qubits to Bob using different bases. If an eavesdropper tries to measure the qubits, the quantum state changes. This creates errors, so Alice and Bob can detect spying. Cybersecurity protects information from unauthorized access, attacks, and data theft. Encryption changes a message into unreadable text using a key. A strong study plan helps students revise important topics before an exam. Flashcards and quizzes improve memory because students actively recall information instead of only reading notes.`;

const topicBank = [
  {
    topic: 'Artificial Intelligence',
    terms: ['ai', 'artificial intelligence', 'machine learning', 'model', 'neural'],
    question: 'What is the main purpose of artificial intelligence?',
    answer: 'To make computers perform tasks that usually require human intelligence.',
    wrong: ['To store files only', 'To make internet cables faster', 'To remove all databases']
  },
  {
    topic: 'Cybersecurity',
    terms: ['cybersecurity', 'security', 'attack', 'hacker', 'malware'],
    question: 'What is cybersecurity mainly used for?',
    answer: 'Protecting systems and data from unauthorized access or attacks.',
    wrong: ['Making screens brighter', 'Increasing laptop battery size', 'Designing furniture']
  },
  {
    topic: 'Encryption',
    terms: ['encryption', 'cipher', 'key', 'decrypt', 'encrypted'],
    question: 'What does encryption do?',
    answer: 'It changes readable information into unreadable form using a key.',
    wrong: ['It deletes all information', 'It prints data on paper', 'It turns images into videos']
  },
  {
    topic: 'Quantum Communication',
    terms: ['quantum', 'qubit', 'bb84', 'alice', 'bob', 'eavesdropper'],
    question: 'Why can quantum communication detect spying?',
    answer: 'Measuring a quantum state can change it and create detectable errors.',
    wrong: ['Because it uses longer passwords', 'Because it blocks all Wi-Fi', 'Because it hides the sender name only']
  },
  {
    topic: 'Education Technology',
    terms: ['student', 'study', 'exam', 'quiz', 'flashcard', 'revision'],
    question: 'Why are quizzes useful for studying?',
    answer: 'They force active recall, which helps memory and shows weak topics.',
    wrong: ['They stop students from reading', 'They guarantee 100% marks', 'They replace all teachers permanently']
  },
  {
    topic: 'Networks',
    terms: ['network', 'protocol', 'server', 'client', 'packet'],
    question: 'What is a network protocol?',
    answer: 'A set of rules that devices use to communicate.',
    wrong: ['A type of computer screen', 'A student attendance list', 'A kind of battery']
  },
  {
    topic: 'Algorithms',
    terms: ['algorithm', 'data structure', 'sorting', 'searching', 'tree', 'graph'],
    question: 'What is an algorithm?',
    answer: 'A step-by-step method for solving a problem.',
    wrong: ['A random guess', 'A computer virus', 'A hardware cable']
  }
];

function getText() {
  return notesInput.value.trim();
}

function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-page').forEach(page => {
    page.classList.toggle('active', page.id === tabId);
  });
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));
}

const stopWords = new Set([
  'this', 'that', 'with', 'from', 'have', 'they', 'will', 'into', 'using', 'uses',
  'because', 'about', 'which', 'their', 'there', 'before', 'after', 'only', 'also',
  'more', 'many', 'some', 'when', 'what', 'where', 'been', 'than', 'then'
]);

function detectTopics(text) {
  const lower = text.toLowerCase();
  const found = topicBank.filter(item => item.terms.some(term => lower.includes(term)));
  return found.length ? found : topicBank.slice(0, 3);
}

function topKeywords(text, limit = 8) {
  const words = tokenize(text);
  const counts = {};
  words.forEach(word => counts[word] = (counts[word] || 0) + 1);
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

function splitSentences(text) {
  return text
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 20);
}

function requireNotes() {
  if (!getText()) {
    alert('Add study material first. You can paste notes or load demo notes.');
    return false;
  }
  return true;
}

function createSummary() {
  if (!requireNotes()) return;
  const text = getText();
  const keywords = topKeywords(text, 10);
  const sentences = splitSentences(text);

  const scored = sentences.map(sentence => {
    const lower = sentence.toLowerCase();
    const score = keywords.reduce((sum, keyword) => lower.includes(keyword) ? sum + 1 : sum, 0);
    return { sentence, score };
  });

  const selected = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => simplifySentence(item.sentence));

  const topics = detectTopics(text).map(item => item.topic).join(', ');

  summaryOutput.className = 'output-box';
  summaryOutput.innerHTML = `
    <p><strong>Main topics:</strong> ${topics}</p>
    <p><strong>Important keywords:</strong> ${keywords.join(', ') || 'No keywords found'}</p>
    <ol class="summary-list">
      ${selected.map(sentence => `<li>${sentence}</li>`).join('')}
    </ol>
    <p><strong>Simple conclusion:</strong> Focus on the main ideas, test yourself, and revise weak topics first.</p>
  `;
  showTab('summary');
}

function simplifySentence(sentence) {
  return sentence
    .replace(/utilizes/gi, 'uses')
    .replace(/demonstrates/gi, 'shows')
    .replace(/unauthorized/gi, 'not allowed')
    .replace(/communication/gi, 'sending information')
    .replace(/fundamental/gi, 'basic')
    .replace(/approximately/gi, 'about');
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function generateQuiz() {
  if (!requireNotes()) return;
  const topics = detectTopics(getText()).slice(0, 5);

  quizOutput.className = '';
  quizOutput.innerHTML = topics.map((item, index) => {
    const options = shuffle([item.answer, ...item.wrong]).map(option => `
      <label class="option">
        <input type="radio" name="q${index}" value="${escapeAttr(option)}" data-topic="${item.topic}" data-answer="${escapeAttr(item.answer)}" />
        ${option}
      </label>
    `).join('');

    return `
      <div class="quiz-question">
        <h4>Q${index + 1}. ${item.question}</h4>
        ${options}
      </div>
    `;
  }).join('');

  checkQuizBtn.classList.remove('hidden');
  document.getElementById('quizResult').textContent = '';
  showTab('quiz');
}

function escapeAttr(text) {
  return text.replace(/"/g, '&quot;');
}

function getWeakAreas() {
  return JSON.parse(localStorage.getItem('eduWeakAreas') || '{}');
}

function saveWeakAreas(areas) {
  localStorage.setItem('eduWeakAreas', JSON.stringify(areas));
}

function checkQuiz() {
  const questions = quizOutput.querySelectorAll('.quiz-question');
  if (!questions.length) return;

  let score = 0;
  const weakAreas = getWeakAreas();

  questions.forEach((question, index) => {
    const selected = question.querySelector(`input[name="q${index}"]:checked`);
    const allOptions = question.querySelectorAll('label');
    allOptions.forEach(label => label.classList.remove('good', 'bad'));

    if (!selected) {
      const topic = question.querySelector('input')?.dataset.topic || 'Unknown topic';
      weakAreas[topic] = (weakAreas[topic] || 0) + 1;
      return;
    }

    const correct = selected.dataset.answer;
    const topic = selected.dataset.topic;
    const selectedLabel = selected.closest('label');

    if (selected.value === correct) {
      score++;
      selectedLabel.classList.add('good');
    } else {
      selectedLabel.classList.add('bad');
      weakAreas[topic] = (weakAreas[topic] || 0) + 1;
      question.querySelectorAll('input').forEach(input => {
        if (input.value === correct) input.closest('label').classList.add('good');
      });
    }
  });

  saveWeakAreas(weakAreas);
  document.getElementById('quizResult').innerHTML = `Score: ${score}/${questions.length}. ${score === questions.length ? '<span class="good">Great job!</span>' : '<span class="bad">Review weak areas.</span>'}`;
  renderWeakAreas();
}

function makeFlashcards() {
  if (!requireNotes()) return;
  const keywords = topKeywords(getText(), 8);
  const topics = detectTopics(getText());
  const definitions = {};

  topics.forEach(topic => {
    definitions[topic.topic.toLowerCase()] = topic.answer;
    topic.terms.forEach(term => definitions[term] = topic.answer);
  });

  const cards = keywords.slice(0, 8).map(keyword => {
    const matchingTopic = topics.find(topic => topic.terms.some(term => keyword.includes(term) || term.includes(keyword)));
    const back = matchingTopic
      ? matchingTopic.answer
      : `Important keyword from your notes. Try to explain how "${keyword}" connects to the lesson.`;

    return `
      <div class="flashcard" tabindex="0">
        <div class="flashcard-inner">
          <div class="card-front">${capitalize(keyword)}</div>
          <div class="card-back">${back}</div>
        </div>
      </div>
    `;
  }).join('');

  flashOutput.className = 'cards';
  flashOutput.innerHTML = cards || '<div class="output-box empty">Not enough keywords to create flashcards.</div>';

  flashOutput.querySelectorAll('.flashcard').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') card.classList.toggle('flipped');
    });
  });

  showTab('flashcards');
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function buildStudyPlan() {
  if (!requireNotes()) return;

  const examDateValue = examDateInput.value;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let days = 5;
  if (examDateValue) {
    const examDate = new Date(examDateValue + 'T00:00:00');
    const diff = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
    days = Math.max(1, Math.min(diff, 14));
  }

  const dailyTime = Number(dailyTimeInput.value);
  const topics = detectTopics(getText()).map(item => item.topic);
  const weak = Object.entries(getWeakAreas()).sort((a, b) => b[1] - a[1]).map(([topic]) => topic);
  const planTopics = [...new Set([...weak, ...topics])];

  const planItems = Array.from({ length: days }, (_, index) => {
    const topic = planTopics[index % planTopics.length] || 'main notes';
    const task = index === days - 1
      ? `Final review: retake quiz, revise flashcards, and summarize all weak topics.`
      : `Study ${topic}. Spend ${Math.floor(dailyTime * 0.55)} min reading summary, ${Math.floor(dailyTime * 0.25)} min flashcards, and ${Math.floor(dailyTime * 0.20)} min quiz practice.`;

    return `<li><strong>Day ${index + 1}:</strong> ${task}</li>`;
  }).join('');

  planOutput.className = 'output-box';
  planOutput.innerHTML = `
    <p><strong>Priority order:</strong> ${planTopics.join(' → ')}</p>
    <ol class="plan-list">${planItems}</ol>
  `;
  showTab('plan');
}

function renderWeakAreas() {
  const areas = getWeakAreas();
  const entries = Object.entries(areas).sort((a, b) => b[1] - a[1]);

  if (!entries.length) {
    weakOutput.className = 'output-box empty';
    weakOutput.textContent = 'Wrong quiz answers will appear here.';
    return;
  }

  weakOutput.className = 'output-box';
  weakOutput.innerHTML = `
    <p>Revise these topics first:</p>
    <ol class="weak-list">
      ${entries.map(([topic, count]) => `<li><strong>${topic}</strong> — ${count} mistake${count > 1 ? 's' : ''}</li>`).join('')}
    </ol>
  `;
}

fileInput.addEventListener('change', event => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => notesInput.value = reader.result;
  reader.readAsText(file);
});

document.getElementById('loadDemoBtn').addEventListener('click', () => {
  notesInput.value = demoNotes;
});

document.getElementById('summaryBtn').addEventListener('click', createSummary);
document.getElementById('quizBtn').addEventListener('click', generateQuiz);
document.getElementById('flashBtn').addEventListener('click', makeFlashcards);
document.getElementById('planBtn').addEventListener('click', buildStudyPlan);
checkQuizBtn.addEventListener('click', checkQuiz);
document.getElementById('clearWeakBtn').addEventListener('click', () => {
  localStorage.removeItem('eduWeakAreas');
  renderWeakAreas();
});

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => showTab(tab.dataset.tab));
});

// Set default exam date to 7 days from today
const defaultDate = new Date();
defaultDate.setDate(defaultDate.getDate() + 7);
examDateInput.value = defaultDate.toISOString().slice(0, 10);
renderWeakAreas();
