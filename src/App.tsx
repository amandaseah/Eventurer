import { useCallback, useEffect, useState } from 'react';
import { LoginPage } from './components/pages/LoginPage';
import { SignupPage } from './components/pages/SignupPage';
import { LandingPage } from './components/pages/LandingPage';
import { MarketingLandingPage } from './components/pages/MarketingLandingPage';
import { MoodResultsPage } from './components/pages/MoodResultsPage';
import { EventExplorePage } from './components/pages/EventExplorePage';
import { EventInfoPage } from './components/pages/EventInfoPage';
import { EventForumPage } from './components/pages/EventForumPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { SettingsPage } from './components/pages/SettingsPage';
import { CountdownWidget } from './components/CountdownWidget';
import { Toaster } from './components/ui/sonner';
import { loadGoogleMapsScript } from './lib/loadGoogleMaps';
import { fetchEventbriteEvents, fetchEventbriteEventsForMe, sanityCheckMe } from './lib/eventbriteService';
import { categorizeEvent } from './lib/eventCategoriser';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom'
import ThreeLanding from './components/features/landing3D/ThreeLanding'
import HomePreview from './components/pages/HomePreview'

interface Discussion {
  id: number;
  username: string;
  timestamp: string;
  comment: string;
  upvotes: number;
  image?: string;
  replyTo?: number;
}

type Page =
  | 'login'
  | 'signup'
  | 'landing'
  | 'mood-results'
  | 'explore'
  | 'event-info'
  | 'event-forum'
  | 'profile'
  | 'settings';

interface PageData {
  mood?: string;
  eventId?: number;
}

type NavigateData = PageData & { postId?: number };

function ShellApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookmarkedEventIds, setBookmarkedEventIds] = useState<number[]>([]);
  const [rsvpedEventIds, setRsvpedEventIds] = useState<number[]>([]);

  // Load user's bookmarks and RSVPs from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setBookmarkedEventIds(userData.bookmarkedEventIds || []);
            setRsvpedEventIds(userData.rsvpedEventIds || []);
          }
        } catch (err) {
          console.warn('Failed to load user event data', err);
        }
      } else {
        // User signed out, clear data
        setBookmarkedEventIds([]);
        setRsvpedEventIds([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Save user event data to Firebase
  const saveUserEventData = async (bookmarks: number[], rsvps: number[]) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await setDoc(doc(db, 'users', user.uid), {
        bookmarkedEventIds: bookmarks,
        rsvpedEventIds: rsvps,
      }, { merge: true });
    } catch (err) {
      console.error('Failed to save user event data', err);
    }
  };

  useEffect(() => {
    // Preload Google Maps so the first visit to event details feels instant.
    loadGoogleMapsScript().catch((error) => {
      console.warn('[ShellApp] Failed to preload Google Maps script:', error);
    });
  }, []);
  

  // eventbrite events fetch!
  const [fetchedEvents, setFetchedEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);


  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingEvents(true);
        // Try public events search first, fallback to user events if needed
        let data = await fetchEventbriteEvents('Singapore', '25km');
        
        // If no public events found, try user's events as fallback
        if (data.length === 0) {
          console.log('[App] No public events found, trying user events...');
          try {
            await sanityCheckMe();
            data = await fetchEventbriteEventsForMe();
          } catch (userErr) {
            console.warn('[App] User events also failed:', userErr);
          }
        }
        
        // If still no events, show error message
        if (data.length === 0) {
          console.error('[App] No Eventbrite events found. Please check your API token configuration.');
        }
        const enriched = data.map((e: any) => {
          const { mood, category } = categorizeEvent(
            e.title || e.name?.text || e.name || "",
            e.description || e.description?.text || "",
            e.category || e.category?.name || ""
          );
          return { ...e, mood, category };
        });
        if (mounted) setFetchedEvents(enriched);
      } catch (err) {
        console.error("[App] failed fetching events:", err);
      } finally {
        if (mounted) setLoadingEvents(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const bookmarkedEvents = fetchedEvents.filter(e => bookmarkedEventIds.includes(e.id) && !e.isPast);
  const rsvpedEvents    = fetchedEvents.filter(e => rsvpedEventIds.includes(e.id) && !e.isPast);
  const sortedUpcomingEvents = fetchedEvents
    .filter(e => !e.isPast)
    .sort((a, b) => {
      const aDate = eDateValue(a);
      const bDate = eDateValue(b);
      return aDate - bDate;
    });

  function eDateValue(event: any) {
    const rawDate = event?.date || event?.start?.local || event?.start?.utc || event?.startDate;
    const parsed = rawDate ? new Date(rawDate).getTime() : Number.POSITIVE_INFINITY;
    return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
  }


  const mapPageToPath = useCallback((page: Page, data?: NavigateData) => {
    switch (page) {
      case 'login':
        return '/app/login'
      case 'signup':
        return '/app/signup'
      case 'landing':
        return '/app/landing'
      case 'explore':
        return '/app/explore'
      case 'profile':
        return '/app/profile'
      case 'settings':
        return '/app/settings'
      case 'mood-results':
        if (data?.mood) {
          return `/app/mood-results/${encodeURIComponent(data.mood)}`
        }
        return '/app/mood-results'
      case 'event-info':
        if (typeof data?.eventId !== 'undefined') {
          return `/app/events/${data.eventId}`
        }
        return '/app/explore'
      case 'event-forum':
        if (typeof data?.eventId !== 'undefined') {
          const base = `/app/events/${data.eventId}/forum`
          if (typeof data?.postId !== 'undefined') {
            return `${base}?post=${data.postId}`
          }
          return base
        }
        return '/app/explore'
      default:
        return '/app/landing'
    }
  }, [])

  const handleNavigate = useCallback(
    (page: string, data?: NavigateData) => {
      const target = mapPageToPath(page as Page, data)
      if (!target) return
      navigate(target)
    },
    [mapPageToPath, navigate],
  )

  const handleBookmarkChange = async (eventId: number, isBookmarked: boolean) => {
    const newBookmarks = isBookmarked
      ? [...bookmarkedEventIds, eventId]
      : bookmarkedEventIds.filter(id => id !== eventId);
    
    setBookmarkedEventIds(newBookmarks);
    await saveUserEventData(newBookmarks, rsvpedEventIds);
  };

  const handleRSVPChange = async (eventId: number, isRSVPed: boolean) => {
    const newRSVPs = isRSVPed
      ? [...rsvpedEventIds, eventId]
      : rsvpedEventIds.filter(id => id !== eventId);
    
    setRsvpedEventIds(newRSVPs);
    await saveUserEventData(bookmarkedEventIds, newRSVPs);
  };

  const isAuthRoute = /\/app\/(login|signup)\/?$/i.test(location.pathname)
  const isAppRoot = location.pathname === '/app'
  const showCountdownWidget = !isAuthRoute && !isAppRoot

  return (
    <div className="size-full bg-white">
      <Routes>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<LoginPage onNavigate={handleNavigate} />} />
        <Route path="signup" element={<SignupPage onNavigate={handleNavigate} />} />
        <Route
          path="landing"
          element={
            <LandingPage
              onNavigate={handleNavigate}
              events={fetchedEvents}
              loading={loadingEvents}
              bookmarkedEventIds={bookmarkedEventIds}
              rsvpedEventIds={rsvpedEventIds}
              onBookmarkChange={handleBookmarkChange}
              onRSVPChange={handleRSVPChange}
            />
          }
        />
        <Route
          path="mood-results"
          element={<Navigate to="../landing" replace />}
        />
        <Route
          path="mood-results/:mood"
          element={
            <MoodResultsRoute
              events={fetchedEvents}
              onNavigate={handleNavigate}
              bookmarkedEventIds={bookmarkedEventIds}
              rsvpedEventIds={rsvpedEventIds}
              onBookmarkChange={handleBookmarkChange}
              onRSVPChange={handleRSVPChange}
            />
          }
        />
        <Route
          path="explore"
          element={
            <EventExplorePage
              events={fetchedEvents}
              loading={loadingEvents}
              onNavigate={handleNavigate}
              bookmarkedEventIds={bookmarkedEventIds}
              rsvpedEventIds={rsvpedEventIds}
              onBookmarkChange={handleBookmarkChange}
              onRSVPChange={handleRSVPChange}
            />
          }
        />
        <Route
          path="events"
          element={<Navigate to="../explore" replace />}
        />
        <Route
          path="events/:eventId"
          element={
            <EventInfoRoute
              events={fetchedEvents}
              onNavigate={handleNavigate}
              bookmarkedEventIds={bookmarkedEventIds}
              rsvpedEventIds={rsvpedEventIds}
              onBookmarkChange={handleBookmarkChange}
              onRSVPChange={handleRSVPChange}
            />
          }
        />
        <Route
          path="events/:eventId/forum"
          element={
            <EventForumRoute
              events={fetchedEvents}
              onNavigate={handleNavigate}
              username="Guest"
            />
          }
        />
        <Route
          path="profile"
          element={
            <ProfilePage
              events={fetchedEvents}
              onNavigate={handleNavigate}
              onGoBack={() => navigate(-1)}
              bookmarkedEventIds={bookmarkedEventIds}
              rsvpedEventIds={rsvpedEventIds}
              onBookmarkChange={handleBookmarkChange}
              onRSVPChange={handleRSVPChange}
            />
          }
        />
        <Route
          path="settings"
          element={
            <SettingsPage
              onNavigate={handleNavigate}
              onGoBack={() => navigate(-1)}
            />
          }
        />
        <Route path="*" element={<Navigate to="landing" replace />} />
      </Routes>

      {showCountdownWidget && (
        <CountdownWidget
          bookmarkedEvents={bookmarkedEvents}
          rsvpedEvents={rsvpedEvents}
          fallbackEvents={sortedUpcomingEvents}
          onEventClick={(id) => handleNavigate('event-info', { eventId: id })}
        />
      )}
      
      <Toaster />
    </div>
  );
}

