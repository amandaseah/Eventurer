import ProfileHeader from "../features/profile/ProfileHeader";
import AccountPanel from "../features/profile/AccountPanel";
import { auth, db } from '../../lib/firebase';
import { updateProfile, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import SettingsPanel from "../features/profile/SettingsPanel";
import EventsGrid from "../features/profile/EventsGrid";

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Header } from '../Header';
// import { events } from '../../lib/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { User, Bookmark, CheckCircle, Clock, Settings, ArrowLeft } from 'lucide-react';

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
  const [isEditingAccount, setIsEditingAccount] = useState(false);

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
  const pastEvents = events.filter(e => e.isPast && rsvpedEventIds.includes(e.id));

  const handleSaveProfile = () => {
    setIsEditingAccount(false);
    // If we have an authenticated user, persist changes to Firebase
    // Otherwise this remains a local-only change
  };

  const handleSaveProfileWithData = async (changes?: { firstName?: string; lastName?: string; email?: string }) => {
    setIsEditingAccount(false);
    // Update local preview
    if (changes?.firstName || changes?.lastName) {
      setUserName(`${changes?.firstName || ''} ${changes?.lastName || ''}`.trim());
    }
    if (changes?.email) setUserEmail(changes.email);

    // Persist to Firebase if logged in
    try {
      const u = auth.currentUser;
      if (!u) return;

      const displayName = `${changes?.firstName || u.displayName || ''} ${changes?.lastName || ''}`.trim() || u.displayName || undefined;
      if (displayName) await updateProfile(u, { displayName });

      await setDoc(doc(db, 'users', u.uid), {
        firstName: changes?.firstName ?? null,
        lastName: changes?.lastName ?? null,
        displayName: displayName ?? null,
        email: changes?.email ?? u.email ?? null,
      }, { merge: true });
    } catch (err) {
      console.warn('Failed to persist profile changes', err);
    }
  };

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
    <div className="min-h-screen">
      <Header currentPage="profile" onNavigate={onNavigate} />

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back Button - Fixed */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -4 }}
          onClick={onGoBack}
          className="fixed top-20 sm:top-24 left-4 sm:left-6 z-50 flex items-center gap-1.5 sm:gap-2 text-purple-600 hover:text-purple-700 bg-white/90 backdrop-blur-sm px-2.5 sm:px-4 py-2 rounded-full shadow-md text-xs sm:text-base"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Back</span>
        </motion.button>

        {/* Profile Header */}
        <ProfileHeader
          name={user.name}
          email={user.email}
          memberSince={user.memberSince}
          onSignOut={handleSignOut}
        />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="md:block flex flex-row gap-3">
            <TabsList className="!flex !flex-col md:!grid w-auto md:w-full md:grid-cols-5 mb-4 md:mb-8 bg-white rounded-2xl !p-1 shadow-md !h-auto !gap-0.5 shrink-0">
              <TabsTrigger
                value="bookmarked"
                className="!rounded-lg data-[state=active]:bg-purple-100 !py-2 md:!py-1.5 !px-2 md:!px-1 !text-xs md:!text-[10px] lg:!text-xs !flex !items-center !justify-start md:!justify-center !gap-1.5 md:!gap-0.5 !h-auto !min-h-0 !border-0"
              >
                <Bookmark className="w-3.5 h-3.5 md:w-3 md:h-3 shrink-0" />
                <span className="md:truncate">Bookmarked</span>
              </TabsTrigger>
              <TabsTrigger
                value="upcoming"
                className="!rounded-lg data-[state=active]:bg-green-100 !py-2 md:!py-1.5 !px-2 md:!px-1 !text-xs md:!text-[10px] lg:!text-xs !flex !items-center !justify-start md:!justify-center !gap-1.5 md:!gap-0.5 !h-auto !min-h-0 !border-0"
              >
                <CheckCircle className="w-3.5 h-3.5 md:w-3 md:h-3 shrink-0" />
                <span className="md:truncate">Upcoming</span>
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="!rounded-lg data-[state=active]:bg-gray-100 !py-2 md:!py-1.5 !px-2 md:!px-1 !text-xs md:!text-[10px] lg:!text-xs !flex !items-center !justify-start md:!justify-center !gap-1.5 md:!gap-0.5 !h-auto !min-h-0 !border-0"
              >
                <Clock className="w-3.5 h-3.5 md:w-3 md:h-3 shrink-0" />
                <span className="md:truncate">Past</span>
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="!rounded-lg data-[state=active]:bg-blue-100 !py-2 md:!py-1.5 !px-2 md:!px-1 !text-xs md:!text-[10px] lg:!text-xs !flex !items-center !justify-start md:!justify-center !gap-1.5 md:!gap-0.5 !h-auto !min-h-0 !border-0"
              >
                <User className="w-3.5 h-3.5 md:w-3 md:h-3 shrink-0" />
                <span className="md:truncate">Account</span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="!rounded-lg data-[state=active]:bg-orange-100 !py-2 md:!py-1.5 !px-2 md:!px-1 !text-xs md:!text-[10px] lg:!text-xs !flex !items-center !justify-start md:!justify-center !gap-1.5 md:!gap-0.5 !h-auto !min-h-0 !border-0"
              >
                <Settings className="w-3.5 h-3.5 md:w-3 md:h-3 shrink-0" />
                <span className="md:truncate">Settings</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 min-w-0 w-full md:w-auto">
          {/* Bookmarked Events */}
          <TabsContent value="bookmarked">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl mb-2">Bookmarked Events</h2>
                <p className="text-sm sm:text-base text-gray-600">Events you've saved for later</p>
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
                <div className="bg-white rounded-3xl p-12 text-center">
                  <Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-xl text-gray-500">No bookmarked events yet</p>
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Upcoming RSVP'd Events */}
          <TabsContent value="upcoming">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl mb-2">Upcoming Events</h2>
                  <p className="text-sm sm:text-base text-gray-600">Events you've RSVP'd to</p>
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
                  <div className="bg-white rounded-3xl p-12 text-center">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-xl text-gray-500">No upcoming events</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>

          {/* Past Events */}
          <TabsContent value="past">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl mb-2">Past Events</h2>
                <p className="text-sm sm:text-base text-gray-600">Events you've attended</p>
              </div>

              {pastEvents.length > 0 ? (
                <EventsGrid
                  events={pastEvents}
                  onEventClick={(id) => onNavigate("event-info", { eventId: id })}
                  bookmarkedEventIds={bookmarkedEventIds}
                  rsvpedEventIds={rsvpedEventIds}
                  onBookmarkChange={onBookmarkChange}
                  onRSVPChange={onRSVPChange}
                />
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center">
                  <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-xl text-gray-500">No past events</p>
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Account Information */}
          <TabsContent value="account">
            <AccountPanel
              isEditing={isEditingAccount}
              name={userName}
              email={userEmail}
              memberSince={user.memberSince}
              onChangeName={setUserName}
              onChangeEmail={setUserEmail}
              onSave={handleSaveProfileWithData}
              onCancel={() => setIsEditingAccount(false)}
            />
            {!isEditingAccount && (
              <div className="mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditingAccount(true)}
                  className="px-6 py-3 bg-purple-100 text-purple-700 rounded-2xl hover:bg-purple-200 transition-all"
                >
                  Edit Profile
                </motion.button>
              </div>
            )}
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <SettingsPanel />
          </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
