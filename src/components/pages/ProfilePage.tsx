import ProfileHeader from "../features/profile/ProfileHeader";
import ProfileStats from "../features/profile/ProfileStats";
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import EventsGrid from "../features/profile/EventsGrid";
import Footer from "../shared/Footer";

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Header } from '../Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Bookmark, CheckCircle, ArrowLeft, History } from 'lucide-react';

interface ProfilePageProps {
  onNavigate: (page: string, data?: any) => void;
  onGoBack: () => void;
  events: any[];
  bookmarkedEventIds: number[];
  rsvpedEventIds: number[];
  onBookmarkChange: (eventId: number, isBookmarked: boolean) => void;
  onRSVPChange: (eventId: number, isRSVPed: boolean) => void;
  currentUser?: any;
}

export function ProfilePage({
  onNavigate,
  onGoBack,
  events,
  bookmarkedEventIds,
  rsvpedEventIds,
  onBookmarkChange,
  onRSVPChange,
  currentUser,
}: ProfilePageProps & { events: any[] }) {
  const [activeTab, setActiveTab] = useState('bookmarked');

  // Local user display state (prefers ints from auth/db but editable locally)
  const [userName, setUserName] = useState<string>(currentUser?.displayName || `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim() || 'Alex Chen');
  const [userEmail, setUserEmail] = useState<string>(currentUser?.email || 'alex.chen@example.com');
  const [memberSince, setMemberSince] = useState<string>(() => {
    if (currentUser?.createdAt) {
      try {
        const d = new Date(currentUser.createdAt);
        return d.toLocaleString(undefined, { month: 'long', year: 'numeric' });
      } catch { /* fallthrough */ }
    }
    return 'January 2025';
  });

  const user = { name: userName, email: userEmail, memberSince };

  // Filter events based on bookmarked and RSVP'd IDs
  const bookmarkedEvents = events.filter(e => bookmarkedEventIds.includes(e.id) && !e.isPast);
  const rsvpedEvents = events.filter(e => rsvpedEventIds.includes(e.id) && !e.isPast);
  const pastEvents = events.filter(e => rsvpedEventIds.includes(e.id) && e.isPast);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out failed', e);
    }
    // navigate to login page
    onNavigate('login');
  };


  // Listen for auth state changes so the page updates after signup/login
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;
      // update from auth first
      setUserName(u.displayName || userName);
      setUserEmail(u.email || userEmail);

      // then try to enrich from Firestore user doc
      try {
        const snap = await getDoc(doc(db, 'users', u.uid));
        if (!snap.exists()) return;
        const data: any = snap.data();
        if (data.firstName || data.lastName) setUserName(`${data.firstName || ''} ${data.lastName || ''}`.trim());
        if (data.createdAt) {
          const ts = data.createdAt;
          const date = typeof ts.toDate === 'function' ? ts.toDate() : new Date(ts);
          setMemberSince(date.toLocaleString(undefined, { month: 'long', year: 'numeric' }));
        }
      } catch (err) {
        console.warn('Failed to read user doc', err);
      }
    });
    return () => unsub();
  }, []);

  // Sync when parent-provided currentUser prop changes (e.g., after login)
  useEffect(() => {
    if (!currentUser) return;
    if (currentUser.displayName) setUserName(currentUser.displayName);
    else if (currentUser.firstName || currentUser.lastName) setUserName(`${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim());
    if (currentUser.email) setUserEmail(currentUser.email);
  }, [currentUser]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-[#faf7ff] to-white">
      <style>{`
        [data-slot="tabs-trigger"] {
          padding: 0.5rem !important;
          height: 40px !important;
          min-height: 40px !important;
          max-height: 40px !important;
        }
        @media (min-width: 640px) {
          [data-slot="tabs-trigger"] {
            padding: 0.625rem 1rem !important;
            height: 40px !important;
            min-height: 40px !important;
            max-height: 40px !important;
          }
        }
        @media (max-width: 639px) {
          html {
            font-size: 14px;
          }
        }
      `}</style>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-[-160px] h-64 bg-gradient-to-b from-pink-100/40 via-purple-100/20 to-transparent" />
      </div>

      <Header currentPage="profile" onNavigate={onNavigate} />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-10 sm:py-16 max-w-5xl">
        {/* Back Button - Sticky */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -4 }}
          onClick={onGoBack}
          className="sticky top-[84px] sm:top-[96px] z-40 flex items-center gap-1.5 sm:gap-2 text-pink-500 hover:text-pink-600 bg-white/90 backdrop-blur-sm rounded-full shadow-md w-fit px-2.5 sm:px-4 py-2 text-xs sm:text-base"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Back</span>
        </motion.button>

        <div className="grid gap-6 sm:gap-8">
          {/* Profile Header */}
          <ProfileHeader
            name={user.name}
            email={user.email}
            memberSince={user.memberSince}
            onSignOut={handleSignOut}
            onSettings={() => onNavigate('settings')}
          />

          {/* Profile Stats */}
          <ProfileStats
            bookmarkedCount={bookmarkedEvents.length}
            upcomingCount={rsvpedEvents.length}
            pastCount={pastEvents.length}
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-6 sm:mb-10 bg-white border border-gray-100 rounded-3xl !p-1.5 sm:!p-2 shadow-sm !h-auto gap-1 sm:!gap-1.5">
              <TabsTrigger
                value="bookmarked"
                className="!rounded-2xl data-[state=active]:bg-pink-50 data-[state=active]:shadow-sm data-[state=active]:text-pink-600 !text-[11px] sm:!text-sm !flex !items-center !justify-center !min-h-0 !border-0 !font-medium text-gray-600"
                style={{ padding: '0.5rem', height: '40px', display: 'flex', gap: '0.375rem', alignItems: 'center' }}
              >
                <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">Bookmarked</span>
              </TabsTrigger>
              <TabsTrigger
                value="upcoming"
                className="!rounded-2xl data-[state=active]:bg-emerald-50 data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 !text-[11px] sm:!text-sm !flex !items-center !justify-center !min-h-0 !border-0 !font-medium text-gray-600"
                style={{ padding: '0.5rem', height: '40px', display: 'flex', gap: '0.375rem', alignItems: 'center' }}
              >
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">Upcoming</span>
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="!rounded-2xl data-[state=active]:bg-slate-50 data-[state=active]:shadow-sm data-[state=active]:text-slate-600 !text-[11px] sm:!text-sm !flex !items-center !justify-center !min-h-0 !border-0 !font-medium text-gray-600"
                style={{ padding: '0.5rem', height: '40px', display: 'flex', gap: '0.375rem', alignItems: 'center' }}
              >
                <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">Past</span>
              </TabsTrigger>
            </TabsList>


          {/* Bookmarked Events */}
          <TabsContent value="bookmarked">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-8 shadow-sm"
            >
              <div className="mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-semibold text-gray-900">Bookmarked Events</h2>
                <p className="text-xs sm:text-base text-gray-600">Events you've saved for later</p>
              </div>

              {bookmarkedEvents.length > 0 ? (
                <EventsGrid
                  events={[...bookmarkedEvents].sort(
                    (a, b) =>
                      new Date(a.deadline || a.date).getTime() -
                      new Date(b.deadline || b.date).getTime()
                  )}
                  onEventClick={(id) => onNavigate("event-info", { eventId: id })}
                  bookmarkedEventIds={bookmarkedEventIds}
                  rsvpedEventIds={rsvpedEventIds}
                  onBookmarkChange={onBookmarkChange}
                  onRSVPChange={onRSVPChange}
                />
              ) : (
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center border border-dashed border-gray-200">
                  <Bookmark className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300" />
                  <p className="text-sm sm:text-xl text-gray-500">No bookmarked events yet</p>
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Upcoming RSVP'd Events */}
          <TabsContent value="upcoming">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-8 shadow-sm"
              >
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-2xl font-semibold text-gray-900">Upcoming Events</h2>
                  <p className="text-xs sm:text-base text-gray-600">Events you've RSVP'd to</p>
                </div>

                {rsvpedEvents.length > 0 ? (
                  <EventsGrid
                    events={[...rsvpedEvents].sort(
                      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
                    )}
                    onEventClick={(id) => onNavigate("event-info", { eventId: id })}
                    bookmarkedEventIds={bookmarkedEventIds}
                    rsvpedEventIds={rsvpedEventIds}
                    onBookmarkChange={onBookmarkChange}
                    onRSVPChange={onRSVPChange}
                  />
                ) : (
                  <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center border border-dashed border-gray-200">
                    <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300" />
                    <p className="text-sm sm:text-xl text-gray-500">No upcoming events</p>
                  </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Past Events */}
          <TabsContent value="past">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-8 shadow-sm"
            >
              <div className="mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-semibold text-gray-900">Past Events</h2>
                <p className="text-xs sm:text-base text-gray-600">Events you've already attended</p>
              </div>

              {pastEvents.length > 0 ? (
                <EventsGrid
                  events={[...pastEvents].sort(
                    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                  )}
                  onEventClick={(id) => onNavigate("event-info", { eventId: id })}
                  bookmarkedEventIds={bookmarkedEventIds}
                  rsvpedEventIds={rsvpedEventIds}
                  onBookmarkChange={onBookmarkChange}
                  onRSVPChange={onRSVPChange}
                />
              ) : (
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center border border-dashed border-gray-200">
                  <History className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300" />
                  <p className="text-sm sm:text-xl text-gray-500">No past events yet</p>
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
