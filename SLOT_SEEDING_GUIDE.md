# Event Slot Seeding Guide

Your Firebase database will now have varied slot data for all events!

## How It Works

**Automatic Seeding:**
- When you first load the app, it will automatically seed all Eventbrite events with random slot data
- This happens only once (tracked via localStorage)
- Slot distribution:
  - 8% of events: Almost full (1-5 slots left) → Red badge
  - 17% of events: Running out (6-15 slots left) → Orange badge "Running out!"
  - 10% of events: Full (0 slots) → Dark red badge + disabled RSVP
  - 65% of events: Available (40+ slots) → No badge

**Storage:**
- All slot data is stored in Firebase Firestore (`eventSlots` collection)
- Data persists across page refreshes and devices
- Real-time RSVP tracking updates the database

## Manual Controls

Open browser console (F12) and use these commands:

### 1. Seed a Single Event with Random Slots
```javascript
// Seed one event with random slot data (5% almost full, 10% filling fast, etc.)
window.seedSingleEvent(1911207114929)
```

### 2. Seed Multiple Events with Random Slots
```javascript
// Get multiple event IDs and seed them all
const eventIds = [123456, 789012, 345678];
window.seedEventSlots(eventIds)
```

### 3. Set Specific Slot Count for an Event
```javascript
// Set event to almost full (1 slot left)
window.setEventSlots(1911207114929, 1, 100)

// Set event to filling fast (15 slots)
window.setEventSlots(1911207114929, 15, 100)

// Set event to full (0 slots)
window.setEventSlots(1911207114929, 0, 100)

// Set custom capacity (e.g., 50 total slots, 10 available)
window.setEventSlots(1911207114929, 10, 50)
```

### 4. Create Preset Test Events
```javascript
// Creates 5 preset events with specific scenarios
window.seedPresetEvents()

// Creates:
// - Event 999999: 2 slots (almost full)
// - Event 999998: 8 slots (running out)
// - Event 999997: 0 slots (full)
// - Event 999996: 12 slots (running out)
// - Event 999995: 70 slots (available)
```

## Re-seed All Events

If you want to clear and re-seed everything:

```javascript
// 1. Clear the seeded flag
localStorage.removeItem('slots_seeded')

// 2. Refresh the page
location.reload()

// All events will be re-seeded with new random slot data
```

## What You'll See

After seeding, browse your events and you'll see:

### Event Cards:
- **Red badge** (top-left): "Only 1 spot left!" or "Only X spots left!" (1-5 slots)
- **Orange badge** (top-left): "Running out! X spots left" (6-15 slots)
- **Dark red badge** (top-left): "Event is full" (0 slots)
- **No badge**: Plenty of slots available (40+ slots)

### RSVP Buttons:
- **Pink "RSVP"**: Available slots, can RSVP
- **Gray disabled "Event Full"**: 0 slots, cannot RSVP
- **Green "✓ RSVP'd"**: You've already RSVP'd

### CountdownWidget:
- Bookmarked events with low slots show warnings
- Red/orange indicators match event card badges

## Checking Firebase Data

To view your seeded data in Firebase Console:

1. Go to Firebase Console → Firestore Database
2. Look for the `eventSlots` collection
3. Each document has:
   - `eventId`: The Eventbrite event ID
   - `totalSlots`: Total capacity (usually 100)
   - `availableSlots`: Current available slots
   - `rsvpCount`: Number of RSVPs via Eventurer
   - `lastUpdated`: Last modification timestamp

## Notes

- **One-time seeding**: Auto-seeding only happens once to avoid overwriting real RSVP data
- **Real RSVPs count**: When users RSVP via Eventurer, slots decrement in real-time
- **Persistent**: Data stays in Firebase, not affected by page refreshes
- **Independent per event**: Each event has its own slot tracking

---

**You're all set!** Your events now have realistic slot availability stored in Firebase! 🎉
