import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { Edit, Save } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/me');
        const profile = response.data.data;
        setUser(profile);
        setFormData({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.email || '',
          phone: profile.phone || '',
          address: profile.address || '',
        });
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      const response = await api.put('/auth/updateprofile', formData);
      setUser(response.data.data);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account information</p>
        </div>
        <button type="button" onClick={() => setEditing((value) => !value)} className="btn-secondary flex items-center gap-2">
          <Edit className="w-4 h-4" /> {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="card">
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            ['firstName', 'First Name'],
            ['lastName', 'Last Name'],
            ['email', 'Email'],
            ['phone', 'Phone'],
            ['address', 'Address'],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
              <input
                type={key === 'email' ? 'email' : 'text'}
                className="input-field"
                value={formData[key] || ''}
                onChange={(event) => setFormData({ ...formData, [key]: event.target.value })}
                disabled={!editing}
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
            <input className="input-field bg-gray-100 dark:bg-gray-700" value={user?.role || ''} disabled />
          </div>
          {editing && (
            <div className="md:col-span-2">
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
