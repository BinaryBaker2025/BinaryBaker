# Current Website Content

This document lists the current user-facing copy in the project, grouped by route/page.

## Global / Site Metadata

- Page title: `Binary Baker | Digital products with a handmade edge`
- Meta description: `Binary Baker is a digital studio crafting websites, product experiences, and brand systems with care and precision.`
- Brand text: `BB`, `Binary Baker`
- Shared modal button label: `Close`

## Routed Pages (from `src/App.jsx`)

### `/` Home (`src/pages/Home.jsx`)

- Header/nav:
  - `Services`
  - `Work`
  - `Process`
  - `Contact`
  - `Client portal`
  - `Request a free quote`
- Hero:
  - `Digital bakery for modern brands`
  - `We craft digital products that feel handmade and scale like software.`
  - `Binary Baker is a boutique studio blending engineering rigor with design warmth. Think pixel-perfect interfaces, fast builds, and launches that smell like success.`
  - `Request a free quote`
  - `See the menu`
- Hero metrics:
  - `4` / `service tracks`
  - `2 weeks` / `to first deliverable`
  - `100%` / `custom design`
- Hero card:
  - `Currently baking`
  - `Launch Kit`
  - `A full stack of brand, site, and product design for founders ready to ship in six weeks.`
  - `Brand voice + visual system`
  - `Responsive marketing site`
  - `Prototype and handoff`
  - `Request a free quote`
- Services section:
  - `Services`
  - `Pick your blend of strategy, design, and build.`
  - `Every engagement starts with clarity. We map the recipe, then bake the product in focused, fast-moving sprints.`
  - `01` `Proof + Mix` `Discovery, positioning, and UX mapping to get alignment fast.` `2 weeks`
  - `02` `Oven Build` `High-fidelity UI, interaction design, and component systems.` `3-5 weeks`
  - `03` `Icing + Launch` `Motion, copy polish, performance tuning, and deployment.` `1-2 weeks`
  - `04` `Batch Ops` `Ongoing design support, feature builds, and product evolution.` `Monthly`
- Work section:
  - `Featured Work`
  - `Concept bakes built for clarity, speed, and flavor.`
  - `Fintech` `Brand + Site` `Signal Crumb` `A homepage and onboarding flow that boosted demo bookings by 38%.`
  - `Consumer` `Product UI` `Pantry Portal` `Built a clean, fast checkout experience with a modular design system.`
  - `B2B` `Design Sprint` `Batchline` `A rapid prototype to test a new product idea and secure funding.`
- Process section:
  - `Process`
  - `From ingredient list to fresh-out-the-oven.`
  - `01` `Discovery bake-off` `Workshops, user interviews, and market scans to define the recipe.`
  - `02` `Design and prototype` `High-fidelity UX, motion direction, and clickable prototypes.`
  - `03` `Build and launch` `Production-ready code, QA, and handoff with growth-friendly tooling.`
- Contact section:
  - `Get Started`
  - `Ready for a fresh batch?`
  - `Tell us about your product and timeline. We will respond within 48 hours.`
  - Form labels/placeholders:
    - `Name` / `Jane Doe`
    - `Email` / `jane@company.com`
    - `Project Notes` / `Launch in Q3, need brand and web build...`
  - Button: `Request a free quote`
- Footer:
  - `Binary Baker`
  - `Crafting digital products since 2024.`
  - `Services`
  - `Work`
  - `Process`
  - `Portal`
  - `bradley@binarybaker.co.za`
  - `Remote worldwide`

### `/portal` Portal (`src/pages/Portal.jsx`)

- Header actions:
  - `Request a free quote`
  - `Back to site`
- Intro:
  - `Client Portal`
  - `Track every milestone from kickoff to launch.`
  - `Your project workspace keeps deliverables, approvals, and timelines in one organized hub. Login or register to stay synced with the Binary Baker team.`
- Highlight cards:
  - `Live project status` `Monitor milestones, approvals, and launch dates in real time.`
  - `Asset delivery` `Grab design files, specs, and handoff notes when they are ready.`
  - `Team collaboration` `Add teammates, collect feedback, and keep everyone aligned.`
  - `Billing snapshots` `Review invoices, retainers, and billing timelines in one view.`
- Auth mode controls:
  - `Login`
  - `Register`
  - `Welcome back`
  - `New here`
- Form labels/placeholders:
  - `Full name` / `Avery Baker`
  - `Email` / `you@company.com`
  - `Password` / `Enter your password`
  - `Confirm password` / `Re-enter your password`
  - Note: `New accounts are created as Customers. Admins assign Client or Admin roles.`
- Primary action button states:
  - `Working...`
  - `Sign in`
  - `Create account`
- Status/error text:
  - `Account created as {Role}. Please sign in to access your portal.`
  - `Signed in as {Role}.`
  - `Passwords do not match.`
  - `Invalid email or password.`
  - `Please enter a valid email address.`
  - `That email is already registered.`
  - `Password must be at least 6 characters.`
  - `Unable to authenticate. Please try again.`
