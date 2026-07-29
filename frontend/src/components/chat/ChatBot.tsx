import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle, X, Send, Bot, User, Sparkles, ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'bot' | 'user'
  text: string
  timestamp: Date
  suggestions?: string[]
}

interface KnowledgeEntry {
  keywords: string[]
  answer: string
  suggestions?: string[]
}

const knowledge: KnowledgeEntry[] = [
  // ── General ──
  {
    keywords: ['what is payflow', 'what is this', 'about this website', 'tell me about', 'what does payflow do', 'what can i do here'],
    answer: 'PayFlow is a payment reconciliation engine that automatically matches transactions across multiple payment gateways, detects discrepancies, and generates settlement reports. It helps businesses save hours of manual reconciliation work by providing real-time visibility into payment data, automated matching, fraud detection, and detailed analytics — all from a single dashboard.',
    suggestions: ['What pages are available?', 'How does reconciliation work?', 'What are the key features?'],
  },
  {
    keywords: ['who is this for', 'target audience', 'who uses', 'merchant', 'business', 'company', 'enterprise', 'fintech'],
    answer: 'PayFlow is built for fintech teams, payment operations managers, accountants, and any business that processes payments through multiple gateways. Whether you\'re a startup handling thousands of transactions or an enterprise managing millions, PayFlow automates the tedious work of cross-referencing payment data.',
    suggestions: ['What features are available?', 'How do I get started?', 'What gateways are supported?'],
  },
  {
    keywords: ['get started', 'getting started', 'how to start', 'begin', 'first step', 'sign up', 'register', 'create account'],
    answer: 'Getting started with PayFlow is simple: (1) Connect your payment gateway(s) from the Gateways page. (2) Import your transaction data via API, CSV upload, or webhook. (3) PayFlow will automatically begin matching transactions. (4) Review any discrepancies on the Reconciliation page. (5) Generate settlement reports from the Reports page. The dashboard gives you a real-time overview of everything at a glance.',
    suggestions: ['What gateways are supported?', 'How do I import data?', 'What is reconciliation?'],
  },
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good evening', 'howdy', 'sup'],
    answer: 'Hello! Welcome to PayFlow. I\'m your assistant and can answer questions about every part of this website — navigation, dashboard KPIs, transactions, gateways, reconciliation, fraud detection, reports, settings, and more. What would you like to know?',
    suggestions: ['What can I do here?', 'Show me the main pages', 'What\'s on the dashboard?'],
  },
  {
    keywords: ['thank', 'thanks', 'appreciate', 'helpful', 'great'],
    answer: 'You\'re welcome! If you have any more questions about PayFlow, feel free to ask. I can help with features, navigation, data insights, or anything else about the platform.',
    suggestions: ['What fraud tools are available?', 'How do I generate reports?', 'Tell me about settlements'],
  },

  // ── Navigation / Pages ──
  {
    keywords: ['pages', 'navigation', 'routes', 'sidebar', 'menu', 'what pages', 'all pages', 'go to', 'navigate'],
    answer: 'PayFlow has 4 main navigation sections with 10 pages:\n\n• CORE: Dashboard (/), Transactions (/transactions), Gateways (/gateways)\n• OPERATIONS: Reconciliation (/reconciliation), Settlements (/settlements), Ledger (/ledger)\n• INTEL: Fraud (/fraud), Reports (/reports)\n• SYSTEM: Notifications (/notifications), Settings (/settings)\n\nThe sidebar on the left side of the dashboard shows all these pages. You can also press Cmd+K (Ctrl+K) to open the command palette and quickly jump to any page. The public marketing pages include Home, Pricing, Docs, API Docs, About, and Contact.',
    suggestions: ['What\'s on the dashboard?', 'What does the Transactions page show?', 'How do I use Settings?'],
  },
  {
    keywords: ['dashboard page', 'what is on dashboard', 'main page', 'at a glance', 'kpi', 'key metrics', 'dashboard stats', 'home page', 'landing'],
    answer: 'The Dashboard (main page at /) shows your "At a Glance" section with 4 key KPI cards: Total Transactions (count with trend), Total Volume (revenue with currency format), Success Rate (percentage), and Active Gateways (count). These pull real-time data from your connected gateways to give you a snapshot of your payment operations.',
    suggestions: ['What do the KPIs mean?', 'Where can I see more analytics?', 'How do I view transactions?'],
  },
  {
    keywords: ['transactions page', 'transaction page', 'view transactions', 'list transactions', 'transaction list'],
    answer: 'The Transactions page (/transactions) shows a searchable, filterable table of all your transactions. You can filter by status (All, Success, Pending, Failed, Processing) and search by reference or gateway name. Each transaction shows: ID, Reference, Amount (currency formatted), Status (color-coded chip), Gateway, Date, and Location. Click the expand button on any row to see detailed location data (city, country, device, IP). Actions include: view details, fraud scan, cancel, refund, and retry. You can also create new transactions from this page.',
    suggestions: ['What transaction statuses are there?', 'How do I refund a transaction?', 'What is fraud scanning?'],
  },
  {
    keywords: ['gateways page', 'gateway page', 'payment gateways', 'supported gateways', 'gateway list', 'connect gateway'],
    answer: 'The Gateways page (/gateways) shows all your connected payment gateways in a grid of cards. Each card displays the gateway name, logo, status (Active/Inactive), latency, and uptime percentage. PayFlow supports 12 gateways: Stripe, PayPal, Razorpay, PayU, CCAvenue, PhonePe, GPay, Worldpay, Adyen, Square, Braintree, and Checkout.com. Each gateway card has a "Simulate" button that lets you test payments. Gateway health data is updated in real-time (every 30 seconds).',
    suggestions: ['How do I check gateway health?', 'How does reconciliation work?', 'What is fraud detection?'],
  },
  {
    keywords: ['reconciliation page', 'reconcile', 'matching', 'discrepancy', 'reconciliation results'],
    answer: 'The Reconciliation page (/reconciliation) is where you review matched and unmatched transactions. You can filter by type (All, Daily, Weekly, Monthly). Top stats show: Matched Transactions count, Discrepancy Count, and Discrepancy Amount. The table lists each reconciliation result with Reference, Amount, Gateway, Type (color-coded mismatch type), Time, Status, and Actions (resolve). Click "Run Reconciliation" to trigger a new matching cycle. When you resolve a discrepancy, you can accept the gateway value, accept your system value, or mark for manual review.',
    suggestions: ['What types of discrepancies are there?', 'How do run reconciliation?', 'What are settlements?'],
  },
  {
    keywords: ['settlements page', 'settle', 'payout', 'settlement list', 'settlement summary'],
    answer: 'The Settlements page (/settlements) shows all your payment settlements. Stat cards at the top show: Total Pending Amount, Total Settled Amount, Total Fees, and Net Amount. The table lists each settlement with: ID, Amount, Status (Pending/Settled/Failed/On-Hold), Gateway, Fee, Net Amount, Scheduled Date, and Completed Date. This helps you track payout cycles and fee breakdowns across all gateways.',
    suggestions: ['What settlement statuses are there?', 'How do I view the ledger?', 'What reports can I generate?'],
  },
  {
    keywords: ['ledger page', 'general ledger', 'accounting', 'debits', 'credits', 'trial balance', 'ledger entries'],
    answer: 'The Ledger page (/ledger) shows your general ledger entries. Stat cards display: Total Debits, Total Credits, and Balance (difference). The table lists each entry with: Account, Type (Debit/Credit with colored chip), Amount, Currency, Description, and Date. This gives you an accounting-grade view of all your payment flows and helps with financial reconciliation and audit trails.',
    suggestions: ['How is fraud detected?', 'What reports are available?', 'How do I use notifications?'],
  },
  {
    keywords: ['fraud page', 'fraud detection', 'fraud cases', 'fraud alerts', 'ml insights', 'risk score'],
    answer: 'The Fraud page (/fraud) has 3 sub-tabs:\n\n• Cases: Lists all fraud cases with filters (All/Open/Investigating/Resolved/Confirmed). Shows ID, Amount, Status, Risk Score (color-coded), Gateway, Date. Actions include resolve, assign, escalate, and view device ID.\n• Alerts: Real-time fraud alerts filtered by severity (All/Critical/High/Medium/Low). Acknowledge alerts to dismiss them.\n• ML Insights: Machine learning model statistics (precision, recall, F1 score, accuracy) with a "Retrain Models" button to update the fraud detection models.\n\nFraud alerts are polled every 30 seconds for real-time monitoring.',
    suggestions: ['What is a risk score?', 'How do I generate reports?', 'What notification features are there?'],
  },
  {
    keywords: ['reports page', 'report generation', 'generate report', 'download report', 'report types'],
    answer: 'The Reports page (/reports) lets you generate and download reports. Click "Generate Report" to open a modal where you select: Report Type (Daily Summary, Transaction Detail, Settlement, Reconciliation, Fraud Summary) and enter a Title. Reports are generated and listed as cards showing the title, type badge, and relative timestamp. Each report has a "Download" button and a "Delete" option. Supported formats include CSV and PDF.',
    suggestions: ['What report types are available?', 'How do I view notifications?', 'How do I change settings?'],
  },
  {
    keywords: ['notifications page', 'notifications', 'alerts', 'bell', 'unread'],
    answer: 'The Notifications page (/notifications) shows all your system notifications. Each notification shows: type icon (Info/blue, Warning/amber, Error/red, Success/green), title, message, and relative timestamp (e.g., "2m ago"). Click any notification to mark it as read (unread ones are more opaque). The header shows your total unread count and has a "Mark All Read" button. You can also access notifications quickly from the bell icon in the top bar, which shows the unread badge count.',
    suggestions: ['What settings can I change?', 'How do I customize the theme?', 'What security options are there?'],
  },
  {
    keywords: ['settings page', 'settings', 'profile', 'change password', 'theme', 'appearance', 'preferences'],
    answer: 'The Settings page (/settings) has 3 sections:\n\n• Profile: View and edit your name, email, and role. Save changes with the "Save Changes" button.\n• Appearance: Choose between Light, Dim, and Dark themes. Each has a visual preview card. Theme is saved to localStorage and persists across sessions.\n• Security: Change your password with fields for Current Password, New Password (min 6 characters), and Confirm Password. Form validation ensures passwords match.\n\nThe theme can also be cycled quickly from the top bar theme button (sun/moon/monitor icons).',
    suggestions: ['How do I view the dashboard?', 'What is the fraud page?', 'How do I get reports?'],
  },

  // ── Features ──
  {
    keywords: ['features', 'key features', 'capabilities', 'what can it do', 'main features', 'platform features'],
    answer: 'PayFlow\'s key features include:\n\n• AI-Powered Matching: Automatically match transactions across gateways with 99.7% accuracy.\n• Multi-Gateway Support: Connect 12+ payment gateways (Stripe, PayPal, Razorpay, and more).\n• Real-Time Fraud Detection: ML-powered fraud scoring with case management and alerts.\n• Smart Settlement Tracking: Track payout cycles, fees, and settlement statuses.\n• Global Currency Support: 50+ currencies across 150+ countries.\n• Custom Rules Engine: Define your own matching rules and workflows.\n• Detailed Analytics: KPIs, charts, gateway performance, and trend data.\n• Report Generation: Export reports in CSV and PDF formats.\n• Bank-Grade Security: SOC 2 compliant, AES-256 encryption, TLS 1.3.',
    suggestions: ['How does AI matching work?', 'What gateways are supported?', 'How does fraud detection work?'],
  },
  {
    keywords: ['ai matching', 'ai-powered', 'automated matching', 'match accuracy', '99.7', 'matching algorithm'],
    answer: 'The AI-powered matching engine uses intelligent algorithms to automatically compare transaction records across your connected gateways. It achieves 99.7% accuracy by analyzing transaction amounts, timestamps, references, and gateway metadata. Any transactions that don\'t match are flagged as discrepancies for your review on the Reconciliation page.',
    suggestions: ['What happens when a match fails?', 'How do I resolve discrepancies?', 'What types of reconciliation are there?'],
  },
  {
    keywords: ['global', 'currency', 'currencies', 'multi-currency', 'countries', 'international'],
    answer: 'PayFlow supports 50+ currencies across 150+ countries. You can reconcile transactions in any currency and view amounts formatted with the appropriate currency symbol (e.g., $, €, £, ₹). Exchange rates and multi-currency support are handled automatically across all connected gateways.',
    suggestions: ['What gateways are supported globally?', 'How do settlements work?', 'What reports show currency data?'],
  },
  {
    keywords: ['custom rules', 'rules engine', 'workflow', 'automation', 'custom matching'],
    answer: 'The custom rules engine lets you define your own matching criteria and business logic. You can create rules based on amount thresholds, time windows, gateway-specific fields, and custom reference patterns. This gives you fine-grained control over how transactions are matched and which discrepancies need human review.',
    suggestions: ['How does reconciliation work?', 'What happens to unmatched transactions?', 'How do I resolve discrepancies?'],
  },
  {
    keywords: ['csv upload', 'import', 'data import', 'upload transactions', 'bulk import', 'webhook'],
    answer: 'You can import transaction data into PayFlow three ways:\n• API Integration: Connect directly via REST API for real-time data sync.\n• CSV Upload: Bulk-upload transaction records from a CSV file.\n• Webhooks: Set up webhook endpoints to receive transaction data automatically.\n\nOnce imported, PayFlow immediately begins matching transactions and flagging discrepancies.',
    suggestions: ['How do I connect a gateway?', 'How does the API work?', 'Where can I find API docs?'],
  },

  // ── Dashboard KPIs ──
  {
    keywords: ['total transactions', 'transaction count', 'kpi transactions', 'how many transactions'],
    answer: '"Total Transactions" on the dashboard shows the number of transactions processed across all your connected gateways. This count is pulled from real-time analytics data and updates automatically. You can see a detailed breakdown on the Transactions page.',
    suggestions: ['What does Total Volume mean?', 'What is the Success Rate?', 'How many gateways are active?'],
  },
  {
    keywords: ['total volume', 'revenue', 'total amount', 'volume kpi', 'money processed'],
    answer: '"Total Volume" shows the total monetary value of all transactions processed. It\'s displayed in your local currency format (e.g., ₹1,23,456.78). This KPI aggregates volume across all connected gateways and updates in real-time from your transaction data.',
    suggestions: ['What is the success rate?', 'How do I see transaction details?', 'What are the settlement fees?'],
  },
  {
    keywords: ['success rate', 'success percentage', 'kpi success', 'rate kpi'],
    answer: '"Success Rate" shows the percentage of transactions that completed successfully. It\'s calculated as (successful transactions / total transactions) × 100. A high success rate indicates healthy payment processing across your gateways.',
    suggestions: ['What affects the success rate?', 'How do I view failed transactions?', 'How do I check gateway health?'],
  },
  {
    keywords: ['active gateways', 'gateway count', 'kpi gateways', 'how many gateways'],
    answer: '"Active Gateways" shows how many payment gateways you currently have connected and active. The dashboard shows a simple count. For detailed info on each gateway (latency, uptime, health status), visit the Gateways page.',
    suggestions: ['Which gateways are supported?', 'How do I check gateway health?', 'What gateways do you support?'],
  },

  // ── Transactions Deep ──
  {
    keywords: ['transaction status', 'status types', 'transaction states', 'txn status'],
    answer: 'Transactions can have these statuses: Success (green), Pending (amber/yellow), Failed (red), and Processing (blue). Each status is displayed as a colored chip on the Transactions page for quick visual identification. Failed transactions can be retried, and successful ones can be refunded if needed.',
    suggestions: ['How do I retry a failed transaction?', 'How do I refund a transaction?', 'How do I filter transactions?'],
  },
  {
    keywords: ['refund', 'cancel', 'void', 'reverse'],
    answer: 'From the Transactions page, you can refund or cancel individual transactions. Each row in the transaction table has action buttons. Successful transactions can be refunded, and pending or processing ones can be cancelled. There\'s also a "Retry" option for failed transactions. These actions trigger API calls to the respective gateway.',
    suggestions: ['How do I retry a transaction?', 'How do I scan for fraud?', 'What gateway actions are available?'],
  },
  {
    keywords: ['transaction location', 'location data', 'geo', 'geographic', 'ip address', 'device info'],
    answer: 'Each transaction can include detailed location data shown in an expandable section: city, state, country, latitude/longitude coordinates, device information, IP address, and timestamp. There\'s even a "View in Google Maps" link for the coordinates. This data helps with fraud analysis and geographic reporting.',
    suggestions: ['How does fraud detection use this?', 'What fraud tools are available?', 'How do I generate reports?'],
  },

  // ── Gateways Deep ──
  {
    keywords: ['gateway health', 'health status', 'gateway status', 'uptime', 'latency', 'gateway performance'],
    answer: 'Each gateway\'s health is monitored in real-time with data polled every 30 seconds. The Gateways page shows: Connection Status (Active/Inactive badge), Latency (response time in ms), and Uptime Percentage. Gateway cards use a spotlight hover effect and show the gateway logo. You can run simulations to test payment processing from the gateway detail view.',
    suggestions: ['Which gateways are supported?', 'How do I simulate a payment?', 'How does reconciliation work?'],
  },
  {
    keywords: ['simulate', 'test payment', 'gateway simulation', 'sandbox'],
    answer: 'The "Simulate" button on each gateway card opens a modal that lets you test a payment through that specific gateway. This is useful for verifying connectivity, testing the integration, and seeing how transactions flow through the system before processing real payments.',
    suggestions: ['How do I check gateway health?', 'What gateways are supported?', 'How do I view transactions?'],
  },
  {
    keywords: ['stripe', 'paypal', 'razorpay', 'payu', 'ccavenue', 'phonepe', 'gpay', 'worldpay', 'adyen', 'square', 'braintree', 'checkout.com'],
    answer: 'Yes, that gateway is supported! PayFlow integrates with 12 major payment gateways: Stripe, PayPal, Razorpay, PayU, CCAvenue, PhonePe, GPay (Google Pay), Worldpay, Adyen, Square, Braintree, and Checkout.com. Each can be connected from the Gateways page, and you can reconcile transactions across any combination of them simultaneously.',
    suggestions: ['How do I connect a gateway?', 'How does reconciliation work across gateways?', 'What is the ledger page?'],
  },

  // ── Reconciliation Deep ──
  {
    keywords: ['reconciliation types', 'daily reconciliation', 'weekly', 'monthly', 'reconciliation schedule'],
    answer: 'Reconciliation can be run at three intervals: Daily (matches transactions within the same day), Weekly (matches over a 7-day window), and Monthly (matches over the calendar month). You can choose the type that best fits your business volume and settlement cycles. Results are filtered on the Reconciliation page using the type filter tabs.',
    suggestions: ['How do I run reconciliation?', 'What are discrepancy types?', 'How do I resolve discrepancies?'],
  },
  {
    keywords: ['discrepancy types', 'mismatch types', 'difference types', 'reconciliation mismatch'],
    answer: 'When reconciliation finds discrepancies, each is categorized by type. Common discrepancy types include: amount mismatches, missing transactions (in your system but not in gateway, or vice versa), timing differences, and currency conversion differences. Each type is shown as a colored chip in the reconciliation table for quick identification.',
    suggestions: ['How do I resolve a discrepancy?', 'What happens after reconciliation?', 'How do I run reconciliation?'],
  },
  {
    keywords: ['resolve discrepancy', 'resolve mismatch', 'reconciliation resolve', 'accept value'],
    answer: 'To resolve a discrepancy: click the "Resolve" action on any reconciliation result row. A modal will appear where you can choose how to resolve it — accept the gateway value, accept your system value, or mark for manual review. After resolving, the discrepancy is recorded and the reconciliation summary updates.',
    suggestions: ['How do I run a new reconciliation?', 'What reports show discrepancies?', 'How do settlements work?'],
  },
  {
    keywords: ['run reconciliation', 'trigger reconciliation', 'start reconciliation', 'new reconciliation'],
    answer: 'Click the "Run Reconciliation" button at the top of the Reconciliation page. This triggers a new matching cycle that compares transaction data across your connected gateways. Results appear in the table below, and the summary stat cards update with the new matched and unmatched counts.',
    suggestions: ['How do I resolve discrepancies?', 'What are the reconciliation types?', 'How do settlement reports work?'],
  },

  // ── Settlements Deep ──
  {
    keywords: ['settlement status', 'pending settlement', 'settled', 'failed settlement', 'on hold', 'settlement states'],
    answer: 'Settlements can have these statuses:\n• Pending: Awaiting payout from the gateway\n• Settled: Successfully paid out\n• Failed: Payout failed, needs attention\n• On-Hold: Held for review or due to gateway policies\n\nEach settlement shows the amount, gateway, fee, net amount, scheduled date, and completion date for full visibility into your payout cycles.',
    suggestions: ['How do I view the summary?', 'What fees are shown?', 'How does the ledger connect?'],
  },
  {
    keywords: ['settlement fees', 'gateway fees', 'transaction fees', 'fee breakdown', 'net amount'],
    answer: 'Each settlement includes a fee breakdown showing: the gross settlement amount, gateway processing fees, and the net amount you receive. The summary stat cards at the top show totals: Total Pending, Total Settled, Total Fees, and Net Amount aggregated across all gateways.',
    suggestions: ['What settlement statuses are there?', 'How do I view the ledger?', 'How do I generate reports?'],
  },

  // ── Fraud Deep ──
  {
    keywords: ['risk score', 'fraud score', 'risk level', 'fraud probability'],
    answer: 'Risk Score is a numerical value (typically 0-100) assigned to each transaction by the fraud detection ML model. Higher scores indicate higher fraud risk. Scores are color-coded: green (low risk), amber/yellow (medium risk), red (high risk/critical). You can filter fraud cases by risk level and take appropriate actions like resolving, assigning, or escalating.',
    suggestions: ['How do I manage fraud cases?', 'What are ML insights?', 'How do fraud alerts work?'],
  },
  {
    keywords: ['ml insights', 'machine learning', 'model stats', 'precision', 'recall', 'f1 score', 'accuracy', 'retrain'],
    answer: 'The ML Insights tab on the Fraud page shows your fraud detection model\'s performance metrics: Precision (accuracy of positive predictions), Recall (ability to find all fraud cases), F1 Score (harmonic mean of precision and recall), and Accuracy (overall correctness). You can see when the model was last trained and click "Retrain Models" to update it with the latest data for improved detection.',
    suggestions: ['How are fraud cases managed?', 'What are fraud alerts?', 'How does the risk score work?'],
  },
  {
    keywords: ['fraud case status', 'case management', 'open case', 'investigating', 'resolved', 'confirmed fraud'],
    answer: 'Fraud cases can have these statuses: Open (newly detected), Investigating (being reviewed), Resolved (dealt with), and Confirmed (verified as fraud). You can update case status from the actions menu on each row, and filter cases by status using the filter tabs at the top of the Cases tab.',
    suggestions: ['How do I escalate a case?', 'What is the risk score?', 'How do ML insights work?'],
  },
  {
    keywords: ['fraud alert', 'alert severity', 'critical alert', 'high medium low', 'acknowledge alert'],
    answer: 'Fraud alerts are real-time notifications of suspicious activity, categorized by severity: Critical (immediate action needed), High (urgent review), Medium (monitor closely), and Low (informational). Alerts are polled every 30 seconds for real-time awareness. Each alert can be acknowledged from the Alerts tab to dismiss it from the active list.',
    suggestions: ['How do I view fraud cases?', 'What are ML insights?', 'How do I escalate a case?'],
  },

  // ── Reports Deep ──
  {
    keywords: ['report types', 'daily summary', 'transaction detail', 'reconciliation report', 'fraud summary', 'settlement report'],
    answer: 'PayFlow offers 5 report types:\n• Daily Summary: Overview of the day\'s transactions and reconciliation.\n• Transaction Detail: Full breakdown of all transactions with fields and statuses.\n• Settlement Report: Settlement cycles, amounts, fees, and net payouts.\n• Reconciliation Report: Matched vs unmatched transactions and discrepancy details.\n• Fraud Summary: Fraud cases, alerts, risk scores, and resolution status.\n\nAll reports can be downloaded in CSV or PDF format from the Reports page.',
    suggestions: ['How do I generate a report?', 'How do I view notifications?', 'How do I change settings?'],
  },

  // ── Marketing Pages ──
  {
    keywords: ['pricing page', 'pricing plans', 'plans', 'starter', 'pro', 'enterprise'],
    answer: 'PayFlow offers 3 pricing tiers:\n• Starter ($49/mo): 5,000 transactions, 3 gateways, basic AI matching, email support, 7-day data retention.\n• Pro ($149/mo): 50,000 transactions, 8 gateways, advanced AI (99.7% accuracy), priority support, 90-day retention, full API access, 20 currencies, custom rules engine.\n• Enterprise (Custom): Unlimited transactions, all gateways, dedicated support, custom retention, SLA.\n\nA one-time payment option of $49 is also available for full access. Visit /pricing for details.',
    suggestions: ['What features are included in Pro?', 'How does the free trial work?', 'What gateways are supported?'],
  },
  {
    keywords: ['docs page', 'documentation', 'help docs', 'guides'],
    answer: 'The Docs page (/docs) contains detailed guides on: Getting Started (creating a workspace, connecting gateways, importing data), Gateways (how to connect each of the 12 supported gateways), Reconciliation (daily/weekly/monthly types, match rules, discrepancy types, resolution), Settlements (payout cycles, fee breakdown, statuses), and Security (AES-256 encryption, TLS 1.3, PCI DSS, SOC 2, GDPR, RBAC, audit trails).',
    suggestions: ['Where are the API docs?', 'How do I connect a gateway?', 'How does reconciliation work?'],
  },
  {
    keywords: ['api docs', 'api documentation', 'rest api', 'api endpoints', 'developer'],
    answer: 'The API Docs page (/api-docs) provides interactive documentation for all REST API endpoints. Endpoints are grouped by resource: Transactions (list, get, create, cancel, refund, retry), Gateways (list, get, health, simulate), Reconciliation (results, summary, run, resolve), Settlements (list, summary), Ledger (entries, trial-balance), Fraud (cases, dashboard, ML dashboard, alerts, scan, resolve, assign, escalate, retrain), Reports (list, generate, download), and Notifications (list, mark-read, mark-all-read).',
    suggestions: ['How do I connect via API?', 'How do I import data?', 'What authentication is needed?'],
  },
  {
    keywords: ['contact page', 'contact support', 'get help', 'email support', 'reach us'],
    answer: 'You can reach the PayFlow team via:\n• Contact Form: /contact — fill in name, email, company, subject, message, and type (General/Support/Sales/Partnership).\n• Email: hello@payflow.dev\n• Live Chat: Available 24/7 on the website\n• Phone: +1 (555) 123-4567\n• Office: San Francisco, CA\n\nResponse time is typically under 4 hours.',
    suggestions: ['Where is the pricing page?', 'How do I view documentation?', 'Tell me about the company'],
  },
  {
    keywords: ['about page', 'about company', 'team', 'mission', 'values', 'milestones'],
    answer: 'PayFlow was founded in 2022 and raised $4.2M in seed funding in 2023. Core values: Precision First, Built for Teams, Security by Design, Speed Matters, Global Scale, and Customer Obsessed.\n\nKey stats: 10,000+ merchants, $2B+ reconciled, 99.7% matching accuracy, 50+ currencies supported. The team section on the About page introduces the leadership behind the platform.',
    suggestions: ['What features are available?', 'How does pricing work?', 'What security measures are in place?'],
  },
  {
    keywords: ['demo', 'product tour', 'walkthrough', 'interactive tour', 'see how it works'],
    answer: 'The landing page includes an interactive Demo Walkthrough — a 12-step product tour that highlights key features with tooltip narration and mock screenshots. You can navigate through steps with Next/Prev buttons or skip the tour entirely. There\'s also a video demo modal accessible from the hero section.',
    suggestions: ['What are the main features?', 'How do I get started?', 'What does the dashboard show?'],
  },

  // ── Security ──
  {
    keywords: ['security', 'encryption', 'aes', 'tls', 'soc2', 'soc 2', 'gdpr', 'pci dss', 'pci', 'compliance', 'data protection'],
    answer: 'PayFlow takes security seriously with multiple layers of protection:\n• Data in transit: TLS 1.3 encryption\n• Data at rest: AES-256 encryption\n• Compliance: SOC 2 compliant, PCI DSS standards, GDPR ready\n• Access Control: Role-based access control (RBAC)\n• Monitoring: Audit trails for all actions\n\nYour payment data is never shared with third parties and is protected by industry-standard security practices.',
    suggestions: ['How do I secure my account?', 'How do I change my password?', 'What settings can I configure?'],
  },

  // ── Glossary / Concepts ──
  {
    keywords: ['what is reconciliation', 'reconciliation meaning', 'payment reconciliation', 'definition reconciliation'],
    answer: 'Payment reconciliation is the process of comparing transaction records from your internal systems against records from payment gateways or banks to ensure they match. Any differences (discrepancies) are flagged for investigation. PayFlow automates this process with AI-powered matching, saving hours of manual work and reducing errors.',
    suggestions: ['How does PayFlow automate reconciliation?', 'What are discrepancy types?', 'How do I resolve discrepancies?'],
  },
  {
    keywords: ['what is settlement', 'settlement meaning', 'payout cycle', 'definition settlement'],
    answer: 'A settlement is the process where a payment gateway transfers collected funds to your business bank account. Settlements typically happen on a T+1, T+2, or weekly/monthly schedule depending on the gateway. The Settlements page tracks all these cycles — including amounts, fees, net payouts, and statuses (pending, settled, failed, on-hold).',
    suggestions: ['What settlement statuses are there?', 'What fees are charged?', 'How do I view the ledger?'],
  },
  {
    keywords: ['ledger meaning', 'what is ledger', 'general ledger', 'accounting ledger'],
    answer: 'A ledger is a record-keeping book (or digital equivalent) that tracks all financial transactions. In PayFlow, the Ledger page shows debits and credits across all your payment activity. The trial balance (total debits vs total credits) helps verify that your accounts are balanced. This is essential for accounting reconciliation and audit trails.',
    suggestions: ['How do I view the ledger?', 'What is trial balance?', 'How does reconciliation differ from ledger?'],
  },
  {
    keywords: ['fraud detection meaning', 'what is fraud detection', 'how fraud detection works'],
    answer: 'Fraud detection in PayFlow uses machine learning models to analyze transaction patterns and flag suspicious activity. Each transaction gets a risk score (0-100). High-risk transactions are automatically flagged as fraud cases. The system generates real-time alerts for critical threats. ML models can be retrained with new data to improve detection accuracy over time.',
    suggestions: ['What is a risk score?', 'How do I manage fraud cases?', 'What ML insights are available?'],
  },
]

