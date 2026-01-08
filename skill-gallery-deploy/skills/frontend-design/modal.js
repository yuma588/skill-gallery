// Modal state
let currentSkill = null;
let currentSkillMd = '';

// Modal functions
function openModal(skill) {
    currentSkill = skill;

    // Set modal content
    document.getElementById('modalIcon').textContent = skill.icon;
    document.getElementById('modalIcon').style.background = skill.gradient;
    document.getElementById('modalTitle').textContent = skill.name;
    document.getElementById('modalCategory').textContent = skill.category;

    // Set overview content
    const overviewContent = `
        <h3>Description</h3>
        <p>${skill.description}</p>
        <h3>Category</h3>
        <p>${skill.category}</p>
        <h3>Source</h3>
        <p>From SkillsMP.com</p>
    `;
    document.getElementById('overviewContent').innerHTML = overviewContent;

    // Set resources content
    let resourcesContent = `
        <h3>External Links</h3>
        <p><a href="${skill.sourceUrl}" target="_blank" style="color: var(--accent-light); text-decoration: none;">View on SkillsMP.com</a></p>
    `;

    // Check if skill has custom resources
    if (skill.resources && skill.resources.length > 0) {
        resourcesContent += `
            <h3>Documentation Files</h3>
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
                        Download
                    </button>
                </div>
            `;
        });

        resourcesContent += `</div>`;
    } else {
        resourcesContent += `
            <h3>Documentation</h3>
            <p>Visit the SkillsMP.com page for full documentation and examples.</p>
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
                Copied!
            `;
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        });
    }
}

async function downloadResource(path, filename) {
    try {
        // Fix path: convert "skills/..." to "../..." for correct relative path
        let correctedPath = path;
        if (path.startsWith('skills/')) {
            correctedPath = '../' + path.substring('skills/'.length);
        }

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
