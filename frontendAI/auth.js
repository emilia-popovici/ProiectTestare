// auth.js - ACTUALIZAT PENTRU TRADUCERI SI EROARE LOGIN

const authLink = document.getElementById('auth-link');
const modal = document.getElementById('auth-modal');
const toggleLink = document.getElementById('toggle-auth');
const usernameInput = document.getElementById('auth-username'); 
const authTitle = document.getElementById('auth-title');
const authBtn = document.getElementById('auth-button');

let isRegistering = false;

// --- MODIFICARE 1: Folosim getTrans pentru a schimba textele ---
const toggleAuthMode = (e) => {
    e.preventDefault();
    isRegistering = !isRegistering;
    
    // Verificam daca functia getTrans exista (vine din lang.js)
    // Daca nu exista, folosim un fallback (textul in romana)
    const _t = (typeof getTrans === 'function') ? getTrans : (k) => k;

    if (isRegistering) {
        authTitle.textContent = _t('auth_title_register'); // "Înregistrare"
        authBtn.textContent = _t('auth_btn_register');     // "Înregistrare"
        toggleLink.textContent = _t('auth_has_acc');       // "Ai deja cont?..."
        
        if (usernameInput) {
            usernameInput.style.display = 'block';
            usernameInput.required = true;
        }
    } else {
        authTitle.textContent = _t('auth_title_login');    // "Logare"
        authBtn.textContent = _t('auth_btn_login');        // "Logare"
        toggleLink.textContent = _t('auth_no_acc');        // "Nu ai cont?..."
        
        if (usernameInput) {
            usernameInput.style.display = 'none';
            usernameInput.required = false;
        }
    }
};
if (toggleLink) toggleLink.onclick = toggleAuthMode;

// --- MODIFICARE 2: Gestionarea erorilor (401/404) ---
window.handleAuthAction = async () => {
    // Preluam valorile
    // NOTA: Asigura-te ca input-ul de email are id="auth-email" in HTML
    // Chiar daca userul introduce Username acolo, noi il preluam ca "email" in variabila,
    // dar il trimitem la server ca 'username' sau 'email' in functie de backend.
    const emailVal = document.getElementById('auth-email').value; 
    const passwordVal = document.getElementById('auth-password').value;
    const usernameVal = usernameInput ? usernameInput.value : ''; 

    const endpoint = isRegistering ? '/auth/register' : '/auth/login';

    // Construim pachetul de date
    // Daca backend-ul tau la login asteapta { "username": "...", "password": "..." }
    // si tu scrii in campul de email, trebuie sa ne asiguram ca trimitem cheia corecta.
    
    let payload = {};
    
    if (isRegistering) {
        // La inregistrare trimitem: username, email, password
        payload = { 
            username: usernameVal, 
            email: emailVal, 
            password: passwordVal 
        };
    } else {
        // La login trimitem: username (care poate fi si emailul) si password
        payload = { 
            username: emailVal, // Backend-ul tau probabil cauta dupa 'username' chiar daca e email
            password: passwordVal 
        };
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // --- AICI ESTE SCHIMBAREA IMPORTANTA PENTRU EROARE ---
        
        // 1. Verificam daca e eroare de user/parola (401 sau 404)
        if (response.status === 401 || response.status === 404) {
            // Afisam mesajul tradus "Username sau parola incorecta"
            alert(getTrans('alert_invalid_creds'));
            return; 
        }

        const data = await response.json();

        if (response.ok) {
            if (!isRegistering) {
                // LOGIN SUCCESS
                localStorage.setItem('userToken', data.token);
                // Salvam email-ul sau username-ul primit de la server
                localStorage.setItem('userEmail', data.userEmail || emailVal);
                
                if (data.username) {
                    localStorage.setItem('userName', data.username);
                }

                alert(getTrans('alert_login_success')); // "Logare reusita!"
                window.location.reload();
            } else {
                // REGISTER SUCCESS
                alert(getTrans('alert_register_success')); // "Inregistrare reusita!"
                // Comutam automat pe login
                if (toggleLink) toggleLink.click(); 
            }
            if (modal) modal.style.display = 'none';
        } else {
            // Alte erori venite de la server (ex: "Email deja existent")
            alert(`Eroare: ${data.msg || 'A aparut o eroare necunoscuta.'}`);
        }
    } catch (error) {
        console.error(error);
        alert(getTrans('alert_server_error') || "Eroare conexiune server.");
    }
};

// Ce se intampla cand dai click pe butonul din dreapta sus (Login sau Profil)
if (authLink) authLink.onclick = (e) => {
    e.preventDefault();
    if (!localStorage.getItem('userToken')) {
        if (modal) modal.style.display = 'block';
        // Cand deschidem modala, ne asiguram ca textele sunt traduse corect
        // Resetam la login mode initial
        isRegistering = true; 
        toggleAuthMode(e); // Asta il va face false (Login) si va pune textele corecte
    } else {
        window.location.href = 'profil.html';
    }
};

window.simulateLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName'); 
    alert(getTrans('alert_logout'));
    window.location.href = 'index.html'; 
};

function checkAuthStatus() {
    const token = localStorage.getItem('userToken');
    const email = localStorage.getItem('userEmail');
    const storedUsername = localStorage.getItem('userName'); 
    
    const elementeDeAratat = document.querySelectorAll('[data-auth="show"]');

    if (token) {
        if (authLink) {
            const displayName = storedUsername ? storedUsername : (email ? email.split('@')[0] : 'User');
            authLink.textContent = displayName; // Aici punem numele userului
            authLink.href = 'profil.html';
        }
        elementeDeAratat.forEach(el => el.style.display = 'block');
    } else {
        if (authLink) {
            // Aici trebuie sa folosim traducerea pentru butonul "Login" din meniu
            authLink.textContent = getTrans('btn_login'); 
            authLink.href = '#';
        }
        elementeDeAratat.forEach(el => el.style.display = 'none');
    }
}

document.addEventListener("DOMContentLoaded", checkAuthStatus);

// Tasta Enter pentru parola
const inputParola = document.getElementById('auth-password');
if (inputParola) {
    inputParola.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("auth-button").click();
        }
    });
}