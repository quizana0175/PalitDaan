# 🌿 PalitDaan Green - Tablet Presentation & Termux Setup Guide

This project is an optimized, eco-green edition of **PalitDaan** (Campus Canteen Online Food Ordering System) specifically re-architected for **Android Tablets** running **Termux** and ready for **Supabase Cloud Storage**.

---

## ⚡ Key Features Added
1. **User Account Registration (`/register`)**:
   - Students, faculty, and staff can register with their Full Name, ID Number, Email, College/Department, and Password.
   - Accounts are stored locally (with seamless Supabase cloud sync compatibility).
2. **Canteen Admin Portal (`/admin`)**:
   - **Order Lifecycle Tagging**: Mark orders as `Paid`, `Being Prepared`, `Ready for Pickup`, `Completed`, or `Cancelled`. Customers receive live status updates on their screen!
   - **Menu Stock & Sold Out Control**: Toggle dishes between `In Stock` and `Sold Out`. When sold out, customers see a **SOLD OUT** banner and cannot add it to their cart.
   - **Live Revenue & Queue Metrics**: Track total canteen earnings, pending counter payments, and meals cooking in real time.
3. **Supabase Cloud Storage Ready**:
   - Includes [`SUPABASE_SETUP.sql`](file:///c:/Users/Admin/Downloads/PalitDaan/SUPABASE_SETUP.sql) with table definitions, foreign keys, and Row Level Security.
   - Modular database adapter ([`src/services/db.js`](file:///c:/Users/Admin/Downloads/PalitDaan/palitdaan-green/src/services/db.js)) that works offline now and connects to Supabase when you plug in your API keys!

---

## 🔑 Login Accounts for Presentation

Enter either of these credentials into the login form:

| Role | Account ID / Email | Password | Destination Portal |
| :--- | :--- | :--- | :--- |
| **Student** | `21-1234-567` (or registered email) | `password123` | Canteen Menu & Order Portal (`/dashboard`) |
| **Canteen Admin** | `ADMIN-001` (or `admin@cit.edu.ph`) | `admin123` | Admin & Inventory Management Portal (`/admin`) |

---

## 📲 Step 1: Setting Up Termux on Your Tablet

> [!IMPORTANT]
> Install Termux from **F-Droid** or **GitHub releases** (do **NOT** use the obsolete version from Google Play Store).
> - F-Droid: [https://f-droid.org/packages/com.termux/](https://f-droid.org/packages/com.termux/)

1. Open Termux on your tablet.
2. Run update and install Node.js:
   ```bash
   pkg update -y && pkg install nodejs-lts -y
   termux-setup-storage
   ```
   *(Tap **Allow** when Android asks for storage permission).*

---

## 💻 Step 2: Transferring the Project to Your Tablet

### Method A: USB Cable (Recommended & Fastest)
1. Connect your tablet to your PC with a USB cable (File Transfer mode).
2. Copy the entire [`palitdaan-green`](file:///c:/Users/Admin/Downloads/PalitDaan/palitdaan-green) folder into your tablet's **`Download`** directory.

### Method B: Portable Zip
1. Send [`palitdaan-green-termux-ready.zip`](file:///c:/Users/Admin/Downloads/PalitDaan/palitdaan-green-termux-ready.zip) (3.3 MB) to your tablet via Google Drive, Bluetooth, or messaging app.
2. Extract it into your tablet's `Download` folder.

---

## 🚀 Step 3: Running the App in Termux

In Termux on your tablet, run:

```bash
cd /sdcard/Download/palitdaan-green
node server.js
```

Open **Chrome**, **Samsung Internet**, or **Brave** on your tablet and go to:
```text
http://localhost:5173
```

---

## 🎤 Presentation Walkthrough (Step-by-Step Script)

Follow this exact flow during your live presentation to impress professors and judges:

1. **Registration & Login**:
   - Go to `http://localhost:5173`.
   - Tap **"Register here"** to show the student registration form (ID number, Department, Role).
   - Return to Login and tap **"⚡ Student Demo"** (Juan Dela Cruz).
2. **Customer Order Journey**:
   - Browse the **Food Menu** with green eco styling.
   - Tap **"Ibutang sa Cart"** on a dish, select custom allergy alerts (*Nuts, Gluten*), and add kitchen notes (*"Extra rice, less spicy"*).
   - Go to **Cart** and tap **"Place Order"**. Order `#PDG-101` is now in **Active & Pending Orders**.
3. **Switch to Canteen Admin**:
   - Tap **"Logout"** and click **"🛡️ Admin Demo"** (or use the *Admin Portal* link in the navbar/sidebar).
   - In the **Admin Portal**:
     - Point out the **Live Revenue** and **Active Queue** metrics.
     - Under **Live Orders & Tagging**, locate `#PDG-101`.
     - Tap **"✓ Paid"** -> Status updates to *Paid*.
     - Tap **"🍳 Being Prepared"** -> Customer's screen reflects food is being cooked!
     - Tap **"🔔 Ready for Pickup"** -> Notifies customer to collect their tray at the counter!
     - Tap **"🎉 Completed"** -> Automatically generates the official digital receipt in Order History.
4. **Sold-Out & Inventory Control**:
   - In the Admin Portal, switch to the **"Menu Stock & Sold-Out Control"** tab.
   - Find *Fresh Mango Graham Shake* or *Classic Cheeseburger* and tap **"Tag as Sold Out ✕"**.
   - Tap **"View Customer Mode"** in the top bar to switch to the menu:
     - Show the judges that the dish now displays a bold **"SOLD OUT"** banner, grayscale styling, and the button is disabled.
5. **Future Supabase Integration**:
   - Show the **"Supabase Cloud Storage"** tab in the Admin portal.
   - Explain that all tables, relationships, and RLS policies are pre-written in [`SUPABASE_SETUP.sql`](file:///c:/Users/Admin/Downloads/PalitDaan/SUPABASE_SETUP.sql) and ready to be connected to cloud storage without rewriting any React code.
