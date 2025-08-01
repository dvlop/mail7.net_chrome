// Global function for content script execution
function scanPageForEmails() {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = new Set();

    // 1. Scan all page text (main method)
    const textContent = document.body.innerText;
    const textMatches = textContent.match(emailRegex) || [];
    textMatches.forEach(email => emails.add(email.toLowerCase()));

    // 2. Scan textContent of all elements separately
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
        const text = element.textContent || element.innerText;
        if (text && text.includes('@')) {
            const matches = text.match(emailRegex) || [];
            matches.forEach(email => emails.add(email.toLowerCase()));
        }
    });

    // 3. Look for href="mailto:" attributes
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

    // 21. Search in Shadow DOM
    allElements.forEach(element => {
        if (element.shadowRoot) {
            const shadowText = element.shadowRoot.innerText;
            const shadowMatches = shadowText.match(emailRegex) || [];
            shadowMatches.forEach(email => emails.add(email.toLowerCase()));
        }
    });

    // 22. Search in JSON-LD scripts
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    jsonLdScripts.forEach(script => {
        try {
            const jsonData = JSON.parse(script.textContent);
            const jsonString = JSON.stringify(jsonData);
            const matches = jsonString.match(emailRegex) || [];
            matches.forEach(email => emails.add(email.toLowerCase()));
        } catch (e) {
            // Ignore JSON parsing errors
        }
    });

    // 23. Search in meta tags
    const metaTags = document.querySelectorAll('meta');
    metaTags.forEach(meta => {
        const content = meta.getAttribute('content');
        if (content && content.includes('@')) {
            const matches = content.match(emailRegex) || [];
            matches.forEach(email => emails.add(email.toLowerCase()));
        }
    });

    // 24. Search in scripts (safe only)
    const allScripts = document.querySelectorAll('script');
    allScripts.forEach(script => {
        const scriptContent = script.textContent;
        if (scriptContent && scriptContent.includes('@') && scriptContent.length < 10000) {
            const matches = scriptContent.match(emailRegex) || [];
            matches.forEach(email => emails.add(email.toLowerCase()));
        }
    });

    // 25. Search in data-* attributes containing email
    allElements.forEach(element => {
        for (let attr of element.attributes) {
            if (attr.name.startsWith('data-') && 
                (attr.name.includes('email') || attr.name.includes('contact') || attr.name.includes('mail'))) {
                const matches = attr.value.match(emailRegex) || [];
                matches.forEach(email => emails.add(email.toLowerCase()));
            }
        }
    });

    // 26. Search in aria-* attributes containing email
    allElements.forEach(element => {
        for (let attr of element.attributes) {
            if (attr.name.startsWith('aria-') && attr.value.includes('@')) {
                const matches = attr.value.match(emailRegex) || [];
                matches.forEach(email => emails.add(email.toLowerCase()));
            }
        }
    });

    // 27. Search in elements with role="button" containing @
    const roleElements = document.querySelectorAll('[role]');
    roleElements.forEach(element => {
        const text = element.textContent || element.innerText;
        if (text && text.includes('@')) {
            const matches = text.match(emailRegex) || [];
            matches.forEach(email => emails.add(email.toLowerCase()));
        }
    });

    // 28. Search in contenteditable elements
    const editableElements = document.querySelectorAll('[contenteditable]');
    editableElements.forEach(element => {
        const text = element.textContent || element.innerText;
        if (text && text.includes('@')) {
            const matches = text.match(emailRegex) || [];
            matches.forEach(email => emails.add(email.toLowerCase()));
        }
    });

    // 29. Search in elements with tabindex (interactive elements)
    const interactiveElements = document.querySelectorAll('[tabindex]');
    interactiveElements.forEach(element => {
        const text = element.textContent || element.innerText;
        if (text && text.includes('@')) {
            const matches = text.match(emailRegex) || [];
            matches.forEach(email => emails.add(email.toLowerCase()));
        }
    });

    // 30. Search in elements with on* attributes (event handlers)
    allElements.forEach(element => {
        for (let attr of element.attributes) {
            if (attr.name.startsWith('on') && attr.value.includes('@')) {
                const matches = attr.value.match(emailRegex) || [];
                matches.forEach(email => emails.add(email.toLowerCase()));
            }
        }
    });

    // 31. Search in elements with style attribute containing @
    allElements.forEach(element => {
        const styleAttr = element.getAttribute('style');
        if (styleAttr && styleAttr.includes('@')) {
            const matches = styleAttr.match(emailRegex) || [];
            matches.forEach(email => emails.add(email.toLowerCase()));
        }
    });

    // 32. Search in elements with class containing email
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

    // 33. Search in elements with id containing email
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

    // 34. Search in elements with name attribute containing email
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

    // 35. Search in elements with placeholder containing email
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

class EmailChecker {
    constructor() {
        this.emails = [];
        this.isScanning = false;
        this.isValidating = false;
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadSavedLists();
        this.updateUI();
    }

