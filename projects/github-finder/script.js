const usernameInput = document.getElementById('usernameInput');
const searchBtn = document.getElementById('searchBtn');
const profileResult = document.getElementById('profileResult');

async function getGithubUser(username) {
    profileResult.innerHTML = '<div class="loading">🔍 Searching GitHub...</div>';
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('User not found! Check the username and try again.');
            } else {
                throw new Error('Something went wrong. Please try again.');
            }
        }
        const userData = await response.json();
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
        const reposData = await reposResponse.json();
        displayProfile(userData, reposData);
    } catch (error) {
        profileResult.innerHTML = `<div class="error-message">❌ ${error.message}</div>`;
    }
}

function displayProfile(user, repos) {
    profileResult.innerHTML = `
        <div class="profile-card">
            <div class="avatar-section">
                <img class="avatar" src="${user.avatar_url}" alt="${user.login}">
            </div>
            <div class="info-section">
                <h2 class="name">${user.name || user.login}</h2>
                <div class="username">@${user.login}</div>
                <div class="bio">${user.bio || 'No bio available'}</div>
                <div class="location">📍 ${user.location || 'Location not specified'}</div>
                <div class="stats">
                    <div class="stat">
                        <div class="stat-number">${user.public_repos}</div>
                        <div class="stat-label">Repositories</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">${user.followers}</div>
                        <div class="stat-label">Followers</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">${user.following}</div>
                        <div class="stat-label">Following</div>
                    </div>
                </div>
                <div class="repos-title">📁 Top Repositories</div>
                <ul class="repos-list">
                    ${repos.map(repo => `
                        <li class="repo-item">
                            <a href="${repo.html_url}" target="_blank" class="repo-name">📂 ${repo.name}</a>
                            <span class="repo-stars">⭐ ${repo.stargazers_count} stars</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `;
}

function handleSearch() {
    const username = usernameInput.value.trim();
    if (username === '') {
        profileResult.innerHTML = '<div class="error-message">⚠️ Please enter a GitHub username!</div>';
        return;
    }
    getGithubUser(username);
}

searchBtn.addEventListener('click', handleSearch);
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});
