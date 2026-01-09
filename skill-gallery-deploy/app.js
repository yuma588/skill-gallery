// State
let favorites = JSON.parse(localStorage.getItem('skillFavorites')) || [];
let currentCategory = localStorage.getItem('skillCategory') || 'all';
let currentLanguage = localStorage.getItem('skillLanguage') || 'en';

// Get unique categories (sorted by count descending)
function getCategories() {
    // Get categories that have skills
    const categoriesWithSkills = [...new Set(skillsData.map(skill => skill.category))];

    // Get all defined categories from categoryEmojis
    const allDefinedCategories = Object.keys(categoryEmojis);

    // Merge and deduplicate
    const allCategories = [...new Set([...categoriesWithSkills, ...allDefinedCategories])];

    // Sort by count descending (categories with 0 skills go last)
    return allCategories.sort((a, b) => {
        const countA = skillsData.filter(skill => skill.category === a).length;
        const countB = skillsData.filter(skill => skill.category === b).length;
        return countB - countA;
    });
}

// Get translation helper
function t(key) {
    return translations[currentLanguage][key] || translations['en'][key] || key;
}

// Translate category name
function translateCategory(category) {
    const categoryMap = {
        'anthropics': 'anthropics',
        'chatgpt': 'chatgpt'
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

// Toggle language
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'zh' : 'en';
    localStorage.setItem('skillLanguage', currentLanguage);
    updateLanguage();
}

// Update all language text
function updateLanguage() {
    // Update language button text
    document.getElementById('langText').textContent = currentLanguage.toUpperCase();
    
    // Update sidebar labels
    document.querySelectorAll('.category-label').forEach(label => {
        if (label.textContent === 'From SkillsMP.com') {
            label.textContent = t('fromSkillsMp');
        } else if (label.textContent === 'Collection') {
            label.textContent = t('collection');
        }
    });
    
    // Update My Favorites button
    const favoritesBtn = document.querySelector('[data-category="favorites"]');
    if (favoritesBtn) {
        favoritesBtn.querySelector('span').textContent = t('myFavorites');
    }
    
    // Re-render categories and skills with new language
    renderCategories();
    renderSkills(currentCategory);
    
    // Update modal if open
    if (currentSkill) {
        updateModalLanguage();
    }
    
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        el.textContent = t(key);
    });
}

// Get skills count by category
function getCategoryCount(category) {
    if (category === 'all') {
        return skillsData.length;
    }
    return skillsData.filter(skill => skill.category === category).length;
}

// Render category list
function renderCategories() {
    const categoryList = document.getElementById('categoryList');
    const categories = getCategories();

    let html = `
        <li class="category-item">
            <button class="category-btn ${currentCategory === 'all' ? 'active' : ''}" data-category="all">
                <span>${t('allSkills')}</span>
                <span class="count">${getCategoryCount('all').toLocaleString()}</span>
            </button>
        </li>
    `;

    categories.forEach(category => {
        const emoji = categoryEmojis[category] || '⭐';
        const translatedCategory = translateCategory(category);
        html += `
            <li class="category-item">
                <button class="category-btn ${currentCategory === category ? 'active' : ''}" data-category="${category}">
                    <span>${emoji} ${translatedCategory}</span>
                    <span class="count">${getCategoryCount(category).toLocaleString()}</span>
                </button>
            </li>
        `;
    });

    categoryList.innerHTML = html;
    updateFavoriteCount();
}

// Update favorite count
function updateFavoriteCount() {
    document.getElementById('favoriteCount').textContent = favorites.length;
    
    // Update favorites button active state
    const favoritesBtn = document.querySelector('[data-category="favorites"]');
    if (favoritesBtn) {
        if (currentCategory === 'favorites') {
            favoritesBtn.classList.add('active');
        } else {
            favoritesBtn.classList.remove('active');
        }
    }
}

