import { initialFoods } from '../data/foods';
import { isSupabaseConfigured, supabaseRestQuery } from './supabaseClient';

const USERS_KEY = 'palitdaan_users';
const MENU_KEY = 'palitdaan_menu';
const SESSION_KEY = 'user_session';
const PENDING_ORDERS_KEY = 'pending_orders';
const ORDER_HISTORY_KEY = 'order_history';

// Default Accounts
const defaultUsers = [
  {
    id: 'user_1',
    idNumber: '21-1234-567',
    name: 'Juan Dela Cruz',
    email: 'juan.delacruz@cit.edu.ph',
    password: 'password123',
    role: 'student',
    department: 'College of Computer Studies',
    status: 'Actively Enrolled',
    joined: 'Nov 20, 2026',
    createdAt: '2026-11-20T08:00:00.000Z'
  },
  {
    id: 'admin_1',
    idNumber: 'ADMIN-001',
    name: 'Canteen Admin',
    email: 'admin@cit.edu.ph',
    password: 'admin123',
    role: 'admin',
    department: 'Canteen Administration',
    status: 'Actively Enrolled',
    joined: 'Nov 18, 2026',
    createdAt: '2026-11-18T08:00:00.000Z'
  }
];

// Initialize local database
export function initDatabase() {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  } else {
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      const updatedUsers = users.map((u) => {
        let updated = { ...u };
        if (u.role === 'admin' || u.idNumber === 'ADMIN-001') {
          updated.name = 'Canteen Admin';
          updated.department = 'Canteen Administration';
        }
        // Normalize status to Actively Enrolled or Inactive
        if (!updated.status || updated.membership === 'Wildcat Green Member' || updated.membership === 'Canteen Staff') {
          updated.status = updated.status || 'Actively Enrolled';
        }
        // Normalize joined date to exact registration date
        if (!updated.joined || updated.joined === 'March 2024' || updated.joined.includes('Academic Year')) {
          if (updated.createdAt) {
            try {
              updated.joined = new Date(updated.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
            } catch {
              updated.joined = 'Nov 20, 2026';
            }
          } else {
            updated.joined = 'Nov 20, 2026';
          }
        }
        return updated;
      });
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    } catch {}
  }

  if (!localStorage.getItem(MENU_KEY)) {
    // Add stock and isSoldOut fields to menu items
    const menuWithInventory = initialFoods.map((item) => ({
      ...item,
      isSoldOut: false,
      stock: item.id === 3 ? 5 : 20
    }));
    localStorage.setItem(MENU_KEY, JSON.stringify(menuWithInventory));
  }

  // Ensure active session reflects Canteen Admin and proper status/joined date
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    if (session) {
      if (session.role === 'admin' || session.idNumber === 'ADMIN-001') {
        session.name = 'Canteen Admin';
      }
      if (!session.status || session.membership === 'Wildcat Green Member' || session.membership === 'Canteen Staff') {
        session.status = session.status || 'Actively Enrolled';
      }
      if (!session.joined || session.joined === 'March 2024' || session.joined.includes('Academic Year')) {
        session.joined = 'Nov 20, 2026';
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  } catch {}
}

// -------------------------------------------------------------
// USER & AUTH METHODS
// -------------------------------------------------------------

export function getUsers() {
  initDatabase();
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return defaultUsers;
  }
}

