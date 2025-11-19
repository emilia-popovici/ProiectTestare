// joc.js

let questions = []; 
let current = 0;
let score = 0;

// --- ACEASTA ESTE PARTEA NOUĂ ESENȚIALĂ ---
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLang') || 'ro';
    
    // 1. Traducem elementele statice (Titlul H1 si butonul de jos)
    // Funcția updateLanguage vine din lang.js
    if (typeof updateLanguage === 'function') {
        updateLanguage(savedLang);
    }

    // 2. Inițializăm jocul
    initializeGame();
});
// -------------------------------------------

// Helper pentru a lua textul in limba curenta (pentru elementele generate dinamic)
function getTrans(key) {
    const lang = localStorage.getItem('preferredLang') || 'ro';
    // Verificăm dacă dicționarul există (vine din lang.js)
    if (typeof translations !== 'undefined' && translations[lang] && translations[lang][key]) {
        return translations[lang][key];
    }
    return key; // Fallback
}

async function initializeGame() {
    try {
        const response = await fetch(`${API_URL}/quiz/questions`);
        if (!response.ok) throw new Error('Eroare server');
        questions = await response.json();
        if(questions.length === 0) throw new Error('Fara intrebari');
        restartQuiz(); 
    } catch (e) {
        console.error(e);
        document.getElementById('quiz-container').innerHTML = `<p style="color:red;">Eroare: ${e.message}</p>`;
    }
}

function restartQuiz() {
    current = 0;
    score = 0;
    loadQuestion(current);
}

function loadQuestion(index) {
    const container = document.getElementById("quiz-container");
    container.innerHTML = "";
    const q = questions[index];

    // VIDEO
    const video = document.createElement("video");
    video.src = q.video;
    video.controls = true;
    video.autoplay = true; // Notă: Autoplay merge de obicei doar dacă e muted
    video.muted = true;    // Important pentru autoplay
    video.playsInline = true;
    video.style.width = "100%";
    video.style.maxWidth = "600px";
    video.style.borderRadius = "12px";
    video.style.marginBottom = "15px";
    container.appendChild(video);

    // TITLU INTREBARE (TRADUS)
    const questionText = document.createElement("h3");
    questionText.textContent = getTrans('game_q_title'); 
    questionText.style.margin = "15px 0";
    container.appendChild(questionText);

    // FEEDBACK
    const feedback = document.createElement("div");
    feedback.className = "feedback";
    feedback.style.marginBottom = "15px";
    feedback.style.height = "30px";
    container.appendChild(feedback);

    // BUTON NEXT (TRADUS)
    const btnNext = document.createElement("button");
    btnNext.textContent = getTrans('btn_next_q'); 
    btnNext.style.backgroundColor = "var(--text-color)"; 
    btnNext.style.color = "var(--bg-color)";
    btnNext.style.padding = "10px 20px";
    btnNext.style.marginTop = "20px";
    btnNext.style.border = "none";
    btnNext.style.borderRadius = "5px";
    btnNext.style.cursor = "pointer";
    btnNext.style.fontWeight = "bold";
    btnNext.style.display = "none"; 
    
    btnNext.onclick = () => {
        current++;
        if (current < questions.length) loadQuestion(current);
        else showResult();
    };

    // BUTOANE RASPUNS (TRADUSE)
    const btnContainer = document.createElement("div");
    
    const btnAI = document.createElement("button");
    btnAI.textContent = getTrans('btn_gen_ai'); 
    btnAI.className = "cta-button";
    btnAI.style.margin = "0 10px";
    btnAI.onclick = () => handleAnswer("AI", q.correct, feedback, btnAI, btnReal, btnNext);
    btnContainer.appendChild(btnAI);

    const btnReal = document.createElement("button");
    btnReal.textContent = getTrans('btn_is_real'); 
    btnReal.className = "cta-button";
    btnReal.style.margin = "0 10px";
    btnReal.onclick = () => handleAnswer("Real", q.correct, feedback, btnAI, btnReal, btnNext);
    btnContainer.appendChild(btnReal);

    container.appendChild(btnContainer);
    container.appendChild(btnNext);
}

function handleAnswer(selected, correct, feedback, btnAI, btnReal, btnNext) {
    btnAI.disabled = true;
    btnReal.disabled = true;
    btnAI.style.opacity = "0.5";
    btnReal.style.opacity = "0.5";

    if (selected === correct) {
        feedback.textContent = getTrans('feedback_correct'); 
        feedback.style.color = "green";
        score++;
    } else {
        feedback.textContent = getTrans('feedback_wrong') + correct; 
        feedback.style.color = "red";
    }
    btnNext.style.display = "inline-block";
}

function showResult() {
    const container = document.getElementById("quiz-container");
    
    // Aici folosim getTrans pentru a injecta textul tradus in HTML-ul final
    container.innerHTML = `
        <div style="text-align:center; padding: 30px;">
            <h2>${getTrans('game_over_title')}</h2>
            <p style="font-size: 20px;">${getTrans('score_text')} <strong>${score}</strong> / <strong>${questions.length}</strong></p>
            
            <div style="margin-top: 30px; display: flex; flex-direction: column; gap: 15px; align-items: center;">
                <button onclick="restartQuiz()" class="cta-button" style="width: 250px;">
                    ${getTrans('btn_play_again')}
                </button>
                
                <a href="profil.html" class="cta-button" style="background-color:var(--primary-color); color:white; text-decoration:none; width: 250px; text-align:center;">
                     ${getTrans('btn_view_profile')}
                </a>

                <a href="index.html" class="cta-button" style="background-color: #666; color: white; text-decoration:none; width: 250px; text-align:center;">
                     ${getTrans('btn_back_home')}
                </a>
            </div>
        </div>
    `;
    saveScore(score, questions.length);
}

function saveScore(scoreVal, totalVal) {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    fetch(`${API_URL}/scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ score: scoreVal, total: totalVal })
    }).catch(console.error);
}