function findAnswer(input: string): { answer: string; suggestions?: string[] } {
  const lower = input.toLowerCase().trim()
  if (!lower) return { answer: 'Please ask me a question about PayFlow. I can help with features, navigation, transactions, gateways, reconciliation, fraud detection, reports, and more.' }

  let bestMatch: KnowledgeEntry | null = null
  let bestScore = 0

  for (const entry of knowledge) {
    let score = 0
    for (const keyword of entry.keywords) {
      if (lower.includes(keyword)) {
        score += keyword.length / entry.keywords.length
      } else {
        const words = keyword.split(' ')
        const matches = words.filter((w) => lower.includes(w)).length
        if (words.length > 1 && matches >= Math.ceil(words.length / 2)) {
          score += (matches / words.length) * 2
        }
      }
    }
    if (score > bestScore) {
      bestScore = score
      bestMatch = entry
    }
  }

  if (bestMatch && bestScore > 0.5) {
    return { answer: bestMatch.answer, suggestions: bestMatch.suggestions }
  }

  return {
    answer: 'I\'m not sure about that specifically. I can answer questions about: navigating the website, the dashboard and KPIs, transactions and their statuses, payment gateways, reconciliation process, settlements, fraud detection, reports, notifications, settings, pricing, documentation, and security. Try rephrasing your question or ask about one of these topics.',
    suggestions: ['What pages are available?', 'What features does PayFlow have?', 'Tell me about the dashboard'],
  }
}