    bindEvents() {
        document.getElementById('scanBtn').addEventListener('click', () => this.scanPage());
        document.getElementById('saveListBtn').addEventListener('click', () => this.saveList());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadResults());
        
        // Handle header link click
        const headerLink = document.querySelector('.header-link');
        if (headerLink) {
            headerLink.addEventListener('click', (e) => {
                e.preventDefault();
                chrome.tabs.create({ url: 'https://mail7.net' });
            });
        }
    }

    async scanPage() {
        if (this.isScanning) return;

        this.isScanning = true;
        this.updateUI();
        this.showStatus('Scanning page...', 'loading');

        try {
            // Get active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            // Try two approaches
            let emails = [];
            
            // Approach 1: Execute scanning through content script
            try {
                const result = await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    function: scanPageForEmails
                });

                emails = result[0].result || [];
            } catch (error) {
                console.error('Error in approach 1:', error);
            }
            
            // Approach 2: If first approach didn't work, use simple function
            if (emails.length === 0) {
                try {
                    const simpleResult = await chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        function: () => {
                            const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
                            const textContent = document.body.innerText;
                            const matches = textContent.match(emailRegex) || [];
                            return matches;
                        }
                    });
                    
                    emails = simpleResult[0].result || [];
                } catch (error) {
                    console.error('Error in approach 2:', error);
                }
            }
            
            this.emails = [...new Set(emails)]; // Remove duplicates

            this.showStatus(`Found ${this.emails.length} email addresses`, 'success');
            
            if (this.emails.length > 0) {
                this.showResults();
                await this.validateEmails();
            } else {
                this.showStatus('No email addresses found', 'error');
            }

        } catch (error) {
            console.error('Scanning error:', error);
            this.showStatus('Error scanning page', 'error');
        } finally {
            this.isScanning = false;
            this.updateUI();
        }
    }

    async validateEmails() {
        if (this.emails.length === 0) return;

        this.isValidating = true;
        this.updateUI();
        this.showProgressBar();

        const batchSize = 10; // Batch size for validation
        const totalBatches = Math.ceil(this.emails.length / batchSize);

        for (let i = 0; i < this.emails.length; i += batchSize) {
            const batch = this.emails.slice(i, i + batchSize);
            const batchIndex = Math.floor(i / batchSize);

            // Update progress
            const progress = ((batchIndex + 1) / totalBatches) * 100;
            this.updateProgress(progress);

            // Validate batch
            await this.validateBatch(batch, i);

            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        this.hideProgressBar();
        this.isValidating = false;
        this.updateUI();
        this.updateStats();
        this.showStatus('Validation completed', 'success');
    }

    async validateBatch(emails, startIndex) {
        try {
            // Use bulk validation API
            const formData = new FormData();
            formData.append('emails', emails.join('\n'));

            const response = await fetch('https://mail7.net/api/validate-bulk', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            // Update email address statuses
            if (result.results) {
                result.results.forEach((validation, index) => {
                    const emailIndex = startIndex + index;
                    if (this.emails[emailIndex]) {
                        this.emails[emailIndex] = {
                            address: this.emails[emailIndex],
                            status: validation.valid ? 'valid' : 'invalid',
                            details: validation
                        };
                    }
                });
            }

            this.updateEmailList();

        } catch (error) {
            console.error('Validation error:', error);
            this.showStatus('Error validating email addresses', 'error');
            
            // On API error, use single validation
            for (let i = 0; i < emails.length; i++) {
                const emailIndex = startIndex + i;
                await this.validateSingleEmail(emails[i], emailIndex);
                await new Promise(resolve => setTimeout(resolve, 50)); // Delay between requests
            }
        }
    }

    async validateSingleEmail(email, index) {
        try {
            const response = await fetch('https://mail7.net/api/validate-single', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            this.emails[index] = {
                address: email,
                status: result.valid ? 'valid' : 'invalid',
                details: result
            };

            this.updateEmailList();

        } catch (error) {
            console.error(`Validation error for ${email}:`, error);
            this.emails[index] = {
                address: email,
                status: 'error',
                details: { error: error.message }
            };
        }
    }

    showResults() {
        document.getElementById('resultsSection').style.display = 'block';
        this.updateEmailList();
        this.updateStats();
    }

    updateEmailList() {
        const emailList = document.getElementById('emailList');
        emailList.innerHTML = '';

        this.emails.forEach(email => {
            const emailItem = document.createElement('div');
            emailItem.className = 'email-item';

            const address = typeof email === 'string' ? email : email.address;
            const status = typeof email === 'string' ? 'pending' : email.status;

            emailItem.innerHTML = `
                <span class="email-address">${address}</span>
                <span class="email-status status-${status}">
                    ${this.getStatusText(status)}
                </span>
            `;

            emailList.appendChild(emailItem);
        });
    }

    getStatusText(status) {
        switch (status) {
            case 'valid': return '✅ Valid';
            case 'invalid': return '❌ Invalid';
            case 'error': return '⚠️ Error';
            case 'pending': return '⏳ Checking...';
            default: return '❓ Unknown';
        }
    }

    updateStats() {
        const total = this.emails.length;
        const valid = this.emails.filter(email => 
            typeof email === 'object' && email.status === 'valid'
        ).length;
        const invalid = this.emails.filter(email => 
            typeof email === 'object' && email.status === 'invalid'
        ).length;

        document.getElementById('totalEmails').textContent = total;
        document.getElementById('validEmails').textContent = valid;
        document.getElementById('invalidEmails').textContent = invalid;
    }

    async saveList() {
        if (this.emails.length === 0) return;

        const listName = prompt('Enter list name:');
        if (!listName) return;

        const listData = {
            id: Date.now().toString(),
            name: listName,
            emails: this.emails,
            createdAt: new Date().toISOString(),
            count: this.emails.length
        };

        // Save to Chrome Storage
        const { savedLists = [] } = await chrome.storage.local.get('savedLists');
        savedLists.push(listData);
        await chrome.storage.local.set({ savedLists });

        this.loadSavedLists();
        this.showStatus(`List "${listName}" saved`, 'success');
    }

    async loadSavedLists() {
        const { savedLists = [] } = await chrome.storage.local.get('savedLists');
        this.renderSavedLists(savedLists);
    }

    renderSavedLists(lists) {
        const container = document.getElementById('savedLists');
        container.innerHTML = '';

        if (lists.length === 0) {
            container.innerHTML = '<p style="color: #6c757d; font-size: 14px;">No saved lists</p>';
            return;
        }

        lists.forEach(list => {
            const listItem = document.createElement('div');
            listItem.className = 'saved-list-item';
            
            listItem.innerHTML = `
                <div class="saved-list-info">
                    <div class="saved-list-name">${list.name}</div>
                    <div class="saved-list-count">${list.count} addresses • ${new Date(list.createdAt).toLocaleDateString()}</div>
                </div>
                <div class="saved-list-actions">
                    <button class="download-saved" data-list-id="${list.id}">Download</button>
                    <button class="delete-saved" data-list-id="${list.id}">Delete</button>
                </div>
            `;

            // Add event listeners for buttons
            const downloadBtn = listItem.querySelector('.download-saved');
            const deleteBtn = listItem.querySelector('.delete-saved');
            
            downloadBtn.addEventListener('click', () => this.downloadSavedList(list.id));
            deleteBtn.addEventListener('click', () => this.deleteSavedList(list.id));

            container.appendChild(listItem);
        });
    }

    async downloadSavedList(listId) {
        const { savedLists = [] } = await chrome.storage.local.get('savedLists');
        const list = savedLists.find(l => l.id === listId);
        
        if (list) {
            this.downloadCSV(list.emails, list.name);
        }
    }

    async deleteSavedList(listId) {
        if (!confirm('Delete this list?')) return;

        const { savedLists = [] } = await chrome.storage.local.get('savedLists');
        const filteredLists = savedLists.filter(l => l.id !== listId);
        await chrome.storage.local.set({ savedLists: filteredLists });

        this.loadSavedLists();
        this.showStatus('List deleted', 'success');
    }

    downloadResults() {
        if (this.emails.length === 0) return;
        
        const fileName = `emails_${new Date().toISOString().split('T')[0]}.csv`;
        this.downloadCSV(this.emails, fileName);
    }

    downloadCSV(emails, fileName) {
        let csvContent = 'Email,Status,Details\n';
        
        emails.forEach(email => {
            const address = typeof email === 'string' ? email : email.address;
            const status = typeof email === 'string' ? 'pending' : email.status;
            const details = typeof email === 'string' ? '' : JSON.stringify(email.details || '');
            
            csvContent += `"${address}","${status}","${details}"\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showStatus('File downloaded', 'success');
    }

    showStatus(message, type = 'info') {
        const statusEl = document.getElementById('scanStatus');
        statusEl.textContent = message;
        statusEl.className = `status status-${type}`;
    }

    showProgressBar() {
        document.getElementById('progressBar').style.display = 'block';
    }

    hideProgressBar() {
        document.getElementById('progressBar').style.display = 'none';
    }

    updateProgress(percentage) {
        document.getElementById('progressFill').style.width = `${percentage}%`;
    }

    updateUI() {
        const scanBtn = document.getElementById('scanBtn');
        const saveListBtn = document.getElementById('saveListBtn');
        const downloadBtn = document.getElementById('downloadBtn');

        scanBtn.disabled = this.isScanning || this.isValidating;
        saveListBtn.disabled = this.emails.length === 0 || this.isValidating;
        downloadBtn.disabled = this.emails.length === 0 || this.isValidating;

        if (this.isScanning) {
            scanBtn.innerHTML = '<span class="loading"></span> Scanning...';
        } else if (this.isValidating) {
            scanBtn.innerHTML = '<span class="loading"></span> Validating...';
        } else {
            scanBtn.innerHTML = '<span class="btn-icon">🔍</span> Validate Email';
        }
    }
}

// Initialize application
let emailChecker;
document.addEventListener('DOMContentLoaded', () => {
    emailChecker = new EmailChecker();
}); 