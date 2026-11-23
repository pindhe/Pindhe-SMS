import { useEffect, useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import {
  LayoutDashboard,
  Users,
  User,
  BookOpen,
  Calendar,
  Clock,
  CreditCard,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  Building2,
  Book,
  UserCheck,
  UserX,
  Award,
  Moon,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['super_admin', 'school_admin', 'teacher', 'student', 'parent'] },
  { name: 'Students', path: '/students', icon: Users, roles: ['super_admin', 'school_admin', 'teacher'] },
  { name: 'Teachers', path: '/teachers', icon: User, roles: ['super_admin', 'school_admin'] },
  { name: 'Parents', path: '/parents', icon: UserCheck, roles: ['super_admin', 'school_admin'] },
  { name: 'Staff', path: '/staff', icon: UserX, roles: ['super_admin', 'school_admin'] },
  { name: 'Classes', path: '/classes', icon: Building2, roles: ['super_admin', 'school_admin'] },
  { name: 'Subjects', path: '/subjects', icon: Book, roles: ['super_admin', 'school_admin'] },
  { name: 'Attendance', path: '/attendance', icon: Calendar, roles: ['super_admin', 'school_admin', 'teacher'] },
  { name: 'Exams & Results', path: '/exams', icon: Award, roles: ['super_admin', 'school_admin', 'teacher'] },
  { name: 'Fees & Payments', path: '/fees', icon: CreditCard, roles: ['super_admin', 'school_admin'] },
  { name: 'Timetable', path: '/timetable', icon: Clock, roles: ['super_admin', 'school_admin', 'teacher'] },
  { name: 'Library', path: '/library', icon: BookOpen, roles: ['super_admin', 'school_admin', 'librarian'] },
  { name: 'Events', path: '/events', icon: Calendar, roles: ['super_admin', 'school_admin'] },
  { name: 'Announcements', path: '/announcements', icon: Bell, roles: ['super_admin', 'school_admin'] },
  { name: 'Reports', path: '/reports', icon: BarChart3, roles: ['super_admin', 'school_admin'] },
  { name: 'Settings', path: '/settings', icon: Settings, roles: ['super_admin', 'school_admin'] },
];

const MainLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('darkMode', String(newValue));
    document.documentElement.classList.toggle('dark', newValue);
  };

  const userInitials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'AD';
  const filteredNav = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ${
          sidebarOpen || mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="text-xl font-bold text-primary-600 dark:text-primary-400 flex items-center gap-2">
            <Logo className="w-8 h-8" />
            <span className="font-bold tracking-tight">Pindhe SMS</span>
          </div>
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => {
              setSidebarOpen(false);
              setMobileMenuOpen(false);
            }}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                {userInitials}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 mb-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Moon className="w-4 h-4" />
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className={`transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-40 px-6 flex items-center justify-between">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => {
              setSidebarOpen(true);
              setMobileMenuOpen(true);
            }}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <button
            type="button"
            aria-label="Notifications"
            className="relative p-2 mr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800" />
          </button>
          <NavLink
            to="/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
              {userInitials}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
            </div>
          </NavLink>
        </nav>

        <main className="pt-16 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
