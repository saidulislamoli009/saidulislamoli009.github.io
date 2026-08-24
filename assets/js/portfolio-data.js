/**
 * SAIDUL ISLAM - PORTFOLIO DATA ENGINE & STORAGE MANAGER
 * Provides default data and seamless localStorage synchronization.
 */

const DEFAULT_PORTFOLIO_DATA = {
  profile: {
    name: "Saidul Islam",
    alternateName: "Saidul Islam (Oli)",
    primaryTitle: "ERP Support Specialist, Network Administrator & IT Officer",
    heroBadge: "Available • Barishal & Dhaka",
    heroHeadlinePart1: "Architecting Scalable",
    heroHeadlineGradient: "ERP Systems & Networks",
    heroHeadlinePart2: "For Enterprise Agility.",
    heroSummary: "IT Professional specializing in Warehouse, Production, HRM & Payroll ERP Implementation & Support, MikroTik RouterOS Enterprise Network Administration, GPON ISP Architecture, and modern Flutter & Firebase Mobile Solutions.",
    avatar: "assets/images/saidul-avatar.jpg",
    email: "saidulislamoli009@gmail.com",
    phone1: "+880 1799-239023",
    phone2: "+880 1755-520859",
    whatsapp: "8801799239023",
    location: "Uttar Lamchori, Charbaria, Barishal Sadar, Barishal",
    portfolioUrl: "https://saidulislamoli009.github.io",
    linkedin: "https://www.linkedin.com/in/saidul-islam-8673ba303",
    github: "https://github.com/saidulislamoli009"
  },
  stats: {
    careerStartDate: "2021-11-01",
    manualYearsExp: "4.8",
    autoCalcExp: true,
    projectsCount: "15",
    goLiveRate: "100",
    uptimeRate: "99.9"
  },
  competencies: [
    {
      id: "comp-1",
      code: "ERP 01",
      icon: "warehouse",
      title: "Enterprise ERP Modules",
      description: "End-to-end configuration, module support, and business logic execution.",
      tags: [
        { icon: "inventory_2", text: "Warehouse & Stock", color: "text-primary" },
        { icon: "precision_manufacturing", text: "Production BOM", color: "text-accent-cyan" },
        { icon: "badge", text: "HRM & Payroll", color: "text-emerald-400" },
        { icon: "shopping_cart", text: "Purchase & SCM", color: "text-purple-400" }
      ]
    },
    {
      id: "comp-2",
      code: "NET 02",
      icon: "router",
      title: "MikroTik & Routing",
      description: "Industrial MikroTik RouterOS routing, packet filtering, and bandwidth control.",
      tags: [
        { icon: "alt_route", text: "BGP & OSPF Routing", color: "text-accent-cyan" },
        { icon: "security", text: "Firewall & NAT", color: "text-primary" },
        { icon: "vpn_key", text: "WireGuard / VPN", color: "text-emerald-400" },
        { icon: "balance", text: "Multi-WAN Load Balancing", color: "text-sky-400" }
      ]
    },
    {
      id: "comp-3",
      code: "OPT 03",
      icon: "settings_ethernet",
      title: "GPON & Optical Telecom",
      description: "FTTx carrier-grade fiber optic distribution, OLT/ONU nodes, and BDIX peering.",
      tags: [
        { icon: "hub", text: "GPON OLT / ONU", color: "text-emerald-400" },
        { icon: "cable", text: "FTTx Fiber Splicing", color: "text-accent-cyan" },
        { icon: "speed", text: "BDIX & GGC Peering", color: "text-primary" },
        { icon: "videocam", text: "CCTV Surveillance", color: "text-purple-400" }
      ]
    },
    {
      id: "comp-4",
      code: "APP 04",
      icon: "flutter",
      isFontAwesome: true,
      title: "Flutter & Cloud Suite",
      description: "Modern cross-platform mobile apps with cloud realtime synchronization.",
      tags: [
        { isFontAwesome: true, iconClass: "fa-brands fa-flutter", text: "Flutter & Dart", color: "text-accent-cyan" },
        { isFontAwesome: true, iconClass: "fa-solid fa-fire", text: "Cloud Firestore", color: "text-amber-400" },
        { icon: "api", text: "REST APIs & JSON", color: "text-emerald-400" },
        { icon: "lock", text: "Firebase Auth", color: "text-purple-400" }
      ]
    }
  ],
  erpModules: [
    {
      id: "erp-1",
      title: "Warehouse & Inventory Management",
      category: "Logistics",
      icon: "warehouse",
      colorTheme: "primary",
      description: "Multi-warehouse stock tracking, bin location setup, FIFO/LIFO valuation, stock adjustments, batch/serial movement, and automated minimum reorder thresholds.",
      checks: ["Bin Allocation", "Stock Valuation"],
      tags: ["Bin Allocation", "Stock Valuation", "Reorder Alerts"]
    },
    {
      id: "erp-2",
      title: "Production Management System",
      category: "Manufacturing",
      icon: "precision_manufacturing",
      colorTheme: "accent-cyan",
      description: "Bill of Materials (BOM) creation, shop-floor order routing, Work-in-Progress (WIP) tracking, batch yield analysis, machine downtime logging, and finish-goods handover.",
      checks: ["BOM & Routing", "WIP Tracking"],
      tags: ["BOM Routing", "WIP Tracking", "Line Yields"]
    },
    {
      id: "erp-3",
      title: "HRM & Payroll Engine",
      category: "Human Resources",
      icon: "badge",
      colorTheme: "emerald",
      description: "Biometric attendance sync, shift & roster scheduling, leave management, overtime rules, provident fund, tax deductions, and automated monthly salary disbursement.",
      checks: ["Biometric Sync", "Salary Engine"],
      tags: ["Biometric Sync", "Payroll Calculation", "Overtime Roster"]
    },
    {
      id: "erp-4",
      title: "Purchase & Procurement Module",
      category: "Supply Chain",
      icon: "shopping_cart",
      colorTheme: "purple",
      description: "Purchase Requisition (PR) to Purchase Order (PO) workflows, supplier quotation comparisons, Goods Received Note (GRN) verification, and QC inspection pass.",
      checks: ["PO Approval", "GRN Audit"],
      tags: ["PO Workflow", "GRN Audit", "Vendor Analysis"]
    },
    {
      id: "erp-5",
      title: "MIS Reporting & Data Analytics",
      category: "BI Analytics",
      icon: "analytics",
      colorTheme: "sky",
      description: "Executive Management Information System (MIS) reporting, custom SQL query extraction, daily sales/production digests, inventory valuation summaries for CXOs.",
      checks: ["Custom SQL", "CXO Digests"],
      tags: ["Custom SQL", "Executive Dashboards", "Daily Summaries"]
    },
    {
      id: "erp-6",
      title: "ERP Go-Live & User Training",
      category: "Operations",
      icon: "support_agent",
      colorTheme: "amber",
      description: "End-user training workshops across factories, SOP documentation, user permission audits, database backup schedules, and rapid L2/L3 issue resolution.",
      checks: ["Go-Live Rollout", "User SOPs"],
      tags: ["Go-Live Rollout", "User SOPs", "Rapid Support"]
    }
  ],
  networking: [
    {
      id: "net-1",
      title: "MikroTik RouterOS & Security",
      icon: "dns",
      colorTheme: "cyan",
      description: "Static & dynamic routing (BGP, OSPF), VLAN segmentation, firewall filtering, NAT/Mangle, bandwidth queues, and site-to-site VPN tunnels.",
      tags: ["BGP / OSPF", "VPN Tunnels"]
    },
    {
      id: "net-2",
      title: "GPON & FTTx ISP Architecture",
      icon: "settings_ethernet",
      colorTheme: "purple",
      description: "GPON/EPON OLT & ONU configuration, optical fiber distribution, power loss testing, fiber splicing, and BDIX peering optimization.",
      tags: ["OLT / ONU", "Fiber Splicing"]
    },
    {
      id: "net-3",
      title: "CCTV & Surveillance Infrastructure",
      icon: "videocam",
      colorTheme: "emerald",
      description: "IP camera deployment, DVR/NVR configuration, remote surveillance streaming, biometric access control, and hardware maintenance.",
      tags: ["NVR / DVR", "Access Control"]
    }
  ],
  apps: [
    {
      id: "app-1",
      name: "ZenPDF",
      badge: "Workspace Studio",
      category: "Utility",
      icon: "picture_as_pdf",
      iconColor: "purple",
      image: "assets/images/app-zenpdf.jpg",
      modalTitle: "ZenPDF Pro Studio Suite",
      modalSubtitle: "Camera Scanner • OCR Text Extract • PDF Annotation • Flutter & Dart",
      description: "Complete PDF document utility suite featuring Camera to HD PDF scanning, PDF reader & annotation, Image-to-PDF conversion, and OCR Image-to-Text extraction.",
      tags: ["HD Doc Scanner", "OCR Text Extract", "PDF Viewer"],
      stackBadge: "Flutter • Firebase • Dart"
    },
    {
      id: "app-2",
      name: "ZenWalls",
      badge: "4K Wallpaper Hub",
      category: "Media",
      icon: "wallpaper",
      iconColor: "pink",
      image: "assets/images/app-zenwalls.jpg",
      modalTitle: "ZenWalls 4K Wallpaper Hub",
      modalSubtitle: "Curated Wallpapers • Categorized Gallery • Fast Downloads • Flutter & Cloud Storage",
      description: "Premium wallpaper discovery app with categories for Nature, Ocean, Space, and Aurora. Features Editor's Choice carousel, favorites, and 1-tap wallpaper application.",
      tags: ["Curated Gallery", "Fast Download", "Favorites Sync"],
      stackBadge: "Flutter • Firestore • Cloud"
    },
    {
      id: "app-3",
      name: "Zen Movie",
      badge: "DhakaFlix BDIX",
      category: "Streaming",
      icon: "movie",
      iconColor: "amber",
      image: "assets/images/app-zenmovie.jpg",
      modalTitle: "Zen Movie (DhakaFlix BDIX)",
      modalSubtitle: "Ultra-Fast BDIX Streaming • Free BD VPN • IMDb Top 250 • Flutter & Peering Protocols",
      description: "High-speed BDIX video streaming app with integrated Free BD VPN, IMDb Top 250 collection, multi-genre filtering (English, Hindi, Bangla, Animation, South Indian).",
      tags: ["BDIX Ultra-Speed", "Free BD VPN", "IMDb Top 250"],
      stackBadge: "Flutter • BDIX APIs • ExoPlayer"
    }
  ],
  experience: [
    {
      id: "exp-1",
      role: "IT Officer",
      company: "MEP Group Limited",
      duration: "Aug 2023 – Present",
      icon: "apartment",
      colorTheme: "primary",
      responsibilities: [
        "Delivered complete ERP implementation, functional support, user training, and troubleshooting for HRM, Production, Warehouse, Purchase, and MIS reporting modules.",
        "Configured and managed enterprise MikroTik RouterOS (Routing, Firewall security, Site-to-Site VPN, NAT, Bandwidth QoS).",
        "Deployed CCTV surveillance networks and managed enterprise IT asset inventories across factories."
      ],
      promotion: "Promoted within 1 year of joining after confirmation for exceptional performance.",
      achievements: [
        "Successfully supported ERP Go-Live project.",
        "Reduced system downtime through proactive troubleshooting.",
        "Provided technical training to ERP users."
      ],
      tags: ["Warehouse ERP", "Production ERP", "HRM & Payroll", "MikroTik ROS"]
    },
    {
      id: "exp-2",
      role: "System Administrator",
      company: "AL-Mugni Information & Tech (ISP)",
      duration: "Nov 2021 – Jul 2023",
      icon: "cell_tower",
      colorTheme: "purple",
      responsibilities: [
        "Engineered and maintained FTTx fiber optic distribution networks across multiple geographic segments.",
        "Configured GPON OLT & ONU systems, enterprise wireless links, and optimized traffic routing across BDIX and GGC caches.",
        "Maintained MikroTik BGP, OSPF, and Firewall filtering with near-zero latency and high service uptime."
      ],
      promotion: null,
      achievements: [
        "Improved network uptime and service reliability.",
        "Successfully deployed multiple GPON network segments."
      ],
      tags: ["GPON / EPON", "FTTx Fiber", "BDIX Peering", "MikroTik BGP"]
    },
    {
      id: "exp-3",
      role: "Mobile App Developer",
      company: "Flutter & Firebase Solutions",
      duration: "2023 – Present",
      icon: "flutter",
      isFontAwesome: true,
      colorTheme: "primary",
      responsibilities: [
        "Architected production mobile applications: ZenPDF (Doc Scanner & OCR), ZenWalls (4K Wallpaper Hub), and Zen Movie (DhakaFlix BDIX Streaming).",
        "Integrated Cloud Firestore real-time database, Firebase Authentication, Cloud Storage, and REST APIs."
      ],
      promotion: null,
      achievements: [
        "Delivered responsive, reactive UI apps with 60fps animations.",
        "Implemented real-time synchronization with cloud databases."
      ],
      tags: ["Flutter & Dart", "Firebase Auth", "Cloud Firestore"]
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.Sc. in Computer Science & Engineering (CSE)",
      institution: "University of Global Village (UGV), Barisal",
      passingYear: "2026",
      cgpa: "3.01 / 4.00",
      badgeColor: "brand-cyan"
    },
    {
      id: "edu-2",
      degree: "Diploma in Engineering (Computer Technology)",
      institution: "Barguna Polytechnic Institute",
      passingYear: "2021",
      cgpa: "3.56 / 4.00",
      badgeColor: "brand-emerald"
    }
  ],
  credentials: [
    {
      id: "cred-1",
      title: "Cisco Certified Network Associate (CCNA)",
      institution: "Genuity Training Center",
      year: "2020",
      icon: "network_check"
    }
  ],
  references: [
    {
      id: "ref-1",
      name: "Md. Mustafejur Rahman",
      designation: "Deputy Manager (IT), Akij Group",
      phone: "01310267109",
      color: "brand-cyan"
    },
    {
      id: "ref-2",
      name: "Md. Touqir Rahman",
      designation: "Deputy Manager (HR), MEP Group Limited",
      phone: "01722772249",
      color: "purple-400"
    }
  ],
  bioData: {
    fullName: "Saidul Islam",
    fatherName: "Yousuf Ali",
    motherName: "Nasima Akter",
    dob: "October 20, 2000",
    gender: "Male",
    nationality: "Bangladeshi",
    maritalStatus: "Married",
    nid: "5562375013",
    address: "Vill: Uttar Lamchori, P.O: Charbaria, P.S: Barisal Sadar, Dist: Barisal, Bangladesh",
    cvSummary: "IT Professional with 4.8+ years of experience in ERP Support, Network Administration, System Administration, ISP Operations, CCTV Systems, Fiber Optic Network Design, and Mobile Application Development. Experienced in MikroTik RouterOS, GPON OLT/ONU Management, ERP Implementation, Network Security, VPN Configuration, and Flutter/Firebase Solutions. Proven ability to troubleshoot complex technical issues and support business operations efficiently.",
    declaration: "I hereby declare that all the information provided is accurate to the best of my knowledge."
  },
  cvCompetencies: [
    "ERP Implementation & Deployment",
    "ERP User Support & Training",
    "ERP Module Configuration",
    "Business Process Analysis",
    "ERP Troubleshooting & Issue Resolution",
    "ERP Change Management",
    "HRM & Payroll System Management",
    "Production Management System Support",
    "Inventory & Warehouse Management",
    "IT Asset Management",
    "Mobile Application Development (Flutter)",
    "MIS Reporting & Data Analysis",
    "Network Administration",
    "MikroTik RouterOS Administration",
    "Routing & Switching (BGP, OSPF)",
    "Firewall & Network Security",
    "LAN/WAN Infrastructure",
    "VPN Configuration & Remote Access",
    "GPON & FTTx Network Management",
    "CCTV & Surveillance Systems",
    "IT Infrastructure Management",
    "Technical Support & Help Desk Operations"
  ]
};

