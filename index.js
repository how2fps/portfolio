const preview = document.querySelector(".project-preview");
const previewTitle = document.querySelector("#preview-title");
const previewDescription = document.querySelector("#preview-description");
const previewImage = document.querySelector(".preview-image-container");
let previewTrigger;

// Image links work normally when JavaScript or <dialog> is unavailable.
if (preview && typeof preview.showModal === "function") {
    document.querySelectorAll("[data-preview]").forEach((link) => {
        link.addEventListener("click", (event) => {
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            previewTrigger = link;
            previewTitle.textContent = link.dataset.title;
            previewDescription.textContent = link.dataset.description;
            const image = new Image();
            image.src = link.href;
            image.alt = link.querySelector("img")?.alt || link.dataset.title;
            image.decoding = "async";
            previewImage.replaceChildren(image);
            preview.showModal();
            document.body.classList.add("preview-open");
        });
    });
    preview.querySelector(".preview-close").addEventListener("click", () => preview.close());
    preview.addEventListener("click", (event) => {
        const bounds = preview.getBoundingClientRect();
        if (event.target === preview && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) preview.close();
    });
    preview.addEventListener("close", () => {
        document.body.classList.remove("preview-open");
        previewImage.replaceChildren();
        previewTrigger?.focus({ preventScroll: true });
    });
}
