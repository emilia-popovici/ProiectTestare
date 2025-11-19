document.addEventListener("DOMContentLoaded", () => {
    // --- 1. APLICAM TRADUCEREA PE HTML (Nou) ---
    // Fără asta, capul de tabel și butoanele rămân în română
    const savedLang = localStorage.getItem('preferredLang') || 'ro';
    if (typeof updateLanguage === 'function') {
        updateLanguage(savedLang);
    }
    // -------------------------------------------

    const token = localStorage.getItem('userToken');
    const email = localStorage.getItem('userEmail');
    const username = localStorage.getItem('userName');

    if (!token || !email) {
        window.location.href = 'index.html';
        return;
    }

    // 2. Aflăm numele
    const nume = username ? username : email.split('@')[0];
    
    // 3. Luăm traducerea pentru "Bun venit"
    const welcomeText = getTrans('prof_welcome'); 
    
    // 4. O afișăm
    // Asigură-te că în HTML ai un element cu id="profil-welcome"
    const welcomeElement = document.getElementById('profil-welcome');
    if(welcomeElement) {
        welcomeElement.textContent = `${welcomeText}, ${nume}!`;
    }
    
    loadUserScores(token);
});

async function loadUserScores(token) {
    const tableBody = document.querySelector('#scores-table tbody');
    
    // Mesaj de încărcare tradus
    tableBody.innerHTML = `<tr><td colspan="3">${getTrans('prof_loading')}</td></tr>`;

    try {
        const response = await fetch(`${API_URL}/scores`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            localStorage.removeItem('userToken');
            tableBody.innerHTML = `<tr><td colspan="3">${getTrans('prof_session_expired')}</td></tr>`;
            return;
        }

        const scores = await response.json();
        tableBody.innerHTML = '';

        if (scores.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="3">${getTrans('prof_no_scores')}</td></tr>`;
            return;
        }

        scores.forEach(s => {
            const row = tableBody.insertRow();
            
            // Data
            row.insertCell().textContent = new Date(s.createdAt).toLocaleDateString();
            
            // Scor
            row.insertCell().textContent = `${s.score} / ${s.total}`;
            
            // Badge (Tradus)
            const badgeCell = row.insertCell();
            let badgeKey = 'badge_novice'; // default
            
            if (s.score === s.total) badgeKey = 'badge_expert';
            else if (s.score >= 2) badgeKey = 'badge_good';
            
            badgeCell.textContent = getTrans(badgeKey);
        });

    } catch (e) { 
        console.error(e);
        tableBody.innerHTML = `<tr><td colspan="3">Error loading scores.</td></tr>`;
    }
}

async function deleteAccount() {
    // Confirmare
    // Nota: Asigura-te ca ai 'delete_confirm' in lang.js, altfel va afisa "Are you sure?"
    const confirmMsg = getTrans('delete_confirm') !== 'delete_confirm' ? getTrans('delete_confirm') : "Are you sure you want to delete your account?";
    
    if (!confirm(confirmMsg)) return;

    const token = localStorage.getItem('userToken');
    try {
        const response = await fetch(`${API_URL}/auth/delete`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert(getTrans('alert_logout')); // Sau un mesaj specific de delete success
            localStorage.removeItem('userToken');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');
            window.location.href = 'index.html';
        } else {
            alert("Error deleting account.");
        }
    } catch (error) {
        console.error("Delete Error:", error);
        alert("Connection error.");
    }
}