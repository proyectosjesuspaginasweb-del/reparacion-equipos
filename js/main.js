const slides = Array.from(document.querySelectorAll("[data-slide]"));
const dots = Array.from(document.querySelectorAll("[data-slide-dot]"));
const previousButton = document.querySelector("[data-slider-prev]");
const nextButton = document.querySelector("[data-slider-next]");
const contactForm = document.querySelector(".contact-form");
const chatToggle = document.querySelector("[data-chat-toggle]");
const chatWidget = document.querySelector(".chat-widget");
const botQuestion = document.querySelector("[data-bot-question]");
const botAnswers = document.querySelector("[data-bot-answers]");
const botInput = document.querySelector("[data-bot-input]");
const botNext = document.querySelector("[data-bot-next]");
const botBack = document.querySelector("[data-bot-back]");
const botReset = document.querySelector("[data-bot-reset]");
const botOptions = document.querySelector("[data-bot-options]");
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
    const nameInput = contactForm.querySelector('input[name="name"]');
    const messageInput = contactForm.querySelector('textarea[name="message"]');

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const data = new FormData(contactForm);
        const name = data.get("name") || "Hola";
        const message = data.get("message") || "Necesito una revision tecnica.";
        const text = `Hola, soy ${name}. ${message}`;

        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    });

    function createWhatsappLink(text) {
        return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    }

    function initSupportBot() {
        if (!botQuestion || !botAnswers || !botInput || !botNext || !botBack || !botReset || !botOptions) {
            return;
        }

        const steps = [
            {
                key: "name",
                label: "Nombre",
                question: "Primero dime tu nombre.",
                placeholder: "Ejemplo: Jesus"
            },
            {
                key: "device",
                label: "Equipo",
                question: "Que equipo necesita revision?",
                placeholder: "Ejemplo: laptop HP, PC gamer, celular Samsung",
                options: ["Laptop", "PC", "Celular"]
            },
            {
                key: "problem",
                label: "Falla",
                question: "Que falla presenta?",
                placeholder: "Ejemplo: se apaga, esta lenta, no carga"
            },
            {
                key: "urgency",
                label: "Urgencia",
                question: "Que tan urgente es?",
                placeholder: "Ejemplo: hoy, esta semana, sin prisa",
                options: ["Hoy", "Esta semana", "Sin prisa"]
            },
            {
                key: "schedule",
                label: "Horario",
                question: "En que zona u horario te puedo contactar?",
                placeholder: "Ejemplo: Toluca, despues de las 6 pm"
            }
        ];

        const answers = {};
        let currentStep = 0;

        function buildSummary() {
            return [
                `Hola, soy ${answers.name || "cliente"}.`,
                `Necesito soporte tecnico.`,
                `Equipo: ${answers.device || "No especificado"}.`,
                `Falla: ${answers.problem || "No especificada"}.`,
                `Urgencia: ${answers.urgency || "No especificada"}.`,
                `Zona u horario: ${answers.schedule || "No especificado"}.`
            ].join("\n");
        }

        function updateForm() {
            if (nameInput) {
                nameInput.value = answers.name || "";
            }

            if (messageInput) {
                messageInput.value = buildSummary();
            }
        }

        function renderHistory() {
            botAnswers.replaceChildren();

            steps
                .filter((step) => answers[step.key])
                .forEach((step) => {
                    const item = document.createElement("p");
                    const label = document.createElement("strong");
                    label.textContent = `${step.label}:`;
                    item.append(label, ` ${answers[step.key]}`);
                    botAnswers.appendChild(item);
                });
        }

        function renderOptions(step) {
            botOptions.innerHTML = "";

            if (!step.options) {
                return;
            }

            step.options.forEach((option) => {
                const button = document.createElement("button");
                button.type = "button";
                button.textContent = option;
                button.addEventListener("click", () => {
                    botInput.value = option;
                    saveAnswer();
                });
                botOptions.appendChild(button);
            });
        }

        function renderStep() {
            const isDone = currentStep >= steps.length;

            if (isDone) {
                botQuestion.textContent = "Listo. Revise el resumen y mandalo por WhatsApp.";
                botInput.hidden = true;
                botNext.textContent = "Enviar por WhatsApp";
                botOptions.innerHTML = "";
                updateForm();
            } else {
                const step = steps[currentStep];
                botQuestion.textContent = step.question;
                botInput.hidden = false;
                botInput.value = answers[step.key] || "";
                botInput.placeholder = step.placeholder;
                botNext.textContent = "Responder";
                renderOptions(step);
            }

            botBack.disabled = currentStep === 0;
            renderHistory();
            window.techRepairFitPanels?.();
        }

        function saveAnswer() {
            if (currentStep >= steps.length) {
                const text = buildSummary();
                window.open(createWhatsappLink(text), "_blank", "noopener");
                return;
            }

            const step = steps[currentStep];
            const value = botInput.value.trim();

            if (!value) {
                botInput.focus();
                return;
            }

            answers[step.key] = value;
            currentStep += 1;
            updateForm();
            renderStep();
        }

        botNext.addEventListener("click", saveAnswer);
        botInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                saveAnswer();
            }
        });

        botBack.addEventListener("click", () => {
            currentStep = Math.max(0, currentStep - 1);
            renderStep();
        });

        botReset.addEventListener("click", () => {
            Object.keys(answers).forEach((key) => delete answers[key]);
            currentStep = 0;
            updateForm();
            renderStep();
        });

        renderStep();
    }

    initSupportBot();
}

if (chatToggle && chatWidget) {
    function setChatOpen(isOpen) {
        chatWidget.classList.toggle("is-open", isOpen);
        chatWidget.setAttribute("aria-hidden", String(!isOpen));
        chatToggle.setAttribute("aria-expanded", String(isOpen));

        if (isOpen) {
            window.setTimeout(() => botInput?.focus(), 120);
        }
    }

    chatToggle.addEventListener("click", () => {
        setChatOpen(!chatWidget.classList.contains("is-open"));
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && chatWidget.classList.contains("is-open")) {
            setChatOpen(false);
            chatToggle.focus();
        }
    });
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
    let fitTimer;

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

    function fitPanelContent() {
        innerWrappers.forEach((inner) => {
            inner.style.zoom = "";
            inner.style.width = "";
            inner.style.height = "";

            const availableWidth = window.innerWidth;
            const availableHeight = window.innerHeight;
            const requiredWidth = inner.scrollWidth;
            const requiredHeight = inner.scrollHeight;
            const widthScale = availableWidth / Math.max(requiredWidth, 1);
            const heightScale = availableHeight / Math.max(requiredHeight, 1);
            const scale = Math.min(1, widthScale, heightScale);

            if (scale < 1) {
                const correctedScale = Math.max(.68, scale - .02);
                inner.style.zoom = correctedScale;
            }
        });
    }

    function schedulePanelFit() {
        window.clearTimeout(fitTimer);
        fitTimer = window.setTimeout(fitPanelContent, 120);
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
    window.techRepairFitPanels = fitPanelContent;
    currentIndex = initialIndex;
    setProgress(initialIndex);
    fitPanelContent();
    window.addEventListener("resize", schedulePanelFit);
    window.addEventListener("orientationchange", schedulePanelFit);
}

window.addEventListener("load", initPanelAnimation);
