const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const icon = (name) => `<svg aria-hidden="true"><use href="#i-${name}"></use></svg>`;
const text = (element) => element?.textContent.replace(/\s+/g, " ").trim() || "";
const normalize = (value) => value.toLowerCase().normalize("NFKD").replace(/[’']/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const slug = (value) => normalize(value).replace(/\s+/g, "-");
const mobile = window.matchMedia("(max-width: 700px)");
let projects = [];
let biography = [];
let lastNavigationFocus;
const recentChatsKey = "finn.portfolio.recent-chats.v1";
const recentChatsLimit = 6;
let recentRoutes = [];
try {
    const stored = JSON.parse(localStorage.getItem(recentChatsKey) || "[]");
    if (Array.isArray(stored)) recentRoutes = [...new Set(stored.filter((route) => typeof route === "string" && route.length <= 260))].slice(0, recentChatsLimit);
} catch { /* Keep in-memory recents when browser storage is unavailable. */ }

function recentChat(route) {
    if (route === "home") return { route, title: "Welcome" };
    if (route === "about") return { route, title: "About Finn" };
    if (route === "links") return { route, title: "Links & elsewhere" };
    if (route.startsWith("project/")) {
        const project = projects.find((item) => item.id === route.slice(8));
        if (project) return { route, title: project.title };
    }
    if (route.startsWith("search/") && route.slice(7).trim()) return { route, title: route.slice(7) };
    return null;
}

function rememberCurrentChat() {
    let route;
    try { route = decodeURIComponent(location.hash.slice(1)) || "home"; } catch { route = "home"; }
    if (!recentChat(route)) return;
    recentRoutes = [route, ...recentRoutes.filter((previous) => previous !== route && recentChat(previous))].slice(0, recentChatsLimit);
    try { localStorage.setItem(recentChatsKey, JSON.stringify(recentRoutes)); } catch { /* In-memory navigation still works. */ }
    const focusedRoute = document.activeElement?.matches(".recent-chat") ? document.activeElement.dataset.route : null;
    $("#recent-chats-list").innerHTML = recentRoutes.map((entry) => {
        const chat = recentChat(entry);
        const navigationRoute = chat.route.startsWith("search/") ? `search/${encodeURIComponent(chat.route.slice(7))}` : chat.route;
        return `<button class="recent-chat" type="button" data-route="${escapeHtml(navigationRoute)}" title="${escapeHtml(chat.title)}"${entry === route ? ' aria-current="page"' : ""}>${escapeHtml(chat.title)}</button>`;
    }).join("");
    if (focusedRoute && !mobile.matches) {
        Array.from(document.querySelectorAll(".recent-chat")).find((button) => button.dataset.route === focusedRoute)?.focus({ preventScroll: true });
    }
}

function externalLink(link, className = "inline-link") {
    return `<a class="${className}" href="${escapeHtml(link.href)}" target="_blank" rel="noopener noreferrer">${className === "detail-link" ? icon("link") : ""}<span>${escapeHtml(link.label)}</span>${className === "inline-link" ? icon("arrow-up-right") : ""}</a>`;
}

function setSidebar(open) {
    if (mobile.matches) document.body.classList.toggle("mobile-sidebar-open", open);
    else document.body.classList.toggle("sidebar-closed", !open);
    $("#sidebar-toggle").setAttribute("aria-expanded", String(open));
    if (open && mobile.matches) {
        lastNavigationFocus = document.activeElement;
        $(".sidebar a, .sidebar button")?.focus();
    }
}

function setDetails(open) {
    document.body.classList.toggle("details-open", open);
    $("#details-toggle").setAttribute("aria-expanded", String(open));
}

function go(route) {
    if (location.hash === `#${route}`) renderRoute();
    else location.hash = route;
}

function renderNavigation() {
    $("#project-count").textContent = projects.length;
    $("#project-navigation").innerHTML = projects.map((project) => `<a class="project-nav" href="#project/${project.id}" data-project-id="${project.id}">${icon("folder")}<span><strong>${escapeHtml(project.title)}</strong><small>${escapeHtml(project.category)}</small></span></a>`).join("");
}

function technologyTags(technologies) {
    return `<div class="tech-tags">${technologies.map((technology) => `<span class="tech-tag">${escapeHtml(technology)}</span>`).join("")}</div>`;
}

function screenshotImage(shot, thumbnail = false) {
    const srcset = shot.width > 480 ? `${shot.thumbnail} 480w, ${shot.src} ${shot.width}w` : `${shot.src} ${shot.width}w`;
    return `<img src="${escapeHtml(thumbnail ? shot.thumbnail : shot.src)}"${thumbnail ? "" : ` srcset="${escapeHtml(srcset)}" sizes="(max-width: 700px) 100vw, 760px"`} width="${shot.width}" height="${shot.height}" alt="${thumbnail ? "" : escapeHtml(shot.alt)}"${thumbnail ? ' loading="lazy"' : ""} decoding="async">`;
}

function renderGallery(project) {
    const first = project.screenshots[0];
    return `<section class="screenshot-gallery" aria-labelledby="screenshots-heading">
        <h3 id="screenshots-heading">Inside the app</h3>
        <p class="screenshot-note">${escapeHtml(project.previewNote)}</p>
        <figure class="project-media screenshot-viewer">
            <a class="screenshot-full" href="${escapeHtml(first.src)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHtml(first.title.toLowerCase())} screenshot at full size">${screenshotImage(first)}</a>
            <figcaption><strong class="screenshot-title">${escapeHtml(first.title)}</strong><span class="screenshot-caption">${escapeHtml(first.caption)}</span></figcaption>
        </figure>
        <div class="gallery-toolbar"><span class="screenshot-position" aria-live="polite">1 / ${project.screenshots.length}</span><a class="screenshot-open" href="${escapeHtml(first.src)}" target="_blank" rel="noopener noreferrer">Open full size ${icon("arrow-up-right")}</a><div class="gallery-controls"><button class="icon-button" type="button" data-gallery-step="-1" aria-label="Previous screenshot" disabled>${icon("arrow-right")}</button><button class="icon-button" type="button" data-gallery-step="1" aria-label="Next screenshot">${icon("arrow-right")}</button></div></div>
        <div class="screenshot-choices" role="group" aria-label="${escapeHtml(project.title)} screenshots">${project.screenshots.map((shot, index) => `<button class="screenshot-choice" type="button" data-screenshot="${index}" aria-label="Show screenshot ${index + 1}: ${escapeHtml(shot.title)}" aria-pressed="${index === 0}">${screenshotImage(shot, true)}<span>${escapeHtml(shot.title)}</span></button>`).join("")}</div>
    </section>`;
}

function selectScreenshot(gallery, index) {
    const project = projects.find((item) => item.id === gallery.closest("[data-project]")?.dataset.project);
    const shot = project?.screenshots[index];
    if (!shot) return;
    const full = gallery.querySelector(".screenshot-full");
    full.href = shot.src;
    full.setAttribute("aria-label", `Open ${shot.title.toLowerCase()} screenshot at full size`);
    full.innerHTML = screenshotImage(shot);
    gallery.querySelector(".screenshot-open").href = shot.src;
    gallery.querySelector(".screenshot-title").textContent = shot.title;
    gallery.querySelector(".screenshot-caption").textContent = shot.caption;
    gallery.querySelector(".screenshot-position").textContent = `${index + 1} / ${project.screenshots.length}`;
    gallery.querySelector('[data-gallery-step="-1"]').disabled = index === 0;
    gallery.querySelector('[data-gallery-step="1"]').disabled = index === project.screenshots.length - 1;
    gallery.querySelectorAll(".screenshot-choice").forEach((button, buttonIndex) => button.setAttribute("aria-pressed", String(buttonIndex === index)));
    const selected = gallery.querySelector(`[data-screenshot="${index}"]`);
    const choices = gallery.querySelector(".screenshot-choices");
    if (selected.offsetLeft < choices.scrollLeft) choices.scrollLeft = selected.offsetLeft;
    else if (selected.offsetLeft + selected.offsetWidth > choices.scrollLeft + choices.clientWidth) choices.scrollLeft = selected.offsetLeft + selected.offsetWidth - choices.clientWidth;
}

function renderDetails(project) {
    const links = project ? project.links : [
        { label: "GitHub", href: "https://github.com/how2fps" },
        { label: "Portfolio overview", href: "./overview.html" },
    ];
    const linkMarkup = links.map((link) => externalLink(link, "detail-link")).join("");
    const stack = project?.technologyGroups.length
        ? project.technologyGroups.map((group) => `<section class="detail-section"><h3>${escapeHtml(group.title)}</h3>${technologyTags(group.technologies)}</section>`).join("")
        : project?.technologies.length ? `<section class="detail-section"><h3>Built with</h3>${technologyTags(project.technologies)}</section>` : "";
    $("#details-content").innerHTML = `<div class="details-title"><span>${escapeHtml(project?.title || "portfolio")}</span><button class="icon-button" type="button" data-close-details aria-label="Close details">${icon("close")}</button></div>
        <section class="detail-section"><div class="detail-count">${icon(project ? "folder" : "grid")}<span>${project ? "Project" : "Selected work"}</span><span>${project ? "Finn" : `${projects.length} projects`}</span></div>${project ? `<p style="margin-top:12px">${escapeHtml(project.category)}</p>` : ""}</section>
        <section class="detail-section"><h3>Links</h3>${linkMarkup}</section>${stack}
        ${project?.image ? `<section class="detail-section"><h3>Preview</h3><a href="${escapeHtml(project.image.src)}" target="_blank" rel="noopener noreferrer"><img class="preview-thumb" src="${escapeHtml(project.image.src)}" alt="${escapeHtml(project.image.alt)}" width="${project.image.width}" height="${project.image.height}" loading="lazy"></a></section>` : ""}
        ${project ? `<section class="detail-section"><h3>Also available</h3><a class="detail-link" href="./overview.html">${icon("grid")}<span>View the portfolio overview</span></a></section>` : ""}`;
}

function showContent(markup, title, prompt = "") {
    $("#page-title").textContent = title;
    document.title = title === "Finn's portfolio" ? "Finn — Web Developer" : `${title} — Finn`;
    $("#content").innerHTML = `${prompt ? `<div class="request-bubble">${escapeHtml(prompt)}</div>` : ""}<div class="response-author"><span class="avatar" aria-hidden="true">F</span><span>Finn <span aria-hidden="true">·</span> Web developer</span></div>${markup}`;
    $("#conversation-scroll").scrollTop = 0;
    if (mobile.matches) setSidebar(false);
    $("#view-status").textContent = title;
    rememberCurrentChat();
}

function projectShortcuts(list) {
    return list.map((project) => `<button class="project-shortcut" type="button" data-route="project/${project.id}">${icon("folder")}<span>${escapeHtml(project.title)}</span><span aria-hidden="true">↗</span></button>`).join("");
}

function renderHome() {
    showContent(`<section class="welcome"><h2>Hey, I'm Finn.<br><span>I make things easier to use.</span></h2><p class="body-copy">I'm a web developer who cares about the small details. I build interfaces that turn everyday friction into a better experience.</p><p class="body-copy">You can explore my projects on the left, or start with something below.</p><div class="starter-prompts"><button class="prompt-chip" type="button" data-query="All projects">Show me your work</button><button class="prompt-chip" type="button" data-query="Spa POS">The spa POS project</button><button class="prompt-chip" type="button" data-route="about">A little about you</button></div><section class="home-projects"><h3>Things I've worked on</h3><div class="project-shortcuts">${projectShortcuts(projects)}</div></section></section>`, "Finn's portfolio");
    renderDetails();
}

function renderProject(project) {
    document.querySelector(`[data-project-id="${project.id}"]`)?.setAttribute("aria-current", "page");
    let media;
    if (project.screenshots.length) {
        media = renderGallery(project);
    } else if (project.image) {
        media = `<figure class="project-media"><a href="${escapeHtml(project.image.src)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHtml(project.title)} image"><img src="${escapeHtml(project.image.src)}" width="${project.image.width}" height="${project.image.height}" alt="${escapeHtml(project.image.alt)}" decoding="async"></a></figure>`;
    } else {
        const coverClass = project.id === "sproutteach" ? "sprout-cover" : project.id === "enbyte-systems" ? "enbyte-cover" : "envorya-cover";
        const coverIcon = project.id === "sproutteach" ? "sprout" : project.id === "enbyte-systems" ? "globe" : "receipt";
        media = `<figure class="project-media project-cover-preview ${coverClass}">${icon(coverIcon)}<span class="cover-title">${escapeHtml(project.title)}</span><span class="cover-subtitle">${escapeHtml(project.category)}</span></figure>`;
    }
    const stack = project.technologyGroups.length
        ? `<div class="project-stack">${project.technologyGroups.map((group) => `<section class="technology-group"><h3>${escapeHtml(group.title)}</h3><p class="body-copy">${escapeHtml(group.description)}</p>${technologyTags(group.technologies)}</section>`).join("")}</div>`
        : project.technologies.length ? `<p class="stack-heading">Built with</p>${technologyTags(project.technologies)}` : "";
    const next = projects[(projects.indexOf(project) + 1) % projects.length];
    showContent(`<article class="project-intro" data-project="${escapeHtml(project.id)}"><p class="section-kicker">Project ${String(projects.indexOf(project) + 1).padStart(2, "0")} of ${String(projects.length).padStart(2, "0")}</p><h2>${escapeHtml(project.title)}</h2><p class="project-type">${escapeHtml(project.category)}</p><p class="body-copy">${escapeHtml(project.description)}</p>${media}<div class="project-links">${project.links.map((link) => externalLink(link)).join("")}</div>${stack}<button class="next-project" type="button" data-route="project/${next.id}"><span>Next · ${escapeHtml(next.title)}</span>${icon("arrow-right")}</button></article>`, project.title, `Tell me about ${project.title}.`);
    renderDetails(project);
}

function renderAbout() {
    document.querySelector('.nav-action[href="#about"]')?.setAttribute("aria-current", "page");
    showContent(`<section class="welcome"><img class="profile-photo" src="./pictures/optimized/face.webp" width="495" height="519" alt="Finn"><h2>A little about me.</h2>${biography.map((paragraph) => `<p class="body-copy">${escapeHtml(paragraph)}</p>`).join("")}<div class="starter-prompts"><button class="prompt-chip" type="button" data-query="All projects">Explore my work</button><button class="prompt-chip" type="button" data-route="links">Find me elsewhere</button></div></section>`, "About Finn", "Who's behind the work?");
    renderDetails();
}

function renderLinks() {
    showContent(`<section class="welcome"><h2>More behind the work.</h2><p class="body-copy">Find my code and projects on GitHub, or browse the portfolio overview.</p><div class="project-links">${externalLink({label:"GitHub · how2fps",href:"https://github.com/how2fps"})}<a class="inline-link" href="./overview.html">Portfolio overview ${icon("arrow-up-right")}</a></div></section>`, "Links", "Where can I find you?");
    renderDetails();
}

function renderSearch(query) {
    const normalized = normalize(query);
    if (/^(about|about me|about you|who are you|education|biography)$/.test(normalized)) { renderAbout(); return; }
    if (/^(github|contact|links|email|resume|linkedin)$/.test(normalized)) { renderLinks(); return; }
    const all = !normalized || /^(all projects|projects|show me your work|work|show all projects)$/.test(normalized);
    const stopWords = new Set(["a","an","the","tell","me","about","show","your","you","my","i","what","is","are","of","please","project","projects"]);
    const tokens = normalized.split(" ").filter((token) => !stopWords.has(token));
    const ranked = projects.map((project) => {
        const name = normalize(project.title);
        const haystack = normalize([project.title, project.category, project.description, ...project.technologies, ...project.technologyGroups.map((group) => group.description)].join(" "));
        return {project, score: tokens.reduce((score, token) => score + (name.includes(token) ? 3 : haystack.includes(token) ? 1 : 0), 0), exact: name === normalized};
    }).filter((result) => all || result.score > 0).sort((a,b) => Number(b.exact) - Number(a.exact) || b.score - a.score);
    if (!all && ranked.length && (ranked.length === 1 || ranked[0].exact || ranked[0].score > ranked[1].score)) { renderProject(ranked[0].project); return; }
    showContent(`<section><h2 class="results-heading">${all ? "The work, at a glance." : ranked.length ? "Here's what I found." : "No matching projects yet."}</h2><p class="body-copy">${all ? "Eight different projects. A shared interest in making things useful." : ranked.length ? "Pick a project to take a closer look." : "Try a project name, “spa POS”, or a technology like React."}</p><div class="result-list">${ranked.map(({project}) => `<button class="result" type="button" data-route="project/${project.id}"><h3>${escapeHtml(project.title)} <span aria-hidden="true">↗</span></h3><p>${escapeHtml(project.description)}</p></button>`).join("")}</div></section>`, all ? "All projects" : "Search portfolio", query || "Show me your work.");
    renderDetails();
}

function renderRoute() {
    let route;
    try { route = decodeURIComponent(location.hash.slice(1)); } catch { route = ""; }
    document.querySelectorAll(".project-nav,.nav-action").forEach((element) => element.removeAttribute("aria-current"));
    if (route.startsWith("project/")) {
        const project = projects.find((item) => item.id === route.slice(8));
        if (project) {
            renderProject(project);
            document.querySelector(`[data-project-id="${project.id}"]`)?.setAttribute("aria-current", "page");
            return;
        }
    }
    if (route === "about") renderAbout();
    else if (route === "links") renderLinks();
    else if (route.startsWith("search/")) renderSearch(route.slice(7));
    else renderHome();
    if (route === "about" || (!route.startsWith("search/") && route !== "links")) {
        document.querySelector(`.nav-action[href="#${route === "about" ? "about" : "home"}"]`)?.setAttribute("aria-current", "page");
    }
}

document.addEventListener("click", (event) => {
    const screenshotButton = event.target.closest("[data-screenshot]");
    if (screenshotButton) selectScreenshot(screenshotButton.closest(".screenshot-gallery"), Number(screenshotButton.dataset.screenshot));
    const galleryStep = event.target.closest("[data-gallery-step]");
    if (galleryStep) {
        const gallery = galleryStep.closest(".screenshot-gallery");
        const selected = Number(gallery.querySelector('[aria-pressed="true"]').dataset.screenshot);
        selectScreenshot(gallery, selected + Number(galleryStep.dataset.galleryStep));
    }
    const routeButton = event.target.closest("[data-route]");
    if (routeButton) go(routeButton.dataset.route);
    const queryButton = event.target.closest("[data-query]");
    if (queryButton) go(`search/${encodeURIComponent(queryButton.dataset.query)}`);
    if (event.target.closest("[data-close-details]")) setDetails(false);
});

$("#explore-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const query = $("#explore-input").value.trim().slice(0, 240);
    go(`search/${encodeURIComponent(query || "All projects")}`);
    $("#explore-input").value = "";
});

function focusSearch() {
    if (mobile.matches) setSidebar(false);
    $("#explore-input").focus();
    $("#explore-input").select();
}
$("#search-button").addEventListener("click", focusSearch);
$("#rail-search").addEventListener("click", focusSearch);
$("#sidebar-toggle").addEventListener("click", () => setSidebar(mobile.matches ? !document.body.classList.contains("mobile-sidebar-open") : document.body.classList.contains("sidebar-closed")));
$("#sidebar-backdrop").addEventListener("click", () => setSidebar(false));
$("#details-toggle").addEventListener("click", () => setDetails(!document.body.classList.contains("details-open")));
document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); focusSearch(); }
    if (event.key === "Escape") {
        if (document.body.classList.contains("mobile-sidebar-open")) { setSidebar(false); lastNavigationFocus?.focus(); }
        if (window.innerWidth < 1280) setDetails(false);
    }
});
window.addEventListener("hashchange", () => { if (projects.length) renderRoute(); });
mobile.addEventListener("change", () => {
    document.body.classList.remove("mobile-sidebar-open");
    $("#sidebar-toggle").setAttribute("aria-expanded", String(!mobile.matches && !document.body.classList.contains("sidebar-closed")));
});
setDetails(window.innerWidth >= 1280);
window.matchMedia("(min-width: 1280px)").addEventListener("change", (event) => setDetails(event.matches));
$("#sidebar-toggle").setAttribute("aria-expanded", String(!mobile.matches));

