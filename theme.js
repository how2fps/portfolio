(() => {
    const storageKey = "finn.portfolio.theme.v1";
    const themes = { dark: { label: "Moonlight", icon: "moon" }, light: { label: "Sunshine", icon: "sun" } };
    const validTheme = (value) => Object.prototype.hasOwnProperty.call(themes, value);
    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme;
        const toggle = document.getElementById("theme-toggle");
        if (!toggle) return;
        document.getElementById("theme-label").textContent = themes[theme].label;
        document.getElementById("theme-symbol").innerHTML = `<use href="#i-${themes[theme].icon}" />`;
        toggle.setAttribute("aria-label", `Colour theme: ${themes[theme].label}`);
        document.querySelectorAll("[data-theme-choice]").forEach((option) => {
            option.setAttribute("aria-checked", String(option.dataset.themeChoice === theme));
        });
    }
    window.addEventListener("portfolio:theme-change", (event) => {
        if (!validTheme(event.detail)) return;
        applyTheme(event.detail);
        try { localStorage.setItem(storageKey, event.detail); } catch { /* Session-only choice. */ }
    });
    let initialTheme = "dark";
    try {
        const saved = localStorage.getItem(storageKey);
        if (validTheme(saved)) initialTheme = saved;
    } catch { /* Theme selection still works without browser storage. */ }
    applyTheme(initialTheme);
    document.addEventListener("DOMContentLoaded", () => {
        const picker = document.getElementById("theme-picker");
        const toggle = document.getElementById("theme-toggle");
        const menu = document.getElementById("theme-menu");
        if (!picker || !toggle || !menu) return;
        const options = Array.from(menu.querySelectorAll("[data-theme-choice]"));
        const closeMenu = (restoreFocus = false) => {
            menu.hidden = true;
            toggle.setAttribute("aria-expanded", "false");
            if (restoreFocus) toggle.focus();
        };
        const openMenu = (last = false) => {
            menu.hidden = false;
            toggle.setAttribute("aria-expanded", "true");
            const selected = options.find((option) => option.dataset.themeChoice === document.documentElement.dataset.theme);
            (last ? options[options.length - 1] : selected || options[0])?.focus();
        };
        applyTheme(document.documentElement.dataset.theme);
        toggle.addEventListener("click", () => menu.hidden ? openMenu() : closeMenu());
        options.forEach((option) => option.addEventListener("click", () => {
            const theme = option.dataset.themeChoice;
            if (!validTheme(theme)) return;
            applyTheme(theme);
            try { localStorage.setItem(storageKey, theme); } catch { /* Use this session's choice. */ }
            closeMenu(true);
        }));
        picker.addEventListener("keydown", (event) => {
            const keys = ["ArrowDown", "ArrowUp", "Home", "End", "Escape"];
            if (event.key === "Tab") { closeMenu(); return; }
            if (!keys.includes(event.key)) return;
            if (event.key === "Escape") {
                if (!menu.hidden) { event.preventDefault(); event.stopPropagation(); closeMenu(true); }
                return;
            }
            event.preventDefault();
            if (menu.hidden) { openMenu(event.key === "ArrowUp" || event.key === "End"); return; }
            const index = options.indexOf(document.activeElement);
            const next = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : (index + (event.key === "ArrowUp" ? -1 : 1) + options.length) % options.length;
            options[next].focus();
        });
        document.addEventListener("click", (event) => {
            if (!picker.contains(event.target)) closeMenu();
        });
        picker.addEventListener("focusout", (event) => {
            if (!picker.contains(event.relatedTarget)) closeMenu();
        });
    });
    window.addEventListener("storage", (event) => {
        if (event.key === storageKey) applyTheme(validTheme(event.newValue) ? event.newValue : "dark");
    });
})();
