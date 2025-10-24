import { useState, useEffect} from 'react';
import { LoginPage } from './components/pages/LoginPage';
import { SignupPage } from './components/pages/SignupPage';
import { LandingPage } from './components/pages/LandingPage';
import { MoodResultsPage } from './components/pages/MoodResultsPage';
import { EventExplorePage } from './components/pages/EventExplorePage';
import { EventInfoPage } from './components/pages/EventInfoPage';
import { EventForumPage } from './components/pages/EventForumPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { CountdownWidget } from './components/CountdownWidget';
import { Toaster } from './components/ui/sonner';
import { sanityCheckMe, fetchEventbriteEventsForMe } from './lib/eventbriteService';
import { categorizeEvent } from './lib/eventCategoriser';

// import { events } from './lib/mockData';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [pageData, setPageData] = useState<PageData>({});
  const [navigationHistory, setNavigationHistory] = useState<Page[]>(['landing']);
  const [bookmarkedEventIds, setBookmarkedEventIds] = useState<number[]>([1, 2, 3, 4]);
  const [rsvpedEventIds, setRsvpedEventIds] = useState<number[]>([3, 4, 7]);

  // eventbrite events fetch!
  const [fetchedEvents, setFetchedEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);


  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingEvents(true);
        await sanityCheckMe();
        const data = await fetchEventbriteEventsForMe();
        const enriched = data.map((e: any) => {
        const { mood, category } = categorizeEvent(
          e.name?.text || e.name || "",
          e.description?.text || e.description || "",
          e.category?.name || e.category
        );
        return { ...e, mood, category };
      });
        setFetchedEvents(enriched);
        if (mounted) setFetchedEvents(data);
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

  const showCountdownWidget = currentPage !== 'login' && (bookmarkedEvents.length > 0 || rsvpedEvents.length > 0);

  return (
    <div className="size-full">
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
        {/* 3D landing at root */}
        <Route path="/" element={<ThreeLanding />} />
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
