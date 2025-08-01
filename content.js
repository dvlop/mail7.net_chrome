// Content script for Email Checker
// This file runs in the context of the web page

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'scanEmails') {
        const emails = scanPageForEmails();
        sendResponse({ emails });
    }
});

// Функция сканирования страницы для email-адресов
function scanPageForEmails() {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = new Set();

    // 1. Сканируем весь текст страницы (основной метод)
    const textContent = document.body.innerText;
    const textMatches = textContent.match(emailRegex) || [];
    textMatches.forEach(email => emails.add(email.toLowerCase()));

    // 2. Сканируем textContent всех элементов отдельно
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
        const text = element.textContent || element.innerText;
        if (text && text.includes('@')) {
            const matches = text.match(emailRegex) || [];
            matches.forEach(email => emails.add(email.toLowerCase()));
        }
    });

    // 3. Ищем в атрибутах href="mailto:"
    const mailtoLinks = document.querySelectorAll('a[href^="mailto:"]');
    mailtoLinks.forEach(link => {
        const href = link.getAttribute('href');
        const emailMatch = href.match(/mailto:([^?]+)/);
        if (emailMatch) {
            emails.add(emailMatch[1].toLowerCase());
        }
    });

    // 4. Ищем в атрибутах data-email
    const dataEmailElements = document.querySelectorAll('[data-email]');
    dataEmailElements.forEach(element => {
        const email = element.getAttribute('data-email');
        if (email && emailRegex.test(email)) {
            emails.add(email.toLowerCase());
        }
    });

    // 5. Ищем в input полях с type="email"
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        const email = input.value;
        if (email && emailRegex.test(email)) {
            emails.add(email.toLowerCase());
        }
    });

    // 6. Ищем в placeholder атрибутах
    const elementsWithPlaceholder = document.querySelectorAll('[placeholder*="@"]');
    elementsWithPlaceholder.forEach(element => {
        const placeholder = element.getAttribute('placeholder');
        const matches = placeholder.match(emailRegex) || [];
        matches.forEach(email => emails.add(email.toLowerCase()));
    });

    // 7. Ищем в title атрибутах
    const elementsWithTitle = document.querySelectorAll('[title*="@"]');
    elementsWithTitle.forEach(element => {
        const title = element.getAttribute('title');
        const matches = title.match(emailRegex) || [];
        matches.forEach(email => emails.add(email.toLowerCase()));
    });

    // 8. Ищем в alt атрибутах изображений
    const imagesWithAlt = document.querySelectorAll('img[alt*="@"]');
    imagesWithAlt.forEach(img => {
        const alt = img.getAttribute('alt');
        const matches = alt.match(emailRegex) || [];
        matches.forEach(email => emails.add(email.toLowerCase()));
    });

    // 9. Ищем в aria-label атрибутах
    const elementsWithAriaLabel = document.querySelectorAll('[aria-label*="@"]');
    elementsWithAriaLabel.forEach(element => {
        const ariaLabel = element.getAttribute('aria-label');
        const matches = ariaLabel.match(emailRegex) || [];
        matches.forEach(email => emails.add(email.toLowerCase()));
    });

    // 10. Ищем во всех data-* атрибутах
    allElements.forEach(element => {
        for (let attr of element.attributes) {
            if (attr.name.startsWith('data-') && attr.value.includes('@')) {
                const matches = attr.value.match(emailRegex) || [];
                matches.forEach(email => emails.add(email.toLowerCase()));
            }
        }
    });

    // 11. Ищем в скрытых элементах (display: none, visibility: hidden, opacity: 0)
    allElements.forEach(element => {
        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
            const text = element.textContent || element.innerText;
            const matches = text.match(emailRegex) || [];
            matches.forEach(email => emails.add(email.toLowerCase()));
        }
    });

    // 12. Ищем в комментариях HTML
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_COMMENT,
        null,
        false
    );
    
    let comment;
    while (comment = walker.nextNode()) {
        const matches = comment.textContent.match(emailRegex) || [];
        matches.forEach(email => emails.add(email.toLowerCase()));
    }

    // 13. Ищем в элементах с позиционированием вне экрана
    allElements.forEach(element => {
        const style = window.getComputedStyle(element);
        if (style.position === 'absolute' && (parseInt(style.left) < -1000 || parseInt(style.top) < -1000)) {
            const text = element.textContent || element.innerText;
            const matches = text.match(emailRegex) || [];
            matches.forEach(email => emails.add(email.toLowerCase()));
        }
    });

    // 14. Ищем в элементах с очень маленьким размером шрифта
    allElements.forEach(element => {
        const style = window.getComputedStyle(element);
        const fontSize = parseInt(style.fontSize);
        if (fontSize < 1) {
            const text = element.textContent || element.innerText;
            const matches = text.match(emailRegex) || [];
            matches.forEach(email => emails.add(email.toLowerCase()));
        }
    });

    // 15. Ищем в элементах с прозрачностью
    allElements.forEach(element => {
        const style = window.getComputedStyle(element);
        if (style.color === 'transparent' || style.color === 'rgba(0, 0, 0, 0)') {
            const text = element.textContent || element.innerText;
            const matches = text.match(emailRegex) || [];
            matches.forEach(email => emails.add(email.toLowerCase()));
        }
    });

    // 16. Ищем в элементах с z-index: -1
    allElements.forEach(element => {
        const style = window.getComputedStyle(element);
        if (style.zIndex === '-1') {
            const text = element.textContent || element.innerText;
            const matches = text.match(emailRegex) || [];
            matches.forEach(email => emails.add(email.toLowerCase()));
        }
    });

    // 17. Ищем в элементах с overflow: hidden и маленькими размерами
    allElements.forEach(element => {
        const style = window.getComputedStyle(element);
        if (style.overflow === 'hidden' && (parseInt(style.width) < 10 || parseInt(style.height) < 10)) {
            const text = element.textContent || element.innerText;
            const matches = text.match(emailRegex) || [];
            matches.forEach(email => emails.add(email.toLowerCase()));
        }
    });

    // 18. Ищем в элементах с clip-path
    allElements.forEach(element => {
        const style = window.getComputedStyle(element);
        if (style.clipPath && style.clipPath !== 'none') {
            const text = element.textContent || element.innerText;
            const matches = text.match(emailRegex) || [];
            matches.forEach(email => emails.add(email.toLowerCase()));
        }
    });

    // 19. Ищем в элементах с transform: scale(0)
    allElements.forEach(element => {
        const style = window.getComputedStyle(element);
        if (style.transform && style.transform.includes('scale(0)')) {
            const text = element.textContent || element.innerText;
            const matches = text.match(emailRegex) || [];
            matches.forEach(email => emails.add(email.toLowerCase()));
        }
    });

    // 20. Ищем в элементах с filter: blur
    allElements.forEach(element => {
        const style = window.getComputedStyle(element);
        if (style.filter && style.filter.includes('blur')) {
            const text = element.textContent || element.innerText;
            const matches = text.match(emailRegex) || [];
            matches.forEach(email => emails.add(email.toLowerCase()));
        }
    });

    // 21. Ищем в Shadow DOM
    allElements.forEach(element => {
        if (element.shadowRoot) {
            const shadowText = element.shadowRoot.innerText;
            const shadowMatches = shadowText.match(emailRegex) || [];
            shadowMatches.forEach(email => emails.add(email.toLowerCase()));
        }
    });

    // 22. Ищем в JSON-LD скриптах
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    jsonLdScripts.forEach(script => {
        try {
            const jsonData = JSON.parse(script.textContent);
            const jsonString = JSON.stringify(jsonData);
            const matches = jsonString.match(emailRegex) || [];
            matches.forEach(email => emails.add(email.toLowerCase()));
        } catch (e) {
            // Игнорируем ошибки парсинга JSON
        }
    });

    // 23. Ищем в мета-тегах
    const metaTags = document.querySelectorAll('meta');
    metaTags.forEach(meta => {
        const content = meta.getAttribute('content');
        if (content && content.includes('@')) {
            const matches = content.match(emailRegex) || [];
            matches.forEach(email => emails.add(email.toLowerCase()));
        }
    });

    // 24. Ищем в скриптах (только безопасные)
    const allScripts = document.querySelectorAll('script');
    allScripts.forEach(script => {
        const scriptContent = script.textContent;
        if (scriptContent && scriptContent.includes('@') && scriptContent.length < 10000) {
            const matches = scriptContent.match(emailRegex) || [];
            matches.forEach(email => emails.add(email.toLowerCase()));
        }
    });

    // 25. Ищем в элементах с data-* атрибутами содержащими email
    allElements.forEach(element => {
        for (let attr of element.attributes) {
            if (attr.name.startsWith('data-') && 
                (attr.name.includes('email') || attr.name.includes('contact') || attr.name.includes('mail'))) {
                const matches = attr.value.match(emailRegex) || [];
                matches.forEach(email => emails.add(email.toLowerCase()));
            }
        }
    });

    // 26. Ищем в элементах с aria-* атрибутами содержащими email
    allElements.forEach(element => {
        for (let attr of element.attributes) {
            if (attr.name.startsWith('aria-') && attr.value.includes('@')) {
                const matches = attr.value.match(emailRegex) || [];
                matches.forEach(email => emails.add(email.toLowerCase()));
            }
        }
    });

    // 27. Ищем в элементах с role="button" и содержащих @
    const roleElements = document.querySelectorAll('[role]');
    roleElements.forEach(element => {
        const text = element.textContent || element.innerText;
        if (text && text.includes('@')) {
            const matches = text.match(emailRegex) || [];
            matches.forEach(email => emails.add(email.toLowerCase()));
        }
    });

    // 28. Ищем в элементах с contenteditable
    const editableElements = document.querySelectorAll('[contenteditable]');
    editableElements.forEach(element => {
        const text = element.textContent || element.innerText;
        if (text && text.includes('@')) {
            const matches = text.match(emailRegex) || [];
            matches.forEach(email => emails.add(email.toLowerCase()));
        }
    });

    // 29. Ищем в элементах с tabindex (интерактивные элементы)
    const interactiveElements = document.querySelectorAll('[tabindex]');
    interactiveElements.forEach(element => {
        const text = element.textContent || element.innerText;
        if (text && text.includes('@')) {
            const matches = text.match(emailRegex) || [];
            matches.forEach(email => emails.add(email.toLowerCase()));
        }
    });

    // 30. Ищем в элементах с on* атрибутами (обработчики событий)
    allElements.forEach(element => {
        for (let attr of element.attributes) {
            if (attr.name.startsWith('on') && attr.value.includes('@')) {
                const matches = attr.value.match(emailRegex) || [];
                matches.forEach(email => emails.add(email.toLowerCase()));
            }
        }
    });

    // 31. Ищем в элементах с style атрибутом содержащим @
    allElements.forEach(element => {
        const styleAttr = element.getAttribute('style');
        if (styleAttr && styleAttr.includes('@')) {
            const matches = styleAttr.match(emailRegex) || [];
            matches.forEach(email => emails.add(email.toLowerCase()));
        }
    });

    // 32. Ищем в элементах с class содержащим email
    allElements.forEach(element => {
        const className = element.className;
        if (typeof className === 'string' && 
            (className.includes('email') || className.includes('contact') || className.includes('mail'))) {
            const text = element.textContent || element.innerText;
            if (text && text.includes('@')) {
                const matches = text.match(emailRegex) || [];
                matches.forEach(email => emails.add(email.toLowerCase()));
            }
        }
    });

    // 33. Ищем в элементах с id содержащим email
    allElements.forEach(element => {
        const id = element.id;
        if (id && (id.includes('email') || id.includes('contact') || id.includes('mail'))) {
            const text = element.textContent || element.innerText;
            if (text && text.includes('@')) {
                const matches = text.match(emailRegex) || [];
                matches.forEach(email => emails.add(email.toLowerCase()));
            }
        }
    });

    // 34. Ищем в элементах с name атрибутом содержащим email
    allElements.forEach(element => {
        const nameAttr = element.getAttribute('name');
        if (nameAttr && (nameAttr.includes('email') || nameAttr.includes('contact') || nameAttr.includes('mail'))) {
            const text = element.textContent || element.innerText;
            if (text && text.includes('@')) {
                const matches = text.match(emailRegex) || [];
                matches.forEach(email => emails.add(email.toLowerCase()));
            }
        }
    });

    // 35. Ищем в элементах с placeholder содержащим email
    allElements.forEach(element => {
        const placeholder = element.getAttribute('placeholder');
        if (placeholder && (placeholder.includes('email') || placeholder.includes('contact') || placeholder.includes('mail'))) {
            const text = element.textContent || element.innerText;
            if (text && text.includes('@')) {
                const matches = text.match(emailRegex) || [];
                matches.forEach(email => emails.add(email.toLowerCase()));
            }
        }
    });

    const result = Array.from(emails);
    
    return result;
}

// Экспортируем функцию для использования в popup
window.scanPageForEmails = scanPageForEmails; 