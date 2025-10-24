import ProfileHeader from "../features/profile/ProfileHeader";
import AccountPanel from "../features/profile/AccountPanel";
import SettingsPanel from "../features/profile/SettingsPanel";
import EventsGrid from "../features/profile/EventsGrid";


import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from '../Header';
import { EventCard } from '../features/event/EventCard';
// import { events } from '../../lib/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { User, Bookmark, CheckCircle, Clock, Settings, ArrowLeft } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface ProfilePageProps {
  onNavigate: (page: string, data?: any) => void;
  onGoBack: () => void;
  events: any[];
  bookmarkedEventIds: number[];
  rsvpedEventIds: number[];
  onBookmarkChange: (eventId: number, isBookmarked: boolean) => void;
  onRSVPChange: (eventId: number, isRSVPed: boolean) => void;
}

export function ProfilePage({ 
  onNavigate, 
  onGoBack,
  events,
  bookmarkedEventIds, 
  rsvpedEventIds, 
  onBookmarkChange,
  onRSVPChange 
}: ProfilePageProps & { events: any[] }) {
  const [activeTab, setActiveTab] = useState('bookmarked');
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [userName, setUserName] = useState('Alex Chen');
  const [userEmail, setUserEmail] = useState('alex.chen@example.com');

  // Mock user data
  const user = {
    name: userName,
    email: userEmail,
    memberSince: 'January 2025',
  };

  // Filter events based on bookmarked and RSVP'd IDs
  const bookmarkedEvents = events.filter(e => bookmarkedEventIds.includes(e.id) && !e.isPast);
  const rsvpedEvents = events.filter(e => rsvpedEventIds.includes(e.id) && !e.isPast);
  const pastEvents = events.filter(e => e.isPast && rsvpedEventIds.includes(e.id));

  const handleSaveProfile = () => {
    setIsEditingAccount(false);
    // In a real app, this would save to backend
  };

  return (
    <div className="min-h-screen">
      <Header currentPage="profile" onNavigate={onNavigate} />

      <div className="container mx-auto px-6 py-12">
        {/* Back Button - Fixed */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -4 }}
          onClick={onGoBack}
          className="fixed top-24 left-6 z-50 flex items-center gap-2 text-purple-600 hover:text-purple-700 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </motion.button>

        {/* Profile Header */}
        <ProfileHeader
          name={user.name}
          email={user.email}
          memberSince={user.memberSince}
        />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-white rounded-2xl p-1 shadow-md h-auto">
            <TabsTrigger 
              value="bookmarked" 
              className="rounded-xl data-[state=active]:bg-purple-100 py-3 data-[state=active]:rounded-l-xl data-[state=active]:rounded-r-xl first:data-[state=active]:rounded-l-2xl last:data-[state=active]:rounded-r-2xl"
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Bookmarked
            </TabsTrigger>
            <TabsTrigger 
              value="upcoming" 
              className="rounded-xl data-[state=active]:bg-green-100 py-3"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Upcoming
            </TabsTrigger>
            <TabsTrigger 
              value="past" 
              className="rounded-xl data-[state=active]:bg-gray-100 py-3"
            >
              <Clock className="w-4 h-4 mr-2" />
              Past Events
            </TabsTrigger>
            <TabsTrigger 
              value="account" 
              className="rounded-xl data-[state=active]:bg-blue-100 py-3"
            >
              <User className="w-4 h-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="rounded-xl data-[state=active]:bg-orange-100 py-3 data-[state=active]:rounded-l-xl data-[state=active]:rounded-r-xl first:data-[state=active]:rounded-l-2xl last:data-[state=active]:rounded-r-2xl"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Bookmarked Events */}
          <TabsContent value="bookmarked">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6">
                <h2 className="text-2xl mb-2">Bookmarked Events</h2>
                <p className="text-gray-600">Events you've saved for later</p>
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
                  <h2 className="text-2xl mb-2">Upcoming Events</h2>
                  <p className="text-gray-600">Events you've RSVP'd to</p>
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
                <h2 className="text-2xl mb-2">Past Events</h2>
                <p className="text-gray-600">Events you've attended</p>
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
              onSave={() => {
                setIsEditingAccount(false);
                // TODO: save to backend if needed
              }}
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

        </Tabs>
      </div>
    </div>
  );
}
