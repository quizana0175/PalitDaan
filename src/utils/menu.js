import mangoGrahamImg from '../assets/mangograham.jpg';

const MENU_ITEMS_KEY = 'palitdaan_menu_items';

const defaultMenuItems = [
  {
    id: 1,
    name: 'Classic Cheeseburger',
    price: 85,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60',
    description: 'Juicy beef patty with melted cheese, fresh lettuce, and tomatoes.',
    stock: 10,
  },
  {
    id: 2,
    name: 'Spicy Fried Chicken',
    price: 110,
    image: 'https://www.cubesnjuliennes.com/wp-content/uploads/2018/12/Spicy-Chicken-Fry-Recipe.jpg',
    description: 'Crispy and spicy golden fried chicken served with rice.',
    stock: 10,
  },
  {
    id: 3,
    name: 'Mango Graham Shake',
    price: 65,
    image: mangoGrahamImg,
    description: 'Sweet and refreshing mango shake topped with crushed graham.',
    stock: 10,
  },
  {
    id: 4,
    name: 'Pork Sisig Combo',
    price: 130,
    image: 'https://images.summitmedia-digital.com/spotph/images/2020/05/29/5-1590750776.jpg',
    description: 'Sizzling pork sisig with a sunny side up egg and garlic rice.',
    stock: 10,
  },
  {
    id: 5,
    name: 'Spaghetti Bolognese',
    price: 95,
    image: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?auto=format&fit=crop&w=500&q=60',
    description: 'Classic Italian pasta with a rich and meaty tomato sauce.',
    stock: 10,
  },
  {
    id: 6,
    name: 'Halo-Halo Special',
    price: 80,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=500&q=60',
    description: 'Traditional Filipino crushed ice dessert loaded with sweet treats.',
    stock: 10,
  },
  {
    id: 7,
    name: 'Pork BBQ Ribs',
    price: 75,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=60',
    description: 'Tender, slow-cooked pork ribs glazed with a sweet and smoky BBQ sauce.',
    stock: 10,
  },
  {
    id: 8,
    name: 'Buko Pandan Salad',
    price: 55,
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=500&q=60',
    description: 'Creamy dessert made of pandan-flavored gelatins and shredded young coconut.',
    stock: 10,
  },
];

function getMenuItems() {
  const raw = localStorage.getItem(MENU_ITEMS_KEY);
  if (!raw) {
    saveMenuItems(defaultMenuItems);
    return defaultMenuItems;
  }

  try {
    const items = JSON.parse(raw);
    if (!Array.isArray(items)) {
      throw new Error('Stored menu data must be an array.');
    }

    return items.map((item) => ({
      ...item,
      stock: Number.isInteger(item.stock) && item.stock >= 0 ? item.stock : 0,
    }));
  } catch (error) {
    console.error('Unable to read stored menu items.', error);
    throw error;
  }
}

function saveMenuItems(items) {
  localStorage.setItem(MENU_ITEMS_KEY, JSON.stringify(items));
}

export { getMenuItems, saveMenuItems, defaultMenuItems };
