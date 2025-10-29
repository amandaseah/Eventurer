import React from 'react';
import { motion } from "motion/react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

export default function AccountPanel({
  isEditing,
  name,
  email,
  memberSince,
  onChangeName,
  onChangeEmail,
  onSave,
  onCancel,
}: {
  isEditing: boolean;
  name: string;
  email: string;
  memberSince: string;
  onChangeName: (v: string) => void;
  onChangeEmail: (v: string) => void;
  onSave: (changes?: { firstName?: string; lastName?: string; email?: string }) => void;
  onCancel: () => void;
}) {
  // split name into first/last for local editing
  const [firstName, setFirstName] = React.useState(() => {
    if (!name) return '';
    const parts = name.split(' ');
    return parts.shift() || '';
  });
  const [lastName, setLastName] = React.useState(() => {
    if (!name) return '';
    const parts = name.split(' ');
    parts.shift();
    return parts.join(' ');
  });

  React.useEffect(() => {
    // update local fields when name prop changes
    if (name) {
      const parts = name.split(' ');
      setFirstName(parts.shift() || '');
      parts.shift();
      setLastName(parts.join(' '));
    }
  }, [name]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-md"
    >
      <h2 className="text-xl sm:text-2xl mb-4 sm:mb-6">Account Information</h2>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">First name</label>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="rounded-2xl" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Last name</label>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="rounded-2xl" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Email</label>
            <Input value={email} onChange={(e) => onChangeEmail(e.target.value)} className="rounded-2xl" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Member Since</label>
            <p className="text-lg text-gray-400">{memberSince}</p>
          </div>
          <div className="pt-4 flex gap-3">
            <Button
              onClick={() => {
                // propagate structured changes to parent
                onChangeName(`${firstName} ${lastName}`.trim());
                onSave({ firstName: firstName || undefined, lastName: lastName || undefined, email });
              }}
              className="px-6 py-3 bg-purple-500 text-white rounded-2xl hover:bg-purple-600 transition-all"
            >
              Save Changes
            </Button>
            <Button onClick={onCancel} variant="outline" className="px-6 py-3 rounded-2xl">Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Full Name</label>
            <p className="text-lg">{name}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <p className="text-lg">{email}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Member Since</label>
            <p className="text-lg">{memberSince}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}