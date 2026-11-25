import { Link, useLocation } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../utils/auth';
 
export default function Sidebar() {
    const location = useLocation();
    const user = getCurrentUser();
 
    const customerMenuItems = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Pending Orders', path: '/pendingorders' },
        { label: 'Order History', path: '/orderhistory' },
        { label: 'Profile Settings', path: '/profilesettings' }
    ];
    const adminMenuItems = [
        { label: 'Admin Panel', path: '/admin' },
        { label: 'Profile Settings', path: '/profilesettings' }
    ];
    const menuItems = user?.role === 'admin' ? adminMenuItems : customerMenuItems;
 
    return (
        <div style={{
            backgroundColor: '#103B2A',
            width: '240px',
            padding: '30px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
            boxSizing: 'border-box'
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                backgroundColor: '#174C35',
                                color: 'white',
                                textDecoration: 'none',
                                textAlign: 'center',
                                padding: '14px 10px',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                                transition: 'transform 0.1s ease, filter 0.2s ease',
                                cursor: 'pointer',
                                opacity: isActive ? 1 : 0.95,
                                border: isActive ? '2px solid white' : '2px solid transparent'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.filter = 'brightness(1.1)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.filter = 'brightness(1)';
                                e.currentTarget.style.transform = 'none';
                            }}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </div>
            
            <Link
                to="/login"
                onClick={logoutUser}
                style={{
                    backgroundColor: '#d9534f',
                    color: 'white',
                    textDecoration: 'none',
                    textAlign: 'center',
                    padding: '14px 10px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                    transition: 'transform 0.1s ease, filter 0.2s ease',
                    cursor: 'pointer',
                    marginTop: 'auto'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'brightness(1.1)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'brightness(1)';
                    e.currentTarget.style.transform = 'none';
                }}
            >
                Logout
            </Link>
        </div>
    );
}