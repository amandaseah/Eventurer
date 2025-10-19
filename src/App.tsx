import { useState } from 'react';
import { LoginPage } from './components/pages/LoginPage';
import { LandingPage } from './components/pages/LandingPage';
import { MoodResultsPage } from './components/pages/MoodResultsPage';
import { EventExplorePage } from './components/pages/EventExplorePage';
import { EventInfoPage } from './components/pages/EventInfoPage';
import { EventForumPage } from './components/pages/EventForumPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { CountdownWidget } from './components/CountdownWidget';
import { Toaster } from './components/ui/sonner';
import { events } from './lib/mockData';

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
  

  const handleNavigate = (page: Page, data?: PageData) => {
    setCurrentPage(page);
    setNavigationHistory(prev => [...prev, page]);
    if (data) {
      setPageData(data);
    }
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

  const bookmarkedEvents = events.filter(e => bookmarkedEventIds.includes(e.id) && !e.isPast);
  const rsvpedEvents = events.filter(e => rsvpedEventIds.includes(e.id) && !e.isPast);

  const showCountdownWidget = currentPage !== 'login' && (bookmarkedEvents.length > 0 || rsvpedEvents.length > 0);

  return (
    <div className="size-full">
      {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
      {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
      {currentPage === 'mood-results' && pageData.mood && (
        <MoodResultsPage 
        mood={pageData.mood}
        onNavigate={handleNavigate}
        bookmarkedEventIds={bookmarkedEventIds}
        rsvpedEventIds={rsvpedEventIds}
        onBookmarkChange={handleBookmarkChange}
        onRSVPChange={handleRSVPChange}
         />
      )}
      {currentPage === 'explore' && (
        <EventExplorePage 
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