- Footer strip:
  - `Secure access for active projects.`
  - `Need help?`

### `/admin/*` Admin Area

#### Shared layout (`src/pages/AdminLayout.jsx`)

- Header actions:
  - `Sign out`
  - `Back to portal`
- Nav items:
  - `Overview`
  - `Projects`
  - `Clients`
  - `Access`
  - `Billing`
  - `Project management`
- Possible org error text:
  - `No org membership found.`
  - `Failed to load org membership.`
  - (or raw error message from backend)

#### `/admin` Overview (`src/pages/AdminDashboard.jsx`)

- `Admin`
- `Admin overview`
- `Keep projects, clients, billing, and delivery aligned across the Binary Baker pipeline.`
- Quick actions:
  - `Create project`
  - `Add client`
  - `Assign access`
  - `New invoice`
- Ops card:
  - `Operations pulse`
  - `Weekly command center`
  - `Clear blockers and keep approvals, billing, and access moving before the next sprint.`
  - `Live`
  - `Approvals waiting`
  - `Invoices to chase`
  - `Projects on hold`
  - `Inactive clients`
- Stats labels:
  - `Active projects`
  - `Clients with access`
  - `Invoices open`
  - `Tasks in motion`

#### `/admin/projects` (`src/pages/AdminProjects.jsx`)

- Section intro:
  - `Projects`
  - `Create, assign, and track every active bake.`
  - `Build new engagements, set timelines, and link clients so they can access their project hubs.`
- Roster panel:
  - `Project roster`
  - `{count} total`
  - `No projects yet.`
  - `Edit`
  - Labels/fallbacks: `Lead`, `Due`, `Budget`, `Unassigned`, `TBD`, `No client`
- Create form:
  - `Create project`
  - `New`
  - `Project name` / `Launch kit redesign`
  - `Service track`
  - `Stage`
  - `Project lead` / `Owner or PM`
  - `Due date`
  - `Budget` / `R 12 000`
  - `Status`
  - `Primary client`
  - `Select client`
  - `Create project`
  - `A draft invoice is created automatically for every new project.`
- Edit dialog:
  - Title: `Edit project`
  - `Save changes`
  - `Cancel`
- Select options used:
  - Services: `Proof + Mix`, `Oven Build`, `Icing + Launch`, `Batch Ops`
  - Stages: `Discovery`, `Design sprint`, `Prototype + UI`, `Build + QA`, `Launch`
  - Statuses: `Planned`, `In progress`, `Review`, `On hold`, `Complete`

#### `/admin/clients` (`src/pages/AdminClients.jsx`)

- Section intro:
  - `Clients`
  - `Invite clients and centralize access to project hubs.`
  - `Capture primary contacts, role expectations, and access status for every account.`
- Directory panel:
  - `Client directory`
  - `{count} clients`
  - `No clients yet.`
  - `Edit`
  - Fallbacks: `Independent`, `No email`, `Client contact`
- Add form:
  - `Add client`
  - `Invite`
  - `Assign this user to an org to add clients.`
  - `Full name` / `Jordan Blake`
  - `Company` / `Company name`
  - `Email address` / `client@company.com`
  - `Notes` / `Billing contact, preferences, etc.`
  - `Status`
  - `Add client`
- Edit dialog:
  - Title: `Edit client`
  - `Assign this user to an org to edit clients.`
  - `Save changes`
  - `Cancel`
- Status labels:
  - `Active`
  - `Inactive`
  - `Unknown` (fallback)

#### `/admin/access` (`src/pages/AdminAccess.jsx`)

- Section intro:
  - `Access`
  - `Assign clients to projects and control visibility.`
  - `Set access levels for every client so they only see the projects and billing data they need.`
- Access panel:
  - `Project access`
  - `{count} links`
  - `No assignments yet.`
  - `Edit`
  - Fallbacks: `Project`, `Unknown project`, `Unknown client`, `No company`, `No email on file`, `Recently added`
  - `Last active: {value}`
- Assign form:
  - `Assign client`
  - `Access`
  - `Project` / `Select project`
  - `Client` / `Select client`
  - `Access level`
  - `Assign client`
- Edit dialog:
  - Title: `Edit assignment`
  - `Last active` / `Recently updated`
  - `Save changes`
  - `Cancel`
- Access level options:
  - `Viewer`
  - `Billing`
  - `Full access`
  - `Owner`

#### `/admin/billing` (`src/pages/AdminBilling.jsx`)

- Section intro:
  - `Billing`
  - `Manage invoices, retainers, and payment status.`
  - `Track what is sent, what is overdue, and what is paid without leaving the dashboard.`
- Invoice list panel:
  - `Invoices`
  - `{count} total`
  - `No invoices yet.`
  - `Edit`
  - Fallbacks/labels: `Invoice`, `Unknown client`, `No project`, `Amount`, `Issued`, `Due`
