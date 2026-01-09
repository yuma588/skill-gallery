// Modal state
let currentSkill = null;
let currentSkillMd = '';

// Get translation helper
function t(key) {
    return translations[currentLanguage][key] || translations['en'][key] || key;
}

// Translate category name
function translateCategory(category) {
    const categoryMap = {
        'Tools': 'tools',
        'Development': 'development',
        'Data & AI': 'dataAi',
        'Business': 'business',
        'DevOps': 'devOps',
        'Testing & Security': 'testingSecurity',
        'Documentation': 'documentation',
        'Content & Media': 'contentMedia',
        'Lifestyle': 'lifestyle',
        'Research': 'research',
        'Databases': 'databases',
        'Blockchain': 'blockchain'
    };
    const key = categoryMap[category] || category.toLowerCase().replace(/[^a-z]/g, '');
    return t(key);
}

// Get skill translation helper
function getSkillTranslation(skill, field) {
    const skillTranslations = translations[currentLanguage]?.skills?.[skill.id];
    if (skillTranslations && skillTranslations[field]) {
        return skillTranslations[field];
    }
    // Fallback to English translation
    const enTranslations = translations['en']?.skills?.[skill.id];
    if (enTranslations && enTranslations[field]) {
        return enTranslations[field];
    }
    // Fallback to original skill data
    return skill[field];
}

// Modal functions
function openModal(skill) {
    currentSkill = skill;

    // Set modal content
    document.getElementById('modalIcon').textContent = skill.icon;
    document.getElementById('modalIcon').style.background = skill.gradient;
    document.getElementById('modalTitle').textContent = getSkillTranslation(skill, 'name');
    document.getElementById('modalCategory').textContent = skill.category;

    // Set overview content
    const overviewContent = `
        <h3>${t('description')}</h3>
        <p>${getSkillTranslation(skill, 'description')}</p>
        <h3>${t('category')}</h3>
        <p>${translateCategory(skill.category)}</p>
        <h3>${t('source')}</h3>
        <p>${t('fromSkillsMpCom')}</p>
    `;
    document.getElementById('overviewContent').innerHTML = overviewContent;

    // Set resources content
    let resourcesContent = `
        <h3>${t('externalLinks')}</h3>
        <p><a href="${skill.sourceUrl}" target="_blank" style="color: var(--accent-light); text-decoration: none;">${t('viewOnSkillsMp')}</a></p>
    `;

    // Check if skill has custom resources
    if (skill.resources && skill.resources.length > 0) {
        resourcesContent += `
            <h3>${t('documentationFiles')}</h3>
            <div class="resources-list">
        `;

        skill.resources.forEach(resource => {
            resourcesContent += `
                <div class="resource-item">
                    <div class="resource-info">
                        <div class="resource-name">${resource.name}</div>
                        <div class="resource-desc">${resource.description}</div>
                    </div>
                    <button class="download-btn" onclick="downloadResource('${resource.path}', '${resource.name}')">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        ${t('download')}
                    </button>
                </div>
            `;
        });

        resourcesContent += `</div>`;
    } else {
        resourcesContent += `
            <h3>${t('documentation')}</h3>
            <p>${t('visitSkillsMpFullDocs')}</p>
        `;
    }

    document.getElementById('resourcesContent').innerHTML = resourcesContent;

    // Reset skillmd tab
    document.getElementById('skillmdLoading').style.display = 'flex';
    document.getElementById('skillmdContent').style.display = 'none';
    document.getElementById('skillmdActions').style.display = 'none';

    // Show modal
    document.getElementById('modalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';

    // Switch to overview tab
    switchTab('overview');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = '';
    currentSkill = null;
    currentSkillMd = '';
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`).classList.add('active');

    // Fetch skill data when switching to skillmd tab
    if (tabName === 'skillmd' && currentSkill && !currentSkillMd) {
        fetchSkillData(currentSkill);
    }
}

async function fetchSkillData(skill) {
    const loadingEl = document.getElementById('skillmdLoading');
    const contentEl = document.getElementById('skillmdContent');
    const actionsEl = document.getElementById('skillmdActions');

    try {
        loadingEl.style.display = 'flex';
        contentEl.style.display = 'none';
        actionsEl.style.display = 'none';

        // Try to fetch from skillsmp.com
        const response = await fetch(skill.sourceUrl);
        if (response.ok) {
            const html = await response.text();
            // Parse HTML to extract SKILL.md content
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Try to find pre/code blocks or markdown content
            const preBlocks = doc.querySelectorAll('pre, code');
            let markdownContent = '';

            if (preBlocks.length > 0) {
                preBlocks.forEach(block => {
                    markdownContent += block.textContent + '\n\n';
                });
            } else {
                // Try to get all text content
                const body = doc.body;
                markdownContent = `# ${skill.name}\n\n${body.innerText}`;
            }

            currentSkillMd = markdownContent;
        } else {
            throw new Error('Failed to fetch');
        }
    } catch (error) {
        // Fallback: Show sample skill content
        currentSkillMd = generateSampleSkillMd(skill);
    }

    // Display content
    loadingEl.style.display = 'none';
    contentEl.style.display = 'block';
    contentEl.innerHTML = renderMarkdown(currentSkillMd);
    actionsEl.style.display = 'flex';
}

