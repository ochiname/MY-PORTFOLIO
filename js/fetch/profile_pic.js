import { URL } from '../config.js';
document.addEventListener('DOMContentLoaded', () => {
  async function fetchData(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
    return res.json();
  }

  async function loadAllData() {
    try {
      const picsData = await fetchData(`${URL}api/user/pics`);
    //   console.log('Fetched pics data:', picsData); // Debug

      if (Array.isArray(picsData)) {
        const profilePic = picsData.find(pic => pic.usage_type === 'profile');
        if (profilePic) {
          const img = document.getElementById('profile_img');
          if (img) {
            img.src = profilePic.image_url;
          } else {
            console.warn('#profile_img not found in DOM');
          }
        } else {
          console.warn('No profile picture found in pics data.');
        }
      }
    } catch (err) {
      console.error('Error loading data:', err);
    }
  }

  loadAllData();
});