const STORAGE_KEY = 'saidul_portfolio_custom_data';
const PIN_STORAGE_KEY = 'saidul_admin_pin';
const DEFAULT_PIN = '1234';

/**
 * Get current portfolio data (Customized from localStorage or defaults)
 */
function getPortfolioData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return deepMerge(DEFAULT_PORTFOLIO_DATA, parsed);
    }
  } catch (e) {
    console.error('Error loading portfolio data from storage, falling back to default:', e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
}

/**
 * Save custom portfolio data to localStorage
 */
function savePortfolioData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Error saving portfolio data to localStorage:', e);
    return false;
  }
}

/**
 * Reset portfolio data to original defaults
 */
function resetPortfolioData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    console.error('Error resetting portfolio data:', e);
    return false;
  }
}

const EMAIL_STORAGE_KEY = 'saidul_admin_email';
const PASS_STORAGE_KEY = 'saidul_admin_password';
const DEFAULT_EMAIL = 'saidulislamoli009@gmail.com';
const DEFAULT_PASS = 'admin123';

/**
 * Check or set admin security credentials
 */
function getAdminCredentials() {
  return {
    email: localStorage.getItem(EMAIL_STORAGE_KEY) || DEFAULT_EMAIL,
    password: localStorage.getItem(PASS_STORAGE_KEY) || DEFAULT_PASS
  };
}

function setAdminCredentials(newEmail, newPassword) {
  if (newEmail && newEmail.includes('@') && newPassword && newPassword.trim().length >= 4) {
    localStorage.setItem(EMAIL_STORAGE_KEY, newEmail.trim().toLowerCase());
    localStorage.setItem(PASS_STORAGE_KEY, newPassword.trim());
    return true;
  }
  return false;
}

function verifyAdminLogin(inputEmail, inputPassword) {
  const creds = getAdminCredentials();
  const emailMatch = inputEmail && inputEmail.trim().toLowerCase() === creds.email.toLowerCase();
  const passMatch = inputPassword && inputPassword.trim() === creds.password;
  // Also backward compatibility support for 1234 PIN as password or email fallback
  const pinMatch = inputPassword === getAdminPin() || inputPassword === '1234';
  return (emailMatch && passMatch) || (emailMatch && pinMatch);
}

function getAdminPin() {
  return localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_PIN;
}

function setAdminPin(newPin) {
  if (newPin && newPin.trim().length >= 4) {
    localStorage.setItem(PIN_STORAGE_KEY, newPin.trim());
    return true;
  }
  return false;
}

/**
 * Helper to deep merge objects
 */
function deepMerge(target, source) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}