async function initialize() {
    try {
        const overviewUrl = new URL("./overview.html", location.href);
        const response = await fetch(overviewUrl);
        if (!response.ok) throw new Error("Portfolio overview unavailable");
        const overview = new DOMParser().parseFromString(await response.text(), "text/html");
        projects = Array.from(overview.querySelectorAll(".project-card"), (card) => {
            const primaryLink = card.querySelector(".project-image-link");
            const image = card.querySelector("img");
            const title = text(card.querySelector("h3"));
            const links = Array.from(card.querySelectorAll(".project-links a"), (link) => ({label:text(link).replace(/↗/g, "").trim(),href:new URL(link.getAttribute("href"),overviewUrl).href}));
            if (!links.length && primaryLink) links.push({label:image ? "Open image" : "View project",href:new URL(primaryLink.getAttribute("href"),overviewUrl).href});
            return {
                id:slug(title), title,
                category:text(card.querySelector(".project-category")),
                description:text(card.querySelector(".project-summary")) || primaryLink?.dataset.description || text(card.querySelector(".project-category")),
                technologies:Array.from(card.querySelectorAll(".tech-list li"),text),
                technologyGroups:Array.from(card.querySelectorAll(".project-stack-group"), (group) => ({
                    title:text(group.querySelector("h4")),
                    description:text(group.querySelector("p")),
                    technologies:Array.from(group.querySelectorAll(".tech-list li"),text),
                })),
                previewNote:text(card.querySelector(".project-preview-note")),
                screenshots:Array.from(card.querySelectorAll(".project-gallery figure"), (figure) => {
                    const shot = figure.querySelector("img");
                    const src = new URL(shot.getAttribute("src"),overviewUrl).href;
                    return {src,thumbnail:src.replace(/\.webp$/, "-480.webp"),alt:shot.alt,width:Number(shot.getAttribute("width")),height:Number(shot.getAttribute("height")),title:text(figure.querySelector("figcaption strong")),caption:text(figure.querySelector("figcaption span"))};
                }),
                links,
                image:image ? {src:new URL(image.getAttribute("src"),overviewUrl).href,alt:image.alt,width:Number(image.getAttribute("width")),height:Number(image.getAttribute("height"))} : null,
            };
        });
        if (!projects.length) throw new Error("No projects found");
        biography = Array.from(overview.querySelectorAll(".about-copy > p:not(.eyebrow)"), text);
        renderNavigation();
        renderRoute();
    } catch (error) {
        $("#project-navigation").innerHTML = '<a class="nav-action" href="./overview.html">Open portfolio overview ↗</a>';
        $("#content").innerHTML = '<section class="welcome"><h2>Hey, I’m Finn.</h2><p class="body-copy">My project collection is available in the portfolio overview.</p><div class="project-links"><a class="inline-link" href="./overview.html">View projects ↗</a></div></section>';
        $("#view-status").textContent = "Portfolio overview available";
        console.error(error);
    }
}
initialize();
