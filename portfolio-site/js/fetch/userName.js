import { URL } from '../config.js';

const BASE_API_URL = URL.replace(/\/+$/, '');  // Remove trailing slash if any

async function fetchData(endpoint) {
  // Remove leading slashes from endpoint to avoid double slash when joining
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  const url = `${BASE_API_URL}/${cleanEndpoint}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  return res.json();
}

async function loadAllData() {
  try {
    // Fetch profile data
    const profileData = await fetchData('api/user/profiles');

    if (Array.isArray(profileData)) {
      const user = profileData.find(u => u.first_name && u.last_name); // find a valid user

      if (user) {
        const fullName = `${user.first_name} ${user.last_name}`;
        document.getElementById('profile_firstName').textContent = fullName;
      }

        if (user.role && document.getElementById('profile_role')) {
          document.getElementById('profile_role').textContent = user.role;
        }

       if (user.bio && document.getElementById('profile_bio')) {
          document.getElementById('profile_bio').textContent = user.bio;
        }

        // Social Links
        if (user.linkedin) {
          document.getElementById('LinkedIn').href = user.linkedin;
        }

        if (user.github) {
          document.getElementById('GitHub').href = user.github;
        }

        if (user.twitter) {
          document.getElementById('Twitter').href = user.twitter;
        }
    }
  } catch (err) {
    console.error('Error loading data:', err);
  }
}
async function loadEduData() {
    try{
        const profileData = await fetchData('api/user/educations');
        if (Array.isArray(profileData)) {
      const edu = profileData.find(u => u.degree && u.institution); // find a valid user

      if (edu) {
        const degree = `${edu.degree}`;
        document.getElementById('degree').textContent = degree;
      }

        if (edu.institution && document.getElementById('institution')) {
          document.getElementById('institution').textContent = edu.institution;
        }
        if (edu.start_year && edu.end_year && document.getElementById('start')) {
          const date = `(${edu.start_year} - ${edu.end_year})`
          document.getElementById('start').textContent = date;
        }
    }
  } catch (err) {
    console.error('Error loading data:', err);
  }
}

async function loadSkills() {
  try {
    const skillsData = await fetchData('api/user/skills');

    if (Array.isArray(skillsData)) {
      const skillsContainer = document.getElementById('skills-section');

      // Clear existing content
      skillsContainer.innerHTML = '';

      // Create and append the main title once
      const skillTITLE = document.createElement('h1');
      skillTITLE.classList.add('section-title'); // Use a semantic class
      skillTITLE.textContent = "Skills";
      skillsContainer.appendChild(skillTITLE);

      // Loop through skills
      skillsData.forEach(skill => {
        if (skill.skill_name && skill.proficiency) {
          // Create skill wrapper
          const skillDiv = document.createElement('div');
          skillDiv.classList.add('skill');

          // Create skill title
          const skillTitle = document.createElement('h3');
          skillTitle.textContent = skill.skill_name;

          // Create skill bar
          const skillBar = document.createElement('div');
          skillBar.classList.add('skill-bar');
          skillBar.style.width = `${skill.proficiency}%`;
          skillBar.textContent = `${skill.proficiency}%`;

          // Assemble and append skill item
          skillDiv.appendChild(skillTitle);
          skillDiv.appendChild(skillBar);
          skillsContainer.appendChild(skillDiv);
        }
      });
    }
  } catch (err) {
    console.error('Error loading skills:', err);
  }
}
async function loadWorkExperience() {
  try {
    const workData = await fetchData('api/user/expriences');

    const workSection = document.getElementById('work-experience');
    workSection.innerHTML = ''; // Clear existing content

    // Create and append <h1> title
    const title = document.createElement('h1');
    title.textContent = 'Work Experience';
    workSection.appendChild(title);

    // Create <ul> container
    const ul = document.createElement('ul');
    workSection.appendChild(ul);

    workData.forEach(exp => {
      if (exp.job_title && exp.company_name && exp.start_year && exp.end_year && exp.responsibilities) {
        // Create outer <p> container
        const outerP = document.createElement('p');

        // Create and append <strong> for job title and text for company + years
        const strong = document.createElement('strong');
        strong.textContent = exp.job_title;

        const text = document.createTextNode(` - ${exp.company_name} (${exp.start_year} - ${exp.end_year})`);

        // Inner <p> for responsibilities
        const responsibilitiesP = document.createElement('p');
        responsibilitiesP.textContent = exp.responsibilities;

        // Assemble the structure
        outerP.appendChild(strong);
        outerP.appendChild(text);
        outerP.appendChild(responsibilitiesP);

        ul.appendChild(outerP);
      }
    });

  } catch (err) {
    console.error('Error loading work experience:', err);
  }
}
async function loadProjectData() {
  try {
    const projectData = await fetchData('api/user/projects');

    if (Array.isArray(projectData)) {
      const projectList = document.getElementById('project-list');
      projectList.innerHTML = ''; // Clear existing entries

      projectData.forEach(project => {
        if (project.project_name && project.description && project.technologies) {
          const li = document.createElement('li');
          li.innerHTML = `
            <strong>${project.project_name}</strong> – ${project.description}<br>
            <em>Technologies:</em> ${project.technologies}
          `;
          projectList.appendChild(li); // ✅ append to DOM
        }
      });
    }
  } catch (err) {
    console.error('Error loading project data:', err);
  }
}

async function loadLanguageData() {
  try {
    const languageData = await fetchData('api/user/languages');

    if (Array.isArray(languageData)) {
      const languageList = document.getElementById('language-list');
      languageList.innerHTML = ''; // Clear existing entries

      languageData.forEach(lang => {
        if (lang.language_name && lang.proficiency) {
          const p = document.createElement('p');
          p.textContent = `${lang.language_name} (${lang.proficiency})`;
          languageList.appendChild(p);
        }
      });
    }
  } catch (err) {
    console.error('Error loading language data:', err);
  }
}
async function loadCertificationData() {
  try {
    const certData = await fetchData('api/user/certificates');

    if (Array.isArray(certData)) {
      const certList = document.getElementById('certification-list');
      certList.innerHTML = ''; // Clear existing entries

      certData.forEach(cert => {
        if (cert.certification_name && cert.institution_name && cert.year) {
          const li = document.createElement('li');
          li.innerHTML = `<strong>${cert.certification_name}</strong> - ${cert.institution_name} (${cert.year})`;
          certList.appendChild(li);
        }
      });
    }
  } catch (err) {
    console.error('Error loading certification data:', err);
  }
}
async function loadContactData() {
  try {
    const contact = await fetchData('api/user/contacts');

    if (contact && (contact.email || contact.phone1 || contact.location)) {
      const emailElem = document.getElementById('contact-email');
      const phoneElem = document.getElementById('contact-phone');
      const locationElem = document.getElementById('contact-location');

      if (emailElem) emailElem.textContent = contact.email || 'N/A';
      if (phoneElem) phoneElem.textContent = contact.phone1 || 'N/A';
      if (locationElem) locationElem.textContent = contact.location || 'N/A';
    } else {
      console.warn('Contact data missing expected fields');
    }
  } catch (err) {
    console.error('Error loading contact data:', err);
  }
}
window.onload = () => {
  loadAllData();
  loadEduData();
  loadSkills();
  loadWorkExperience();
  loadProjectData();
  loadLanguageData();
  loadCertificationData();
  loadContactData();
};
