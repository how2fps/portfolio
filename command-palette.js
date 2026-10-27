(() => {
    const dialog = document.getElementById("command-palette");
    const input = document.getElementById("palette-input");
    const results = document.getElementById("palette-results");
    if (!dialog || !input || !results) return;
    const normalize = (value) => String(value).toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim();
    let matches = [];
    let selected = 0;
    let previousFocus;
    const commands = () => [
        { label: "Welcome", kind: "Page", route: "home", keywords: "home" },
        { label: "About Finn", kind: "Page", route: "about", keywords: "biography education" },
        { label: "Links & elsewhere", kind: "Page", route: "links", keywords: "contact social" },
        { label: "All projects", kind: "Page", route: "search/All%20projects", keywords: "work portfolio" },
        ...(window.portfolioData?.projects || []).map((project) => ({ label: project.title, kind: "Project", route: `project/${project.id}`, keywords: [project.category, ...project.technologies].join(" ") })),
        { label: "GitHub · how2fps", kind: "Link", href: "https://github.com/how2fps", keywords: "source code repositories" },
        { label: "LeetCode · finnyap_", kind: "Link", href: "https://leetcode.com/u/finnyap_/", keywords: "coding practice algorithms" },
        { label: "LinkedIn · Finn Yap", kind: "Link", href: "https://www.linkedin.com/in/finn-yap-0a686b217/", keywords: "professional contact" },
        { label: "Moonlight", kind: "Theme", theme: "dark", keywords: "dark appearance night" },
        { label: "Sunshine", kind: "Theme", theme: "light", keywords: "light appearance day" },
    ];
    function select(index) {
        if (!matches.length) { input.removeAttribute("aria-activedescendant"); return; }
        selected = (index + matches.length) % matches.length;
        Array.from(results.children).forEach((option, i) => option.setAttribute("aria-selected", String(i === selected)));
        input.setAttribute("aria-activedescendant", `palette-option-${selected}`);
        results.children[selected]?.scrollIntoView({ block: "nearest" });
    }
    function render() {
        const tokens = normalize(input.value).split(" ").filter(Boolean);
        matches = commands().map((command, order) => {
            const title = normalize(command.label);
            const haystack = normalize(`${command.label} ${command.kind} ${command.keywords}`);
            return { command, order, score: tokens.every((token) => haystack.includes(token)) ? tokens.reduce((sum, token) => sum + (title.includes(token) ? 3 : 1), 0) : -1 };
        }).filter((item) => item.score >= 0).sort((a, b) => b.score - a.score || a.order - b.order).map((item) => item.command);
        results.replaceChildren();
        matches.forEach((command, index) => {
            const option = document.createElement(command.href ? "a" : "div");
            option.className = "palette-option";
            option.id = `palette-option-${index}`;
            option.setAttribute("role", "option");
            option.setAttribute("tabindex", "-1");
            if (command.href) { option.href = command.href; option.target = "_blank"; option.rel = "noopener noreferrer"; }
            const label = document.createElement("span"); label.textContent = command.label;
            const kind = document.createElement("small"); kind.textContent = command.kind;
            option.append(label, kind);
            option.addEventListener("pointermove", () => { if (selected !== index) select(index); });
            option.addEventListener("mousedown", (event) => event.preventDefault());
            option.addEventListener("click", () => execute(command));
            results.append(option);
        });
        document.getElementById("palette-empty").hidden = matches.length > 0;
        document.getElementById("palette-status").textContent = `${matches.length} command${matches.length === 1 ? "" : "s"} available`;
        select(0);
    }
    function execute(command) {
        dialog.close();
        if (command.route) location.hash = command.route;
        if (command.theme) window.dispatchEvent(new CustomEvent("portfolio:theme-change", { detail: command.theme }));
    }
    function open() {
        previousFocus = document.activeElement;
        input.value = "";
        dialog.showModal();
        input.setAttribute("aria-expanded", "true");
        render();
        input.focus();
    }
    document.addEventListener("keydown", (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k" && !event.isComposing) {
            event.preventDefault();
            if (dialog.open) dialog.close(); else open();
        }
    });
    document.addEventListener("click", (event) => {
        if (event.target.closest("[data-open-palette]") && !dialog.open) open();
    });
    input.addEventListener("input", render);
    input.addEventListener("keydown", (event) => {
        if (event.isComposing) return;
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault(); select(selected + (event.key === "ArrowDown" ? 1 : -1));
        } else if (event.key === "Enter") {
            event.preventDefault(); results.children[selected]?.click();
        }
    });
    document.getElementById("palette-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
        if (event.target !== dialog) return;
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener("close", () => {
        input.setAttribute("aria-expanded", "false");
        input.removeAttribute("aria-activedescendant");
        if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    });
})();
