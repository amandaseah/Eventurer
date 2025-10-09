import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from '../Header';
import { EventCard } from '../EventCard';
import { events } from '../../lib/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { User, Bookmark, CheckCircle, Clock, Settings, ArrowLeft } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface ProfilePageProps {
  onNavigate: (page: string, data?: any) => void;
  onGoBack: () => void;
  bookmarkedEventIds: number[];
  rsvpedEventIds: number[];
  onBookmarkChange: (eventId: number, isBookmarked: boolean) => void;
  onRSVPChange: (eventId: number, isRSVPed: boolean) => void;
}

export function ProfilePage({ 
  onNavigate, 
  onGoBack,
  bookmarkedEventIds, 
  rsvpedEventIds, 
  onBookmarkChange,
  onRSVPChange 
}: ProfilePageProps) {
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-md mb-8"
        >
          <div className="flex items-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200 flex items-center justify-center text-white text-3xl"
            >
              {user.name.split(' ').map(n => n.charAt(0)).join('')}
            </motion.div>
            <div>
              <h1 className="text-3xl mb-1">{user.name}</h1>
              <p className="text-gray-600 mb-1">{user.email}</p>
              <p className="text-sm text-gray-500">Member since {user.memberSince}</p>
            </div>
          </div>
        </motion.div>

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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl mb-2">Bookmarked Events</h2>
                <p className="text-gray-600">Events you've saved for later</p>
              </div>

              {bookmarkedEvents.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {bookmarkedEvents
                      .sort((a, b) => new Date(a.deadline || a.date).getTime() - new Date(b.deadline || b.date).getTime())
                      .map((event, idx) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ delay: idx * 0.05 }}
                          layout
                        >
                          <EventCard 
                            event={event} 
                            onEventClick={(id) => onNavigate('event-info', { eventId: id })}
                            isBookmarkedInitially={true}
                            isRSVPedInitially={rsvpedEventIds.includes(event.id)}
                            onBookmarkChange={onBookmarkChange}
                            onRSVPChange={onRSVPChange}
                          />
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl mb-2">Upcoming Events</h2>
                <p className="text-gray-600">Events you've RSVP'd to</p>
              </div>

              {rsvpedEvents.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rsvpedEvents
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((event, idx) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <EventCard 
                          event={event} 
                          onEventClick={(id) => onNavigate('event-info', { eventId: id })}
                          isBookmarkedInitially={bookmarkedEventIds.includes(event.id)}
                          isRSVPedInitially={true}
                          onBookmarkChange={onBookmarkChange}
                          onRSVPChange={onRSVPChange}
                        />
                      </motion.div>
                    ))}
                </div>
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-6">
                <h2 className="text-2xl mb-2">Past Events</h2>
                <p className="text-gray-600">Events you've attended</p>
              </div>

              {pastEvents.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastEvents.map((event, idx) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <EventCard event={event} onEventClick={(id) => onNavigate('event-info', { eventId: id })} />
                    </motion.div>
                  ))}
                </div>
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-md"
            >
              <h2 className="text-2xl mb-6">Account Information</h2>
              
              {isEditingAccount ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Full Name</label>
                    <Input 
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="rounded-2xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Email</label>
                    <Input 
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="rounded-2xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Member Since</label>
                    <p className="text-lg text-gray-400">{user.memberSince}</p>
                  </div>
                  <div className="pt-4 flex gap-3">
                    <Button
                      onClick={handleSaveProfile}
                      className="px-6 py-3 bg-purple-500 text-white rounded-2xl hover:bg-purple-600 transition-all"
                    >
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => setIsEditingAccount(false)}
                      variant="outline"
                      className="px-6 py-3 rounded-2xl"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                    <p className="text-lg">{user.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                    <p className="text-lg">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Member Since</label>
                    <p className="text-lg">{user.memberSince}</p>
                  </div>
                  <div className="pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsEditingAccount(true)}
                      className="px-6 py-3 bg-purple-100 text-purple-700 rounded-2xl hover:bg-purple-200 transition-all"
                    >
                      Edit Profile
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-md"
            >
              <h2 className="text-2xl mb-6">Settings & Preferences</h2>
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <h3 className="mb-2">Email Notifications</h3>
                  <p className="text-sm text-gray-600 mb-3">Receive updates about events and recommendations</p>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                    <span>Event reminders</span>
                  </label>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <h3 className="mb-2">Mood Preferences</h3>
                  <p className="text-sm text-gray-600 mb-3">Your favorite event types</p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                      <span>Chill & Relax 🌿</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded" />
                      <span>Active ⚡</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                      <span>Social 🎉</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded" />
                      <span>Educational 📚</span>
                    </label>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <h3 className="mb-2">Privacy</h3>
                  <p className="text-sm text-gray-600 mb-3">Control your data and visibility</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-all"
                  >
                    Manage Privacy Settings
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
