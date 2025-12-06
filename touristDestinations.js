// Indian Tourist Destinations Database
// Images are loaded from local assets directory: src/assets/{imageName}
// Organized by State/UT with popular destinations

import destinationData from './destinationData.json';

// Gradient fallbacks for different destination types (shown when image is loading or missing)
export const gradients = {
  mountain: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  beach: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  temple: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  forest: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  heritage: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  city: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  lake: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  desert: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
};

// Helper function to resolve local asset path
const resolveLocalImage = (imageName) => {
  if (!imageName) {
    return null;
  }

  try {
    return new URL(`../assets/${imageName}`, import.meta.url).href;
  } catch (error) {
    console.warn(`[touristDestinations] Missing image asset: ${imageName}`);
    return null;
  }
};

// Build the full destinations object with images and fallbacks
export const indianTouristDestinations = {};

Object.entries(destinationData).forEach(([state, places]) => {
  const filteredPlaces = places
    .map(place => {
      const imageUrl = resolveLocalImage(place.image);
      if (!imageUrl) {
        return null;
      }

      return {
        name: place.name,
        image: imageUrl,
        fallback: gradients[place.type],
        type: place.type
      };
    })
    .filter(Boolean);

  if (filteredPlaces.length > 0) {
    indianTouristDestinations[state] = filteredPlaces;
  }
});

// Helper function to get all destinations as a flat list
export const getAllDestinations = () => {
  const destinations = [];
  Object.entries(indianTouristDestinations).forEach(([state, places]) => {
    places.forEach(place => {
      destinations.push({
        ...place,
        state,
        fullName: `${place.name}, ${state}`
      });
    });
  });
  return destinations;
};

// Helper function to get destination by name
export const getDestinationByName = (name) => {
  const allDestinations = getAllDestinations();
  return allDestinations.find(dest => dest.name === name || dest.fullName === name);
};
