const fs = require('fs');
const path = require('path');
const https = require('https');

const destinationData = require('../frontend/src/data/destinationData.json');

const stateToFolder = (stateName) => stateName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
const placeToFilename = (placeName) => placeName.toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/,/g, '')
  .replace(/\(/g, '')
  .replace(/\)/g, '');

const getImagePath = (state, place) => {
  const stateFolder = stateToFolder(state);
  const filename = `${placeToFilename(place)}.jpg`;
  return path.join(__dirname, '..', 'frontend', 'public', 'images', 'destinations', stateFolder, filename);
};

const typeImageUrls = {
  mountain: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&h=600&q=80',
  beach: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&h=600&q=80',
  temple: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&h=600&q=80',
  forest: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=800&h=600&q=80',
  heritage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&h=600&q=80',
  city: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=800&h=600&q=80',
  lake: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&h=600&q=80',
  desert: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&h=600&q=80'
};

const fetchBuffer = (url) => new Promise((resolve, reject) => {
  https.get(url, (res) => {
    if ([301, 302, 303].includes(res.statusCode) && res.headers.location) {
      fetchBuffer(res.headers.location).then(resolve).catch(reject);
      return;
    }

    if (res.statusCode !== 200) {
      reject(new Error(`Failed to download ${url} - Status Code: ${res.statusCode}`));
      return;
    }

    const data = [];
    res.on('data', (chunk) => data.push(chunk));
    res.on('end', () => resolve(Buffer.concat(data)));
    res.on('error', reject);
  }).on('error', reject);
});

const typeCache = {};

const getTypeImageBuffer = async (type) => {
  if (typeCache[type]) {
    return typeCache[type];
  }

  const url = typeImageUrls[type];
  if (!url) {
    throw new Error(`No image URL configured for type: ${type}`);
  }

  const buffer = await fetchBuffer(url);
  typeCache[type] = buffer;
  return buffer;
};

const run = async () => {
  const entries = Object.entries(destinationData);
  const total = entries.reduce((count, [, places]) => count + places.length, 0);
  let completed = 0;

  for (const [state, places] of entries) {
    console.log(`\nProcessing state: ${state}`);
    for (const place of places) {
      const { name, type } = place;
      const filePath = getImagePath(state, name);
      const dir = path.dirname(filePath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      try {
        if (!fs.existsSync(filePath)) {
          const buffer = await getTypeImageBuffer(type);
          fs.writeFileSync(filePath, buffer);
          console.log(`  ✓ Saved: ${name}`);
        } else {
          console.log(`  Skipping ${name} (image already exists)`);
        }
      } catch (error) {
        console.error(`  ✗ Failed: ${name} - ${error.message}`);
      }

      completed += 1;
      console.log(`  Progress: ${completed}/${total}`);
    }
  }

  console.log('\nImage download process complete.');
};

run().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
