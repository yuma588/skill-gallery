// State
let favorites = JSON.parse(localStorage.getItem('skillFavorites')) || [];
let currentCategory = 'all';

// Get unique categories (sorted by count descending)
function getCategories() {
    const categories = [...new Set(skillsData.map(skill => skill.category))];
    return categories.sort((a, b) => {
        const countA = skillsData.filter(skill => skill.category === a).length;
        const countB = skillsData.filter(skill => skill.category === b).length;
        return countB - countA;
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
                <span>✨ All Skills</span>
                <span class="count">${getCategoryCount('all').toLocaleString()}</span>
            </button>
        </li>
    `;

    categories.forEach(category => {
        const emoji = categoryEmojis[category] || '⭐';
        html += `
            <li class="category-item">
                <button class="category-btn ${currentCategory === category ? 'active' : ''}" data-category="${category}">
                    <span>${emoji} ${category}</span>
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
        headerTitle.textContent = 'All Skills';
        headerSubtitle.textContent = `Explore and discover ${totalCount.toLocaleString()} powerful skills from skillsmp.com`;
    } else if (category === 'favorites') {
        filteredSkills = skillsData.filter(skill => favorites.includes(skill.id));
        headerTitle.textContent = 'My Favorites';
        headerSubtitle.textContent = `${filteredSkills.length} skills in your collection`;
    } else {
        filteredSkills = skillsData.filter(skill => skill.category === category);
        const count = getCategoryCount(category);
        headerTitle.textContent = category;
        headerSubtitle.textContent = `${count.toLocaleString()} skills available in ${category} (showing ${filteredSkills.length} samples)`;
    }

    if (filteredSkills.length === 0) {
        skillsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">🔍</div>
                <h3>No skills found</h3>
                <p>Try selecting a different category or add some favorites</p>
            </div>
        `;
        return;
    }

    skillsGrid.innerHTML = filteredSkills.map(skill => {
        const isFavorited = favorites.includes(skill.id);
        return `
            <div class="skill-card" style="--card-gradient: ${skill.gradient}" data-skill-id="${skill.id}" onclick="openModal(skillsData.find(s => s.id === '${skill.id}'))">
                <div class="skill-icon">${skill.icon}</div>
                <h3 class="skill-name">${skill.name}</h3>
                <p class="skill-description">${skill.description}</p>
                <div class="skill-footer">
                    <span class="skill-category">${skill.category}</span>
                    <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleFavorite('${skill.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </button>
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
    renderSkills(currentCategory);
}

// Initialize
function init() {
    renderCategories();
    renderSkills(currentCategory);

    // Add event listeners for category buttons
    document.addEventListener('click', (e) => {
        const categoryBtn = e.target.closest('.category-btn');
        if (categoryBtn) {
            const category = categoryBtn.dataset.category;
            currentCategory = category;
            renderCategories();
            renderSkills(category);
        }
    });
}

// Start the app
init();
