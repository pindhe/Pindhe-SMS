import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { Save } from 'lucide-react';

const defaults = {
  schoolName: 'Pindhe SMS',
  schoolAddress: '',
  schoolPhone: '',
  schoolEmail: '',
  academicYear: new Date().getFullYear().toString(),
  semester: 'Fall',
  currency: 'USD',
  darkMode: false,
  language: 'en',
  minAttendancePercentage: 75,
};

const Settings = () => {
  const [settings, setSettings] = useState(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        setSettings({ ...defaults, ...(response.data.data || {}) });
      } catch (error) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      const response = await api.put('/settings', settings);
      setSettings({ ...defaults, ...(response.data.data || {}) });
      toast.success('Settings saved');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save settings');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Configure school information and preferences</p>
      </div>
      <form onSubmit={handleSave} className="card space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            ['schoolName', 'School Name', 'text'],
            ['schoolAddress', 'School Address', 'text'],
            ['schoolPhone', 'School Phone', 'text'],
            ['schoolEmail', 'School Email', 'email'],
            ['academicYear', 'Academic Year', 'text'],
            ['currency', 'Currency', 'text'],
            ['minAttendancePercentage', 'Minimum Attendance (%)', 'number'],
          ].map(([key, label, type]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
              <input
                type={type}
                className="input-field"
                value={settings[key]}
                onChange={(event) => setSettings({
                  ...settings,
                  [key]: type === 'number' ? Number(event.target.value) : event.target.value,
                })}
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Semester</label>
            <select className="select-field" value={settings.semester} onChange={(event) => setSettings({ ...settings, semester: event.target.value })}>
              <option value="Fall">Fall</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
            <select className="select-field" value={settings.language} onChange={(event) => setSettings({ ...settings, language: event.target.value })}>
              <option value="en">English</option>
              <option value="ar">Arabic</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </form>
    </div>
  );
};

export default Settings;
