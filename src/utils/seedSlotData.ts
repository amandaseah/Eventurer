/**
 * Utility to seed Firebase with varied slot data for events
 * Run this once to populate your database with realistic slot scenarios
 */

import { db } from '../lib/firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';

interface SlotScenario {
  totalSlots: number;
  availableSlots: number;
  rsvpCount: number;
}

/**
 * Generate random slot scenarios for events
 */
function generateSlotScenario(): SlotScenario {
  const random = Math.random();

  if (random < 0.08) {
    // 8% chance: Almost full (1-5 slots left)
    const availableSlots = Math.floor(Math.random() * 5) + 1;
    return {
      totalSlots: 100,
      availableSlots,
      rsvpCount: 100 - availableSlots,
    };
  } else if (random < 0.25) {
    // 17% chance: Running out / Filling fast (6-15 slots left)
    const availableSlots = Math.floor(Math.random() * 10) + 6;
    return {
      totalSlots: 100,
      availableSlots,
      rsvpCount: 100 - availableSlots,
    };
  } else if (random < 0.10) {
    // 10% chance: Full (0 slots) - moved this after filling-fast to ensure we get more "running out" events
    return {
      totalSlots: 100,
      availableSlots: 0,
      rsvpCount: 100,
    };
  } else {
    // 65% chance: Plenty of slots (40-100 available)
    const availableSlots = Math.floor(Math.random() * 61) + 40;
    return {
      totalSlots: 100,
      availableSlots,
      rsvpCount: 100 - availableSlots,
    };
  }
}

/**
 * Seed slot data for all fetched Eventbrite events
 * Guarantees at least a few events with low slots for demo purposes
 */
export async function seedEventSlots(eventIds: number[]): Promise<void> {
  if (eventIds.length === 0) {
    console.log('❌ No events to seed');
    return;
  }

  console.log(`🌱 Seeding slot data for ${eventIds.length} events...`);

  const EVENTS_COLLECTION = 'eventSlots';
  let seededCount = 0;
  let almostFull = 0;
  let fillingFast = 0;
  let full = 0;
  let available = 0;

  try {
    // Force first 6 events to have interesting slot scenarios for demo
    const guaranteedScenarios = [
      { availableSlots: 2, totalSlots: 100, rsvpCount: 98 },    // Almost full
      { availableSlots: 8, totalSlots: 100, rsvpCount: 92 },    // Running out
      { availableSlots: 12, totalSlots: 100, rsvpCount: 88 },   // Running out
      { availableSlots: 0, totalSlots: 100, rsvpCount: 100 },   // Full
      { availableSlots: 4, totalSlots: 100, rsvpCount: 96 },    // Almost full
      { availableSlots: 10, totalSlots: 100, rsvpCount: 90 },   // Running out
    ];

    for (let i = 0; i < eventIds.length; i++) {
      const eventId = eventIds[i];

      // Use guaranteed scenarios for first few events, random for rest
      const scenario = i < guaranteedScenarios.length
        ? guaranteedScenarios[i]
        : generateSlotScenario();

      await setDoc(doc(db, EVENTS_COLLECTION, eventId.toString()), {
        eventId,
        totalSlots: scenario.totalSlots,
        availableSlots: scenario.availableSlots,
        rsvpCount: scenario.rsvpCount,
        lastUpdated: new Date(),
      });

      seededCount++;

      // Track statistics
      if (scenario.availableSlots === 0) {
        full++;
      } else if (scenario.availableSlots <= 5) {
        almostFull++;
      } else if (scenario.availableSlots <= 15) {
        fillingFast++;
      } else {
        available++;
      }
    }

    console.log('✅ Slot data seeded successfully!');
    console.log(`   📊 Statistics:`);
    console.log(`      - Total events: ${seededCount}`);
    console.log(`      - Almost full (1-5 slots): ${almostFull} 🔴`);
    console.log(`      - Running out (6-15 slots): ${fillingFast} 🟠`);
    console.log(`      - Full (0 slots): ${full} 🔴`);
    console.log(`      - Available (40+ slots): ${available}`);
    console.log('');
    console.log('💡 First 6 events guaranteed to have low slot counts for demo!');
  } catch (error) {
    console.error('❌ Failed to seed slot data:', error);
  }
}

/**
 * Set specific slot data for an event
 */
export async function setEventSlots(
  eventId: number,
  availableSlots: number,
  totalSlots: number = 100
): Promise<void> {
  const EVENTS_COLLECTION = 'eventSlots';

  try {
    await setDoc(doc(db, EVENTS_COLLECTION, eventId.toString()), {
      eventId,
      totalSlots,
      availableSlots,
      rsvpCount: totalSlots - availableSlots,
      lastUpdated: new Date(),
    });

    console.log(`✅ Set event ${eventId} to ${availableSlots}/${totalSlots} slots`);
  } catch (error) {
    console.error(`❌ Failed to set slots for event ${eventId}:`, error);
  }
}

/**
 * Seed a single event with random slot data
 */
export async function seedSingleEvent(eventId: number): Promise<void> {
  const scenario = generateSlotScenario();
  const EVENTS_COLLECTION = 'eventSlots';

  try {
    await setDoc(doc(db, EVENTS_COLLECTION, eventId.toString()), {
      eventId,
      totalSlots: scenario.totalSlots,
      availableSlots: scenario.availableSlots,
      rsvpCount: scenario.rsvpCount,
      lastUpdated: new Date(),
    });

    console.log(`✅ Seeded event ${eventId} with ${scenario.availableSlots}/${scenario.totalSlots} slots`);
  } catch (error) {
    console.error(`❌ Failed to seed event ${eventId}:`, error);
  }
}

/**
 * Manually create some preset events with specific slot scenarios
 */
export async function seedPresetEvents(): Promise<void> {
  console.log('🎯 Seeding preset event scenarios...');

  const presets = [
    { eventId: 999999, availableSlots: 2, totalSlots: 100, label: 'Almost full (2 slots)' },
    { eventId: 999998, availableSlots: 8, totalSlots: 100, label: 'Running out (8 slots)' },
    { eventId: 999997, availableSlots: 0, totalSlots: 100, label: 'Full (0 slots)' },
    { eventId: 999996, availableSlots: 12, totalSlots: 100, label: 'Running out (12 slots)' },
    { eventId: 999995, availableSlots: 70, totalSlots: 100, label: 'Available (70 slots)' },
  ];

  try {
    for (const preset of presets) {
      await setEventSlots(preset.eventId, preset.availableSlots, preset.totalSlots);
      console.log(`   ✓ ${preset.label}`);
    }
    console.log('✅ Preset events seeded!');
  } catch (error) {
    console.error('❌ Failed to seed preset events:', error);
  }
}