export function registerUser(userData) {
  initDatabase();
  const users = getUsers();

  // Check if ID or email already exists
  const existing = users.find(
    (u) =>
      u.idNumber.toLowerCase() === userData.idNumber.toLowerCase() ||
      u.email.toLowerCase() === userData.email.toLowerCase()
  );

  if (existing) {
    throw new Error('An account with this ID number or email already exists.');
  }

  const newUser = {
    id: 'user_' + Date.now(),
    idNumber: userData.idNumber.trim(),
    name: userData.name.trim(),
    email: userData.email.trim(),
    password: userData.password,
    role: userData.role || 'student',
    department: userData.department || 'College of Computer Studies',
    mobile: userData.mobile || '',
    campusAddress: userData.campusAddress || `${userData.department || 'CIT-U'}, Main Campus`,
    dietaryPreferences: userData.dietaryPreferences || 'No specific preferences',
    status: 'Actively Enrolled',
    joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  return newUser;
}

export function loginUser(idOrEmail, password) {
  initDatabase();
  const users = getUsers();
  const cleanQuery = (idOrEmail || '').trim().toLowerCase();

  const user = users.find(
    (u) =>
      (u.idNumber.toLowerCase() === cleanQuery || u.email.toLowerCase() === cleanQuery) &&
      u.password === password
  );

  if (!user) {
    throw new Error('Invalid ID number / email or password.');
  }

  const session = {
    id: user.id,
    idNumber: user.idNumber,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    mobile: user.mobile || '',
    campusAddress: user.campusAddress || `${user.department || 'CIT-U'}, Main Campus`,
    dietaryPreferences: user.dietaryPreferences || 'No specific preferences',
    status: user.status || 'Actively Enrolled',
    joined: user.joined || (user.createdAt
      ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Nov 20, 2026')
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event('auth-updated'));
  return session;
}

export function getCurrentUser() {
  try {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
}

export function getUserProfile(userId) {
  initDatabase();
  const session = getCurrentUser();
  const targetId = userId || session?.id || session?.idNumber;
  if (!targetId) return null;

  const users = getUsers();
  const user = users.find((u) => u.id === targetId || u.idNumber === targetId || u.email === targetId);
  if (user) {
    return {
      id: user.id,
      idNumber: user.idNumber,
      studentId: user.idNumber,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      mobile: user.mobile || '',
      campusAddress: user.campusAddress || `${user.department || 'CIT-U'}, Main Campus`,
      dietaryPreferences: user.dietaryPreferences || 'No specific preferences',
      status: user.status || 'Actively Enrolled',
      joined: user.joined || (user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Nov 20, 2026')
    };
  }

  return session;
}

export function updateUserProfile(profileData) {
  initDatabase();
  const session = getCurrentUser();
  const targetId = profileData.id || session?.id || session?.idNumber;
  const users = getUsers();

  const updatedUsers = users.map((u) => {
    if (u.id === targetId || u.idNumber === targetId || u.email === profileData.email) {
      return {
        ...u,
        name: profileData.name || u.name,
        email: profileData.email || u.email,
        idNumber: profileData.studentId || profileData.idNumber || u.idNumber,
        department: profileData.department || u.department,
        mobile: profileData.mobile !== undefined ? profileData.mobile : u.mobile,
        campusAddress: profileData.campusAddress !== undefined ? profileData.campusAddress : u.campusAddress,
        dietaryPreferences: profileData.dietaryPreferences !== undefined ? profileData.dietaryPreferences : u.dietaryPreferences,
        status: profileData.status || u.status || 'Actively Enrolled',
        joined: profileData.joined || u.joined
      };
    }
    return u;
  });

  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

  // Also update session
  if (session && (session.id === targetId || session.idNumber === targetId)) {
    const updatedSession = {
      ...session,
      name: profileData.name || session.name,
      email: profileData.email || session.email,
      idNumber: profileData.studentId || profileData.idNumber || session.idNumber,
      department: profileData.department || session.department,
      mobile: profileData.mobile !== undefined ? profileData.mobile : session.mobile,
      campusAddress: profileData.campusAddress !== undefined ? profileData.campusAddress : session.campusAddress,
      dietaryPreferences: profileData.dietaryPreferences !== undefined ? profileData.dietaryPreferences : session.dietaryPreferences,
      status: profileData.status || session.status || 'Actively Enrolled',
      joined: profileData.joined || session.joined
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
  }

  window.dispatchEvent(new Event('auth-updated'));
  window.dispatchEvent(new Event('profile-updated'));
  return true;
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event('auth-updated'));
}

// -------------------------------------------------------------
// MENU & INVENTORY METHODS (ADMIN & CLIENT)
// -------------------------------------------------------------

export function getMenuItems() {
  initDatabase();
  try {
    return JSON.parse(localStorage.getItem(MENU_KEY) || '[]');
  } catch {
    return initialFoods;
  }
}

export function toggleSoldOut(foodId) {
  initDatabase();
  const items = getMenuItems();
  const updated = items.map((item) => {
    if (item.id === foodId) {
      return { ...item, isSoldOut: !item.isSoldOut };
    }
    return item;
  });
  localStorage.setItem(MENU_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('menu-updated'));
  return updated;
}

export function updateStock(foodId, newStock) {
  initDatabase();
  const items = getMenuItems();
  const stockVal = Math.max(0, parseInt(newStock, 10) || 0);
  const updated = items.map((item) => {
    if (item.id === foodId) {
      return {
        ...item,
        stock: stockVal,
        isSoldOut: stockVal === 0
      };
    }
    return item;
  });
  localStorage.setItem(MENU_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('menu-updated'));
  return updated;
}

// -------------------------------------------------------------
// ORDER MANAGEMENT METHODS (ADMIN & CLIENT)
// -------------------------------------------------------------

export function getAllOrders() {
  try {
    const pending = JSON.parse(localStorage.getItem(PENDING_ORDERS_KEY) || '[]');
    const history = JSON.parse(localStorage.getItem(ORDER_HISTORY_KEY) || '[]');
    return { pending, history };
  } catch {
    return { pending: [], history: [] };
  }
}

export function updateOrderStatus(orderId, newStatus) {
  try {
    const pending = JSON.parse(localStorage.getItem(PENDING_ORDERS_KEY) || '[]');
    const history = JSON.parse(localStorage.getItem(ORDER_HISTORY_KEY) || '[]');

    let foundInPending = pending.find((o) => o.id === orderId);
    let foundInHistory = history.find((o) => o.id === orderId);

    const now = new Date();
    const timeStamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    if (newStatus === 'Completed') {
      // Move from pending to history if it was in pending
      let orderObj = foundInPending || foundInHistory;
      if (orderObj) {
        orderObj = { ...orderObj, status: 'Completed', completedDate: timeStamp };
        const newPending = pending.filter((o) => o.id !== orderId);
        const filteredHistory = history.filter((o) => o.id !== orderId);
        filteredHistory.unshift(orderObj);

        localStorage.setItem(PENDING_ORDERS_KEY, JSON.stringify(newPending));
        localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(filteredHistory));
      }
    } else {
      // Update in pending orders
      if (foundInPending) {
        const newPending = pending.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        );
        localStorage.setItem(PENDING_ORDERS_KEY, JSON.stringify(newPending));
      } else if (foundInHistory) {
        // If revived from history
        const revived = { ...foundInHistory, status: newStatus };
        const newHistory = history.filter((o) => o.id !== orderId);
        pending.unshift(revived);
        localStorage.setItem(PENDING_ORDERS_KEY, JSON.stringify(pending));
        localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(newHistory));
      }
    }

    window.dispatchEvent(new Event('orders-updated'));
    return true;
  } catch (err) {
    console.error('Error updating order status:', err);
    return false;
  }
}
