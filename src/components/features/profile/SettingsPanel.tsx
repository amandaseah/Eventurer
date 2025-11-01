import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { auth, db } from "../../../lib/firebase";
import { updateProfile, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import { User, Trash2 } from "lucide-react";

export default function SettingsPanel() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  // Load user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      setEmail(user.email || '');

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
        }
      } catch (err) {
        console.warn('Failed to load user data', err);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSaveAccountSettings = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Please sign in to save account settings');
        return;
      }

      const displayName = `${firstName} ${lastName}`.trim();
      if (displayName) {
        await updateProfile(user, { displayName });
      }

      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        displayName,
        email: user.email,
      }, { merge: true });

      toast.success('Account settings saved successfully');
    } catch (err: any) {
      console.error('Failed to save account settings', err);
      toast.error('Failed to save account settings');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion is not yet implemented');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Account Information */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-pink-500" />
          <h2 className="text-lg sm:text-2xl font-semibold">Account Information</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveAccountSettings}
            className="px-6 py-3 bg-pink-500 text-white rounded-2xl hover:bg-pink-600 transition-all font-semibold"
          >
            Save Changes
          </motion.button>
        </div>
      </div>

      {/* Delete Account */}
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4">
          <Trash2 className="w-5 h-5 text-red-500" />
          <h2 className="text-lg sm:text-2xl font-semibold text-red-700">Delete Account</h2>
        </div>
        
        <p className="text-gray-700 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDeleteAccount}
          className="px-6 py-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all font-semibold"
        >
          Delete Account
        </motion.button>
      </div>
    </motion.div>
  );
}