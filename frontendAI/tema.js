document.addEventListener("DOMContentLoaded", () => {
    // 1. Creăm containerul principal (Wrapper)
    const wrapper = document.createElement("div");
    wrapper.className = "theme-switch-wrapper";

    // --- ELEMENTE TEMA (TOGGLE) ---
    const themeContainer = document.createElement("div");
    themeContainer.className = "theme-container"; 

    const textSpan = document.createElement("span");
    textSpan.id = "theme-text-label";
    
    const switchControl = document.createElement("div");
    switchControl.className = "theme-switch";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "theme-toggle-checkbox";

    const slider = document.createElement("span");
    slider.className = "slider";

    const label = document.createElement("label");
    label.htmlFor = "theme-toggle-checkbox";

    label.appendChild(slider);
    switchControl.appendChild(checkbox);
    switchControl.appendChild(label);

    // Asamblare rând temă: [Text] [Toggle]
    themeContainer.appendChild(textSpan);
    themeContainer.appendChild(switchControl);

    // --- ELEMENTE LIMBA (DROPDOWN) ---
    const langSelect = document.createElement("select");
    langSelect.id = "dynamic-lang-select";
    langSelect.className = "lang-dropdown";

    const optionRo = document.createElement("option");
    optionRo.value = "ro";
    optionRo.textContent = "🇷🇴 RO";
    
    const optionEn = document.createElement("option");
    optionEn.value = "en";
    optionEn.textContent = "🇬🇧 EN";

    langSelect.appendChild(optionRo);
    langSelect.appendChild(optionEn);

    // --- ASAMBLARE FINALĂ (ORDINEA CONTEAZĂ AICI) ---
    
    // 1. Adăugăm Tema (Va fi SUS)
    wrapper.appendChild(themeContainer);
    
    // 2. Adăugăm Limba (Va fi JOS, sub temă)
    wrapper.appendChild(langSelect);

    // Punem totul în pagină
    document.body.appendChild(wrapper);

    // ================= LOGICA FUNCȚIONALĂ =================
    
    // A. Logică Temă
    const updateLabelText = (isDark) => {
        textSpan.textContent = isDark ? "Dark Mode" : "Light Mode";
    };

    const isDark = localStorage.getItem("theme") === "dark";
    if (isDark) {
        document.body.classList.add("dark-mode");
        checkbox.checked = true;
    }
    updateLabelText(isDark);

    checkbox.onchange = () => {
        const isCurrentlyDark = checkbox.checked;
        document.body.classList.toggle("dark-mode", isCurrentlyDark);
        localStorage.setItem("theme", isCurrentlyDark ? "dark" : "light");
        updateLabelText(isCurrentlyDark);
    };

    // B. Logică Limbă
    const savedLang = localStorage.getItem('preferredLang') || 'ro';
    langSelect.value = savedLang;

    langSelect.addEventListener('change', (e) => {
        const selectedLang = e.target.value;
        if (typeof updateLanguage === "function") {
            updateLanguage(selectedLang);
        }
        // Reload doar dacă e necesar (joc/profil)
        if(window.location.pathname.includes("joc.html") || window.location.pathname.includes("profil.html")) {
            window.location.reload();
        }
    });
});