- Create form:
  - `Create invoice`
  - `Billing`
  - `Assign this user to an org to enable billing.`
  - `Create a project first to enable billing.`
  - `Invoice title` / `Sprint 3 deposit`
  - `Client` / `Select client`
  - `Project` / `Select project` or `Create a project first`
  - `Amount` / `R 4 500`
  - `Status`
  - `Due date`
  - `Notes` / `Internal billing notes`
  - `Create invoice`
- Edit dialog:
  - Title: `Edit invoice`
  - `Assign this user to an org to enable billing.`
  - `Create a project first to edit billing.`
  - `Save changes`
  - `Cancel`
- Invoice status labels:
  - `Draft`
  - `Sent`
  - `Viewed`
  - `Partially Paid`
  - `Paid`
  - `Overdue`
  - `Void`
  - `Unknown` (fallback)

#### `/admin/management` (`src/pages/AdminManagement.jsx`)

- Section intro:
  - `Project management`
  - `Keep delivery moving with a live task board.`
  - `Track active work across milestones and handoffs for each project team.`
- Board panel:
  - `Delivery board`
  - `{count} tasks`
  - Columns: `Backlog`, `In progress`, `Review`, `Done`
  - `No tasks yet.`
  - `Edit`
  - Fallbacks: `Unknown project`, `No due date`, `Unassigned`
- Add form:
  - `Add task`
  - `Workflow`
  - `Task title` / `Create onboarding prototype`
  - `Project` / `Select project`
  - `Owner` / `Team member`
  - `Status`
  - `Due date`
  - `Add task`
- Edit dialog:
  - Title: `Edit task`
  - `Save changes`
  - `Cancel`

### `/customer` Customer Dashboard (`src/pages/CustomerDashboard.jsx`)

- Header actions:
  - `Sign out`
  - `Back to portal`
- Page copy:
  - `Customer`
  - `Customer dashboard`
  - `Track your active bakes, review deliverables, and keep everything moving.`
- Highlight cards:
  - `Project timeline` `Follow milestones, approvals, and launch dates.`
  - `Deliverables` `Download assets, notes, and handoff materials.`
  - `Support` `Ask questions and get answers fast.`

### `/client` Client Dashboard (`src/pages/ClientDashboard.jsx`)

- Header actions:
  - `Sign out`
  - `Back to portal`
- Page copy:
  - `Client`
  - `Client dashboard`
  - `Stay synced on your deliverables, approvals, and the live project timeline.`
- Highlight cards:
  - `Project status` `Review milestones, approvals, and launch milestones.`
  - `Feedback loop` `Leave notes, approvals, and updates for the team.`
  - `Asset hub` `Access shared files and deliverables in one place.`

### `/p/invoice/:token` Public Invoice (`src/modules/billing/pages/PublicInvoicePage.tsx`)

- Header:
  - `Invoice`
  - `Invoice {invoiceNumber}`
- Loading/errors:
  - `Loading invoice...`
  - `Missing invoice token.`
  - `Unable to load this invoice.`
- Details labels:
  - `Client`
  - `Status: {status}`
  - `Issued: {date}`
  - `Due: {date}`
  - `No line items.`
  - `Qty {quantity} - {unitPrice}`
  - `Subtotal: {amount}`
  - `Discounts: {amount}`
  - `Tax: {amount}`
  - `Total: {amount}`
  - `Paid: {amount}`
  - `Balance due: {amount}`
  - `Notes: {notes}`
  - `Terms: {terms}`
  - `N/A`

## Additional Page Copy In Code (currently not routed in `src/App.jsx`)

### `src/pages/UnderConstruction.jsx`

- `Binary Baker`
- `Under construction.`
- `This site is still being developed, so no services are offered at this time.`
- `Studio refresh in progress`
- `Check back soon`
- `Status`
- `Baking the next release.`
- `We are rebuilding the studio site experience and polishing the client flow.`
- `Site experience` / `In progress`
- `Case studies` / `Curating`
- `Service inquiries` / `Paused`

### `src/modules/billing/pages/InvoicesPage.tsx`

- `Billing`
- `Invoices`
- `New invoice`
- `Loading invoices...`
- `No invoices yet.`
- `Draft`
- `Status: {status}`
- `View`
- `Total: {amount}`

### `src/modules/billing/pages/InvoiceEditorPage.tsx`

- `Billing`
- `Edit invoice`
- `Create invoice`
- `Loading invoice...`
- `Editing invoice {invoiceNumberOrId}.`
- `Start a new invoice and add line items.`

### `src/modules/billing/pages/InvoiceDetailPage.tsx`

- `Billing`
- `Invoice details`
- `Edit invoice`
- `Loading invoice...`
- `Draft`
- `Status: {status}`
- `Total: {amount}`
- `Invoice not found.`