const greetings = [
  'Hey there! I can help you with anything about PayFlow — features, navigation, transactions, gateways, reconciliation, fraud detection, reports, and more. Ask me anything!',
  'Hi! Need help navigating PayFlow? I can answer questions about every page, feature, and KPI on the platform.',
  'Welcome! I\'m your PayFlow guide. Ask me about the dashboard, transactions, reconciliation, fraud detection, pricing, or any other part of the website.',
  'Hello! I\'m here to help you understand everything PayFlow can do. Try asking about a specific page, feature, or concept.',
]

function randomGreeting(): string {
  return greetings[Math.floor(Math.random() * greetings.length)]
}

export function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'bot', text: randomGreeting(), timestamp: new Date(), suggestions: ['What can I do here?', 'What pages are available?', 'Tell me about the dashboard'] },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  const sendMessage = useCallback((suggestionText?: string) => {
    const text = (suggestionText || input).trim()
    if (!text || isTyping) return
    setInput('')

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setIsTyping(true)

    setTimeout(() => {
      const { answer, suggestions } = findAnswer(text)
      const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'bot', text: answer, timestamp: new Date(), suggestions }
      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
    }, 500 + Math.random() * 600)
  }, [input, isTyping])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') sendMessage()
    },
    [sendMessage],
  )

  return (
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-hud-lg"
        style={{
          background: 'linear-gradient(135deg, var(--primary), var(--accent-cyan))',
          boxShadow: '0 0 24px color-mix(in srgb, var(--primary) 30%, transparent)',
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Toggle chat"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={18} className="text-white" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle size={20} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="fixed bottom-20 right-5 z-50 flex w-[380px] flex-col overflow-hidden rounded-2xl border shadow-hud-lg"
            style={{
              height: '560px',
              borderColor: 'color-mix(in srgb, var(--accent-cyan) 18%, var(--border))',
              background: 'color-mix(in srgb, var(--surface-strong) 95%, var(--bg2))',
              backdropFilter: 'blur(24px)',
            }}
          >
            <div
              className="relative flex items-center gap-3 px-4 py-3.5 shrink-0"
              style={{
                borderBottom: '1px solid color-mix(in srgb, var(--accent-cyan) 12%, var(--border))',
                background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 10%, transparent), color-mix(in srgb, var(--accent-cyan) 5%, transparent))',
              }}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, var(--primary), var(--accent-cyan))',
                  boxShadow: '0 0 12px color-mix(in srgb, var(--primary) 20%, transparent)',
                }}
              >
                <Bot size={16} className="text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-[var(--text)]">PayFlow Assistant</span>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--success)] opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                  </span>
                  <span className="text-[9px] font-mono font-semibold text-[var(--success)] uppercase tracking-wider">Online</span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="ml-auto rounded-lg p-1.5 text-[var(--muted)] transition-all hover:bg-[color-mix(in_srgb,var(--accent-cyan)_8%,transparent)] hover:text-[var(--accent-cyan)]"
              >
                <X size={15} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn('flex flex-col', msg.role === 'user' ? 'items-end' : 'items-start')}
                >
                  <div className={cn('flex items-start gap-2 max-w-[88%]', msg.role === 'user' && 'flex-row-reverse')}>
                    {msg.role === 'bot' && (
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md" style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent-cyan))' }}>
                        <Bot size={12} className="text-white" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'rounded-xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
                        msg.role === 'user'
                          ? 'text-white'
                          : 'text-[var(--text)]',
                      )}
                      style={
                        msg.role === 'user'
                          ? {
                              background: 'linear-gradient(135deg, var(--primary), var(--accent-cyan))',
                              boxShadow: '0 2px 8px color-mix(in srgb, var(--primary) 20%, transparent)',
                            }
                          : {
                              background: 'color-mix(in srgb, var(--accent-cyan) 6%, var(--surface))',
                              border: '1px solid color-mix(in srgb, var(--accent-cyan) 10%, var(--border))',
                            }
                      }
                    >
                      {msg.text}
                    </div>
                    {msg.role === 'user' && (
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md" style={{ background: 'color-mix(in srgb, var(--accent-cyan) 12%, var(--surface))' }}>
                        <User size={12} className="text-[var(--accent-cyan)]" />
                      </div>
                    )}
                  </div>
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 ml-8">
                      {msg.suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => sendMessage(s)}
                          className="flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-all whitespace-nowrap"
                          style={{
                            borderColor: 'color-mix(in srgb, var(--accent-cyan) 15%, var(--border))',
                            color: 'var(--accent-cyan)',
                            background: 'color-mix(in srgb, var(--accent-cyan) 6%, transparent)',
                          }}
                        >
                          <ExternalLink size={10} />
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                  <div className="flex items-start gap-2 max-w-[85%]">
                    <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md" style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent-cyan))' }}>
                      <Bot size={12} className="text-white" />
                    </div>
                    <div
                      className="rounded-xl px-4 py-3"
                      style={{
                        background: 'color-mix(in srgb, var(--accent-cyan) 6%, var(--surface))',
                        border: '1px solid color-mix(in srgb, var(--accent-cyan) 10%, var(--border))',
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <motion.span className="h-1.5 w-1.5 rounded-full bg-[var(--muted)]" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} />
                        <motion.span className="h-1.5 w-1.5 rounded-full bg-[var(--muted)]" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} />
                        <motion.span className="h-1.5 w-1.5 rounded-full bg-[var(--muted)]" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            <div
              className="shrink-0 px-4 py-3"
              style={{
                borderTop: '1px solid color-mix(in srgb, var(--accent-cyan) 10%, var(--border))',
                background: 'color-mix(in srgb, var(--accent-cyan) 3%, transparent)',
              }}
            >
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about PayFlow..."
                  className="flex-1 rounded-xl border bg-transparent px-3.5 py-2.5 text-sm outline-none transition-all placeholder:text-[var(--muted)]"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--accent-cyan) 12%, var(--border))',
                    color: 'var(--text)',
                  }}
                />
                <motion.button
                  onClick={() => sendMessage()}
                  whileTap={{ scale: 0.9 }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white transition-all"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary), var(--accent-cyan))',
                    boxShadow: '0 0 12px color-mix(in srgb, var(--primary) 20%, transparent)',
                    opacity: input.trim() ? 1 : 0.5,
                  }}
                  disabled={!input.trim() || isTyping}
                >
                  {isTyping ? <Sparkles size={15} /> : <Send size={14} />}
                </motion.button>
              </div>
              <p className="mt-1.5 text-[9px] font-mono text-[var(--muted)] text-center tracking-wider">Powered by PayFlow AI</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
