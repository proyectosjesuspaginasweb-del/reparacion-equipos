const slides = Array.from(document.querySelectorAll("[data-slide]"));
const dots = Array.from(document.querySelectorAll("[data-slide-dot]"));
const previousButton = document.querySelector("[data-slider-prev]");
const nextButton = document.querySelector("[data-slider-next]");
const contactForm = document.querySelector(".contact-form");
const assistantButtons = Array.from(document.querySelectorAll("[data-assistant-message]"));
const whatsappFloat = document.querySelector("[data-whatsapp-float]");
const whatsappNumber = "527227729418";

let activeIndex = 0;
let autoplayId;

function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("is-active", slideIndex === activeIndex);
    });

    dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === activeIndex);
    });
}

function startAutoplay() {
    window.clearInterval(autoplayId);
    autoplayId = window.setInterval(() => showSlide(activeIndex + 1), 5500);
}

if (previousButton && nextButton) {
    previousButton.addEventListener("click", () => {
        showSlide(activeIndex - 1);
        startAutoplay();
    });

    nextButton.addEventListener("click", () => {
        showSlide(activeIndex + 1);
        startAutoplay();
    });
}

dots.forEach((dot) => {
    dot.addEventListener("click", () => {
        showSlide(Number(dot.dataset.slideDot));
        startAutoplay();
    });
});

if (contactForm) {
    const messageInput = contactForm.querySelector('textarea[name="message"]');

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const data = new FormData(contactForm);
        const name = data.get("name") || "Hola";
        const message = data.get("message") || "Necesito una revision tecnica.";
        const text = `Hola, soy ${name}. ${message}`;

        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    });

    assistantButtons.forEach((button) => {
        button.addEventListener("click", () => {
            messageInput.value = button.dataset.assistantMessage;
            messageInput.focus();
        });
    });
}

if (whatsappFloat) {
    const defaultText = "Hola, necesito una revision tecnica para mi equipo.";
    whatsappFloat.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultText)}`;
}

startAutoplay();

function splitHeading(heading) {
    const words = heading.textContent.trim().split(/\s+/);
    heading.textContent = "";

    return words.flatMap((word, wordIndex) => {
        const line = document.createElement("span");
        line.className = "clip-text";
        line.setAttribute("aria-hidden", "true");

        const chars = Array.from(word).map((char) => {
            const charElement = document.createElement("span");
            charElement.className = "heading-char";
            charElement.textContent = char;
            line.appendChild(charElement);
            return charElement;
        });

        heading.appendChild(line);

        if (wordIndex < words.length - 1) {
            heading.appendChild(document.createTextNode(" "));
        }

        heading.setAttribute("aria-label", words.join(" "));
        return chars;
    });
}

function initPanelAnimation() {
    const shouldUseNativeScroll = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouchViewport = window.matchMedia("(max-width: 980px)").matches;

    if (shouldUseNativeScroll) {
        document.body.classList.add("no-gsap-panels");
        document.body.classList.remove("gsap-panels");
        return;
    }

    if (!window.gsap || !window.Observer) {
        document.body.classList.add("no-gsap-panels");
        return;
    }

    gsap.registerPlugin(Observer);

    const sections = gsap.utils.toArray(".panel-section");
    const backgrounds = gsap.utils.toArray(".panel-section > .bg");
    const headings = gsap.utils.toArray(".section-heading");
    const outerWrappers = gsap.utils.toArray(".outer");
    const innerWrappers = gsap.utils.toArray(".inner");
    const progressItems = gsap.utils.toArray(".panel-progress span");
    const splitHeadings = headings.map(splitHeading);
    const wrap = gsap.utils.wrap(0, sections.length);

    let currentIndex = -1;
    let animating = false;

    document.body.classList.add("gsap-panels");
    const initialHashIndex = sections.findIndex((section) => section.id && `#${section.id}` === window.location.hash);
    const initialIndex = initialHashIndex > 0 ? initialHashIndex : 0;

    gsap.set(outerWrappers, { yPercent: 100 });
    gsap.set(innerWrappers, { yPercent: -100 });
    gsap.set(sections, { autoAlpha: 0, zIndex: 0 });
    gsap.set(outerWrappers[initialIndex], { yPercent: 0 });
    gsap.set(innerWrappers[initialIndex], { yPercent: 0 });
    gsap.set(sections[initialIndex], { autoAlpha: 1, zIndex: 1 });
    gsap.set(backgrounds[initialIndex], { yPercent: 0 });
    gsap.set(splitHeadings[initialIndex], { autoAlpha: 1, yPercent: 0, rotation: 0 });

    function setProgress(index) {
        progressItems.forEach((item, itemIndex) => {
            item.classList.toggle("is-active", itemIndex === index);
        });
    }

    function gotoSection(index, direction) {
        index = wrap(index);
        animating = true;

        const fromTop = direction === -1;
        const dFactor = fromTop ? -1 : 1;
        const timeline = gsap.timeline({
            defaults: { duration: 1.05, ease: "power1.inOut" },
            onComplete: () => {
                animating = false;
            }
        });

        if (currentIndex >= 0) {
            gsap.set(sections[currentIndex], { zIndex: 0 });
            timeline
                .to(backgrounds[currentIndex], { yPercent: -12 * dFactor }, 0)
                .set(sections[currentIndex], { autoAlpha: 0 });
        }

        gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });

        timeline
            .fromTo([outerWrappers[index], innerWrappers[index]], {
                yPercent: (itemIndex) => itemIndex ? -100 * dFactor : 100 * dFactor
            }, {
                yPercent: 0
            }, 0)
            .fromTo(backgrounds[index], {
                yPercent: 12 * dFactor
            }, {
                yPercent: 0
            }, 0)
            .fromTo(splitHeadings[index], {
                autoAlpha: 0,
                yPercent: () => gsap.utils.random(-200, 200) * dFactor,
                rotation: () => gsap.utils.random(-20, 20)
            }, {
                autoAlpha: 1,
                yPercent: 0,
                rotation: 0,
                duration: .85,
                ease: "back.out(1.2)",
                stagger: {
                    each: .02,
                    from: "random"
                }
            }, .18);

        currentIndex = index;
        setProgress(index);
    }

    function canNavigateWithWheel(observer) {
        const event = observer.event;
        return !animating && !event.ctrlKey && !event.metaKey;
    }

    Observer.create({
        type: isTouchViewport ? "wheel,touch" : "wheel",
        wheelSpeed: -1,
        onDown: (observer) => canNavigateWithWheel(observer) && gotoSection(currentIndex - 1, -1),
        onUp: (observer) => canNavigateWithWheel(observer) && gotoSection(currentIndex + 1, 1),
        tolerance: isTouchViewport ? 28 : 10,
        preventDefault: isTouchViewport,
        ignore: "input, textarea, button, a, .slider-shell"
    });

    document.querySelectorAll("[data-panel-target]").forEach((control) => {
        control.addEventListener("click", (event) => {
            event.preventDefault();
            const targetIndex = Number(control.dataset.panelTarget);
            if (!animating && targetIndex !== currentIndex) {
                gotoSection(targetIndex, targetIndex > currentIndex ? 1 : -1);
            }
        });
    });

    window.techRepairGoToSection = gotoSection;
    currentIndex = initialIndex;
    setProgress(initialIndex);
}

window.addEventListener("load", initPanelAnimation);