function MoodResultsRoute({
  events,
  onNavigate,
  bookmarkedEventIds,
  rsvpedEventIds,
  onBookmarkChange,
  onRSVPChange,
}: {
  events: any[]
  onNavigate: (page: string, data?: NavigateData) => void
  bookmarkedEventIds: number[]
  rsvpedEventIds: number[]
  onBookmarkChange: (eventId: number, isBookmarked: boolean) => void
  onRSVPChange: (eventId: number, isRSVPed: boolean) => void
}) {
  const { mood } = useParams<{ mood?: string }>()
  if (!mood) {
    return <Navigate to="../landing" replace />
  }

  const decodedMood = decodeURIComponent(mood)

  return (
    <MoodResultsPage
      mood={decodedMood}
      events={events}
      onNavigate={onNavigate}
      bookmarkedEventIds={bookmarkedEventIds}
      rsvpedEventIds={rsvpedEventIds}
      onBookmarkChange={onBookmarkChange}
      onRSVPChange={onRSVPChange}
    />
  )
}

function EventInfoRoute({
  events,
  onNavigate,
  bookmarkedEventIds,
  rsvpedEventIds,
  onBookmarkChange,
  onRSVPChange,
}: {
  events: any[]
  onNavigate: (page: string, data?: NavigateData) => void
  bookmarkedEventIds: number[]
  rsvpedEventIds: number[]
  onBookmarkChange: (eventId: number, isBookmarked: boolean) => void
  onRSVPChange: (eventId: number, isRSVPed: boolean) => void
}) {
  const { eventId } = useParams<{ eventId?: string }>()
  const navigate = useNavigate()

  if (!eventId) {
    return <Navigate to="../explore" replace />
  }

  return (
    <EventInfoPage
      eventId={eventId}
      events={events}
      onNavigate={onNavigate}
      onGoBack={() => navigate(-1)}
      bookmarkedEventIds={bookmarkedEventIds}
      rsvpedEventIds={rsvpedEventIds}
      onBookmarkChange={onBookmarkChange}
      onRSVPChange={onRSVPChange}
    />
  )
}

function EventForumRoute({
  events,
  onNavigate,
  username,
}: {
  events: any[]
  onNavigate: (page: string, data?: NavigateData) => void
  username: string
}) {
  const { eventId } = useParams<{ eventId?: string }>()
  const navigate = useNavigate()

  if (!eventId) {
    return <Navigate to="../explore" replace />
  }

  const numericId = Number(eventId)
  if (Number.isNaN(numericId)) {
    return <Navigate to="../explore" replace />
  }

  return (
    <EventForumPage
      eventId={numericId}
      events={events}
      onGoBack={() => navigate(-1)}
      onNavigate={onNavigate}
      username={username}
    />
  )
}

// ---- Router wrapper ----
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Marketing landing as entry point */}
        <Route path="/" element={<MarketingScreen />} />
        {/* 3D landing experience */}
        <Route path="/immersive" element={<ThreeLanding />} />
        {/* The page shown inside the monitor iframe */}
        <Route path="/home" element={<HomePreview />} />
        {/* Your existing app (state-based navigation) lives under /app */}
        <Route path="/app/*" element={<ShellApp />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function MarketingScreen() {
  const navigate = useNavigate();
  return (
    <MarketingLandingPage
      onExplore={() => navigate('/immersive')}
      onDemo={() => navigate('/immersive')}
    />
  );
}
