import { URL } from '../config.js';
async function fetchData(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  return res.json();
}

async function loadAllData() {
  try {
    // Fetch profile pics
    const picsData = await fetchData(`${URL}api/user/pics`);
    if (Array.isArray(picsData)) {
      const profilePic = picsData.find(pic => pic.usage_type === 'Home page profile');
      if (profilePic) {
        document.getElementById('backgroung_profile_Img').src = profilePic.image_url;
      }
    }
  } catch (err) {
    console.error('Error loading data:', err);
  }
}

window.onload = loadAllData;
