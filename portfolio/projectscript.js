// Fetch data from projects.json and tags.json
Promise.all([
    fetch('projects.json').then(response => response.json()),
    fetch('tags.json').then(response => response.json())
])
    .then(([projects, tags]) => {
        generateFilters(tags); // Generate filter tags dynamically
        generateProjects(projects, tags); // Generate project cards dynamically
        setupFilterHandlers(); // Set up filter handlers
        generateDevelopmentSkills(projects, tags); // Dynamically generate skills in about-right
    })
    .catch(error => console.error('Error loading data:', error));

// Generate filter tags dynamically
function generateFilters(tags) {
    const filterRow = document.getElementById('filter-row');
    if (!filterRow) {
        console.error('Error: #filter-row element not found in the DOM.');
        return;
    }

    // Add "All" filter tag
    const allTag = document.createElement('div');
    allTag.className = 'filter-tag selected';
    allTag.dataset.skill = 'All';
    allTag.innerHTML = '<i class="fas fa-check"></i> All';
    filterRow.appendChild(allTag);

    // Add other skill filters
    tags.forEach(tag => {
        const filterTag = document.createElement('div');
        filterTag.className = 'filter-tag';
        filterTag.dataset.skill = tag.name; // Match skill name for filtering
        filterTag.style.backgroundColor = tag.color;
        if (tag.textColor) filterTag.style.color = tag.textColor;

        filterTag.innerHTML = `<i class="${tag.icon}"></i> ${tag.name}`;
        filterRow.appendChild(filterTag);
    });
}

// Generate project cards dynamically
function generateProjects(projects, tags) {
    const projectList = document.querySelector('.project-list');
    if (!projectList) {
        console.error('Error: .project-list element not found in the DOM.');
        return;
    }

    projectList.innerHTML = ''; // Clear existing content

    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.dataset.skills = project.skills.join(', '); // Store skills for filtering

        // Generate skill tags for the project
        const skillsTags = project.skills.map(skillName => {
            const tag = tags.find(tag => tag.name === skillName);
            if (tag) {
                return `
                    <div class="skill-tag" style="background-color: ${tag.color}; color: ${tag.textColor || '#fff'};">
                        <i class="${tag.icon}"></i> ${tag.name}
                    </div>`;
            } else {
                console.warn(`Tag not found for skill: ${skillName}`);
                return '';
            }
        }).join('');

        projectCard.innerHTML = `
            <div class="project-left">
                <img src="${project.image}" alt="${project.title}">
            </div>
            <div class="project-right">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="skills-tags">${skillsTags}</div>
                <p class="project-date">Created ${project.date}</p>
                <div class="project-buttons">
                    <a href="${project.demoLink}" class="btn demo-btn" target="_blank">
                        <i class="fas fa-globe"></i> View Demo
                    </a>
                    <a href="${project.githubLink}" class="btn github-btn" target="_blank">
                        <i class="fab fa-github"></i> View on GitHub
                    </a>
                </div>
            </div>
        `;
        projectList.appendChild(projectCard);
    });
}

// Set up filter event handlers
function setupFilterHandlers() {
    const filterTags = document.querySelectorAll('.filter-tag');
    const projectCards = document.querySelectorAll('.project-card');

    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // Remove "selected" class and hide the check icon for all filters
            filterTags.forEach(t => {
                t.classList.remove('selected');
                const checkIcon = t.querySelector('.fas.fa-check');
                if (checkIcon) checkIcon.classList.add('hidden');
            });

            // Add "selected" class to the clicked tag and show the check icon
            tag.classList.add('selected');
            const checkIcon = tag.querySelector('.fas.fa-check');
            if (checkIcon) checkIcon.classList.remove('hidden');

            // Filter project cards
            const selectedSkill = tag.dataset.skill;
            projectCards.forEach(card => {
                const cardSkills = card.dataset.skills.split(', ');
                card.style.display =
                    selectedSkill === 'All' || cardSkills.includes(selectedSkill) ? 'flex' : 'none';
            });
        });
    });

    // Automatically apply "All" filter on load
    const allTag = document.querySelector('.filter-tag[data-skill="All"]');
    if (allTag) allTag.click();
}

// Generate development skills dynamically
function generateDevelopmentSkills(projects, tags) {
    const skillCounts = {};
    const totalProjects = projects.length;

    // Count occurrences of each skill
    projects.forEach(project => {
        project.skills.forEach(skill => {
            if (!skillCounts[skill]) {
                skillCounts[skill] = 0;
            }
            skillCounts[skill]++;
        });
    });

    // Calculate percentages and sort by occurrence
    const sortedSkills = Object.entries(skillCounts)
        .map(([skillName, count]) => {
            const tag = tags.find(tag => tag.name === skillName);
            return {
                name: skillName,
                percentage: Math.round((count / totalProjects) * 100),
                color: tag ? tag.color : '#ccc', // Default color if not found
            };
        })
        .sort((a, b) => b.percentage - a.percentage);

    // Generate progress bars in the About section
    const aboutRight = document.querySelector('.about-right');
    if (!aboutRight) {
        console.error('Error: .about-right element not found in the DOM.');
        return;
    }

    aboutRight.innerHTML = '<h3>My Development Skills</h3>';

    sortedSkills.forEach(skill => {
        const skillDiv = document.createElement('div');
        skillDiv.className = 'skill';
        skillDiv.innerHTML = `
            <div class="label">${skill.name}</div>
            <div class="progress-container">
                <div class="progress" data-skill="${skill.percentage}"></div>
                <div class="empty-space"></div>
            </div>
        `;
        aboutRight.appendChild(skillDiv);
    });

    // Animate progress bars
    animateProgressBars();
}

// Animate skill progress bars
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress');

    progressBars.forEach((bar, index) => {
        const delay = index * 500; // Add a staggered delay for animation
        setTimeout(() => {
            const skillLevel = bar.getAttribute('data-skill');
            bar.style.width = `${skillLevel}%`; // Animate to the percentage
        }, delay);
    });
}

