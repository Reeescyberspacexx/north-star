# Northstar — Delivery Tracking & Support Platform

## What is this project?

Northstar started as a simple tool: customers could check their order status and
request a return without waiting for a human to reply. That part still works exactly
the same as before.

On top of that, this project adds a full delivery system. Here's the short version of
what happens now:

1. A **retailer** (a shop) creates an order.
2. A **dispatcher** (the person who plans deliveries) assigns a **rider** to deliver it.
3. The rider picks it up, delivers it, and scans a barcode to prove it was delivered.
4. The **customer** sees every one of these steps happen live on their screen —
   they never have to refresh the page.
5. The customer also gets an automatic text message, and a mock mobile-money payment
   prompt, the moment their order is delivered.

There are four types of people who use this app: **customers**, **retailers**,
**dispatchers**, and **riders**. Each one sees a different screen with only the
buttons and information relevant to them.

---

## Table of Contents

1. [How the app is built (in plain terms)](#how-the-app-is-built-in-plain-terms)
2. [What each piece of the code does](#what-each-piece-of-the-code-does)
3. [How the data is organized](#how-the-data-is-organized)
4. [What you need before you start](#what-you-need-before-you-start)
5. [How to install it](#how-to-install-it)
6. [How to run it](#how-to-run-it)
7. [Accounts you can log in with](#accounts-you-can-log-in-with)
8. [Where everything lives (file map)](#where-everything-lives-file-map)
9. [Every API endpoint, explained](#every-api-endpoint-explained)
10. [How to test that everything works](#how-to-test-that-everything-works)
11. [Common problems and how to fix them](#common-problems-and-how-to-fix-them)
12. [How to put this on GitHub](#how-to-put-this-on-github)
13. [What's not finished yet](#whats-not-finished-yet)
14. [License](#license)

---

## How the app is built (in plain terms)

Think of this app as having two halves that talk to each other:

- **The backend** — this is the part that runs on a server. It stores all the data
  (orders, users, etc.) and decides who is allowed to do what. It's written in
  JavaScript using a tool called **Node.js**, with a helper library called
  **Express** that makes it easier to handle web requests.

- **The frontend** — this is what you actually see and click on in your browser. It's
  plain HTML, CSS, and JavaScript. No fancy frameworks, no extra build steps — the
  files you see are exactly the files that run.

These two halves talk to each other in two ways:

1. **Normal requests** — the browser asks the server for something ("give me this
   order's details") and the server replies. This is how almost every website works.
2. **Live updates** — this app also uses a tool called **Socket.io**, which keeps a
   permanent open connection between the browser and the server. This is what lets
   the customer's screen update *instantly* the moment a rider scans a package,
   without the customer having to refresh anything.

All the information (orders, users, etc.) is stored in a **database** — think of it
as a very organized spreadsheet that the server can search through quickly. This
project uses **SQLite**, which is a database that lives in a single file on your
computer (no separate database server to install or configure).

---

## What each piece of the code does

Here's the same idea, but mapped to the actual folders and files, explained simply:

- **`server.js`** — the starting point of the whole app. When you run the app, this
  file is what actually turns on. It starts the web server and turns on the live
  ("real-time") connection feature.

- **`data/db.js`** — this file creates the database, fills it with sample data the
  first time you run the app, and contains every function that reads or writes to
  that database (e.g. "create an order," "find a user").

- **`middleware/rbac.js`** — "RBAC" stands for **Role-Based Access Control**. In
  plain terms: this file's job is to check "is this person actually allowed to do
  this?" before letting any risky action happen — like making sure only a dispatcher
  can assign a rider, and only a retailer can create an order.

- **`routes/`** — this folder contains the actual "doors" into the backend. Each file
  handles a group of related actions:
  - `auth.js` — logging in and signing up
  - `orders.js` — everything to do with orders: creating, assigning, updating status,
    scanning
  - `returns.js` — the original returns/refunds feature (unchanged)

- **`services/`** — small helper files that do one specific job each:
  - `notificationService.js` — sends the "your order has been delivered" text message
    (currently fake/simulated — it just prints to the screen instead of sending a real
    text, but it's built so a real SMS company's tool could be plugged in later)
  - `paymentService.js` — simulates a mobile-money payment request (like M-Pesa),
    the same idea as above — fake for now, but built to be swapped for a real one

- **`public/`** — everything the browser actually loads and shows you:
  - `index.html` + `script.js` — the login screen and all four dashboards (customer,
    retailer, dispatcher, rider)
  - `track.html` + `track.js` — the order tracking page, including the live map and
    the barcode scanner
  - `returns.html` + `returns.js` — the returns request page (unchanged)

---

## How the data is organized

There are only two tables (think: two spreadsheets) in the whole database.

### Table 1: `users`

Every person who uses the app — customer, retailer, dispatcher, or rider — is a row
in this one table. What makes them different is just the `role` column.

| Column | What it means |
|---|---|
| `username` | how they log in — must be unique |
| `password` | their password |
| `name` | their display name |
| `role` | one of: `customer`, `retailer`, `dispatcher`, `rider` |
| `phone` | their phone number, used for SMS alerts |

### Table 2: `orders`

Every order ever placed is a row here.

| Column | What it means |
|---|---|
| `orderId` | the order's unique ID, like `NS-1001` |
| `username` | which customer this order belongs to |
| `item` | what was ordered |
| `status` | where the order is right now — see below |
| `orderDate` / `eta` / `deliveredDate` | the important dates |
| `retailer_username` | which retailer created this order |
| `dispatcher_username` | which dispatcher assigned the rider |
| `rider_username` | which rider is delivering it |
| `barcode_hash` | a unique code printed on the package, scanned to confirm delivery |
| `customer_phone` | where the SMS alerts get sent |
| `lat` / `lng` | the parcel's current position on the map |

**An order's `status` moves through four stages, in this order:**

```
preparing  →  assigned  →  in_transit  →  arrived
```

- `preparing` — the retailer created it, nobody's been assigned yet
- `assigned` — a dispatcher gave it to a rider
- `in_transit` — the rider has picked it up and is on the way
- `arrived` — delivered and confirmed (this only happens after a successful barcode
  scan)

The database file gets created automatically the very first time you start the app —
you don't have to set anything up by hand.

---

## What you need before you start

- **Node.js, version 22.5.0 or newer.** This project uses a database feature that
  only exists in newer versions of Node. To check what version you have, open a
  terminal and type:
  ```
  node -v
  ```
  If the number shown is lower than 22.5.0, go to
  [nodejs.org](https://nodejs.org) and install the latest version.

- **Nothing else.** No Python, no "Visual Studio Build Tools," no extra database
  software. This project was specifically built to avoid needing any of that.

---

## How to install it

Open a terminal, go into the project folder, and run:

```
npm install
```

This downloads the small number of tools the app depends on (mainly Express and
Socket.io, mentioned above). It should finish in a few seconds and end with a message
like:

```
added 90 packages, and audited 91 packages in 2s
found 0 vulnerabilities
```

If instead you see a lot of red text mentioning `gyp` or `Visual Studio`, something
went wrong — see the [Common Problems](#common-problems-and-how-to-fix-them) section
below.

---

## How to run it

```
npm start
```

The first time you run this, you'll see:

```
[db] Seeded 200 orders and 14 users into .../data/northstar.db
Northstar server running at http://localhost:3000
```

That first line means the app just created its database and filled it with sample
data so you have something to test with. It only does this once — the next time you
run `npm start`, that line won't appear, because the data already exists.

You might also see this line, which is normal and not a problem:
```
ExperimentalWarning: SQLite is an experimental feature and might change at any time
```

Now open your browser and go to:

```
http://localhost:3000
```

To stop the app, click back into the terminal and press `Ctrl+C`.

**Want to start over with fresh sample data?** Delete the database file and run the
app again:
```
del data\northstar.db data\northstar.db-shm data\northstar.db-wal   (Windows)
rm data/northstar.db data/northstar.db-shm data/northstar.db-wal    (Mac/Linux)
npm start
```

---

## Accounts you can log in with

Every account below uses the password `password123`.

| Username | What they are | What they can do |
|---|---|---|
| `felix` (or any other name already in the sample data) | Customer | View their own orders, track them, request returns |
| `retailer1` | Retailer | Create new orders |
| `dispatch1` | Dispatcher | Assign a rider to an order |
| `rider1` | Rider | See their assigned deliveries, scan packages to mark them delivered |
| `rider2` | Rider | A second rider — useful for checking that one rider can't touch another rider's deliveries |

You can also create your own account from the "Sign Up" tab on the login screen, and
pick whichever role you want to test.

---

## Where everything lives (file map)

```
north-star/
├── server.js                   ← start here — this turns the app on
├── package.json                ← lists what tools the app needs
│
├── data/
│   ├── db.js                    ← the database: creates it, fills it, reads/writes to it
│   └── mockOrders.js            ← the original sample data (120 orders)
│
├── middleware/
│   └── rbac.js                  ← checks "is this person allowed to do this?"
│
├── services/
│   ├── notificationService.js   ← sends (fake) SMS alerts
│   └── paymentService.js        ← simulates a mobile-money payment
│
├── routes/
│   ├── auth.js                  ← login and sign-up
│   ├── orders.js                ← everything about orders
│   └── returns.js               ← returns/refunds (unchanged from the original app)
│
├── logic/
│   └── returnsDecisionTree.js   ← the rules for whether a return is allowed (unchanged)
│
└── public/                      ← everything the browser loads
    ├── index.html / script.js    ← login screen + all 4 dashboards
    ├── track.html / track.js     ← order tracking, live map, barcode scanner
    └── returns.html / returns.js ← the returns request page
```

---

## Every API endpoint, explained

An "endpoint" is just a specific web address the frontend can send a request to. Some
of these require you to be logged in as a specific role — those are marked 🔒.

### Logging in and signing up

| What it does | Method | Address |
|---|---|---|
| Create a new account | POST | `/api/auth/signup` |
| Log in | POST | `/api/auth/login` |

### Anyone can use these (no login required)

| What it does | Method | Address |
|---|---|---|
| See all of one customer's orders | GET | `/api/orders?username=felix` |
| See one specific order | GET | `/api/orders/:orderId` |

### 🔒 Only retailers

| What it does | Method | Address |
|---|---|---|
| Create a new order | POST | `/api/orders` |
| See every order this retailer has created | GET | `/api/orders/retailer/mine` |

### 🔒 Only dispatchers

| What it does | Method | Address |
|---|---|---|
| See every order that still needs a rider | GET | `/api/orders/dispatch/open` |
| Assign a rider to an order | PATCH | `/api/orders/:id/assign` |

### 🔒 Only the rider assigned to that specific order

| What it does | Method | Address |
|---|---|---|
| See this rider's current deliveries | GET | `/api/orders/rider/mine` |
| Update an order's status (e.g. "picked up") | PATCH | `/api/orders/:id/status` |
| Confirm delivery by scanning the barcode | POST | `/api/orders/:id/verify-scan` |

### Live updates

There's one more thing that isn't a normal web address — it's a live event called
`order:updated`. Every time any of the actions above changes an order, the server
immediately tells every connected browser about it, which is what makes the screen
update without a refresh.

---

## How to test that everything works

### The easy way — just click through it in your browser

Open two browser windows side by side.

1. In **Window A**, log in as `felix` (a customer). Leave this window open so you can
   watch it.
2. In **Window B**, log in as `retailer1` and create a new order for `felix`. Watch
   Window A — the new order should appear immediately, with no refresh.
3. In **Window B**, log out and log back in as `dispatch1`. Assign a rider to the new
   order.
4. In **Window B**, log out and log back in as the rider you just assigned. Open the
   order and click **"Scan to Deliver."** (See the note below on where to get a
   scannable barcode.)
5. Check the terminal where `npm start` is running — you should see a fake SMS message
   and a fake payment message print out automatically.
6. Look back at Window A — the order should now say "Arrived," live.

If all six of those steps happen without you ever refreshing a page, everything is
working correctly.

### Where to get a barcode to scan

Each rider's dashboard shows the barcode for each of their deliveries as plain text.
You have two options:

- **Skip the camera entirely** — just copy that text and send it directly to the
  scan-confirmation address using a tool like `curl`, from a terminal:
  ```
  curl -X POST http://localhost:3000/api/orders/NS-XXXX/verify-scan ^
    -H "Content-Type: application/json" ^
    -H "x-user-username: rider1" -H "x-user-role: rider" ^
    -d "{\"barcode\":\"PASTE_THE_BARCODE_TEXT_HERE\"}"
  ```
- **Use an actual QR code** — paste the barcode text into a free QR code generator
  website, display the resulting image on your phone or a second screen, and scan it
  with your computer's camera through the "Scan to Deliver" button.

---

## Common problems and how to fix them

| What you're seeing | What it means | What to do |
|---|---|---|
| Red text mentioning `gyp` or `Visual Studio` when you run `npm install` | You have an old copy of this project that needed extra software to build a database tool. The current version doesn't need this anymore. | Make sure you're using the latest version of the code, then delete the `node_modules` folder and run `npm install` again. |
| `Cannot find module 'node:sqlite'` | Your Node.js version is too old. | Run `node -v` — if it's below 22.5.0, install a newer version from nodejs.org. |
| A message about "SQLite is an experimental feature" | This is expected and not a problem. | Nothing — ignore it. |
| `EADDRINUSE` when starting the app | The app is already running somewhere else on your computer. | Close the other terminal window that's running it, or restart your computer if you can't find it. |
| The screen doesn't update automatically | The live-update connection didn't load properly. | Open your browser's developer tools (press F12), check the "Network" tab, and confirm a file called `socket.io.js` loaded successfully. |
| You get an error saying you're not allowed to do something | You're either logged in as the wrong type of user, or (for riders) trying to act on a delivery that isn't assigned to you. | Double check which account you're logged in as. |
| The camera won't open for scanning | Either your device has no camera, or you're not viewing the site through `localhost`. | Use `http://localhost:3000` specifically, or use the `curl` method instead (see above). |
| Scanning says the barcode doesn't match | The barcode shown is out of date — this can happen if you reset the sample data. | Refresh the order's page to see its current barcode, and use that one. |
| You changed a file but the website looks the same | Your browser saved an old copy of the file. | Hold `Ctrl` and `Shift` and press `R` to force the browser to reload everything fresh. |

---

## How to put this on GitHub

If you've never pushed this project to GitHub before, here's every step.

### Step 1 — Make a new, empty repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Give it a name, e.g. `north-star`
3. **Do not** check the box that says "Initialize this repository with a README" —
   you already have one, and checking it will cause a conflict later
4. Click **Create repository**
5. Leave that page open — GitHub will show you a web address you'll need in Step 3

### Step 2 — Turn your project folder into a git project

Open a terminal inside your project folder and type:

```
git status
```

- If it says `fatal: not a git repository`, run:
  ```
  git init
  ```
- If instead it shows you a list of files, it's already set up — skip to Step 3.

### Step 3 — Connect your folder to the GitHub repository you made

```
git remote add origin https://github.com/YOUR-USERNAME/north-star.git
```

(replace `YOUR-USERNAME` with your actual GitHub username, and `north-star` with
whatever you named it)

If you get a message saying this already exists, use this instead:

```
git remote set-url origin https://github.com/YOUR-USERNAME/north-star.git
```

### Step 4 — Save your changes

```
git add .
git commit -m "First upload of the full project"
```

### Step 5 — Upload it

```
git branch -M main
git push -u origin main
```

The first time you do this, GitHub may ask you to log in. If it asks for a password
and your normal password doesn't work, you'll need to create what's called a
**Personal Access Token** instead — go to GitHub → Settings → Developer settings →
Personal access tokens, create one, and paste that in as the password.

### Step 6 — Check it worked

Refresh your repository's page on GitHub. You should see all your files there, and
this README displayed automatically on the main page.

### From now on, saving new changes is just:

```
git add .
git commit -m "describe what you changed"
git push
```

---

## What's not finished yet

Being upfront about the current limits of this project:

- **Logging in is simplified.** Instead of a proper secure login system, the app just
  checks who you say you are on every request. This is fine for learning/demo
  purposes, but a real production app would need something stronger.
- **The text messages and payments are fake.** They print a message to the terminal
  instead of actually sending anything. The code is written so a real SMS or
  mobile-money service could be plugged in later without much extra work.
- **Retailers can't edit or cancel orders** once they're created — only create new
  ones.
- **Riders are assigned manually.** There's no automatic "find the nearest rider"
  logic.
- **The database is a single file**, which is great for learning and small projects,
  but a bigger real-world version would need a proper database server instead.

---

## License

See [LICENSE](LICENSE).
