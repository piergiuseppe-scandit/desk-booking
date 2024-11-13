import { db } from './index';  // Adjust this import based on where your db instance is exported
import { desks } from './schema';

async function seedDesks() {
  try {
    // Create an array of desk entries
    const deskEntries = Array.from({ length: 88 }, (_, i) => ({
      label: (i+1).toString(),
      tags: '[]'
    }));

    // Insert all entries
    await db.insert(desks).values(deskEntries);

    console.log('Successfully seeded desks table');
  } catch (error) {
    console.error('Error seeding desks:', error);
  }
}

// Run the seed function
seedDesks();