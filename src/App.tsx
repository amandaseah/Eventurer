import { useEffect, useState } from 'react';
import { LoginPage } from './components/pages/LoginPage';
import { SignupPage } from './components/pages/SignupPage';
import { LandingPage } from './components/pages/LandingPage';
import { MarketingLandingPage } from './components/pages/MarketingLandingPage';
import { MoodResultsPage } from './components/pages/MoodResultsPage';
import { EventExplorePage } from './components/pages/EventExplorePage';
import { EventInfoPage } from './components/pages/EventInfoPage';
import { EventForumPage } from './components/pages/EventForumPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { CountdownWidget } from './components/CountdownWidget';
import { Toaster } from './components/ui/sonner';
import { events } from './lib/mockData';
import { loadGoogleMapsScript } from './lib/loadGoogleMaps';
import { fetchEventbriteEvents, fetchEventbriteEventsForMe, sanityCheckMe } from './lib/eventbriteService';
import { categorizeEvent } from './lib/eventCategoriser';

import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
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
  | 'profile';

interface PageData {
  mood?: string;
  eventId?: number;
}

function ShellApp() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [pageData, setPageData] = useState<PageData>({});
  const [navigationHistory, setNavigationHistory] = useState<Page[]>(['login']);
  const [bookmarkedEventIds, setBookmarkedEventIds] = useState<number[]>([1, 2, 3, 4]);
  const [rsvpedEventIds, setRsvpedEventIds] = useState<number[]>([3, 4, 7]);

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


  const handleNavigate: (page: string, data?: any) => void = (page, data) => {
    setCurrentPage(page as Page);
    setNavigationHistory(prev => [...prev, page as Page]);
    if (data) setPageData(data as PageData);
  };

  const handleGoBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remove current page
      const previousPage = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setCurrentPage(previousPage);
    } else {
      // Fallback to explore if no history
      handleNavigate('explore');
    }
  };

  const handleBookmarkChange = (eventId: number, isBookmarked: boolean) => {
    if (isBookmarked) {
      setBookmarkedEventIds([...bookmarkedEventIds, eventId]);
    } else {
      setBookmarkedEventIds(bookmarkedEventIds.filter(id => id !== eventId));
    }
  };

  const handleRSVPChange = (eventId: number, isRSVPed: boolean) => {
    if (isRSVPed) {
      setRsvpedEventIds([...rsvpedEventIds, eventId]);
    } else {
      setRsvpedEventIds(rsvpedEventIds.filter(id => id !== eventId));
    }
  };

  const showCountdownWidget =
    currentPage !== 'login' &&
    (bookmarkedEvents.length > 0 || rsvpedEvents.length > 0);

  return (
    <div className="size-full bg-white">
      {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
      {currentPage === 'landing' && (
        <LandingPage
          onNavigate={handleNavigate}
          events={fetchedEvents}
          loading={loadingEvents}
        />
      )}
      {currentPage === 'mood-results' && pageData.mood && (
        <MoodResultsPage 
        mood={pageData.mood}
        events={fetchedEvents}
        onNavigate={handleNavigate}
        bookmarkedEventIds={bookmarkedEventIds}
        rsvpedEventIds={rsvpedEventIds}
        onBookmarkChange={handleBookmarkChange}
        onRSVPChange={handleRSVPChange}
         />
      )}

      {currentPage === 'explore' && (
      <EventExplorePage 
        events={fetchedEvents}
        onNavigate={handleNavigate}
        bookmarkedEventIds={bookmarkedEventIds}
        rsvpedEventIds={rsvpedEventIds}
        onBookmarkChange={handleBookmarkChange}
        onRSVPChange={handleRSVPChange}
        />
      )}

      {currentPage === 'event-info' && pageData.eventId && (
        <EventInfoPage 
          eventId={pageData.eventId} 
          events={fetchedEvents}
          onNavigate={handleNavigate}
          onGoBack={handleGoBack}
          bookmarkedEventIds={bookmarkedEventIds}
          rsvpedEventIds={rsvpedEventIds}
          onBookmarkChange={handleBookmarkChange}
          onRSVPChange={handleRSVPChange}
        />
      )}
      {currentPage === 'event-forum' && pageData.eventId && (
        <EventForumPage eventId={pageData.eventId} onNavigate={handleNavigate} />
      )}
      
      {currentPage === 'profile' && (
        <ProfilePage 
          events={fetchedEvents}
          onNavigate={handleNavigate}
          onGoBack={handleGoBack}
          bookmarkedEventIds={bookmarkedEventIds}
          rsvpedEventIds={rsvpedEventIds}
          onBookmarkChange={handleBookmarkChange}
          onRSVPChange={handleRSVPChange}
        />
      )}
      
      {showCountdownWidget && (
        <CountdownWidget
          bookmarkedEvents={bookmarkedEvents}
          upcomingEvents={rsvpedEvents}
          onEventClick={(id) => handleNavigate('event-info', { eventId: id })}
        />
      )}
      
      <Toaster />
    </div>
  );
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
        <Route path="/app" element={<ShellApp />} />
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