// Render skills
function renderSkills(category) {
    const skillsGrid = document.getElementById('skillsGrid');
    const headerTitle = document.getElementById('headerTitle');
    const headerSubtitle = document.getElementById('headerSubtitle');

    let filteredSkills;

    if (category === 'all') {
        filteredSkills = skillsData;
        const totalCount = getCategoryCount('all');
        headerTitle.textContent = t('allSkillsTitle');
        headerSubtitle.textContent = t('allSkillsSubtitle');
    } else if (category === 'favorites') {
        filteredSkills = skillsData.filter(skill => favorites.includes(skill.id));
        headerTitle.textContent = t('myFavoritesTitle');
        headerSubtitle.textContent = `${filteredSkills.length}${t('myFavoritesSubtitle')}`;
    } else {
        filteredSkills = skillsData.filter(skill => skill.category === category);
        const count = getCategoryCount(category);
        const translatedCategory = translateCategory(category);
        headerTitle.textContent = translatedCategory;
        headerSubtitle.textContent = `${count.toLocaleString()}${t('categorySubtitle').replace('{category}', translatedCategory).replace('{count}', filteredSkills.length)}`;
    }

    if (filteredSkills.length === 0) {
        skillsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">🔍</div>
                <h3>${t('noSkillsFound')}</h3>
                <p>${t('tryDifferentCategory')}</p>
            </div>
        `;
        return;
    }

    skillsGrid.innerHTML = filteredSkills.map(skill => {
        const isFavorited = favorites.includes(skill.id);
        return `
            <div class="skill-card" style="--card-gradient: ${skill.gradient}" data-skill-id="${skill.id}" onclick="openModal(skillsData.find(s => s.id === '${skill.id}'))">
                <div class="skill-icon">${skill.icon}</div>
                <h3 class="skill-name">${getSkillTranslation(skill, 'name')}</h3>
                <p class="skill-description">${getSkillTranslation(skill, 'description')}</p>
                <div class="skill-footer">
                    <span class="skill-category">${translateCategory(skill.category)}</span>
                    <div class="action-buttons-group">
                        <button class="share-btn" onclick="event.stopPropagation(); shareSkill('${skill.id}')" title="${t('share')}">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                                <polyline points="16 6 12 2 8 6"/>
                                <line x1="12" y1="2" x2="12" y2="15"/>
                            </svg>
                        </button>
                        <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleFavorite('${skill.id}')">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Toggle favorite
function toggleFavorite(skillId) {
    const index = favorites.indexOf(skillId);

    if (index === -1) {
        favorites.push(skillId);
    } else {
        favorites.splice(index, 1);
    }

    localStorage.setItem('skillFavorites', JSON.stringify(favorites));
    updateFavoriteCount();

    // 找到被点击的收藏按钮并更新其样式
    const skillCard = document.querySelector(`[data-skill-id="${skillId}"]`);
    if (skillCard) {
        const favBtn = skillCard.querySelector('.favorite-btn');
        if (favBtn) {
            const isFavorited = favorites.includes(skillId);
            if (isFavorited) {
                favBtn.classList.add('favorited');
            } else {
                favBtn.classList.remove('favorited');
            }
        }
    }

    // 如果当前在"我的收藏"分类，需要处理技能的显示/隐藏
    if (currentCategory === 'favorites') {
        const skillCard = document.querySelector(`[data-skill-id="${skillId}"]`);
        if (skillCard) {
            const isFavorited = favorites.includes(skillId);
            if (!isFavorited) {
                // 如果取消收藏，淡出并移除卡片
                skillCard.style.opacity = '0';
                skillCard.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    skillCard.remove();
                    // 检查是否为空
                    const remainingSkills = document.querySelectorAll('.skill-card');
                    if (remainingSkills.length === 0) {
                        const skillsGrid = document.getElementById('skillsGrid');
                        const headerSubtitle = document.getElementById('headerSubtitle');
                        skillsGrid.innerHTML = `
                            <div class="empty-state" style="grid-column: 1 / -1;">
                                <div class="empty-state-icon">🔍</div>
                                <h3>${t('noSkillsFound')}</h3>
                                <p>${t('tryDifferentCategory')}</p>
                            </div>
                        `;
                        headerSubtitle.textContent = `0${t('myFavoritesSubtitle')}`;
                    }
                }, 300);
            }
        }
    }
}

// Share skill
async function shareSkill(skillId) {
    const skill = skillsData.find(s => s.id === skillId);
    if (!skill) return;

    const skillName = getSkillTranslation(skill, 'name');
    const skillDescription = getSkillTranslation(skill, 'description');

    const shareData = {
        title: skillName,
        text: `${skillName}\n\n${skillDescription}`,
        url: window.location.href
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
            showToast(t('shareSuccess'));
        } else {
            await navigator.clipboard.writeText(shareData.url);
            showToast(t('linkCopied'));
        }
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error('Share failed:', err);
            await navigator.clipboard.writeText(shareData.url);
            showToast(t('linkCopied'));
        }
    }
}

// Show toast notification
function showToast(message) {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 2000);
}

// Initialize
function init() {
    updateLanguage();
    renderCategories();
    renderSkills(currentCategory);

    // Add event listeners for category buttons
    document.addEventListener('click', (e) => {
        const categoryBtn = e.target.closest('.category-btn');
        if (categoryBtn) {
            const category = categoryBtn.dataset.category;
            currentCategory = category;
            localStorage.setItem('skillCategory', category);
            renderCategories();
            renderSkills(category);
        }
    });
}

// Start the app
init();