function generateSampleSkillMd(skill) {
    return `---
name: ${skill.name.toLowerCase().replace(/\s+/g, '-')}
description: ${skill.description}
tool_name: ${skill.name.toLowerCase().replace(/\s+/g, '-')}
category: ${skill.category.toLowerCase().replace(/\s+/g, '-')}
priority: 7
tags: ["${skill.category.toLowerCase()}", "tool", "automation"]
version: 1.0
---

# ${skill.name}

This is a sample SKILL.md for ${skill.name}.

## Description

${skill.description}

## Features

- Feature 1
- Feature 2
- Feature 3

## Usage

\`\`\`json
{
  "action": "use_${skill.name.toLowerCase().replace(/\s+/g, '-')}",
  "parameters": {
    "input": "your input here"
  }
}
\`\`\`

## Examples

### Example 1

\`\`\`json
{
  "action": "use_${skill.name.toLowerCase().replace(/\s+/g, '-')}",
  "parameters": {
    "mode": "example",
    "data": "sample data"
  }
}
\`\`\`

## Notes

- This is a generated sample content
- Visit the actual SkillsMP.com page for the full SKILL.md
- The real content may include more detailed instructions and examples
`;
}

function renderMarkdown(markdown) {
    // Simple markdown to HTML conversion
    let html = markdown
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/`([^`]+)`/gim, '<code>$1</code>')
        .replace(/```json\n([\s\S]*?)```/gim, '<pre><code class="json">$1</code></pre>')
        .replace(/```\n([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');

    // Wrap lists
    html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
    html = html.replace(/<\/ul><br><ul>/g, '');
    html = html.replace(/<p>/g, '').replace(/<\/p>/g, '');

    return html;
}

function copyCode() {
    if (currentSkillMd) {
        navigator.clipboard.writeText(currentSkillMd).then(() => {
            const btn = document.querySelector('.action-btn.primary');
            const originalText = btn.innerHTML;
            btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
                ${t('copied')}
            `;
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        });
    }
}

async function downloadResource(path, filename) {
    try {
        // skills/ directory is now in the same directory, so use path directly
        let correctedPath = path;

        const response = await fetch(correctedPath);
        if (response.ok) {
            const content = await response.text();
            const blob = new Blob([content], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            alert(`Failed to download ${filename}. Please check the file path.`);
        }
    } catch (error) {
        alert(`Error downloading ${filename}: ${error.message}`);
    }
}

function downloadSkillMd() {
    if (currentSkillMd && currentSkill) {
        const blob = new Blob([currentSkillMd], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentSkill.name.toLowerCase().replace(/\s+/g, '-')}-skill.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Close modal on overlay click
document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Update modal content when language changes
function updateModalLanguage() {
    if (!currentSkill) return;

    // Update title and category text in modal header
    document.getElementById('modalTitle').textContent = getSkillTranslation(currentSkill, 'name');
    document.getElementById('modalCategory').textContent = translateCategory(currentSkill.category);

    // Update overview content
    const overviewContent = `
        <h3>${t('description')}</h3>
        <p>${getSkillTranslation(currentSkill, 'description')}</p>
        <h3>${t('category')}</h3>
        <p>${translateCategory(currentSkill.category)}</p>
        <h3>${t('source')}</h3>
        <p>${t('fromSkillsMpCom')}</p>
    `;
    document.getElementById('overviewContent').innerHTML = overviewContent;

    // Update resources
    updateResourcesLanguage();

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        const key = btn.dataset.i18n;
        if (key) {
            btn.textContent = t(key);
        }
    });

    // Update action buttons
    const primaryBtn = document.querySelector('.action-btn.primary');
    const secondaryBtn = document.querySelector('.action-btn.secondary');
    if (primaryBtn) {
        primaryBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857c0 1.124-.895 2.036-2 2.036H8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z"/>
            </svg>
            ${t('copyCode')}
        `;
    }
    if (secondaryBtn) {
        secondaryBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            ${t('downloadSkillMd')}
        `;
    }
}

function updateResourcesLanguage() {
    if (!currentSkill) return;

    let resourcesContent = `
        <h3>${t('externalLinks')}</h3>
        <p><a href="${currentSkill.sourceUrl}" target="_blank" style="color: var(--accent-light); text-decoration: none;">${t('viewOnSkillsMp')}</a></p>
    `;

    if (currentSkill.resources && currentSkill.resources.length > 0) {
        resourcesContent += `
            <h3>${t('documentationFiles')}</h3>
            <div class="resources-list">
        `;

        currentSkill.resources.forEach(resource => {
            resourcesContent += `
                <div class="resource-item">
                    <div class="resource-info">
                        <div class="resource-name">${resource.name}</div>
                        <div class="resource-desc">${resource.description}</div>
                    </div>
                    <button class="download-btn" onclick="downloadResource('${resource.path}', '${resource.name}')">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        ${t('download')}
                    </button>
                </div>
            `;
        });

        resourcesContent += `</div>`;
    } else {
        resourcesContent += `
            <h3>${t('documentation')}</h3>
            <p>${t('visitSkillsMpFullDocs')}</p>
        `;
    }

    document.getElementById('resourcesContent').innerHTML = resourcesContent;
}
