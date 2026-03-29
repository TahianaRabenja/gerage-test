import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import NewRequest from './pages/NewRequest';
import History from './pages/History';
import InterventionMecanicien from './pages/InterventionMecanicien';
import { Home as HomeIcon, PlusCircle, Clock } from 'lucide-react';
import { GarageProvider } from './context/GarageContext';

function BottomNav() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Accueil', icon: HomeIcon },
    { path: '/nouveau', label: 'Nouvelle', icon: PlusCircle },
    { path: '/historique', label: 'Historique', icon: Clock },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'var(--bg-card)',
      borderTop: '1px solid var(--border-color)',
      padding: '12px 0 24px',
      display: 'flex',
      justifyContent: 'space-around',
      zIndex: 50,
      backdropFilter: 'blur(10px)'
    }}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: isActive ? 'var(--accent-blue-neon)' : 'var(--text-secondary)',
              transition: 'color 0.2s ease',
              gap: '4px'
            }}
          >
            <item.icon size={24} color={isActive ? 'var(--accent-neon)' : 'currentColor'} />
            <span style={{ fontSize: '0.75rem', fontWeight: isActive ? 600 : 400 }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function App() {
  return (
    <GarageProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <main style={{ flex: 1, paddingBottom: '80px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/nouveau" element={<NewRequest />} />
              <Route path="/historique" element={<History />} />
              <Route path="/mecanicien/nouvelle/:id" element={<InterventionMecanicien />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </Router>
    </GarageProvider>
  );
}

export default App;
