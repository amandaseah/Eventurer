import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, increment, runTransaction } from 'firebase/firestore';

export interface EventSlotData {
  eventId: number;
  totalSlots: number;
  availableSlots: number;
  rsvpCount: number;
  lastUpdated: Date;
}

const EVENTS_COLLECTION = 'eventSlots';

/**
 * Initialize slot tracking for an event
 */
export async function initializeEventSlots(eventId: number, totalSlots: number = 100): Promise<void> {
  const eventRef = doc(db, EVENTS_COLLECTION, eventId.toString());

  try {
    const eventDoc = await getDoc(eventRef);

    if (!eventDoc.exists()) {
      await setDoc(eventRef, {
        eventId,
        totalSlots,
        availableSlots: totalSlots,
        rsvpCount: 0,
        lastUpdated: new Date(),
      });
    }
  } catch (error) {
    // Silent fail - slot tracking is optional
  }
}

/**
 * Get slot information for an event
 */
export async function getEventSlots(eventId: number): Promise<EventSlotData | null> {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId.toString());
    const eventDoc = await getDoc(eventRef);

    if (eventDoc.exists()) {
      const data = eventDoc.data();
      return {
        eventId: data.eventId,
        totalSlots: data.totalSlots,
        availableSlots: data.availableSlots,
        rsvpCount: data.rsvpCount,
        lastUpdated: data.lastUpdated.toDate(),
      };
    }

    // If not initialized, initialize with default slots
    await initializeEventSlots(eventId);
    return {
      eventId,
      totalSlots: 100,
      availableSlots: 100,
      rsvpCount: 0,
      lastUpdated: new Date(),
    };
  } catch (error) {
    return null;
  }
}

/**
 * Reserve a slot when user RSVPs (atomic transaction)
 */
export async function reserveSlot(eventId: number): Promise<{ success: boolean; availableSlots: number; message?: string }> {
  const eventRef = doc(db, EVENTS_COLLECTION, eventId.toString());

  try {
    const result = await runTransaction(db, async (transaction) => {
      const eventDoc = await transaction.get(eventRef);

      if (!eventDoc.exists()) {
        // Initialize if doesn't exist
        const initialData = {
          eventId,
          totalSlots: 100,
          availableSlots: 100,
          rsvpCount: 0,
          lastUpdated: new Date(),
        };
        transaction.set(eventRef, initialData);

        // Now reserve the slot
        transaction.update(eventRef, {
          availableSlots: 99,
          rsvpCount: 1,
          lastUpdated: new Date(),
        });

        return { success: true, availableSlots: 99 };
      }

      const data = eventDoc.data();
      const currentAvailable = data.availableSlots || 0;

      if (currentAvailable <= 0) {
        return { success: false, availableSlots: 0, message: 'Event is full' };
      }

      // Reserve the slot
      transaction.update(eventRef, {
        availableSlots: increment(-1),
        rsvpCount: increment(1),
        lastUpdated: new Date(),
      });

      return { success: true, availableSlots: currentAvailable - 1 };
    });

    return result;
  } catch (error) {
    return { success: false, availableSlots: 0, message: 'Failed to reserve slot' };
  }
}

/**
 * Release a slot when user cancels RSVP (atomic transaction)
 */
export async function releaseSlot(eventId: number): Promise<{ success: boolean; availableSlots: number }> {
  const eventRef = doc(db, EVENTS_COLLECTION, eventId.toString());

  try {
    const result = await runTransaction(db, async (transaction) => {
      const eventDoc = await transaction.get(eventRef);

      if (!eventDoc.exists()) {
        return { success: false, availableSlots: 0 };
      }

      const data = eventDoc.data();
      const currentAvailable = data.availableSlots || 0;
      const totalSlots = data.totalSlots || 100;

      // Don't exceed total slots
      if (currentAvailable >= totalSlots) {
        return { success: true, availableSlots: currentAvailable };
      }

      // Release the slot
      transaction.update(eventRef, {
        availableSlots: increment(1),
        rsvpCount: increment(-1),
        lastUpdated: new Date(),
      });

      return { success: true, availableSlots: currentAvailable + 1 };
    });

    return result;
  } catch (error) {
    return { success: false, availableSlots: 0 };
  }
}

/**
 * Get slot status for display
 */
export function getSlotStatus(availableSlots: number, totalSlots: number): {
  status: 'available' | 'filling-fast' | 'almost-full' | 'full';
  message: string;
  color: string;
} {
  if (availableSlots === 0) {
    return {
      status: 'full',
      message: 'Event is full',
      color: 'text-red-600',
    };
  }

  if (availableSlots <= 5) {
    return {
      status: 'almost-full',
      message: `Only ${availableSlots} spot${availableSlots === 1 ? '' : 's'} left!`,
      color: 'text-red-500',
    };
  }

  if (availableSlots <= 20) {
    return {
      status: 'filling-fast',
      message: `${availableSlots} spots left`,
      color: 'text-orange-500',
    };
  }

  return {
    status: 'available',
    message: `${availableSlots} spots available`,
    color: 'text-green-600',
  };
}

/**
 * Batch get slots for multiple events (for efficiency)
 */
export async function getBatchEventSlots(eventIds: number[]): Promise<Map<number, EventSlotData>> {
  const slotsMap = new Map<number, EventSlotData>();

  try {
    const promises = eventIds.map(id => getEventSlots(id));
    const results = await Promise.all(promises);

    results.forEach((slotData, index) => {
      if (slotData) {
        slotsMap.set(eventIds[index], slotData);
      }
    });
  } catch (error) {
    // Return empty map on error
  }

  return slotsMap;
}
