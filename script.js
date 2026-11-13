/* =========================================================
   BINARY / IP CONVERSION ACTIVITY — CONFIG
   Each phase is configured independently: enable/disable it and set its
   own question count (and, where relevant, its own bit width/decimal
   range/CIDR list) without affecting any other phase.
========================================================= */
const QUESTION_CONFIG = {
    // Phase 1: Decimal -> Binary
    phase1: {
        enabled: false,
        numQuestions: 5,
        bitWidth: 8,
        decMin: 0,
        decMax: 255
    },

    // Phase 2: Binary -> Decimal
    phase2: {
        enabled: false,
        numQuestions: 5,
        bitWidth: 8,
        decMin: 0,
        decMax: 255
    },

    // Phase 3: IP address, Decimal -> Binary
    phase3: {
        enabled: false,
        numQuestions: 4
    },

    // Phase 4: IP address, Binary -> Decimal
    phase4: {
        enabled: false,
        numQuestions: 4
    },

    // Phase 5: Subnet mask, CIDR -> dotted-decimal
    phase5: {
        enabled: false,
        numQuestions: 10,
        cidrList: "8,10,16,18,24,25,26,27,28,29,30"
    },

    // Phase 6: Subnet mask, dotted-decimal -> Binary
    phase6: {
        enabled: false,
        numQuestions: 10,
        cidrList: "8,10,16,18,24,25,26,27,28,29,30"
    },

    // Phase 7: classful CIDR identification — given an IP address, identify
    // its default CIDR prefix based on address class (A: 1–126 -> /8,
    // B: 128–191 -> /16, C: 192–223 -> /24). Loopback (127.x) is excluded.
    phase7: {
        enabled: false,
        numQuestions: 10
    },

    // Atom 1: The Constraint (Bit Question) — given a classful network and
    // a minimum subnets-OR-hosts requirement, the student borrows bits by
    // clicking a Panel-2-style bit grid until the requirement is exactly
    // satisfied. Scored like every other phase.
    atom1: {
        enabled: false,
        numQuestions: 10,
        // Restricts which classful address class(es) — 'A', 'B', and/or
        // 'C' — Atom 1's questions are drawn from. Same semantics as Atom
        // 5's own per-subtype allowedClasses: an empty array or omitting
        // this field draws from all three classes as before.
        allowedClasses: ['A', 'B', 'C']
    },

    // Atom 2: The Mask Assembly (Interesting Octet) — given a host IP and a
    // classless CIDR, the student assembles the subnet mask by toggling bits
    // in a Panel-2-style grid: classful bits are locked to 1 by default,
    // everything else starts at 0 and toggles independently on click. Graded
    // all-or-nothing, like Atom 1 (1 point total).
    atom2: {
        enabled: false,
        numQuestions: 10,
        // See Atom 1's own allowedClasses comment above — identical
        // semantics here.
        allowedClasses: ['A', 'B', 'C']
    },

    // Atom 3: The Space Map (Front & Back Subnets) — given a classful
    // network and a borrowed-bit count, the student clicks bits to build
    // the binary subnet ID for the first 4 and last 4 subnets in that
    // borrowed-bit range (8 rows total). Scored all-or-nothing (1 point),
    // like Atom 2.
    atom3: {
        enabled: false,
        numQuestions: 2,
        // Restricts which classful class(es) Atom 3 draws from. Atom 3
        // normally weights toward Class C for pedagogical reasons (see
        // ATOM3_CLASS_WEIGHTS) — when allowedClasses excludes a class,
        // that class's weight is dropped and the rest are renormalized
        // (see filterAtom3ClassWeights), so the remaining classes' relative
        // odds are preserved rather than just losing the excluded share.
        allowedClasses: ['B', 'C']
    },

    // Atom 4: The Boundaries — given one subnet ID, fill the remaining
    // host bits twice: all zeroes for the network ID and all ones for the
    // broadcast address. Host cells cycle ?, 0, 1, ? when clicked.
    atom4: {
        enabled: false,
        numQuestions: 1,
        // Restricts which classful class(es) Atom 4 draws from. Atom 4
        // normally sequences mostly-C -> B -> at most one A (see
        // atom4ClassRangeForQuestion) — when allowedClasses excludes a
        // class, that class is skipped in the sequence entirely.
        allowedClasses: ['C']
    },

    // Atom 5: Applied Scenarios — combines Atoms 1-4's underlying skills
    // (borrow-bit math, mask assembly, subnet/host enumeration) into
    // narrative word problems. There's no bit-grid interaction here: every
    // question is a single typed answer (a subnet/host count, a required
    // borrow count, a subnet mask, a network/broadcast address, or a
    // subnet index), graded all-or-nothing like Phase 7's class_cidr
    // questions.
    //
    // `enabled` is a master switch for the whole Atom (matches every other
    // phase/atom's own top-level toggle). Each of the 8 distinct question
    // subtypes Atom 5 can produce is then independently controllable via
    // `subTypes` — its own enabled flag, its own numQuestions, and its own
    // `allowedClasses` — instead of a single pooled numQuestions randomly
    // picking from all of them. Keys here must match the subType strings
    // genAtom5* generators emit (see ATOM5_SUBTYPE_GENERATORS below) and
    // the ATOM5_HINTS keys.
    //
    // `allowedClasses` restricts which classful address class(es) — 'A',
    // 'B', and/or 'C' — that subtype's questions are drawn from. Class is
    // a major difficulty lever independent of the subtype itself: Class A
    // leaves up to 24 subnet/host bits to reason about, Class B up to 16,
    // Class C only 8 — so without pinning this down, two students could be
    // handed the "same" question type at very different difficulty purely
    // from random class draw (unfair seeding), rather than from an
    // intentional difficulty choice. Set to any non-empty subset, e.g.
    // ['C'] to keep a subtype easy, or ['A','B'] to keep it hard; an empty
    // array or omitting the field draws from all three classes as before.
    atom5: {
        enabled: false,
        subTypes: {
            // "How many subnets does this network support?"
            supported_subnets: { enabled: true, numQuestions: 10, allowedClasses: ['A', 'B', 'C'] },
            // "How many usable hosts does each subnet support?"
            supported_hosts: { enabled: true, numQuestions: 10, allowedClasses: ['A', 'B', 'C'] },
            // "How many bits must be borrowed?"
            bits_required: { enabled: true, numQuestions: 10, allowedClasses: ['A', 'B', 'C'] },
            // "What is the subnet mask for this network?"
            subnet_mask: { enabled: true, numQuestions: 5, allowedClasses: ['A', 'B', 'C'] },
            // "How many subnets does this produce?" (given a host requirement)
            subnets_produced: { enabled: true, numQuestions: 3, allowedClasses: ['A', 'B', 'C'] },
            // "What is the network address of Subnet N?"
            network_address_of_subnet: { enabled: true, numQuestions: 2, allowedClasses: ['B', 'C'] },
            // "What is the broadcast address of Subnet N?"
            broadcast_address_of_subnet: { enabled: true, numQuestions: 3, allowedClasses: ['C'] },
            // "Which subnet index does this host belong to?"
            host_belongs_to_subnet: { enabled: true, numQuestions: 2, allowedClasses: ['C'] },
            // "How many bits were borrowed to create this network?"
            borrowed_bits_from_cidr: { enabled: true, numQuestions: 3, allowedClasses: ['A', 'B', 'C'] },
            // "What was the original (pre-subnet) classful network bit count?"
            original_network_bits: { enabled: true, numQuestions: 2, allowedClasses: ['A', 'B', 'C'] }
        }
    },

    // Atom 6: VLSM Planning — configuration-driven, progressively ordered
    // scenarios. Each level fixes only the desired difficulty envelope;
    // the generic generator derives LAN/WAN requirements, subnet sizes,
    // parent-network fit, allocation stages, and validation keys.
    atom6: {
        enabled: false,
        minLans: 3,
        maxLans: 5,
        minWans: 1,
        maxWans: 3,
        topology: {
            minRouters: 2,
            maxRouters: 4,
            maxLanPortsPerRouter: 2,
            maxWanPortsPerRouter: 2
        },
        wanRequirement: {
            requiredUsableIp: 2,
            allocationCidr: 30,
            // Every WAN is an individual network. All WAN /30 blocks must
            // come from the first remaining subnet large enough to produce
            // the complete configured WAN set; smaller subnets are skipped
            // and remain available.
            useSharedSourceSubnet: true,
            equivalentOrdering: true
        },
        lanProfiles: [
            { id: 'large', minHosts: 40, maxHosts: 120, weight: 2 },
            { id: 'medium', minHosts: 15, maxHosts: 39, weight: 3 },
            { id: 'small', minHosts: 5, maxHosts: 14, weight: 4 }
        ],
        lanNames: [
            'Administration', 'Computer Laboratory', 'Faculty', 'Library',
            'Records', 'Student Services', 'Accounting', 'Registrar',
            'Training Center', 'Research', 'Operations', 'Admissions'
        ],
        levels: [
            {
                id: 'foundation', label: 'Foundation', numQuestions: 4,
                routerCount: 2, lanCount: 3, wanCount: 1,
                lanPortsPerRouter: [2, 1],
                wanRouterPairs: [[1, 2]],
                parentPools: [
                    // Configured Class C practice pool. Starting at 193
                    // deliberately avoids the familiar 192.168.x.0 range.
                    { cidr: 24, octetRanges: [[193, 223], [0, 254], [0, 254], [0, 255]] }
                ]
            },
            {
                id: 'intermediate', label: 'Intermediate', numQuestions: 3,
                routerCount: 3, lanCount: 4, wanCount: 2,
                lanPortsPerRouter: [2, 1, 1],
                wanRouterPairs: [[1, 2], [2, 3]],
                parentPools: [
                    { cidr: 24, octetRanges: [[193, 223], [0, 254], [0, 254], [0, 255]] }
                ]
            },
            {
                id: 'advanced', label: 'Advanced', numQuestions: 3,
                routerCount: 4, lanCount: 5, wanCount: 3,
                lanPortsPerRouter: [2, 1, 1, 1],
                wanRouterPairs: [[1, 2], [2, 3], [3, 4]],
                parentPools: [
                    { cidr: 24, octetRanges: [[193, 223], [0, 254], [0, 254], [0, 255]] }
                ]
            }
        ],
        allocation: {
            requireSmallestValidCidr: true,
            requireContiguousChildren: true,
            acceptEquivalentLinkOrder: true
        },
        secondaryInformation: {
            showAvailableIp: true,
            showUsableIp: true
        }
    },

    // Atom 7: Packet Tracer Design Brief — one ungraded, read-only VLSM
    // requirement per student session. It deliberately reuses Atom 6's
    // scenario generator, while keeping every topology and seed parameter
    // here so instructors can author a different capstone without changing
    // the generator or renderer.
    atom7: {
        enabled: false,
        seed: {
            strategy: 'per-user-session',
            prefix: 'atom7-requirement',
            salt: 'packet-tracer-v1'
        },
        minLans: 5,
        maxLans: 5,
        minWans: 2,
        maxWans: 2,
        topology: {
            minRouters: 3,
            maxRouters: 3,
            maxLanPortsPerRouter: 2,
            maxWanPortsPerRouter: 2
        },
        wanRequirement: {
            requiredUsableIp: 2,
            allocationCidr: 30,
            useSharedSourceSubnet: true,
            equivalentOrdering: true
        },
        lanProfiles: [
            // These envelopes cap allocations at /26, /27, and /28 so even
            // the largest possible five-LAN combination plus two /30 WANs
            // fits inside the configured Class C /24 parent.
            { id: 'large', minHosts: 31, maxHosts: 60, weight: 2 },
            { id: 'medium', minHosts: 15, maxHosts: 30, weight: 3 },
            { id: 'small', minHosts: 5, maxHosts: 14, weight: 4 }
        ],
        lanNames: [
            'Admissions', 'Administration', 'Accounting', 'Computer Laboratory',
            'Faculty', 'Library', 'Operations', 'Records', 'Registrar',
            'Research', 'Student Services', 'Training Center'
        ],
        scenario: {
            id: 'packet-tracer-capstone',
            label: 'Packet Tracer Design',
            routerCount: 3,
            lanCount: 5,
            wanCount: 2,
            lanPortsPerRouter: [2, 1, 2],
            wanRouterPairs: [[1, 2], [2, 3]],
            parentPools: [
                // Configured Class C pool. Starting at 193 retains the project
                // convention of avoiding the familiar 192.168.x.0 range.
                { cidr: 24, octetRanges: [[193, 223], [0, 254], [0, 254], [0, 255]] }
            ]
        },
        brief: {
            title: 'Plan and Implement This Network',
            description: 'Create a complete VLSM addressing plan outside Subnetacad, then build and test the design in Packet Tracer.',
            deliverables: [
                'A VLSM plan for every listed LAN and WAN',
                'A Packet Tracer implementation of the generated topology',
                'Working addressing and end-to-end connectivity across the network'
            ]
        }
    },

    // Atom 8: scored in-app deployment of the exact Atom 7 scenario.
    // Students may submit any internally valid VLSM design; the validator
    // checks capacity, containment, uniqueness, gateways, WANs, and static
    // routes instead of comparing against Atom 6's canonical allocation.
    atom8: {
        enabled: false,
        representativeHosts: { min: 2, max: 3 },
        initialRouteEntries: 1,
        maxStaticRoutesPerRouter: 12,
        wanCidr: 30,
        dceClockRate: 64000,
        routing: 'static',
        answerKey: {
            // Temporary instructor/demo utility for ATOM 8 ONLY. Atom 9 has
            // its own independent setting (QUESTION_CONFIG.atom9.answerKey).
            // Set to false to remove the button without changing the
            // renderer or validation.
            showPopulateButton: true
        },
        // Read-only subnet diagram (parent network -> subnet of subnet ->
        // ...). It reveals the VLSM plan, so it is OFF for Atom 8 and, when
        // enabled, hidden in Exam mode unless showInExam is true.
        subnetDiagram: {
            enabled: false,
            showInExam: false
        },
        topologyView: {
            defaultZoom: 1,
            minZoom: 0.65,
            maxZoom: 1.4,
            zoomStep: 0.05,
            canvasHeight: 500
        },
        connectivityTest: {
            enabled: true,
            autoSendDefault: true,
            selfTestRunAllEnabled: true,
            defaultSpeed: 1,
            minSpeed: 0.5,
            maxSpeed: 2,
            speedStep: 0.25,
            hopDurationMs: 650,
            turnaroundDelayMs: 350,
            officialTestCases: {
                enabled: true,
                runAllEnabled: true,
                pointsPerCase: 5,
                seedSalt: 'official-connectivity-v1',
                randomizeDirection: true,
                randomizeRepresentativeHosts: true,
                generation: {
                    oneCasePerLan: true,
                    allSameRouterLanPairs: true,
                    allDifferentRouterLanPairs: true
                }
            }
        },
        lanInterfaceNames: [
            ['GigabitEthernet0/0', 'GigabitEthernet0/1'],
            ['GigabitEthernet0/0'],
            ['GigabitEthernet0/0', 'GigabitEthernet0/1']
        ],
        lanInterfaceShortNames: [
            ['Ga0/0', 'Ga0/1'],
            ['Ga0/0'],
            ['Ga0/0', 'Ga0/1']
        ],
        wanInterfaceNames: [
            ['Serial0/0/0'],
            ['Serial0/0/0', 'Serial0/0/1'],
            ['Serial0/0/0']
        ],
        wanInterfaceShortNames: [
            ['Se0/0/0'],
            ['Se0/0/0', 'Se0/0/1'],
            ['Se0/0/0']
        ],
        dceRouterByWan: [1, 2]
    },

    // Atom 9: five standalone, progressively harder in-app deployment
    // items. It reuses Atom 8's device/configuration/testing engine, but
    // every item owns its scenario, answers, official suite, and score.
    atom9: {
        enabled: true,
        seed: {
            salt: 'standalone-deployment-v1'
        },
        // Per-atom switches. Atom 9 no longer inherits atom8.answerKey.
        answerKey: {
            showPopulateButton: true
        },
        subnetDiagram: {
            enabled: true,
            showInExam: false
        },
        minLans: 2,
        maxLans: 6,
        minWans: 0,
        maxWans: 3,
        topology: {
            minRouters: 1,
            maxRouters: 4,
            maxLanPortsPerRouter: 2,
            maxWanPortsPerRouter: 2
        },
        wanRequirement: {
            requiredUsableIp: 2,
            allocationCidr: 30,
            useSharedSourceSubnet: true,
            equivalentOrdering: true
        },
        // These ranges keep every generated six-LAN item feasible inside a
        // Class C /24 while still producing visibly different VLSM blocks.
        lanProfiles: [
            { id: 'large', minHosts: 20, maxHosts: 30, weight: 2 },
            { id: 'medium', minHosts: 10, maxHosts: 19, weight: 3 },
            { id: 'small', minHosts: 5, maxHosts: 9, weight: 4 }
        ],
        lanNames: [
            'Admissions', 'Administration', 'Accounting', 'Computer Laboratory',
            'Faculty', 'Library', 'Operations', 'Records', 'Registrar',
            'Research', 'Student Services', 'Training Center'
        ],
        randomizeLanRouterAssignment: true,
        items: [
            {
                id: 'single-router', label: 'Item 1 · Local Routing',
                routerCount: 1, lanCount: 2, wanCount: 0,
                lanPortsPerRouter: [2], wanRouterPairs: []
            },
            {
                id: 'two-router-basic', label: 'Item 2 · First WAN',
                routerCount: 2, lanCount: 2, wanCount: 1,
                lanPortsPerRouter: [1, 1], wanRouterPairs: [[1, 2]]
            },
            {
                id: 'two-router-full', label: 'Item 3 · Dual LAN Routers',
                routerCount: 2, lanCount: 4, wanCount: 1,
                lanPortsPerRouter: [2, 2], wanRouterPairs: [[1, 2]]
            },
            {
                id: 'three-router-chain', label: 'Item 4 · Three-Router Chain',
                routerCount: 3, lanCount: 3, wanCount: 2,
                lanPortsPerRouter: [1, 1, 1], wanRouterPairs: [[1, 2], [2, 3]]
            },
            {
                id: 'four-router-capstone', label: 'Item 5 · Four-Router Capstone',
                routerCount: 4, lanCount: 6, wanCount: 3,
                lanPortsPerRouter: [2, 2, 1, 1], wanRouterPairs: [[1, 2], [2, 3], [3, 4]]
            }
        ],
        parentPools: [
            { cidr: 24, octetRanges: [[193, 223], [0, 254], [0, 254], [0, 255]] }
        ]
    },

    // Grading
    strictLeadingZeros: true // binary answers must match bit-width exactly
};

let studentDatabase = [];
let exerciseData = {}; 
let currentFile = "";
let currentUser = "";

// Settings and Mode Management
let appSettings = {
    mode: 'practice', // 'practice' or 'exam'
    persistenceEnabled: true,
    timerEnabled: false,
    timerMinutes: 120,
    autoShowSample: true, // whether the console panel auto-opens when an exercise has sample output; device-based default set below
    practiceQuestionMode: 'fixed' // 'fixed' (shared set) or 'random' (a per-student set that remains until deliberately replaced)
};

const APP_PREFERENCES_STORAGE_KEY = 'subnetacadAppPreferences';
const LOCAL_SESSION_SCHEMA_VERSION = 3;

// Holds the persisted seed for random Practice mode. It is restored before
// question generation so refreshes and later logins rebuild the exact same
// scenarios before the saved answers and scores are applied.
let currentPracticeSeed = null;
let currentQuestionSeed = null;
let currentAtom7Seed = null;
let currentAtom7SeedOwner = null;
let currentAtom9Seed = null;
let currentAtom9SeedOwner = null;
let atom7Scenario = null;
let atom8Model = null;
let atom8GeneratedOfficialCases = [];
let atom9QuestionIds = [];
let atom9ActiveIndex = 0;
let activeDeploymentExerciseKey = 'atom8-main';

// Builds a seed string that's different on every call — timestamp plus a
// random component, so even two logins in the same millisecond can't
// collide.
function generateRandomPracticeSeed() {
    return `practice-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
}

function generateAtom7Seed() {
    const cfg = QUESTION_CONFIG.atom7?.seed || {};
    const prefix = String(cfg.prefix || 'atom7-requirement');
    if (cfg.strategy === 'shared') {
        return String(cfg.value || `${prefix}-shared`);
    }
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
}

function generateAtom9Seed() {
    const cfg = QUESTION_CONFIG.atom9?.seed || {};
    return `atom9-${String(cfg.salt || 'standalone')}-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
}

function loadAppPreferences() {
    try {
        const raw = localStorage.getItem(APP_PREFERENCES_STORAGE_KEY);
        const saved = raw ? JSON.parse(raw) : null;
        if (saved && ['practice', 'exam'].includes(saved.mode)) {
            appSettings.mode = saved.mode;
        }
        if (saved && ['fixed', 'random'].includes(saved.practiceQuestionMode)) {
            appSettings.practiceQuestionMode = saved.practiceQuestionMode;
        }
        if (saved && typeof saved.persistenceEnabled === 'boolean') appSettings.persistenceEnabled = saved.persistenceEnabled;
        if (saved && typeof saved.timerEnabled === 'boolean') appSettings.timerEnabled = saved.timerEnabled;
        if (saved && Number.isInteger(saved.timerMinutes) && saved.timerMinutes >= 1 && saved.timerMinutes <= 999) {
            appSettings.timerMinutes = saved.timerMinutes;
        }
    } catch (err) {
        console.warn('Could not load app preferences:', err);
    }
}

function saveAppPreferences() {
    try {
        localStorage.setItem(APP_PREFERENCES_STORAGE_KEY, JSON.stringify({
            mode: appSettings.mode,
            practiceQuestionMode: appSettings.practiceQuestionMode,
            persistenceEnabled: appSettings.persistenceEnabled,
            timerEnabled: appSettings.timerEnabled,
            timerMinutes: appSettings.timerMinutes
        }));
    } catch (err) {
        console.warn('Could not save app preferences:', err);
    }
}

let timerIntervalId = null;
let timeRemaining = 0; // in seconds
let examEndTimestamp = null; // epoch ms the optional activity timer expires; persisted per student when local progress is enabled
let sessionTimedOut = false;

function isRetryAllowed() {
    return appSettings.mode === 'practice' && !sessionTimedOut;
}

window.onload = async function() {
    loadAppPreferences();
    // Native HTML5 drag-and-drop (used for line ordering) does not fire on
    // touchscreens. Flag touch devices so CSS can hide the drag handle and
    // reveal the Up/Down buttons and Jump-to dropdown instead.
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    }

    // The sidebar defaults to open on desktop and closed on mobile, so the
    // hamburger button's label needs to match whichever is current.
    initSidebarToggleLabel();

    // The global "auto-show sample output" setting defaults to ON on
    // desktop (room to show it automatically) and OFF on mobile (screen
    // space is tight). It's a one-time default only — from here on it's a
    // normal setting the student can flip in the Settings modal, and the
    // drawer tab is always available to pull the console into view by hand
    // regardless of this setting.
    initSampleAutoShowDefault();

    try {
        const res = await fetch('students.csv');
        const text = await res.text();
        const rows = text.split('\n').slice(1);
        studentDatabase = rows.map(row => {
            const [email, id] = row.split(',');
            return { email: email?.trim(), id: id?.trim() };
        });
    } catch (err) { console.error("Database failed to load."); }
};

// --- HAMBURGER MENU / OFF-CANVAS SIDEBAR (mobile: overlay) ---
function openSidebar() {
    document.getElementById('sidebarNav').classList.add('sidebar-open');
    document.getElementById('sidebarBackdrop').classList.add('show');
    document.getElementById('sidebarToggleBtn').setAttribute('aria-expanded', 'true');
    document.getElementById('sidebarToggleBtn').setAttribute('aria-label', 'Hide exercise list');
    // Prevent the page behind the panel from scrolling while it's open
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    document.getElementById('sidebarNav').classList.remove('sidebar-open');
    document.getElementById('sidebarBackdrop').classList.remove('show');
    document.getElementById('sidebarToggleBtn').setAttribute('aria-expanded', 'false');
    document.getElementById('sidebarToggleBtn').setAttribute('aria-label', 'Show exercise list');
    document.body.style.overflow = '';
}

// --- LIVE TIMESTAMP (day, date, time — seconds re-animate on every tick) ---
function startUserClock() {
    updateUserTimestamp();
    setInterval(updateUserTimestamp, 1000);
}

function updateUserTimestamp() {
    const el = document.getElementById('userTimestamp');
    if (!el) return;

    const now = new Date();
    const dayName = now.toLocaleDateString(undefined, { weekday: 'long' });
    const dateStr = now.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });

    let hours = now.getHours();
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    el.innerHTML = `<div class="timestamp-date">${dayName}, ${dateStr}</div><div class="timestamp-time">${hours}:${minutes}<span class="timestamp-seconds" id="timestampSeconds">:${seconds}</span> ${period}</div>`;

    // Restart the pulse animation each tick so the seconds visibly "beat"
    // in sync with the clock, rather than animating once and going static.
    const secondsEl = document.getElementById('timestampSeconds');
    if (secondsEl) {
        secondsEl.classList.remove('tick');
        void secondsEl.offsetWidth; // force reflow to restart the CSS animation
        secondsEl.classList.add('tick');
    }
}

// --- SIDEBAR WATERMARK (screenshot deterrent) ---
// Renders a faint, randomly-generated QR-code-like pattern behind the
// sidebar. It isn't a real scannable code — it's just visual noise meant
// to make it obvious/awkward if a student tries to pass off an edited
// screenshot of their scores as the genuine app, since a fresh random
// pattern is drawn every login and a doctored screenshot would need to
// fake it convincingly too.
function classifyQrModule(x, y, moduleCount) {
    // Three finder-pattern corners (top-left, top-right, bottom-left),
    // each with a 1-module quiet border, like a real QR code.
    const finderZones = [
        { x0: 0, y0: 0 },
        { x0: moduleCount - 7, y0: 0 },
        { x0: 0, y0: moduleCount - 7 }
    ];

    for (const zone of finderZones) {
        const lx = x - zone.x0;
        const ly = y - zone.y0;
        if (lx >= -1 && lx <= 7 && ly >= -1 && ly <= 7) {
            if (lx < 0 || lx > 6 || ly < 0 || ly > 6) return 'blank'; // quiet zone
            const onBorder = (lx === 0 || lx === 6 || ly === 0 || ly === 6);
            const inCenter = (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4);
            return (onBorder || inCenter) ? 'filled' : 'blank';
        }
    }

    // Timing strips: alternating modules along row/column 6, outside the finders
    if (y === 6 || x === 6) {
        return ((x + y) % 2 === 0) ? 'filled' : 'blank';
    }

    return 'data';
}

function generateQrWatermarkDataUrl() {
    const moduleCount = 21;
    const moduleSize = 6;
    const size = moduleCount * moduleSize;

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = 'rgba(98, 0, 238, 0.05)'; // subtle — matches the theme's primary color

    for (let y = 0; y < moduleCount; y++) {
        for (let x = 0; x < moduleCount; x++) {
            const type = classifyQrModule(x, y, moduleCount);
            let filled;
            if (type === 'filled') filled = true;
            else if (type === 'blank') filled = false;
            else filled = Math.random() < 0.42; // random "data" noise

            if (filled) {
                ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize);
            }
        }
    }

    return canvas.toDataURL('image/png');
}

function applySidebarWatermark() {
    const sidebar = document.getElementById('sidebarNav');
    if (!sidebar) return;
    sidebar.style.backgroundImage = `url(${generateQrWatermarkDataUrl()})`;
    sidebar.style.backgroundRepeat = 'repeat';
}

// --- SIDEBAR COLLAPSE (desktop: in-layout panel, no backdrop/scroll-lock) ---
function collapseDesktopSidebar() {
    document.getElementById('sidebarNav').classList.add('sidebar-collapsed');
    document.getElementById('sidebarToggleBtn').setAttribute('aria-expanded', 'false');
    document.getElementById('sidebarToggleBtn').setAttribute('aria-label', 'Show exercise list');
}

function expandDesktopSidebar() {
    document.getElementById('sidebarNav').classList.remove('sidebar-collapsed');
    document.getElementById('sidebarToggleBtn').setAttribute('aria-expanded', 'true');
    document.getElementById('sidebarToggleBtn').setAttribute('aria-label', 'Hide exercise list');
}

// Single entry point for the hamburger button. Behavior depends on viewport:
// on mobile the sidebar is an off-canvas overlay (hidden by default), on
// desktop it's a normal layout panel (visible by default) that can now be
// collapsed to reclaim horizontal space.
function toggleSidebar() {
    const sidebar = document.getElementById('sidebarNav');
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (isMobile) {
        if (sidebar.classList.contains('sidebar-open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    } else {
        if (sidebar.classList.contains('sidebar-collapsed')) {
            expandDesktopSidebar();
        } else {
            collapseDesktopSidebar();
        }
    }
}

// Set the hamburger button's initial label to match each breakpoint's
// default sidebar state (open on desktop, closed on mobile) — otherwise
// the aria-label baked into the HTML would only be correct for mobile.
function initSidebarToggleLabel() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const btn = document.getElementById('sidebarToggleBtn');
    if (!btn) return;
    if (isMobile) {
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Show exercise list');
    } else {
        btn.setAttribute('aria-expanded', 'true');
        btn.setAttribute('aria-label', 'Hide exercise list');
    }
}

// --- SAMPLE OUTPUT: GLOBAL AUTO-SHOW SETTING ---
// This is a global preference (configured in the Settings modal) rather
// than a per-exercise control: it decides whether the console panel opens
// automatically whenever the student switches to an activity that has
// sample output. Manually pulling the panel into view for any individual
// activity is handled separately by the drawer tab.
function initSampleAutoShowDefault() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    appSettings.autoShowSample = !isMobile;
}

function applyAutoShowForCurrentExercise() {
    if (!currentFile) return;
    const ex = exerciseData[currentFile];
    const hasSampleOutput = !!(ex && ex.sampleOutput && ex.sampleOutput.trim().length > 0);
    if (hasSampleOutput && appSettings.autoShowSample) {
        showSampleOutput(currentFile);
    } else {
        closeSampleOutputModal();
    }
}

// Close the off-canvas panel automatically after picking an exercise, but
// only on screens narrow enough that the sidebar is an overlay in the
// first place — on desktop the sidebar stays put (collapsing is a manual,
// explicit choice there, not something exercise selection should trigger).
function closeSidebarIfMobile() {
    if (window.matchMedia('(max-width: 768px)').matches) {
        closeSidebar();
    }
}

// Close on Escape for keyboard users (mobile overlay only — desktop's
// collapsed sidebar isn't a modal, so Escape shouldn't touch it)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const sidebar = document.getElementById('sidebarNav');
        if (sidebar && sidebar.classList.contains('sidebar-open')) {
            closeSidebar();
        }
        const consolePanel = document.getElementById('sampleOutputPanel');
        if (consolePanel && consolePanel.classList.contains('open')) {
            closeSampleOutputModal();
        }
        const hintModal = document.getElementById('atom5HintModal');
        if (hintModal && hintModal.style.display === 'block') {
            closeAtom5HintModal();
        }
        const atom8Modal = document.getElementById('atom8ConfigModal');
        if (atom8Modal && atom8Modal.style.display === 'block') {
            closeAtom8Modal();
        }
        document.querySelectorAll('.atom8-subnetmap-modal:not([hidden])').forEach(modal => {
            atom8CloseSubnetMap(modal);
        });
    }
});

async function handleLogin() {
    const email = document.getElementById('emailInput').value.trim();
    const id = document.getElementById('studentNumInput').value.trim();
    const user = studentDatabase.find(s => s.email === email && s.id === id);
    
    if (user) {
        currentUser = email;
        sessionTimedOut = false;
        document.getElementById('loginOverlay').style.display = 'none';
        document.getElementById('appContainer').style.display = 'flex';
        document.getElementById('userDisplay').textContent = email;
        startUserClock();
        applySidebarWatermark();

        const { session: resumedSession, isExpired } = await loadAllExercises();

        // Timing is independent of Practice/Exam mode. When enabled, resume
        // the saved fixed deadline instead of granting a fresh duration.
        if (appSettings.timerEnabled) {
            if (isExpired) {
                // Time was already up (or the exam was already completed)
                // before this login/reload — stay locked, no timer.
                stopTimer();
                document.getElementById('timerContainer').style.display = 'none';
                document.getElementById('actionButton').disabled = true;
                saveSessionProgress();
            } else if (resumedSession && typeof resumedSession.examEndTimestamp === 'number') {
                const remaining = Math.max(0, Math.round((resumedSession.examEndTimestamp - Date.now()) / 1000));
                startTimer(remaining);
            } else {
                startTimer();
            }
        } else {
            stopTimer();
        }
    } else {
        const errorEl = document.getElementById('loginError');
        errorEl.innerHTML = '<i class="fa-solid fa-circle-xmark" aria-hidden="true"></i> Invalid email or student number. Please try again.';
        errorEl.className = "error-text show";
    }
}

// --- PER-STUDENT DETERMINISTIC SHUFFLE ---
// Simple string hash -> 32-bit seed, used to seed a PRNG so the same
// student always gets the same "random" exercise order.
function hashStringToSeed(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // force 32-bit int
    }
    return hash >>> 0;
}

// mulberry32: small, fast, deterministic PRNG. Given the same seed it
// always produces the same sequence of numbers.
function mulberry32(seed) {
    return function () {
        seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// Returns a shuffled copy of `array`, seeded by `email` so that a given
// student always gets the same order (stable across reloads/resumed exam
// sessions), while different students get different orders from each other.
function shuffleExercisesForStudent(array, email) {
    const rng = mulberry32(hashStringToSeed(email || ''));
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

/* =========================================================
   BINARY / IP CONVERSION ACTIVITY — QUESTION GENERATION
   Ported from the standalone conversion-lab reference. Uses the
   same seeded mulberry32 PRNG already defined above, so a given
   seed string always reproduces the exact same question set.
========================================================= */
function randInt(rng, min, max) { return Math.floor(rng() * (max - min + 1)) + min; }
function pickRandom(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }

function genPhase1Questions(cfg, rng) {
    // Phase 1: Decimal -> Binary
    if (!cfg || !cfg.enabled || !cfg.numQuestions) return [];
    const bitWidth = parseInt(cfg.bitWidth, 10);
    const capMax = Math.pow(2, bitWidth) - 1;
    const min = Math.max(0, Math.min(cfg.decMin, capMax));
    const max = Math.max(min, Math.min(cfg.decMax, capMax));

    const out = [];
    for (let i = 0; i < cfg.numQuestions; i++) {
        const dec = randInt(rng, min, max);
        const bin = dec.toString(2).padStart(bitWidth, '0');
        out.push({
            type: 'd2b',
            promptHtml: `Convert the decimal number <b>${dec}</b> to <b>${bitWidth}-bit</b> binary.`,
            correct: bin, bitWidth, given: dec
        });
    }
    return out;
}

function genPhase2Questions(cfg, rng) {
    // Phase 2: Binary -> Decimal
    if (!cfg || !cfg.enabled || !cfg.numQuestions) return [];
    const bitWidth = parseInt(cfg.bitWidth, 10);
    const capMax = Math.pow(2, bitWidth) - 1;
    const min = Math.max(0, Math.min(cfg.decMin, capMax));
    const max = Math.max(min, Math.min(cfg.decMax, capMax));

    const out = [];
    for (let i = 0; i < cfg.numQuestions; i++) {
        const dec = randInt(rng, min, max);
        const bin = dec.toString(2).padStart(bitWidth, '0');
        out.push({
            type: 'b2d',
            promptHtml: `Convert the binary number below to decimal.`,
            correct: String(dec), bitWidth, given: bin
        });
    }
    return out;
}

function randomIP(rng) { return [randInt(rng, 0, 255), randInt(rng, 0, 255), randInt(rng, 0, 255), randInt(rng, 0, 255)]; }
function ipToBinDotted(ip) { return ip.map(o => o.toString(2).padStart(8, '0')).join('.'); }

function genPhase3Questions(cfg, rng) {
    // Phase 3: IP address, Decimal -> Binary
    if (!cfg || !cfg.enabled || !cfg.numQuestions) return [];
    const out = [];
    for (let i = 0; i < cfg.numQuestions; i++) {
        const ip = randomIP(rng);
        const decStr = ip.join('.');
        const binStr = ipToBinDotted(ip);
        out.push({ type: 'ip_d2b', promptHtml: `Convert the IP address <b>${decStr}</b> to binary (8 bits per octet).`, correct: binStr, given: decStr });
    }
    return out;
}

function genPhase4Questions(cfg, rng) {
    // Phase 4: IP address, Binary -> Decimal
    if (!cfg || !cfg.enabled || !cfg.numQuestions) return [];
    const out = [];
    for (let i = 0; i < cfg.numQuestions; i++) {
        const ip = randomIP(rng);
        const decStr = ip.join('.');
        const binStr = ipToBinDotted(ip);
        out.push({ type: 'ip_b2d', promptHtml: `Convert the binary IP address <b>${binStr}</b> to dotted-decimal.`, correct: decStr, given: binStr });
    }
    return out;
}

function genPhase5Questions(cfg, rng) {
    // Phase 5: Subnet mask, CIDR -> dotted-decimal
    if (!cfg || !cfg.enabled || !cfg.numQuestions) return [];
    const cidrOptions = (cfg.cidrList || "").split(',').map(x => parseInt(x.trim(), 10)).filter(n => !isNaN(n) && n >= 1 && n <= 32);
    if (cidrOptions.length === 0) return [];

    const out = [];
    for (let i = 0; i < cfg.numQuestions; i++) {
        const cidr = pickRandom(rng, cidrOptions);
        const maskBits = '1'.repeat(cidr) + '0'.repeat(32 - cidr);
        const octetsBin = [maskBits.substr(0, 8), maskBits.substr(8, 8), maskBits.substr(16, 8), maskBits.substr(24, 8)];
        const octetsDec = octetsBin.map(o => parseInt(o, 2));
        const decStr = octetsDec.join('.');
        out.push({ type: 'mask_c2d', promptHtml: `Convert the subnet mask <b>/${cidr}</b> (CIDR) to dotted-decimal notation.`, correct: decStr, given: cidr });
    }
    return out;
}

function genPhase6Questions(cfg, rng) {
    // Phase 6: Subnet mask, dotted-decimal -> Binary
    if (!cfg || !cfg.enabled || !cfg.numQuestions) return [];
    const cidrOptions = (cfg.cidrList || "").split(',').map(x => parseInt(x.trim(), 10)).filter(n => !isNaN(n) && n >= 1 && n <= 32);
    if (cidrOptions.length === 0) return [];

    const out = [];
    for (let i = 0; i < cfg.numQuestions; i++) {
        const cidr = pickRandom(rng, cidrOptions);
        const maskBits = '1'.repeat(cidr) + '0'.repeat(32 - cidr);
        const octetsBin = [maskBits.substr(0, 8), maskBits.substr(8, 8), maskBits.substr(16, 8), maskBits.substr(24, 8)];
        const octetsDec = octetsBin.map(o => parseInt(o, 2));
        const decStr = octetsDec.join('.');
        const binStr = octetsBin.join('.');
        out.push({ type: 'mask_d2b', promptHtml: `Convert the subnet mask <b>${decStr}</b> to binary (8 bits per octet).`, correct: binStr, given: decStr });
    }
    return out;
}

// --- CLASSFUL CIDR IDENTIFICATION (Phase 7) ---
// Given an IP address, the student identifies its default CIDR prefix
// based on the traditional IPv4 address class (A/B/C). Class D (224–239,
// multicast) and Class E (240–255, reserved) don't have a classful default
// mask, so they're never generated; 127.x.x.x (loopback) is skipped too.
const CLASSFUL_CIDR_RANGES = [
    { cls: 'A', min: 1, max: 126, cidr: 8 },   // 127 reserved for loopback
    { cls: 'B', min: 128, max: 191, cidr: 16 },
    { cls: 'C', min: 192, max: 223, cidr: 24 }
];

// Filters CLASSFUL_CIDR_RANGES down to just the class(es) an atom/subtype
// is configured to draw from (e.g. QUESTION_CONFIG.atom1.allowedClasses or
// QUESTION_CONFIG.atom5.subTypes.<subType>.allowedClasses — same shape,
// same rule, shared by every Atom). Class alone drives a big chunk of a
// question's difficulty — Class A leaves up to 24 subnet/host bits to
// reason about, Class C only 8 — so without this, two students could get
// "the same" question type at wildly different difficulty purely from
// random class draw, which is an unfair seeding difference rather than a
// real skill difference. Falls back to the full A/B/C pool whenever
// allowedClasses is missing, empty, or matches nothing (e.g. a typo'd
// class letter), so a misconfigured atom degrades to the old unrestricted
// behavior instead of silently generating zero questions.
function filterClassRangesByAllowed(allowedClasses) {
    if (!Array.isArray(allowedClasses) || !allowedClasses.length) return CLASSFUL_CIDR_RANGES;
    const filtered = CLASSFUL_CIDR_RANGES.filter(r => allowedClasses.includes(r.cls));
    return filtered.length ? filtered : CLASSFUL_CIDR_RANGES;
}

function randomIPInRange(rng, range) {
    const firstOctet = randInt(rng, range.min, range.max);
    const rest = [randInt(rng, 0, 255), randInt(rng, 0, 255), randInt(rng, 0, 255)];
    return [firstOctet, ...rest].join('.');
}

function genPhase7Questions(cfg, rng) {
    if (!cfg || !cfg.enabled || !cfg.numQuestions) return [];

    // Guarantee every class (A, B, C) appears at least once: assign classes
    // round-robin across the requested slots (so with numQuestions >= 3 each
    // class is covered, and any extra slots cycle back through A/B/C again),
    // then shuffle deterministically so the guaranteed A/B/C questions don't
    // always land in the first three slots or the same relative order.
    const assignments = [];
    for (let i = 0; i < cfg.numQuestions; i++) {
        assignments.push(CLASSFUL_CIDR_RANGES[i % CLASSFUL_CIDR_RANGES.length]);
    }
    for (let i = assignments.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [assignments[i], assignments[j]] = [assignments[j], assignments[i]];
    }

    return assignments.map(range => ({
        type: 'class_cidr',
        promptHtml: `Identify the CIDR notation based on IP address class.`,
        correct: String(range.cidr),
        given: randomIPInRange(rng, range)
    }));
}

// --- ATOM 1: THE CONSTRAINT (BIT QUESTION) ---
// Given a classful network address and a minimum subnets-OR-hosts
// requirement, the student must borrow exactly enough bits — by clicking
// bits in a Panel-2-style grid, not typing — to satisfy it. The graded
// answer is the exact minimal borrowed-bit count:
//   subnets mode: smallest N such that 2^N >= requiredSubnets
//   hosts mode:   smallest H (host bits kept) such that 2^H - 2 >= requiredHosts,
//                 i.e. borrow totalHostBits - H bits (as many as possible
//                 while still meeting the host floor).
// Reuses CLASSFUL_CIDR_RANGES (already defined above for Phase 7) so the
// generated address is always a real classful A/B/C network.
function genAtom1Questions(cfg, rng) {
    if (!cfg || !cfg.enabled || !cfg.numQuestions) return [];
    const out = [];
    const classRanges = filterClassRangesByAllowed(cfg.allowedClasses);
    for (let i = 0; i < cfg.numQuestions; i++) {
        const range = pickRandom(rng, classRanges);
        const networkBits = range.cidr;
        const editableCount = networkBits / 8; // matches SubnetVisualizer's syncOctetLocking

        // Build a classful NETWORK address (host portion zeroed), e.g.
        // 172.20.0.0 for Class B — same convention as the visualizer's
        // own presets (10.0.0.0 / 172.16.0.0 / 192.168.1.0).
        const octets = [0, 0, 0, 0];
        octets[0] = randInt(rng, range.min, range.max);
        for (let o = 1; o < editableCount; o++) octets[o] = randInt(rng, 0, 255);

        const totalHostBits = 32 - networkBits;
        const maxBorrow = Math.max(0, 30 - networkBits); // leave >= 2 host bits, matches SubnetVisualizer's own cap

        const requirementType = rng() < 0.5 ? 'subnets' : 'hosts';
        let correctBits, requiredCount;

        if (requirementType === 'subnets') {
            const nCap = Math.min(maxBorrow, 10); // keep required-subnet counts classroom-sized
            const nTarget = randInt(rng, 1, Math.max(1, nCap));
            const lower = Math.pow(2, nTarget - 1) + 1;
            const upper = Math.pow(2, nTarget);
            requiredCount = randInt(rng, lower, upper);
            correctBits = nTarget;
        } else {
            // Cap below totalHostBits so correctBits is never 0 (a
            // zero-click question would be a degenerate exercise).
            const hCap = Math.min(totalHostBits - 1, 12);
            const hTarget = randInt(rng, 2, Math.max(2, hCap));
            const lower = Math.pow(2, hTarget - 1) - 1;
            const upper = Math.pow(2, hTarget) - 2;
            requiredCount = randInt(rng, Math.max(1, lower), Math.max(1, upper));
            correctBits = totalHostBits - hTarget;
        }

        const ipStr = octets.join('.');
        const promptHtml = requirementType === 'subnets'
            ? `A network engineer is assigned the <b>Class ${range.cls}</b> network <b>${ipStr}</b> (classful <b>/${networkBits}</b>) and must support at least <b>${requiredCount}</b> subnet${requiredCount === 1 ? '' : 's'}. Click bits in the grid below to borrow exactly enough network bits, then verify.`
            : `A network engineer is assigned the <b>Class ${range.cls}</b> network <b>${ipStr}</b> (classful <b>/${networkBits}</b>) and each subnet must support at least <b>${requiredCount}</b> usable host${requiredCount === 1 ? '' : 's'}. Click bits in the grid below to borrow just enough network bits — leaving just enough host bits behind — then verify.`;

        out.push({
            type: 'atom1',
            octets,
            classLabel: range.cls,
            networkBits,
            totalHostBits,
            maxBorrow,
            requirementType,
            requiredCount,
            correctBits,
            correctCidr: networkBits + correctBits,
            promptHtml,
            correct: String(correctBits),
            given: ipStr
        });
    }
    return out;
}

function questionTypeLabel(type) {
    switch (type) {
        case 'd2b': return 'Dec→Bin';
        case 'b2d': return 'Bin→Dec';
        case 'ip_d2b': return 'IP Dec→Bin';
        case 'ip_b2d': return 'IP Bin→Dec';
        case 'mask_c2d': return 'CIDR→Mask';
        case 'mask_d2b': return 'Mask→Bin';
        case 'class_cidr': return 'Class→CIDR';
        case 'atom1': return 'Bit Question';
        case 'atom2': return 'Mask Assembly';
        case 'atom3': return 'Space Map';
        case 'atom4': return 'Boundaries';
        case 'atom5': return 'Applied Scenario';
        default: return '';
    }
}

// Builds the full, ordered list of named question "exercises" for a given
// seed string. Exam mode seeds with the student's email (unique, stable
// per student across reloads); practice mode uses one fixed seed so every
// student practices the same set. Grouped by phase, numbered within each
// phase, matching the sidebar's one-entry-per-question structure.
function buildConversionQuestions(seedStr) {
    const rng = mulberry32(hashStringToSeed(seedStr || ''));
    const decToBin = genPhase1Questions(QUESTION_CONFIG.phase1, rng);
    const binToDec = genPhase2Questions(QUESTION_CONFIG.phase2, rng);
    const ipToBinary = genPhase3Questions(QUESTION_CONFIG.phase3, rng);
    const ipToDecimal = genPhase4Questions(QUESTION_CONFIG.phase4, rng);
    const cidrToMask = genPhase5Questions(QUESTION_CONFIG.phase5, rng);
    const maskToBinary = genPhase6Questions(QUESTION_CONFIG.phase6, rng);
    const classCidrQuestions = genPhase7Questions(QUESTION_CONFIG.phase7, rng);

    const list = [];
    decToBin.forEach((q, i) => list.push({
        name: `dec2bin-q${i + 1}`,
        phase: 'Phase 1 · Decimal → Binary',
        label: `Phase 1 – Q${i + 1} (${questionTypeLabel(q.type)})`,
        shortLabel: `Q${i + 1} · ${questionTypeLabel(q.type)}`,
        q
    }));
    binToDec.forEach((q, i) => list.push({
        name: `bin2dec-q${i + 1}`,
        phase: 'Phase 2 · Binary → Decimal',
        label: `Phase 2 – Q${i + 1} (${questionTypeLabel(q.type)})`,
        shortLabel: `Q${i + 1} · ${questionTypeLabel(q.type)}`,
        q
    }));
    ipToBinary.forEach((q, i) => list.push({
        name: `ipdecbin-q${i + 1}`,
        phase: 'Phase 3 · IP Decimal → Binary',
        label: `Phase 3 – Q${i + 1} (${questionTypeLabel(q.type)})`,
        shortLabel: `Q${i + 1} · ${questionTypeLabel(q.type)}`,
        q
    }));
    ipToDecimal.forEach((q, i) => list.push({
        name: `ipbindec-q${i + 1}`,
        phase: 'Phase 4 · IP Binary → Decimal',
        label: `Phase 4 – Q${i + 1} (${questionTypeLabel(q.type)})`,
        shortLabel: `Q${i + 1} · ${questionTypeLabel(q.type)}`,
        q
    }));
    cidrToMask.forEach((q, i) => list.push({
        name: `cidrmask-q${i + 1}`,
        phase: 'Phase 5 · CIDR → Mask',
        label: `Phase 5 – Q${i + 1} (${questionTypeLabel(q.type)})`,
        shortLabel: `Q${i + 1} · ${questionTypeLabel(q.type)}`,
        q
    }));
    maskToBinary.forEach((q, i) => list.push({
        name: `maskbin-q${i + 1}`,
        phase: 'Phase 6 · Mask → Binary',
        label: `Phase 6 – Q${i + 1} (${questionTypeLabel(q.type)})`,
        shortLabel: `Q${i + 1} · ${questionTypeLabel(q.type)}`,
        q
    }));
    classCidrQuestions.forEach((q, i) => list.push({
        name: `classcidr-q${i + 1}`,
        phase: 'Phase 7 · Class-Based CIDR',
        label: `Phase 7 – Q${i + 1} (${questionTypeLabel(q.type)})`,
        shortLabel: `Q${i + 1} · ${questionTypeLabel(q.type)}`,
        q
    }));
    return list;
}

// --- ATOM 1: separate question list for its own dedicated full-width view ---
// Deliberately NOT part of buildConversionQuestions' returned list — Atom 1
// lives in its own page (see showAtom1Page/renderAtom1View below), not the
// Exercises sidebar, so it needs its own item list with the same shape
// (name/phase/label/shortLabel/q) but drawn from an independent RNG stream
// (seed suffixed with '::atom1'). That keeps it fully decoupled: adding,
// removing, or reconfiguring Atom 1 questions can never shift the random
// sequence any other phase draws from, and vice versa.
function buildAtom1QuestionList(seedStr) {
    const rng = mulberry32(hashStringToSeed((seedStr || '') + '::atom1'));
    const atom1Questions = genAtom1Questions(QUESTION_CONFIG.atom1, rng);
    return atom1Questions.map((q, i) => ({
        name: `atom1-q${i + 1}`,
        phase: 'Atom 1 · The Constraint (Bit Question)',
        label: `Atom 1 – Q${i + 1} (${questionTypeLabel(q.type)})`,
        shortLabel: `Q${i + 1} · ${questionTypeLabel(q.type)}`,
        q
    }));
}

// --- ATOM 2: THE MASK ASSEMBLY (INTERESTING OCTET) ---
// Given a host IP address and a classless CIDR prefix, the student
// assembles the subnet mask directly: classful network bits (Class A/B/C's
// default 8/16/24) are locked to 1, and every bit beyond that starts at 0
// and toggles independently on click (unlike Atom 1's "click sets the
// boundary" behavior — here each bit is its own decision). The correct
// answer is simply the standard mask for the given CIDR. Reuses
// CLASSFUL_CIDR_RANGES (see Phase 7 / Atom 1 above) for a real classful
// A/B/C starting point.
function genAtom2Questions(cfg, rng) {
    if (!cfg || !cfg.enabled || !cfg.numQuestions) return [];
    const out = [];
    const maxCidr = 30; // leave >= 2 host bits, same convention as Atom 1's maxBorrow cap
    const classRanges = filterClassRangesByAllowed(cfg.allowedClasses);

    for (let i = 0; i < cfg.numQuestions; i++) {
        const range = pickRandom(rng, classRanges);
        const networkBits = range.cidr;

        // A full random host IP (not a zeroed network address) — Atom 2's
        // scenario is "given this host's address and CIDR," matching the
        // Project Brief's Atom 2 framing.
        const octets = [randInt(rng, range.min, range.max), randInt(rng, 0, 255), randInt(rng, 0, 255), randInt(rng, 0, 255)];

        // Pick a classless CIDR that borrows at least 1 bit and never lands
        // exactly on an octet boundary, so there's always a genuine mixed
        // "interesting octet" to assemble (matching the Project Brief's
        // 224 example) rather than an all-255-or-0 mask.
        let targetCidr;
        let attempts = 0;
        do {
            const n = randInt(rng, 1, Math.max(1, maxCidr - networkBits));
            targetCidr = networkBits + n;
            attempts++;
        } while (targetCidr % 8 === 0 && attempts < 50);
        if (targetCidr % 8 === 0) targetCidr = Math.min(maxCidr, targetCidr + 1);

        const maskBits = '1'.repeat(targetCidr) + '0'.repeat(32 - targetCidr);
        const maskOctets = [0, 1, 2, 3].map(g => parseInt(maskBits.substr(g * 8, 8), 2));
        const correct = maskOctets.join('.');
        const ipStr = octets.join('.');

        // Kept deliberately brief: the general "how to assemble the mask /
        // classful bits are locked" instructions already live once in the
        // Atom 2 page header (see #atom2View's card-header in index.html),
        // so each question only needs the two facts that actually change
        // from question to question — the given host IP and target CIDR.
        // Class and the classful network-bit count are intentionally
        // omitted: the grid's own locked (blue) bits already show exactly
        // which bits are fixed, so restating that in words is redundant.
        const promptHtml = `Assemble the subnet mask for <b>${ipStr}/${targetCidr}</b>.`;

        out.push({
            type: 'atom2',
            octets,
            classLabel: range.cls,
            networkBits,
            targetCidr,
            promptHtml,
            correct,
            given: ipStr
        });
    }
    return out;
}

// Separate question list for Atom 2's own dedicated view — same rationale
// as buildAtom1QuestionList: not part of buildConversionQuestions' sidebar
// list, and drawn from its own independent RNG stream (seed suffixed with
// '::atom2') so it can never shift any other phase's/atom's sequence.
function buildAtom2QuestionList(seedStr) {
    const rng = mulberry32(hashStringToSeed((seedStr || '') + '::atom2'));
    const atom2Questions = genAtom2Questions(QUESTION_CONFIG.atom2, rng);
    return atom2Questions.map((q, i) => ({
        name: `atom2-q${i + 1}`,
        phase: 'Atom 2 · The Mask Assembly (Interesting Octet)',
        label: `Atom 2 – Q${i + 1} (${questionTypeLabel(q.type)})`,
        shortLabel: `Q${i + 1} · ${questionTypeLabel(q.type)}`,
        q
    }));
}

// --- ATOM 3: THE SPACE MAP (FRONT & BACK SUBNETS) ---
// Given a classful network address and a TARGET classless CIDR (e.g.
// 172.20.5.0/26), the student must figure out — and then click, exactly
// like Atom 1's own boundary-setting bit grid — how many bits that target
// implies borrowing. Nothing here states the borrowed-bit count in words;
// it's implied entirely by the gap between the classful network bits
// (locked, derived from class) and the given target CIDR, so the student
// has to read the class off the address and do networkBits -> targetCidr
// subtraction themselves. As the boundary moves, a live subnet-ID list
// below (see buildAtom3SubnetListHtml) recomputes from whatever borrowed-
// bit count is CURRENTLY selected — a self-check aid, not a separate
// answer surface; only the grid's final boundary position is graded.
//
// Class is weighted toward C, then B, then A for practice: Class C's
// single, always-editable last octet is by far the easiest to visualize
// bit-borrowing in, Class B is a step up, and Class A (24 bits of
// borrowable host space) is the hardest to reason about — so it's seen
// least often while still appearing.
const ATOM3_CLASS_WEIGHTS = [
    { range: CLASSFUL_CIDR_RANGES[2], weight: 0.55 }, // C
    { range: CLASSFUL_CIDR_RANGES[1], weight: 0.30 }, // B
    { range: CLASSFUL_CIDR_RANGES[0], weight: 0.15 }  // A
];

// Filters ATOM3_CLASS_WEIGHTS down to just the class(es) allowedClasses
// permits, then renormalizes the remaining weights so they still sum to
// 1 — e.g. excluding A from the default set leaves C:0.55/B:0.30, which
// renormalize to roughly C:0.65/B:0.35, preserving C's lead over B rather
// than just dropping A's share on the floor (which would silently make
// every question easier than intended). Falls back to the full,
// unfiltered weight table when allowedClasses is missing/empty/matches
// nothing, same convention as filterClassRangesByAllowed.
function filterAtom3ClassWeights(allowedClasses) {
    if (!Array.isArray(allowedClasses) || !allowedClasses.length) return ATOM3_CLASS_WEIGHTS;
    const filtered = ATOM3_CLASS_WEIGHTS.filter(entry => allowedClasses.includes(entry.range.cls));
    if (!filtered.length) return ATOM3_CLASS_WEIGHTS;
    const totalWeight = filtered.reduce((sum, entry) => sum + entry.weight, 0);
    return filtered.map(entry => ({ range: entry.range, weight: entry.weight / totalWeight }));
}

function pickAtom3ClassRange(rng, allowedClasses) {
    const weights = filterAtom3ClassWeights(allowedClasses);
    const r = rng();
    let acc = 0;
    for (const entry of weights) {
        acc += entry.weight;
        if (r < acc) return entry.range;
    }
    return weights[weights.length - 1].range;
}

// Atom 4 is deliberately sequenced instead of randomly weighted: its
// boundary task is more demanding than Atom 3's, so practice should teach
// the pattern with mostly Class C questions, then introduce Class B, and
// finish with at most one Class A question.
// Easiest-to-hardest order for Atom 4's boundary task (C: single, always-
// editable last octet; B: a step up; A: 24 bits of borrowable host space,
// hardest) — the same difficulty ordering Atom 3's own weights use.
const ATOM4_DIFFICULTY_ORDER = [CLASSFUL_CIDR_RANGES[2], CLASSFUL_CIDR_RANGES[1], CLASSFUL_CIDR_RANGES[0]]; // C, B, A

function atom4ClassRangeForQuestion(index, totalQuestions, allowedClasses) {
    const allowed = filterClassRangesByAllowed(allowedClasses);
    const ranges = ATOM4_DIFFICULTY_ORDER.filter(r => allowed.includes(r));

    if (ranges.length <= 1) return ranges[0] || CLASSFUL_CIDR_RANGES[2];

    if (ranges.length === 2) {
        // Only two classes allowed: mostly the easier one, same "mostly
        // easy, a few hard" shape as the three-class case below, scaled
        // down to two buckets instead of three.
        const easyCount = Math.max(1, Math.ceil(totalQuestions * 0.8));
        return index < easyCount ? ranges[0] : ranges[1];
    }

    // All three classes allowed: original sequencing — mostly Class C,
    // then Class B, then at most one Class A question at the very end.
    const classACount = totalQuestions > 0 ? 1 : 0;
    const nonClassACount = Math.max(0, totalQuestions - classACount);
    const classCCount = Math.max(1, Math.ceil(nonClassACount * 0.7));

    if (index < classCCount) return CLASSFUL_CIDR_RANGES[2];
    if (index < nonClassACount) return CLASSFUL_CIDR_RANGES[1];
    return CLASSFUL_CIDR_RANGES[0];
}

function genAtom3Questions(cfg, rng) {
    if (!cfg || !cfg.enabled || !cfg.numQuestions) return [];
    const out = [];
    const maxBorrowCap = 10; // keep the target CIDR classroom-sized regardless of class

    for (let i = 0; i < cfg.numQuestions; i++) {
        const range = pickAtom3ClassRange(rng, cfg.allowedClasses);
        const networkBits = range.cidr;
        const editableCount = networkBits / 8; // matches Atom 1/2's own classful-address convention

        const octets = [0, 0, 0, 0];
        octets[0] = randInt(rng, range.min, range.max);
        for (let o = 1; o < editableCount; o++) octets[o] = randInt(rng, 0, 255);

        // At least 3 borrowed bits guarantees >= 8 subnets, which is the
        // minimum needed for "first 4" (indices 0-3) and "last 4" (the
        // top 4 indices) to never overlap in the live list below.
        const maxBorrow = Math.max(0, 30 - networkBits); // leave >= 2 host bits, same convention as Atom 1
        const borrowedBits = randInt(rng, 3, Math.max(3, Math.min(maxBorrow, maxBorrowCap)));
        const targetCidr = networkBits + borrowedBits;

        const ipStr = octets.join('.');
        const promptHtml = `A network engineer needs the classless network <b>${ipStr}/${targetCidr}</b>. First, click bits in the grid below to borrow exactly enough network bits to reach that CIDR. Next, assemble the matching subnet mask bit by bit. Finally, build the binary subnet ID for each subnet listed underneath by clicking its own bits — its full network address updates live as you go.`;

        out.push({
            type: 'atom3',
            octets,
            classLabel: range.cls,
            networkBits,
            maxBorrow,
            targetCidr,
            correctBits: borrowedBits,
            promptHtml,
            correct: String(borrowedBits),
            given: ipStr
        });
    }
    return out;
}

function genAtom4Questions(cfg, rng) {
    if (!cfg || !cfg.enabled || !cfg.numQuestions) return [];
    const out = [];
    const maxBorrowCap = 10;

    for (let i = 0; i < cfg.numQuestions; i++) {
        const range = atom4ClassRangeForQuestion(i, cfg.numQuestions, cfg.allowedClasses);
        const networkBits = range.cidr;
        const editableCount = networkBits / 8;
        const octets = [0, 0, 0, 0];
        octets[0] = randInt(rng, range.min, range.max);
        for (let o = 1; o < editableCount; o++) octets[o] = randInt(rng, 0, 255);

        const maxBorrow = Math.max(0, 30 - networkBits);
        const borrowedBits = randInt(rng, 3, Math.max(3, Math.min(maxBorrow, maxBorrowCap)));
        const targetCidr = networkBits + borrowedBits;
        const ipStr = octets.join('.');

        out.push({
            type: 'atom4',
            octets,
            classLabel: range.cls,
            networkBits,
            maxBorrow,
            borrowedBits,
            hostBits: 32 - targetCidr,
            targetCidr,
            promptHtml: `For the <b>${ipStr}/${targetCidr}</b> network, build each subnet ID listed below. Then set every remaining host bit to <b>0</b> for its Network ID and to <b>1</b> for its Broadcast Address.`,
            correct: '',
            given: ipStr
        });
    }
    return out;
}

// Separate question list for Atom 3's own dedicated view — same rationale
// as buildAtom1QuestionList/buildAtom2QuestionList, drawn from its own
// independent RNG stream (seed suffixed with '::atom3').
function buildAtom3QuestionList(seedStr) {
    const rng = mulberry32(hashStringToSeed((seedStr || '') + '::atom3'));
    const atom3Questions = genAtom3Questions(QUESTION_CONFIG.atom3, rng);
    return atom3Questions.map((q, i) => ({
        name: `atom3-q${i + 1}`,
        phase: 'Atom 3 · The Space Map (Front & Back Subnets)',
        label: `Atom 3 – Q${i + 1} (${questionTypeLabel(q.type)})`,
        shortLabel: `Q${i + 1} · ${questionTypeLabel(q.type)}`,
        q
    }));
}

function buildAtom4QuestionList(seedStr) {
    const rng = mulberry32(hashStringToSeed((seedStr || '') + '::atom4'));
    const atom4Questions = genAtom4Questions(QUESTION_CONFIG.atom4, rng);
    return atom4Questions.map((q, i) => ({
        name: `atom4-q${i + 1}`,
        phase: 'Atom 4 · The Boundaries (Network ID & Broadcast)',
        label: `Atom 4 – Q${i + 1} (${questionTypeLabel(q.type)})`,
        shortLabel: `Q${i + 1} · ${questionTypeLabel(q.type)}`,
        q
    }));
}

async function loadAllExercises() {
    const list = document.getElementById('fileList');
    list.innerHTML = ""; 
    document.getElementById('loader').style.display = 'block';

    // Load a saved session before generating questions. Practice needs this
    // early pass because its saved random seed determines the scenarios that
    // must be rebuilt before answers can be restored.
    let resumedSession = null;
    if (currentUser) {
        resumedSession = appSettings.mode === 'exam'
            ? loadExamSession(currentUser)
            : loadPracticeSession(currentUser);
    }
    if (resumedSession && resumedSession.practiceSeed) {
        currentPracticeSeed = resumedSession.practiceSeed;
    }
    if (resumedSession && resumedSession.atom7Seed) {
        currentAtom7Seed = resumedSession.atom7Seed;
        currentAtom7SeedOwner = currentUser;
    } else if (currentAtom7SeedOwner !== currentUser) {
        currentAtom7Seed = null;
        currentAtom7SeedOwner = currentUser;
    }
    if (resumedSession && resumedSession.atom9Seed) {
        currentAtom9Seed = resumedSession.atom9Seed;
        currentAtom9SeedOwner = currentUser;
    } else if (currentAtom9SeedOwner !== currentUser) {
        currentAtom9Seed = null;
        currentAtom9SeedOwner = currentUser;
    }

    // Question seeding is independent of Practice/Exam mode:
    //   - 'fixed'  -> the same constant seed every time, so every student
    //                 practices the identical set (e.g. for walking
    //                 through problems together as a class).
    //   - 'random' -> a per-student random seed, generated once and then
    //                 restored locally with that student's Practice progress.
    let seedStr;
    if (appSettings.practiceQuestionMode === 'random') {
        if (!currentPracticeSeed) {
            currentPracticeSeed = generateRandomPracticeSeed();
        }
        seedStr = currentPracticeSeed;
    } else {
        seedStr = 'practice-default-seed';
    }
    currentQuestionSeed = seedStr;

    const questionList = buildConversionQuestions(seedStr);

    let lastPhase = null;
    for (const item of questionList) {
        exerciseData[item.name] = buildConversionExerciseData(item);

        // Insert a non-interactive phase header whenever the phase changes
        // (list is already grouped/ordered by phase from buildConversionQuestions).
        if (item.phase !== lastPhase) {
            const headerLi = document.createElement('li');
            headerLi.className = 'sidebar-phase-header';
            headerLi.textContent = item.phase;
            headerLi.setAttribute('role', 'presentation');
            list.appendChild(headerLi);
            lastPhase = item.phase;
        }

        const li = document.createElement('li');
        const safeId = item.name;
        li.id = `nav-${safeId}`;

        li.innerHTML = `
            <span>${item.shortLabel}</span>
            <span class="nav-score" id="score-${safeId}">0/${exerciseData[item.name].answers.length}</span>
        `;

        li.onclick = () => {
            switchExercise(item.name, li);
            closeSidebarIfMobile();
        };
        list.appendChild(li);

        // Initialize sidebar score and summary
        updateSidebarScore(item.name);
        updateSummaryPanel();
    }

    // --- Atom 1: scored, but lives in its own full-width view (see
    // showAtom1Page/renderAtom1View), not the Exercises sidebar list built
    // above. Its exerciseData entries still live in the same `exerciseData`
    // object as everything else, so scoring, exam persistence, and the
    // sidebar's overall Total Points all pick it up automatically with no
    // special-casing needed there.
    const atom1List = buildAtom1QuestionList(seedStr);
    atom1List.forEach(item => {
        exerciseData[item.name] = buildConversionExerciseData(item);
    });
    renderAtom1View(atom1List);

    // --- Atom 2: scored, dedicated full-width view (see showAtom2Page/
    // renderAtom2View), same pattern as Atom 1 immediately above.
    const atom2List = buildAtom2QuestionList(seedStr);
    atom2List.forEach(item => {
        exerciseData[item.name] = buildConversionExerciseData(item);
    });
    renderAtom2View(atom2List);

    // --- Atom 3: scored, dedicated full-width view (see showAtom3Page/
    // renderAtom3View), same pattern as Atom 1/2 immediately above.
    const atom3List = buildAtom3QuestionList(seedStr);
    atom3List.forEach(item => {
        exerciseData[item.name] = buildConversionExerciseData(item);
    });
    renderAtom3View(atom3List);

    // --- Atom 4: scored, dedicated boundary view ---
    const atom4List = buildAtom4QuestionList(seedStr);
    atom4List.forEach(item => {
        exerciseData[item.name] = buildConversionExerciseData(item);
    });
    renderAtom4View(atom4List);

    // --- Atom 5: scored, dedicated view combining Atoms 1-4's underlying
    // skills into narrative word-problems (no bit-grid interaction) ---
    const atom5List = buildAtom5QuestionList(seedStr);
    atom5List.forEach(item => {
        exerciseData[item.name] = buildConversionExerciseData(item);
    });
    renderAtom5View(atom5List);

    // --- Atom 6: progressively ordered VLSM planning scenarios. The
    // scenario state is stored as JSON in userAnswer so the existing exam
    // persistence layer can restore an in-progress multi-stage plan.
    const atom6List = buildAtom6QuestionList(seedStr);
    atom6List.forEach(item => {
        exerciseData[item.name] = buildAtom6ExerciseData(item);
    });
    renderAtom6View(atom6List);

    // Atom 7 is intentionally absent from exerciseData: it is a single
    // read-only requirement and therefore contributes no answers or points.
    // Its own persisted seed keeps the brief stable even when the scored
    // question-set seeding strategy changes.
    if (QUESTION_CONFIG.atom7?.enabled) {
        if (!currentAtom7Seed) currentAtom7Seed = generateAtom7Seed();
        atom7Scenario = buildAtom7Scenario(currentAtom7Seed);
        renderAtom7View(atom7Scenario);
    } else {
        atom7Scenario = null;
        renderAtom7View(null);
    }

    if (QUESTION_CONFIG.atom8?.enabled && atom7Scenario) {
        atom8Model = atom8BuildModel(atom7Scenario, currentAtom7Seed);
        atom8GeneratedOfficialCases = atom8GenerateOfficialCases(atom7Scenario, atom8Model, currentAtom7Seed);
        exerciseData['atom8-main'] = atom8BuildExerciseData(atom7Scenario, atom8Model, atom8GeneratedOfficialCases);
        renderAtom8View();
    } else {
        atom8Model = null;
        atom8GeneratedOfficialCases = [];
        renderAtom8View();
    }

    if (QUESTION_CONFIG.atom9?.enabled) {
        if (!currentAtom9Seed) currentAtom9Seed = generateAtom9Seed();
        const atom9List = buildAtom9QuestionList(currentAtom9Seed);
        atom9QuestionIds = atom9List.map(item => item.name);
        atom9List.forEach(item => {
            exerciseData[item.name] = atom8BuildExerciseData(item.scenario, item.model, item.officialCases, {
                type: 'atom9',
                label: item.label,
                phase: 'Atom 9 · Standalone Deployment',
                generatedOfficialCases: item.officialCases
            });
        });
        renderAtom9View();
    } else {
        atom9QuestionIds = [];
        renderAtom9View();
    }

    document.getElementById('loader').style.display = 'none';

    // Restore persisted progress after deterministically rebuilding the saved
    // question set. Exam and Practice sessions use separate storage keys.
    let isExpired = false;
    if (resumedSession) {
        applySavedExerciseStates(resumedSession);
        if (appSettings.timerEnabled) {
            if (typeof resumedSession.examEndTimestamp === 'number') {
                examEndTimestamp = resumedSession.examEndTimestamp;
            }
            isExpired = typeof resumedSession.examEndTimestamp === 'number' && Date.now() >= resumedSession.examEndTimestamp;
            if (isExpired) {
                sessionTimedOut = true;
                // Lock every exercise, including ones never opened, so a
                // reload after time's up can't be used to keep answering.
                for (const file in exerciseData) {
                    exerciseData[file].locked = true;
                }
            }
        }
    }

    // Reflect any restored/expired lock state (set above, generically, on
    // every exerciseData entry) onto the Atom 1 view's own DOM — unlike the
    // Exercises list, which lazily re-renders per exercise on click via
    // switchExercise, the Atom 1 view renders every question up front, so
    // it needs an explicit pass here to pick up locked/score/userAnswer.
    syncAtom1ViewDOM();
    syncAtom2ViewDOM();
    syncAtom3ViewDOM();
    syncAtom4ViewDOM();
    syncAtom5ViewDOM();
    syncAtom6ViewDOM();
    syncAtom8ViewDOM();
    syncAtom9ViewDOM();

    // Persist the seed immediately and synchronize any independent setting
    // changes (for example, turning the timer off for an existing session).
    if (appSettings.persistenceEnabled) {
        saveSessionProgress();
    }

    // Default landing page after login: the ungraded Subnet Visualizer
    // tool in Practice Mode, so a fresh login drops the student somewhere
    // exploratory/orienting rather than straight into a scored question.
    // Exam Mode skips the visualizer entirely (see showDefaultLandingPage)
    // since it's an on-demand answer calculator that has no place in a
    // timed assessment — it lands on the first Atom/exercise that actually
    // has questions instead. This also covers the (now-typical) case where
    // every Phase 1-7 exercise is disabled and the Exercises list is
    // empty, so there'd otherwise be nothing to auto-select at all.
    showDefaultLandingPage();

    // Attach action button handler (delegates to verify or reset depending on locked state)
    document.getElementById('actionButton').addEventListener('click', () => {
        const actionBtn = document.getElementById('actionButton');
        const ex = exerciseData[currentFile];
        if (!currentFile) return;
        if (ex && ex.locked) {
            resetCurrentExercise();
        } else {
            checkAnswers();
        }
    });

    return { session: resumedSession, isExpired };
}

// Applies a previously-saved session (locked state, score, and line
// order per exercise) onto the freshly-loaded exerciseData. Must run after
// exerciseData has been populated (each exercise re-shuffles on every page
// load, but userOrder is stored as original line indices, so it re-applies
// correctly regardless of the new shuffle).
function applySavedExerciseStates(session) {
    if (!session || !session.exercises) return;
    for (const file in session.exercises) {
        const saved = session.exercises[file];
        const ex = exerciseData[file];
        if (!ex || !saved) continue;
        ex.locked = !!saved.locked;
        ex.score = saved.score || 0;
        ex.isPartial = !!saved.isPartial;
        if (ex.isLineOrdering && Array.isArray(saved.userOrder) && saved.userOrder.length) {
            ex.userOrder = saved.userOrder;
        }
        if (ex.isConversionQuestion && typeof saved.userAnswer === 'string') {
            ex.userAnswer = saved.userAnswer;
        }
        updateSidebarScore(file);
    }
    updateSummaryPanel();
}

// Fisher-Yates shuffle that guarantees a derangement (no item in original position)
function createDerangement(length) {
    if (length <= 1) return [...Array(length).keys()];
    
    let attempt = 0;
    let derangement;
    let isValid;
    
    do {
        // Fisher-Yates shuffle
        derangement = [...Array(length).keys()];
        for (let i = length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [derangement[i], derangement[j]] = [derangement[j], derangement[i]];
        }
        
        // Check if it's a valid derangement (no item in original position)
        isValid = true;
        for (let i = 0; i < length; i++) {
            if (derangement[i] === i) {
                isValid = false;
                break;
            }
        }
        
        attempt++;
    } while (!isValid && attempt < 100); // Max 100 attempts to prevent infinite loop
    
    // Fallback: if derangement fails, manually create one
    if (!isValid) {
        derangement = [...Array(length).keys()];
        const rotations = Math.max(1, Math.floor(length / 2));
        for (let i = 0; i < rotations; i++) {
            derangement.push(derangement.shift());
        }
    }
    
    return derangement;
}

function parseJavaCode(raw) {
    // Extract sample output from a leading block comment (/* ... */) if present
    let sampleOutput = '';
    const commentMatch = raw.match(/\/\*[\s\S]*?\*\//);
    if (commentMatch) {
        const comment = commentMatch[0];
        // Find 'Sample Output:' marker (case-insensitive)
        const markerIndex = comment.search(/Sample Output:/i);
        if (markerIndex >= 0) {
            // Extract everything after the marker up to end of comment
            let after = comment.slice(markerIndex + 'Sample Output:'.length);

            // Strip the block comment's closing "*/" (and any whitespace
            // right before it) from the very end BEFORE splitting into
            // lines. Doing this first means a genuine blank line the
            // author intentionally included in the sample output (e.g. a
            // trailing blank row) can't get confused with — and dropped
            // along with — the leftover artifact the closer would
            // otherwise leave behind on its own line.
            after = after.replace(/\s*\*\/\s*$/, '');

            // Strip only the JavaDoc-style comment prefix from each line: an
            // optional single leading space, the '*', and at most one space
            // right after it. Anything beyond that single space is real
            // indentation belonging to the program's actual output (e.g. an
            // ASCII-art shape) and must be preserved exactly as-is.
            let sampleLines = after.split('\n').map(l => l.replace(/^ ?\*\s?/, ''));

            // Drop only the leading blank line produced by the newline
            // right after "Sample Output:" itself. Any blank line(s)
            // further in — including a trailing one — are part of the
            // real output and are left untouched.
            while (sampleLines.length && sampleLines[0].trim() === '') {
                sampleLines.shift();
            }

            // Trailing whitespace on a line doesn't affect how it renders,
            // so it's safe to trim per line without touching leading spaces.
            sampleOutput = sampleLines.map(l => l.replace(/\s+$/, '')).join('\n');
        }

        // Remove the entire leading comment block from the raw source before parsing lines
        raw = raw.replace(commentMatch[0], '');
    }

    // Split code into lines and filter out empty lines
    const lines = raw.split('\n').filter(line => line.trim().length > 0);
    
    // Escape HTML
    const escapedLines = lines.map(line => 
        line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    );
    
    // Create shuffled version using derangement (no item in original position)
    const shuffledIndices = createDerangement(escapedLines.length);
    const shuffledLines = shuffledIndices.map(idx => escapedLines[idx]);
    
    // Generate fixed line numbers column and draggable code area
    let lineNumbersHtml = '<div class="line-numbers-column">';
    for (let i = 0; i < escapedLines.length; i++) {
        lineNumbersHtml += `<div class="line-number">${i + 1}</div>`;
    }
    lineNumbersHtml += '</div>';
    
    // Build draggable items (no line numbers attached)
    let codeAreaHtml = '<div class="code-ordering-area" id="orderingArea">';
    shuffledLines.forEach((line, idx) => {
        const originalIdx = shuffledIndices[idx];
        
        codeAreaHtml += `<div class="draggable-line" draggable="true" data-original-idx="${originalIdx}">
                            <span class="drag-handle"><i class="fa-solid fa-grip-vertical" aria-hidden="true"></i></span>
                            <div class="updown-buttons">
                                <button type="button" class="move-up-btn" aria-label="Move line up"><i class="fa-solid fa-chevron-up" aria-hidden="true"></i></button>
                                <button type="button" class="move-down-btn" aria-label="Move line down"><i class="fa-solid fa-chevron-down" aria-hidden="true"></i></button>
                            </div>
                            <code>${line}</code>
                        </div>`;
    });
    codeAreaHtml += '</div>';
    
    // Wrap both in a container
    const html = `<div class="code-ordering-container">${lineNumbersHtml}${codeAreaHtml}</div>`;
    
    // For compatibility, 'answers' stores the correct order
    const answers = escapedLines.map((_, idx) => [idx.toString()]);
    
    // Identify duplicate lines and map which positions are valid for each line's content
    const lineGroups = {}; // content -> array of original indices
    escapedLines.forEach((line, idx) => {
        if (!lineGroups[line]) {
            lineGroups[line] = [];
        }
        lineGroups[line].push(idx);
    });
    
    // Create a map: originalIdx -> valid positions for that line's content
    const validPositionsMap = {};
    escapedLines.forEach((line, idx) => {
        validPositionsMap[idx] = lineGroups[line].sort((a, b) => a - b);
    });
    
    return { 
        html, 
        answers, 
        sampleOutput,
        originalLines: escapedLines,
        originalIndices: [...escapedLines.keys()],
        shuffledIndices: shuffledIndices,
        validPositionsMap: validPositionsMap,
        lineGroups: lineGroups,
        userOrder: [],
        score: 0, 
        locked: false, 
        isPartial: false,
        isLineOrdering: true
    };
}

/* =========================================================
   BINARY / IP CONVERSION ACTIVITY — EXERCISE DATA / RENDERING / GRADING
   Builds an object shaped like the exerciseData entries the rest of the
   app already expects (locked/score/answers/html), so the sidebar,
   scoring, exam persistence, and lock/reset flow all work unmodified.
========================================================= */
function buildConversionExerciseData(item) {
    const q = item.q;
    // IP address questions (Phase 3 · IP Dec→Bin and Phase 4 · IP Bin→Dec)
    // are graded per octet — 4 "lines" so 1 point per octet, up to 4 points
    // total — instead of a single all-or-nothing point. Everything else
    // (mask questions, individual dec/bin questions) stays at 1 point.
    // Atom 2 is graded all-or-nothing (1 point), like Atom 1 — the full
    // 32-bit mask either matches the target CIDR's mask or it doesn't;
    // there's no partial-credit notion of "which octet was right" the way
    // there is for the IP-address conversion questions below.
    const isOctetScored = (q.type === 'ip_d2b' || q.type === 'ip_b2d');
    // Atom 3 is graded per answerable item, not all-or-nothing: the
    // boundary grid, the assembled mask, and each subnet row shown for
    // the TARGET (correct) borrowed-bit count each earn their own point.
    // Computed here (rather than assuming a fixed count) since the number
    // of subnet rows depends on the question's own correctBits.
    const atom3AnswerCount = q.type === 'atom3' ? (2 + atom3SubnetIndicesForBorrowed(q.correctBits).length) : null;
    // Atom 1 questions carry extra fields the bit-grid renderer/handlers
    // need at interaction time (networkBits/maxBorrow to clamp clicks,
    // requirementType/requiredCount/totalHostBits to drive the live
    // formula box). Everything else keeps the same shape every other
    // conversion question already uses.
    const atom1Extra = q.type === 'atom1' ? {
        octets: q.octets,
        classLabel: q.classLabel,
        networkBits: q.networkBits,
        totalHostBits: q.totalHostBits,
        maxBorrow: q.maxBorrow,
        requirementType: q.requirementType,
        requiredCount: q.requiredCount,
        correctBits: q.correctBits,
        correctCidr: q.correctCidr
    } : {};
    // Atom 2 questions carry the fields its grid/panel needs: the given
    // host IP octets, class, classful networkBits (drives the locked
    // portion of the grid), and the target classless CIDR (shown in the
    // prompt/Panel 1 only — never re-derived from or displayed on the grid
    // itself).
    const atom2Extra = q.type === 'atom2' ? {
        octets: q.octets,
        classLabel: q.classLabel,
        networkBits: q.networkBits,
        targetCidr: q.targetCidr
    } : {};
    // Atom 3 questions carry the fields its boundary-setting grid needs —
    // the same shape as Atom 1's own extra fields (octets/networkBits/
    // maxBorrow clamp the clickable range), plus the static targetCidr
    // shown as given information in Panel 1.
    const atom3Extra = q.type === 'atom3' ? {
        octets: q.octets,
        classLabel: q.classLabel,
        networkBits: q.networkBits,
        maxBorrow: q.maxBorrow,
        targetCidr: q.targetCidr,
        correctBits: q.correctBits
    } : {};
    const atom4AnswerCount = q.type === 'atom4' ? (2 + atom3SubnetIndicesForBorrowed(q.correctBits).length * 3) : null;
    const atom4Extra = q.type === 'atom4' ? {
        octets: q.octets,
        classLabel: q.classLabel,
        networkBits: q.networkBits,
        maxBorrow: q.maxBorrow,
        correctBits: q.borrowedBits,
        borrowedBits: q.borrowedBits,
        hostBits: q.hostBits,
        targetCidr: q.targetCidr,
        // Atom 4 subnet IDs are entered per displayed row, just like Atom 3;
        // there is no single target subnet or fixed subnet-bit pattern.
    } : {};
    // Atom 5 questions carry the structured fields buildAtom5RequirementCardHtml
    // needs to render its card (given network/host + optional highlighted
    // target + the task itself) — replacing the old single promptHtml
    // paragraph, which packed the class label, borrowed-bit count, and the
    // question all into one sentence.
    const atom5Extra = q.type === 'atom5' ? {
        subType: q.subType,
        cardGivenLabel: q.givenLabel,
        cardGivenValue: q.givenValue,
        cardTargetLabel: q.targetLabel,
        cardTargetValue: q.targetValue,
        cardTargetSuffix: q.targetSuffix,
        cardTargetIcon: q.targetIcon,
        cardTaskText: q.taskText
    } : {};
    return Object.assign({
        html: renderQuestionHtml(item.name, q),
        answers: isOctetScored
            ? [[], [], [], []]
            : (q.type === 'atom3' ? Array.from({ length: atom3AnswerCount }, () => []) : (q.type === 'atom4' ? Array.from({ length: atom4AnswerCount }, () => []) : [[q.correct]])), // length drives the score denominator everywhere (sidebar, summary, exam completion)
        correct: q.correct,
        type: q.type,
        bitWidth: q.bitWidth,
        given: q.given,
        promptHtml: q.promptHtml,
        label: item.label,
        shortLabel: item.shortLabel,
        phase: item.phase,
        sampleOutput: '',
        userAnswer: '',
        score: 0,
        locked: false,
        isPartial: false,
        isConversionQuestion: true,
        isLineOrdering: false
    }, atom1Extra, atom2Extra, atom3Extra, atom4Extra, atom5Extra);
}

function renderBitGroup(qid, width) {
    // Mirrors the Phase 3/6 octet bit-grid's presentation, adapted for the
    // fact Phase 1 has no compact/expanded distinction — there's no
    // separate collapsed field this grid swaps out of, it's just always
    // shown this way. Same two ideas carried over:
    //   1. One continuous row, no mid-row separator — a visible gap implied
    //      two disconnected groups (see renderExpandableOctetBitboxes'
    //      comment); this is one binary value regardless of width.
    //   2. Each box gets its own decimal place-value label above it
    //      (2^(width-1-i) for a value of this width), muted by default and
    //      lighting up whenever that bit is set to 1, via
    //      updatePlainBitPlaceValueLabel — making the
    //      decimal-equals-sum-of-active-place-values relationship visible
    //      as the student types.
    let html = `<div class="bitgroup" data-qid="${qid}">`;
    for (let i = 0; i < width; i++) {
        const placeValue = Math.pow(2, width - 1 - i);
        html += `<div class="octet-bit-col">` +
                    `<span class="bit-place-value muted" data-qid="${qid}" data-idx="${i}">${placeValue}</span>` +
                    `<input class="bitbox" maxlength="1" inputmode="numeric" data-idx="${i}" data-qid="${qid}">` +
                `</div>`;
    }
    html += `</div>`;
    return html;
}

// Phase 2 (Binary -> Decimal): renders the question's "given" binary value
// using the exact same bitgroup/bitbox/place-value markup as Phase 1's
// renderBitGroup above, so a student who's built up familiarity with that
// per-bit, place-value-labeled layout in Phase 1 sees the same visual
// language here rather than a plain inline string. The key difference is
// this grid is entirely pre-filled and non-interactive: it's presenting a
// known, given value, not collecting an answer (the decimal answer is
// still gathered separately via the normal .answer-input-num field), so
// each box is `readonly` + `tabindex="-1"` (keeps it out of the tab order
// entirely, since there's nothing to type into it) and — because the bit
// values are fixed at render time rather than changing as someone types —
// the on/off box state and active/muted place-value label are computed
// once right here instead of via the input-event handlers Phase 1 uses.
function renderReadOnlyBitGroup(qid, binStr, width) {
    const bits = (binStr || '').padStart(width, '0');
    let html = `<div class="bitgroup bitgroup-readonly" data-qid="${qid}">`;
    for (let i = 0; i < width; i++) {
        const placeValue = Math.pow(2, width - 1 - i);
        const bit = bits[i];
        const boxStateClass = bit === '1' ? 'on' : 'off';
        const labelStateClass = bit === '1' ? 'active' : 'muted';
        html += `<div class="octet-bit-col">` +
                    `<span class="bit-place-value ${labelStateClass}">${placeValue}</span>` +
                    `<input class="bitbox readonly-bitbox ${boxStateClass}" value="${bit}" readonly tabindex="-1" aria-label="Bit ${i + 1} of ${width}: ${bit}">` +
                `</div>`;
    }
    html += `</div>`;
    return html;
}

function renderIpOctetInputs(qid, kind) {
    const cls = kind === 'bin' ? 'ip-octet-bin' : 'ip-octet-dec';
    const maxlen = kind === 'bin' ? 8 : 3;
    const placeholder = kind === 'bin' ? '00000000' : '0';
    let html = '';
    for (let i = 0; i < 4; i++) {
        html += `<input type="text" class="${cls}" maxlength="${maxlen}" inputmode="numeric" data-qid="${qid}" data-oct="${i}" placeholder="${placeholder}">`;
        if (i < 3) html += `<span class="octet-dot">.</span>`;
    }
    return html;
}

// Single accent color for the expanded bit-grid "card" (Phase 3 & Phase 6,
// the two IP/mask octet Dec→Bin question types) — the
// same style for every octet, so the four cards read as one consistent
// component rather than four differently-colored ones. Deliberately NOT
// var(--primary) (already the app's button/branding color, so reusing it
// here reads as a call-to-action rather than a grouping) and NOT
// var(--secondary)/var(--error) (those are reserved for correct/wrong
// grading feedback elsewhere in this same UI, via applyOctetFeedback —
// reusing either here would make an unanswered octet look pre-graded).
const OCTET_CARD_ACCENT = '#5C6BC0';

function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Standard 8-bit place values, most-significant bit first — matches the
// left-to-right order the bit boxes are already rendered in.
const OCTET_BIT_PLACE_VALUES = [128, 64, 32, 16, 8, 4, 2, 1];

// Shared by Phase 3 (IP Dec→Bin) and Phase 6 (Mask Dec→Bin) — both ask for
// four 8-bit binary octets, so both use this same expand-on-focus UI. Each
// octet starts as the same compact text field as before (kept as class
// "ip-octet-bin" so collect/restore/grade/disable logic elsewhere needs no
// changes), but on focus it swaps out for an 8-box bit grid. The row of
// boxes reuses Phase 1's exact "bitgroup"/"bitbox" markup and classes so it
// inherits Phase 1's per-bit entry feel, but — unlike Phase 1, where
// there's only ever one such row on screen — it's wrapped in its own
// bordered "card" with an "Octet N" label beneath, so it's visually
// unambiguous which octet those 8 boxes belong to. Collapses back to the
// compact field once focus leaves that octet.
//
// Each box also gets its own decimal place-value label (128, 64, ... 1)
// sitting directly above it, muted by default and switching to "active"
// styling whenever that bit is set to 1 (see updateBitPlaceValueLabel) —
// making the decimal-equals-sum-of-active-place-values relationship
// visible as the student types, instead of something computed separately
// after the fact.
function renderExpandableOctetBitboxes(qid, oct) {
    // Like Phase 1's own renderBitGroup, this grid is one continuous row
    // with no mid-row separator — a visible gap there would imply two
    // disconnected 4-bit groups rather than one 8-bit octet, so none is
    // inserted; all 8 boxes sit in a single unbroken row.
    let boxesHtml = '';
    for (let b = 0; b < 8; b++) {
        boxesHtml += `<div class="octet-bit-col">` +
                `<span class="bit-place-value muted" data-qid="${qid}" data-oct="${oct}" data-idx="${b}">${OCTET_BIT_PLACE_VALUES[b]}</span>` +
                `<input class="bitbox octet-bitbox" maxlength="1" inputmode="numeric" data-qid="${qid}" data-oct="${oct}" data-idx="${b}">` +
            `</div>`;
    }

    const containerStyle = 'display:inline-flex;flex-direction:column;align-items:center;gap:6px;' +
        `padding:8px 10px 6px;border:1.5px solid ${OCTET_CARD_ACCENT};border-radius:10px;` +
        `background:${hexToRgba(OCTET_CARD_ACCENT, 0.07)};vertical-align:middle;`;
    const labelStyle = 'font-size:0.7rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;' +
        `color:${OCTET_CARD_ACCENT};`;

    return `<div class="octet-bitgroup" data-qid="${qid}" data-oct="${oct}" style="${containerStyle}">` +
                `<div class="bitgroup octet-bitgroup-row" data-qid="${qid}" data-oct="${oct}">${boxesHtml}</div>` +
                `<span class="octet-label" style="${labelStyle}">Octet ${oct + 1}</span>` +
            `</div>`;
}


function renderIpOctetBinExpandable(qid) {
    let html = '';
    for (let i = 0; i < 4; i++) {
        html += `<span class="octet-expand-wrapper" data-qid="${qid}" data-oct="${i}">` +
            `<input type="text" class="ip-octet-bin ip-octet-collapsed" maxlength="8" inputmode="numeric" data-qid="${qid}" data-oct="${i}" placeholder="00000000">` +
            renderExpandableOctetBitboxes(qid, i) +
            `</span>`;
        if (i < 3) html += `<span class="octet-dot">.</span>`;
    }
    return html;
}

// Renders "192.168.1.0 / ___" — the IP address followed by a slash and an
// underline-style blank for the CIDR prefix number (no boxed border, just
// a line to write on). Reuses the "answer-input-num" class so the existing
// collect/restore/enable-disable wiring (shared with the b2d question
// type) picks it up with no extra plumbing; inline styles override that
// class's default boxed look for this specific input.
function renderClassCidrInput(qid, ip) {
    const lineStyle = 'border:none;border-bottom:2px solid currentColor;background:transparent;' +
        'width:2.5ch;text-align:center;padding:0 2px;box-shadow:none;border-radius:0;';
    return `<span class="cidr-ip-text">${ip}</span><span class="cidr-slash">/</span><input type="text" class="answer-input-num cidr-answer-input" data-qid="${qid}" maxlength="2" inputmode="numeric" style="${lineStyle}">`;
}

/* =========================================================
   ATOM 1: THE CONSTRAINT (BIT QUESTION) — rendering & interaction
   Reuses the exact CSS component language SubnetVisualizer's Panel 1
   (class + octet display), Panel 2 (interactive 32-bit grid), and the
   Panel 4/5 formula-box use — those class names (.bit-grid, .bit-cell,
   .octet-block, .weight-row-main, .formula-box, .class-value,
   .octet-field, .badge-borrow, ...) are plain global selectors in
   styles.css, not scoped to the visualizer's own DOM, so this question
   type can use them directly inside the normal .code-editor question
   card. The actual click/render logic here is a small, self-contained
   parallel to SubnetVisualizer's onBitClick/renderPanel2 (that engine's
   own helpers are private to its IIFE), scoped with an "atom1" prefix so
   nothing here collides with SubnetVisualizer's internals.
========================================================= */
// --- ATOM 1: REQUIREMENT CARD (how the question is COMMUNICATED) ---
// Replaces the old single narrative sentence (previously rendered via
// q.promptHtml inside a plain .conversion-prompt div) with a compact,
// icon-labeled card of three scannable rows: the given network, the
// requirement itself, and the task. This only changes how the question
// text is presented — it reads the exact same fields genAtom1Questions
// already computes (classLabel, octets, networkBits, requirementType,
// requiredCount), and does not touch the bit grid, the given-network
// octet boxes in Panel 1, grading, or any other Atom's rendering.
//
// The given-network row deliberately keeps the IP address and its CIDR
// suffix as one unbroken token ("202.197.98.0/24") — the notation a
// network engineer expects — rather than splitting them apart with the
// Class badge in between; the Class badge sits before that token instead.
function buildAtom1RequirementCardHtml(q) {
    const ipStr = q.octets.join('.');
    const isHosts = q.requirementType === 'hosts';
    const reqIconGlyph = isHosts ? 'fa-house-user' : 'fa-layer-group';
    const reqIconExtraClass = isHosts ? ' atom1-req-icon-hosts' : '';
    const reqNumExtraClass = isHosts ? ' atom1-req-target-num-hosts' : '';
    const reqEyebrow = isHosts ? 'Each subnet must support at least' : 'Must support at least';
    const reqLabel = isHosts
        ? 'usable host' + (q.requiredCount === 1 ? '' : 's')
        : 'subnet' + (q.requiredCount === 1 ? '' : 's');
    const taskText = isHosts
        ? 'Click bits in the grid below to borrow just enough network bits — leaving just enough host bits behind — then verify.'
        : 'Click bits in the grid below to borrow exactly enough network bits, then verify.';

    return (
        '<div class="atom1-req-card">' +
            '<div class="atom1-req-row">' +
                '<div class="atom1-req-icon atom1-req-icon-network"><i class="fa-solid fa-diagram-project" aria-hidden="true"></i></div>' +
                '<div class="atom1-req-body">' +
                    '<div class="atom1-req-eyebrow">Given network</div>' +
                    '<div class="atom1-req-main">' +
                        '<span class="atom1-req-badge">Class ' + q.classLabel + '</span>' +
                        '<span class="atom1-req-value">' + ipStr + '<span class="atom1-req-cidr">/' + q.networkBits + '</span></span>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="atom1-req-row">' +
                '<div class="atom1-req-icon atom1-req-icon-requirement' + reqIconExtraClass + '"><i class="fa-solid ' + reqIconGlyph + '" aria-hidden="true"></i></div>' +
                '<div class="atom1-req-body">' +
                    '<div class="atom1-req-eyebrow">' + reqEyebrow + '</div>' +
                    '<div class="atom1-req-target">' +
                        '<span class="atom1-req-target-num' + reqNumExtraClass + '">' + q.requiredCount + '</span>' +
                        '<span class="atom1-req-target-label">' + reqLabel + '</span>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="atom1-req-row atom1-task-row">' +
                '<div class="atom1-req-icon atom1-req-icon-task"><i class="fa-solid fa-hand-pointer" aria-hidden="true"></i></div>' +
                '<div class="atom1-req-body">' +
                    '<div class="atom1-req-eyebrow">Your task</div>' +
                    '<div class="atom1-req-action-text">' + taskText + '</div>' +
                '</div>' +
            '</div>' +
        '</div>'
    );
}

function atom1ToBinary8(n) {
    const v = Math.max(0, Math.min(255, Number(n) || 0));
    return v.toString(2).padStart(8, '0').split('').map(Number);
}
function atom1OctetsToBits(octets) {
    return octets.flatMap(atom1ToBinary8);
}
function atom1BitsToOctet(bitsArr) {
    return parseInt(bitsArr.join(''), 2);
}

// Builds the inner HTML of the 32-bit grid for a given borrowed-bit count.
// Bits before networkBits are locked (blue, non-clickable — classful
// network portion); the rest are borrowed (amber) up to
// networkBits+borrowedBits, then host (green) — identical color/role
// language to SubnetVisualizer's own Panel 2.
function renderAtom1BitGridInner(qid, inputBits, networkBits, borrowedBits) {
    const totalBorrowEnd = networkBits + borrowedBits;
    // Same live prefix SubnetVisualizer's own Panel 2 attaches to its last
    // octet — classful network bits plus however many have been borrowed
    // so far, so it updates in place as bits are clicked.
    const totalPrefix = networkBits + borrowedBits;
    let html = '';
    for (let g = 0; g < 4; g++) {
        const bitsSlice = inputBits.slice(g * 8, g * 8 + 8);
        const kindsSlice = bitsSlice.map((_, k) => {
            const gi = g * 8 + k;
            if (gi < networkBits) return 'locked';
            if (gi < totalBorrowEnd) return 'borrowed';
            return 'host';
        });

        html += '<div class="octet-block">';
        // Octet 4 mirrors SubnetVisualizer.renderPanel2: the live CIDR
        // suffix rides right alongside the last octet's total ("0/24"),
        // not just up in the Panel-1 network row / borrow badge — this is
        // the piece Atom 1's grid was missing versus Subnetify's own.
        if (g === 3) {
            html += '<div class="octet-total-cidr-wrap">' +
                        '<div class="octet-total octet-total-main">' + atom1BitsToOctet(bitsSlice) + '</div>' +
                        '<span class="decimal-cidr-suffix cidr-suffix-viz">/' + totalPrefix + '</span>' +
                    '</div>';
        } else {
            html += '<div class="octet-total octet-total-main">' + atom1BitsToOctet(bitsSlice) +
                '<span class="octet-total-dot">.</span></div>';
        }

        html += '<div class="weight-row weight-row-main">';
        OCTET_BIT_PLACE_VALUES.forEach((w, k) => {
            const lit = bitsSlice[k] === 1;
            const cls = lit ? ('weight-num weight-lit weight-lit-' + kindsSlice[k]) : 'weight-num weight-muted';
            html += '<span class="' + cls + '">' + w + '</span>';
        });
        html += '</div>';

        html += '<div class="bit-octet-group">';
        for (let b = 0; b < 8; b++) {
            const gi = g * 8 + b;
            const kind = kindsSlice[b];
            html += '<div class="bit-cell ' + kind + '" data-idx="' + gi + '"' +
                (kind !== 'locked' ? ' role="button" tabindex="0" title="Click to set the subnet boundary here"' : '') + '>' +
                (kind === 'locked' ? '<span class="lock-icon"><i class="fa-solid fa-lock"></i></span>' : '') +
                '<span class="bit-value">' + bitsSlice[b] + '</span>' +
                '</div>';
        }
        html += '</div>';

        html += '<div class="octet-viz-label">Octet ' + (g + 1) + '</div>';
        html += '</div>';

        if (g < 3) html += '<div class="octet-dot-separator">.</div>';
    }
    return html;
}

// Live formula content (Panel 4/5 formula-box visual language): recomputes
// from the CURRENT borrowed-bit count, not the correct answer, so it's a
// self-check aid rather than an answer key — mirrors how SubnetVisualizer's
// own formula boxes always reflect current state.borrowedBits.
function buildAtom1FormulaContent(qOrEx, borrowedBits) {
    if (qOrEx.requirementType === 'subnets') {
        const totalSubnets = Math.pow(2, borrowedBits);
        const meets = totalSubnets >= qOrEx.requiredCount;
        return '<span class="formula-line"><span class="formula-term">Total Subnets</span> = 2<sup>borrowed bits</sup> = 2<sup>' + borrowedBits + '</sup> = ' +
            '<span class="formula-highlight-subnet">' + totalSubnets + '</span></span>' +
            '<span class="formula-note">Requirement: at least ' + qOrEx.requiredCount + ' subnet' + (qOrEx.requiredCount === 1 ? '' : 's') + '. Currently ' +
            (meets ? 'satisfied ✓' : 'not yet satisfied ✗') + '.</span>';
    }
    const hostBitsLeft = qOrEx.totalHostBits - borrowedBits;
    const totalHosts = Math.pow(2, Math.max(0, hostBitsLeft));
    const usable = Math.max(0, totalHosts - 2);
    const meets = usable >= qOrEx.requiredCount;
    return '<span class="formula-line"><span class="formula-term">Usable Hosts</span> = 2<sup>host bits</sup> &minus; 2 = 2<sup>' + hostBitsLeft + '</sup> &minus; 2 = ' +
        '<span class="formula-highlight-host">' + usable + '</span></span>' +
        '<span class="formula-note">Requirement: at least ' + qOrEx.requiredCount + ' usable host' + (qOrEx.requiredCount === 1 ? '' : 's') + ' per subnet. Currently ' +
        (meets ? 'satisfied ✓' : 'not yet satisfied ✗') + '.</span>';
}

function renderAtom1FormulaBox(qid, q, borrowedBits) {
    const cls = q.requirementType === 'subnets' ? 'formula-box-subnet' : 'formula-box-host';
    return '<div class="formula-box ' + cls + ' atom1-formula-box" id="atom1FormulaBox-' + qid + '">' +
        buildAtom1FormulaContent(q, borrowedBits) + '</div>';
}

// Re-renders the grid + borrow badge + (if present) formula box for a new
// borrowed-bit count. Called on every click and on restore.
function updateAtom1Grid(qid, ex, borrowedBits) {
    const grid = document.getElementById('atom1BitGrid-' + qid);
    if (!grid) return;
    const inputBits = atom1OctetsToBits(ex.octets);
    grid.dataset.borrowed = String(borrowedBits);
    grid.innerHTML = renderAtom1BitGridInner(qid, inputBits, ex.networkBits, borrowedBits);

    const badge = document.getElementById('atom1BorrowBadge-' + qid);
    if (badge) {
        badge.innerHTML = '<span>' + borrowedBits + ' bit' + (borrowedBits === 1 ? '' : 's') + ' borrowed &rarr; /' + (ex.networkBits + borrowedBits) + '</span>';
    }

    const formulaBox = document.getElementById('atom1FormulaBox-' + qid);
    if (formulaBox) formulaBox.innerHTML = buildAtom1FormulaContent(ex, borrowedBits);
}

function renderAtom1QuestionHtml(qid, q) {
    const inputBits = atom1OctetsToBits(q.octets);

    // The given-network octet-box row (Class | Octet 1-4 | /CIDR) that used
    // to render here was dropped: it duplicated the same address/class/CIDR
    // already shown in the requirement card above (buildAtom1RequirementCardHtml),
    // and the bit grid below still displays each octet's own live total, so
    // nothing is lost by removing the redundant static row.

    const gridHtml =
        '<div class="atom1-bitgrid-wrap">' +
            '<div class="badge badge-borrow atom1-borrow-badge" id="atom1BorrowBadge-' + qid + '">' +
                '<span>0 bits borrowed &rarr; /' + q.networkBits + '</span>' +
            '</div>' +
            '<div class="bit-grid atom1-bitgrid" id="atom1BitGrid-' + qid + '" data-qid="' + qid + '" data-network-bits="' + q.networkBits + '" data-max-borrow="' + q.maxBorrow + '" data-borrowed="0">' +
                renderAtom1BitGridInner(qid, inputBits, q.networkBits, 0) +
            '</div>' +
            '<div class="legend secondary-copy">' +
                '<span><i class="swatch swatch-locked"></i> Locked network bit</span>' +
                '<span><i class="swatch swatch-borrowed"></i> Borrowed subnet bit</span>' +
                '<span><i class="swatch swatch-host"></i> Host bit</span>' +
            '</div>' +
        '</div>';

    // Formula stays visible throughout Practice Mode (so the student only
    // has to click bits and self-check against the live numbers); Exam
    // Mode hides it, same principle as hiding bit place-value labels there.
    const formulaHtml = renderAtom1FormulaBox(qid, q, 0);

    return '<div class="conversion-question atom1-question" data-qid="' + qid + '">' +
                buildAtom1RequirementCardHtml(q) +
                gridHtml +
                formulaHtml +
            '</div>';
}

// Delegated click/keyboard handling for one question's bit grid. Clicking
// any unlocked bit sets borrowedBits = thatBitIndex - networkBits + 1,
// exactly mirroring SubnetVisualizer's own onBitClick — clicking near the
// boundary shrinks the borrowed range, clicking further out grows it.
function attachAtom1Handlers(qid, ex) {
    const grid = document.getElementById('atom1BitGrid-' + qid);
    if (!grid) return;

    const handleActivate = (cell) => {
        // Keyed off the qid this grid actually belongs to, NOT currentFile —
        // Atom 1's dedicated view renders every question at once, so there
        // is no single "current" exercise the way the Exercises list has.
        if (exerciseData[qid]?.locked) return;
        if (!cell || cell.classList.contains('locked')) return;
        const idx = parseInt(cell.dataset.idx, 10);
        let newBorrowed = idx - ex.networkBits + 1;
        newBorrowed = Math.max(0, Math.min(newBorrowed, ex.maxBorrow));
        updateAtom1Grid(qid, ex, newBorrowed);
        saveAtom1Progress(qid);
    };

    grid.addEventListener('click', (e) => {
        handleActivate(e.target.closest('.bit-cell'));
    });
    grid.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const cell = e.target.closest && e.target.closest('.bit-cell');
        if (!cell) return;
        e.preventDefault();
        handleActivate(cell);
    });
}

/* =========================================================
   ATOM PAGINATION — shared one-question-at-a-time navigator
   Used by Atom 1-4's dedicated views. Each view renders every question's
   panel up front (buildAtomXPanelHtml), all sharing the ".atom1-q-panel"
   class regardless of which Atom built them — so the panel list for any
   given atom is just `container.querySelectorAll('.atom1-q-panel')`, in
   DOM order, no separate id bookkeeping needed.

   Only the current panel is shown (display: '') / all others hidden
   (display: 'none') — this is real paging, not scroll-to, since a long
   list of full-size Panel-2-style bit grids is the exact thing that makes
   mobile scrolling painful in the first place. A bar with First/Prev/
   [number buttons]/Next/Last renders below the questions; on narrow
   screens the number buttons are hidden by CSS in favor of a jump <select>
   showing "Q3 / 10" between the Prev/Next arrows.

   State is keyed by atomKey ('atom1'..'atom4') so each view's current
   page is independent and survives being re-synced (syncAtomXViewDOM)
   without resetting to page 1 on every login-time DOM sync pass — sync
   only touches per-question state, never calls showAtomQuestion.
========================================================= */
const ATOM_PAGINATION = {};

function getAtomPanels(atomKey) {
    const container = document.getElementById(atomKey + 'QuestionsContainer');
    if (!container) return [];
    return Array.from(container.querySelectorAll(':scope > .atom1-q-panel'));
}

// Fixed-size sliding window of page numbers, e.g. with ATOM_PAGE_WINDOW_SIZE
// = 5 and total=12: current=1 -> [1,2,3,4,5]; current=6 -> [4,5,6,7,8];
// current=12 -> [8,9,10,11,12]. Deliberately NOT an ellipsis-based list —
// an ellipsis appearing/disappearing as the boundary is approached changes
// how many items are rendered, which changes the row's width call to call.
// A constant-length window (always exactly ATOM_PAGE_WINDOW_SIZE items, or
// `total` itself when there are fewer questions than that) means the same
// number of buttons renders on every page, so paired with the fixed CSS
// width on .atom-page-numbers, the whole bar never resizes as the student
// moves between questions.
const ATOM_PAGE_WINDOW_SIZE = 5;

function buildAtomPageWindow(total, current) {
    if (total <= ATOM_PAGE_WINDOW_SIZE) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }
    let start = current - Math.floor(ATOM_PAGE_WINDOW_SIZE / 2);
    start = Math.max(1, Math.min(start, total - ATOM_PAGE_WINDOW_SIZE + 1));
    return Array.from({ length: ATOM_PAGE_WINDOW_SIZE }, (_, i) => start + i);
}

function buildAtomPaginationHtml(atomKey, total, currentIdx) {
    if (total <= 1) return '';
    const current = currentIdx + 1; // 1-based for display/comparison

    const numbersHtml = buildAtomPageWindow(total, current).map(p => {
        const isActive = p === current;
        return '<button type="button" class="atom-page-btn' + (isActive ? ' active' : '') + '" data-atom="' + atomKey + '" data-page="' + (p - 1) + '"' +
            (isActive ? ' aria-current="true"' : '') + ' aria-label="Go to question ' + p + '">' + p + '</button>';
    }).join('');

    let jumpOptionsHtml = '';
    for (let i = 0; i < total; i++) {
        jumpOptionsHtml += '<option value="' + i + '"' + (i === currentIdx ? ' selected' : '') + '>' + (i + 1) + '</option>';
    }

    const atFirst = currentIdx === 0;
    const atLast = currentIdx === total - 1;

    return (
        '<nav class="atom-pagination" data-atom="' + atomKey + '" aria-label="Question navigation">' +
            '<button type="button" class="atom-page-nav-btn atom-page-first" data-atom="' + atomKey + '" data-page="0"' + (atFirst ? ' disabled' : '') + ' aria-label="First question"><i class="fa-solid fa-angles-left" aria-hidden="true"></i></button>' +
            '<button type="button" class="atom-page-nav-btn atom-page-prev" data-atom="' + atomKey + '" data-page="' + (currentIdx - 1) + '"' + (atFirst ? ' disabled' : '') + ' aria-label="Previous question"><i class="fa-solid fa-angle-left" aria-hidden="true"></i></button>' +
            '<div class="atom-page-numbers">' + numbersHtml + '</div>' +
            '<div class="atom-page-mobile-indicator">' +
                '<select class="atom-page-jump-select" data-atom="' + atomKey + '" aria-label="Jump to question">' + jumpOptionsHtml + '</select>' +
                '<span class="atom-page-mobile-total">of ' + total + '</span>' +
            '</div>' +
            '<button type="button" class="atom-page-nav-btn atom-page-next" data-atom="' + atomKey + '" data-page="' + (currentIdx + 1) + '"' + (atLast ? ' disabled' : '') + ' aria-label="Next question"><i class="fa-solid fa-angle-right" aria-hidden="true"></i></button>' +
            '<button type="button" class="atom-page-nav-btn atom-page-last" data-atom="' + atomKey + '" data-page="' + (total - 1) + '"' + (atLast ? ' disabled' : '') + ' aria-label="Last question"><i class="fa-solid fa-angles-right" aria-hidden="true"></i></button>' +
        '</nav>'
    );
}

function renderAtomPaginationBar(atomKey) {
    const holder = document.getElementById(atomKey + 'PaginationContainer');
    if (!holder) return;
    const state = ATOM_PAGINATION[atomKey];
    const total = state ? state.total : 0;
    const current = state ? state.current : 0;
    holder.innerHTML = buildAtomPaginationHtml(atomKey, total, current);
}

// Shows only the panel at `index`, hides the rest, updates state + bar,
// and scrolls the question container back into view (useful after paging
// from a long question further down the list).
function showAtomQuestion(atomKey, index, opts) {
    const state = ATOM_PAGINATION[atomKey];
    if (!state || !state.total) return;
    const safeIndex = Math.max(0, Math.min(index, state.total - 1));
    if (atomKey === 'atom9') {
        if (atom8PingState.running || atom8OfficialRunAllActive || atom8SelfRunAllActive) {
            renderAtomPaginationBar('atom9');
            return;
        }
        state.current = safeIndex;
        atom9SelectItem(safeIndex, { keepMode: true, fromPagination: true });
        if (!opts || opts.scroll !== false) {
            document.getElementById('atom9Container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
    }
    state.current = safeIndex;

    const panels = getAtomPanels(atomKey);
    panels.forEach((panel, i) => {
        panel.style.display = i === safeIndex ? '' : 'none';
    });

    renderAtomPaginationBar(atomKey);

    if (!opts || opts.scroll !== false) {
        const container = document.getElementById(atomKey + 'QuestionsContainer');
        if (container) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (atomKey === 'atom6') atom6ScheduleTopologyConnections();
}

// Called once per login, right after a view's panels have been (re)built.
// Resets to question 1 — each render pass is a fresh question set (new
// login/session seed), so there's no prior page position worth preserving.
function initAtomPagination(atomKey) {
    const panels = getAtomPanels(atomKey);
    ATOM_PAGINATION[atomKey] = { total: panels.length, current: 0 };
    showAtomQuestion(atomKey, 0, { scroll: false });
}

// --- ATOM PAGINATION BAR VISIBILITY (direct children of <main>) ---
// The four #atomXPaginationContainer bars now live as direct siblings of
// #contentScrollArea under <main class="content"> (see index.html) rather
// than nested inside their own atomXView — that's what makes each one a
// real block-level boundary below the scrollable question area instead of
// an overlay floating on top of it. Because they're no longer nested
// inside atomXView, they no longer get hidden "for free" whenever that
// view's own display:none is set; every place that switches the main view
// (Exercises, Subnet Visualizer, an ungraded Atom placeholder, or another
// Atom) must explicitly hide all four and then show at most one.
function hideAllAtomPaginationBars() {
    ['atom1', 'atom2', 'atom3', 'atom4', 'atom5', 'atom6', 'atom9'].forEach(key => {
        const bar = document.getElementById(key + 'PaginationContainer');
        if (bar) bar.style.display = 'none';
    });
}

function showAtomPaginationBar(atomKey) {
    hideAllAtomPaginationBars();
    const bar = document.getElementById(atomKey + 'PaginationContainer');
    if (bar) bar.style.display = 'flex';
}

let atomPaginationDelegated = false;
function attachAtomPaginationHandlers() {
    if (atomPaginationDelegated) return;
    atomPaginationDelegated = true;

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.atom-page-nav-btn, .atom-page-btn');
        if (!btn || btn.disabled) return;
        const atomKey = btn.dataset.atom;
        const page = parseInt(btn.dataset.page, 10);
        if (!atomKey || isNaN(page)) return;
        showAtomQuestion(atomKey, page);
    });

    document.addEventListener('change', (e) => {
        const select = e.target.closest('.atom-page-jump-select');
        if (!select) return;
        const atomKey = select.dataset.atom;
        const page = parseInt(select.value, 10);
        if (!atomKey || isNaN(page)) return;
        showAtomQuestion(atomKey, page);
    });
}

/* =========================================================
   ATOM 1: DEDICATED FULL-WIDTH VIEW
   Renders every Atom 1 question as its own full-size .panel — the exact
   component the Subnet Visualizer itself uses — stacked on one continuous
   scrollable page, rather than squeezed into the Exercises list's narrow
   .code-editor card. Panel-1-style given network, Panel-2-style bit grid,
   and the formula box are all reused as-is (renderAtom1BitGridInner,
   renderAtom1FormulaBox, updateAtom1Grid, above); this section only adds
   the page shell, per-question score badge, and independent Verify/Reset
   + feedback controls this view needs since nothing here is routed
   through the shared #actionButton/#feedback the Exercises list uses.
========================================================= */

// Guards against attaching the delegated verify/reset click listener more
// than once — the container's innerHTML is rebuilt on every login (fresh
// question set), but the container element itself persists, so the
// listener only needs to be attached the first time.
let atom1ActionsDelegated = false;

function buildAtom1PanelHtml(qid, ex, index) {
    const inputBits = atom1OctetsToBits(ex.octets);

    // The given-network octet-box row (Class | Octet 1-4 | /CIDR) that used
    // to render here was dropped: it duplicated the same address/class/CIDR
    // already shown in the requirement card above (buildAtom1RequirementCardHtml),
    // and the bit grid below still displays each octet's own live total, so
    // nothing is lost by removing the redundant static row.

    const gridHtml =
        '<div class="atom1-bitgrid-wrap">' +
            '<div class="badge badge-borrow atom1-borrow-badge" id="atom1BorrowBadge-' + qid + '">' +
                '<span>0 bits borrowed &rarr; /' + ex.networkBits + '</span>' +
            '</div>' +
            '<div class="bit-grid atom1-bitgrid" id="atom1BitGrid-' + qid + '" data-qid="' + qid + '" data-network-bits="' + ex.networkBits + '" data-max-borrow="' + ex.maxBorrow + '" data-borrowed="0">' +
                renderAtom1BitGridInner(qid, inputBits, ex.networkBits, 0) +
            '</div>' +
            '<div class="legend secondary-copy">' +
                '<span><i class="swatch swatch-locked"></i> Locked network bit</span>' +
                '<span><i class="swatch swatch-borrowed"></i> Borrowed subnet bit</span>' +
                '<span><i class="swatch swatch-host"></i> Host bit</span>' +
            '</div>' +
        '</div>';

    // Formula stays visible throughout Practice Mode (self-check aid);
    // Exam Mode hides it, same principle as hiding bit place-value labels
    // elsewhere in exam mode.
    const formulaHtml = renderAtom1FormulaBox(qid, ex, 0);

    return (
        '<section class="panel atom1-q-panel" id="atom1QPanel-' + qid + '" data-qid="' + qid + '">' +
            '<div class="panel-head">' +
                '<span class="panel-index">Q' + index + '</span>' +
                '<h2>' + (ex.requirementType === 'subnets' ? 'Subnet Requirement' : 'Host Requirement') + '</h2>' +
                '<span class="badge atom1-score-badge" id="atom1ScoreBadge-' + qid + '">0/1</span>' +
            '</div>' +
            buildAtom1RequirementCardHtml(ex) +
            gridHtml +
            formulaHtml +
            '<div class="atom1-actions">' +
                '<button class="primary-btn atom1-verify-btn" data-qid="' + qid + '">Verify Answer</button>' +
                '<div class="atom1-feedback" id="atom1Feedback-' + qid + '" role="status" aria-live="polite"></div>' +
            '</div>' +
        '</section>'
    );
}

// Builds the full Atom 1 page from scratch (called once per login) and
// wires up each question's bit-grid interaction plus a single delegated
// click listener for every Verify/Reset button on the page.
function renderAtom1View(atom1List) {
    const container = document.getElementById('atom1QuestionsContainer');
    if (!container) return;

    container.innerHTML = atom1List
        .map((item, i) => buildAtom1PanelHtml(item.name, exerciseData[item.name], i + 1))
        .join('');

    atom1List.forEach(item => {
        attachAtom1Handlers(item.name, exerciseData[item.name]);
    });

    if (!atom1ActionsDelegated) {
        atom1ActionsDelegated = true;
        container.addEventListener('click', (e) => {
            const btn = e.target.closest('.atom1-verify-btn');
            if (!btn) return;
            const qid = btn.dataset.qid;
            const ex = exerciseData[qid];
            if (!ex) return;
            if (ex.locked) {
                resetAtom1Question(qid);
            } else {
                verifyAtom1Question(qid);
            }
        });
    }

    attachAtomPaginationHandlers();
    initAtomPagination('atom1');
}

// Persists the in-progress borrowed-bit count for one Atom 1 question
// (analogous to saveConversionProgress, but keyed off the question's own
// qid rather than the single global currentFile).
function saveAtom1Progress(qid) {
    const ex = exerciseData[qid];
    if (!ex || ex.locked) return;
    const grid = document.getElementById('atom1BitGrid-' + qid);
    ex.userAnswer = grid ? (grid.dataset.borrowed || '0') : (ex.userAnswer || '');
    saveSessionProgress();
}

// Sets the Verify/Reset/Locked button label + disabled state for one
// question, matching the same rules the shared #actionButton follows:
// locked + practice -> "Reset" (enabled); locked + exam -> "Locked"
// (disabled); unlocked -> "Verify Answer".
function setAtom1ButtonState(qid) {
    const ex = exerciseData[qid];
    const btn = document.querySelector('.atom1-verify-btn[data-qid="' + qid + '"]');
    if (!btn || !ex) return;
    if (ex.locked) {
        if (isRetryAllowed()) {
            btn.textContent = 'Reset';
            btn.disabled = false;
        } else {
            btn.textContent = 'Locked';
            btn.disabled = true;
        }
    } else {
        btn.textContent = 'Verify Answer';
        btn.disabled = false;
    }
}

// Renders this question's per-question feedback message, reusing the same
// buildFeedbackForExercise/renderFeedback helpers the Exercises list uses
// so the wording (including "No answer submitted." for an untouched,
// exam-expired question) stays identical across both views.
function updateAtom1QuestionFeedback(qid, ex) {
    const el = document.getElementById('atom1Feedback-' + qid);
    if (!el) return;
    if (!ex || !ex.locked) {
        el.textContent = '';
        el.className = 'atom1-feedback';
        return;
    }
    const feedback = buildFeedbackForExercise(ex);
    renderFeedback(el, feedback);
    el.className = 'atom1-feedback ' + feedback.cls;
}

// Updates one question's score badge (max always 1/1 for Atom 1). Reuses
// the app's existing bare .completed-score/.partial-score classes so the
// coloring matches the Exercises list's own score pills exactly.
function updateAtom1ScoreBadge(qid, ex) {
    const badge = document.getElementById('atom1ScoreBadge-' + qid);
    if (!badge || !ex) return;
    badge.textContent = (ex.score || 0) + '/' + ex.answers.length;
    badge.classList.remove('completed-score', 'partial-score');
    if (ex.locked) {
        if (ex.score === ex.answers.length) badge.classList.add('completed-score');
        else if (ex.score > 0) badge.classList.add('partial-score');
    }
}

// Applies every visual consequence of this question being locked: the
// panel's correct/incorrect edge color, the bit grid's click-lock, the
// feedback message, the score badge, and the action button label.
function applyAtom1LockedUI(qid, ex) {
    const panel = document.getElementById('atom1QPanel-' + qid);
    const grid = document.getElementById('atom1BitGrid-' + qid);
    const isCorrect = (ex.score || 0) > 0;

    if (panel) {
        panel.classList.remove('correct', 'incorrect');
        panel.classList.add(isCorrect ? 'correct' : 'incorrect');
    }
    if (grid) grid.classList.add('atom1-locked');

    updateAtom1QuestionFeedback(qid, ex);
    updateAtom1ScoreBadge(qid, ex);
    setAtom1ButtonState(qid);
}

// Grades and locks one Atom 1 question — the Atom 1 equivalent of
// checkAnswers, but scoped to a single question's qid since every
// question on this page has its own independent Verify button.
function verifyAtom1Question(qid) {
    const ex = exerciseData[qid];
    if (!ex || ex.locked) return;

    const grid = document.getElementById('atom1BitGrid-' + qid);
    const userAnswer = grid ? (grid.dataset.borrowed || '0') : '0';
    ex.userAnswer = userAnswer;

    const isCorrect = gradeConversionAnswer(ex, userAnswer);
    ex.score = isCorrect ? 1 : 0;
    ex.isPartial = false;
    ex.locked = true;

    applyAtom1LockedUI(qid, ex);
    updateAtom1NavScore();
    updateSummaryPanel();

    if (isCorrect) triggerConfetti();

    saveSessionProgress();
    if (appSettings.mode === 'exam') {
        if (checkIfAllAnswered()) {
            stopTimer();
            setTimeout(() => {
                showScoreSummaryModal('Congratulations! All exercises completed before time ran out!', 'success');
            }, 500);
        }
    }
}

// Resets one Atom 1 question — practice mode only, mirroring
// resetCurrentExercise's exam-mode guard.
function resetAtom1Question(qid) {
    if (!isRetryAllowed()) {
        showAlertModal('Reset Not Allowed', sessionTimedOut ? 'Reset is not allowed after time expires.' : 'Reset is not allowed in Exam Mode.');
        return;
    }
    const ex = exerciseData[qid];
    if (!ex) return;

    ex.userAnswer = '';
    ex.score = 0;
    ex.isPartial = false;
    ex.locked = false;

    updateAtom1Grid(qid, ex, 0);

    const panel = document.getElementById('atom1QPanel-' + qid);
    if (panel) panel.classList.remove('correct', 'incorrect');
    const grid = document.getElementById('atom1BitGrid-' + qid);
    if (grid) grid.classList.remove('atom1-locked');

    updateAtom1QuestionFeedback(qid, null);
    updateAtom1ScoreBadge(qid, ex);
    setAtom1ButtonState(qid);
    updateAtom1NavScore();
    updateSummaryPanel();
    saveSessionProgress();
}

// Aggregates every atom1-q* exercise into a single X/N readout on the
// sidebar's "Atom 1" nav entry — its nav tag, per the finalized plan,
// shows a live score readout (same completed/partial/unanswered coloring
// as the Exercises list' score pills) instead of the "Ungraded" pill
// Atom 2–5 keep.
function updateAtom1NavScore() {
    const scoreEl = document.getElementById('score-atom1');
    if (!scoreEl) return;
    let got = 0;
    let total = 0;
    for (const file in exerciseData) {
        if (file.indexOf('atom1-q') === 0) {
            const ex = exerciseData[file];
            got += Number(ex.score || 0);
            total += ex.answers.length;
        }
    }
    scoreEl.textContent = got + '/' + total;
    scoreEl.classList.remove('completed-score', 'partial-score');
    if (total > 0 && got === total) {
        scoreEl.classList.add('completed-score');
    } else if (got > 0) {
        scoreEl.classList.add('partial-score');
    }
}

// Re-applies every Atom 1 question's current exerciseData state (grid
// borrowed-bit count, locked styling, feedback, badge) onto the already-
// rendered DOM. Called once per login, after exam-session restore (and
// any timer-expiry force-lock) has already updated exerciseData itself —
// this is what actually makes those restored/expired states visible, since
// Atom 1's view has no per-question lazy render step like switchExercise.
function syncAtom1ViewDOM() {
    for (const file in exerciseData) {
        if (file.indexOf('atom1-q') !== 0) continue;
        const ex = exerciseData[file];
        if (!ex) continue;

        const borrowed = parseInt(ex.userAnswer, 10);
        const safeBorrowed = isNaN(borrowed) ? 0 : Math.max(0, Math.min(borrowed, ex.maxBorrow));
        updateAtom1Grid(file, ex, safeBorrowed);

        if (ex.locked) {
            applyAtom1LockedUI(file, ex);
        } else {
            setAtom1ButtonState(file);
        }
    }
    updateAtom1NavScore();
}

// --- Sidebar navigation into the Atom 1 view (Tools → Atoms → Atom 1) ---
// Mirrors showSubnetVisualizer/showAtomPage's page-switching pattern (hide
// every other view, clear currentFile since no single exercise is
// "current" here and close the console drawer). The independently enabled
// activity timer remains visible while working through it.
function showAtom1Page() {
    document.querySelectorAll('.sidebar li').forEach(l => l.classList.remove('active'));
    const navItem = document.getElementById('nav-atom1');
    if (navItem) navItem.classList.add('active');

    document.getElementById('exerciseArea').style.display = 'none';
    document.getElementById('subnetVisualizerView').style.display = 'none';
    document.getElementById('atomPlaceholderView').style.display = 'none';
    document.getElementById('atom2View').style.display = 'none';
    document.getElementById('atom3View').style.display = 'none';
    document.getElementById('atom4View').style.display = 'none';
    document.getElementById('atom5View').style.display = 'none';
    document.getElementById('atom6View').style.display = 'none';
    document.getElementById('atom7View').style.display = 'none';
    document.getElementById('atom8View').style.display = 'none';
    document.getElementById('atom9View').style.display = 'none';
    document.getElementById('atom1View').style.display = 'flex';
    document.getElementById('timerContainer').style.display = timerIntervalId ? 'flex' : 'none';

    showAtomPaginationBar('atom1');

    currentFile = ''; // no single graded exercise is "current" on this page

    closeSampleOutputModal();
    updateConsoleDrawerTab(false);

    closeSidebarIfMobile();
}

/* =========================================================
   ATOM 2: THE MASK ASSEMBLY (INTERESTING OCTET) — rendering & interaction
   Follows Atom 1's lead throughout: same .panel/.bit-grid/.bit-cell/
   .class-value/.octet-field component language, same dedicated
   full-width view pattern (own container, own Verify/Reset + feedback per
   question, own nav score aggregation), same self-contained verify/reset
   pathway independent of the shared #actionButton/#feedback the Exercises
   list uses.

   The interaction itself is deliberately different from Atom 1's "click
   sets the subnet boundary" behavior: here every bit beyond the classful
   network portion starts at 0 and toggles independently (0->1->0) on its
   own click, since the student is assembling a specific, already-given
   mask rather than exploring where a boundary should sit. The classful
   network bits are locked to 1 by default (they're always part of any
   mask for this address) using the exact same "locked" bit-cell styling
   Atom 1 and the Subnet Visualizer already use — reused here to mean "this
   bit is fixed," not "this bit is off-limits to view."

   Bit-level coloring still reuses the app's existing locked/borrowed/host
   language even though "borrowed/host" don't map to Atom 2's task in the
   original visualizer sense: a mask bit the student has toggled ON in the
   togglable region IS, definitionally, a bit borrowed from the host
   portion into the network/subnet portion — so amber-for-"on" and
   green-for-"off" stays semantically honest, not just visually recycled.

   The target CIDR is shown once, as given information, in the prompt text
   and in Panel 1's static address readout (mirroring Atom 1's own static
   "/networkBits" suffix there) — but never as a live badge attached to the
   bit grid itself, so the grid can't be used to just read the answer back
   instead of building it.
========================================================= */

// Builds the 32-character '0'/'1' string representing the grid's default
// starting state for a given classful network-bit count: classful bits
// locked to 1, every remaining bit starts at 0. Used both to seed a fresh
// question and to reset an already-answered one.
function initAtom2MaskBits(networkBits) {
    return '1'.repeat(networkBits) + '0'.repeat(32 - networkBits);
}

// Builds the inner HTML of Atom 2's 32-bit grid from its current mask-bit
// string. Unlike Atom 1's renderAtom1BitGridInner (which derives every
// bit's color from a single borrowedBits boundary), each bit's color here
// comes directly from its own current value: locked (classful, always 1),
// "borrowed" styling when toggled on, "host" styling when left off.
function renderAtom2BitGridInner(qid, maskBitsArr, networkBits) {
    let html = '';
    for (let g = 0; g < 4; g++) {
        const bitsSlice = maskBitsArr.slice(g * 8, g * 8 + 8);
        const kindsSlice = bitsSlice.map((b, k) => {
            const gi = g * 8 + k;
            if (gi < networkBits) return 'locked';
            return b === 1 ? 'borrowed' : 'host';
        });

        html += '<div class="octet-block">';
        html += '<div class="octet-total octet-total-main">' + atom1BitsToOctet(bitsSlice) +
            (g < 3 ? '<span class="octet-total-dot">.</span>' : '') + '</div>';

        html += '<div class="weight-row weight-row-main">';
        OCTET_BIT_PLACE_VALUES.forEach((w, k) => {
            const lit = bitsSlice[k] === 1;
            const cls = lit ? ('weight-num weight-lit weight-lit-' + kindsSlice[k]) : 'weight-num weight-muted';
            html += '<span class="' + cls + '">' + w + '</span>';
        });
        html += '</div>';

        html += '<div class="bit-octet-group">';
        for (let b = 0; b < 8; b++) {
            const gi = g * 8 + b;
            const kind = kindsSlice[b];
            html += '<div class="bit-cell ' + kind + '" data-idx="' + gi + '"' +
                (kind !== 'locked' ? ' role="button" tabindex="0" title="Click to toggle this bit"' : '') + '>' +
                (kind === 'locked' ? '<span class="lock-icon"><i class="fa-solid fa-lock"></i></span>' : '') +
                '<span class="bit-value">' + bitsSlice[b] + '</span>' +
                '</div>';
        }
        html += '</div>';

        html += '<div class="octet-viz-label">Octet ' + (g + 1) + '</div>';
        html += '</div>';

        if (g < 3) html += '<div class="octet-dot-separator">.</div>';
    }
    return html;
}

// Re-renders the grid for a new mask-bit string, keeping the grid's own
// dataset in sync (the single source of truth for "what's currently
// toggled on" — read back out at verify/save time).
function updateAtom2Grid(qid, ex, maskBitsStr) {
    const grid = document.getElementById('atom2BitGrid-' + qid);
    if (!grid) return;
    const bitsArr = maskBitsStr.split('').map(Number);
    grid.dataset.maskbits = maskBitsStr;
    grid.innerHTML = renderAtom2BitGridInner(qid, bitsArr, ex.networkBits);
}

// Delegated click/keyboard handling for one question's grid. Clicking any
// unlocked bit flips just that bit (0->1 or 1->0) — independent of every
// other bit, unlike Atom 1's single-boundary click.
function attachAtom2Handlers(qid, ex) {
    const grid = document.getElementById('atom2BitGrid-' + qid);
    if (!grid) return;

    const handleActivate = (cell) => {
        if (exerciseData[qid]?.locked) return;
        if (!cell || cell.classList.contains('locked')) return;
        const idx = parseInt(cell.dataset.idx, 10);
        const current = grid.dataset.maskbits || initAtom2MaskBits(ex.networkBits);
        const chars = current.split('');
        chars[idx] = chars[idx] === '1' ? '0' : '1';
        updateAtom2Grid(qid, ex, chars.join(''));
        saveAtom2Progress(qid);
    };

    grid.addEventListener('click', (e) => {
        handleActivate(e.target.closest('.bit-cell'));
    });
    grid.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const cell = e.target.closest && e.target.closest('.bit-cell');
        if (!cell) return;
        e.preventDefault();
        handleActivate(cell);
    });
}

// Persists the in-progress mask-bit string for one Atom 2 question
// (analogous to saveAtom1Progress).
function saveAtom2Progress(qid) {
    const ex = exerciseData[qid];
    if (!ex || ex.locked) return;
    const grid = document.getElementById('atom2BitGrid-' + qid);
    ex.userAnswer = grid ? (grid.dataset.maskbits || initAtom2MaskBits(ex.networkBits)) : (ex.userAnswer || '');
    saveSessionProgress();
}

// Guards against attaching the delegated verify/reset click listener more
// than once, same rationale as atom1ActionsDelegated.
let atom2ActionsDelegated = false;

// --- ATOM 2: REQUIREMENT CARD (how the question is COMMUNICATED) ---
// Same rationale as Atom 1's buildAtom1RequirementCardHtml: the old plain
// prompt sentence ("Assemble the subnet mask for X/Y") and the static
// Panel 1 octet-box row underneath it were both restating the exact same
// two facts — the given host IP and the target CIDR — one right after the
// other. The bit grid below already shows each octet's own live total (and
// its locked/blue bits already make the classful network portion visually
// obvious), so nothing is lost by stating the given IP/CIDR once, here, in
// the same compact two-row card language Atom 1 uses, instead of twice.
function buildAtom2RequirementCardHtml(ex) {
    const ipStr = ex.octets.join('.');
    return (
        '<div class="atom1-req-card">' +
            '<div class="atom1-req-row">' +
                '<div class="atom1-req-icon atom1-req-icon-network"><i class="fa-solid fa-diagram-project" aria-hidden="true"></i></div>' +
                '<div class="atom1-req-body">' +
                    '<div class="atom1-req-eyebrow">Given host</div>' +
                    '<div class="atom1-req-main">' +
                        '<span class="atom1-req-badge">Class ' + ex.classLabel + '</span>' +
                        '<span class="atom1-req-value">' + ipStr + '<span class="atom1-req-cidr">/' + ex.targetCidr + '</span></span>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="atom1-req-row atom1-task-row">' +
                '<div class="atom1-req-icon atom1-req-icon-task"><i class="fa-solid fa-hand-pointer" aria-hidden="true"></i></div>' +
                '<div class="atom1-req-body">' +
                    '<div class="atom1-req-eyebrow">Your task</div>' +
                    '<div class="atom1-req-action-text">Assemble the subnet mask bit by bit — click a bit to toggle it between 0 and 1. Classful network bits are locked to 1, then verify.</div>' +
                '</div>' +
            '</div>' +
        '</div>'
    );
}

function buildAtom2PanelHtml(qid, ex, index) {
    // Grid always starts rendered in its default state (classful bits
    // locked to 1, rest at 0) — any persisted in-progress/locked state is
    // reapplied afterward by syncAtom2ViewDOM, mirroring Atom 1's own
    // buildAtom1PanelHtml/syncAtom1ViewDOM split.
    const initBits = initAtom2MaskBits(ex.networkBits).split('').map(Number);

    const gridHtml =
        '<div class="atom1-bitgrid-wrap">' +
            '<div class="bit-grid atom1-bitgrid atom2-bitgrid" id="atom2BitGrid-' + qid + '" data-qid="' + qid + '" data-network-bits="' + ex.networkBits + '" data-maskbits="' + initAtom2MaskBits(ex.networkBits) + '">' +
                renderAtom2BitGridInner(qid, initBits, ex.networkBits) +
            '</div>' +
            '<div class="legend secondary-copy">' +
                '<span><i class="swatch swatch-locked"></i> Locked network bit</span>' +
                '<span><i class="swatch swatch-borrowed"></i> Mask bit ON (1)</span>' +
                '<span><i class="swatch swatch-host"></i> Mask bit OFF (0)</span>' +
            '</div>' +
        '</div>';

    return (
        '<section class="panel atom1-q-panel" id="atom2QPanel-' + qid + '" data-qid="' + qid + '">' +
            '<div class="panel-head">' +
                '<span class="panel-index">Q' + index + '</span>' +
                '<h2>Subnet Mask Assembly</h2>' +
                '<span class="badge atom1-score-badge" id="atom2ScoreBadge-' + qid + '">0/1</span>' +
            '</div>' +
            buildAtom2RequirementCardHtml(ex) +
            gridHtml +
            '<div class="atom1-actions">' +
                '<button class="primary-btn atom2-verify-btn" data-qid="' + qid + '">Verify Answer</button>' +
                '<div class="atom1-feedback" id="atom2Feedback-' + qid + '" role="status" aria-live="polite"></div>' +
            '</div>' +
        '</section>'
    );
}

// Builds the full Atom 2 page from scratch (called once per login) and
// wires up each question's bit-grid interaction plus a single delegated
// click listener for every Verify/Reset button on the page — same
// structure as renderAtom1View.
function renderAtom2View(atom2List) {
    const container = document.getElementById('atom2QuestionsContainer');
    if (!container) return;

    container.innerHTML = atom2List
        .map((item, i) => buildAtom2PanelHtml(item.name, exerciseData[item.name], i + 1))
        .join('');

    atom2List.forEach(item => {
        attachAtom2Handlers(item.name, exerciseData[item.name]);
    });

    if (!atom2ActionsDelegated) {
        atom2ActionsDelegated = true;
        container.addEventListener('click', (e) => {
            const btn = e.target.closest('.atom2-verify-btn');
            if (!btn) return;
            const qid = btn.dataset.qid;
            const ex = exerciseData[qid];
            if (!ex) return;
            if (ex.locked) {
                resetAtom2Question(qid);
            } else {
                verifyAtom2Question(qid);
            }
        });
    }

    attachAtomPaginationHandlers();
    initAtomPagination('atom2');
}

// Sets the Verify/Reset/Locked button label + disabled state for one
// question — same rules as setAtom1ButtonState.
function setAtom2ButtonState(qid) {
    const ex = exerciseData[qid];
    const btn = document.querySelector('.atom2-verify-btn[data-qid="' + qid + '"]');
    if (!btn || !ex) return;
    if (ex.locked) {
        if (isRetryAllowed()) {
            btn.textContent = 'Reset';
            btn.disabled = false;
        } else {
            btn.textContent = 'Locked';
            btn.disabled = true;
        }
    } else {
        btn.textContent = 'Verify Answer';
        btn.disabled = false;
    }
}

// Renders this question's per-question feedback. Reuses
// buildFeedbackForExercise/renderFeedback exactly as Atom 1 does — with
// answers.length === 1, its existing all-or-nothing "Not quite" branch
// already produces the right wording for Atom 2's 1-point score with no
// changes needed there.
function updateAtom2QuestionFeedback(qid, ex) {
    const el = document.getElementById('atom2Feedback-' + qid);
    if (!el) return;
    if (!ex || !ex.locked) {
        el.textContent = '';
        el.className = 'atom1-feedback';
        return;
    }
    const feedback = buildFeedbackForExercise(ex);
    renderFeedback(el, feedback);
    el.className = 'atom1-feedback ' + feedback.cls;
}

// Updates one question's score badge (max always 1/1 for Atom 2) — same
// coloring convention as updateAtom1ScoreBadge.
function updateAtom2ScoreBadge(qid, ex) {
    const badge = document.getElementById('atom2ScoreBadge-' + qid);
    if (!badge || !ex) return;
    badge.textContent = (ex.score || 0) + '/' + ex.answers.length;
    badge.classList.remove('completed-score', 'partial-score');
    if (ex.locked) {
        if (ex.score === ex.answers.length) badge.classList.add('completed-score');
        else if (ex.score > 0) badge.classList.add('partial-score');
    }
}

// Applies every visual consequence of this question being locked — same
// shape as applyAtom1LockedUI. Reuses the "atom1-locked" grid-lock class
// (identical pointer-events/opacity rule already defined for it in CSS;
// the grid also carries the shared "atom1-bitgrid" class, so no new CSS
// selector is needed for Atom 2 specifically).
function applyAtom2LockedUI(qid, ex) {
    const panel = document.getElementById('atom2QPanel-' + qid);
    const grid = document.getElementById('atom2BitGrid-' + qid);
    const isCorrect = (ex.score || 0) === ex.answers.length;

    if (panel) {
        panel.classList.remove('correct', 'incorrect');
        panel.classList.add(isCorrect ? 'correct' : 'incorrect');
    }
    if (grid) grid.classList.add('atom1-locked');

    updateAtom2QuestionFeedback(qid, ex);
    updateAtom2ScoreBadge(qid, ex);
    setAtom2ButtonState(qid);
}

// Grades and locks one Atom 2 question — reads the grid's current
// mask-bit string, converts it to dotted-decimal, and compares the WHOLE
// mask against the correct one. All-or-nothing (1 point), same grading
// shape as Atom 1 — self-contained here since Atom 2 doesn't route
// through the shared checkAnswers flow.
function verifyAtom2Question(qid) {
    const ex = exerciseData[qid];
    if (!ex || ex.locked) return;

    const grid = document.getElementById('atom2BitGrid-' + qid);
    const maskBitsStr = grid ? (grid.dataset.maskbits || initAtom2MaskBits(ex.networkBits)) : initAtom2MaskBits(ex.networkBits);
    const bitsArr = maskBitsStr.split('').map(Number);
    const userOctets = [0, 1, 2, 3].map(g => atom1BitsToOctet(bitsArr.slice(g * 8, g * 8 + 8)));
    const userMask = userOctets.join('.');

    ex.userAnswer = maskBitsStr; // stored as the raw bit string for faithful restore

    const isCorrect = userMask === (ex.correct || '').trim();
    ex.score = isCorrect ? 1 : 0;
    ex.isPartial = false;
    ex.locked = true;

    applyAtom2LockedUI(qid, ex);
    updateAtom2NavScore();
    updateSummaryPanel();

    if (isCorrect) triggerConfetti();

    saveSessionProgress();
    if (appSettings.mode === 'exam') {
        if (checkIfAllAnswered()) {
            stopTimer();
            setTimeout(() => {
                showScoreSummaryModal('Congratulations! All exercises completed before time ran out!', 'success');
            }, 500);
        }
    }
}

// Resets one Atom 2 question — practice mode only, mirroring
// resetAtom1Question's exam-mode guard.
function resetAtom2Question(qid) {
    if (!isRetryAllowed()) {
        showAlertModal('Reset Not Allowed', sessionTimedOut ? 'Reset is not allowed after time expires.' : 'Reset is not allowed in Exam Mode.');
        return;
    }
    const ex = exerciseData[qid];
    if (!ex) return;

    ex.userAnswer = '';
    ex.score = 0;
    ex.isPartial = false;
    ex.locked = false;

    updateAtom2Grid(qid, ex, initAtom2MaskBits(ex.networkBits));

    const panel = document.getElementById('atom2QPanel-' + qid);
    if (panel) panel.classList.remove('correct', 'incorrect');
    const grid = document.getElementById('atom2BitGrid-' + qid);
    if (grid) grid.classList.remove('atom1-locked');

    updateAtom2QuestionFeedback(qid, null);
    updateAtom2ScoreBadge(qid, ex);
    setAtom2ButtonState(qid);
    updateAtom2NavScore();
    updateSummaryPanel();
    saveSessionProgress();
}

// Aggregates every atom2-q* exercise into a single X/N readout on the
// sidebar's "Atom 2" nav entry, same as updateAtom1NavScore.
function updateAtom2NavScore() {
    const scoreEl = document.getElementById('score-atom2');
    if (!scoreEl) return;
    let got = 0;
    let total = 0;
    for (const file in exerciseData) {
        if (file.indexOf('atom2-q') === 0) {
            const ex = exerciseData[file];
            got += Number(ex.score || 0);
            total += ex.answers.length;
        }
    }
    scoreEl.textContent = got + '/' + total;
    scoreEl.classList.remove('completed-score', 'partial-score');
    if (total > 0 && got === total) {
        scoreEl.classList.add('completed-score');
    } else if (got > 0) {
        scoreEl.classList.add('partial-score');
    }
}

// Re-applies every Atom 2 question's current exerciseData state (grid
// mask-bit string, locked styling, feedback, badge) onto the
// already-rendered DOM — called once per login, after exam-session
// restore, same rationale as syncAtom1ViewDOM.
function syncAtom2ViewDOM() {
    for (const file in exerciseData) {
        if (file.indexOf('atom2-q') !== 0) continue;
        const ex = exerciseData[file];
        if (!ex) continue;

        const maskBitsStr = (typeof ex.userAnswer === 'string' && ex.userAnswer.length === 32)
            ? ex.userAnswer
            : initAtom2MaskBits(ex.networkBits);
        updateAtom2Grid(file, ex, maskBitsStr);

        if (ex.locked) {
            applyAtom2LockedUI(file, ex);
        } else {
            setAtom2ButtonState(file);
        }
    }
    updateAtom2NavScore();
}

// --- Sidebar navigation into the Atom 2 view (Tools → Atoms → Atom 2) ---
// Mirrors showAtom1Page exactly.
function showAtom2Page() {
    document.querySelectorAll('.sidebar li').forEach(l => l.classList.remove('active'));
    const navItem = document.getElementById('nav-atom2');
    if (navItem) navItem.classList.add('active');

    document.getElementById('exerciseArea').style.display = 'none';
    document.getElementById('subnetVisualizerView').style.display = 'none';
    document.getElementById('atomPlaceholderView').style.display = 'none';
    document.getElementById('atom1View').style.display = 'none';
    document.getElementById('atom2View').style.display = 'flex';
    document.getElementById('atom3View').style.display = 'none';
    document.getElementById('timerContainer').style.display = timerIntervalId ? 'flex' : 'none';
    document.getElementById('atom4View').style.display = 'none';
    document.getElementById('atom5View').style.display = 'none';
    document.getElementById('atom6View').style.display = 'none';
    document.getElementById('atom7View').style.display = 'none';
    document.getElementById('atom8View').style.display = 'none';
    document.getElementById('atom9View').style.display = 'none';

    showAtomPaginationBar('atom2');

    currentFile = ''; // no single graded exercise is "current" on this page

    closeSampleOutputModal();
    updateConsoleDrawerTab(false);

    closeSidebarIfMobile();
}

/* =========================================================
   ATOM 3: THE SPACE MAP (FRONT & BACK SUBNETS) — rendering & interaction
   Reuses Atom 1's exact boundary-click mechanic and grid renderer
   (renderAtom1BitGridInner / atom1OctetsToBits / atom1BitsToOctet) rather
   than a parallel implementation: the given classful address is shown in
   a Panel-1-style row, the target CIDR is stated as given information
   (same convention as Atom 2's static targetCidr suffix), and clicking any
   unlocked bit in the 32-bit grid sets the subnet boundary there — nothing
   here re-derives the borrowed-bit count for the student; they have to
   read the class off the address and work out (targetCidr - networkBits)
   themselves before clicking.

   Underneath the grid, a live subnet-ID list shows WHICH subnets the
   current boundary position produces (first 4 / last 4, or all of them
   when there are 8 or fewer) — but each one starts at all-zero bits and is
   itself independently clickable, exactly like Atom 2's per-bit toggle
   grid. The list tells the student which subnet numbers to build; it never
   fills in the binary for them. Moving the boundary regenerates the list
   (new subnet numbers, bits reset to 0) since a new boundary means a new
   set of subnets to build.

   Grading is all-or-nothing across BOTH parts: the grid's final boundary
   must equal the target borrowed-bit count, AND every currently-shown
   row's clicked-in bits must correctly represent its own labeled subnet
   number at that bit width.
========================================================= */

// Given a borrowed-bit count, returns the ordered list of subnet indices
// the live list displays for it — every subnet when there are 8 or fewer,
// otherwise the first 4 and last 4. Shared by the renderer (so the
// question always shows the right numbers) and the grader (so "correct"
// is computed against the exact same set), so the two can never drift.
function atom3SubnetIndicesForBorrowed(borrowedBits) {
    const totalSubnets = Math.pow(2, borrowedBits);
    if (borrowedBits <= 0) return [0];
    if (totalSubnets <= 8) return Array.from({ length: totalSubnets }, (_, i) => i);
    return [0, 1, 2, 3, totalSubnets - 4, totalSubnets - 3, totalSubnets - 2, totalSubnets - 1];
}

// Renders the "Subnet Index" bit pattern for one row — the same visual
// language Panel 4's own borrowed-bit pattern viz uses (a decimal total
// on top, a weight row scaled to the borrowed-bit width, a joined compact
// bit-cell strip, and a label underneath), so this reads identically to
// the Subnet Visualizer's own Subnet Permutation Table instead of the old
// flat toggle strip. Every cell is always styled "borrowed" (amber)
// regardless of its current 0/1 value — matching Panel 4's treatment of
// subnet-index bits as inherently subnet bits — only the weight row above
// lights up per the actual value. Cells stay clickable here (role=
// "button") since the student is building this pattern rather than
// viewing a derived one.
//
// Sits directly above the bit-answer grid as a "SUBNET" pill with a
// prominent circular badge, replacing the old plain decimal total and the
// even older muted "Subnet N" caption that used to sit underneath the
// bits. The circle badge — not just plain text — is what signals "this is
// a subnet INDEX", the same kind of numbered-identity cue a sequence
// number alone doesn't carry.
//
// The pill pairs a "SUBNET" label with a live decimal readout — the same
// value the old, now-removed ".octet-total-compact" div used to show on
// its own, so nothing is lost by dropping that separate display; the
// pill's circle IS the total now. The circle shows the LIVE value the
// currently-clicked bits represent, not the static target — it updates in
// real time as the student clicks, but is deliberately NEVER recolored or
// otherwise flagged when it happens to equal the target. Doing so would
// let a student find the right answer by randomly toggling bits until the
// badge turns green, rather than by reasoning out the subnet ID.
// Correctness is only ever revealed after Verify, and then at the level of
// the whole row (see applyAtom3ItemFeedback, which colors the containing
// .subnet-row), not on this live badge. The target number itself (which
// subnet this row is FOR) is answer-relevant, so that's only surfaced via
// the tooltip, and only in Practice Mode.
//
// WRAPPING (per atom3_subnet_mockup_desktop.html / _mobile.html): a
// single flat row of bit-cells only reads cleanly up to about 8 bits —
// beyond that it either overflows its column sideways or the cells shrink
// past legibility. Instead, the strip wraps into 8-bit-wide rows, and
// EACH row gets its own place-value weight strip directly above its own
// bits, rather than one weight row spanning the full (possibly 9-10-bit)
// pattern. That keeps the "this bit is worth this much" mapping legible
// at any borrowed-bit width Atom 3 can generate (up to 10), the same way
// the mockups scale cleanly from 1 up to 16 bits. Bit indices in data-idx
// stay GLOBAL (position within the full pattern, not per-row), so nothing
// downstream (updateAtom3Row's click handler, grading) needs to change.
function buildSubnetIndexInner(bitsArr, options) {
    const config = options || {};
    const n = bitsArr.length;
    const total = n ? parseInt(bitsArr.join(''), 2) : 0;
    const rowsCount = Math.max(1, Math.ceil(n / 8));
    const interactive = config.interactive !== false;
    const bitClass = config.bitClass ? ' ' + config.bitClass : '';

    let rowsHtml = '<div class="bit-rows">';
    for (let r = 0; r < rowsCount; r++) {
        const start = r * 8;
        const chunk = bitsArr.slice(start, start + 8);
        const startPow = n - 1 - start; // place-value exponent of this row's leftmost bit

        let caption = '';
        if (rowsCount > 1) {
            const hi = Math.pow(2, startPow);
            const lo = Math.pow(2, startPow - chunk.length + 1);
            caption = '<div class="bit-row-caption">' + (r === 0 ? 'MSB &middot; ' : '') + hi + ' &rarr; ' + lo + (r === rowsCount - 1 ? ' &middot; LSB' : '') + '</div>';
        }

        let inner = '<div class="bit-row-inner">';
        chunk.forEach((v, i) => {
            const globalIdx = start + i;
            const weight = Math.pow(2, startPow - i);
            const bitAttrs = interactive
                ? ' role="button" tabindex="0" data-idx="' + globalIdx + '" aria-label="Bit worth ' + weight + ', currently ' + v + '"'
                : ' aria-hidden="true"';
            inner += '<div class="bit-col">' +
                        '<span class="bit-weight' + (v === 1 ? ' active' : '') + '">' + weight + '</span>' +
                        '<div class="idx-bit' + bitClass + (v === 1 ? ' on' : '') + '"' + bitAttrs + '>' + v + '</div>' +
                      '</div>';
        });
        inner += '</div>';

        rowsHtml += caption + inner;
    }
    rowsHtml += '</div>';

    const pillTitleAttr = config.pillTitle ? ' title="' + config.pillTitle + '"' : '';
    const hint = config.hint || (interactive ? '&middot; tap bits to answer' : '&middot; read-only');
    const badgeHtml = config.badgeHtml || '<span class="idx-pill-badge">' + total + '</span>';
    const footerHtml = config.footerHtml || '<div class="idx-viz-label">Subnet Index</div>';

    return '<div class="idx-pill-row"' + pillTitleAttr + '>' +
                '<span class="idx-pill-label">Subnet Index <span class="idx-hint">' + hint + '</span></span>' +
                badgeHtml +
            '</div>' +
            rowsHtml +
            footerHtml;
}

function renderAtom3SubnetIndexInner(qid, rowPos, bitsArr, subnetNum) {
    const pillTitle = 'This row builds Subnet ' + subnetNum;
    const footerHtml = '<div class="idx-viz-label">Target: Subnet ' + subnetNum + '</div>';

    return buildSubnetIndexInner(bitsArr, {
        pillTitle,
        footerHtml
    });
}

// Wraps renderAtom3SubnetIndexInner in the "idx-block" answer-card markup
// ported from atom3_subnet_mockup_combined.html — an amber-bordered card
// with its own pill header (live decimal readout) and a bit strip that
// wraps into additional 8-bit rows past 8 borrowed bits, scaling cleanly
// from 1 up to Atom 3's max of 10 (the mockup itself scales 1-16). Unlike
// the old Panel-4-style "octet-bits-group" this replaced, no width needs
// computing here: .idx-block sizes to its own content (its cqi-based
// label sizing keys off the row's own container, see .atom3-subnet-group
// in styles.css), and the grid column it sits in (.subnet-row, "auto 1fr")
// sizes around it automatically.
//
// Carries data-qid/data-row so updateAtom3Row can find and re-render it
// directly, data-subnet so it can restate the same target subnet number on
// every re-render without it being re-passed in from the click handler,
// and the "atom3-bit-row" class + data-bits/id contract every other Atom 3
// helper (collectAtom3Answer, applyAtom3ItemFeedback, syncAtom3ViewDOM, the
// click handler in attachAtom3Handlers) already relies on — only the
// visual language inside it changed here, not that contract.
function renderAtom3SubnetIndexViz(qid, rowPos, bitsArr, subnetNum) {
    // "idx-block" is the mockup's amber-bordered answer card; it also
    // keeps the "atom3-bit-row" marker class (+ id/data-qid/data-row/
    // data-bits) that the click handler, collectAtom3Answer,
    // applyAtom3ItemFeedback, and syncAtom3ViewDOM all already look up by
    // — only the visual language inside it changed, not this contract.
    return '<div class="idx-block atom3-bit-row" id="atom3Row-' + qid + '-' + rowPos + '" data-qid="' + qid + '" data-row="' + rowPos + '" data-subnet="' + subnetNum + '" data-bits="' + bitsArr.join('') + '">' +
        renderAtom3SubnetIndexInner(qid, rowPos, bitsArr, subnetNum) +
        '</div>';
}

// Local duplicate of Panel 4/5's per-octet bit visualization
// (buildSingleOctetBits, private to the SubnetVisualizer IIFE and not
// reachable from here) — renders one octet's total/weight-row/bit-cell/
// label block, including the dashed "curtain" divider marking the
// boundary between borrowed (subnet) and host bits, exactly as Panel 4's
// own "Octet Bits & Subnet ID" column does.
function atom3BuildSingleOctetBits(fullBits, networkBits, borrowEnd, octetIndex) {
    const octetStart = octetIndex * 8;
    const bitsSlice = fullBits.slice(octetStart, octetStart + 8);
    let weightsHtml = '';
    let bitsHtml = '';
    for (let k = 0; k < 8; k++) {
        const gi = octetStart + k;
        let kind = 'host';
        if (gi < networkBits) kind = 'locked';
        else if (gi < borrowEnd) kind = 'borrowed';
        const lit = bitsSlice[k] === 1;
        const isCurtainBit = gi === borrowEnd - 1 && borrowEnd > networkBits && gi < octetStart + 7;
        weightsHtml += '<span class="addr-weight' + (lit ? ' lit-' + kind : '') + '">' + OCTET_BIT_PLACE_VALUES[k] + '</span>';
        bitsHtml += '<div class="addr-bit ' + kind + (isCurtainBit ? ' curtain' : '') + '">' + bitsSlice[k] + '</div>';
    }
    const totalVal = atom1BitsToOctet(bitsSlice);
    const dot = octetIndex < 3 ? '<span class="addr-total-dot">.</span>' : '';

    return '<div class="addr-octet">' +
        '<div class="addr-total-box">' + totalVal + dot + '</div>' +
        '<div class="addr-weight-row">' + weightsHtml + '</div>' +
        '<div class="addr-bits">' + bitsHtml + '</div>' +
        '<div class="addr-octet-label">Octet ' + (octetIndex + 1) + '</div>' +
        '</div>';
}

// Composes the full 32-bit network address for one subnet row — classful
// network-portion bits (from the given classful address) + this row's own
// subnet bits (however many of them the student has clicked to 1 so far)
// + zero-filled host bits — and renders it with the same rich per-octet
// bit visualization Panel 4 uses (see atom3BuildSingleOctetBits above)
// instead of a plain dotted-decimal string. Recomputed live as the
// student clicks each row's bits, mirroring Atom 1's live formula box:
// it only reflects the current attempt, never the target.
function atom3BuildFullAddressViz(ex, subnetBitsArr) {
    const networkBits = ex.networkBits;
    const borrowEnd = networkBits + subnetBitsArr.length;
    const hostBits = Math.max(0, 32 - borrowEnd);
    const prefixBits = atom1OctetsToBits(ex.octets).slice(0, networkBits);
    const fullBits = prefixBits.concat(subnetBitsArr).concat(new Array(hostBits).fill(0));
    let out = '<div class="addr-row">';
    for (let o = 0; o < 4; o++) {
        out += atom3BuildSingleOctetBits(fullBits, networkBits, borrowEnd, o);
    }
    out += '</div>';
    return out;
}

// Builds one subnet's row: its clickable "Subnet Index" bit pattern, and
// — mirroring Panel 4's own "Octet Bits & Subnet ID" column — the full
// composed network address, both rendered with the exact same compact
// bit-visualization language Panel 4 uses. No separate "Subnet N" text
// label — the index box's own decimal total already is that number (see
// renderAtom3SubnetIndexViz), same as Panel 4's own table. Both live
// readouts reflect only what's been entered so far (all-zero / the
// classful-plus-zeros address until the student acts) — neither one
// reveals the target, they only mirror back the current attempt.
function buildAtom3RowHtml(qid, rowPos, subnetNum, borrowedBits, ex) {
    const zeros = new Array(borrowedBits).fill(0);
    if (ex.type === 'atom4') {
        const subnetBits = zeros.join('');
        const hostBits = atom4DefaultBits(ex);
        return (
            '<div class="subnet-row atom4-subnet-row" id="atom3SubnetRow-' + qid + '-' + rowPos + '" data-qid="' + qid + '" data-row="' + rowPos + '">' +
                renderAtom3SubnetIndexViz(qid, rowPos, zeros, subnetNum) +
                '<div class="atom4-row-boundaries" id="atom4RowBoundaries-' + qid + '-' + rowPos + '">' +
                    buildAtom4BoundaryHtml(qid, ex, 'network', hostBits, subnetBits, rowPos) +
                    buildAtom4BoundaryHtml(qid, ex, 'broadcast', hostBits, subnetBits, rowPos) +
                '</div>' +
            '</div>'
        );
    }
    return (
        '<div class="subnet-row" id="atom3SubnetRow-' + qid + '-' + rowPos + '" data-qid="' + qid + '" data-row="' + rowPos + '">' +
            renderAtom3SubnetIndexViz(qid, rowPos, zeros, subnetNum) +
            '<div class="atom3-row-network" id="atom3Network-' + qid + '-' + rowPos + '">' + atom3BuildFullAddressViz(ex, zeros) + '</div>' +
        '</div>'
    );
}

// Builds the live "first N / last N subnets" list for the CURRENT
// borrowed-bit selection — WHICH subnets are shown updates live as the
// boundary moves, but every row's bits always start at 0 for the student
// to build themselves. `ex` is threaded through so each row can compose
// its own live network-address readout (see atom3BuildFullAddressViz).
// Always a single vertical column (.atom3-subnet-group) — when there are
// more than 8 subnets, "First 4"/"Last 4" are two stacked sections within
// that same column rather than two side-by-side groups.
function buildAtom3SubnetListHtml(qid, borrowedBits, ex) {
    const indices = atom3SubnetIndicesForBorrowed(borrowedBits);
    const rowsHtml = indices.map((n, pos) => buildAtom3RowHtml(qid, pos, n, borrowedBits, ex)).join('');

    if (borrowedBits <= 0) {
        return '<div class="atom3-subnet-group"><h3 class="atom3-group-title">Subnets</h3>' + rowsHtml + '</div>';
    }
    const totalSubnets = Math.pow(2, borrowedBits);
    if (totalSubnets <= 8) {
        return '<div class="atom3-subnet-group"><h3 class="atom3-group-title">All ' + totalSubnets + ' Subnet' + (totalSubnets === 1 ? '' : 's') + '</h3>' + rowsHtml + '</div>';
    }
    const firstRowsHtml = indices.slice(0, 4).map((n, pos) => buildAtom3RowHtml(qid, pos, n, borrowedBits, ex)).join('');
    const lastRowsHtml = indices.slice(4, 8).map((n, pos) => buildAtom3RowHtml(qid, pos + 4, n, borrowedBits, ex)).join('');
    return '<div class="atom3-subnet-group">' +
                '<h3 class="atom3-group-title">First 4 Subnets</h3>' + firstRowsHtml +
                '<h3 class="atom3-group-title atom3-group-title-second">Last 4 Subnets</h3>' + lastRowsHtml +
            '</div>';
}

// Re-renders the grid + borrow badge + live subnet list for a new
// borrowed-bit count. Called on every grid click and on restore — the
// subnet list is always rebuilt FRESH (bits reset to 0) since a new
// boundary means a new set of subnets to build from scratch.
function updateAtom3Grid(qid, ex, borrowedBits) {
    const grid = document.getElementById('atom3BitGrid-' + qid);
    if (!grid) return;
    const inputBits = atom1OctetsToBits(ex.octets);
    grid.dataset.borrowed = String(borrowedBits);
    grid.innerHTML = renderAtom1BitGridInner(qid, inputBits, ex.networkBits, borrowedBits);

    const badge = document.getElementById('atom3BorrowBadge-' + qid);
    if (badge) {
        badge.innerHTML = '<span>' + borrowedBits + ' bit' + (borrowedBits === 1 ? '' : 's') + ' borrowed &rarr; /' + (ex.networkBits + borrowedBits) + '</span>';
    }

    const listWrap = document.getElementById('atom3SubnetList-' + qid);
    if (listWrap) listWrap.innerHTML = buildAtom3SubnetListHtml(qid, borrowedBits, ex);
}

// --- ATOM 3: MASK ASSEMBLY GRID (reuses Atom 2's mask-assembly engine) ---
// Once the boundary is set above, the student assembles the matching
// subnet mask bit by bit — classful network bits locked to 1, everything
// else starts at 0 and toggles independently on click, exactly like Atom
// 2's own grid (renderAtom2BitGridInner/initAtom2MaskBits are reused
// directly; this section only adds the DOM plumbing to give Atom 3 its
// own independent mask-grid instance per question).
function updateAtom3MaskGrid(qid, ex, maskBitsStr) {
    const grid = document.getElementById('atom3MaskGrid-' + qid);
    if (!grid) return;
    const bitsArr = maskBitsStr.split('').map(Number);
    grid.dataset.maskbits = maskBitsStr;
    grid.innerHTML = renderAtom2BitGridInner(qid, bitsArr, ex.networkBits);
}

function attachAtom3MaskHandlers(qid, ex) {
    const grid = document.getElementById('atom3MaskGrid-' + qid);
    if (!grid) return;

    const handleActivate = (cell) => {
        if (exerciseData[qid]?.locked) return;
        if (!cell || cell.classList.contains('locked')) return;
        const idx = parseInt(cell.dataset.idx, 10);
        const current = grid.dataset.maskbits || initAtom2MaskBits(ex.networkBits);
        const chars = current.split('');
        chars[idx] = chars[idx] === '1' ? '0' : '1';
        updateAtom3MaskGrid(qid, ex, chars.join(''));
        saveAtom3Progress(qid);
    };

    grid.addEventListener('click', (e) => {
        handleActivate(e.target.closest('.bit-cell'));
    });
    grid.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const cell = e.target.closest && e.target.closest('.bit-cell');
        if (!cell) return;
        e.preventDefault();
        handleActivate(cell);
    });
}

// Re-renders one subnet row's "Subnet Index" pattern and its live
// composed network address for a new bit array, keeping the row's own
// dataset in sync (the single source of truth for "what's currently
// clicked" for that row — read back out at verify/save/collect time).
// Reads the target subnet number back from the group's own data-subnet
// attribute (set once in renderAtom3SubnetIndexViz) so the caption keeps
// stating the correct target on every click, without needing it re-passed
// in from the handler.
function updateAtom3Row(qid, rowPos, bitsArr) {
    const rowEl = document.getElementById('atom3Row-' + qid + '-' + rowPos);
    if (!rowEl) return;
    const subnetNum = rowEl.dataset.subnet;
    rowEl.dataset.bits = bitsArr.join('');
    rowEl.innerHTML = renderAtom3SubnetIndexInner(qid, rowPos, bitsArr, subnetNum);

    const ex = exerciseData[qid];
    const networkEl = document.getElementById('atom3Network-' + qid + '-' + rowPos);
    if (networkEl && ex) networkEl.innerHTML = atom3BuildFullAddressViz(ex, bitsArr);
    if (ex && ex.type === 'atom4') {
        const getHostBits = boundary => Array.from(document.querySelectorAll('.atom4-host-bit[data-qid="' + qid + '"][data-boundary="' + boundary + '"][data-row="' + rowPos + '"]'))
            .sort((a, b) => parseInt(a.dataset.index, 10) - parseInt(b.dataset.index, 10))
            .map(cell => cell.textContent).join('');
        const hostFallback = atom4DefaultBits(ex);
        const boundaries = document.getElementById('atom4RowBoundaries-' + qid + '-' + rowPos);
        if (boundaries) {
            boundaries.innerHTML = buildAtom4BoundaryHtml(qid, ex, 'network', getHostBits('network') || hostFallback, bitsArr.join(''), rowPos) +
                buildAtom4BoundaryHtml(qid, ex, 'broadcast', getHostBits('broadcast') || hostFallback, bitsArr.join(''), rowPos);
        }
    }
}

// Delegated click/keyboard handling for one question: the 32-bit grid
// (boundary-setting, exactly like Atom 1) PLUS every subnet row's bit
// strip below it (per-bit toggle, exactly like Atom 2's mask grid).
// Attached once to each persistent container — grid clicks regenerate the
// row list via updateAtom3Grid; row clicks only flip that one bit.
function attachAtom3Handlers(qid, ex) {
    const grid = document.getElementById('atom3BitGrid-' + qid);
    if (grid) {
        const handleGridActivate = (cell) => {
            if (exerciseData[qid]?.locked) return;
            if (!cell || cell.classList.contains('locked')) return;
            const idx = parseInt(cell.dataset.idx, 10);
            let newBorrowed = idx - ex.networkBits + 1;
            newBorrowed = Math.max(0, Math.min(newBorrowed, ex.maxBorrow));
            updateAtom3Grid(qid, ex, newBorrowed);
            saveAtom3Progress(qid);
        };

        grid.addEventListener('click', (e) => {
            handleGridActivate(e.target.closest('.bit-cell'));
        });
        grid.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            const cell = e.target.closest && e.target.closest('.bit-cell');
            if (!cell) return;
            e.preventDefault();
            handleGridActivate(cell);
        });
    }

    const listWrap = document.getElementById('atom3SubnetList-' + qid);
    if (listWrap) {
        const handleRowActivate = (cell) => {
            if (exerciseData[qid]?.locked) return;
            const row = cell.closest('.atom3-bit-row');
            if (!row) return;
            const rowPos = row.dataset.row;
            const idx = parseInt(cell.dataset.idx, 10);
            const bits = (row.dataset.bits || '').split('').map(Number);
            bits[idx] = bits[idx] === 1 ? 0 : 1;
            updateAtom3Row(qid, rowPos, bits);
            saveAtom3Progress(qid);
        };

        listWrap.addEventListener('click', (e) => {
            const cell = e.target.closest('.idx-bit');
            if (cell) handleRowActivate(cell);
        });
        listWrap.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            const cell = e.target.closest && e.target.closest('.idx-bit');
            if (!cell) return;
            e.preventDefault();
            handleRowActivate(cell);
        });
    }
}

// Reads every currently-shown row's bit string, in display order, plus
// the grid's own boundary — the full in-progress answer for one Atom 3
// question. Serialized as "borrowedBits::bits1,bits2,..." so both parts
// persist and restore together (see restoreAtom3Answer/gradeAtom3Answer).
function collectAtom3Answer(qid) {
    const ex = exerciseData[qid];
    const grid = document.getElementById('atom3BitGrid-' + qid);
    const borrowedBits = grid ? (grid.dataset.borrowed || '0') : '0';
    const maskGrid = document.getElementById('atom3MaskGrid-' + qid);
    const maskBits = maskGrid ? (maskGrid.dataset.maskbits || (ex ? initAtom2MaskBits(ex.networkBits) : '')) : (ex ? initAtom2MaskBits(ex.networkBits) : '');
    const rows = Array.from(document.querySelectorAll('.atom3-bit-row[data-qid="' + qid + '"]'))
        .sort((a, b) => parseInt(a.dataset.row, 10) - parseInt(b.dataset.row, 10));
    const rowBits = rows.map(r => r.dataset.bits || '');
    return borrowedBits + '::' + maskBits + '::' + rowBits.join(',');
}

// Grades every answerable item in one Atom 3 question and returns a
// { score, allCorrect } pair — partial credit, not a single all-or-
// nothing boolean — mirroring the octet-scored IP conversion questions
// elsewhere in this file (see gradeConversionScore). Answerable items:
//   1. The boundary grid's final borrowed-bit count (1 point).
//   2. The assembled subnet mask, checked against the TARGET CIDR's
//      standard mask regardless of what boundary was chosen (1 point) —
//      the mask-assembly grid always starts from the same classful-bits-
//      locked state independent of the boundary step above it, so it's
//      graded independently too.
//   3. Each subnet row shown for the TARGET borrowed-bit count (1 point
//      each). Rows can only be individually graded when the student's
//      chosen boundary matches the target: a different boundary shows an
//      entirely different set of subnet rows (different indices,
//      different bit widths), so there's no meaningful row-by-row
//      mapping back to the target rows in that case — those points stay
//      unearned until the boundary itself is fixed.
// Uses atom3SubnetIndicesForBorrowed so the expected subnet numbers can
// never drift from what the renderer actually displayed.
function gradeAtom3Answer(ex, userAnswerStr) {
    const parts = (userAnswerStr || '').split('::');
    const borrowedBits = parseInt(parts[0], 10);
    const boundaryCorrect = !isNaN(borrowedBits) && borrowedBits === ex.correctBits;

    const maskBitsStr = parts[1] !== undefined ? parts[1] : '';
    const expectedMask = initAtom2MaskBits(ex.networkBits + ex.correctBits);
    const maskCorrect = maskBitsStr === expectedMask;

    const targetIndices = atom3SubnetIndicesForBorrowed(ex.correctBits);
    let rowsCorrect = 0;
    // Per-row correctness, position-aligned with targetIndices — this is
    // what drives per-row visual feedback (see applyAtom3ItemFeedback). If
    // the boundary itself is wrong, the rows currently on screen belong to
    // a different boundary and aren't comparable to the target rows, so
    // every row is marked incorrect (none earned a point either).
    const rowCorrectArr = new Array(targetIndices.length).fill(false);
    if (boundaryCorrect) {
        const rowBitsStrs = (parts[2] !== undefined ? parts[2] : '').split(',');
        for (let i = 0; i < targetIndices.length; i++) {
            const expected = ex.correctBits > 0 ? targetIndices[i].toString(2).padStart(ex.correctBits, '0') : '';
            const isRowCorrect = (rowBitsStrs[i] || '') === expected;
            rowCorrectArr[i] = isRowCorrect;
            if (isRowCorrect) rowsCorrect++;
        }
    }

    const maxScore = 2 + targetIndices.length;
    const score = (boundaryCorrect ? 1 : 0) + (maskCorrect ? 1 : 0) + rowsCorrect;
    return { score, allCorrect: score === maxScore, boundaryCorrect, maskCorrect, rowCorrectArr };
}

// Persists the in-progress boundary + subnet-row bits for one Atom 3
// question (analogous to saveAtom1Progress/saveAtom2Progress).
function saveAtom3Progress(qid) {
    const ex = exerciseData[qid];
    if (!ex || ex.locked) return;
    ex.userAnswer = collectAtom3Answer(qid);
    saveSessionProgress();
}

// Guards against attaching the delegated verify/reset click listener more
// than once, same rationale as atom1ActionsDelegated/atom2ActionsDelegated.
let atom3ActionsDelegated = false;
let atom4ActionsDelegated = false;

// --- ATOM 3: REQUIREMENT CARD (how the question is COMMUNICATED) ---
// Same rationale as Atom 1/2's own requirement cards: the old plain prompt
// sentence (via ex.promptHtml) and the static Panel 1 octet-box row
// underneath it both restated the exact same two facts — the given
// classful address and the target classless CIDR — one right after the
// other. The bit grid's own live borrow badge and octet totals already
// make the classful network portion and current boundary obvious, so
// nothing is lost by stating the given address and the CIDR to reach once,
// here, instead of twice. Unlike Atom 1's card (a single subnet/host count
// target), Atom 3's target is a CIDR to reach by clicking, so its middle
// row states that instead of a requirement count.
// --- ATOM 3: PER-SUBTASK TASK CARDS (how the question is COMMUNICATED) ---
// Atom 3 is not a single-task question like Atom 1 (borrow bits) or Atom 2
// (assemble a mask) — it chains THREE separately-gradable subtasks: set
// the subnet boundary (Atom 1's own task), assemble the matching mask
// (Atom 2's own task), then build each subnet's binary ID. Each subtask
// gets its own card immediately above the UI it governs, and — so a
// student scrolling back to any one of them never has to scroll back up
// to re-find the given network or the CIDR they're working toward — every
// card repeats the exact same three-part structure: Given network, the
// classless network to reach, and what to do for THIS step. Only the
// task-specific header (a highly visible "TASK N OF 3" badge + title) and
// the final row's icon/text change between the three calls below.
function buildAtom3TaskCardHtml(ex, taskNum, title, iconClass, actionText) {
    const ipStr = ex.octets.join('.');
    // Task 1 opens the question (no preceding grid to separate it from),
    // so it skips the extra top margin/spacing the later two cards get —
    // see .atom3-task-card-followup in styles.css.
    const cardClass = 'atom1-req-card atom3-task-card' + (taskNum > 1 ? ' atom3-task-card-followup' : '');
    return (
        '<div class="' + cardClass + '">' +
            '<div class="atom3-task-card-header">' +
                '<span class="atom3-task-badge">Task ' + taskNum + ' of 3</span>' +
                '<h3 class="atom3-task-title">' + title + '</h3>' +
            '</div>' +
            '<div class="atom3-task-card-rows">' +
                '<div class="atom1-req-row">' +
                    '<div class="atom1-req-icon atom1-req-icon-network"><i class="fa-solid fa-diagram-project" aria-hidden="true"></i></div>' +
                    '<div class="atom1-req-body">' +
                        '<div class="atom1-req-eyebrow">Given network</div>' +
                        '<div class="atom1-req-main">' +
                            '<span class="atom1-req-badge">Class ' + ex.classLabel + '</span>' +
                            '<span class="atom1-req-value">' + ipStr + '<span class="atom1-req-cidr">/' + ex.networkBits + '</span></span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="atom1-req-row">' +
                    '<div class="atom1-req-icon atom1-req-icon-requirement"><i class="fa-solid fa-bullseye" aria-hidden="true"></i></div>' +
                    '<div class="atom1-req-body">' +
                        '<div class="atom1-req-eyebrow">Reach this classless network</div>' +
                        '<div class="atom1-req-target">' +
                            '<span class="atom1-req-target-num">/' + ex.targetCidr + '</span>' +
                            '<span class="atom1-req-target-label">target CIDR</span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="atom1-req-row atom1-task-row">' +
                    '<div class="atom1-req-icon atom1-req-icon-task"><i class="fa-solid fa-' + iconClass + '" aria-hidden="true"></i></div>' +
                    '<div class="atom1-req-body">' +
                        '<div class="atom1-req-eyebrow">What to do</div>' +
                        '<div class="atom1-req-action-text">' + actionText + '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>'
    );
}

function buildAtom3PanelHtml(qid, ex, index) {
    const inputBits = atom1OctetsToBits(ex.octets);

    const task1Html = buildAtom3TaskCardHtml(
        ex,
        1,
        'Set the Subnet Boundary',
        'hand-pointer',
        'Click bits below to borrow exactly enough network bits to reach /' + ex.targetCidr + '.'
    );

    const gridHtml =
        '<div class="atom1-bitgrid-wrap" id="atom3BoundaryWrap-' + qid + '">' +
            '<div class="badge badge-borrow atom1-borrow-badge" id="atom3BorrowBadge-' + qid + '">' +
                '<span>0 bits borrowed &rarr; /' + ex.networkBits + '</span>' +
            '</div>' +
            '<div class="bit-grid atom1-bitgrid" id="atom3BitGrid-' + qid + '" data-qid="' + qid + '" data-network-bits="' + ex.networkBits + '" data-max-borrow="' + ex.maxBorrow + '" data-borrowed="0">' +
                renderAtom1BitGridInner(qid, inputBits, ex.networkBits, 0) +
            '</div>' +
            '<div class="legend secondary-copy">' +
                '<span><i class="swatch swatch-locked"></i> Locked network bit</span>' +
                '<span><i class="swatch swatch-borrowed"></i> Borrowed subnet bit</span>' +
                '<span><i class="swatch swatch-host"></i> Host bit</span>' +
            '</div>' +
        '</div>';

    // Mask assembly (reuses Atom 2's toggle-grid engine verbatim —
    // renderAtom2BitGridInner/initAtom2MaskBits — via its own DOM ids so
    // it can't collide with the real Atom 2 view's grids). Classful
    // network bits start locked to 1; everything else starts at 0 and
    // toggles independently on click, same as Atom 2. Its own task card
    // (task2Html, below) now carries the instructions this wrap used to
    // open with via .atom3-mask-hint, so that paragraph is dropped here.
    const maskInitBits = initAtom2MaskBits(ex.networkBits).split('').map(Number);
    const task2Html = buildAtom3TaskCardHtml(
        ex,
        2,
        'Assemble the Subnet Mask',
        'sliders',
        'Now assemble the subnet mask that matches the boundary you set above — click a bit to toggle it on/off. Classful network bits are locked to 1.'
    );
    const maskGridHtml =
        '<div class="atom1-bitgrid-wrap atom3-mask-wrap" id="atom3MaskWrap-' + qid + '">' +
            '<div class="bit-grid atom1-bitgrid" id="atom3MaskGrid-' + qid + '" data-qid="' + qid + '" data-network-bits="' + ex.networkBits + '" data-maskbits="' + initAtom2MaskBits(ex.networkBits) + '">' +
                renderAtom2BitGridInner(qid, maskInitBits, ex.networkBits) +
            '</div>' +
            '<div class="legend secondary-copy">' +
                '<span><i class="swatch swatch-locked"></i> Locked network bit</span>' +
                '<span><i class="swatch swatch-borrowed"></i> Mask bit ON (1)</span>' +
                '<span><i class="swatch swatch-host"></i> Mask bit OFF (0)</span>' +
            '</div>' +
        '</div>';

    // Task 3's card carries the exact phrase "Build each subnet's binary ID
    // below" verbatim — Atom 4 (see buildAtom4PanelHtml) string-replaces
    // that same phrase in its own copy of this panel to append its own
    // Network/Broadcast instructions, so the wording here must stay intact
    // for that hook to keep matching.
    const task3Html = buildAtom3TaskCardHtml(
        ex,
        3,
        'Build Each Subnet ID',
        'list-ol',
        'Build each subnet\'s binary ID below — its full network address updates live, and the subnet list itself updates as you move the boundary above.'
    );
    const liveListHtml =
        '<div class="atom3-live-wrap">' +
            '<div id="atom3SubnetList-' + qid + '">' + buildAtom3SubnetListHtml(qid, 0, ex) + '</div>' +
        '</div>';

    return (
        '<section class="panel atom1-q-panel" id="atom3QPanel-' + qid + '" data-qid="' + qid + '">' +
            '<div class="panel-head">' +
                '<span class="panel-index">Q' + index + '</span>' +
                '<h2>Subnet ID Mapping</h2>' +
                '<span class="badge atom1-score-badge" id="atom3ScoreBadge-' + qid + '">0/' + ex.answers.length + '</span>' +
            '</div>' +
            task1Html +
            gridHtml +
            task2Html +
            maskGridHtml +
            task3Html +
            liveListHtml +
            '<div class="atom1-actions">' +
                '<button class="primary-btn atom3-verify-btn" data-qid="' + qid + '">Verify Answer</button>' +
                '<div class="atom1-feedback" id="atom3Feedback-' + qid + '" role="status" aria-live="polite"></div>' +
            '</div>' +
        '</section>'
    );
}

// Builds the full Atom 3 page from scratch (called once per login) and
// wires up each question's bit-row interaction plus a single delegated
// click listener for every Verify/Reset button on the page — same
// structure as renderAtom1View/renderAtom2View.
function renderAtom3View(atom3List) {
    const container = document.getElementById('atom3QuestionsContainer');
    if (!container) return;

    container.innerHTML = atom3List
        .map((item, i) => buildAtom3PanelHtml(item.name, exerciseData[item.name], i + 1))
        .join('');

    atom3List.forEach(item => {
        attachAtom3Handlers(item.name, exerciseData[item.name]);
        attachAtom3MaskHandlers(item.name, exerciseData[item.name]);
    });

    if (!atom3ActionsDelegated) {
        atom3ActionsDelegated = true;
        container.addEventListener('click', (e) => {
            const btn = e.target.closest('.atom3-verify-btn');
            if (!btn) return;
            const qid = btn.dataset.qid;
            const ex = exerciseData[qid];
            if (!ex) return;
            if (ex.locked) {
                resetAtom3Question(qid);
            } else {
                verifyAtom3Question(qid);
            }
        });
    }

    attachAtomPaginationHandlers();
    initAtomPagination('atom3');
}

// Sets the Verify/Reset/Locked button label + disabled state for one
// question — same rules as setAtom1ButtonState/setAtom2ButtonState.
function setAtom3ButtonState(qid) {
    const ex = exerciseData[qid];
    const btn = document.querySelector('.atom3-verify-btn[data-qid="' + qid + '"]');
    if (!btn || !ex) return;
    if (ex.locked) {
        if (isRetryAllowed()) {
            btn.textContent = 'Reset';
            btn.disabled = false;
        } else {
            btn.textContent = 'Locked';
            btn.disabled = true;
        }
    } else {
        btn.textContent = 'Verify Answer';
        btn.disabled = false;
    }
}

// Renders this question's per-question feedback. Reuses
// buildFeedbackForExercise/renderFeedback exactly as Atom 1/2 do — with
// answers.length === 1, its all-or-nothing "Not quite" branch already
// produces the right wording with no changes needed there.
function updateAtom3QuestionFeedback(qid, ex) {
    const el = document.getElementById('atom3Feedback-' + qid);
    if (!el) return;
    if (!ex || !ex.locked) {
        el.textContent = '';
        el.className = 'atom1-feedback';
        return;
    }
    const feedback = buildFeedbackForExercise(ex);
    renderFeedback(el, feedback);
    el.className = 'atom1-feedback ' + feedback.cls;
}

// Updates one question's score badge (max always 1/1 for Atom 3) — same
// coloring convention as updateAtom1ScoreBadge/updateAtom2ScoreBadge.
function updateAtom3ScoreBadge(qid, ex) {
    const badge = document.getElementById('atom3ScoreBadge-' + qid);
    if (!badge || !ex) return;
    badge.textContent = (ex.score || 0) + '/' + ex.answers.length;
    badge.classList.remove('completed-score', 'partial-score');
    if (ex.locked) {
        if (ex.score === ex.answers.length) badge.classList.add('completed-score');
        else if (ex.score > 0) badge.classList.add('partial-score');
    }
}

// Applies correct/incorrect styling to each individually-gradable piece of
// an Atom 3 question — the boundary grid, the mask grid, and each subnet
// row — using the exact same breakdown gradeAtom3Answer uses to compute
// the score, so the visual feedback can never drift from the numeric one.
// Called from applyAtom3LockedUI, which covers both the normal verify path
// and exam-session restore (via syncAtom3ViewDOM -> applyAtom3LockedUI).
function applyAtom3ItemFeedback(qid, ex) {
    const { boundaryCorrect, maskCorrect, rowCorrectArr } = gradeAtom3Answer(ex, ex.userAnswer);

    const boundaryWrap = document.getElementById('atom3BoundaryWrap-' + qid);
    if (boundaryWrap) {
        boundaryWrap.classList.remove('atom3-item-correct', 'atom3-item-incorrect');
        boundaryWrap.classList.add(boundaryCorrect ? 'atom3-item-correct' : 'atom3-item-incorrect');
    }

    const maskWrap = document.getElementById('atom3MaskWrap-' + qid);
    if (maskWrap) {
        maskWrap.classList.remove('atom3-item-correct', 'atom3-item-incorrect');
        maskWrap.classList.add(maskCorrect ? 'atom3-item-correct' : 'atom3-item-incorrect');
    }

    document.querySelectorAll('.subnet-row[data-qid="' + qid + '"]').forEach(row => {
        const pos = parseInt(row.dataset.row, 10);
        const isCorrect = !!rowCorrectArr[pos];
        row.classList.remove('atom3-item-correct', 'atom3-item-incorrect');
        row.classList.add(isCorrect ? 'atom3-item-correct' : 'atom3-item-incorrect');
    });
}

// Applies every visual consequence of this question being locked — same
// shape as applyAtom1LockedUI/applyAtom2LockedUI: the panel's
// correct/incorrect edge color, the bit grid's AND every subnet row's
// click-lock, per-item correct/incorrect feedback, the feedback message,
// the score badge, and the action button label.
function applyAtom3LockedUI(qid, ex) {
    const panel = document.getElementById('atom3QPanel-' + qid);
    const grid = document.getElementById('atom3BitGrid-' + qid);
    const maskGrid = document.getElementById('atom3MaskGrid-' + qid);
    const isCorrect = (ex.score || 0) === ex.answers.length;

    if (panel) {
        panel.classList.remove('correct', 'incorrect');
        panel.classList.add(isCorrect ? 'correct' : 'incorrect');
    }
    if (grid) grid.classList.add('atom1-locked');
    if (maskGrid) maskGrid.classList.add('atom1-locked');
    document.querySelectorAll('.atom3-bit-row[data-qid="' + qid + '"]').forEach(row => {
        row.classList.add('atom3-locked');
    });

    applyAtom3ItemFeedback(qid, ex);

    updateAtom3QuestionFeedback(qid, ex);
    updateAtom3ScoreBadge(qid, ex);
    setAtom3ButtonState(qid);
}

// Grades and locks one Atom 3 question — per answerable item (boundary,
// mask, each subnet row), not all-or-nothing (see gradeAtom3Answer).
function verifyAtom3Question(qid) {
    const ex = exerciseData[qid];
    if (!ex || ex.locked) return;

    const userAnswer = collectAtom3Answer(qid);
    ex.userAnswer = userAnswer;

    const { score, allCorrect } = gradeAtom3Answer(ex, userAnswer);
    ex.score = score;
    ex.isPartial = score > 0 && !allCorrect;
    ex.locked = true;

    applyAtom3LockedUI(qid, ex);
    updateAtom3NavScore();
    updateSummaryPanel();

    if (allCorrect) triggerConfetti();

    saveSessionProgress();
    if (appSettings.mode === 'exam') {
        if (checkIfAllAnswered()) {
            stopTimer();
            setTimeout(() => {
                showScoreSummaryModal('Congratulations! All exercises completed before time ran out!', 'success');
            }, 500);
        }
    }
}

// Resets one Atom 3 question — practice mode only, mirroring
// resetAtom1Question's/resetAtom2Question's exam-mode guard. Resetting the
// grid to 0 borrowed bits also rebuilds the subnet row list from scratch
// (see updateAtom3Grid), so nothing further needs clearing here.
function resetAtom3Question(qid) {
    if (!isRetryAllowed()) {
        showAlertModal('Reset Not Allowed', sessionTimedOut ? 'Reset is not allowed after time expires.' : 'Reset is not allowed in Exam Mode.');
        return;
    }
    const ex = exerciseData[qid];
    if (!ex) return;

    ex.userAnswer = '';
    ex.score = 0;
    ex.isPartial = false;
    ex.locked = false;

    updateAtom3Grid(qid, ex, 0);
    updateAtom3MaskGrid(qid, ex, initAtom2MaskBits(ex.networkBits));

    const panel = document.getElementById('atom3QPanel-' + qid);
    if (panel) panel.classList.remove('correct', 'incorrect');
    const grid = document.getElementById('atom3BitGrid-' + qid);
    if (grid) grid.classList.remove('atom1-locked');
    const maskGrid = document.getElementById('atom3MaskGrid-' + qid);
    if (maskGrid) maskGrid.classList.remove('atom1-locked');

    // Rows/mask-grid contents are already fresh (rebuilt above via
    // updateAtom3Grid/updateAtom3MaskGrid), but the outer wrapper elements
    // persist across resets and carry their own item-feedback classes —
    // those need clearing explicitly so a fresh attempt doesn't start out
    // still colored from the previous one.
    const boundaryWrap = document.getElementById('atom3BoundaryWrap-' + qid);
    if (boundaryWrap) boundaryWrap.classList.remove('atom3-item-correct', 'atom3-item-incorrect');
    const maskWrap = document.getElementById('atom3MaskWrap-' + qid);
    if (maskWrap) maskWrap.classList.remove('atom3-item-correct', 'atom3-item-incorrect');

    updateAtom3QuestionFeedback(qid, null);
    updateAtom3ScoreBadge(qid, ex);
    setAtom3ButtonState(qid);
    updateAtom3NavScore();
    updateSummaryPanel();
    saveSessionProgress();
}

// Aggregates every atom3-q* exercise into a single X/N readout on the
// sidebar's "Atom 3" nav entry, same as updateAtom1NavScore/updateAtom2NavScore.
function updateAtom3NavScore() {
    const scoreEl = document.getElementById('score-atom3');
    if (!scoreEl) return;
    let got = 0;
    let total = 0;
    for (const file in exerciseData) {
        if (file.indexOf('atom3-q') === 0) {
            const ex = exerciseData[file];
            got += Number(ex.score || 0);
            total += ex.answers.length;
        }
    }
    scoreEl.textContent = got + '/' + total;
    scoreEl.classList.remove('completed-score', 'partial-score');
    if (total > 0 && got === total) {
        scoreEl.classList.add('completed-score');
    } else if (got > 0) {
        scoreEl.classList.add('partial-score');
    }
}

// Re-applies every Atom 3 question's current exerciseData state — the
// grid's boundary, each subnet row's clicked-in bits, locked styling,
// feedback, badge — onto the already-rendered DOM. Called once per login,
// after exam-session restore, same rationale as syncAtom1ViewDOM/
// syncAtom2ViewDOM. The grid rebuild (updateAtom3Grid) always regenerates
// a fresh, zeroed row list for the restored boundary first; any saved
// per-row bits are then layered back on top, position by position — only
// applied when they still match that boundary's row width, since a saved
// answer from a different boundary no longer corresponds to anything on
// screen.
function syncAtom3ViewDOM() {
    for (const file in exerciseData) {
        if (file.indexOf('atom3-q') !== 0) continue;
        const ex = exerciseData[file];
        if (!ex) continue;

        const parts = (typeof ex.userAnswer === 'string' && ex.userAnswer.length) ? ex.userAnswer.split('::') : [];
        const borrowed = parseInt(parts[0], 10);
        const safeBorrowed = isNaN(borrowed) ? 0 : Math.max(0, Math.min(borrowed, ex.maxBorrow));
        updateAtom3Grid(file, ex, safeBorrowed);

        const savedMaskStr = parts.length > 1 ? parts[1] : '';
        updateAtom3MaskGrid(file, ex, (savedMaskStr && savedMaskStr.length === 32) ? savedMaskStr : initAtom2MaskBits(ex.networkBits));

        const savedRowsStr = parts.length > 2 ? parts[2] : '';
        if (savedRowsStr) {
            savedRowsStr.split(',').forEach((bitsStr, pos) => {
                if (bitsStr && bitsStr.length === safeBorrowed) {
                    updateAtom3Row(file, pos, bitsStr.split('').map(Number));
                }
            });
        }

        if (ex.locked) {
            applyAtom3LockedUI(file, ex);
        } else {
            setAtom3ButtonState(file);
        }
    }
    updateAtom3NavScore();
}

function atom4DefaultBits(ex) {
    return '?'.repeat(ex.hostBits);
}

function atom4BitsFromAnswer(value, ex) {
    return typeof value === 'string' && value.length === ex.hostBits && /^[?01]+$/.test(value)
        ? value
        : atom4DefaultBits(ex);
}

function atom4PrefixBits(ex, subnetBits) {
    return atom1OctetsToBits(ex.octets).slice(0, ex.networkBits).join('') + (subnetBits || '');
}

function buildAtom4BoundaryHtml(qid, ex, boundary, hostBits, subnetBits, rowPos) {
    const prefix = atom4PrefixBits(ex, subnetBits);
    const hostCount = Math.max(0, 32 - prefix.length);
    const normalizedHostBits = atom4BitsFromAnswer(hostBits, { hostBits: hostCount });
    let addressHtml = '<div class="addr-row">';
    for (let octet = 0; octet < 4; octet++) {
        const start = octet * 8;
        let bitsHtml = '';
        let weightsHtml = '';
        const octetValues = [];
        for (let bit = 0; bit < 8; bit++) {
            const globalIndex = start + bit;
            const fixed = globalIndex < prefix.length;
            const kind = fixed
                ? (globalIndex < ex.networkBits ? 'locked' : 'borrowed')
                : 'host';
            const value = fixed ? prefix[globalIndex] : normalizedHostBits[globalIndex - prefix.length];
            octetValues.push(value);
            weightsHtml += '<span class="addr-weight ' + (value === '1' ? 'lit-' + kind : '') + '">' + OCTET_BIT_PLACE_VALUES[bit] + '</span>';
            bitsHtml += '<div class="addr-bit ' + kind + (fixed ? '' : ' atom4-host-bit') + '"' +
                (fixed ? ' aria-hidden="true"' : ' role="button" tabindex="0" data-qid="' + qid + '" data-boundary="' + boundary + '" data-row="' + (rowPos === undefined ? '' : rowPos) + '" data-index="' + (globalIndex - prefix.length) + '" aria-label="' + boundary + ' host bit ' + (globalIndex - prefix.length + 1) + ', currently ' + value + '"') + '>' + value + '</div>';
        }
        const octetTotal = octetValues.includes('?')
            ? '?'
            : atom1BitsToOctet(octetValues.map(Number));
        addressHtml += '<div class="addr-octet">' +
            '<div class="addr-total-box">' + octetTotal + (octet < 3 ? '<span class="addr-total-dot">.</span>' : '') + '</div>' +
            '<div class="addr-weight-row">' + weightsHtml + '</div>' +
            '<div class="addr-bits">' + bitsHtml + '</div>' +
            '<div class="addr-octet-label">Octet ' + (octet + 1) + '</div>' +
        '</div>';
    }
    addressHtml += '</div>';
    return '<div class="atom4-boundary-row" data-qid="' + qid + '" data-boundary="' + boundary + '" data-row="' + (rowPos === undefined ? '' : rowPos) + '">' +
        '<div class="atom4-boundary-label"><strong>' + (boundary === 'network' ? 'Network ID' : 'Broadcast Address') + '</strong><span>' + (boundary === 'network' ? 'Host bits = 0' : 'Host bits = 1') + '</span></div>' +
        addressHtml +
    '</div>';
}

function collectAtom4Answer(qid) {
    const atom3Answer = collectAtom3Answer(qid);
    const rowPositions = Array.from(document.querySelectorAll('.atom4-boundary-row[data-qid="' + qid + '"]'))
        .map(row => parseInt(row.dataset.row, 10))
        .filter((row, index, rows) => !isNaN(row) && rows.indexOf(row) === index)
        .sort((a, b) => a - b);
    const getBits = (boundary, rowPos) => Array.from(document.querySelectorAll('.atom4-host-bit[data-qid="' + qid + '"][data-boundary="' + boundary + '"][data-row="' + rowPos + '"]'))
        .sort((a, b) => parseInt(a.dataset.index, 10) - parseInt(b.dataset.index, 10))
        .map(cell => cell.textContent).join('');
    return atom3Answer + '::' + rowPositions.map(row => getBits('network', row)).join(',') + '::' + rowPositions.map(row => getBits('broadcast', row)).join(',');
}

function gradeAtom4Answer(ex, answer) {
    const parts = (answer || '').split('::');
    const atom3Result = gradeAtom3Answer(ex, parts.slice(0, 3).join('::'));
    const networkRows = (parts[3] || '').split(',');
    const broadcastRows = (parts[4] || '').split(',');
    const expectedLength = ex.hostBits;
    const targetRows = atom3SubnetIndicesForBorrowed(ex.correctBits).length;
    // Boundary addresses are meaningful only for the correct subnet rows.
    // Reuse Atom 3's dependency model: a wrong borrowed boundary means the
    // displayed rows are not comparable, and a wrong subnet ID means its
    // Network/Broadcast address is not the target address for that row.
    const networkCorrectArr = new Array(targetRows).fill(false);
    const broadcastCorrectArr = new Array(targetRows).fill(false);
    for (let i = 0; i < targetRows; i++) {
        const rowEligible = atom3Result.boundaryCorrect && atom3Result.rowCorrectArr[i];
        networkCorrectArr[i] = rowEligible && networkRows[i]?.length === expectedLength && networkRows[i] === '0'.repeat(expectedLength);
        broadcastCorrectArr[i] = rowEligible && broadcastRows[i]?.length === expectedLength && broadcastRows[i] === '1'.repeat(expectedLength);
    }
    const networkCorrect = networkCorrectArr.length === targetRows && networkCorrectArr.every(Boolean);
    const broadcastCorrect = broadcastCorrectArr.length === targetRows && broadcastCorrectArr.every(Boolean);
    const networkScore = networkCorrectArr.filter(Boolean).length;
    const broadcastScore = broadcastCorrectArr.filter(Boolean).length;
    const score = atom3Result.score + networkScore + broadcastScore;
    return { score, allCorrect: score === ex.answers.length, atom3Result, networkCorrect, broadcastCorrect, networkCorrectArr, broadcastCorrectArr };
}

function buildAtom4PanelHtml(qid, ex, index) {
    const atom3Panel = buildAtom3PanelHtml(qid, ex, index)
        .replace('Subnet ID Mapping', 'Subnet ID Mapping & Boundaries')
        .replace('atom3-verify-btn', 'atom4-verify-btn');
    return atom3Panel.replace('Build each subnet\'s binary ID below', 'Build each subnet\'s binary ID below, then assemble its Network and Broadcast addresses');
}

function renderAtom4View(atom4List) {
    const container = document.getElementById('atom4QuestionsContainer');
    if (!container) return;
    container.innerHTML = atom4List.map((item, i) => buildAtom4PanelHtml(item.name, exerciseData[item.name], i + 1)).join('');
    atom4List.forEach(item => {
        attachAtom3Handlers(item.name, exerciseData[item.name]);
        attachAtom3MaskHandlers(item.name, exerciseData[item.name]);
    });
    if (!atom4ActionsDelegated) {
        atom4ActionsDelegated = true;
        container.addEventListener('click', event => {
            const cell = event.target.closest('.atom4-host-bit');
            if (cell) {
                cycleAtom4Bit(cell.dataset.qid, cell.dataset.boundary, parseInt(cell.dataset.row, 10), parseInt(cell.dataset.index, 10));
                return;
            }
            const button = event.target.closest('.atom4-verify-btn');
            if (!button) return;
            const qid = button.dataset.qid;
            if (exerciseData[qid]?.locked) resetAtom4Question(qid);
            else verifyAtom4Question(qid);
        });
        container.addEventListener('keydown', event => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            const cell = event.target.closest('.atom4-host-bit');
            if (!cell) return;
            event.preventDefault();
            cycleAtom4Bit(cell.dataset.qid, cell.dataset.boundary, parseInt(cell.dataset.row, 10), parseInt(cell.dataset.index, 10));
        });
    }

    attachAtomPaginationHandlers();
    initAtomPagination('atom4');
}

function refreshAtom4Boundary(qid, boundary, rowPos) {
    const ex = exerciseData[qid];
    if (!ex) return;
    const hostBits = Array.from(document.querySelectorAll('.atom4-host-bit[data-qid="' + qid + '"][data-boundary="' + boundary + '"][data-row="' + rowPos + '"]'))
        .sort((a, b) => parseInt(a.dataset.index, 10) - parseInt(b.dataset.index, 10))
        .map(cell => cell.textContent).join('');
    const subnetRow = document.getElementById('atom3Row-' + qid + '-' + rowPos);
    const subnetBits = subnetRow ? (subnetRow.dataset.bits || '') : '';
    const boundaryRow = document.querySelector('.atom4-boundary-row[data-qid="' + qid + '"][data-boundary="' + boundary + '"][data-row="' + rowPos + '"]');
    if (boundaryRow) boundaryRow.outerHTML = buildAtom4BoundaryHtml(qid, ex, boundary, hostBits || atom4DefaultBits(ex), subnetBits, rowPos);
}

function cycleAtom4Bit(qid, boundary, rowPos, index) {
    const ex = exerciseData[qid];
    if (!ex || ex.locked) return;
    const cells = Array.from(document.querySelectorAll('.atom4-host-bit[data-qid="' + qid + '"][data-boundary="' + boundary + '"][data-row="' + rowPos + '"]'))
        .sort((a, b) => parseInt(a.dataset.index, 10) - parseInt(b.dataset.index, 10));
    const cell = cells[index];
    if (!cell) return;
    cell.textContent = cell.textContent === '?' ? '0' : (cell.textContent === '0' ? '1' : '?');
    cell.setAttribute('aria-label', boundary + ' host bit ' + (index + 1) + ', currently ' + cell.textContent);
    refreshAtom4Boundary(qid, boundary, rowPos);
    saveAtom4Progress(qid);
}

function saveAtom4Progress(qid) {
    const ex = exerciseData[qid];
    if (!ex || ex.locked) return;
    ex.userAnswer = collectAtom4Answer(qid);
    saveSessionProgress();
}

function updateAtom4ButtonState(qid) {
    const ex = exerciseData[qid];
    const button = document.querySelector('.atom4-verify-btn[data-qid="' + qid + '"]');
    if (!button || !ex) return;
    button.textContent = ex.locked ? (isRetryAllowed() ? 'Reset' : 'Locked') : 'Verify Answer';
    button.disabled = ex.locked && !isRetryAllowed();
}

function applyAtom4LockedUI(qid, ex) {
    const result = gradeAtom4Answer(ex, ex.userAnswer);
    applyAtom3LockedUI(qid, ex);
    ['network', 'broadcast'].forEach(boundary => {
        const correctRows = boundary === 'network' ? result.networkCorrectArr : result.broadcastCorrectArr;
        document.querySelectorAll('.atom4-boundary-row[data-qid="' + qid + '"][data-boundary="' + boundary + '"]').forEach(row => {
            const rowPos = parseInt(row.dataset.row, 10);
            row.classList.remove('atom4-correct', 'atom4-incorrect', 'atom3-item-correct', 'atom3-item-incorrect');
            row.classList.add(correctRows[rowPos] ? 'atom4-correct' : 'atom4-incorrect');
            row.classList.add(correctRows[rowPos] ? 'atom3-item-correct' : 'atom3-item-incorrect');
        });
        document.querySelectorAll('.atom4-host-bit[data-qid="' + qid + '"][data-boundary="' + boundary + '"]').forEach(cell => cell.classList.add('atom4-locked'));
    });
    const feedback = document.getElementById('atom3Feedback-' + qid);
    if (feedback && !result.allCorrect) {
        const targetRows = result.networkCorrectArr.length;
        const networkScore = result.networkCorrectArr.filter(Boolean).length;
        const broadcastScore = result.broadcastCorrectArr.filter(Boolean).length;
        feedback.textContent = result.score + '/' + ex.answers.length + ' items correct. Network: ' + networkScore + '/' + targetRows + '; Broadcast: ' + broadcastScore + '/' + targetRows + '.';
        feedback.className = 'atom1-feedback ' + (result.score ? 'warning show' : 'error show');
    }
    updateAtom4ButtonState(qid);
}

function verifyAtom4Question(qid) {
    const ex = exerciseData[qid];
    if (!ex || ex.locked) return;
    ex.userAnswer = collectAtom4Answer(qid);
    const result = gradeAtom4Answer(ex, ex.userAnswer);
    ex.score = result.score;
    ex.isPartial = result.score > 0 && !result.allCorrect;
    ex.locked = true;
    applyAtom4LockedUI(qid, ex);
    updateAtom4NavScore();
    updateSummaryPanel();
    if (result.allCorrect) triggerConfetti();
    saveSessionProgress();
}

function resetAtom4Question(qid) {
    if (!isRetryAllowed()) {
        showAlertModal('Reset Not Allowed', sessionTimedOut ? 'Reset is not allowed after time expires.' : 'Reset is not allowed in Exam Mode.');
        return;
    }
    const ex = exerciseData[qid];
    if (!ex) return;
    resetAtom3Question(qid);
    ex.userAnswer = '';
    ex.score = 0;
    ex.isPartial = false;
    ex.locked = false;
    const panel = document.getElementById('atom3QPanel-' + qid);
    if (panel) panel.classList.remove('correct', 'incorrect');
    updateAtom4ButtonState(qid);
    const feedback = document.getElementById('atom3Feedback-' + qid);
    if (feedback) { feedback.textContent = ''; feedback.className = 'atom1-feedback'; }
    document.querySelectorAll('.atom4-boundary-row[data-qid="' + qid + '"]').forEach(row => {
        row.classList.remove('atom4-correct', 'atom4-incorrect', 'atom3-item-correct', 'atom3-item-incorrect');
    });
    const badge = document.getElementById('atom3ScoreBadge-' + qid);
    if (badge) badge.textContent = '0/' + ex.answers.length;
    updateAtom4NavScore();
    updateSummaryPanel();
    saveSessionProgress();
}

function updateAtom4NavScore() {
    const scoreEl = document.getElementById('score-atom4');
    if (!scoreEl) return;
    let score = 0;
    let total = 0;
    for (const qid in exerciseData) {
        if (!qid.startsWith('atom4-q')) continue;
        score += Number(exerciseData[qid].score || 0);
        total += exerciseData[qid].answers.length;
    }
    scoreEl.textContent = score + '/' + total;
    scoreEl.classList.remove('completed-score', 'partial-score');
    if (total && score === total) scoreEl.classList.add('completed-score');
    else if (score) scoreEl.classList.add('partial-score');
}

function syncAtom4ViewDOM() {
    for (const qid in exerciseData) {
        if (!qid.startsWith('atom4-q')) continue;
        const ex = exerciseData[qid];
        const parts = typeof ex.userAnswer === 'string' ? ex.userAnswer.split('::') : [];
        const borrowed = parseInt(parts[0], 10);
        const safeBorrowed = isNaN(borrowed) ? 0 : Math.max(0, Math.min(borrowed, ex.maxBorrow));
        updateAtom3Grid(qid, ex, safeBorrowed);
        const savedMask = parts[1];
        updateAtom3MaskGrid(qid, ex, savedMask && savedMask.length === 32 ? savedMask : initAtom2MaskBits(ex.networkBits));
        const savedRows = parts[2] || '';
        if (savedRows) {
            savedRows.split(',').forEach((bits, position) => {
                if (bits && bits.length === safeBorrowed) updateAtom3Row(qid, position, bits.split('').map(Number));
            });
        }
        const networkRows = (parts[3] || '').split(',');
        const broadcastRows = (parts[4] || '').split(',');
        document.querySelectorAll('.atom4-boundary-row[data-qid="' + qid + '"]').forEach(row => {
            const rowPos = parseInt(row.dataset.row, 10);
            const subnetRow = document.getElementById('atom3Row-' + qid + '-' + rowPos);
            const subnetBits = subnetRow ? (subnetRow.dataset.bits || '') : '';
            const boundaries = document.getElementById('atom4RowBoundaries-' + qid + '-' + rowPos);
            if (boundaries) {
                boundaries.innerHTML = buildAtom4BoundaryHtml(qid, ex, 'network', atom4BitsFromAnswer(networkRows[rowPos], ex), subnetBits, rowPos) +
                    buildAtom4BoundaryHtml(qid, ex, 'broadcast', atom4BitsFromAnswer(broadcastRows[rowPos], ex), subnetBits, rowPos);
            }
        });
        if (ex.locked) applyAtom4LockedUI(qid, ex);
        else updateAtom4ButtonState(qid);
    }
    updateAtom4NavScore();
}

function showAtom4Page() {
    document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
    document.getElementById('nav-atom4')?.classList.add('active');
    ['exerciseArea', 'subnetVisualizerView', 'atomPlaceholderView', 'atom1View', 'atom2View', 'atom3View', 'atom5View', 'atom6View', 'atom7View', 'atom8View', 'atom9View'].forEach(id => {
        const view = document.getElementById(id);
        if (view) view.style.display = 'none';
    });
    document.getElementById('atom4View').style.display = 'flex';
    document.getElementById('timerContainer').style.display = timerIntervalId ? 'flex' : 'none';
    showAtomPaginationBar('atom4');
    currentFile = '';
    closeSampleOutputModal();
    updateConsoleDrawerTab(false);
    closeSidebarIfMobile();
}

// --- Sidebar navigation into the Atom 3 view (Tools → Atoms → Atom 3) ---
// Mirrors showAtom1Page/showAtom2Page exactly.
function showAtom3Page() {
    document.querySelectorAll('.sidebar li').forEach(l => l.classList.remove('active'));
    const navItem = document.getElementById('nav-atom3');
    if (navItem) navItem.classList.add('active');

    document.getElementById('exerciseArea').style.display = 'none';
    document.getElementById('subnetVisualizerView').style.display = 'none';
    document.getElementById('atomPlaceholderView').style.display = 'none';
    document.getElementById('atom1View').style.display = 'none';
    document.getElementById('atom2View').style.display = 'none';
    document.getElementById('atom4View').style.display = 'none';
    document.getElementById('atom5View').style.display = 'none';
    document.getElementById('atom6View').style.display = 'none';
    document.getElementById('atom7View').style.display = 'none';
    document.getElementById('atom8View').style.display = 'none';
    document.getElementById('atom9View').style.display = 'none';
    document.getElementById('atom3View').style.display = 'flex';
    document.getElementById('timerContainer').style.display = timerIntervalId ? 'flex' : 'none';

    showAtomPaginationBar('atom3');

    currentFile = ''; // no single graded exercise is "current" on this page

    closeSampleOutputModal();
    updateConsoleDrawerTab(false);

    closeSidebarIfMobile();
}

/* =========================================================
   ATOM 5: APPLIED SCENARIOS (COMBINES ATOMS 1-4)
   Unlike Atoms 1-4, Atom 5 isn't about clicking bits to build/assemble an
   answer — it presents a narrative subnetting word-problem (in the style
   of the other Atoms' own scenarios) and asks the student to type in the
   resulting value: a subnet/host count, a required borrow-bit count, a
   subnet mask, a network/broadcast address, or which subnet a host
   belongs to. Every question is graded as a single exact-match text
   answer (same grading shape as Phase 7's class_cidr question), so this
   section needs no bit-grid rendering/interaction code at all — only
   question generation plus a simple text-input dedicated view, following
   the same per-question Verify/Reset + own paginated page pattern as
   Atoms 1-4 (see ATOM_PAGINATION/showAtomQuestion, defined above).
========================================================= */

// Builds a classful base network address (host portion zeroed) for a
// given CLASSFUL_CIDR_RANGES entry — identical convention to Atom 1/3's
// own octet generation.
function atom5RandomClassfulAddress(rng, range) {
    const editableCount = range.cidr / 8;
    const octets = [0, 0, 0, 0];
    octets[0] = randInt(rng, range.min, range.max);
    for (let o = 1; o < editableCount; o++) octets[o] = randInt(rng, 0, 255);
    return octets;
}

// Composes the network address AND broadcast address of one subnet, given
// the classful base address, the classful network-bit count, the number
// of borrowed bits, and a subnet index within that borrowed-bit range.
function atom5SubnetAddresses(baseOctets, networkBits, borrowedBits, subnetIndex) {
    const prefixBits = atom1OctetsToBits(baseOctets).slice(0, networkBits);
    const subnetBits = borrowedBits > 0
        ? subnetIndex.toString(2).padStart(borrowedBits, '0').split('').map(Number)
        : [];
    const hostBitsCount = 32 - networkBits - borrowedBits;
    const networkBitsFull = prefixBits.concat(subnetBits).concat(new Array(hostBitsCount).fill(0));
    const broadcastBitsFull = prefixBits.concat(subnetBits).concat(new Array(hostBitsCount).fill(1));
    const toOctets = bitsArr => [0, 1, 2, 3].map(g => atom1BitsToOctet(bitsArr.slice(g * 8, g * 8 + 8))).join('.');
    return { network: toOctets(networkBitsFull), broadcast: toOctets(broadcastBitsFull) };
}

function atom5PickBorrowedBits(rng, networkBits, cap) {
    const maxBorrow = Math.max(0, 30 - networkBits);
    return randInt(rng, 1, Math.max(1, Math.min(maxBorrow, cap || 8)));
}

// Single entry point every genAtom5* generator below uses in place of the
// old bare `pickRandom(rng, CLASSFUL_CIDR_RANGES)` — takes the subtype's
// own config object (may be undefined, e.g. when called without one) so
// class restriction is applied uniformly without each generator needing
// its own filtering logic. Uses the same filterClassRangesByAllowed helper
// Atoms 1-4 now use (defined earlier, next to CLASSFUL_CIDR_RANGES) so all
// five Atoms share one implementation of "restrict to these classes."
function pickAtom5ClassRange(rng, subCfg) {
    return pickRandom(rng, filterClassRangesByAllowed(subCfg && subCfg.allowedClasses));
}

// --- Individual scenario generators — each returns
// { subType, promptHtml, correct, given }, drawing fresh random values
// from the shared rng stream every call. ---

// "Given the following network (CIDR), how many supported subnets/usable
// hosts does it have?" — the two flavors (subnets vs. hosts) are now
// separately controllable subtypes (see QUESTION_CONFIG.atom5.subTypes),
// so this shared core takes `askHosts` explicitly instead of coin-flipping
// it internally; genAtom5SupportedSubnets/genAtom5SupportedHosts below are
// the two subtype-specific entry points actually referenced by
// ATOM5_SUBTYPE_GENERATORS.
function genAtom5SupportedCountCore(rng, askHosts, subCfg) {
    const range = pickAtom5ClassRange(rng, subCfg);
    const baseOctets = atom5RandomClassfulAddress(rng, range);
    const networkBits = range.cidr;
    const borrowedBits = atom5PickBorrowedBits(rng, networkBits, 8);
    const targetCidr = networkBits + borrowedBits;
    const hostBits = 32 - targetCidr;
    const ipStr = baseOctets.join('.');
    const subType = askHosts ? 'supported_hosts' : 'supported_subnets';
    const correct = askHosts
        ? String(Math.max(0, Math.pow(2, hostBits) - 2))
        : String(Math.pow(2, borrowedBits));
    // Deliberately states only the final classless network (address +
    // target CIDR) — the class and borrowed-bit count are both derivable
    // from that alone, so restating them would just hand the student the
    // math they're meant to work out themselves.
    return {
        subType,
        givenLabel: 'Given network',
        givenValue: ipStr + '/' + targetCidr,
        taskText: askHosts
            ? 'How many <b>usable hosts</b> does each subnet support?'
            : 'How many <b>subnets</b> does this network support?',
        correct,
        given: ipStr
    };
}
function genAtom5SupportedSubnets(rng, subCfg) { return genAtom5SupportedCountCore(rng, false, subCfg); }
function genAtom5SupportedHosts(rng, subCfg) { return genAtom5SupportedCountCore(rng, true, subCfg); }

// "How many bits must be borrowed to produce this required subnet/host
// count?" — Atom 1's own scenario, asked here as plain text entry.
function genAtom5BitsRequired(rng, subCfg) {
    const range = pickAtom5ClassRange(rng, subCfg);
    const baseOctets = atom5RandomClassfulAddress(rng, range);
    const networkBits = range.cidr;
    const totalHostBits = 32 - networkBits;
    const maxBorrow = Math.max(0, 30 - networkBits);
    const requirementType = rng() < 0.5 ? 'subnets' : 'hosts';
    const ipStr = baseOctets.join('.');
    let correctBits, requiredCount;

    if (requirementType === 'subnets') {
        const nCap = Math.min(maxBorrow, 10);
        const nTarget = randInt(rng, 1, Math.max(1, nCap));
        requiredCount = randInt(rng, Math.pow(2, nTarget - 1) + 1, Math.pow(2, nTarget));
        correctBits = nTarget;
    } else {
        const hCap = Math.min(totalHostBits - 1, 12);
        const hTarget = randInt(rng, 2, Math.max(2, hCap));
        requiredCount = randInt(rng, Math.max(1, Math.pow(2, hTarget - 1) - 1), Math.max(1, Math.pow(2, hTarget) - 2));
        correctBits = totalHostBits - hTarget;
    }

    const isHosts = requirementType === 'hosts';

    // Class label dropped — the address itself already implies the class,
    // and restating it alongside the CIDR was redundant.
    return {
        subType: 'bits_required',
        givenLabel: 'Given network',
        givenValue: ipStr + '/' + networkBits,
        targetLabel: isHosts ? 'Each subnet must support at least' : 'Must support at least',
        targetValue: requiredCount,
        targetSuffix: isHosts ? ('usable host' + (requiredCount === 1 ? '' : 's')) : ('subnet' + (requiredCount === 1 ? '' : 's')),
        targetIcon: isHosts ? 'fa-house-user' : 'fa-layer-group',
        taskText: 'How many bits must be borrowed?',
        correct: String(correctBits),
        given: ipStr
    };
}

// "What is the subnet mask of the following IP address?" — Atom 2's own
// scenario, asked here as plain text entry.
function genAtom5SubnetMask(rng, subCfg) {
    const range = pickAtom5ClassRange(rng, subCfg);
    const baseOctets = atom5RandomClassfulAddress(rng, range);
    const networkBits = range.cidr;
    const borrowedBits = atom5PickBorrowedBits(rng, networkBits, 10);
    const targetCidr = networkBits + borrowedBits;
    // A full random host address within this network, not the bare
    // network address — matches Atom 2's own "given host" framing.
    const hostOctets = baseOctets.slice();
    for (let i = networkBits / 8; i < 4; i++) hostOctets[i] = randInt(rng, 0, 255);
    const maskBits = '1'.repeat(targetCidr) + '0'.repeat(32 - targetCidr);
    const maskOctets = [0, 1, 2, 3].map(g => parseInt(maskBits.substr(g * 8, 8), 2));
    const ipStr = hostOctets.join('.');
    return {
        subType: 'subnet_mask',
        givenLabel: 'Given host',
        givenValue: ipStr + '/' + targetCidr,
        taskText: 'What is the <b>subnet mask</b> for this network?',
        correct: maskOctets.join('.'),
        given: ipStr
    };
}

// "Given a required-hosts-per-subnet constraint, how many subnets does
// this network produce (borrowing the fewest bits needed to satisfy it)?"
// Deliberately different from supported_subnets/supported_hosts (which
// state the classless CIDR directly and ask for a straight 2^n lookup):
// here only the CLASSFUL network and a host-count requirement are given,
// so the student must first work out the minimal number of host bits that
// satisfies the requirement (same reasoning as genAtom5BitsRequired's own
// 'hosts' branch), derive the implied borrowed-bit count from that, and
// only then compute 2^borrowedBits — chaining Atom 1's "bits required"
// skill into a subnet-count answer instead of testing either skill in
// isolation.
function genAtom5SubnetsProduced(rng, subCfg) {
    const range = pickAtom5ClassRange(rng, subCfg);
    const baseOctets = atom5RandomClassfulAddress(rng, range);
    const networkBits = range.cidr;
    const totalHostBits = 32 - networkBits;
    const ipStr = baseOctets.join('.');

    // Pick a target host-bit width h (bits reserved for hosts) the same
    // way genAtom5BitsRequired's own 'hosts' branch does, then pick a
    // required-host count that h satisfies but h-1 would not — so there's
    // exactly one minimal-bits, and therefore one correct, subnet count.
    const hCap = Math.min(totalHostBits - 1, 12);
    const hTarget = randInt(rng, 2, Math.max(2, hCap));
    const requiredCount = randInt(rng, Math.max(1, Math.pow(2, hTarget - 1) - 1), Math.max(1, Math.pow(2, hTarget) - 2));
    const borrowedBits = totalHostBits - hTarget;
    const totalSubnets = Math.pow(2, borrowedBits);

    return {
        subType: 'subnets_produced',
        givenLabel: 'Given network',
        givenValue: ipStr + '/' + networkBits,
        targetLabel: 'Each subnet must support at least',
        targetValue: requiredCount,
        targetSuffix: 'usable host' + (requiredCount === 1 ? '' : 's'),
        targetIcon: 'fa-house-user',
        taskText: 'Borrowing the fewest bits needed to meet this, how many <b>subnets</b> does this network produce?',
        correct: String(totalSubnets),
        given: ipStr
    };
}

// "What is the network/broadcast address of subnet N?" — `which` is
// 'network' or 'broadcast'.
function genAtom5SubnetAddressQuestion(rng, which, subCfg) {
    const range = pickAtom5ClassRange(rng, subCfg);
    const baseOctets = atom5RandomClassfulAddress(rng, range);
    const networkBits = range.cidr;
    const borrowedBits = atom5PickBorrowedBits(rng, networkBits, 8);
    const targetCidr = networkBits + borrowedBits;
    const totalSubnets = Math.pow(2, borrowedBits);
    const subnetIndex = randInt(rng, 0, totalSubnets - 1);
    const { network, broadcast } = atom5SubnetAddresses(baseOctets, networkBits, borrowedBits, subnetIndex);
    const ipStr = baseOctets.join('.');
    const label = which === 'network' ? 'network address' : 'broadcast address';
    return {
        subType: which === 'network' ? 'network_address_of_subnet' : 'broadcast_address_of_subnet',
        givenLabel: 'Given network',
        givenValue: ipStr + '/' + targetCidr,
        targetLabel: 'Find the ' + label + ' of',
        targetValue: 'Subnet ' + subnetIndex,
        targetIcon: 'fa-hashtag',
        taskText: 'What is the <b>' + label + '</b> of this subnet?',
        correct: which === 'network' ? network : broadcast,
        given: ipStr
    };
}

// "In what subnet does this host IP address belong?"
function genAtom5HostBelongsToSubnet(rng, subCfg) {
    const range = pickAtom5ClassRange(rng, subCfg);
    const baseOctets = atom5RandomClassfulAddress(rng, range);
    const networkBits = range.cidr;
    const borrowedBits = atom5PickBorrowedBits(rng, networkBits, 6);
    const targetCidr = networkBits + borrowedBits;

    const prefixBits = atom1OctetsToBits(baseOctets).slice(0, networkBits);
    const restBits = [];
    for (let i = 0; i < 32 - networkBits; i++) restBits.push(randInt(rng, 0, 1));
    const fullBits = prefixBits.concat(restBits);
    const hostOctets = [0, 1, 2, 3].map(g => atom1BitsToOctet(fullBits.slice(g * 8, g * 8 + 8)));
    const hostIpStr = hostOctets.join('.');
    const subnetIndex = parseInt(restBits.slice(0, borrowedBits).join('') || '0', 2);

    return {
        subType: 'host_belongs_to_subnet',
        givenLabel: 'Given host',
        givenValue: hostIpStr + '/' + targetCidr,
        taskText: 'Which <b>subnet index</b> does this host belong to?',
        correct: String(subnetIndex),
        given: hostIpStr
    };
}

// Shared scenario builder for the two "read the given classless CIDR"
// subtypes below: picks a classful base network, borrows a random number
// of bits, and returns everything both generators need (the classful
// networkBits, the borrowedBits actually used, and the resulting classless
// address string) so neither one duplicates the random-value setup.
function atom5BuildClasslessScenario(rng, subCfg, borrowCap) {
    const range = pickAtom5ClassRange(rng, subCfg);
    const baseOctets = atom5RandomClassfulAddress(rng, range);
    const networkBits = range.cidr;
    const borrowedBits = atom5PickBorrowedBits(rng, networkBits, borrowCap || 10);
    const targetCidr = networkBits + borrowedBits;
    return { range, networkBits, borrowedBits, targetCidr, ipStr: baseOctets.join('.') };
}

// "Given this classless network (address/CIDR), how many bits were
// borrowed from the host portion to create it?" — the inverse of
// bits_required: instead of computing borrowedBits from a subnet/host
// requirement, the student must read the address's CLASS off its first
// octet (Class A/B/C -> classful /8, /16, /24), then subtract that from
// the given CIDR. Deliberately gives only the already-subnetted network —
// no class label, no classful CIDR — since supplying either would hand the
// student half the answer for free.
function genAtom5BorrowedBitsFromCidr(rng, subCfg) {
    const { networkBits, borrowedBits, targetCidr, ipStr } = atom5BuildClasslessScenario(rng, subCfg, 10);
    return {
        subType: 'borrowed_bits_from_cidr',
        givenLabel: 'Given network',
        givenValue: ipStr + '/' + targetCidr,
        taskText: 'How many bits were <b>borrowed</b> from the host portion to create this network?',
        correct: String(borrowedBits),
        given: ipStr
    };
}

// "Given this classless network (address/CIDR), what was the ORIGINAL
// (classful, pre-subnet) network bit count?" — the complementary read of
// the same scenario: rather than the borrowed-bit delta, the student must
// identify the classful boundary itself (the /8, /16, or /24 the address
// started from before any bits were borrowed) from the address's class.
// Uses the same scenario builder as borrowed_bits_from_cidr above so both
// subtypes test the identical "read the class off the address" skill from
// two different angles, without ever asking for the same numeric answer.
function genAtom5OriginalNetworkBits(rng, subCfg) {
    const { networkBits, targetCidr, ipStr } = atom5BuildClasslessScenario(rng, subCfg, 10);
    return {
        subType: 'original_network_bits',
        givenLabel: 'Given network',
        givenValue: ipStr + '/' + targetCidr,
        taskText: 'What was the <b>original classful network bit count</b> — the CIDR before any bits were borrowed?',
        correct: String(networkBits),
        given: ipStr
    };
}

// Map of subType -> generator function, one entry per distinct question
// subtype Atom 5 can produce. Keys must match QUESTION_CONFIG.atom5.subTypes
// and ATOM5_HINTS exactly, since genAtom5Questions below iterates this map
// keyed off that shared config, and openAtom5HintModal looks up hints by
// the same subType string each generator returns.
const ATOM5_SUBTYPE_GENERATORS = {
    supported_subnets: (rng, subCfg) => genAtom5SupportedSubnets(rng, subCfg),
    supported_hosts: (rng, subCfg) => genAtom5SupportedHosts(rng, subCfg),
    bits_required: (rng, subCfg) => genAtom5BitsRequired(rng, subCfg),
    subnet_mask: (rng, subCfg) => genAtom5SubnetMask(rng, subCfg),
    subnets_produced: (rng, subCfg) => genAtom5SubnetsProduced(rng, subCfg),
    network_address_of_subnet: (rng, subCfg) => genAtom5SubnetAddressQuestion(rng, 'network', subCfg),
    broadcast_address_of_subnet: (rng, subCfg) => genAtom5SubnetAddressQuestion(rng, 'broadcast', subCfg),
    host_belongs_to_subnet: (rng, subCfg) => genAtom5HostBelongsToSubnet(rng, subCfg),
    borrowed_bits_from_cidr: (rng, subCfg) => genAtom5BorrowedBitsFromCidr(rng, subCfg),
    original_network_bits: (rng, subCfg) => genAtom5OriginalNetworkBits(rng, subCfg)
};

// Builds Atom 5's question list from the per-subtype config: for each
// subType with its own `enabled: true` and a positive `numQuestions`, runs
// that subtype's generator exactly that many times, passing the subtype's
// own config object through so the generator can honor `allowedClasses`
// (each call still draws fresh random values from the shared rng stream,
// so repeats of the same subtype never produce identical questions). The
// combined list is then shuffled — deterministically, using the same
// seeded rng — so questions of different subtypes interleave in the final
// order instead of being grouped block-by-block by subtype.
function genAtom5Questions(cfg, rng) {
    if (!cfg || !cfg.enabled) return [];
    const subTypesCfg = cfg.subTypes || {};
    const out = [];

    Object.keys(ATOM5_SUBTYPE_GENERATORS).forEach(subType => {
        const subCfg = subTypesCfg[subType];
        if (!subCfg || !subCfg.enabled || !subCfg.numQuestions) return;
        const generator = ATOM5_SUBTYPE_GENERATORS[subType];
        for (let i = 0; i < subCfg.numQuestions; i++) {
            out.push(Object.assign({ type: 'atom5' }, generator(rng, subCfg)));
        }
    });

    // Fisher-Yates shuffle using the same rng stream (consistent with
    // genPhase7Questions' own shuffle above) so the interleaved order is
    // still fully deterministic per seed.
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
    }

    return out;
}

// Separate question list for Atom 5's own dedicated view — same rationale
// as buildAtom1QuestionList/etc: drawn from its own independent RNG stream
// (seed suffixed with '::atom5') so it can never shift any other phase's/
// atom's sequence.
function buildAtom5QuestionList(seedStr) {
    const rng = mulberry32(hashStringToSeed((seedStr || '') + '::atom5'));
    const atom5Questions = genAtom5Questions(QUESTION_CONFIG.atom5, rng);
    return atom5Questions.map((q, i) => ({
        name: `atom5-q${i + 1}`,
        phase: 'Atom 5 · Applied Scenarios',
        label: `Atom 5 – Q${i + 1} (${questionTypeLabel(q.type)})`,
        shortLabel: `Q${i + 1} · ${questionTypeLabel(q.type)}`,
        q
    }));
}

/* =========================================================
   ATOM 5: HINT CONTENT & MODAL
   Each subType genAtom5* produces gets a hint entry: the general formula
   (no numbers from the actual question — those would leak the answer),
   a graphical illustration built with the SAME rendering functions and
   locked/borrowed/host color language the relevant Atom's own UI uses
   (renderAtom1BitGridInner for Atom 1's boundary grid,
   renderAtom2BitGridInner for Atom 2's mask grid, and
   atom3BuildSingleOctetBits for Atom 3/4's composed-address view), a
   worked example using its OWN small placeholder numbers — chosen to
   match the illustration exactly, so the graphic and the text reinforce
   each other — and a pointer to whichever earlier Atom drills that exact
   skill. Purely a study aid — never touches grading, scoring, or
   ex.userAnswer, and every number here is fixed/illustrative, never
   drawn from the actual question's random values.
========================================================= */

// Atom 1's own 32-bit boundary grid, rendered as a static (non-clickable)
// illustration. Used by every "borrow bits" hint (supported_subnets/
// supported_hosts/subnets_produced/bits_required) with whatever
// networkBits/borrowedBits that hint's own worked-example text uses.
function buildAtom5HintBitGridHtml(networkBits, borrowedBits) {
    const octets = [192, 168, 1, 0];
    const inputBits = atom1OctetsToBits(octets);
    return (
        '<div class="bit-grid atom1-bitgrid atom5-hint-viz-static" aria-hidden="true">' +
            renderAtom1BitGridInner('hintviz', inputBits, networkBits, borrowedBits) +
        '</div>' +
        '<div class="legend secondary-copy atom5-hint-legend">' +
            '<span><i class="swatch swatch-locked"></i> Locked network bit</span>' +
            '<span><i class="swatch swatch-borrowed"></i> Borrowed subnet bit</span>' +
            '<span><i class="swatch swatch-host"></i> Host bit</span>' +
        '</div>'
    );
}

// Atom 2's own mask-assembly grid, rendered statically with the mask
// bits already filled in for the given target CIDR — matches the
// subnet_mask hint's own /27 → 255.255.255.224 worked example.
function buildAtom5HintMaskGridHtml(networkBits, targetCidr) {
    const maskBitsStr = initAtom2MaskBits(targetCidr);
    const bitsArr = maskBitsStr.split('').map(Number);
    return (
        '<div class="bit-grid atom1-bitgrid atom5-hint-viz-static" aria-hidden="true">' +
            renderAtom2BitGridInner('hintviz', bitsArr, networkBits) +
        '</div>' +
        '<div class="legend secondary-copy atom5-hint-legend">' +
            '<span><i class="swatch swatch-locked"></i> Locked network bit</span>' +
            '<span><i class="swatch swatch-borrowed"></i> Mask bit ON (1)</span>' +
            '<span><i class="swatch swatch-host"></i> Mask bit OFF (0)</span>' +
        '</div>'
    );
}

// Atom 3/4's own composed-address view (per-octet total/weights/bits/
// label, with locked/borrowed/host coloring), rendered statically for a
// fixed, fully-given address. Shared by the network-address, broadcast-
// address, and host-belongs-to-subnet hints — they only differ in which
// octets and which legend caption they pass in.
function buildAtom5HintAddrRowHtml(octets, networkBits, borrowedBits, legendItems) {
    const fullBits = atom1OctetsToBits(octets);
    const borrowEnd = networkBits + borrowedBits;
    let addrHtml = '<div class="addr-row atom5-hint-addr-row atom5-hint-viz-static" aria-hidden="true">';
    for (let o = 0; o < 4; o++) {
        addrHtml += atom3BuildSingleOctetBits(fullBits, networkBits, borrowEnd, o);
    }
    addrHtml += '</div>';
    const legendHtml = '<div class="legend secondary-copy atom5-hint-legend">' + legendItems.join('') + '</div>';
    return addrHtml + legendHtml;
}

const ATOM5_HINTS = {
    supported_subnets: {
        formula: 'Total Subnets = 2<sup>borrowed bits</sup>',
        example: 'Example: if 3 bits are borrowed, this network supports 2<sup>3</sup> = 8 subnets.',
        visual: () => buildAtom5HintBitGridHtml(24, 3),
        practiceLabel: 'Atom 1 · The Constraint (Bit Question)',
        practiceFn: 'showAtom1Page'
    },
    supported_hosts: {
        formula: 'Usable Hosts per Subnet = 2<sup>host bits</sup> &minus; 2',
        example: 'Example: if 5 host bits remain, this subnet supports 2<sup>5</sup> &minus; 2 = 30 usable hosts. The &minus;2 removes the Network ID and Broadcast Address, which can\'t be assigned to a device.',
        visual: () => buildAtom5HintBitGridHtml(24, 3),
        practiceLabel: 'Atom 1 · The Constraint (Bit Question)',
        practiceFn: 'showAtom1Page'
    },
    bits_required: {
        formula: 'Bits to borrow: the smallest n where 2<sup>n</sup> &ge; required subnets.<br>Bits to borrow (for a host requirement): total host bits &minus; the smallest h where 2<sup>h</sup> &minus; 2 &ge; required hosts.',
        example: 'Example: if at least 10 subnets are required, n = 3 gives 2<sup>3</sup> = 8 (not enough), so try n = 4: 2<sup>4</sup> = 16 (enough) — 4 bits must be borrowed.',
        visual: () => buildAtom5HintBitGridHtml(24, 4),
        practiceLabel: 'Atom 1 · The Constraint (Bit Question)',
        practiceFn: 'showAtom1Page'
    },
    subnet_mask: {
        formula: 'Subnet Mask: set every classful-network bit AND every borrowed bit to 1, leave every remaining host bit as 0. Convert each 8-bit group to decimal.',
        example: 'Example: /27 means 27 ones followed by 5 zeros: 11111111.11111111.11111111.11100000 → 255.255.255.224.',
        visual: () => buildAtom5HintMaskGridHtml(24, 27),
        practiceLabel: 'Atom 2 · The Mask Assembly (Interesting Octet)',
        practiceFn: 'showAtom2Page'
    },
    subnets_produced: {
        formula: 'Step 1: find the smallest host-bit width h where 2<sup>h</sup> &minus; 2 &ge; required hosts per subnet.<br>Step 2: Borrowed Bits = Total Host Bits &minus; h.<br>Step 3: Total Subnets = 2<sup>borrowed bits</sup>.',
        example: 'Example: a Class C (/24) network has 8 host bits. If each subnet must support at least 10 usable hosts, h = 4 gives 2<sup>4</sup> &minus; 2 = 14 (enough), so 8 &minus; 4 = 4 bits are borrowed, producing 2<sup>4</sup> = 16 subnets.',
        visual: () => buildAtom5HintBitGridHtml(24, 4),
        practiceLabel: 'Atom 1 · The Constraint (Bit Question)',
        practiceFn: 'showAtom1Page'
    },
    network_address_of_subnet: {
        formula: 'Network Address = classful network bits + this subnet\'s index written in binary (padded to the borrowed-bit width) + all host bits set to 0.',
        example: 'Example: subnet index 2 with 3 borrowed bits is binary 010. Insert those bits right after the classful network portion, zero out every remaining host bit, then convert all 4 octets back to decimal.',
        visual: () => buildAtom5HintAddrRowHtml([192, 168, 1, 64], 24, 3, [
            '<span><i class="swatch swatch-locked"></i> Locked network bit</span>',
            '<span><i class="swatch swatch-borrowed"></i> Subnet index bit (010 = index 2)</span>',
            '<span><i class="swatch swatch-host"></i> Host bit — all 0 for Network Address</span>'
        ]),
        practiceLabel: 'Atom 3 · The Space Map or Atom 4 · The Boundaries',
        practiceFn: 'showAtom3Page'
    },
    broadcast_address_of_subnet: {
        formula: 'Broadcast Address = classful network bits + this subnet\'s index written in binary (padded to the borrowed-bit width) + all host bits set to 1.',
        example: 'Example: subnet index 2 with 3 borrowed bits is binary 010. Insert those bits right after the classful network portion, set every remaining host bit to 1, then convert all 4 octets back to decimal.',
        visual: () => buildAtom5HintAddrRowHtml([192, 168, 1, 95], 24, 3, [
            '<span><i class="swatch swatch-locked"></i> Locked network bit</span>',
            '<span><i class="swatch swatch-borrowed"></i> Subnet index bit (010 = index 2)</span>',
            '<span><i class="swatch swatch-host"></i> Host bit — all 1 for Broadcast Address</span>'
        ]),
        practiceLabel: 'Atom 4 · The Boundaries',
        practiceFn: 'showAtom4Page'
    },
    host_belongs_to_subnet: {
        formula: 'Subnet Index = just the borrowed bits, read directly out of the host address (the bits immediately after the classful network portion), converted to decimal.',
        example: 'Example: with 3 borrowed bits, if those exact 3 bits in the address read 101, the host belongs to subnet index 5.',
        visual: () => buildAtom5HintAddrRowHtml([192, 168, 1, 173], 24, 3, [
            '<span><i class="swatch swatch-locked"></i> Locked network bit — ignore</span>',
            '<span><i class="swatch swatch-borrowed"></i> Subnet index bits — read these (101 = 5)</span>',
            '<span><i class="swatch swatch-host"></i> Host bit — ignore</span>'
        ]),
        practiceLabel: 'Atom 3 · The Space Map (Front & Back Subnets)',
        practiceFn: 'showAtom3Page'
    },
    borrowed_bits_from_cidr: {
        formula: 'Borrowed Bits = Given CIDR &minus; Classful Network Bits, where the classful network bits come from the address\'s class (first octet): 1&ndash;126 &rarr; Class A &rarr; /8, 128&ndash;191 &rarr; Class B &rarr; /16, 192&ndash;223 &rarr; Class C &rarr; /24.',
        example: 'Example: 192.168.1.64/27 starts with 192, a Class C address, so its classful network bits = 24. Borrowed bits = 27 &minus; 24 = 3.',
        visual: () => buildAtom5HintBitGridHtml(24, 3),
        practiceLabel: 'Atom 1 · The Constraint (Bit Question)',
        practiceFn: 'showAtom1Page'
    },
    original_network_bits: {
        formula: 'Classful Network Bits are determined entirely by the address\'s first octet: 1&ndash;126 &rarr; Class A &rarr; /8, 128&ndash;191 &rarr; Class B &rarr; /16, 192&ndash;223 &rarr; Class C &rarr; /24. The given CIDR (after any borrowing) doesn\'t change this.',
        example: 'Example: 192.168.1.64/27 starts with 192, which falls in the Class C range (192&ndash;223) — so the original classful network was /24, regardless of the /27 it\'s since been subnetted to.',
        visual: () => buildAtom5HintBitGridHtml(24, 3),
        practiceLabel: 'Atom 1 · The Constraint (Bit Question)',
        practiceFn: 'showAtom1Page'
    }
};

// Opens the hint modal for one Atom 5 question, populated from its
// subType. Never reveals ex.correct or any of this question's own given
// numbers — only the general formula, a static graphical illustration
// (fixed example numbers, rendered with the SAME component the relevant
// Atom uses), and a self-contained placeholder worked example. The
// "Go Practice" button jumps to whichever Atom drills this exact skill;
// wired here (not as a static onclick) since the target page differs
// per subType.
function openAtom5HintModal(qid) {
    const ex = exerciseData[qid];
    const hint = ex ? ATOM5_HINTS[ex.subType] : null;
    if (!hint) return;

    document.getElementById('atom5HintFormula').innerHTML = hint.formula;
    const visualBox = document.getElementById('atom5HintVisual');
    if (visualBox) visualBox.innerHTML = typeof hint.visual === 'function' ? hint.visual() : '';
    document.getElementById('atom5HintExample').innerHTML = hint.example;
    document.getElementById('atom5HintPractice').innerHTML = '<i class="fa-solid fa-atom" aria-hidden="true"></i> ' + hint.practiceLabel;

    const practiceBtn = document.getElementById('atom5HintPracticeBtn');
    if (practiceBtn) {
        practiceBtn.onclick = () => {
            closeAtom5HintModal();
            const target = window[hint.practiceFn];
            if (typeof target === 'function') target();
        };
    }

    document.getElementById('atom5HintModal').style.display = 'block';
    document.getElementById('atom5HintOverlay').style.display = 'block';
}

function closeAtom5HintModal() {
    document.getElementById('atom5HintModal').style.display = 'none';
    document.getElementById('atom5HintOverlay').style.display = 'none';
}

/* =========================================================
   ATOM 5: DEDICATED FULL-WIDTH VIEW — narrative card + single text
   answer, no bit grid at all. Follows the same per-question Verify/Reset
   + pagination pattern as Atoms 1-4 (see ATOM_PAGINATION/showAtomQuestion
   above), just with a much simpler question body: one requirement card
   (reusing Atom 1/2's own .atom1-req-card visual language for the
   scenario text) and one plain text input.
========================================================= */
let atom5ActionsDelegated = false;

// One row of the card: an icon, an eyebrow label, and whatever body markup
// the caller supplies. Shared by every row below so the given/target/task
// rows all come out of the same small template.
function atom5CardRow(iconClass, iconGlyph, eyebrow, bodyHtml, rowClass) {
    return '<div class="atom1-req-row' + (rowClass ? ' ' + rowClass : '') + '">' +
        '<div class="atom1-req-icon ' + iconClass + '"><i class="fa-solid ' + iconGlyph + '" aria-hidden="true"></i></div>' +
        '<div class="atom1-req-body">' +
            '<div class="atom1-req-eyebrow">' + eyebrow + '</div>' +
            bodyHtml +
        '</div>' +
    '</div>';
}

// Reuses Atom 1/3's own requirement/task-card row language (given network,
// an optional highlighted target, then the task) instead of the old single
// prose paragraph — the given network/host address is its own scannable
// row, any question-specific target (a required count, or a subnet index
// to look up) gets its own highlighted row exactly like Atom 1's
// atom1-req-target-num, and the actual question sits in a plain final row.
// Not every subType has a target row (e.g. "how many subnets does this
// produce" IS the question, nothing to highlight separately) — that middle
// row is only rendered when the generator supplied a cardTargetValue.
function buildAtom5RequirementCardHtml(ex) {
    let rowsHtml = atom5CardRow(
        'atom1-req-icon-network',
        'fa-diagram-project',
        ex.cardGivenLabel || 'Given network',
        '<div class="atom1-req-main"><span class="atom1-req-value">' + ex.cardGivenValue + '</span></div>'
    );

    if (ex.cardTargetValue !== undefined && ex.cardTargetValue !== null && ex.cardTargetValue !== '') {
        rowsHtml += atom5CardRow(
            'atom1-req-icon-requirement',
            ex.cardTargetIcon || 'fa-bullseye',
            ex.cardTargetLabel || 'Target',
            '<div class="atom1-req-target"><span class="atom1-req-target-num">' + ex.cardTargetValue + '</span>' +
                (ex.cardTargetSuffix ? '<span class="atom1-req-target-label">' + ex.cardTargetSuffix + '</span>' : '') +
            '</div>'
        );
    }

    rowsHtml += atom5CardRow(
        'atom1-req-icon-question',
        'fa-circle-question',
        'Find',
        '<div class="atom1-req-action-text atom5-scenario-text">' + ex.cardTaskText + '</div>',
        'atom5-find-row'
    );

    return '<div class="atom1-req-card">' + rowsHtml + '</div>';
}

function buildAtom5PanelHtml(qid, ex, index) {
    return (
        '<section class="panel atom1-q-panel" id="atom5QPanel-' + qid + '" data-qid="' + qid + '">' +
            '<div class="panel-head">' +
                '<span class="panel-index">Q' + index + '</span>' +
                '<h2>Applied Scenario</h2>' +
                '<button type="button" class="atom5-hint-btn" data-qid="' + qid + '" aria-label="Show a hint for this question"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> Hint</button>' +
                '<span class="badge atom1-score-badge" id="atom5ScoreBadge-' + qid + '">0/1</span>' +
            '</div>' +
            buildAtom5RequirementCardHtml(ex) +
            '<div class="atom5-answer-row">' +
                '<input type="text" class="answer-input-num atom5-answer-input" data-qid="' + qid + '" inputmode="text" placeholder="Your answer" autocomplete="off">' +
            '</div>' +
            '<div class="atom1-actions">' +
                '<button class="primary-btn atom5-verify-btn" data-qid="' + qid + '">Verify Answer</button>' +
                '<div class="atom1-feedback" id="atom5Feedback-' + qid + '" role="status" aria-live="polite"></div>' +
            '</div>' +
        '</section>'
    );
}

// Builds the full Atom 5 page from scratch (called once per login) and
// wires up each question's text input plus a single delegated click
// listener for every Verify/Reset button on the page — same structure as
// renderAtom1View/renderAtom2View.
function renderAtom5View(atom5List) {
    const container = document.getElementById('atom5QuestionsContainer');
    if (!container) return;

    container.innerHTML = atom5List
        .map((item, i) => buildAtom5PanelHtml(item.name, exerciseData[item.name], i + 1))
        .join('');

    container.querySelectorAll('.atom5-answer-input').forEach(inp => {
        inp.addEventListener('input', () => saveAtom5Progress(inp.dataset.qid));
    });

    if (!atom5ActionsDelegated) {
        atom5ActionsDelegated = true;
        container.addEventListener('click', (e) => {
            const hintBtn = e.target.closest('.atom5-hint-btn');
            if (hintBtn) {
                openAtom5HintModal(hintBtn.dataset.qid);
                return;
            }
            const btn = e.target.closest('.atom5-verify-btn');
            if (!btn) return;
            const qid = btn.dataset.qid;
            const ex = exerciseData[qid];
            if (!ex) return;
            if (ex.locked) {
                resetAtom5Question(qid);
            } else {
                verifyAtom5Question(qid);
            }
        });
    }

    attachAtomPaginationHandlers();
    initAtomPagination('atom5');
}

// Persists the in-progress typed answer for one Atom 5 question
// (analogous to saveAtom1Progress/saveAtom2Progress).
function saveAtom5Progress(qid) {
    const ex = exerciseData[qid];
    if (!ex || ex.locked) return;
    const input = document.querySelector('.atom5-answer-input[data-qid="' + qid + '"]');
    ex.userAnswer = input ? input.value : (ex.userAnswer || '');
    saveSessionProgress();
}

// Sets the Verify/Reset/Locked button label + disabled state for one
// question — same rules as setAtom1ButtonState/etc.
function setAtom5ButtonState(qid) {
    const ex = exerciseData[qid];
    const btn = document.querySelector('.atom5-verify-btn[data-qid="' + qid + '"]');
    if (!btn || !ex) return;
    if (ex.locked) {
        if (isRetryAllowed()) {
            btn.textContent = 'Reset';
            btn.disabled = false;
        } else {
            btn.textContent = 'Locked';
            btn.disabled = true;
        }
    } else {
        btn.textContent = 'Verify Answer';
        btn.disabled = false;
    }
}

// Renders this question's per-question feedback, reusing the shared
// buildFeedbackForExercise/renderFeedback helpers exactly as every other
// Atom does, so wording stays identical across the whole app.
function updateAtom5QuestionFeedback(qid, ex) {
    const el = document.getElementById('atom5Feedback-' + qid);
    if (!el) return;
    if (!ex || !ex.locked) {
        el.textContent = '';
        el.className = 'atom1-feedback';
        return;
    }
    const feedback = buildFeedbackForExercise(ex);
    renderFeedback(el, feedback);
    el.className = 'atom1-feedback ' + feedback.cls;
}

// Updates one question's score badge (max always 1/1 for Atom 5) — same
// coloring convention as updateAtom1ScoreBadge/etc.
function updateAtom5ScoreBadge(qid, ex) {
    const badge = document.getElementById('atom5ScoreBadge-' + qid);
    if (!badge || !ex) return;
    badge.textContent = (ex.score || 0) + '/' + ex.answers.length;
    badge.classList.remove('completed-score', 'partial-score');
    if (ex.locked) {
        if (ex.score === ex.answers.length) badge.classList.add('completed-score');
        else if (ex.score > 0) badge.classList.add('partial-score');
    }
}

// Applies every visual consequence of this question being locked: the
// panel's correct/incorrect edge color, disabling the text input, the
// feedback message, the score badge, and the action button label.
function applyAtom5LockedUI(qid, ex) {
    const panel = document.getElementById('atom5QPanel-' + qid);
    const input = document.querySelector('.atom5-answer-input[data-qid="' + qid + '"]');
    const isCorrect = (ex.score || 0) === ex.answers.length;

    if (panel) {
        panel.classList.remove('correct', 'incorrect');
        panel.classList.add(isCorrect ? 'correct' : 'incorrect');
    }
    if (input) {
        input.disabled = true;
        input.classList.add('locked');
    }

    updateAtom5QuestionFeedback(qid, ex);
    updateAtom5ScoreBadge(qid, ex);
    setAtom5ButtonState(qid);
}

// Grades and locks one Atom 5 question — a single exact-match text
// comparison (see gradeConversionAnswer), the same grading shape Phase
// 7's class_cidr question already uses.
function verifyAtom5Question(qid) {
    const ex = exerciseData[qid];
    if (!ex || ex.locked) return;

    const input = document.querySelector('.atom5-answer-input[data-qid="' + qid + '"]');
    const userAnswer = input ? input.value : '';
    ex.userAnswer = userAnswer;

    const isCorrect = gradeConversionAnswer(ex, userAnswer);
    ex.score = isCorrect ? 1 : 0;
    ex.isPartial = false;
    ex.locked = true;

    applyAtom5LockedUI(qid, ex);
    updateAtom5NavScore();
    updateSummaryPanel();

    if (isCorrect) triggerConfetti();

    saveSessionProgress();
    if (appSettings.mode === 'exam') {
        if (checkIfAllAnswered()) {
            stopTimer();
            setTimeout(() => {
                showScoreSummaryModal('Congratulations! All exercises completed before time ran out!', 'success');
            }, 500);
        }
    }
}

// Resets one Atom 5 question — practice mode only, mirroring
// resetAtom1Question's/etc. exam-mode guard.
function resetAtom5Question(qid) {
    if (!isRetryAllowed()) {
        showAlertModal('Reset Not Allowed', sessionTimedOut ? 'Reset is not allowed after time expires.' : 'Reset is not allowed in Exam Mode.');
        return;
    }
    const ex = exerciseData[qid];
    if (!ex) return;

    ex.userAnswer = '';
    ex.score = 0;
    ex.isPartial = false;
    ex.locked = false;

    const input = document.querySelector('.atom5-answer-input[data-qid="' + qid + '"]');
    if (input) {
        input.value = '';
        input.disabled = false;
        input.classList.remove('locked');
    }

    const panel = document.getElementById('atom5QPanel-' + qid);
    if (panel) panel.classList.remove('correct', 'incorrect');

    updateAtom5QuestionFeedback(qid, null);
    updateAtom5ScoreBadge(qid, ex);
    setAtom5ButtonState(qid);
    updateAtom5NavScore();
    updateSummaryPanel();
    saveSessionProgress();
}

// Aggregates every atom5-q* exercise into a single X/N readout on the
// sidebar's "Atom 5" nav entry, same as updateAtom1NavScore/etc.
function updateAtom5NavScore() {
    const scoreEl = document.getElementById('score-atom5');
    if (!scoreEl) return;
    let got = 0;
    let total = 0;
    for (const file in exerciseData) {
        if (file.indexOf('atom5-q') === 0) {
            const ex = exerciseData[file];
            got += Number(ex.score || 0);
            total += ex.answers.length;
        }
    }
    scoreEl.textContent = got + '/' + total;
    scoreEl.classList.remove('completed-score', 'partial-score');
    if (total > 0 && got === total) {
        scoreEl.classList.add('completed-score');
    } else if (got > 0) {
        scoreEl.classList.add('partial-score');
    }
}

// Re-applies every Atom 5 question's current exerciseData state (typed
// answer, locked styling, feedback, badge) onto the already-rendered DOM.
// Called once per login, after exam-session restore, same rationale as
// syncAtom1ViewDOM/etc.
function syncAtom5ViewDOM() {
    for (const file in exerciseData) {
        if (file.indexOf('atom5-q') !== 0) continue;
        const ex = exerciseData[file];
        if (!ex) continue;

        const input = document.querySelector('.atom5-answer-input[data-qid="' + file + '"]');
        if (input && typeof ex.userAnswer === 'string') input.value = ex.userAnswer;

        if (ex.locked) {
            applyAtom5LockedUI(file, ex);
        } else {
            setAtom5ButtonState(file);
        }
    }
    updateAtom5NavScore();
}

// --- Sidebar navigation into the Atom 5 view (Tools → Atoms → Atom 5) ---
// Mirrors showAtom1Page/showAtom4Page exactly.
function showAtom5Page() {
    document.querySelectorAll('.sidebar li').forEach(l => l.classList.remove('active'));
    const navItem = document.getElementById('nav-atom5');
    if (navItem) navItem.classList.add('active');

    document.getElementById('exerciseArea').style.display = 'none';
    document.getElementById('subnetVisualizerView').style.display = 'none';
    document.getElementById('atomPlaceholderView').style.display = 'none';
    document.getElementById('atom1View').style.display = 'none';
    document.getElementById('atom2View').style.display = 'none';
    document.getElementById('atom3View').style.display = 'none';
    document.getElementById('atom4View').style.display = 'none';
    document.getElementById('atom6View').style.display = 'none';
    document.getElementById('atom7View').style.display = 'none';
    document.getElementById('atom8View').style.display = 'none';
    document.getElementById('atom9View').style.display = 'none';
    document.getElementById('atom5View').style.display = 'flex';
    document.getElementById('timerContainer').style.display = timerIntervalId ? 'flex' : 'none';

    showAtomPaginationBar('atom5');

    currentFile = ''; // no single graded exercise is "current" on this page

    closeSampleOutputModal();
    updateConsoleDrawerTab(false);

    closeSidebarIfMobile();
}

/* =========================================================
   ATOM 6: VLSM PLANNING
   Decimal-input, progressively unlocked scenarios. Students first order
   every LAN and WAN, then calculate one LAN allocation at a time
   from the source subnet created by the preceding correct allocation.
   All WANs are finally drawn from one shared source subnet.
========================================================= */
let atom6ActionsDelegated = false;
let atom6QuestionIds = [];
let atom6TopologyFrame = null;
let atom6TopologyResizeBound = false;

function atom6Escape(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[ch]);
}

function atom6IpToInt(ip) {
    const parts = Array.isArray(ip) ? ip : String(ip).split('.').map(Number);
    return ((((Number(parts[0]) * 256) + Number(parts[1])) * 256 + Number(parts[2])) * 256 + Number(parts[3])) >>> 0;
}

function atom6IntToIp(value) {
    const n = Number(value) >>> 0;
    return [
        Math.floor(n / 16777216) % 256,
        Math.floor(n / 65536) % 256,
        Math.floor(n / 256) % 256,
        n % 256
    ].join('.');
}

function atom6BlockSize(cidr) {
    return Math.pow(2, 32 - Number(cidr));
}

function atom6NetworkInt(value, cidr) {
    const size = atom6BlockSize(cidr);
    return Math.floor((Number(value) >>> 0) / size) * size;
}

function atom6MaskOctets(cidr) {
    let remaining = Number(cidr);
    return [0, 1, 2, 3].map(() => {
        const bits = Math.max(0, Math.min(8, remaining));
        remaining -= bits;
        return bits === 0 ? 0 : 256 - Math.pow(2, 8 - bits);
    });
}

function atom6RequiredCidr(requiredHosts) {
    const availableNeeded = Number(requiredHosts) + 2;
    const hostBits = Math.max(2, Math.ceil(Math.log2(availableNeeded)));
    return 32 - hostBits;
}

function atom6WanAllocationCidr(cfg) {
    const requiredUsableIp = Number(cfg.wanRequirement.requiredUsableIp ?? cfg.wanRequirement.requiredIp);
    const configuredCidr = Number(cfg.wanRequirement.allocationCidr);
    const smallestValidCidr = atom6RequiredCidr(requiredUsableIp);
    const configuredUsableIp = atom6BlockSize(configuredCidr) - 2;
    if (!Number.isInteger(requiredUsableIp) || requiredUsableIp < 1 ||
        !Number.isInteger(configuredCidr) || configuredCidr < 0 || configuredCidr > 30 ||
        configuredUsableIp < requiredUsableIp ||
        (cfg.allocation?.requireSmallestValidCidr !== false && configuredCidr !== smallestValidCidr)) {
        throw new Error('Atom WAN configuration must provide the configured usable IP requirement with the smallest valid CIDR.');
    }
    return configuredCidr;
}

function atom6RequiredSourceCidr(childCidr, childCount) {
    const count = Number(childCount);
    if (!Number.isInteger(count) || count < 1) return null;
    return Number(childCidr) - Math.ceil(Math.log2(count));
}

function atom6Block(network, cidr) {
    const networkInt = atom6NetworkInt(network, cidr);
    const availableIp = atom6BlockSize(cidr);
    return {
        networkInt,
        network: atom6IntToIp(networkInt),
        cidr: Number(cidr),
        mask: atom6MaskOctets(cidr),
        availableIp,
        usableIp: Math.max(0, availableIp - 2),
        first: atom6IntToIp(networkInt + 1),
        last: atom6IntToIp(networkInt + availableIp - 2),
        broadcast: atom6IntToIp(networkInt + availableIp - 1)
    };
}

function atom6Children(source, childCidr) {
    if (childCidr < source.cidr) return [];
    const count = Math.pow(2, childCidr - source.cidr);
    const size = atom6BlockSize(childCidr);
    return Array.from({ length: count }, (_, i) => atom6Block(source.networkInt + i * size, childCidr));
}

function atom6Shuffle(array, rng) {
    const out = [...array];
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
}

function atom6PickWeighted(rng, profiles) {
    const total = profiles.reduce((sum, p) => sum + Math.max(0, Number(p.weight) || 0), 0) || profiles.length;
    let roll = rng() * total;
    for (const profile of profiles) {
        roll -= Math.max(0, Number(profile.weight) || 1);
        if (roll <= 0) return profile;
    }
    return profiles[profiles.length - 1];
}

function atom6GenerateParent(level, rng) {
    const pool = pickRandom(rng, level.parentPools);
    const octets = pool.octetRanges.map(range => randInt(rng, Number(range[0]), Number(range[1])));
    return atom6Block(atom6IpToInt(octets), pool.cidr);
}

function atom6BuildTopology(level, cfg, rng) {
    const lanTotal = Math.max(Number(cfg.minLans), Math.min(Number(cfg.maxLans), Number(level.lanCount)));
    const wanTotal = Math.max(Number(cfg.minWans), Math.min(Number(cfg.maxWans), Number(level.wanCount)));
    const topologyCfg = cfg.topology;
    const routerCount = Math.max(Number(topologyCfg.minRouters), Math.min(Number(topologyCfg.maxRouters), Number(level.routerCount)));
    const maxLanPorts = Number(topologyCfg.maxLanPortsPerRouter);
    const maxWanPorts = Number(topologyCfg.maxWanPortsPerRouter);
    const lanPortsPerRouter = (level.lanPortsPerRouter || []).map(Number);
    const wanRouterPairs = (level.wanRouterPairs || []).map(pair => pair.map(value => Number(value) - 1));
    if (lanPortsPerRouter.length !== routerCount || lanPortsPerRouter.reduce((sum, count) => sum + count, 0) !== lanTotal ||
        lanPortsPerRouter.some(count => count < 0 || count > maxLanPorts) || wanRouterPairs.length !== wanTotal) {
        throw new Error('Atom 6 level topology does not match its configured router, LAN, and WAN counts.');
    }
    const wanPortUsage = Array.from({ length: routerCount }, () => 0);
    wanRouterPairs.forEach(pair => {
        if (pair.length !== 2 || pair[0] < 0 || pair[0] >= routerCount || pair[1] < 0 || pair[1] >= routerCount || pair[0] === pair[1]) {
            throw new Error('Atom 6 contains an invalid configured WAN router pair.');
        }
        wanPortUsage[pair[0]]++;
        wanPortUsage[pair[1]]++;
    });
    if (wanPortUsage.some(count => count > maxWanPorts)) {
        throw new Error('Atom 6 topology exceeds the configured LAN or WAN port capacity.');
    }

    const routers = Array.from({ length: routerCount }, (_, i) => ({
        id: 'router-' + (i + 1), number: i + 1, lanIds: [], wanIds: []
    }));
    const names = atom6Shuffle(cfg.lanNames, rng).slice(0, lanTotal);
    const profilesBySize = [...cfg.lanProfiles].sort((a, b) => Number(b.maxHosts) - Number(a.maxHosts));
    const lans = [];
    let lanRouterIndices = lanPortsPerRouter.flatMap((count, routerIndex) => Array.from({ length: count }, () => routerIndex));
    if (level.randomizeLanRouterAssignment === true || cfg.randomizeLanRouterAssignment === true) {
        lanRouterIndices = atom6Shuffle(lanRouterIndices, rng);
    }
    for (let i = 0; i < lanTotal; i++) {
        const profile = i < profilesBySize.length ? profilesBySize[i] : atom6PickWeighted(rng, cfg.lanProfiles);
        const hosts = randInt(rng, Number(profile.minHosts), Number(profile.maxHosts));
        const routerIndex = lanRouterIndices[i];
        const lan = {
            id: 'lan-' + (i + 1),
            type: 'lan',
            number: i + 1,
            label: names[i],
            routerId: routers[routerIndex].id,
            hosts,
            requiredCidr: atom6RequiredCidr(hosts)
        };
        routers[routerIndex].lanIds.push(lan.id);
        lans.push(lan);
    }

    const wans = Array.from({ length: wanTotal }, (_, i) => {
        const pair = wanRouterPairs[i];
        const requiredIp = Number(cfg.wanRequirement.requiredUsableIp ?? cfg.wanRequirement.requiredIp);
        const wan = {
            id: 'wan-' + (i + 1), type: 'wan', number: i + 1,
            label: 'WAN ' + (i + 1),
            fromRouterId: routers[pair[0]].id,
            toRouterId: routers[pair[1]].id,
            requiredIp,
            requiredCidr: atom6WanAllocationCidr(cfg)
        };
        routers[pair[0]].wanIds.push(wan.id);
        routers[pair[1]].wanIds.push(wan.id);
        return wan;
    });
    return { routers, lans, wans };
}

function atom6AllocateScenario(parent, topology, cfg) {
    const sortedLans = [...topology.lans].sort((a, b) => b.hosts - a.hosts || a.id.localeCompare(b.id));
    let pool = [parent];
    const lanAllocations = [];

    for (const lan of sortedLans) {
        pool.sort((a, b) => a.networkInt - b.networkInt);
        const sourceIndex = pool.findIndex(block => block.cidr <= lan.requiredCidr);
        if (sourceIndex < 0) return null;
        const source = pool.splice(sourceIndex, 1)[0];
        const children = atom6Children(source, lan.requiredCidr);
        if (!children.length) return null;
        const assigned = children[0];
        pool.push(...children.slice(1));
        pool.sort((a, b) => a.networkInt - b.networkInt);
        lanAllocations.push({ lanId: lan.id, source, assigned, generated: children, poolAfter: pool.map(b => ({ ...b })) });
    }

    const linkCidr = atom6WanAllocationCidr(cfg);
    const linkCount = topology.wans.length;
    if (linkCount === 0) {
        pool.sort((a, b) => a.networkInt - b.networkInt);
        return {
            sortedLans,
            lanAllocations,
            wan: {
                source: null,
                generated: [],
                assignments: [],
                requiredSourceCidr: null,
                requiredBlockCount: 0,
                sourceBlockCapacity: 0,
                skippedBeforeSource: [],
                poolAfter: pool.map(block => ({ ...block }))
            }
        };
    }
    const requiredSourceCidr = atom6RequiredSourceCidr(linkCidr, linkCount);
    pool.sort((a, b) => a.networkInt - b.networkInt);
    // Select by address order, but only when one source can produce the full
    // WAN set. For example, six /30 WAN networks require at least a /27;
    // an earlier /28 (four /30s) is left untouched and the search continues.
    const sourceIndex = pool.findIndex(block => block.cidr <= requiredSourceCidr);
    if (sourceIndex < 0) return null;
    const skippedBeforeSource = pool.slice(0, sourceIndex).map(block => ({ ...block }));
    const source = pool.splice(sourceIndex, 1)[0];
    const generated = atom6Children(source, linkCidr);
    if (generated.length < linkCount) return null;
    const assignments = topology.wans.map((wan, i) => ({ wanId: wan.id, block: generated[i] }));
    pool.push(...generated.slice(linkCount));
    pool.sort((a, b) => a.networkInt - b.networkInt);

    return {
        sortedLans,
        lanAllocations,
        wan: {
            source,
            generated,
            assignments,
            requiredSourceCidr,
            requiredBlockCount: linkCount,
            sourceBlockCapacity: generated.length,
            skippedBeforeSource,
            poolAfter: pool.map(b => ({ ...b }))
        }
    };
}

function atom6GenerateScenario(level, cfg, rng, scenarioIndex) {
    for (let attempt = 0; attempt < 200; attempt++) {
        const parent = atom6GenerateParent(level, rng);
        const topology = atom6BuildTopology(level, cfg, rng);
        const solution = atom6AllocateScenario(parent, topology, cfg);
        if (!solution) continue;
        const allItems = [...topology.lans, ...topology.wans];
        return {
            id: level.id + '-' + (scenarioIndex + 1),
            levelId: level.id,
            levelLabel: level.label,
            parent,
            routers: topology.routers,
            lans: topology.lans,
            wans: topology.wans,
            solution,
            initialOrder: atom6Shuffle(allItems.map(item => item.id), rng)
        };
    }
    throw new Error('Atom 6 could not generate a feasible scenario for level ' + level.id + '. Check its configuration.');
}

function buildAtom7Scenario(seedStr) {
    const cfg = QUESTION_CONFIG.atom7;
    if (!cfg || !cfg.enabled) return null;
    const seedCfg = cfg.seed || {};
    const rng = mulberry32(hashStringToSeed(
        String(seedStr || '') + '::atom7::' + String(seedCfg.salt || '')
    ));
    return atom6GenerateScenario(cfg.scenario, cfg, rng, 0);
}

function buildAtom6QuestionList(seedStr) {
    const cfg = QUESTION_CONFIG.atom6;
    if (!cfg || !cfg.enabled) return [];
    const list = [];
    cfg.levels.filter(level => level && level.numQuestions > 0).forEach(level => {
        for (let i = 0; i < Number(level.numQuestions); i++) {
            const rng = mulberry32(hashStringToSeed((seedStr || '') + '::atom6::' + level.id + '::q' + (i + 1)));
            const scenario = atom6GenerateScenario(level, cfg, rng, i);
            list.push({
                name: 'atom6-' + level.id + '-q' + (i + 1),
                phase: 'Atom 6 · VLSM Planning',
                label: level.label + ' VLSM Scenario ' + (i + 1),
                shortLabel: level.label + ' Q' + (i + 1),
                scenario
            });
        }
    });
    return list;
}

function buildAtom9QuestionList(seedStr) {
    const cfg = QUESTION_CONFIG.atom9;
    if (!cfg?.enabled) return [];
    return (cfg.items || []).map((profile, index) => {
        const itemSeed = String(seedStr || '') + '::atom9::' + profile.id;
        const rng = mulberry32(hashStringToSeed(itemSeed));
        const level = {
            ...profile,
            parentPools: profile.parentPools || cfg.parentPools,
            randomizeLanRouterAssignment: profile.randomizeLanRouterAssignment ?? cfg.randomizeLanRouterAssignment
        };
        const scenario = atom6GenerateScenario(level, cfg, rng, index);
        const model = atom8BuildModel(scenario, itemSeed);
        const officialCases = atom8GenerateOfficialCases(scenario, model, itemSeed);
        return {
            name: 'atom9-item-' + (index + 1),
            label: profile.label || ('Item ' + (index + 1)),
            scenario,
            model,
            officialCases
        };
    });
}

function atom6EmptyIp() { return ['', '', '', '']; }

function atom6InitialState(scenario) {
    return {
        order: [...scenario.initialOrder],
        orderComplete: false,
        allocationLanIds: [],
        orderFeedback: '',
        completedLanCount: 0,
        lanInputs: scenario.solution.lanAllocations.map(() => ({
            cidr: '', mask: atom6EmptyIp(), network: atom6EmptyIp(), first: atom6EmptyIp(), last: atom6EmptyIp(), broadcast: atom6EmptyIp()
        })),
        lanFeedback: scenario.solution.lanAllocations.map(() => ({})),
        wanInputs: {
            cidr: '', mask: atom6EmptyIp(),
            links: scenario.wans.map(() => ({ network: atom6EmptyIp(), first: atom6EmptyIp(), last: atom6EmptyIp(), broadcast: atom6EmptyIp() }))
        },
        wanFeedback: {},
        wanAssignmentIndices: [],
        wanComplete: false,
        message: ''
    };
}

function atom6RestoreState(ex) {
    if (!ex || !ex.userAnswer) return ex.atom6State || atom6InitialState(ex.scenario);
    try {
        const parsed = JSON.parse(ex.userAnswer);
        if (parsed && Array.isArray(parsed.order) && Array.isArray(parsed.lanInputs)) {
            if (!Array.isArray(parsed.allocationLanIds)) {
                parsed.allocationLanIds = parsed.orderComplete ? parsed.order.filter(id => ex.scenario.lans.some(lan => lan.id === id)) : [];
            }
            if (!Array.isArray(parsed.wanAssignmentIndices)) parsed.wanAssignmentIndices = [];
            return parsed;
        }
    } catch (err) {
        console.warn('Could not restore Atom 6 state:', err);
    }
    return ex.atom6State || atom6InitialState(ex.scenario);
}

function buildAtom6ExerciseData(item) {
    const stageCount = 1 + item.scenario.lans.length + 1;
    return {
        type: 'atom6', label: item.label, shortLabel: item.shortLabel, phase: item.phase,
        scenario: item.scenario,
        answers: Array.from({ length: stageCount }, () => []),
        score: 0, isPartial: false, locked: false,
        isConversionQuestion: true, isLineOrdering: false,
        userAnswer: '', atom6State: atom6InitialState(item.scenario)
    };
}

function atom6SaveState(qid) {
    const ex = exerciseData[qid];
    if (!ex) return;
    ex.userAnswer = JSON.stringify(ex.atom6State);
    ex.isPartial = ex.score > 0 && ex.score < ex.answers.length;
    saveSessionProgress();
}

function atom6ItemById(scenario, id) {
    return [...scenario.lans, ...scenario.wans].find(item => item.id === id);
}

function atom6ValidateOrder(scenario, order) {
    const items = order.map(id => atom6ItemById(scenario, id)).filter(Boolean);
    if (items.length !== scenario.lans.length + scenario.wans.length) return false;
    let foundWan = false;
    let previousHosts = Infinity;
    for (const item of items) {
        if (item.type === 'wan') {
            foundWan = true;
            continue;
        }
        if (foundWan || item.hosts > previousHosts) return false;
        previousHosts = item.hosts;
    }
    return true;
}

function atom6OrderedLans(ex) {
    const ids = ex.atom6State?.allocationLanIds;
    if (Array.isArray(ids) && ids.length === ex.scenario.lans.length) {
        const ordered = ids.map(id => ex.scenario.lans.find(lan => lan.id === id));
        if (ordered.every(Boolean)) return ordered;
    }
    return ex.scenario.solution.sortedLans;
}

function atom6IpValues(value) {
    return String(value).split('.').map(String);
}

function atom6CheckOctets(values, correct) {
    const expected = Array.isArray(correct) ? correct.map(String) : atom6IpValues(correct);
    const result = [0, 1, 2, 3].map(i => String(values?.[i] ?? '').trim() === String(expected[i]));
    return { result, correct: result.every(Boolean) };
}

function atom6IpInput(qid, scope, index, field, values, feedback, disabled, labels) {
    const parts = values || atom6EmptyIp();
    const states = feedback?.[field];
    return '<div class="atom6-ip-input" role="group" aria-label="' + atom6Escape(labels || field) + '">' +
        [0, 1, 2, 3].map(i => {
            const state = Array.isArray(states) ? states[i] : undefined;
            const cls = state === true ? ' atom6-correct' : (state === false ? ' atom6-incorrect' : '');
            return '<input type="number" min="0" max="255" inputmode="numeric" class="atom6-octet' + cls + '"' +
                ' data-qid="' + qid + '" data-scope="' + scope + '" data-index="' + index + '" data-field="' + field + '" data-oct="' + i + '"' +
                ' value="' + atom6Escape(parts[i] ?? '') + '" aria-label="' + atom6Escape((labels || field) + ' octet ' + (i + 1)) + '"' +
                ((disabled || state === true) ? ' disabled' : '') + '>' + (i < 3 ? '<span class="dot">.</span>' : '');
        }).join('') + '</div>';
}

function atom6ScalarInput(qid, scope, index, field, value, state, disabled, label, min, max) {
    const cls = state === true ? ' atom6-correct' : (state === false ? ' atom6-incorrect' : '');
    return '<input type="number" inputmode="numeric" class="atom6-scalar-input' + cls + '" data-qid="' + qid + '"' +
        ' data-scope="' + scope + '" data-index="' + index + '" data-field="' + field + '" value="' + atom6Escape(value ?? '') + '"' +
        ' min="' + min + '" max="' + max + '" aria-label="' + atom6Escape(label) + '"' + ((disabled || state === true) ? ' disabled' : '') + '>';
}

function atom6BlockSummary(block, label) {
    return '<div class="atom6-block-summary"><span>' + atom6Escape(label) + '</span><strong>' + block.network + '/' + block.cidr + '</strong>' +
        '<small>' + block.mask.join('.') + ' · Available IP: ' + block.availableIp + ' · Usable IP: ' + block.usableIp + '</small></div>';
}

function atom6BuildSerialLightningPath(x1, x2, baseY, centerY = baseY) {
    const pointX = ratio => x1 + (x2 - x1) * ratio;
    const stepHeight = Math.min(9, Math.max(6, Math.abs(x2 - x1) * 0.045));
    const lowerStepY = centerY + stepHeight / 2;
    const upperStepY = centerY - stepHeight / 2;
    return 'M ' + x1 + ' ' + baseY +
        ' L ' + pointX(0.50) + ' ' + lowerStepY +
        ' L ' + pointX(0.47) + ' ' + upperStepY +
        ' L ' + pointX(0.58) + ' ' + (upperStepY + 1) +
        ' L ' + x2 + ' ' + baseY;
}

function atom6BuildTopologyDiagram(scenario) {
    const siteWidth = 280;
    const siteGap = 38;
    const routerHalfWidth = 58;
    const canvasWidth = scenario.routers.length * siteWidth + Math.max(0, scenario.routers.length - 1) * siteGap;
    const routerCenterX = routerIndex => (siteWidth / 2) + routerIndex * (siteWidth + siteGap);
    const hasLoopClosingWan = scenario.wans.some(wan => {
        const fromIndex = scenario.routers.findIndex(router => router.id === wan.fromRouterId);
        const toIndex = scenario.routers.findIndex(router => router.id === wan.toRouterId);
        return Math.abs(fromIndex - toIndex) > 1;
    });
    const routerTop = hasLoopClosingWan ? 72 : 0;
    const baseY = routerTop + 36;
    const overlayHeight = routerTop + 110;
    const pairTotals = {};
    scenario.wans.forEach(wan => {
        const pair = [wan.fromRouterId, wan.toRouterId].sort().join('::');
        pairTotals[pair] = (pairTotals[pair] || 0) + 1;
    });
    const pairSeen = {};
    const wanPaths = scenario.wans.map(wan => {
        const fromIndex = scenario.routers.findIndex(router => router.id === wan.fromRouterId);
        const toIndex = scenario.routers.findIndex(router => router.id === wan.toRouterId);
        const pair = [wan.fromRouterId, wan.toRouterId].sort().join('::');
        const occurrence = pairSeen[pair] || 0;
        pairSeen[pair] = occurrence + 1;
        const totalForPair = pairTotals[pair];
        const fromCenter = routerCenterX(fromIndex);
        const toCenter = routerCenterX(toIndex);
        const direction = Math.sign(toCenter - fromCenter) || 1;
        const x1 = fromCenter + direction * routerHalfWidth;
        const x2 = toCenter - direction * routerHalfWidth;
        const midpoint = (x1 + x2) / 2;
        const distance = Math.abs(fromIndex - toIndex);
        let bend = 0;
        if (totalForPair > 1) bend = (occurrence - (totalForPair - 1) / 2) * 56;
        else if (distance > 1) bend = 2 * (32 - baseY);
        const controlY = baseY + bend;
        const labelY = Math.min(baseY, controlY - 9) - 5;
        return '<path class="atom6-wan-svg-path" d="' + atom6BuildSerialLightningPath(x1, x2, baseY, controlY) + '"></path>' +
            '<text class="atom6-wan-svg-label" x="' + midpoint + '" y="' + labelY + '" text-anchor="middle">WAN ' + wan.number + ' · Serial</text>';
    }).join('');

    const routerCards = scenario.routers.map(router => {
        const routerLans = scenario.lans.filter(lan => lan.routerId === router.id);
        const lanBranches = routerLans.map(lan =>
            '<div class="atom6-lan-branch atom6-readonly-lan-branch" data-lan-id="' + lan.id + '" aria-label="LAN ' + lan.number + ' topology">' +
                '<div class="atom6-device atom6-switch-device" data-lan-id="' + lan.id + '"><i class="fa-solid fa-network-wired" aria-hidden="true"></i><span>Switch</span></div>' +
                '<div class="atom6-device atom6-host-device" data-lan-id="' + lan.id + '"><i class="fa-solid fa-desktop" aria-hidden="true"></i><span>Host</span></div>' +
                '<div class="atom6-topology-lan-label"><strong>LAN ' + lan.number + '</strong><span>' + atom6Escape(lan.label) + '</span><small>' + lan.hosts + ' hosts required</small></div>' +
            '</div>'
        ).join('');
        return '<div class="atom6-topology-site atom6-readonly-site"><div class="atom6-device atom6-router-device" data-router-id="' + router.id + '"><i class="fa-solid fa-code-branch" aria-hidden="true"></i><span>Router ' + router.number + '</span></div>' +
            '<div class="atom6-lan-branches atom6-readonly-lan-branches' + (routerLans.length > 1 ? ' has-multiple' : '') + '">' + lanBranches + '</div></div>';
    }).join('');

    return '<section class="atom6-topology atom6-readonly-topology" aria-label="Network topology"><div class="atom6-topology-heading"><div><span>Scenario Map</span><h3>Network Topology</h3></div><small>Each router supports up to two LAN ports and two WAN ports. One host icon represents each LAN host requirement.</small></div>' +
        '<div class="atom6-topology-scroll"><div class="atom6-topology-canvas" style="width:' + canvasWidth + 'px"><svg class="atom6-wan-overlay" style="height:' + overlayHeight + 'px" viewBox="0 0 ' + canvasWidth + ' ' + overlayHeight + '" preserveAspectRatio="none" aria-label="Serial WAN connections">' + wanPaths + '</svg><div class="atom6-topology-router-row" style="padding-top:' + routerTop + 'px">' + routerCards + '</div></div></div></section>';
}

function atom6ScheduleTopologyConnections() {
    if (!atom6TopologyResizeBound) {
        atom6TopologyResizeBound = true;
        window.addEventListener('resize', atom6ScheduleTopologyConnections);
    }
    if (atom6TopologyFrame !== null) cancelAnimationFrame(atom6TopologyFrame);
    atom6TopologyFrame = requestAnimationFrame(() => {
        atom6TopologyFrame = requestAnimationFrame(() => {
            atom6TopologyFrame = null;
            atom6DrawTopologyConnections();
        });
    });
}

function atom6DrawTopologyConnections() {
    document.querySelectorAll('.atom6-readonly-topology .atom6-topology-canvas').forEach(canvas => {
        canvas.querySelector('.topology-physical-links')?.remove();
        if (canvas.offsetWidth === 0) return;
        const canvasRect = canvas.getBoundingClientRect();
        const width = canvas.offsetWidth;
        const height = Math.max(canvas.scrollHeight, canvas.offsetHeight);
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'topology-physical-links');
        svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
        svg.setAttribute('aria-hidden', 'true');
        const point = (element, edge, offsetX = 0) => {
            const rect = element.getBoundingClientRect();
            return {
                x: rect.left - canvasRect.left + rect.width / 2 + offsetX,
                y: (edge === 'top' ? rect.top : rect.bottom) - canvasRect.top
            };
        };
        const addPath = (start, end, className) => {
            const vertical = Math.max(24, (end.y - start.y) * 0.44);
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('class', 'topology-physical-link ' + className);
            path.setAttribute('d', 'M ' + start.x + ' ' + start.y + ' C ' + start.x + ' ' + (start.y + vertical) + ', ' + end.x + ' ' + (end.y - vertical) + ', ' + end.x + ' ' + end.y);
            svg.appendChild(path);
        };
        canvas.querySelectorAll('.atom6-readonly-site').forEach(site => {
            const router = site.querySelector('.atom6-router-device');
            const branches = [...site.querySelectorAll('.atom6-readonly-lan-branch')];
            branches.forEach((branch, branchIndex) => {
                const networkSwitch = branch.querySelector('.atom6-switch-device');
                const host = branch.querySelector('.atom6-host-device');
                if (!router || !networkSwitch || !host) return;
                const routerOffset = (branchIndex - (branches.length - 1) / 2) * 22;
                addPath(point(router, 'bottom', routerOffset), point(networkSwitch, 'top'), 'router-to-switch');
                addPath(point(networkSwitch, 'bottom'), point(host, 'top'), 'switch-to-host');
            });
        });
        canvas.prepend(svg);
    });
}

function atom6BuildScenarioBoard(scenario) {
    const lanCards = scenario.lans.map(lan => '<article class="atom6-requirement-card atom6-lan-card"><div class="atom6-requirement-type">LAN ' + lan.number + '</div><div class="atom6-requirement-name">' + atom6Escape(lan.label) + '</div><strong>' + lan.hosts + ' hosts</strong></article>');
    const wanCards = scenario.wans.map(wan => '<article class="atom6-requirement-card atom6-wan-card"><div class="atom6-requirement-type">WAN ' + wan.number + '</div><div class="atom6-requirement-name">Wide Area Network</div><strong>' + wan.requiredIp + ' usable IP' + (wan.requiredIp === 1 ? '' : 's') + '</strong></article>');
    return '<section class="atom6-scenario-board" aria-label="VLSM scenario"><div class="atom6-parent-network"><span><small>Primary allocation source</small>Parent Network</span><strong>' + scenario.parent.network + '/' + scenario.parent.cidr + '</strong></div>' +
        atom6BuildTopologyDiagram(scenario) + '<div class="atom6-requirements-heading"><span>Address Requirements</span><h3>LAN and WAN Requirements</h3></div>' +
        '<div class="atom6-requirement-grid">' + lanCards.concat(wanCards).join('') + '</div></section>';
}

function atom6BuildProgress(ex) {
    const state = ex.atom6State;
    const steps = [{ label: 'Priority', done: state.orderComplete }]
        .concat(atom6OrderedLans(ex).map((lan, i) => ({ label: 'LAN ' + (i + 1), done: state.completedLanCount > i })))
        .concat([{ label: 'WANs', done: state.wanComplete }]);
    let activeFound = false;
    return '<div class="atom6-progress" aria-label="Scenario progress">' + steps.map((step, i) => {
        const active = !step.done && !activeFound;
        if (active) activeFound = true;
        return '<div class="atom6-progress-step' + (step.done ? ' done' : '') + (active ? ' active' : '') + '"><span>' + (step.done ? '<i class="fa-solid fa-check"></i>' : (i + 1)) + '</span><small>' + step.label + '</small></div>';
    }).join('') + '</div>';
}

function atom6BuildOrdering(qid, ex) {
    const state = ex.atom6State;
    if (state.orderComplete) {
        return '<section class="atom6-stage atom6-stage-complete"><div class="atom6-stage-head"><span class="panel-index">01</span><div><h3>Allocation Priority</h3><p>LANs are ordered by host requirement. Equal LAN requirements may exchange positions, and WANs form the final equal-priority group.</p></div><i class="fa-solid fa-circle-check"></i></div></section>';
    }
    const rows = state.order.map((id, i) => {
        const item = atom6ItemById(ex.scenario, id);
        const requirement = item.type === 'lan' ? item.hosts + ' hosts' : item.requiredIp + ' usable IP' + (item.requiredIp === 1 ? '' : 's');
        const displayLabel = item.type === 'wan' ? item.label : 'LAN ' + item.number + ' · ' + item.label;
        return '<li class="atom6-order-item" data-item-id="' + item.id + '"><span class="atom6-order-position">' + (i + 1) + '</span><div><strong>' + atom6Escape(displayLabel) + '</strong><small>' + requirement + '</small></div>' +
            '<div class="atom6-order-actions"><button type="button" class="atom6-move-btn" data-qid="' + qid + '" data-index="' + i + '" data-direction="-1" aria-label="Move up"' + ((i === 0 || ex.locked) ? ' disabled' : '') + '><i class="fa-solid fa-arrow-up"></i></button>' +
            '<button type="button" class="atom6-move-btn" data-qid="' + qid + '" data-index="' + i + '" data-direction="1" aria-label="Move down"' + ((i === state.order.length - 1 || ex.locked) ? ' disabled' : '') + '><i class="fa-solid fa-arrow-down"></i></button></div></li>';
    }).join('');
    return '<section class="atom6-stage"><div class="atom6-stage-head"><span class="panel-index">01</span><div><h3>Arrange Allocation Priority</h3><p>Place LANs from largest to smallest. LANs with the same host requirement may exchange positions. Keep all WANs last; their relative order does not matter.</p></div></div>' +
        '<ol class="atom6-order-list">' + rows + '</ol><div class="atom6-stage-actions"><button type="button" class="primary-btn atom6-check-order" data-qid="' + qid + '"' + (ex.locked ? ' disabled' : '') + '>Check Priority</button>' +
        '<div class="atom6-inline-feedback ' + (state.orderFeedback ? 'incorrect' : '') + '" role="status">' + atom6Escape(state.orderFeedback) + '</div></div></section>';
}

function atom6AllocationTable(qid, scope, index, inputs, feedback, block, linkLabels, disabled) {
    const rows = [
        ['Network ID', 'network'], ['First Usable IP', 'first'], ['Last Usable IP', 'last'], ['Broadcast IP', 'broadcast']
    ];
    return '<div class="table-scroll"><table class="data-table atom6-address-table"><thead><tr><th>Address</th><th>Student Answer</th></tr></thead><tbody>' + rows.map(row => {
        const label = linkLabels?.[row[1]] || row[0];
        return '<tr><th scope="row">' + atom6Escape(label) + '</th><td>' + atom6IpInput(qid, scope, index, row[1], inputs[row[1]], feedback, disabled, label) + '</td></tr>';
    }).join('') + '</tbody></table></div>';
}

function atom6BuildCompletedLans(ex) {
    if (!ex.atom6State.completedLanCount) return '';
    const orderedLans = atom6OrderedLans(ex);
    const rows = ex.scenario.solution.lanAllocations.slice(0, ex.atom6State.completedLanCount).map((allocation, i) => {
        const lan = orderedLans[i];
        return '<tr><td>' + (i + 1) + '</td><td><strong>LAN ' + lan.number + ' · ' + atom6Escape(lan.label) + '</strong><small>' + lan.hosts + ' hosts</small></td><td>' + allocation.assigned.network + '/' + allocation.assigned.cidr + '</td><td>' + allocation.assigned.first + '</td><td>' + allocation.assigned.last + '</td><td>' + allocation.assigned.broadcast + '</td></tr>';
    }).join('');
    return '<section class="atom6-completed-plan"><h3>Completed LAN Allocations</h3><div class="table-scroll"><table class="data-table"><thead><tr><th>#</th><th>LAN</th><th>Network</th><th>First Usable</th><th>Last Usable</th><th>Broadcast</th></tr></thead><tbody>' + rows + '</tbody></table></div></section>';
}

function atom6BuildCurrentLan(qid, ex) {
    const state = ex.atom6State;
    if (!state.orderComplete || state.completedLanCount >= ex.scenario.solution.lanAllocations.length) return '';
    const i = state.completedLanCount;
    const allocation = ex.scenario.solution.lanAllocations[i];
    const lan = atom6OrderedLans(ex)[i];
    const inputs = state.lanInputs[i];
    const feedback = state.lanFeedback[i] || {};
    return '<section class="atom6-stage atom6-allocation-stage"><div class="atom6-stage-head"><span class="panel-index">' + String(i + 2).padStart(2, '0') + '</span><div><h3>Allocate LAN ' + lan.number + ' · ' + atom6Escape(lan.label) + '</h3><p>' + lan.hosts + ' hosts</p></div><span class="badge">LAN allocation ' + (i + 1) + ' of ' + ex.scenario.lans.length + '</span></div>' +
        atom6BlockSummary(allocation.source, 'Current source subnet') +
        '<div class="atom6-parameter-grid"><label><span>New CIDR</span><div class="atom6-cidr-input"><span>/</span>' + atom6ScalarInput(qid, 'lan', i, 'cidr', inputs.cidr, feedback.cidr, ex.locked, 'New CIDR', allocation.source.cidr, 30) + '</div></label>' +
        '<label><span>Subnet Mask</span>' + atom6IpInput(qid, 'lan', i, 'mask', inputs.mask, feedback, ex.locked, 'Subnet Mask') + '</label></div>' +
        atom6AllocationTable(qid, 'lan', i, inputs, feedback, allocation.assigned, null, ex.locked) +
        '<div class="atom6-stage-actions"><button type="button" class="primary-btn atom6-check-lan" data-qid="' + qid + '" data-index="' + i + '"' + (ex.locked ? ' disabled' : '') + '>Check LAN Allocation</button><div class="atom6-inline-feedback" role="status">' + atom6Escape(state.message) + '</div></div></section>';
}

function atom6BuildAvailablePool(ex) {
    const state = ex.atom6State;
    if (!state.orderComplete || state.completedLanCount === 0 || state.wanComplete) return '';
    const lastIndex = state.completedLanCount - 1;
    const pool = ex.scenario.solution.lanAllocations[lastIndex].poolAfter;
    return '<details class="atom6-pool"><summary>Available Subnets <span>' + pool.length + '</span></summary><div class="atom6-pool-grid">' + pool.slice(0, 12).map(block => atom6BlockSummary(block, 'Available')).join('') + (pool.length > 12 ? '<p>+' + (pool.length - 12) + ' additional available subnets</p>' : '') + '</div></details>';
}

function atom6BuildWan(qid, ex) {
    const state = ex.atom6State;
    if (!state.orderComplete || state.completedLanCount < ex.scenario.lans.length) return '';
    const wan = ex.scenario.solution.wan;
    if (state.wanComplete) {
        const rows = wan.assignments.map((assignment, i) => {
            const wanRequirement = ex.scenario.wans[i];
            const assignedIndex = Number.isInteger(state.wanAssignmentIndices?.[i]) ? state.wanAssignmentIndices[i] : i;
            const block = wan.assignments[assignedIndex]?.block || assignment.block;
            return '<tr><td>' + atom6Escape(wanRequirement.label) + '</td><td>' + block.network + '/' + block.cidr + '</td><td>' + block.first + '</td><td>' + block.last + '</td><td>' + block.broadcast + '</td></tr>';
        }).join('');
        return '<section class="atom6-stage atom6-stage-complete"><div class="atom6-stage-head"><span class="panel-index"><i class="fa-solid fa-check"></i></span><div><h3>WAN Allocations Complete</h3><p>Each WAN is a separate network allocated from the first remaining subnet that can supply the complete WAN set.</p></div></div><div class="table-scroll"><table class="data-table"><thead><tr><th>WAN</th><th>Network</th><th>First Usable IP</th><th>Last Usable IP</th><th>Broadcast</th></tr></thead><tbody>' + rows + '</tbody></table></div></section>';
    }
    const inputs = state.wanInputs;
    const feedback = state.wanFeedback || {};
    const linkRows = ex.scenario.wans.map((wanRequirement, i) => {
        const linkFeedback = feedback.links?.[i] || {};
        return '<article class="atom6-link-allocation"><h4>' + atom6Escape(wanRequirement.label) + ' <small>' + wanRequirement.requiredIp + ' usable IP' + (wanRequirement.requiredIp === 1 ? '' : 's') + '</small></h4>' + atom6AllocationTable(qid, 'wan-link', i, inputs.links[i], linkFeedback, wan.assignments[i].block, null, ex.locked) + '</article>';
    }).join('');
    return '<section class="atom6-stage atom6-allocation-stage"><div class="atom6-stage-head"><span class="panel-index">' + String(ex.scenario.lans.length + 2).padStart(2, '0') + '</span><div><h3>Allocate WANs</h3><p>Use the first remaining subnet that can produce all ' + wan.requiredBlockCount + ' required /' + ex.scenario.wans[0].requiredCidr + ' WAN networks.</p></div><span class="badge">' + ex.scenario.wans.length + ' WAN' + (ex.scenario.wans.length === 1 ? '' : 's') + '</span></div>' +
        atom6BlockSummary(wan.source, 'Shared WAN source') +
        '<div class="atom6-parameter-grid"><label><span>WAN CIDR</span><div class="atom6-cidr-input"><span>/</span>' + atom6ScalarInput(qid, 'wan', 0, 'cidr', inputs.cidr, feedback.cidr, ex.locked, 'WAN CIDR', wan.source.cidr, 30) + '</div></label>' +
        '<label><span>Subnet Mask</span>' + atom6IpInput(qid, 'wan', 0, 'mask', inputs.mask, feedback, ex.locked, 'Subnet Mask') + '</label></div>' + linkRows +
        '<div class="atom6-stage-actions"><button type="button" class="primary-btn atom6-check-wan" data-qid="' + qid + '"' + (ex.locked ? ' disabled' : '') + '>Check WAN Allocations</button><div class="atom6-inline-feedback" role="status">' + atom6Escape(state.message) + '</div></div></section>';
}

function atom6BuildFinalReview(qid, ex) {
    if (!ex.atom6State.wanComplete) return '';
    const pool = ex.scenario.solution.wan.poolAfter;
    return '<section class="atom6-final-review"><div class="atom6-complete-icon"><i class="fa-solid fa-trophy"></i></div><div><h3>VLSM Plan Complete</h3><p>All LANs and WANs fit inside ' + ex.scenario.parent.network + '/' + ex.scenario.parent.cidr + '.</p></div>' +
        '<details class="atom6-pool"><summary>Remaining Unallocated Subnets <span>' + pool.length + '</span></summary><div class="atom6-pool-grid">' + pool.slice(0, 16).map(block => atom6BlockSummary(block, 'Unallocated')).join('') + '</div></details>' +
        (isRetryAllowed() ? '<button type="button" class="secondary-btn atom6-reset" data-qid="' + qid + '"><i class="fa-solid fa-rotate-left"></i> Reset Scenario</button>' : '') + '</section>';
}

function buildAtom6PanelHtml(qid, ex, index) {
    ex.atom6State = ex.atom6State || atom6RestoreState(ex);
    const score = Number(ex.score || 0);
    return '<section class="panel atom1-q-panel atom6-q-panel' + (ex.locked ? ' correct' : '') + '" id="atom6QPanel-' + qid + '" data-qid="' + qid + '">' +
        '<div class="panel-head"><span class="panel-index">Q' + index + '</span><div><h2>' + atom6Escape(ex.scenario.levelLabel) + ' VLSM Scenario</h2><p>' + ex.scenario.lans.length + ' LANs · ' + ex.scenario.wans.length + ' WAN' + (ex.scenario.wans.length === 1 ? '' : 's') + '</p></div><span class="badge atom1-score-badge' + (ex.locked ? ' completed-score' : '') + '" id="atom6ScoreBadge-' + qid + '">' + score + '/' + ex.answers.length + '</span></div>' +
        atom6BuildProgress(ex) + atom6BuildScenarioBoard(ex.scenario) + atom6BuildOrdering(qid, ex) + atom6BuildCompletedLans(ex) + atom6BuildCurrentLan(qid, ex) + atom6BuildAvailablePool(ex) + atom6BuildWan(qid, ex) + atom6BuildFinalReview(qid, ex) + '</section>';
}

function renderAtom6View(atom6List) {
    const container = document.getElementById('atom6QuestionsContainer');
    const nav = document.getElementById('nav-atom6');
    const enabled = !!(QUESTION_CONFIG.atom6?.enabled && atom6List.length);
    if (nav) nav.style.display = enabled ? '' : 'none';
    if (!container) return;
    atom6QuestionIds = atom6List.map(item => item.name);
    if (!enabled) {
        container.innerHTML = '';
        return;
    }
    container.innerHTML = atom6QuestionIds.map((qid, i) => buildAtom6PanelHtml(qid, exerciseData[qid], i + 1)).join('');
    if (!atom6ActionsDelegated) {
        atom6ActionsDelegated = true;
        container.addEventListener('input', atom6HandleInput);
        container.addEventListener('click', atom6HandleClick);
    }
    attachAtomPaginationHandlers();
    initAtomPagination('atom6');
    atom6ScheduleTopologyConnections();
}

function atom6Rerender(qid) {
    const panel = document.getElementById('atom6QPanel-' + qid);
    const ex = exerciseData[qid];
    if (!panel || !ex) return;
    const index = atom6QuestionIds.indexOf(qid);
    panel.outerHTML = buildAtom6PanelHtml(qid, ex, index + 1);
    atom6ScheduleTopologyConnections();
    updateAtom6NavScore();
    updateSummaryPanel();
}

function atom6HandleInput(e) {
    const input = e.target.closest('[data-qid][data-scope][data-field]');
    if (!input) return;
    const ex = exerciseData[input.dataset.qid];
    if (!ex || ex.locked) return;
    const state = ex.atom6State;
    const index = Number(input.dataset.index || 0);
    const oct = input.dataset.oct !== undefined ? Number(input.dataset.oct) : null;
    let target;
    if (input.dataset.scope === 'lan') target = state.lanInputs[index];
    else if (input.dataset.scope === 'wan') target = state.wanInputs;
    else if (input.dataset.scope === 'wan-link') target = state.wanInputs.links[index];
    if (!target) return;
    if (oct === null) target[input.dataset.field] = input.value;
    else target[input.dataset.field][oct] = input.value;
    atom6SaveState(input.dataset.qid);
}

function atom6HandleClick(e) {
    const move = e.target.closest('.atom6-move-btn');
    if (move && !move.disabled) {
        const ex = exerciseData[move.dataset.qid];
        if (!ex || ex.locked) return;
        const from = Number(move.dataset.index);
        const to = from + Number(move.dataset.direction);
        if (ex && to >= 0 && to < ex.atom6State.order.length) {
            [ex.atom6State.order[from], ex.atom6State.order[to]] = [ex.atom6State.order[to], ex.atom6State.order[from]];
            ex.atom6State.orderFeedback = '';
            atom6SaveState(move.dataset.qid);
            atom6Rerender(move.dataset.qid);
        }
        return;
    }
    const orderBtn = e.target.closest('.atom6-check-order');
    if (orderBtn) { atom6CheckOrder(orderBtn.dataset.qid); return; }
    const lanBtn = e.target.closest('.atom6-check-lan');
    if (lanBtn) { atom6CheckLan(lanBtn.dataset.qid, Number(lanBtn.dataset.index)); return; }
    const wanBtn = e.target.closest('.atom6-check-wan');
    if (wanBtn) { atom6CheckWan(wanBtn.dataset.qid); return; }
    const resetBtn = e.target.closest('.atom6-reset');
    if (resetBtn) atom6ResetScenario(resetBtn.dataset.qid);
}

function atom6CheckOrder(qid) {
    const ex = exerciseData[qid];
    if (!ex || ex.locked || ex.atom6State.orderComplete) return;
    if (!atom6ValidateOrder(ex.scenario, ex.atom6State.order)) {
        ex.atom6State.orderFeedback = 'Arrange LANs from largest to smallest, followed by every WAN.';
    } else {
        ex.atom6State.orderComplete = true;
        ex.atom6State.allocationLanIds = ex.atom6State.order.filter(id => ex.scenario.lans.some(lan => lan.id === id));
        ex.atom6State.orderFeedback = '';
        ex.atom6State.message = 'Priority confirmed. The first LAN allocation is now available.';
        ex.score = 1;
    }
    atom6SaveState(qid);
    atom6Rerender(qid);
}

function atom6CheckLan(qid, index) {
    const ex = exerciseData[qid];
    if (!ex || ex.locked || index !== ex.atom6State.completedLanCount) return;
    const input = ex.atom6State.lanInputs[index];
    const correct = ex.scenario.solution.lanAllocations[index].assigned;
    const feedback = {};
    feedback.cidr = Number(input.cidr) === correct.cidr;
    ['mask', 'network', 'first', 'last', 'broadcast'].forEach(field => {
        const expected = field === 'mask' ? correct.mask : correct[field];
        feedback[field] = atom6CheckOctets(input[field], expected).result;
    });
    ex.atom6State.lanFeedback[index] = feedback;
    const allCorrect = feedback.cidr && ['mask', 'network', 'first', 'last', 'broadcast'].every(field => feedback[field].every(Boolean));
    if (allCorrect) {
        ex.atom6State.completedLanCount++;
        ex.score = 1 + ex.atom6State.completedLanCount;
        ex.atom6State.message = ex.atom6State.completedLanCount < ex.scenario.lans.length ? 'Correct. The next LAN source subnet is now available.' : 'All LANs are complete. Allocate the WANs from their shared source subnet.';
        triggerConfetti();
    } else {
        ex.atom6State.message = 'Review the highlighted values. Correct values are locked.';
    }
    atom6SaveState(qid);
    atom6Rerender(qid);
}

function atom6CheckWan(qid) {
    const ex = exerciseData[qid];
    if (!ex || ex.locked || ex.atom6State.wanComplete) return;
    const input = ex.atom6State.wanInputs;
    const wan = ex.scenario.solution.wan;
    const expectedCidr = Number(QUESTION_CONFIG.atom6.wanRequirement.allocationCidr);
    const feedback = { cidr: Number(input.cidr) === expectedCidr };
    feedback.mask = atom6CheckOctets(input.mask, atom6MaskOctets(expectedCidr)).result;
    const expectedBlocks = wan.assignments.map(assignment => assignment.block);
    const acceptEquivalentOrder = QUESTION_CONFIG.atom6.allocation?.acceptEquivalentLinkOrder !== false;
    const fullMatchIndex = linkInput => expectedBlocks.findIndex(block => ['network', 'first', 'last', 'broadcast'].every(field => atom6CheckOctets(linkInput[field], block[field]).result.every(Boolean)));
    const assignmentIndices = input.links.map((linkInput, i) => acceptEquivalentOrder ? fullMatchIndex(linkInput) : i);
    const usedAssignmentIndices = new Set();
    const duplicateRows = new Set();
    if (acceptEquivalentOrder) assignmentIndices.forEach((assignmentIndex, rowIndex) => {
        if (assignmentIndex < 0) return;
        if (usedAssignmentIndices.has(assignmentIndex)) duplicateRows.add(rowIndex);
        else usedAssignmentIndices.add(assignmentIndex);
    });
    feedback.links = input.links.map((linkInput, i) => {
        const enteredNetwork = atom8ParseIp((linkInput.network || []).join('.'))?.text;
        const networkMatchIndex = expectedBlocks.findIndex(block => block.network === enteredNetwork);
        const preferredIndex = acceptEquivalentOrder && networkMatchIndex >= 0 && !duplicateRows.has(i) ? networkMatchIndex : i;
        const block = expectedBlocks[preferredIndex];
        const result = {};
        ['network', 'first', 'last', 'broadcast'].forEach(field => result[field] = atom6CheckOctets(linkInput[field], block[field]).result);
        return result;
    });
    ex.atom6State.wanFeedback = feedback;
    const linksCorrect = acceptEquivalentOrder ?
        assignmentIndices.every(index => index >= 0) && new Set(assignmentIndices).size === expectedBlocks.length :
        feedback.links.every(link => ['network', 'first', 'last', 'broadcast'].every(field => link[field].every(Boolean)));
    const allCorrect = feedback.cidr && feedback.mask.every(Boolean) && linksCorrect;
    if (allCorrect) {
        ex.atom6State.wanAssignmentIndices = assignmentIndices;
        ex.atom6State.wanComplete = true;
        ex.atom6State.message = 'VLSM plan complete.';
        ex.score = ex.answers.length;
        ex.locked = true;
        ex.isPartial = false;
        triggerBigConfetti();
    } else {
        ex.atom6State.message = 'Review the highlighted WAN values. Correct values are locked.';
    }
    atom6SaveState(qid);
    atom6Rerender(qid);
    if (allCorrect && appSettings.mode === 'exam') {
        saveTimerProgress();
        if (checkIfAllAnswered()) {
            stopTimer();
            setTimeout(() => showScoreSummaryModal('Congratulations! All VLSM scenarios are complete.', 'success'), 500);
        }
    }
}

function atom6ResetScenario(qid) {
    if (!isRetryAllowed()) return;
    const ex = exerciseData[qid];
    if (!ex) return;
    ex.atom6State = atom6InitialState(ex.scenario);
    ex.userAnswer = '';
    ex.score = 0;
    ex.isPartial = false;
    ex.locked = false;
    atom6Rerender(qid);
    saveSessionProgress();
}

function updateAtom6NavScore() {
    const scoreEl = document.getElementById('score-atom6');
    if (!scoreEl) return;
    let got = 0;
    let total = 0;
    for (const qid of atom6QuestionIds) {
        const ex = exerciseData[qid];
        if (!ex) continue;
        got += Number(ex.score || 0);
        total += ex.answers.length;
    }
    scoreEl.textContent = got + '/' + total;
    scoreEl.classList.remove('completed-score', 'partial-score');
    if (total && got === total) scoreEl.classList.add('completed-score');
    else if (got) scoreEl.classList.add('partial-score');
}

function syncAtom6ViewDOM() {
    atom6QuestionIds.forEach(qid => {
        const ex = exerciseData[qid];
        if (!ex) return;
        ex.atom6State = atom6RestoreState(ex);
    });
    const container = document.getElementById('atom6QuestionsContainer');
    if (container) container.innerHTML = atom6QuestionIds.map((qid, i) => buildAtom6PanelHtml(qid, exerciseData[qid], i + 1)).join('');
    const currentPage = ATOM_PAGINATION.atom6 ? ATOM_PAGINATION.atom6.current : 0;
    showAtomQuestion('atom6', currentPage, { scroll: false });
    atom6ScheduleTopologyConnections();
    updateAtom6NavScore();
    updateSummaryPanel();
}

function showAtom6Page() {
    if (!QUESTION_CONFIG.atom6?.enabled || !atom6QuestionIds.length) return;
    document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
    document.getElementById('nav-atom6')?.classList.add('active');
    ['exerciseArea', 'subnetVisualizerView', 'atomPlaceholderView', 'atom1View', 'atom2View', 'atom3View', 'atom4View', 'atom5View', 'atom7View', 'atom8View', 'atom9View'].forEach(id => {
        const view = document.getElementById(id);
        if (view) view.style.display = 'none';
    });
    document.getElementById('atom6View').style.display = 'flex';
    atom6ScheduleTopologyConnections();
    document.getElementById('timerContainer').style.display = timerIntervalId ? 'flex' : 'none';
    showAtomPaginationBar('atom6');
    currentFile = '';
    closeSampleOutputModal();
    updateConsoleDrawerTab(false);
    closeSidebarIfMobile();
}

/* =========================================================
   ATOM 7: PACKET TRACER DESIGN BRIEF
   One persistent, seeded, read-only requirement. No exerciseData entry,
   input controls, grading state, score, or pagination is created here.
========================================================= */
function atom7BuildBrief(scenario) {
    if (!scenario) return '';
    const cfg = QUESTION_CONFIG.atom7;
    const brief = cfg.brief || {};
    const deliverables = Array.isArray(brief.deliverables) ? brief.deliverables : [];
    return '<section class="panel atom7-brief-panel" aria-label="Packet Tracer activity requirement">' +
        '<div class="atom7-brief-heading"><div><span>Independent Performance Task</span>' +
        '<h2>' + atom6Escape(brief.title || 'Plan and Implement This Network') + '</h2>' +
        '<p>' + atom6Escape(brief.description || '') + '</p></div>' +
        '<span class="atom7-readonly-badge"><i class="fa-solid fa-eye" aria-hidden="true"></i> Read-only · Ungraded</span></div>' +
        atom6BuildScenarioBoard(scenario) +
        (deliverables.length ? '<div class="atom7-deliverables"><h3>Required Output</h3><ul>' + deliverables.map(item =>
            '<li><i class="fa-solid fa-circle-check" aria-hidden="true"></i><span>' + atom6Escape(item) + '</span></li>'
        ).join('') + '</ul></div>' : '') +
        '</section>';
}

function renderAtom7View(scenario) {
    const view = document.getElementById('atom7View');
    const container = document.getElementById('atom7RequirementContainer');
    const nav = document.getElementById('nav-atom7');
    const enabled = !!(QUESTION_CONFIG.atom7?.enabled && scenario);
    if (nav) nav.style.display = enabled ? '' : 'none';
    if (container) container.innerHTML = enabled ? atom7BuildBrief(scenario) : '';
    if (enabled) atom6ScheduleTopologyConnections();
    if (!enabled && view) view.style.display = 'none';
}

function showAtom7Page() {
    if (!QUESTION_CONFIG.atom7?.enabled || !atom7Scenario) return;
    document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
    document.getElementById('nav-atom7')?.classList.add('active');
    ['exerciseArea', 'subnetVisualizerView', 'atomPlaceholderView', 'atom1View', 'atom2View', 'atom3View', 'atom4View', 'atom5View', 'atom6View', 'atom8View', 'atom9View'].forEach(id => {
        const view = document.getElementById(id);
        if (view) view.style.display = 'none';
    });
    document.getElementById('atom7View').style.display = 'flex';
    atom6ScheduleTopologyConnections();
    document.getElementById('timerContainer').style.display = timerIntervalId ? 'flex' : 'none';
    hideAllAtomPaginationBars();
    currentFile = '';
    closeSampleOutputModal();
    updateConsoleDrawerTab(false);
    closeSidebarIfMobile();
}

/* =========================================================
   ATOM 8: IN-APP VLSM DEPLOYMENT
========================================================= */
let atom8HandlersAttached = false;
let atom8ConnectionResizeBound = false;
let atom8ConnectionFrame = null;
let atom8PingRunId = 0;
let atom8PingAnimation = null;
const atom8PingState = {
    active: false,
    mode: null,
    caseId: null,
    sourceId: null,
    destinationId: null,
    running: false,
    paused: false,
    stopRequested: false,
    phase: 'idle',
    outcome: null,
    message: 'Select Test Connection to begin.'
};
let atom8OfficialRunAllActive = false;
let atom8SelfRunAllActive = false;
let atom8RestartRequest = null;
let atom8WorkspaceMode = 'configure';
let atom8RenderedWorkspaceMode = 'configure';
const atom8ListScrollByMode = { 'self-test': 0, official: 0 };
const atom8TopologyPanByMode = {
    configure: { x: 0, y: 0 },
    'self-test': { x: 0, y: 0 },
    official: { x: 0, y: 0 }
};
let atom8TopologyPanState = null;
let atom8TopologyZoom = Number(QUESTION_CONFIG.atom8.topologyView?.defaultZoom) || 1;

function atom8CurrentExercise() {
    return exerciseData[activeDeploymentExerciseKey] || null;
}

function atom8CurrentContainer() {
    return document.getElementById(activeDeploymentExerciseKey.startsWith('atom9-') ? 'atom9Container' : 'atom8Container');
}

function atom8CurrentContainerSelector() {
    return activeDeploymentExerciseKey.startsWith('atom9-') ? '#atom9Container' : '#atom8Container';
}

// Per-atom feature flags for the shared Atom 8 / Atom 9 workspace. Each atom
// reads ONLY its own config block, so enabling a utility for one atom never
// leaks into the other.
function atom8ConfigKey(ex) {
    return ex && ex.type === 'atom9' ? 'atom9' : 'atom8';
}

function atom8AnswerKeyEnabled(ex = atom8CurrentExercise()) {
    return !!QUESTION_CONFIG[atom8ConfigKey(ex)]?.answerKey?.showPopulateButton;
}

function atom8SubnetDiagramEnabled(ex = atom8CurrentExercise()) {
    const cfg = QUESTION_CONFIG[atom8ConfigKey(ex)]?.subnetDiagram;
    if (!cfg?.enabled || !ex?.scenario?.solution) return false;
    return appSettings.mode !== 'exam' || cfg.showInExam === true;
}

function atom8OfficialCases(ex = atom8CurrentExercise()) {
    const suite = QUESTION_CONFIG.atom8.connectivityTest?.officialTestCases;
    if (!suite?.enabled) return [];
    const persisted = ex?.atom8State?.officialTests?.cases;
    const fallback = ex?.generatedOfficialCases || atom8GeneratedOfficialCases;
    // Every Atom 9 item owns a topology-specific suite. Never allow a state
    // reset from the shared Atom 8 engine to substitute another item's cases.
    const cases = ex?.type === 'atom9'
        ? fallback
        : (Array.isArray(persisted) && persisted.length ? persisted : fallback);
    return cases.filter(testCase => testCase && testCase.id && Number(testCase.points) > 0);
}

function atom8InitialOfficialTests(cases = atom8GeneratedOfficialCases) {
    return {
        message: 'Official tests have not been run for this configuration.',
        cases: cases.map(testCase => ({ ...testCase, source: { ...testCase.source }, destination: { ...testCase.destination } })),
        results: Object.fromEntries(cases.map(testCase => [testCase.id, {
            status: 'gray', message: 'Not tested'
        }]))
    };
}

function atom8GenerateOfficialCases(scenario, model, seedStr) {
    const cfg = QUESTION_CONFIG.atom8.connectivityTest?.officialTestCases;
    if (!cfg?.enabled || !scenario || !model) return [];
    const generation = cfg.generation || {};
    const rng = mulberry32(hashStringToSeed(String(seedStr || '') + '::atom8-tests::' + String(cfg.seedSalt || '')));
    const points = Math.max(1, Number(cfg.pointsPerCase) || 1);
    const lans = [...scenario.lans].sort((a, b) => a.number - b.number);
    const hostsFor = lan => model.hosts.filter(host => host.lanId === lan.id).sort((a, b) => a.number - b.number);
    const pickHostNumber = (lan, excluded = null) => {
        const candidates = hostsFor(lan).filter(host => host.number !== excluded);
        if (!candidates.length) return null;
        if (cfg.randomizeRepresentativeHosts === false) return candidates[0].number;
        return candidates[randInt(rng, 0, candidates.length - 1)].number;
    };
    const orient = (lanA, lanB) => cfg.randomizeDirection !== false && rng() < 0.5 ? [lanB, lanA] : [lanA, lanB];
    const makeCase = (category, lanA, lanB, label) => {
        const [sourceLan, destinationLan] = orient(lanA, lanB);
        const sourceHost = pickHostNumber(sourceLan);
        const destinationHost = pickHostNumber(destinationLan, sourceLan.id === destinationLan.id ? sourceHost : null);
        if (sourceHost === null || destinationHost === null) return null;
        const pairKey = lanA.id === lanB.id ? 'lan' + lanA.number : 'lan' + Math.min(lanA.number, lanB.number) + '-lan' + Math.max(lanA.number, lanB.number);
        return {
            id: category + '-' + pairKey,
            category,
            label,
            source: { lan: sourceLan.number, host: sourceHost },
            destination: { lan: destinationLan.number, host: destinationHost },
            points
        };
    };
    const cases = [];
    if (generation.oneCasePerLan !== false) {
        lans.forEach(lan => {
            const testCase = makeCase('same-lan', lan, lan, 'Same LAN · LAN ' + lan.number);
            if (testCase) cases.push(testCase);
        });
    }
    if (generation.allSameRouterLanPairs !== false) {
        scenario.routers.forEach(router => {
            const routerLans = lans.filter(lan => lan.routerId === router.id);
            for (let i = 0; i < routerLans.length; i++) {
                for (let j = i + 1; j < routerLans.length; j++) {
                    const testCase = makeCase('same-router', routerLans[i], routerLans[j], 'Same router · LAN ' + routerLans[i].number + ' ↔ LAN ' + routerLans[j].number);
                    if (testCase) cases.push(testCase);
                }
            }
        });
    }
    if (generation.allDifferentRouterLanPairs !== false) {
        for (let i = 0; i < lans.length; i++) {
            for (let j = i + 1; j < lans.length; j++) {
                if (lans[i].routerId === lans[j].routerId) continue;
                const testCase = makeCase('different-router', lans[i], lans[j], 'Different routers · LAN ' + lans[i].number + ' ↔ LAN ' + lans[j].number);
                if (testCase) cases.push(testCase);
            }
        }
    }
    return cases;
}

function atom8BuildModel(scenario, seedStr) {
    const cfg = QUESTION_CONFIG.atom8;
    const rng = mulberry32(hashStringToSeed(String(seedStr || '') + '::atom8-devices'));
    const routers = scenario.routers.map((router, routerIndex) => {
        const lanPorts = router.lanIds.map((lanId, i) => {
            const name = cfg.lanInterfaceNames[routerIndex]?.[i] || ('GigabitEthernet0/' + i);
            return {
                id: 'lan-port-' + (i + 1), role: 'lan', targetId: lanId,
                name,
                shortName: cfg.lanInterfaceShortNames[routerIndex]?.[i] || ('Ga0/' + i),
                dce: false
            };
        });
        const wanPorts = router.wanIds.map((wanId, i) => {
            const wan = scenario.wans.find(item => item.id === wanId);
            const name = cfg.wanInterfaceNames[routerIndex]?.[i] || ('Serial0/0/' + i);
            const configuredDceRouter = Number(cfg.dceRouterByWan?.[wan.number - 1]);
            return {
                id: 'wan-port-' + (i + 1), role: 'wan', targetId: wanId,
                name,
                shortName: cfg.wanInterfaceShortNames[routerIndex]?.[i] || ('Se0/0/' + i),
                dce: Number.isFinite(configuredDceRouter) && configuredDceRouter > 0
                    ? configuredDceRouter === router.number
                    : wan.fromRouterId === router.id
            };
        });
        return {
            id: router.id, number: router.number, ports: [...lanPorts, ...wanPorts],
            routeCount: scenario.lans.filter(lan => lan.routerId !== router.id).length
        };
    });
    const hosts = scenario.lans.flatMap(lan => {
        const count = randInt(rng, Number(cfg.representativeHosts.min), Number(cfg.representativeHosts.max));
        return Array.from({ length: count }, (_, i) => ({
            id: lan.id + '-host-' + (i + 1), number: i + 1, lanId: lan.id,
            label: 'PC ' + lan.number + '-' + (i + 1)
        }));
    });
    return { routers, hosts };
}

function atom8InitialState(model, officialCases = atom8GeneratedOfficialCases) {
    const initialRouteEntries = Math.max(1, Number(QUESTION_CONFIG.atom8.initialRouteEntries) || 1);
    const maxRouteEntries = Math.max(1, Number(QUESTION_CONFIG.atom8.maxStaticRoutesPerRouter) || 1);
    const routers = {};
    model.routers.forEach(router => {
        routers[router.id] = {
            applied: false, locked: false,
            ports: Object.fromEntries(router.ports.map(port => [port.id, {
                ip: '', mask: '', enabled: false, clockRate: port.dce ? '' : null
            }])),
            routes: Array.from({ length: Math.min(initialRouteEntries, maxRouteEntries) }, () => ({ destination: '', mask: '', nextHop: '' }))
        };
    });
    const hosts = Object.fromEntries(model.hosts.map(host => [host.id, {
        ip: '', mask: '', gateway: '', applied: false, locked: false
    }]));
    return {
        routers,
        hosts,
        connectivityTest: {
            speed: Number(QUESTION_CONFIG.atom8.connectivityTest?.defaultSpeed) || 1,
            autoSend: QUESTION_CONFIG.atom8.connectivityTest?.autoSendDefault !== false,
            pairs: []
        },
        officialTests: atom8InitialOfficialTests(officialCases),
        validation: { ports: {}, hosts: {}, routers: {}, routes: {} }
    };
}

function atom8PossibleScore(cases = atom8GeneratedOfficialCases) {
    return cases.reduce((sum, testCase) => sum + Number(testCase.points), 0);
}

function atom8BuildExerciseData(scenario, model, officialCases = atom8GeneratedOfficialCases, options = {}) {
    const possible = atom8PossibleScore(officialCases);
    const atom8State = atom8InitialState(model, officialCases);
    return {
        type: options.type || 'atom8', label: options.label || 'Atom 8 · In-App Deployment', phase: options.phase || 'Atom 8 · In-App Deployment',
        scenario, model, answers: Array.from({ length: possible }, () => 'valid'),
        score: 0, locked: false, isPartial: false, isConversionQuestion: true,
        userAnswer: JSON.stringify(atom8State), atom8State,
        generatedOfficialCases: options.generatedOfficialCases || officialCases
    };
}

function atom8RestoreState(ex) {
    const generatedCases = ex?.generatedOfficialCases || atom8GeneratedOfficialCases;
    if (!ex?.userAnswer) return ex?.atom8State || atom8InitialState(ex.model, generatedCases);
    try {
        const restored = JSON.parse(ex.userAnswer);
        ex.model.routers.forEach(router => {
            const routerState = restored.routers?.[router.id];
            if (!routerState) return;
            const routes = Array.isArray(routerState.routes) ? routerState.routes : [];
            const hasRouteInput = routes.some(route => route.destination || route.mask || route.nextHop);
            if (!hasRouteInput) routerState.routes = [{ destination: '', mask: '', nextHop: '' }];
        });
        if (!restored.connectivityTest) {
            restored.connectivityTest = {};
        }
        restored.connectivityTest.speed = Number(restored.connectivityTest.speed) || Number(QUESTION_CONFIG.atom8.connectivityTest?.defaultSpeed) || 1;
        if (typeof restored.connectivityTest.autoSend !== 'boolean') restored.connectivityTest.autoSend = QUESTION_CONFIG.atom8.connectivityTest?.autoSendDefault !== false;
        restored.connectivityTest.pairs = Array.isArray(restored.connectivityTest.pairs) ? restored.connectivityTest.pairs : [];
        const savedCases = Array.isArray(restored.officialTests?.cases) ? restored.officialTests.cases.filter(testCase =>
            testCase && testCase.id && testCase.source && testCase.destination && Number(testCase.points) > 0
        ) : [];
        const useGeneratedCases = ex.type === 'atom9';
        const restoredCases = useGeneratedCases ? generatedCases : (savedCases.length ? savedCases : generatedCases);
        const savedResults = savedCases.length ? (restored.officialTests?.results || {}) : {};
        const repairedSuite = useGeneratedCases && (
            savedCases.length !== generatedCases.length ||
            savedCases.some((testCase, index) => testCase.id !== generatedCases[index]?.id)
        );
        restored.officialTests = {
            message: repairedSuite
                ? 'The official test suite was repaired for this item.'
                : (savedCases.length ? (restored.officialTests?.message || 'Official tests have not been run for this configuration.') : 'A new persistent official test suite was generated for this session.'),
            cases: restoredCases.map(testCase => ({ ...testCase, source: { ...testCase.source }, destination: { ...testCase.destination } })),
            results: Object.fromEntries(restoredCases.map(testCase => [testCase.id, savedResults[testCase.id] || {
                status: 'gray', message: 'Not tested'
            }]))
        };
        return restored;
    }
    catch (err) { console.warn('Could not restore Atom 8 state:', err); }
    return atom8InitialState(ex.model, generatedCases);
}

function atom8ParseIp(value) {
    const text = String(value || '').trim();
    const parts = text.split('.');
    if (parts.length !== 4 || parts.some(part => !/^\d{1,3}$/.test(part) || Number(part) > 255)) return null;
    return { text: parts.map(Number).join('.'), int: atom6IpToInt(parts.map(Number)) };
}

function atom8MaskPrefix(value) {
    const parsed = atom8ParseIp(value);
    if (!parsed) return null;
    for (let prefix = 0; prefix <= 32; prefix++) {
        if (atom6MaskOctets(prefix).join('.') === parsed.text) return prefix;
    }
    return null;
}

function atom8ConfiguredBlock(ipValue, maskValue) {
    const ip = atom8ParseIp(ipValue);
    const prefix = atom8MaskPrefix(maskValue);
    if (!ip || prefix === null) return null;
    const block = atom6Block(ip.int, prefix);
    return { ...block, ip: ip.text, ipInt: ip.int };
}

function atom8BlocksOverlap(a, b) {
    return a.networkInt <= b.networkInt + b.availableIp - 1 && b.networkInt <= a.networkInt + a.availableIp - 1;
}

function atom8FirstHop(scenario, startId, destinationId) {
    const queue = [{ id: startId, first: null }];
    const seen = new Set([startId]);
    while (queue.length) {
        const current = queue.shift();
        if (current.id === destinationId) return current.first;
        scenario.wans.forEach(wan => {
            let next = null;
            if (wan.fromRouterId === current.id) next = wan.toRouterId;
            else if (wan.toRouterId === current.id) next = wan.fromRouterId;
            if (!next || seen.has(next)) return;
            seen.add(next);
            queue.push({ id: next, first: current.first || { routerId: next, wanId: wan.id } });
        });
    }
    return null;
}

function atom8ApplyOfficialScore(ex) {
    const results = ex.atom8State.officialTests?.results || {};
    ex.score = atom8OfficialCases(ex).reduce((sum, testCase) =>
        sum + (results[testCase.id]?.status === 'green' ? Number(testCase.points) : 0), 0);
    ex.isPartial = ex.score > 0 && ex.score < ex.answers.length;
    ex.locked = ex.answers.length > 0 && ex.score === ex.answers.length;
}

function atom8CelebratePerfectItem(ex, previousScore) {
    const possible = Number(ex?.answers?.length || 0);
    const wasPerfect = possible > 0 && Number(previousScore || 0) === possible;
    const isPerfect = possible > 0 && Number(ex?.score || 0) === possible;
    if (!wasPerfect && isPerfect && (ex.type === 'atom8' || ex.type === 'atom9')) {
        triggerBigConfetti();
    }
}

function atom8InvalidateOfficialTests(ex, message = 'Network configuration changed. Run the official tests again.') {
    ex.atom8State.officialTests = atom8InitialOfficialTests(atom8OfficialCases(ex));
    ex.atom8State.officialTests.message = message;
    atom8ApplyOfficialScore(ex);
    atom8CancelPingAnimation();
    atom8PingState.active = false;
    atom8PingState.mode = null;
    atom8PingState.caseId = null;
    atom8PingState.sourceId = null;
    atom8PingState.destinationId = null;
    atom8PingState.phase = 'idle';
    atom8PingState.outcome = null;
    atom8PingState.message = 'Select Test Connection to begin.';
}

function atom8Validate(ex) {
    const scenario = ex.scenario;
    const model = ex.model;
    const state = ex.atom8State;
    const parentStart = scenario.parent.networkInt;
    const parentEnd = parentStart + scenario.parent.availableIp - 1;
    const validation = { ports: {}, hosts: {}, routers: {}, routes: {} };
    const portRecords = [];
    const assignments = [];

    model.routers.forEach(router => {
        const routerState = state.routers[router.id];
        router.ports.forEach(port => {
            const key = router.id + ':' + port.id;
            const input = routerState.ports[port.id];
            if (!routerState.applied) { validation.ports[key] = 'gray'; return; }
            const block = atom8ConfiguredBlock(input.ip, input.mask);
            let valid = !!(block && input.enabled && block.ipInt > block.networkInt && block.ipInt < block.networkInt + block.availableIp - 1 && block.networkInt >= parentStart && block.networkInt + block.availableIp - 1 <= parentEnd);
            if (valid && port.role === 'lan') {
                const lan = scenario.lans.find(item => item.id === port.targetId);
                valid = block.usableIp >= lan.hosts;
            }
            if (valid && port.role === 'wan') valid = block.cidr === Number(QUESTION_CONFIG.atom8.wanCidr);
            if (valid && port.dce) valid = Number(input.clockRate) === Number(QUESTION_CONFIG.atom8.dceClockRate);
            validation.ports[key] = valid ? 'green' : 'red';
            if (block) {
                portRecords.push({ key, routerId: router.id, port, block });
                assignments.push({ key, ip: block.ip });
            }
        });
    });

    const grouped = {};
    portRecords.forEach(record => (grouped[record.port.targetId] ||= []).push(record));
    Object.values(grouped).forEach(records => {
        const first = records[0]?.block;
        if (records.some(record => record.block.network !== first.network || record.block.cidr !== first.cidr)) {
            records.forEach(record => { validation.ports[record.key] = 'red'; });
        }
        if (records[0]?.port.role === 'wan' && records.length !== 2) {
            records.forEach(record => { validation.ports[record.key] = 'red'; });
        }
    });
    const targetBlocks = Object.entries(grouped).map(([targetId, records]) => ({ targetId, block: records[0].block, records }));
    for (let i = 0; i < targetBlocks.length; i++) for (let j = i + 1; j < targetBlocks.length; j++) {
        if (atom8BlocksOverlap(targetBlocks[i].block, targetBlocks[j].block)) {
            [...targetBlocks[i].records, ...targetBlocks[j].records].forEach(record => { validation.ports[record.key] = 'red'; });
        }
    }

    model.hosts.forEach(host => {
        const input = state.hosts[host.id];
        if (!input.applied) { validation.hosts[host.id] = 'gray'; return; }
        const block = atom8ConfiguredBlock(input.ip, input.mask);
        const gateway = atom8ParseIp(input.gateway);
        const lanPort = portRecords.find(record => record.port.role === 'lan' && record.port.targetId === host.lanId);
        let valid = !!(block && gateway && lanPort && validation.ports[lanPort.key] === 'green');
        if (valid) valid = block.network === lanPort.block.network && block.cidr === lanPort.block.cidr && gateway.text === lanPort.block.ip && block.ipInt > block.networkInt && block.ipInt < block.networkInt + block.availableIp - 1;
        validation.hosts[host.id] = valid ? 'green' : 'red';
        if (block) assignments.push({ key: host.id, ip: block.ip });
    });
    const ipGroups = {};
    assignments.forEach(item => (ipGroups[item.ip] ||= []).push(item.key));
    Object.values(ipGroups).filter(keys => keys.length > 1).flat().forEach(key => {
        if (key.includes(':')) validation.ports[key] = 'red';
        else validation.hosts[key] = 'red';
    });

    model.routers.forEach(router => {
        const routerState = state.routers[router.id];
        if (!routerState.applied) {
            validation.routes[router.id] = 'gray';
            validation.routers[router.id] = 'gray';
            return;
        }
        const portsValid = router.ports.every(port => validation.ports[router.id + ':' + port.id] === 'green');
        const routeRecords = routerState.routes.map(input => {
            const destination = atom8ConfiguredBlock(input.destination, input.mask);
            const destinationInput = atom8ParseIp(input.destination);
            const nextHop = atom8ParseIp(input.nextHop);
            const peerWan = nextHop && portRecords.find(record => {
                if (record.routerId === router.id || record.port.role !== 'wan' || record.block.ip !== nextHop.text) return false;
                return router.ports.some(port => port.role === 'wan' && port.targetId === record.port.targetId);
            });
            const valid = !!(destination && destinationInput && destinationInput.text === destination.network && nextHop && peerWan && validation.ports[peerWan.key] === 'green');
            return { input, destination, nextHop, peerWan, valid };
        });
        const remoteLans = scenario.lans.filter(lan => lan.routerId !== router.id);
        const configuredRouteRecords = routeRecords.filter(route =>
            route.input.destination || route.input.mask || route.input.nextHop
        );
        const routesWellFormed = remoteLans.length === 0
            ? configuredRouteRecords.length === 0
            : configuredRouteRecords.length > 0 && configuredRouteRecords.every(route => route.valid);
        const remoteNetworksReachable = remoteLans.every(lan => {
            const destinationPort = portRecords.find(record => record.port.role === 'lan' && record.port.targetId === lan.id && validation.ports[record.key] === 'green');
            const hop = atom8FirstHop(scenario, router.id, lan.routerId);
            if (!destinationPort || !hop) return false;
            const destinationEnd = destinationPort.block.networkInt + destinationPort.block.availableIp - 1;
            const candidates = configuredRouteRecords.filter(route => route.valid &&
                route.destination.networkInt <= destinationPort.block.networkInt &&
                route.destination.networkInt + route.destination.availableIp - 1 >= destinationEnd);
            if (!candidates.length) return false;
            const longestPrefix = Math.max(...candidates.map(route => route.destination.cidr));
            const selectedRoutes = candidates.filter(route => route.destination.cidr === longestPrefix);
            return selectedRoutes.every(route => route.peerWan.routerId === hop.routerId && route.peerWan.port.targetId === hop.wanId);
        });
        const routesValid = portsValid && routesWellFormed && remoteNetworksReachable;
        validation.routes[router.id] = routesValid ? 'green' : 'red';
        validation.routers[router.id] = portsValid && routesValid ? 'green' : 'red';
    });

    state.validation = validation;
    atom8ApplyOfficialScore(ex);
    ex.userAnswer = JSON.stringify(state);
    return validation;
}

function atom8ConnectivitySnapshot(ex) {
    const records = [];
    ex.model.routers.forEach(router => {
        router.ports.forEach(port => {
            const input = ex.atom8State.routers[router.id].ports[port.id];
            const block = atom8ConfiguredBlock(input.ip, input.mask);
            const key = router.id + ':' + port.id;
            if (block) records.push({ key, routerId: router.id, router, port, input, block, valid: ex.atom8State.validation.ports[key] === 'green' });
        });
    });
    return { records };
}

function atom8FindForwardingHop(ex, snapshot, routerId, destinationIpInt) {
    const router = ex.model.routers.find(item => item.id === routerId);
    const routerState = ex.atom8State.routers[routerId];
    const candidates = [];
    (routerState.routes || []).forEach(input => {
        const destinationInput = atom8ParseIp(input.destination);
        const destination = atom8ConfiguredBlock(input.destination, input.mask);
        const nextHop = atom8ParseIp(input.nextHop);
        if (!destinationInput || !destination || destinationInput.text !== destination.network || !nextHop) return;
        const destinationEnd = destination.networkInt + destination.availableIp - 1;
        if (destinationIpInt < destination.networkInt || destinationIpInt > destinationEnd) return;
        const peer = snapshot.records.find(record => {
            if (!record.valid || record.routerId === routerId || record.port.role !== 'wan' || record.block.ip !== nextHop.text) return false;
            const localPort = router.ports.find(port => port.role === 'wan' && port.targetId === record.port.targetId);
            return !!(localPort && ex.atom8State.validation.ports[routerId + ':' + localPort.id] === 'green');
        });
        if (peer) candidates.push({ destination, peer, wanId: peer.port.targetId });
    });
    if (!candidates.length) return { error: 'No matching valid static route.' };
    const longestPrefix = Math.max(...candidates.map(candidate => candidate.destination.cidr));
    const best = candidates.filter(candidate => candidate.destination.cidr === longestPrefix);
    const nextHops = new Set(best.map(candidate => candidate.peer.routerId + ':' + candidate.wanId));
    if (nextHops.size !== 1) return { error: 'Conflicting equal-prefix static routes.' };
    return best[0];
}

function atom8ResolveOneWayPath(ex, sourceId, destinationId) {
    const source = ex.model.hosts.find(host => host.id === sourceId);
    const destination = ex.model.hosts.find(host => host.id === destinationId);
    if (!source || !destination) return { success: false, nodes: [], message: 'Select two PCs.' };
    if (ex.atom8State.validation.hosts[source.id] !== 'green') {
        return { success: false, nodes: [{ kind: 'host', id: source.id }], message: source.label + ' does not have a valid IPv4 configuration.' };
    }
    if (ex.atom8State.validation.hosts[destination.id] !== 'green') {
        return { success: false, nodes: [{ kind: 'host', id: source.id }], message: destination.label + ' does not have a valid IPv4 configuration.' };
    }
    const sourceLan = ex.scenario.lans.find(lan => lan.id === source.lanId);
    const destinationLan = ex.scenario.lans.find(lan => lan.id === destination.lanId);
    const destinationIp = atom8ParseIp(ex.atom8State.hosts[destination.id].ip);
    const nodes = [{ kind: 'host', id: source.id }, { kind: 'switch', id: sourceLan.id }];
    if (sourceLan.id === destinationLan.id) {
        nodes.push({ kind: 'host', id: destination.id });
        return { success: true, nodes };
    }

    const snapshot = atom8ConnectivitySnapshot(ex);
    let currentRouterId = sourceLan.routerId;
    const destinationRouterId = destinationLan.routerId;
    nodes.push({ kind: 'router', id: currentRouterId });
    const visited = new Set([currentRouterId]);
    while (currentRouterId !== destinationRouterId) {
        const currentRouter = ex.model.routers.find(router => router.id === currentRouterId);
        const hop = atom8FindForwardingHop(ex, snapshot, currentRouterId, destinationIp.int);
        if (hop.error) {
            return { success: false, nodes, message: 'Echo request stopped at Router ' + currentRouter.number + ': ' + hop.error };
        }
        currentRouterId = hop.peer.routerId;
        if (visited.has(currentRouterId)) {
            return { success: false, nodes, message: 'Echo request stopped because the configured static routes created a routing loop.' };
        }
        visited.add(currentRouterId);
        nodes.push({ kind: 'router', id: currentRouterId, wanId: hop.wanId });
        if (visited.size > ex.model.routers.length) {
            return { success: false, nodes, message: 'Echo request exceeded the available router path.' };
        }
    }
    nodes.push({ kind: 'switch', id: destinationLan.id }, { kind: 'host', id: destination.id });
    return { success: true, nodes };
}

function atom8ResolvePing(ex, sourceId, destinationId) {
    const request = atom8ResolveOneWayPath(ex, sourceId, destinationId);
    if (!request.success) return { success: false, request, reply: null, message: request.message };
    const reply = atom8ResolveOneWayPath(ex, destinationId, sourceId);
    if (!reply.success) return { success: false, request, reply, message: reply.message.replace('Echo request', 'Echo reply') };
    return { success: true, request, reply, message: 'Echo reply received. The connection is working in both directions.' };
}

function atom8PingNodeElement(canvas, node) {
    if (node.kind === 'host') return canvas.querySelector('.atom8-host-button[data-device-id="' + node.id + '"]');
    if (node.kind === 'switch') return canvas.querySelector('.atom6-switch-device[data-lan-id="' + node.id + '"]');
    return canvas.querySelector('[data-router-id="' + node.id + '"]');
}

function atom8PingPoint(canvas, node) {
    const element = atom8PingNodeElement(canvas, node);
    if (!element) return null;
    const canvasRect = canvas.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    const scaleX = canvasRect.width / canvas.offsetWidth || 1;
    const scaleY = canvasRect.height / canvas.offsetHeight || scaleX;
    return {
        element,
        x: (rect.left - canvasRect.left + rect.width / 2) / scaleX,
        y: (rect.top - canvasRect.top + rect.height / 2) / scaleY
    };
}

function atom8PingNodeKey(node) {
    return node.kind + ':' + node.id;
}

function atom8FindPhysicalPath(canvas, fromNode, toNode) {
    const fromKey = atom8PingNodeKey(fromNode);
    const toKey = atom8PingNodeKey(toNode);
    const path = [...canvas.querySelectorAll('path[data-node-a][data-node-b]')].find(candidate => {
        const a = candidate.dataset.nodeA;
        const b = candidate.dataset.nodeB;
        return (a === fromKey && b === toKey) || (a === toKey && b === fromKey);
    });
    if (!path) return null;
    return { path, reverse: path.dataset.nodeA !== fromKey };
}

function atom8SampleSvgPath(canvas, connection, startPoint, endPoint) {
    const path = connection.path;
    const length = path.getTotalLength();
    if (!Number.isFinite(length) || length <= 0) return [startPoint, endPoint];
    const sampleCount = Math.max(16, Math.min(64, Math.ceil(length / 10)));
    const sampled = Array.from({ length: sampleCount + 1 }, (_, index) => {
        const ratio = index / sampleCount;
        const svgPoint = path.getPointAtLength(length * (connection.reverse ? 1 - ratio : ratio));
        // Every Atom 8 connection SVG uses the topology canvas coordinate
        // system. Keep packet keyframes in that same unscaled system; the
        // canvas transform then moves the cable and packet together.
        return { x: svgPoint.x, y: svgPoint.y };
    });
    return [startPoint, ...sampled, endPoint];
}

function atom8PacketKeyframes(points, translate) {
    const distances = [0];
    for (let i = 1; i < points.length; i++) {
        distances.push(distances[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
    }
    const total = distances[distances.length - 1] || 1;
    return points.map((point, index) => ({ transform: translate(point), offset: distances[index] / total }));
}

function atom8SetPingMessage(message, phase, outcome = null) {
    atom8PingState.message = message;
    atom8PingState.phase = phase;
    atom8PingState.outcome = outcome;
    const status = document.querySelector(atom8CurrentContainerSelector() + ' .atom8-connectivity-status');
    if (status) {
        status.className = 'atom8-connectivity-status ' + (outcome || '');
        status.innerHTML = '<i class="fa-solid ' + (outcome === 'success' ? 'fa-circle-check' : outcome === 'failure' ? 'fa-circle-xmark' : 'fa-satellite-dish') + '" aria-hidden="true"></i><span>' + atom6Escape(message) + '</span>';
    }
    if (atom8PingState.caseId) {
        const selector = atom8PingState.mode === 'official' ? '.atom8-official-case[data-case-id="' + atom8PingState.caseId + '"]' : '.atom8-self-case[data-pair-id="' + atom8PingState.caseId + '"]';
        const caseRow = document.querySelector(atom8CurrentContainerSelector() + ' ' + selector);
        if (caseRow) {
            caseRow.dataset.phase = phase;
            const route = caseRow.querySelector('.atom8-case-route');
            const phaseText = phase === 'request' ? 'Request traveling from source to destination' :
                phase === 'reply' ? 'Reply traveling from destination to source' :
                outcome === 'success' ? 'Connection passed' : outcome === 'failure' ? 'Connection failed' : 'Connection not tested';
            if (route) {
                const endpointLabel = String(route.getAttribute('aria-label') || '').split('. ')[0];
                route.setAttribute('aria-label', endpointLabel + '. ' + phaseText);
                const phaseDescription = route.querySelector('.atom8-case-phase');
                if (phaseDescription) phaseDescription.textContent = phaseText;
            }
            caseRow.querySelectorAll('.atom8-case-phase span').forEach(marker => {
                const markerPhase = marker.dataset.phase;
                marker.classList.toggle('active', markerPhase === phase || (phase === 'complete' && markerPhase === 'result'));
                marker.classList.toggle('done', phase === 'reply' && markerPhase === 'request' || phase === 'complete' && markerPhase !== 'result');
            });
        }
    }
    const topologyInstruction = document.querySelector(atom8CurrentContainerSelector() + ' .atom8-topology-instruction');
    if (topologyInstruction) {
        topologyInstruction.textContent = outcome ? 'Test complete. Select another source PC to create a new pair.' :
            (phase === 'request' || phase === 'reply' ? 'Visualizing the configured packet path.' : topologyInstruction.textContent);
    }
}

function atom8CancelPingAnimation() {
    atom8PingRunId++;
    atom8PingAnimation?.cancel();
    atom8PingAnimation = null;
    atom8PingState.running = false;
    atom8PingState.paused = false;
    document.querySelectorAll('.atom8-icmp-packet').forEach(packet => packet.remove());
    document.querySelectorAll('.atom8-icmp-active, .atom8-icmp-arrived, .atom8-icmp-failed').forEach(element => {
        element.classList.remove('atom8-icmp-active', 'atom8-icmp-arrived', 'atom8-icmp-failed');
    });
}

function atom8PingDelay(ms, runId) {
    return new Promise(resolve => setTimeout(() => resolve(runId === atom8PingRunId), ms));
}

async function atom8AnimatePacket(nodes, direction, runId, failAtEnd) {
    const canvas = document.querySelector(atom8CurrentContainerSelector() + ' .atom8-topology-canvas');
    if (!canvas || runId !== atom8PingRunId) return false;
    const points = nodes.map(node => atom8PingPoint(canvas, node)).filter(Boolean);
    if (!points.length) return false;
    const packet = document.createElement('span');
    packet.className = 'atom8-icmp-packet ' + direction;
    packet.innerHTML = '<i class="fa-solid fa-envelope" aria-hidden="true"></i>';
    packet.setAttribute('aria-label', direction === 'request' ? 'ICMP echo request' : 'ICMP echo reply');
    canvas.appendChild(packet);
    const translate = point => 'translate(' + (point.x - 10) + 'px, ' + (point.y - 10) + 'px)';
    packet.style.transform = translate(points[0]);
    points[0].element.classList.add('atom8-icmp-active');
    for (let i = 1; i < points.length; i++) {
        if (runId !== atom8PingRunId) { packet.remove(); return false; }
        const speed = Math.max(0.1, Number(atom8CurrentExercise().atom8State.connectivityTest.speed) || 1);
        const duration = Math.max(120, Number(QUESTION_CONFIG.atom8.connectivityTest.hopDurationMs) / speed);
        points[i - 1].element.classList.remove('atom8-icmp-active');
        points[i].element.classList.add('atom8-icmp-active');
        const connection = atom8FindPhysicalPath(canvas, nodes[i - 1], nodes[i]);
        const segmentPoints = connection ? atom8SampleSvgPath(canvas, connection, points[i - 1], points[i]) : [points[i - 1], points[i]];
        atom8PingAnimation = packet.animate(atom8PacketKeyframes(segmentPoints, translate), { duration, easing: 'linear', fill: 'forwards' });
        if (atom8PingState.paused) atom8PingAnimation.pause();
        try { await atom8PingAnimation.finished; }
        catch (err) {
            packet.remove();
            return false;
        }
        packet.style.transform = translate(points[i]);
    }
    const finalPoint = points[points.length - 1];
    finalPoint.element.classList.remove('atom8-icmp-active');
    finalPoint.element.classList.add(failAtEnd ? 'atom8-icmp-failed' : 'atom8-icmp-arrived');
    packet.classList.toggle('failed', failAtEnd);
    const held = await atom8PingDelay(failAtEnd ? 650 : 260, runId);
    packet.remove();
    finalPoint.element.classList.remove('atom8-icmp-arrived', 'atom8-icmp-failed');
    return held;
}

async function atom8RunPingTest() {
    const ex = atom8CurrentExercise();
    if (!ex || !atom8PingState.sourceId || !atom8PingState.destinationId || atom8PingState.running) return null;
    atom8CancelPingAnimation();
    const runId = atom8PingRunId;
    atom8PingState.running = true;
    const result = atom8ResolvePing(ex, atom8PingState.sourceId, atom8PingState.destinationId);
    atom8SetPingMessage('Sending ICMP echo request…', 'request');
    const requestMoved = await atom8AnimatePacket(result.request.nodes, 'request', runId, !result.request.success);
    if (!requestMoved || runId !== atom8PingRunId) return null;
    if (!result.request.success) {
        atom8PingState.running = false;
        atom8SetPingMessage('Failed', 'complete', 'failure');
        return false;
    }
    if (result.reply && !result.reply.success) {
        atom8SetPingMessage('The destination received the request. Sending the echo reply…', 'reply');
        const replyMoved = await atom8AnimatePacket(result.reply.nodes, 'reply', runId, true);
        if (!replyMoved || runId !== atom8PingRunId) return null;
        atom8PingState.running = false;
        atom8SetPingMessage('Failed', 'complete', 'failure');
        return false;
    }
    const turnaround = Number(QUESTION_CONFIG.atom8.connectivityTest.turnaroundDelayMs) || 0;
    if (!(await atom8PingDelay(turnaround / Math.max(0.1, Number(ex.atom8State.connectivityTest.speed) || 1), runId))) return null;
    atom8SetPingMessage('Echo request received. Returning the echo reply…', 'reply');
    const replyMoved = await atom8AnimatePacket(result.reply.nodes, 'reply', runId, false);
    if (!replyMoved || runId !== atom8PingRunId) return null;
    atom8PingState.running = false;
    atom8SetPingMessage('Passed', 'complete', 'success');
    return true;
}

function atom8StatusDot(status, reviewKind = '', reviewId = '') {
    const reviewData = reviewKind && reviewId ? ' data-review-kind="' + atom6Escape(reviewKind) + '" data-review-id="' + atom6Escape(reviewId) + '"' : '';
    return '<span class="atom8-status-dot ' + atom6Escape(status || 'gray') + '" aria-label="' + atom6Escape(status || 'not configured') + '"' + reviewData + '></span>';
}

function atom8QuickReviewRow(label, value) {
    return '<div class="atom8-review-row"><span>' + atom6Escape(label) + '</span><strong>' + atom6Escape(value || 'Not configured') + '</strong></div>';
}

function atom8QuickReviewContent(target) {
    const ex = atom8CurrentExercise();
    if (!ex) return '';
    if (target.dataset.reviewKind === 'host') {
        const host = ex.model.hosts.find(item => item.id === target.dataset.reviewId);
        const input = host && ex.atom8State.hosts[host.id];
        const lan = host && ex.scenario.lans.find(item => item.id === host.lanId);
        if (!host || !input) return '';
        return '<div class="atom8-review-head"><span>PC QUICK REVIEW</span><strong>' + atom6Escape(host.label) + '</strong><small>LAN ' + atom6Escape(lan?.number || '') + ' · ' + atom6Escape(lan?.label || '') + '</small></div>' +
            '<div class="atom8-review-rows">' + atom8QuickReviewRow('IP address', input.ip) + atom8QuickReviewRow('Subnet mask', input.mask) + atom8QuickReviewRow('Default gateway', input.gateway) + '</div>';
    }
    if (target.dataset.reviewKind === 'port') {
        const router = ex.model.routers.find(item => item.id === target.dataset.reviewRouterId);
        const port = router?.ports.find(item => item.id === target.dataset.reviewPortId);
        const input = port && ex.atom8State.routers[router.id]?.ports[port.id];
        if (!router || !port || !input) return '';
        return '<div class="atom8-review-head"><span>INTERFACE QUICK REVIEW</span><strong>Router ' + router.number + ' · ' + atom6Escape(port.shortName || port.name) + '</strong><small>' + atom6Escape(port.name) + '</small></div>' +
            '<div class="atom8-review-rows">' + atom8QuickReviewRow('IP address', input.ip) + atom8QuickReviewRow('Subnet mask', input.mask) + atom8QuickReviewRow('Default gateway', 'Not applicable') + '</div>';
    }
    return '';
}

function atom8PositionQuickReview(event) {
    const tooltip = document.getElementById('atom8QuickReviewTooltip');
    if (!tooltip || tooltip.hidden) return;
    const margin = 10;
    const offset = 14;
    const rect = tooltip.getBoundingClientRect();
    let left = event.clientX + offset;
    let top = event.clientY + offset;
    if (left + rect.width > window.innerWidth - margin) left = event.clientX - rect.width - offset;
    if (top + rect.height > window.innerHeight - margin) top = event.clientY - rect.height - offset;
    tooltip.style.left = Math.max(margin, left) + 'px';
    tooltip.style.top = Math.max(margin, top) + 'px';
}

function atom8HandleQuickReview(event) {
    const target = event.target.closest?.('[data-review-kind]');
    const tooltip = document.getElementById('atom8QuickReviewTooltip');
    if (event.type === 'mouseout' || event.type === 'pointerout') {
        if (target && !target.contains(event.relatedTarget)) tooltip?.setAttribute('hidden', '');
        return;
    }
    if (event.type === 'mousemove' || event.type === 'pointermove') {
        atom8PositionQuickReview(event);
        return;
    }
    if (!target) return;
    const content = atom8QuickReviewContent(target);
    if (!content) return;
    const review = tooltip || document.body.appendChild(Object.assign(document.createElement('div'), {
        id: 'atom8QuickReviewTooltip', className: 'atom8-quick-review-tooltip'
    }));
    review.setAttribute('role', 'tooltip');
    review.innerHTML = content;
    review.hidden = false;
    atom8PositionQuickReview(event);
}

function atom8HideQuickReview() {
    document.getElementById('atom8QuickReviewTooltip')?.setAttribute('hidden', '');
}

function atom8ResolveOfficialEndpoint(ex, endpoint) {
    const lan = ex.scenario.lans.find(item => item.number === Number(endpoint?.lan));
    if (!lan) return null;
    const hosts = ex.model.hosts.filter(host => host.lanId === lan.id).sort((a, b) => a.number - b.number);
    return hosts[Math.max(0, Number(endpoint?.host || 1) - 1)] || null;
}

function atom8OfficialEndpointLabel(ex, endpoint) {
    const host = atom8ResolveOfficialEndpoint(ex, endpoint);
    if (!host) return 'Unavailable endpoint';
    const lan = ex.scenario.lans.find(item => item.id === host.lanId);
    return host.label + ' · LAN ' + lan.number;
}

function atom8CaseEndpointData(ex, host, fallbackName, fallbackDetail) {
    if (!host) return {
        name: fallbackName || 'Unavailable',
        detail: fallbackDetail || 'Endpoint unavailable'
    };
    const lan = ex.scenario.lans.find(item => item.id === host.lanId);
    return {
        name: host.label,
        detail: lan ? 'LAN ' + lan.number + ' · ' + lan.label : 'LAN unavailable'
    };
}

function atom8BuildCaseEndpointCard(role, endpoint, modifier = '') {
    return '<div class="atom8-case-endpoint-card ' + role.toLowerCase() + (modifier ? ' ' + modifier : '') + '">' +
        '<span><i class="fa-solid fa-desktop" aria-hidden="true"></i>' + role + '</span>' +
        '<strong>' + atom6Escape(endpoint.name) + '</strong>' +
        '<small>' + atom6Escape(endpoint.detail) + '</small></div>';
}

function atom8BuildCaseRoute(ex, source, destination, phase, status, options = {}) {
    const sourceData = atom8CaseEndpointData(ex, source, options.sourceName, options.sourceDetail);
    const destinationData = atom8CaseEndpointData(ex, destination, options.destinationName, options.destinationDetail);
    const phaseLabel = phase === 'request' ? 'Request traveling from source to destination' :
        phase === 'reply' ? 'Reply traveling from destination to source' :
        status === 'green' ? 'Connection passed' : status === 'red' ? 'Connection failed' : 'Connection not tested';
    return '<div class="atom8-case-route" role="img" aria-label="' + atom6Escape(sourceData.name + ' to ' + destinationData.name + '. ' + phaseLabel) + '">' +
        atom8BuildCaseEndpointCard('SRC', sourceData, source ? '' : 'awaiting') +
        '<div class="atom8-case-flow" aria-hidden="true"><span class="atom8-case-flow-track"></span><i class="atom8-case-flow-packet fa-solid fa-circle"></i><i class="atom8-case-flow-result fa-solid ' + (status === 'green' ? 'fa-check' : status === 'red' ? 'fa-xmark' : 'fa-arrow-right') + '"></i></div>' +
        atom8BuildCaseEndpointCard('DST', destinationData, destination ? '' : 'awaiting') +
        '<span class="atom8-case-phase">' + atom6Escape(phaseLabel) + '</span></div>';
}

function atom8BuildCasePlaybackControl(options) {
    const { runClass, dataName, dataValue, label, running, completed, disabled } = options;
    if (running) {
        return '<span class="atom8-case-activity" role="status" aria-label="' + atom6Escape(label) + ' is running"><i class="fa-solid fa-wave-square" aria-hidden="true"></i></span>';
    }
    return '<button type="button" class="atom8-case-play ' + runClass + '" data-' + dataName + '="' + atom6Escape(dataValue) + '" aria-label="' + (completed ? 'Replay ' : 'Play ') + atom6Escape(label) + '" title="' + (completed ? 'Run again' : 'Play test') + '"' + (disabled ? ' disabled' : '') + '><i class="fa-solid ' + (completed ? 'fa-rotate-right' : 'fa-play') + '" aria-hidden="true"></i></button>';
}

function atom8BuildRunAllControl(runClass, running, busy, label) {
    return '<button type="button" class="atom8-run-all-tests ' + runClass + '" aria-label="Run all ' + atom6Escape(label) + '"' + (busy ? ' disabled' : '') + '><i class="fa-solid fa-forward" aria-hidden="true"></i><span>' + (running ? 'Running all' : 'Run all') + '</span></button>';
}

function atom8BuildTransportBar(activeLabel, activeRunning = false) {
    const hasActive = !!activeLabel;
    const running = hasActive && (atom8PingState.running || activeRunning);
    const paused = running && atom8PingState.paused;
    const stateLabel = running ? (paused ? 'Paused' : 'Running') : (hasActive ? 'Ready' : 'No active test');
    return '<div class="atom8-transport-bar" aria-label="Test playback controls"><div class="atom8-transport-current"><span class="' + (running ? 'active' : '') + '"><i class="fa-solid ' + (running ? 'fa-circle' : 'fa-minus') + '" aria-hidden="true"></i>' + stateLabel + '</span><strong>' + atom6Escape(activeLabel || 'Choose a case to begin') + '</strong></div>' +
        '<div class="atom8-transport-controls"><button type="button" class="atom8-transport-button atom8-transport-primary ' + (running ? 'atom8-pause-active-test' : 'atom8-play-selected-test') + '" aria-label="' + (running ? (paused ? 'Resume active test' : 'Pause active test') : 'Play selected test') + '" title="' + (running ? (paused ? 'Resume' : 'Pause') : 'Play') + '"' + (!hasActive ? ' disabled' : '') + '><i class="fa-solid ' + (running ? (paused ? 'fa-play' : 'fa-pause') : 'fa-play') + '" aria-hidden="true"></i></button>' +
        '<button type="button" class="atom8-transport-button atom8-stop-active-test" aria-label="Stop active test" title="Stop"' + (!running ? ' disabled' : '') + '><i class="fa-solid fa-stop" aria-hidden="true"></i></button>' +
        '<button type="button" class="atom8-transport-button atom8-reset-active-test" aria-label="Reset active test" title="Restart from beginning"' + (!running ? ' disabled' : '') + '><i class="fa-solid fa-arrow-rotate-left" aria-hidden="true"></i></button></div></div>';
}

function atom8BuildOfficialTests(ex) {
    const suite = QUESTION_CONFIG.atom8.connectivityTest?.officialTestCases;
    const cases = atom8OfficialCases();
    if (!cases.length) return '';
    const results = ex.atom8State.officialTests.results;
    const busy = atom8OfficialRunAllActive || atom8PingState.running || Object.values(results).some(result => result.status === 'running');
    const rows = cases.map((testCase, index) => {
        const result = results[testCase.id] || { status: 'gray', message: 'Not tested' };
        const isActive = atom8PingState.caseId === testCase.id;
        const isRunning = isActive && result.status === 'running';
        const phase = isActive ? atom8PingState.phase : (result.status === 'green' || result.status === 'red' ? 'complete' : 'idle');
        const source = atom8ResolveOfficialEndpoint(ex, testCase.source);
        const destination = atom8ResolveOfficialEndpoint(ex, testCase.destination);
        return '<article class="atom8-test-case atom8-official-case ' + atom6Escape(result.status) + (isActive ? ' active' : '') + '" data-case-id="' + atom6Escape(testCase.id) + '" data-phase="' + phase + '">' +
            '<div class="atom8-official-case-index">' + (index + 1) + '</div>' +
            '<div class="atom8-official-case-copy"><div><strong title="' + atom6Escape(testCase.label) + '">' + atom6Escape(testCase.label) + '</strong><span>' + Number(testCase.points) + ' pts</span></div>' +
            atom8BuildCaseRoute(ex, source, destination, phase, result.status) + '</div>' +
            atom8BuildCasePlaybackControl({ runClass: 'atom8-run-official-case', dataName: 'case-id', dataValue: testCase.id, label: testCase.label, running: isRunning, completed: result.status === 'green' || result.status === 'red', disabled: busy }) + '</article>';
    }).join('');
    const activeTest = atom8PingState.mode === 'official' ? cases.find(testCase => testCase.id === atom8PingState.caseId) : null;
    const activeResult = activeTest ? results[activeTest.id] : null;
    const speed = Number(ex.atom8State.connectivityTest?.speed) || Number(QUESTION_CONFIG.atom8.connectivityTest.defaultSpeed) || 1;
    return '<aside class="atom8-test-rail atom8-official-tests" aria-label="Official scored connectivity tests"><div class="atom8-official-head"><div><span><i class="fa-solid fa-clipboard-check" aria-hidden="true"></i> Official Test</span><h3>Test Cases</h3><p>Run one case or the complete suite.</p></div>' +
        (suite.runAllEnabled ? atom8BuildRunAllControl('atom8-run-all-official-tests', atom8OfficialRunAllActive, busy, 'official tests') : '') + '</div>' +
        atom8BuildTransportBar(activeTest?.label || '', activeResult?.status === 'running') +
        '<div class="atom8-official-suite-message" role="status"><i class="fa-solid fa-circle-info" aria-hidden="true"></i><span>' + atom6Escape(ex.atom8State.officialTests.message) + '</span></div>' +
        '<div class="atom8-official-case-list">' + rows + '</div>' + atom8BuildSpeedControl(speed) + '</aside>';
}

function atom8BuildSpeedControl(speed) {
    const cfg = QUESTION_CONFIG.atom8.connectivityTest;
    return '<label class="atom8-speed-control"><span><small>Animation speed</small><output>' + Number(speed).toFixed(2).replace(/\.00$/, '') + '×</output></span><input type="range" class="atom8-ping-speed" min="' + Number(cfg.minSpeed) + '" max="' + Number(cfg.maxSpeed) + '" step="' + Number(cfg.speedStep) + '" value="' + Number(speed) + '"><span class="atom8-speed-scale"><small>Slower</small><small>Faster</small></span></label>';
}

async function atom8RunOfficialCase(caseId) {
    const ex = atom8CurrentExercise();
    const testCase = atom8OfficialCases().find(item => item.id === caseId);
    if (!ex || !testCase || atom8PingState.running) return false;
    const scoreBeforeRun = Number(ex.score || 0);
    const source = atom8ResolveOfficialEndpoint(ex, testCase.source);
    const destination = atom8ResolveOfficialEndpoint(ex, testCase.destination);
    const resultState = ex.atom8State.officialTests.results[testCase.id];
    const previousResult = { status: resultState.status, message: resultState.message };
    if (!source || !destination || source.id === destination.id) {
        resultState.status = 'red';
        resultState.message = 'Failed';
        ex.atom8State.officialTests.message = 'Test failed.';
        atom8ApplyOfficialScore(ex);
        ex.userAnswer = JSON.stringify(ex.atom8State);
        saveSessionProgress();
        renderAtom8View();
        updateSummaryPanel();
        return false;
    }
    atom8WorkspaceMode = 'official';
    resultState.status = 'running';
    resultState.message = 'Preparing official ICMP test…';
    ex.atom8State.officialTests.message = 'Running ' + testCase.label + '…';
    atom8PingState.active = true;
    atom8PingState.mode = 'official';
    atom8PingState.caseId = testCase.id;
    atom8PingState.sourceId = source.id;
    atom8PingState.destinationId = destination.id;
    atom8PingState.phase = 'ready';
    atom8PingState.outcome = null;
    atom8PingState.paused = false;
    atom8PingState.stopRequested = false;
    atom8PingState.message = 'Preparing official ICMP test…';
    renderAtom8View();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const passed = await atom8RunPingTest();
    const stopped = passed === null && atom8PingState.stopRequested;
    resultState.status = stopped ? previousResult.status : passed === true ? 'green' : 'red';
    resultState.message = stopped ? (previousResult.status === 'green' || previousResult.status === 'red' ? previousResult.message : 'Stopped · Ready to test again.') : passed === true ? 'Passed' : 'Failed';
    ex.atom8State.officialTests.message = stopped ? testCase.label + ' stopped. Its previous result was retained.' : passed === true ? 'Test passed.' : 'Test failed.';
    atom8PingState.active = false;
    atom8PingState.mode = null;
    atom8PingState.caseId = null;
    atom8PingState.sourceId = null;
    atom8PingState.destinationId = null;
    atom8PingState.paused = false;
    atom8PingState.stopRequested = false;
    atom8ApplyOfficialScore(ex);
    ex.userAnswer = JSON.stringify(ex.atom8State);
    saveSessionProgress();
    renderAtom8View();
    updateSummaryPanel();
    atom8CelebratePerfectItem(ex, scoreBeforeRun);
    const restart = stopped && atom8RestartRequest?.mode === 'official' && atom8RestartRequest.caseId === testCase.id;
    if (restart) {
        atom8RestartRequest = null;
        setTimeout(() => atom8RunOfficialCase(testCase.id), 0);
    }
    return stopped ? null : passed === true;
}

async function atom8RunAllOfficialCases() {
    if (atom8OfficialRunAllActive || atom8PingState.running) return;
    atom8WorkspaceMode = 'official';
    atom8OfficialRunAllActive = true;
    const ex = atom8CurrentExercise();
    let stopped = false;
    for (const testCase of atom8OfficialCases()) {
        const outcome = await atom8RunOfficialCase(testCase.id);
        if (!atom8OfficialRunAllActive || outcome === null) { stopped = true; break; }
    }
    atom8OfficialRunAllActive = false;
    const passed = atom8OfficialCases().filter(testCase => ex.atom8State.officialTests.results[testCase.id]?.status === 'green').length;
    ex.atom8State.officialTests.message = stopped ? 'Official suite stopped. Completed results were retained.' : 'Official suite complete: ' + passed + ' of ' + atom8OfficialCases().length + ' test cases passed.';
    atom8ApplyOfficialScore(ex);
    ex.userAnswer = JSON.stringify(ex.atom8State);
    saveSessionProgress();
    renderAtom8View();
    updateSummaryPanel();
}

function atom8BuildConnectivityTest(ex) {
    const cfg = QUESTION_CONFIG.atom8.connectivityTest;
    if (!cfg?.enabled) return '';
    const connectivity = ex.atom8State.connectivityTest;
    const speed = Number(connectivity.speed) || Number(cfg.defaultSpeed) || 1;
    const pairs = Array.isArray(connectivity.pairs) ? connectivity.pairs : [];
    const busy = atom8PingState.running || atom8SelfRunAllActive || pairs.some(pair => pair.status === 'running');
    const rows = pairs.map((pair, index) => {
        const isActive = atom8PingState.mode === 'manual' && atom8PingState.caseId === pair.id;
        const isRunning = isActive && pair.status === 'running';
        const phase = isActive ? atom8PingState.phase : (pair.status === 'green' || pair.status === 'red' ? 'complete' : 'idle');
        const source = ex.model.hosts.find(host => host.id === pair.sourceId);
        const destination = ex.model.hosts.find(host => host.id === pair.destinationId);
        return '<article class="atom8-test-case atom8-official-case atom8-self-case ' + atom6Escape(pair.status || 'gray') + (isActive ? ' active' : '') + '" data-pair-id="' + atom6Escape(pair.id) + '" data-phase="' + phase + '">' +
            '<div class="atom8-official-case-index">' + (index + 1) + '</div>' +
            '<div class="atom8-official-case-copy"><div><strong>Manual Pair ' + (index + 1) + '</strong><span>Unscored</span></div>' + atom8BuildCaseRoute(ex, source, destination, phase, pair.status || 'gray') + '</div>' +
            atom8BuildCasePlaybackControl({ runClass: 'atom8-run-self-pair', dataName: 'pair-id', dataValue: pair.id, label: 'manual pair ' + (index + 1), running: isRunning, completed: pair.status === 'green' || pair.status === 'red', disabled: busy }) + '</article>';
    }).join('');
    const selectedPair = pairs.find(pair => pair.id === atom8PingState.caseId);
    const draftSource = atom8PingState.sourceId && !atom8PingState.destinationId ? ex.model.hosts.find(host => host.id === atom8PingState.sourceId) : null;
    const draftRow = '<article class="atom8-test-case atom8-official-case atom8-self-case atom8-draft-case" data-phase="idle"><div class="atom8-official-case-index">' + (pairs.length + 1) + '</div><div class="atom8-official-case-copy"><div><strong>New Test Pair</strong><span>Not saved</span></div>' + atom8BuildCaseRoute(ex, draftSource, null, 'idle', 'gray', {
        sourceName: 'Select source PC', sourceDetail: 'First topology selection',
        destinationName: draftSource ? 'Select destination PC' : 'Waiting for source', destinationDetail: 'Second topology selection'
    }) + '</div><span class="atom8-case-draft-icon" aria-hidden="true"><i class="fa-solid fa-plus"></i></span></article>';
    const activePairIndex = atom8PingState.mode === 'manual' ? pairs.findIndex(pair => pair.id === atom8PingState.caseId) : -1;
    const activePair = activePairIndex >= 0 ? pairs[activePairIndex] : null;
    const runAll = cfg.selfTestRunAllEnabled && pairs.length > 1 ? atom8BuildRunAllControl('atom8-run-all-self-tests', atom8SelfRunAllActive, busy, 'self-tests') : '';
    return '<aside class="atom8-test-rail atom8-official-tests atom8-self-test active" aria-label="Unscored student connectivity tests"><div class="atom8-official-head"><div><span><i class="fa-solid fa-flask" aria-hidden="true"></i> Self-Test · Unscored</span><h3>Test Pairs</h3><p>Select two PCs to create each pair.</p></div><div class="atom8-self-head-actions"><label class="atom8-auto-send"><input type="checkbox" class="atom8-auto-send-input"' + (connectivity.autoSend ? ' checked' : '') + (busy ? ' disabled' : '') + '><span>Auto Send</span></label>' + runAll + '</div></div>' +
        atom8BuildTransportBar(activePair ? 'Manual Pair ' + (activePairIndex + 1) : '', activePair?.status === 'running') +
        '<div class="atom8-official-suite-message" role="status"><i class="fa-solid fa-circle-info" aria-hidden="true"></i><span>' + atom6Escape(atom8PingState.message) + '</span></div><div class="atom8-official-case-list atom8-self-case-list">' + rows + draftRow + '</div>' +
        '<div class="atom8-self-actions"><button type="button" class="atom8-self-run"' + (!selectedPair || busy ? ' disabled' : '') + '><i class="fa-solid fa-paper-plane" aria-hidden="true"></i><span>' + (busy ? 'Testing…' : 'Run Self-Test') + '</span></button><button type="button" class="atom8-clear-self-pairs"' + (!pairs.length || busy ? ' disabled' : '') + '><i class="fa-solid fa-trash-can" aria-hidden="true"></i><span>Clear</span></button></div>' + atom8BuildSpeedControl(speed) + '</aside>';
}

async function atom8RunSelfPair(pairId) {
    const ex = atom8CurrentExercise();
    const pair = ex?.atom8State.connectivityTest?.pairs?.find(item => item.id === pairId);
    if (!ex || !pair || atom8PingState.running) return false;
    const previousResult = { status: pair.status, message: pair.message };
    pair.status = 'running';
    pair.message = 'Preparing ICMP test…';
    atom8PingState.active = true;
    atom8PingState.mode = 'manual';
    atom8PingState.caseId = pair.id;
    atom8PingState.sourceId = pair.sourceId;
    atom8PingState.destinationId = pair.destinationId;
    atom8PingState.phase = 'ready';
    atom8PingState.outcome = null;
    atom8PingState.paused = false;
    atom8PingState.stopRequested = false;
    atom8PingState.message = pair.message;
    renderAtom8View();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const passed = await atom8RunPingTest();
    const stopped = passed === null && atom8PingState.stopRequested;
    pair.status = stopped ? previousResult.status : passed === true ? 'green' : 'red';
    pair.message = stopped ? (previousResult.status === 'green' || previousResult.status === 'red' ? previousResult.message : 'Stopped · Ready to test again.') : passed === true ? 'Passed' : 'Failed';
    if (stopped) atom8PingState.message = 'Self-test stopped. Its previous result was retained.';
    atom8PingState.paused = false;
    atom8PingState.stopRequested = false;
    ex.userAnswer = JSON.stringify(ex.atom8State);
    saveSessionProgress();
    renderAtom8View();
    const restart = stopped && atom8RestartRequest?.mode === 'manual' && atom8RestartRequest.caseId === pair.id;
    if (restart) {
        atom8RestartRequest = null;
        setTimeout(() => atom8RunSelfPair(pair.id), 0);
    }
    return stopped ? null : passed === true;
}

async function atom8RunAllSelfPairs() {
    const ex = atom8CurrentExercise();
    const pairs = ex?.atom8State.connectivityTest?.pairs || [];
    if (!ex || pairs.length < 2 || atom8PingState.running || atom8SelfRunAllActive) return;
    atom8WorkspaceMode = 'self-test';
    atom8SelfRunAllActive = true;
    const pairIds = pairs.map(pair => pair.id);
    renderAtom8View();
    let stopped = false;
    for (const pairId of pairIds) {
        const outcome = await atom8RunSelfPair(pairId);
        if (!atom8SelfRunAllActive || outcome === null) { stopped = true; break; }
    }
    atom8SelfRunAllActive = false;
    const passed = pairs.filter(pair => pair.status === 'green').length;
    atom8PingState.message = stopped ? 'Self-test suite stopped. Completed results were retained.' : 'Self-test suite complete: ' + passed + ' of ' + pairs.length + ' pairs passed.';
    ex.userAnswer = JSON.stringify(ex.atom8State);
    saveSessionProgress();
    renderAtom8View();
}

function atom8BuildTopology(ex) {
    const scenario = ex.scenario;
    const model = ex.model;
    const siteWidth = 280;
    const siteGap = 38;
    const routerHalfWidth = 58;
    const canvasWidth = model.routers.length * siteWidth + Math.max(0, model.routers.length - 1) * siteGap;
    const routerCenterX = routerIndex => (siteWidth / 2) + routerIndex * (siteWidth + siteGap);
    const routerTop = 0;
    const baseY = 36;
    const overlayHeight = 110;
    const viewConfig = QUESTION_CONFIG.atom8.topologyView || {};
    const minZoom = Number(viewConfig.minZoom) || 0.65;
    const maxZoom = Number(viewConfig.maxZoom) || 1.4;
    atom8TopologyZoom = Math.min(maxZoom, Math.max(minZoom, atom8TopologyZoom));
    const canvasHeight = Number(viewConfig.canvasHeight) || 500;
    const scaledWidth = Math.ceil(canvasWidth * atom8TopologyZoom);
    const scaledHeight = Math.ceil(canvasHeight * atom8TopologyZoom);
    const wanPaths = scenario.wans.map(wan => {
        const fromIndex = model.routers.findIndex(router => router.id === wan.fromRouterId);
        const toIndex = model.routers.findIndex(router => router.id === wan.toRouterId);
        const fromCenter = routerCenterX(fromIndex);
        const toCenter = routerCenterX(toIndex);
        const direction = Math.sign(toCenter - fromCenter) || 1;
        const x1 = fromCenter + direction * routerHalfWidth;
        const x2 = toCenter - direction * routerHalfWidth;
        const midpoint = (x1 + x2) / 2;
        return '<path class="atom6-wan-svg-path" data-node-a="router:' + wan.fromRouterId + '" data-node-b="router:' + wan.toRouterId + '" d="' + atom6BuildSerialLightningPath(x1, x2, baseY) + '"></path>' +
            '<text class="atom6-wan-svg-label" x="' + midpoint + '" y="' + (baseY - 14) + '" text-anchor="middle">WAN ' + wan.number + ' · Serial</text>';
    }).join('');
    const routerSites = model.routers.map(router => {
        const routerStatus = ex.atom8State.validation.routers[router.id] || 'gray';
        const lans = scenario.lans.filter(lan => lan.routerId === router.id).map(lan => {
            const hosts = model.hosts.filter(host => host.lanId === lan.id).map(host => {
                const input = ex.atom8State.hosts[host.id];
                const status = ex.atom8State.validation.hosts[host.id] || 'gray';
                const prefix = atom8MaskPrefix(input.mask);
                const value = input.ip && prefix !== null ? input.ip + '/' + prefix : 'Not configured';
                const pingSelection = atom8PingState.active && atom8PingState.sourceId === host.id ? ' atom8-ping-source' : atom8PingState.active && atom8PingState.destinationId === host.id ? ' atom8-ping-destination' : '';
                const pingRole = atom8PingState.sourceId === host.id ? 'Source PC ' : atom8PingState.destinationId === host.id ? 'Destination PC ' : '';
                return '<button type="button" class="atom6-device atom6-host-device atom8-device-button atom8-host-button' + pingSelection + '" data-device-kind="host" data-device-id="' + host.id + '" data-lan-id="' + lan.id + '" aria-label="' + atom6Escape(pingRole + (atom8PingState.active ? 'select ' : 'configure ') + host.label) + '">' +
                    atom8StatusDot(status, 'host', host.id) + '<i class="fa-solid fa-desktop" aria-hidden="true"></i><span>' + atom6Escape(host.label) + '</span><small>' + atom6Escape(value) + '</small></button>';
            }).join('');
            return '<div class="atom6-lan-branch atom8-lan-branch" aria-label="LAN ' + lan.number + ' topology">' +
                '<div class="atom6-device atom6-switch-device" data-lan-id="' + lan.id + '"><i class="fa-solid fa-network-wired" aria-hidden="true"></i><span>Switch</span></div>' +
                '<div class="atom8-host-grid">' + hosts + '</div>' +
                '<div class="atom6-topology-lan-label"><strong>LAN ' + lan.number + '</strong><span>' + atom6Escape(lan.label) + '</span><small>' + lan.hosts + ' hosts required</small></div></div>';
        }).join('');
        return '<div class="atom6-topology-site atom8-router-site"><button type="button" class="atom6-device atom6-router-device atom8-device-button atom8-router-button" data-device-kind="router" data-device-id="' + router.id + '" data-router-id="' + router.id + '">' +
            atom8StatusDot(routerStatus) + '<i class="fa-solid fa-code-branch" aria-hidden="true"></i><span>Router ' + router.number + '</span></button>' +
            '<div class="atom6-lan-branches atom8-router-lans' + (scenario.lans.filter(lan => lan.routerId === router.id).length > 1 ? ' has-multiple' : '') + '">' + lans + '</div></div>';
    }).join('');
    const topologyInstruction = atom8PingState.active ?
        (atom8PingState.mode === 'official' ? (atom8PingState.running ? 'Visualizing an official scored test case.' : 'Preparing the official test path.') :
            (atom8PingState.outcome ? 'Self-test complete. Select another source PC to create a new pair.' : atom8PingState.running ? 'Visualizing the self-test packet path.' : atom8PingState.sourceId ? 'Select the destination PC.' : 'Select the source PC.')) :
        (atom8WorkspaceMode === 'official' ? 'Official test cases run from the companion list.' : atom8WorkspaceMode === 'self-test' ? 'Select the source PC, then the destination PC.' : 'Select a router or host to configure it. Switches require no configuration.');
    const zoomPercent = Math.round(atom8TopologyZoom * 100);
    return '<section class="atom6-topology atom8-topology' + (atom8PingState.active ? ' atom8-ping-mode' : '') + '" aria-label="Interactive network topology"><div class="atom6-topology-heading"><div><span>Interactive Deployment</span><h3>Network Topology</h3></div>' +
        '<div class="atom8-topology-heading-tools"><small class="atom8-topology-instruction">' + topologyInstruction + '</small><div class="atom8-zoom-controls" aria-label="Topology zoom controls">' +
        '<button type="button" class="atom8-zoom-out" aria-label="Zoom out"><i class="fa-solid fa-minus" aria-hidden="true"></i></button><input class="atom8-zoom-slider" type="range" min="' + minZoom + '" max="' + maxZoom + '" step="' + (Number(viewConfig.zoomStep) || 0.05) + '" value="' + atom8TopologyZoom + '" aria-label="Topology zoom"><output>' + zoomPercent + '%</output><button type="button" class="atom8-zoom-in" aria-label="Zoom in"><i class="fa-solid fa-plus" aria-hidden="true"></i></button><button type="button" class="atom8-zoom-reset" aria-label="Reset topology view" title="Reset view"><i class="fa-solid fa-arrows-to-dot" aria-hidden="true"></i></button></div></div></div>' +
        '<div class="atom6-topology-scroll atom8-topology-viewport" aria-label="Topology canvas. Drag to pan."><div class="atom8-topology-zoom-plane" data-base-width="' + canvasWidth + '" data-base-height="' + canvasHeight + '" style="width:' + scaledWidth + 'px;height:' + scaledHeight + 'px"><div class="atom6-topology-canvas atom8-topology-canvas" style="width:' + canvasWidth + 'px;transform:scale(' + atom8TopologyZoom + ')"><svg class="atom6-wan-overlay" style="height:' + overlayHeight + 'px" viewBox="0 0 ' + canvasWidth + ' ' + overlayHeight + '" preserveAspectRatio="none" aria-label="Serial WAN connections">' + wanPaths + '</svg>' +
        '<div class="atom6-topology-router-row atom8-topology-router-row" style="padding-top:' + routerTop + 'px">' + routerSites + '</div></div></div></div></section>';
}

function atom8BuildPanel(ex) {
    const scenario = ex.scenario;
    const score = ex.score + '/' + ex.answers.length;
    const isAtom9 = ex.type === 'atom9';
    const atom9Position = isAtom9 ? Math.max(0, atom9QuestionIds.indexOf(activeDeploymentExerciseKey)) : -1;
    const panelIndex = isAtom9 ? 'I' + (atom9Position + 1) : 'A8';
    const panelTitle = isAtom9 ? ex.label : 'Apply Your VLSM Design';
    const answerKeyButton = atom8AnswerKeyEnabled(ex) ?
        '<button type="button" class="atom8-populate-key" title="Replace the current item configuration with its generated answer key"><i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i><span>Populate Answer Key</span></button>' : '';
    const resetItemButton = isAtom9 ?
        '<button type="button" class="atom9-reset-item" title="Clear all saved configuration and test results for this item"' + (isRetryAllowed() ? '' : ' disabled') + '><i class="fa-solid fa-rotate-left" aria-hidden="true"></i><span>Reset Item</span></button>' : '';
    const panelActions = resetItemButton || answerKeyButton ? '<div class="atom8-panel-actions">' + resetItemButton + answerKeyButton + '</div>' : '';
    const busy = atom8PingState.running || atom8OfficialRunAllActive || atom8SelfRunAllActive || Object.values(ex.atom8State.officialTests?.results || {}).some(result => result.status === 'running');
    const modeButton = (mode, icon, label) => '<button type="button" class="atom8-mode-tab' + (atom8WorkspaceMode === mode ? ' active' : '') + '" data-mode="' + mode + '" aria-pressed="' + (atom8WorkspaceMode === mode) + '"' + (busy ? ' disabled' : '') + '><i class="fa-solid ' + icon + '" aria-hidden="true"></i><span>' + label + '</span></button>';
    const requirements = atom8BuildRequirementsModal(ex);
    const subnetMapEnabled = atom8SubnetDiagramEnabled(ex);
    const subnetMapButton = subnetMapEnabled ? '<button type="button" class="atom8-subnetmap-open"><i class="fa-solid fa-diagram-project" aria-hidden="true"></i><span>Subnet Diagram</span></button>' : '';
    const subnetMapModal = subnetMapEnabled ? atom8BuildSubnetMapModal(ex) : '';
    const rail = atom8WorkspaceMode === 'official' ? atom8BuildOfficialTests(ex) : atom8WorkspaceMode === 'self-test' ? atom8BuildConnectivityTest(ex) : '';
    const resetConfirmation = isAtom9 ? '<div class="atom9-reset-confirm-modal" hidden><button type="button" class="atom9-reset-cancel atom9-reset-backdrop" aria-label="Cancel item reset"></button><section class="atom9-reset-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="atom9ResetTitle"><div class="atom9-reset-confirm-icon"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i></div><div><span>Reset current item</span><h3 id="atom9ResetTitle">Clear all configuration for ' + atom6Escape(panelTitle) + '?</h3><p>The seeded network and requirements will stay the same. Device settings, self-test pairs, official results, and this item’s score will be cleared.</p></div><footer><button type="button" class="secondary-btn atom9-reset-cancel">Cancel</button><button type="button" class="atom9-reset-confirm"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i> Reset Item</button></footer></section></div>' : '';
    return '<section class="panel atom8-panel"><div class="panel-head"><span class="panel-index">' + panelIndex + '</span><div><h2>' + atom6Escape(panelTitle) + '</h2><p>Validation dots provide configuration feedback. Only official test cases determine the score.</p></div>' + panelActions + '<span class="badge atom1-score-badge" id="atom8ScoreBadge">' + score + '</span></div>' +
        '<div class="atom8-context-bar' + (subnetMapEnabled ? ' has-subnet-map' : '') + '"><div class="atom8-parent-context"><span><small>Primary allocation source</small>Parent Network</span><strong>' + scenario.parent.network + '/' + scenario.parent.cidr + '</strong></div><button type="button" class="atom8-requirements-open"><i class="fa-solid fa-list-check" aria-hidden="true"></i><span>View Requirements</span></button>' + subnetMapButton + '<div class="atom8-score-context"><small>Score</small><strong>' + score + '</strong></div></div>' +
        '<nav class="atom8-mode-tabs" aria-label="Deployment workflow modes">' + modeButton('configure', 'fa-sliders', 'Configure') + modeButton('self-test', 'fa-flask', 'Self-Test') + modeButton('official', 'fa-clipboard-check', 'Official Test') + '</nav>' +
        '<div class="atom8-mode-workspace ' + atom8WorkspaceMode + '"><div class="atom8-topology-stage">' + atom8BuildTopology(ex) + '</div>' + rail + '</div>' + requirements + subnetMapModal + resetConfirmation + '</section>';
}

function atom8BuildRequirementsModal(ex) {
    const lanCards = ex.scenario.lans.map(lan => '<article class="atom6-requirement-card atom6-lan-card"><div class="atom6-requirement-type">LAN ' + lan.number + '</div><div class="atom6-requirement-name">' + atom6Escape(lan.label) + '</div><strong>' + lan.hosts + ' hosts</strong></article>');
    const wanCards = ex.scenario.wans.map(wan => '<article class="atom6-requirement-card atom6-wan-card"><div class="atom6-requirement-type">WAN ' + wan.number + '</div><div class="atom6-requirement-name">Point-to-Point</div><strong>' + wan.requiredIp + ' usable IP' + (wan.requiredIp === 1 ? '' : 's') + '</strong></article>');
    return '<div class="atom8-requirements-modal" hidden><button type="button" class="atom8-requirements-backdrop" aria-label="Close requirements"></button><section class="atom8-requirements-dialog" role="dialog" aria-modal="true" aria-labelledby="atom8RequirementsTitle"><header><div><span>Seeded Scenario</span><h3 id="atom8RequirementsTitle">LAN and WAN Requirements</h3><p>Use this clean list while planning your VLSM allocation.</p></div><button type="button" class="atom8-requirements-close" aria-label="Close requirements"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></header><div class="atom6-parent-network"><span><small>Primary allocation source</small>Parent Network</span><strong>' + ex.scenario.parent.network + '/' + ex.scenario.parent.cidr + '</strong></div><div class="atom6-requirement-grid">' + lanCards.concat(wanCards).join('') + '</div></section></div>';
}

// =====================================================================
// SUBNET DIAGRAM (Atom 9; available to Atom 8 through its own flag)
// Shows how the parent network was carved up: Parent Network -> subnets
// -> subnets of a subnet -> ... Every step is one table with the SAME
// structure (index, network, first, last, broadcast, mask/CIDR). A curved
// line connects the row that was subdivided to the table created from it,
// and each row that ends up serving a LAN or WAN carries a prominent label.
// The geometry is computed, not measured, so it renders correctly even when
// the modal is hidden or zoomed.
// =====================================================================
const ATOM8_SUBNET_MAP = {
    // Compact card layout: width is fixed per card, so horizontal size only
    // grows with the number of nested splits; expanding a subnet adds height.
    tableWidth: 420,
    columnGap: 90,
    tableGap: 28,
    pad: 24,
    headerHeight: 60,
    rowHeight: 58,
    detailHeight: 64,
    gapHeight: 34,
    collapseMinRows: 10,
    collapseRunLength: 4,
    minZoom: 0.4,
    maxZoom: 1.4,
    zoomStep: 0.1
};

function atom8BuildSubnetMapModel(scenario, expanded) {
    const cfg = ATOM8_SUBNET_MAP;
    const solution = scenario.solution;
    const parentBlock = atom6Block(scenario.parent.networkInt, scenario.parent.cidr);
    const tables = [{
        id: 't0', depth: 0, kind: 'root', step: 0, chip: 'Start', title: 'Parent Network',
        rows: [{ index: 0, block: parentBlock, use: null, childId: null }],
        parentRow: null, parentTable: null
    }];

    // A source block is always an exact, still-unassigned row of an earlier
    // table (or the parent itself), because allocation draws from the pool of
    // blocks that earlier splits left behind.
    const findFreeRow = block => {
        for (const table of tables) {
            for (const row of table.rows) {
                if (!row.use && !row.childId && row.block.networkInt === block.networkInt && row.block.cidr === block.cidr) {
                    return { table, row };
                }
            }
        }
        return null;
    };

    let step = 0;
    const addStep = (source, blocks, uses, purpose) => {
        const holder = findFreeRow(source);
        if (!holder || !blocks.length) return;
        const first = blocks[0];
        // The pool block already has the required size: nothing to subdivide,
        // so the existing row is simply labelled with its LAN/WAN.
        if (blocks.length === 1 && first.networkInt === source.networkInt && first.cidr === source.cidr) {
            if (uses[0]) uses[0].purpose = 'Allocated for ' + purpose;
            holder.row.use = uses[0] || null;
            return;
        }
        // Cards are numbered as "Split N", counting only splits that are
        // drawn. An allocation that just labels an existing pool row (above)
        // is not a split, so it must not consume a number.
        step += 1;
        uses.forEach(use => { if (use) use.purpose = 'Carved for ' + purpose; });
        const table = {
            id: 't' + tables.length, depth: holder.table.depth + 1, kind: 'split', step,
            chip: 'Split ' + step,
            title: source.network + '/' + source.cidr + ' → /' + first.cidr,
            rows: blocks.map((block, i) => ({ index: i, block, use: uses[i] || null, childId: null })),
            parentRow: holder.row, parentTable: holder.table
        };
        holder.row.childId = table.id;
        tables.push(table);
    };

    const lanById = Object.fromEntries(scenario.lans.map(lan => [lan.id, lan]));
    (solution.lanAllocations || []).forEach(allocation => {
        const lan = lanById[allocation.lanId];
        if (!lan) return;
        const use = { kind: 'lan', label: 'LAN ' + lan.number, name: lan.label, detail: lan.hosts + ' hosts required' };
        addStep(allocation.source, allocation.generated, [use],
            'LAN ' + lan.number + ' · ' + lan.label + ' (' + lan.hosts + ' hosts → /' + allocation.assigned.cidr + ')');
    });
    if (solution.wan && solution.wan.source) {
        const wanById = Object.fromEntries(scenario.wans.map(wan => [wan.id, wan]));
        const uses = solution.wan.assignments.map(assignment => {
            const wan = wanById[assignment.wanId];
            return { kind: 'wan', label: 'WAN ' + (wan ? wan.number : '?'), name: 'Point-to-point', detail: (wan ? wan.requiredIp : 2) + ' usable IPs required' };
        });
        addStep(solution.wan.source, solution.wan.generated, uses,
            uses.length + ' WAN link' + (uses.length === 1 ? '' : 's') + ' (/' + (solution.wan.generated[0] ? solution.wan.generated[0].cidr : 30) + ' each)');
    }

    // Collapse long runs of untouched, unused subnets so a big split (for
    // example a /24 into /28s) stays readable. Used and subdivided rows are
    // never collapsed, so every connector start stays visible.
    tables.forEach(table => {
        const visible = [];
        let run = [];
        const flush = () => {
            if (table.rows.length > cfg.collapseMinRows && run.length >= cfg.collapseRunLength) {
                visible.push({ gap: true, count: run.length, from: run[0].index, to: run[run.length - 1].index });
            } else {
                run.forEach(row => visible.push(row));
            }
            run = [];
        };
        table.rows.forEach(row => {
            if (!row.use && !row.childId) run.push(row);
            else { flush(); visible.push(row); }
        });
        flush();
        table.visible = visible;
        let bodyHeight = 0;
        visible.forEach(item => {
            if (item.gap) {
                item.h = cfg.gapHeight;
            } else {
                item.key = table.id + ':' + item.index;
                item.open = !!(expanded && expanded.has(item.key));
                item.h = cfg.rowHeight + (item.open ? cfg.detailHeight : 0);
            }
            bodyHeight += item.h;
        });
        table.height = 2 + cfg.headerHeight + bodyHeight;
    });

    // Column per depth; tables of one depth stack top to bottom. A child is
    // placed level with the row it was split from whenever space allows.
    const nextFree = {};
    tables.forEach(table => {
        table.x = cfg.pad + table.depth * (cfg.tableWidth + cfg.columnGap);
        const desired = table.parentRow ? table.parentRow.cy - cfg.headerHeight / 2 - 1 : cfg.pad;
        table.y = Math.max(desired, nextFree[table.depth] ?? cfg.pad);
        nextFree[table.depth] = table.y + table.height + cfg.tableGap;
        let rowTop = table.y + 1 + cfg.headerHeight;
        table.visible.forEach(item => {
            if (!item.gap) item.cy = rowTop + cfg.rowHeight / 2;
            rowTop += item.h;
        });
    });

    const maxDepth = Math.max(...tables.map(table => table.depth));
    const width = cfg.pad * 2 + (maxDepth + 1) * cfg.tableWidth + maxDepth * cfg.columnGap;
    const height = Math.max(...Object.values(nextFree)) - cfg.tableGap + cfg.pad;
    return { tables, width, height };
}

function atom8SubnetMapUseHtml(row, tableById) {
    if (row.use) {
        const icon = row.use.kind === 'lan' ? 'fa-network-wired' : 'fa-link';
        return '<span class="atom8-subnetmap-use is-' + row.use.kind + '" title="' + atom6Escape(row.use.label + ' · ' + row.use.name + ' · ' + row.use.detail + (row.use.purpose ? '\n' + row.use.purpose : '')) + '">' +
            '<i class="fa-solid ' + icon + '" aria-hidden="true"></i><b>' + atom6Escape(row.use.label) + '</b><em>' + atom6Escape(row.use.name) + '</em></span>';
    }
    if (row.childId) {
        const child = tableById[row.childId];
        return '<span class="atom8-subnetmap-use is-split"><i class="fa-solid fa-code-branch" aria-hidden="true"></i><b>Subdivided</b><em>→ ' + atom6Escape(child ? child.chip : '') + '</em></span>';
    }
    return '<span class="atom8-subnetmap-use is-free">Available</span>';
}

function atom8BuildSubnetMap(ex, expanded) {
    const cfg = ATOM8_SUBNET_MAP;
    const model = atom8BuildSubnetMapModel(ex.scenario, expanded);
    const tableById = Object.fromEntries(model.tables.map(table => [table.id, table]));

    const links = model.tables.filter(table => table.parentRow).map(table => {
        const from = table.parentTable;
        const x1 = from.x + cfg.tableWidth;
        const y1 = table.parentRow.cy;
        const x2 = table.x;
        const y2 = table.y + 1 + cfg.headerHeight / 2;
        const dx = Math.max(40, (x2 - x1) * 0.55);
        const label = '/' + table.parentRow.block.cidr + ' → /' + table.rows[0].block.cidr;
        return '<path class="atom8-subnetmap-link" d="M ' + x1 + ' ' + y1 + ' C ' + (x1 + dx) + ' ' + y1 + ', ' + (x2 - dx) + ' ' + y2 + ', ' + x2 + ' ' + y2 + '"></path>' +
            '<circle class="atom8-subnetmap-dot" cx="' + x1 + '" cy="' + y1 + '" r="5"></circle>' +
            '<circle class="atom8-subnetmap-dot" cx="' + x2 + '" cy="' + y2 + '" r="5"></circle>' +
            '<text class="atom8-subnetmap-link-label" x="' + ((x1 + x2) / 2) + '" y="' + (((y1 + y2) / 2) - 9) + '" text-anchor="middle">' + label + '</text>';
    }).join('');

    // A card is one block cut into equal pieces, so its mask and usable-host
    // count are the same for every row. State them once, in the header.
    const headerMeta = table => {
        const block = table.rows[0].block;
        const hosts = block.usableIp + ' usable host' + (block.usableIp === 1 ? '' : 's') + (table.kind === 'root' ? '' : ' each');
        return '<small class="atom8-subnetmap-meta"><span><code>' + atom6Escape(block.mask.join('.')) + '</code></span><span>' + hosts + '</span></small>';
    };

    const field = (label, value) => '<div><small>' + label + '</small><code>' + atom6Escape(value) + '</code></div>';

    const cards = model.tables.map(table => {
        const rows = table.visible.map(row => {
            if (row.gap) {
                return '<div class="atom8-subnetmap-gap" style="height:' + cfg.gapHeight + 'px">⋯ ' + row.count + ' more available subnets · index ' + row.from + '–' + row.to + '</div>';
            }
            const block = row.block;
            const state = row.use ? 'is-' + row.use.kind : row.childId ? 'is-split' : 'is-free';
            const detailId = 'atom8Sm-' + row.key.replace(':', '-');
            const detail = row.open ?
                '<div class="atom8-subnetmap-detail" id="' + detailId + '" style="height:' + cfg.detailHeight + 'px">' +
                field('First usable', block.first) + field('Last usable', block.last) + field('Broadcast', block.broadcast) + '</div>' : '';
            const childTable = row.childId ? tableById[row.childId] : null;
            const jumpButton = childTable ?
                '<button type="button" class="atom8-subnetmap-use is-split atom8-subnetmap-jump" data-target-table="' + childTable.id + '" aria-label="Subdivided into ' + atom6Escape(childTable.chip) + '. Jump to that card." title="Jump to ' + atom6Escape(childTable.chip) + '">' +
                '<i class="fa-solid fa-code-branch" aria-hidden="true"></i><b>Subdivided</b><em>→ ' + atom6Escape(childTable.chip) + '</em></button>' : '';
            return '<div class="atom8-subnetmap-item ' + state + (row.open ? ' is-open' : '') + (childTable ? ' has-jump' : '') + '" style="height:' + row.h + 'px">' +
                '<button type="button" class="atom8-subnetmap-row" data-row-key="' + row.key + '" aria-expanded="' + row.open + '"' + (row.open ? ' aria-controls="' + detailId + '"' : '') + ' style="height:' + cfg.rowHeight + 'px">' +
                '<span class="idx">' + row.index + '</span>' +
                '<span class="main"><strong>' + block.network + '<i>/' + block.cidr + '</i></strong><small>' + block.mask.join('.') + '</small></span>' +
                '<span class="use' + (childTable ? ' is-jump-space' : '') + '"' + (childTable ? ' aria-hidden="true"' : '') + '>' + atom8SubnetMapUseHtml(row, tableById) + '</span>' +
                '<i class="fa-solid fa-chevron-down chev" aria-hidden="true"></i></button>' + jumpButton + detail + '</div>';
        }).join('');
        return '<section class="atom8-subnetmap-card is-' + table.kind + '" data-table-id="' + table.id + '" tabindex="-1" style="left:' + table.x + 'px;top:' + table.y + 'px;width:' + cfg.tableWidth + 'px;height:' + table.height + 'px" aria-label="' + atom6Escape(table.chip + ': ' + table.title) + '">' +
            '<header style="height:' + cfg.headerHeight + 'px"><span class="atom8-subnetmap-chip">' + atom6Escape(table.chip) + '</span><div><strong>' + atom6Escape(table.title) + '</strong>' + headerMeta(table) + '</div></header>' +
            rows + '</section>';
    }).join('');

    return '<div class="atom8-subnetmap-plane" data-base-width="' + model.width + '" data-base-height="' + model.height + '" data-zoom="1" style="width:' + model.width + 'px;height:' + model.height + 'px">' +
        '<div class="atom8-subnetmap-canvas" style="width:' + model.width + 'px;height:' + model.height + 'px">' +
        '<svg class="atom8-subnetmap-links" width="' + model.width + '" height="' + model.height + '" viewBox="0 0 ' + model.width + ' ' + model.height + '" aria-hidden="true">' + links + '</svg>' + cards + '</div></div>';
}

// Re-renders the diagram after a subnet is expanded or collapsed. Layout is
// recomputed (heights change), then zoom and scroll position are restored.
function atom8RenderSubnetMap(modal, ex) {
    const viewport = modal?.querySelector('.atom8-subnetmap-viewport');
    if (!viewport) return;
    const prevPlane = viewport.querySelector('.atom8-subnetmap-plane');
    const zoom = prevPlane ? Number(prevPlane.dataset.zoom) || 1 : null;
    const left = viewport.scrollLeft;
    const top = viewport.scrollTop;
    viewport.innerHTML = atom8BuildSubnetMap(ex, modal._atom8OpenRows);
    if (zoom) {
        viewport.querySelector('.atom8-subnetmap-plane').dataset.zoom = String(zoom);
        atom8ApplySubnetMapZoom(modal, zoom);
        viewport.scrollLeft = left;
        viewport.scrollTop = top;
    }
}

function atom8BuildSubnetMapModal(ex) {
    return '<div class="atom8-subnetmap-modal" hidden><button type="button" class="atom8-subnetmap-backdrop" tabindex="-1" aria-label="Close subnet diagram"></button>' +
        '<section class="atom8-subnetmap-dialog" role="dialog" aria-modal="true" aria-labelledby="atom8SubnetMapTitle" tabindex="-1">' +
        '<header><div><span>VLSM Allocation Map</span><h3 id="atom8SubnetMapTitle">Subnet Diagram · ' + ex.scenario.parent.network + '/' + ex.scenario.parent.cidr + '</h3>' +
        '<p>Each card is one split of a subnet into smaller subnets, and a curved line leads from the subnet that was divided to the card created from it. Select a subnet to show its usable range and broadcast address, or select Subdivided to jump to its split. Scroll or drag to pan; hold Ctrl or Cmd and scroll to zoom.</p></div>' +
        '<div class="atom8-subnetmap-tools"><div class="atom8-subnetmap-zoom" aria-label="Diagram zoom controls">' +
        '<button type="button" class="atom8-subnetmap-zoom-out" aria-label="Zoom out"><i class="fa-solid fa-minus" aria-hidden="true"></i></button>' +
        '<span class="atom8-subnetmap-zoom-label">100%</span>' +
        '<button type="button" class="atom8-subnetmap-zoom-in" aria-label="Zoom in"><i class="fa-solid fa-plus" aria-hidden="true"></i></button>' +
        '<button type="button" class="atom8-subnetmap-zoom-fit" aria-label="Fit diagram to window" title="Fit to window"><i class="fa-solid fa-maximize" aria-hidden="true"></i></button></div>' +
        '<button type="button" class="atom8-subnetmap-close" aria-label="Close subnet diagram"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></div></header>' +
        '<ul class="atom8-subnetmap-legend" aria-label="Legend"><li><span class="atom8-subnetmap-use is-lan"><b>LAN</b></span> serves a LAN</li><li><span class="atom8-subnetmap-use is-wan"><b>WAN</b></span> serves a WAN link</li>' +
        '<li><span class="atom8-subnetmap-use is-split"><b>Subdivided</b></span> split again into smaller subnets</li><li><span class="atom8-subnetmap-use is-free">Available</span> left in the pool</li></ul>' +
        '<div class="atom8-subnetmap-viewport" tabindex="0" aria-label="Subnet diagram. Drag or scroll to pan. Hold Ctrl or Command and scroll to zoom."></div></section></div>';
}

function atom8ApplySubnetMapZoom(modal, zoom, focus) {
    const plane = modal?.querySelector('.atom8-subnetmap-plane');
    const canvas = modal?.querySelector('.atom8-subnetmap-canvas');
    if (!plane || !canvas) return;
    const cfg = ATOM8_SUBNET_MAP;
    const viewport = modal.querySelector('.atom8-subnetmap-viewport');
    const prevZoom = Number(plane.dataset.zoom) || 1;
    const z = Math.round(Math.min(cfg.maxZoom, Math.max(cfg.minZoom, zoom)) * 1000) / 1000;

    // Remember which diagram point sits under the focus (the mouse pointer
    // for wheel zoom, otherwise the viewport centre) so the view stays on it
    // after the zoom, instead of jumping toward the corner.
    const fx = focus ? focus.x : (viewport ? viewport.clientWidth / 2 : 0);
    const fy = focus ? focus.y : (viewport ? viewport.clientHeight / 2 : 0);
    const anchor = viewport ? {
        x: (viewport.scrollLeft + fx) / prevZoom,
        y: (viewport.scrollTop + fy) / prevZoom
    } : null;

    plane.style.width = Math.ceil(Number(plane.dataset.baseWidth) * z) + 'px';
    plane.style.height = Math.ceil(Number(plane.dataset.baseHeight) * z) + 'px';
    canvas.style.transform = 'scale(' + z + ')';
    plane.dataset.zoom = String(z);
    const label = modal.querySelector('.atom8-subnetmap-zoom-label');
    if (label) label.textContent = Math.round(z * 100) + '%';

    if (anchor && z !== prevZoom) {
        viewport.scrollLeft = Math.max(0, anchor.x * z - fx);
        viewport.scrollTop = Math.max(0, anchor.y * z - fy);
    }
}

function atom8FitSubnetMap(modal) {
    const viewport = modal?.querySelector('.atom8-subnetmap-viewport');
    const plane = modal?.querySelector('.atom8-subnetmap-plane');
    if (!viewport || !plane) return;
    const availableWidth = Math.max(200, viewport.clientWidth - 24);
    const availableHeight = Math.max(200, viewport.clientHeight - 24);
    atom8ApplySubnetMapZoom(modal, Math.min(
        1,
        availableWidth / Number(plane.dataset.baseWidth),
        availableHeight / Number(plane.dataset.baseHeight)
    ));
    viewport.scrollLeft = 0;
    viewport.scrollTop = 0;
}

// Closes the diagram, saves its view and returns focus to the button that
// opened it (or, if the panel re-rendered meanwhile, the current panel's
// Subnet Diagram button).
function atom8CloseSubnetMap(modal) {
    if (!modal || modal.hidden) return;
    atom8SaveSubnetMapView(modal);
    modal.hidden = true;
    const opener = modal._atom8Opener;
    modal._atom8Opener = null;
    const target = opener && opener.isConnected
        ? opener
        : document.querySelector(atom8CurrentContainerSelector() + ' .atom8-subnetmap-open');
    target?.focus();
}

// Scrolls a split card into view (centred, or top-aligned when taller than
// the viewport), moves focus to it and briefly highlights it.
function atom8JumpToSubnetMapCard(modal, tableId) {
    const viewport = modal?.querySelector('.atom8-subnetmap-viewport');
    const plane = viewport?.querySelector('.atom8-subnetmap-plane');
    const card = viewport?.querySelector('.atom8-subnetmap-card[data-table-id="' + tableId + '"]');
    if (!viewport || !plane || !card) return;
    const zoom = Number(plane.dataset.zoom) || 1;
    const x = parseFloat(card.style.left) || 0;
    const y = parseFloat(card.style.top) || 0;
    const w = parseFloat(card.style.width) || ATOM8_SUBNET_MAP.tableWidth;
    const h = parseFloat(card.style.height) || 0;
    const left = (x + w / 2) * zoom - viewport.clientWidth / 2;
    const top = h * zoom > viewport.clientHeight - 32
        ? y * zoom - 16
        : (y + h / 2) * zoom - viewport.clientHeight / 2;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    viewport.scrollTo({ left: Math.max(0, left), top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' });
    card.focus({ preventScroll: true });
    viewport.querySelectorAll('.atom8-subnetmap-card.is-jump-target').forEach(el => el.classList.remove('is-jump-target'));
    // Remove, force a reflow, then add, so the radar pulse restarts even when
    // the same card is targeted twice in a row.
    card.classList.remove('is-jump-target');
    void card.offsetWidth;
    card.classList.add('is-jump-target');
    clearTimeout(modal._atom8JumpTimer);
    modal._atom8JumpTimer = setTimeout(() => card.classList.remove('is-jump-target'), 2400);
}

// Focus trap: while the diagram is open, Tab / Shift+Tab cycle inside the
// dialog instead of reaching the page behind it.
document.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const modal = document.querySelector('.atom8-subnetmap-modal:not([hidden])');
    const dialog = modal?.querySelector('.atom8-subnetmap-dialog');
    if (!dialog) return;
    const focusable = Array.from(dialog.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
        .filter(el => el.getClientRects().length > 0);
    if (!focusable.length) { event.preventDefault(); dialog.focus(); return; }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (!dialog.contains(active)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
    } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
    }
});

// Remembers how each student last zoomed the diagram, per user and per
// browser (localStorage is browser-local, and every entry is keyed by the
// logged-in email, so students sharing a PC never inherit each other's view).
// "fit" (the default, and what the Fit button chooses) re-fits each diagram
// to the window, so a stale fit zoom is never applied to a differently sized
// diagram; "manual" keeps the exact zoom chosen with +/-, or the wheel. This
// is only the fallback for diagrams the student has not viewed yet; each
// diagram's own saved view (below) takes priority.
const ATOM8_SUBNET_MAP_ZOOM_KEY = 'subnetacadSubnetMapZoomByUser';
let atom8SubnetMapZoomPrefs = null;
let atom8SubnetMapZoomSaveTimer = null;

function atom8SubnetMapUserId() {
    return String(currentUser || 'anonymous').trim().toLowerCase();
}

function atom8SubnetMapZoomPrefsStore() {
    if (!atom8SubnetMapZoomPrefs) {
        try {
            const saved = JSON.parse(localStorage.getItem(ATOM8_SUBNET_MAP_ZOOM_KEY));
            atom8SubnetMapZoomPrefs = saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
        } catch (err) { atom8SubnetMapZoomPrefs = {}; }
    }
    return atom8SubnetMapZoomPrefs;
}

function atom8SubnetMapZoomPrefFor() {
    const saved = atom8SubnetMapZoomPrefsStore()[atom8SubnetMapUserId()];
    return saved && saved.mode === 'manual' && Number.isFinite(saved.zoom)
        ? { mode: 'manual', zoom: saved.zoom }
        : { mode: 'fit' };
}

function atom8RememberSubnetMapZoom(mode, zoom, modal) {
    atom8SubnetMapZoomPrefsStore()[atom8SubnetMapUserId()] = mode === 'manual' ? { mode: 'manual', zoom } : { mode: 'fit' };
    if (modal) {
        modal._atom8ZoomMode = mode;
        atom8ScheduleSubnetMapViewSave(modal);
    }
    // Debounced: wheel zoom fires many events per second.
    clearTimeout(atom8SubnetMapZoomSaveTimer);
    atom8SubnetMapZoomSaveTimer = setTimeout(() => {
        try { localStorage.setItem(ATOM8_SUBNET_MAP_ZOOM_KEY, JSON.stringify(atom8SubnetMapZoomPrefs)); }
        catch (err) { /* private mode or quota: the in-memory preference still applies */ }
    }, 250);
}

// Per-diagram view memory: zoom, pan position and expanded subnets are saved
// for each student + exercise item + parent network, so reopening the same
// diagram returns to where the student left off. Expanded rows are part of it
// because they change the diagram's height, which the saved pan depends on.
// A different seed (different parent network) never inherits a stale view.
const ATOM8_SUBNET_MAP_VIEWS_KEY = 'subnetacadSubnetMapViews';
const ATOM8_SUBNET_MAP_VIEWS_MAX = 60;
let atom8SubnetMapViewSaveTimer = null;

function atom8SubnetMapViewKey(ex) {
    const parent = ex.scenario.parent;
    return [atom8SubnetMapUserId(), activeDeploymentExerciseKey, parent.network + '/' + parent.cidr].join('|');
}

function atom8ReadSubnetMapViews() {
    try {
        const views = JSON.parse(localStorage.getItem(ATOM8_SUBNET_MAP_VIEWS_KEY));
        return views && typeof views === 'object' && !Array.isArray(views) ? views : {};
    } catch (err) { return {}; }
}

function atom8LoadSubnetMapView(key) {
    const view = atom8ReadSubnetMapViews()[key];
    return view && typeof view === 'object' ? view : null;
}

function atom8SaveSubnetMapView(modal) {
    // A hidden modal reports scroll 0, so never save from one.
    if (!modal || modal.hidden || !modal._atom8ViewKey) return;
    const viewport = modal.querySelector('.atom8-subnetmap-viewport');
    const plane = viewport?.querySelector('.atom8-subnetmap-plane');
    if (!plane) return;
    const views = atom8ReadSubnetMapViews();
    views[modal._atom8ViewKey] = {
        mode: modal._atom8ZoomMode === 'fit' ? 'fit' : 'manual',
        zoom: Number(plane.dataset.zoom) || 1,
        left: Math.round(viewport.scrollLeft),
        top: Math.round(viewport.scrollTop),
        open: Array.from(modal._atom8OpenRows || []),
        t: Date.now()
    };
    // Cap per user, so one student on a shared PC cannot evict another's views.
    const prefix = atom8SubnetMapUserId() + '|';
    const keys = Object.keys(views).filter(key => key.startsWith(prefix));
    if (keys.length > ATOM8_SUBNET_MAP_VIEWS_MAX) {
        keys.sort((a, b) => (views[a].t || 0) - (views[b].t || 0))
            .slice(0, keys.length - ATOM8_SUBNET_MAP_VIEWS_MAX)
            .forEach(key => { delete views[key]; });
    }
    try { localStorage.setItem(ATOM8_SUBNET_MAP_VIEWS_KEY, JSON.stringify(views)); }
    catch (err) { /* storage unavailable: the view just won't persist */ }
}

function atom8ScheduleSubnetMapViewSave(modal) {
    clearTimeout(atom8SubnetMapViewSaveTimer);
    atom8SubnetMapViewSaveTimer = setTimeout(() => atom8SaveSubnetMapView(modal), 250);
}

function atom8RestoreSubnetMapView(modal, saved) {
    const viewport = modal.querySelector('.atom8-subnetmap-viewport');
    if (!viewport) return;
    if (saved && saved.mode === 'manual' && Number.isFinite(saved.zoom)) {
        atom8ApplySubnetMapZoom(modal, saved.zoom);
        modal._atom8ZoomMode = 'manual';
    } else if (saved && saved.mode === 'fit') {
        atom8FitSubnetMap(modal);
        modal._atom8ZoomMode = 'fit';
    } else {
        // Never viewed: use the student's most recent zoom preference.
        atom8ApplySavedSubnetMapZoom(modal);
        modal._atom8ZoomMode = atom8SubnetMapZoomPrefFor().mode;
    }
    viewport.scrollLeft = Number.isFinite(saved?.left) ? saved.left : 0;
    viewport.scrollTop = Number.isFinite(saved?.top) ? saved.top : 0;
}

// Scroll events do not bubble, so listen in the capture phase.
document.addEventListener('scroll', event => {
    const viewport = event.target;
    if (!viewport?.classList?.contains('atom8-subnetmap-viewport')) return;
    atom8ScheduleSubnetMapViewSave(viewport.closest('.atom8-subnetmap-modal'));
}, true);

function atom8ApplySavedSubnetMapZoom(modal) {
    const pref = atom8SubnetMapZoomPrefFor();
    if (pref.mode === 'manual') atom8ApplySubnetMapZoom(modal, pref.zoom);
    else atom8FitSubnetMap(modal);
}

// Click-and-drag panning for the subnet diagram. Mouse and pen only: touch
// already pans natively through the viewport's own scrolling. The drag only
// "activates" after a few pixels of movement, so a plain click still reaches
// the subnet rows; the click that ends a real drag is swallowed. Presses on
// the native scrollbars are ignored.
let atom8SubnetMapDrag = null;
let atom8SubnetMapSuppressClick = false;
const ATOM8_SUBNET_MAP_DRAG_THRESHOLD = 4;

function atom8SubnetMapOnScrollbar(viewport, event) {
    const rect = viewport.getBoundingClientRect();
    const x = event.clientX - rect.left - viewport.clientLeft;
    const y = event.clientY - rect.top - viewport.clientTop;
    return x >= viewport.clientWidth || y >= viewport.clientHeight;
}

document.addEventListener('pointerdown', event => {
    if (event.button !== 0 || event.pointerType === 'touch') return;
    const viewport = event.target.closest?.('.atom8-subnetmap-viewport');
    if (!viewport || atom8SubnetMapOnScrollbar(viewport, event)) return;
    atom8SubnetMapDrag = {
        viewport,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        scrollLeft: viewport.scrollLeft,
        scrollTop: viewport.scrollTop,
        active: false
    };
});

document.addEventListener('pointermove', event => {
    const drag = atom8SubnetMapDrag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.active) {
        if (Math.hypot(dx, dy) < ATOM8_SUBNET_MAP_DRAG_THRESHOLD) return;
        drag.active = true;
        drag.viewport.classList.add('is-panning');
        try { drag.viewport.setPointerCapture(event.pointerId); } catch (err) { /* capture is optional */ }
        window.getSelection?.()?.removeAllRanges();
    }
    drag.viewport.scrollLeft = drag.scrollLeft - dx;
    drag.viewport.scrollTop = drag.scrollTop - dy;
});

function atom8EndSubnetMapDrag(event) {
    const drag = atom8SubnetMapDrag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    atom8SubnetMapDrag = null;
    if (!drag.active) return;
    drag.viewport.classList.remove('is-panning');
    try { drag.viewport.releasePointerCapture(event.pointerId); } catch (err) { /* already released */ }
    atom8SubnetMapSuppressClick = true;
    setTimeout(() => { atom8SubnetMapSuppressClick = false; }, 0);
}
document.addEventListener('pointerup', atom8EndSubnetMapDrag);
document.addEventListener('pointercancel', atom8EndSubnetMapDrag);
document.addEventListener('click', event => {
    if (!atom8SubnetMapSuppressClick) return;
    atom8SubnetMapSuppressClick = false;
    event.stopPropagation();
    event.preventDefault();
}, true);

// Ctrl/Cmd + mouse-wheel (or trackpad pinch) zoom over the diagram, centred
// on the pointer. Must be a non-passive listener so the browser does not
// zoom the whole page. Plain wheel scrolling is left alone so it pans, as do
// drag, the scrollbars and the arrow keys.
document.addEventListener('wheel', event => {
    const viewport = event.target.closest?.('.atom8-subnetmap-viewport');
    if (!viewport || atom8SubnetMapOnScrollbar(viewport, event)) return;
    const modal = viewport.closest('.atom8-subnetmap-modal');
    const plane = viewport.querySelector('.atom8-subnetmap-plane');
    if (!modal || !plane) return;
    // Plain wheel / two-finger scrolling pans the diagram natively. Only
    // Ctrl/Cmd + wheel (and trackpad pinch, which browsers report as
    // Ctrl + wheel) zooms.
    if (!(event.ctrlKey || event.metaKey)) return;
    event.preventDefault();
    let delta = event.deltaY;
    if (event.deltaMode === 1) delta *= 16;        // lines -> pixels
    else if (event.deltaMode === 2) delta *= 400;  // pages -> pixels
    delta = Math.max(-240, Math.min(240, delta));
    if (!delta) return;
    const rect = viewport.getBoundingClientRect();
    const focus = {
        x: event.clientX - rect.left - viewport.clientLeft,
        y: event.clientY - rect.top - viewport.clientTop
    };
    const current = Number(plane.dataset.zoom) || 1;
    atom8ApplySubnetMapZoom(modal, current * Math.exp(-delta * 0.0015), focus);
    atom8RememberSubnetMapZoom('manual', Number(plane.dataset.zoom), modal);
}, { passive: false });

function atom8SetWorkspaceMode(mode) {
    if (!['configure', 'self-test', 'official'].includes(mode) || atom8PingState.running || atom8OfficialRunAllActive || atom8SelfRunAllActive) return;
    atom8CancelPingAnimation();
    atom8WorkspaceMode = mode;
    atom8PingState.active = mode === 'self-test';
    atom8PingState.mode = mode === 'self-test' ? 'manual' : null;
    atom8PingState.caseId = null;
    atom8PingState.sourceId = null;
    atom8PingState.destinationId = null;
    atom8PingState.phase = mode === 'self-test' ? 'select-source' : 'idle';
    atom8PingState.outcome = null;
    atom8PingState.message = mode === 'self-test' ? 'Select the source PC in the topology.' : 'Select a test to begin.';
    renderAtom8View();
}

function renderAtom8View() {
    const isAtom9 = activeDeploymentExerciseKey.startsWith('atom9-');
    const nav = document.getElementById(isAtom9 ? 'nav-atom9' : 'nav-atom8');
    const container = atom8CurrentContainer();
    const ex = atom8CurrentExercise();
    const enabled = !!((isAtom9 ? QUESTION_CONFIG.atom9?.enabled : QUESTION_CONFIG.atom8?.enabled) && ex && ex.model);
    if (nav) nav.style.display = enabled ? '' : 'none';
    if (!container) return;
    if (!enabled) { container.innerHTML = ''; return; }
    const previousList = container.querySelector('.atom8-official-case-list');
    if (previousList && atom8ListScrollByMode[atom8RenderedWorkspaceMode] !== undefined) {
        atom8ListScrollByMode[atom8RenderedWorkspaceMode] = previousList.scrollTop;
    }
    const previousViewport = container.querySelector('.atom8-topology-viewport');
    if (previousViewport && atom8TopologyPanByMode[atom8RenderedWorkspaceMode]) {
        atom8TopologyPanByMode[atom8RenderedWorkspaceMode] = { x: previousViewport.scrollLeft, y: previousViewport.scrollTop };
    }
    ex.atom8State = ex.atom8State || atom8RestoreState(ex);
    atom8Validate(ex);
    atom8HideQuickReview();
    container.innerHTML = atom8BuildPanel(ex);
    atom8RenderedWorkspaceMode = atom8WorkspaceMode;
    const restoredList = container.querySelector('.atom8-official-case-list');
    if (restoredList && atom8ListScrollByMode[atom8WorkspaceMode] !== undefined) {
        const savedScrollTop = atom8ListScrollByMode[atom8WorkspaceMode];
        restoredList.scrollTop = savedScrollTop;
        requestAnimationFrame(() => {
            if (restoredList.isConnected) restoredList.scrollTop = savedScrollTop;
        });
    }
    const restoredViewport = container.querySelector('.atom8-topology-viewport');
    if (restoredViewport && atom8TopologyPanByMode[atom8WorkspaceMode]) {
        const savedPan = atom8TopologyPanByMode[atom8WorkspaceMode];
        restoredViewport.scrollLeft = savedPan.x;
        restoredViewport.scrollTop = savedPan.y;
        requestAnimationFrame(() => {
            if (!restoredViewport.isConnected) return;
            restoredViewport.scrollLeft = savedPan.x;
            restoredViewport.scrollTop = savedPan.y;
        });
    }
    atom8ScheduleTopologyConnections();
    updateAtom8NavScore();
    if (!container.dataset.atom8HandlersAttached) {
        container.dataset.atom8HandlersAttached = 'true';
        container.addEventListener('click', atom8HandleDeviceClick);
        container.addEventListener('input', atom8HandleConnectivityInput);
        container.addEventListener('pointerdown', atom8HandleTopologyPanStart);
        container.addEventListener('pointermove', atom8HandleTopologyPanMove);
        container.addEventListener('pointerup', atom8HandleTopologyPanEnd);
        container.addEventListener('pointercancel', atom8HandleTopologyPanEnd);
        container.addEventListener('mouseover', atom8HandleQuickReview);
        container.addEventListener('mousemove', atom8HandleQuickReview);
        container.addEventListener('mouseout', atom8HandleQuickReview);
        container.addEventListener('pointerover', atom8HandleQuickReview);
        container.addEventListener('pointermove', atom8HandleQuickReview);
        container.addEventListener('pointerout', atom8HandleQuickReview);
        container.addEventListener('scroll', atom8HideQuickReview, true);
    }
    if (!atom8HandlersAttached) {
        atom8HandlersAttached = true;
        document.addEventListener('click', atom8HandleModalClick);
    }
    if (!atom8ConnectionResizeBound) {
        atom8ConnectionResizeBound = true;
        window.addEventListener('resize', atom8ScheduleTopologyConnections);
    }
}

function atom8ScheduleTopologyConnections() {
    if (atom8ConnectionFrame !== null) cancelAnimationFrame(atom8ConnectionFrame);
    atom8ConnectionFrame = requestAnimationFrame(() => {
        atom8ConnectionFrame = requestAnimationFrame(() => {
            atom8ConnectionFrame = null;
            atom8DrawTopologyConnections();
        });
    });
}

function atom8DrawTopologyConnections() {
    const ex = atom8CurrentExercise();
    const canvas = document.querySelector(atom8CurrentContainerSelector() + ' .atom8-topology-canvas');
    if (!ex || !canvas || canvas.offsetWidth === 0) return;
    canvas.querySelector('.atom8-physical-links')?.remove();
    canvas.querySelectorAll('.atom8-port-review-hotspot').forEach(hotspot => hotspot.remove());
    const canvasRect = canvas.getBoundingClientRect();
    const width = canvas.offsetWidth;
    const height = Math.max(canvas.scrollHeight, canvas.offsetHeight);
    // The canvas itself is transformed for zooming. DOM rectangles are
    // reported in scaled viewport pixels, while SVG path coordinates remain
    // in the canvas's original coordinate system. Convert every measured
    // point back to that unscaled system so links scale exactly once with the
    // devices instead of drifting apart as zoom changes.
    const scaleX = canvasRect.width / width || 1;
    const scaleY = canvasRect.height / canvas.offsetHeight || scaleX;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'atom8-physical-links');
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.setAttribute('aria-hidden', 'true');
    const point = (element, edge, offsetX = 0) => {
        const rect = element.getBoundingClientRect();
        return {
            x: (rect.left - canvasRect.left + rect.width / 2) / scaleX + offsetX,
            y: ((edge === 'top' ? rect.top : rect.bottom) - canvasRect.top) / scaleY
        };
    };
    const addPath = (start, end, className, nodeA, nodeB) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const vertical = Math.max(24, (end.y - start.y) * 0.44);
        path.setAttribute('class', 'atom8-physical-link ' + className);
        path.dataset.nodeA = nodeA;
        path.dataset.nodeB = nodeB;
        path.setAttribute('d', 'M ' + start.x + ' ' + start.y + ' C ' + start.x + ' ' + (start.y + vertical) + ', ' + end.x + ' ' + (end.y - vertical) + ', ' + end.x + ' ' + end.y);
        svg.appendChild(path);
        return {
            path,
            pointAt(t) {
                const inverse = 1 - t;
                return {
                    x: inverse ** 3 * start.x + 3 * inverse ** 2 * t * start.x + 3 * inverse * t ** 2 * end.x + t ** 3 * end.x,
                    y: inverse ** 3 * start.y + 3 * inverse ** 2 * t * (start.y + vertical) + 3 * inverse * t ** 2 * (end.y - vertical) + t ** 3 * end.y
                };
            }
        };
    };
    const addPortLabel = (position, router, port, side, placement = 'above', targetSvg = svg) => {
        if (!port) return;
        const status = ex.atom8State.validation.ports[router.id + ':' + port.id] || 'gray';
        const portInput = ex.atom8State.routers[router.id]?.ports[port.id];
        const hasDceClock = port.dce && String(portInput?.clockRate || '').trim() !== '';
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'atom8-link-port-label');
        group.setAttribute('aria-label', port.name + ': ' + status + (hasDceClock ? ', DCE clock rate set' : ''));
        if (hasDceClock) {
            const clock = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            clock.setAttribute('class', 'atom8-dce-clock-icon');
            clock.setAttribute('x', position.x);
            clock.setAttribute('y', position.y - 8);
            clock.setAttribute('text-anchor', 'middle');
            clock.textContent = '\uf017';
            const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            title.textContent = 'DCE clock rate set';
            clock.appendChild(title);
            group.appendChild(clock);
        }
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('class', 'atom8-link-port-dot ' + status);
        dot.dataset.reviewKind = 'port';
        dot.dataset.reviewRouterId = router.id;
        dot.dataset.reviewPortId = port.id;
        dot.setAttribute('cx', position.x);
        dot.setAttribute('cy', position.y);
        dot.setAttribute('r', '4');
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        const placeLeft = side === 'left';
        label.setAttribute('x', position.x + (placeLeft ? -7 : 7));
        label.setAttribute('y', position.y + (placement === 'below' ? 14 : -5));
        label.setAttribute('text-anchor', placeLeft ? 'end' : 'start');
        label.textContent = port.shortName || port.name;
        group.append(dot, label);
        targetSvg.appendChild(group);
        const hotspot = document.createElement('span');
        hotspot.className = 'atom8-port-review-hotspot';
        hotspot.dataset.reviewKind = 'port';
        hotspot.dataset.reviewRouterId = router.id;
        hotspot.dataset.reviewPortId = port.id;
        hotspot.setAttribute('aria-label', (port.shortName || port.name) + ' quick review');
        hotspot.style.left = (position.x - 8) + 'px';
        hotspot.style.top = (position.y - 8) + 'px';
        canvas.appendChild(hotspot);
    };
    ex.scenario.lans.forEach(lan => {
        const routerModel = ex.model.routers.find(item => item.id === lan.routerId);
        const lanPort = routerModel?.ports.find(port => port.role === 'lan' && port.targetId === lan.id);
        const router = canvas.querySelector('[data-router-id="' + lan.routerId + '"]');
        const networkSwitch = canvas.querySelector('.atom6-switch-device[data-lan-id="' + lan.id + '"]');
        if (!router || !networkSwitch) return;
        const siblingLans = ex.scenario.lans.filter(item => item.routerId === lan.routerId);
        const lanIndex = siblingLans.findIndex(item => item.id === lan.id);
        const routerOffset = (lanIndex - (siblingLans.length - 1) / 2) * 22;
        const start = point(router, 'bottom', routerOffset);
        const end = point(networkSwitch, 'top');
        const connection = addPath(start, end, 'router-to-switch', 'router:' + lan.routerId, 'switch:' + lan.id);
        addPortLabel(connection.pointAt(0.36), routerModel, lanPort, end.x < start.x ? 'left' : 'right');
        const hosts = [...canvas.querySelectorAll('.atom8-host-button[data-lan-id="' + lan.id + '"]')];
        hosts.forEach((host, hostIndex) => {
            const switchOffset = (hostIndex - (hosts.length - 1) / 2) * 13;
            addPath(point(networkSwitch, 'bottom', switchOffset), point(host, 'top'), 'switch-to-host', 'switch:' + lan.id, 'host:' + host.dataset.deviceId);
        });
    });
    ex.scenario.wans.forEach(wan => {
        const fromRouter = ex.model.routers.find(router => router.id === wan.fromRouterId);
        const toRouter = ex.model.routers.find(router => router.id === wan.toRouterId);
        const fromElement = canvas.querySelector('[data-router-id="' + wan.fromRouterId + '"]');
        const toElement = canvas.querySelector('[data-router-id="' + wan.toRouterId + '"]');
        if (!fromRouter || !toRouter || !fromElement || !toElement) return;
        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();
        const leftToRight = fromRect.left < toRect.left;
        const serialPath = [...canvas.querySelectorAll('.atom6-wan-svg-path')].find(path =>
            path.dataset.nodeA === 'router:' + wan.fromRouterId && path.dataset.nodeB === 'router:' + wan.toRouterId
        );
        if (!serialPath) return;
        const pathLength = serialPath.getTotalLength();
        const interfaceOffset = Math.min(13, pathLength / 4);
        const fromPosition = serialPath.getPointAtLength(interfaceOffset);
        const toPosition = serialPath.getPointAtLength(pathLength - interfaceOffset);
        // Serial markers live in the same SVG as the serial cable. This keeps
        // each status dot centered on — and painted above — its actual path.
        const serialOverlay = serialPath.parentNode;
        addPortLabel(fromPosition, fromRouter, fromRouter.ports.find(port => port.role === 'wan' && port.targetId === wan.id), leftToRight ? 'right' : 'left', 'below', serialOverlay);
        addPortLabel(toPosition, toRouter, toRouter.ports.find(port => port.role === 'wan' && port.targetId === wan.id), leftToRight ? 'left' : 'right', 'below', serialOverlay);
    });
    canvas.prepend(svg);
}

function syncAtom8ViewDOM() {
    activeDeploymentExerciseKey = 'atom8-main';
    const ex = exerciseData['atom8-main'];
    if (!ex) return;
    ex.atom8State = atom8RestoreState(ex);
    atom8Validate(ex);
    renderAtom8View();
    updateSummaryPanel();
}

function updateAtom8NavScore() {
    const atom8Ex = exerciseData['atom8-main'];
    const atom8Score = document.getElementById('score-atom8');
    if (atom8Score && atom8Ex) atom8Score.textContent = atom8Ex.score + '/' + atom8Ex.answers.length;
    let atom9Got = 0;
    let atom9Total = 0;
    atom9QuestionIds.forEach(qid => {
        const ex = exerciseData[qid];
        if (!ex) return;
        atom9Got += Number(ex.score || 0);
        atom9Total += ex.answers.length;
    });
    const atom9Score = document.getElementById('score-atom9');
    if (atom9Score) {
        atom9Score.textContent = atom9Got + '/' + atom9Total;
        atom9Score.classList.toggle('completed-score', atom9Total > 0 && atom9Got === atom9Total);
        atom9Score.classList.toggle('partial-score', atom9Got > 0 && atom9Got < atom9Total);
    }
}

function atom8Input(label, kind, id, field, value, disabled) {
    return '<label><span>' + atom6Escape(label) + '</span><input type="text" data-config-kind="' + kind + '" data-config-id="' + id + '" data-field="' + field + '" value="' + atom6Escape(value || '') + '"' + (disabled ? ' disabled' : '') + '></label>';
}

function atom8HostIpRow(label, hostId, field, value, disabled) {
    return '<label class="atom8-windows-ip-row"><span>' + atom6Escape(label) + '</span><input type="text" inputmode="decimal" autocomplete="off" spellcheck="false" placeholder="0.0.0.0" data-config-kind="host" data-config-id="' + hostId + '" data-field="' + field + '" value="' + atom6Escape(value || '') + '"' + (disabled ? ' disabled' : '') + '></label>';
}

function atom8RouteEntry(route, index, disabled) {
    return '<fieldset class="atom8-config-group atom8-route-entry" data-route-index="' + index + '"><legend><span>Static Route ' + (index + 1) + '</span>' +
        (index > 0 && !disabled ? '<button type="button" class="atom8-remove-route" aria-label="Remove static route ' + (index + 1) + '"><i class="fa-solid fa-trash-can" aria-hidden="true"></i><span>Remove</span></button>' : '') +
        '</legend><div class="atom8-form-grid">' + atom8Input('Destination Network', 'route', index, 'destination', route.destination, disabled) +
        atom8Input('Subnet Mask', 'route', index, 'mask', route.mask, disabled) + atom8Input('Next-Hop Address', 'route', index, 'nextHop', route.nextHop, disabled) + '</div></fieldset>';
}

function atom8ReindexRouteEntries(modal) {
    const entries = [...modal.querySelectorAll('.atom8-route-entry')];
    entries.forEach((entry, index) => {
        entry.dataset.routeIndex = index;
        entry.querySelector('legend > span').textContent = 'Static Route ' + (index + 1);
        entry.querySelectorAll('[data-config-kind="route"]').forEach(input => { input.dataset.configId = index; });
        const remove = entry.querySelector('.atom8-remove-route');
        if (remove) remove.setAttribute('aria-label', 'Remove static route ' + (index + 1));
    });
    const add = modal.querySelector('.atom8-add-route');
    if (add) add.disabled = entries.length >= Number(add.dataset.maxRoutes);
}

function atom8OpenRouterModal(routerId) {
    const ex = atom8CurrentExercise();
    const router = ex.model.routers.find(item => item.id === routerId);
    const state = ex.atom8State.routers[routerId];
    const disabled = !!state.locked;
    const portNav = router.ports.map((port, index) => {
        const status = ex.atom8State.validation.ports[routerId + ':' + port.id] || 'gray';
        return '<button type="button" role="tab" class="atom8-config-nav-btn' + (index === 0 ? ' active' : '') + '" data-config-panel="port-' + port.id + '" aria-selected="' + (index === 0 ? 'true' : 'false') + '">' +
            atom8StatusDot(status) + '<span><strong>' + atom6Escape(port.name) + '</strong><small>' + (port.role === 'lan' ? 'LAN Interface' : 'Serial WAN Interface') + '</small></span><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>';
    }).join('');
    const portPanels = router.ports.map((port, index) => {
        const input = state.ports[port.id];
        const status = ex.atom8State.validation.ports[routerId + ':' + port.id] || 'gray';
        return '<section role="tabpanel" class="atom8-config-panel' + (index === 0 ? ' active' : '') + '" data-config-panel-content="port-' + port.id + '"' + (index === 0 ? '' : ' hidden') + '>' +
            '<div class="atom8-config-panel-head"><div class="atom8-config-panel-icon"><i class="fa-solid ' + (port.role === 'lan' ? 'fa-ethernet' : 'fa-arrows-left-right') + '" aria-hidden="true"></i></div><div><span>' + port.role.toUpperCase() + ' PORT SETTINGS</span><h3>' + atom6Escape(port.name) + '</h3><p>' + (port.role === 'lan' ? 'Configure the gateway interface for its connected LAN.' : 'Configure this endpoint of the point-to-point serial connection.') + '</p></div>' + atom8StatusDot(status) + '</div>' +
            '<fieldset class="atom8-config-group"><legend>IPv4 Configuration</legend><div class="atom8-form-grid">' +
            atom8Input('IPv4 Address', 'port', port.id, 'ip', input.ip, disabled) + atom8Input('Subnet Mask', 'port', port.id, 'mask', input.mask, disabled) +
            (port.dce ? atom8Input('DCE Clock Rate', 'port', port.id, 'clockRate', input.clockRate, disabled) : '') +
            '<label class="atom8-checkbox"><input type="checkbox" data-config-kind="port" data-config-id="' + port.id + '" data-field="enabled"' + (input.enabled ? ' checked' : '') + (disabled ? ' disabled' : '') + '><span>Port enabled</span></label></div></fieldset>' +
            (port.dce ? '<div class="atom8-interface-note"><i class="fa-solid fa-circle-info" aria-hidden="true"></i><span>This is the configured DCE endpoint. Its clock rate must match the activity setting.</span></div>' : '') + '</section>';
    }).join('');
    const routes = state.routes.map((route, i) => atom8RouteEntry(route, i, disabled)).join('');
    const routeStatus = ex.atom8State.validation.routes[routerId] || 'gray';
    const maxStaticRoutes = Math.max(1, Number(QUESTION_CONFIG.atom8.maxStaticRoutesPerRouter) || 1);
    const routeNav = router.routeCount > 0 ? '<button type="button" role="tab" class="atom8-config-nav-btn atom8-route-nav" data-config-panel="static-routes" aria-selected="false">' + atom8StatusDot(routeStatus) + '<span><strong>Static Routing</strong><small>' + state.routes.length + ' configured · ' + router.routeCount + ' remote LAN' + (router.routeCount === 1 ? '' : 's') + '</small></span><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>' : '';
    const routePanel = router.routeCount > 0 ? '<section role="tabpanel" class="atom8-config-panel" data-config-panel-content="static-routes" hidden><div class="atom8-config-panel-head"><div class="atom8-config-panel-icon"><i class="fa-solid fa-route" aria-hidden="true"></i></div><div><span>ROUTING SETTINGS</span><h3>Static Routes</h3><p>Add routes as needed. Inter-network reachability is checked using destination, mask, next hop, and longest-prefix matching.</p></div>' + atom8StatusDot(routeStatus) + '</div><div class="atom8-route-list">' + routes + '</div>' +
        (!disabled ? '<div class="atom8-route-actions"><button type="button" class="secondary-btn atom8-add-route" data-max-routes="' + maxStaticRoutes + '"' + (state.routes.length >= maxStaticRoutes ? ' disabled' : '') + '><i class="fa-solid fa-plus" aria-hidden="true"></i> Add Route</button><small>Up to ' + maxStaticRoutes + ' static routes</small></div>' : '') + '</section>'
        : '';
    const routingNavigation = router.routeCount > 0 ? '<div class="atom8-config-nav-label">Routing</div><div class="atom8-config-nav-list" role="tablist">' + routeNav + '</div>' : '';
    const body = '<div class="atom8-router-config-shell"><aside class="atom8-config-side-nav"><div class="atom8-device-summary"><i class="fa-solid fa-code-branch" aria-hidden="true"></i><span><strong>Router ' + router.number + '</strong><small>Configuration</small></span></div><div class="atom8-config-nav-label">Interfaces</div><div class="atom8-config-nav-list" role="tablist" aria-label="Router settings">' + portNav + '</div>' + routingNavigation + '</aside><div class="atom8-config-workspace">' + portPanels + routePanel + '</div></div>';
    atom8ShowModal('Router ' + router.number + ' Configuration', body, 'router', routerId, disabled);
}

function atom8OpenHostModal(hostId) {
    const ex = atom8CurrentExercise();
    const host = ex.model.hosts.find(item => item.id === hostId);
    const state = ex.atom8State.hosts[hostId];
    const lan = ex.scenario.lans.find(item => item.id === host.lanId);
    const disabled = !!state.locked;
    const body = '<div class="atom8-windows-host-shell"><div class="atom8-windows-device-banner"><div class="atom8-windows-device-icon"><i class="fa-solid fa-desktop" aria-hidden="true"></i></div><div><span>NETWORK ADAPTER</span><h3>' + atom6Escape(host.label) + '</h3><p>LAN ' + lan.number + ' · ' + atom6Escape(lan.label) + ' · ' + lan.hosts + ' hosts required</p></div></div>' +
        '<section class="atom8-windows-ipv4-card" aria-labelledby="atom8WindowsIpv4Title"><div class="atom8-windows-ipv4-heading"><i class="fa-solid fa-globe" aria-hidden="true"></i><div><h3 id="atom8WindowsIpv4Title">Internet Protocol Version 4 (TCP/IPv4)</h3><p>Configure the static IPv4 settings assigned in your VLSM plan.</p></div></div>' +
        '<div class="atom8-windows-radio" role="radio" aria-checked="false" aria-disabled="true"><span aria-hidden="true"></span>Obtain an IP address automatically</div>' +
        '<div class="atom8-windows-radio selected" role="radio" aria-checked="true"><span aria-hidden="true"></span>Use the following IP address:</div>' +
        '<div class="atom8-windows-ip-fields">' + atom8HostIpRow('IP address:', hostId, 'ip', state.ip, disabled) + atom8HostIpRow('Subnet mask:', hostId, 'mask', state.mask, disabled) + atom8HostIpRow('Default gateway:', hostId, 'gateway', state.gateway, disabled) + '</div></section></div>';
    atom8ShowModal(host.label + ' · IPv4 Properties', body, 'host', hostId, disabled);
}

function atom8ShowModal(title, body, kind, id, disabled) {
    const modal = document.getElementById('atom8ConfigModal');
    modal.dataset.kind = kind;
    modal.dataset.id = id;
    modal.classList.toggle('atom8-host-config-modal', kind === 'host');
    document.getElementById('atom8ModalTitle').textContent = title;
    document.getElementById('atom8ModalBody').innerHTML = body;
    const apply = document.getElementById('atom8ApplyConfig');
    apply.disabled = disabled;
    apply.textContent = disabled ? 'Configuration Locked' : (kind === 'host' ? 'Apply IPv4 Settings' : 'Apply Configuration');
    modal.style.display = 'block';
    document.getElementById('atom8ModalOverlay').style.display = 'block';
}

function closeAtom8Modal() {
    document.getElementById('atom8ConfigModal').style.display = 'none';
    document.getElementById('atom8ModalOverlay').style.display = 'none';
}

function atom8PopulateAnswerKey() {
    const ex = atom8CurrentExercise();
    if (!ex || !atom8AnswerKeyEnabled(ex)) return;
    atom8CancelPingAnimation();
    atom8PingState.active = false;
    atom8PingState.sourceId = null;
    atom8PingState.destinationId = null;
    atom8PingState.phase = 'idle';
    atom8PingState.outcome = null;
    atom8PingState.message = 'Select Test Connection to begin.';

    const previousConnectivity = {
        speed: Number(ex.atom8State.connectivityTest?.speed) || Number(QUESTION_CONFIG.atom8.connectivityTest?.defaultSpeed) || 1,
        autoSend: ex.atom8State.connectivityTest?.autoSend !== false,
        pairs: Array.isArray(ex.atom8State.connectivityTest?.pairs) ? ex.atom8State.connectivityTest.pairs : []
    };
    // Preserve the active exercise's generated suite. Atom 9 items have
    // different topologies and therefore different official-case counts.
    const state = atom8InitialState(ex.model, atom8OfficialCases(ex));
    state.connectivityTest = previousConnectivity;
    const lanBlocks = Object.fromEntries(ex.scenario.solution.lanAllocations.map(allocation => [allocation.lanId, allocation.assigned]));
    const wanBlocks = Object.fromEntries(ex.scenario.solution.wan.assignments.map(assignment => [assignment.wanId, assignment.block]));
    const maskText = block => block.mask.join('.');
    const wanEndpointIp = (wanId, routerId) => {
        const wan = ex.scenario.wans.find(item => item.id === wanId);
        const block = wanBlocks[wanId];
        if (!wan || !block) return '';
        return routerId === wan.fromRouterId ? block.first : block.last;
    };

    ex.model.routers.forEach(router => {
        const routerState = state.routers[router.id];
        router.ports.forEach(port => {
            const input = routerState.ports[port.id];
            const block = port.role === 'lan' ? lanBlocks[port.targetId] : wanBlocks[port.targetId];
            input.ip = port.role === 'lan' ? block.first : wanEndpointIp(port.targetId, router.id);
            input.mask = maskText(block);
            input.enabled = true;
            if (port.dce) input.clockRate = String(QUESTION_CONFIG.atom8.dceClockRate);
        });
        routerState.routes = ex.scenario.lans.filter(lan => lan.routerId !== router.id).map(lan => {
            const destination = lanBlocks[lan.id];
            const firstHop = atom8FirstHop(ex.scenario, router.id, lan.routerId);
            return {
                destination: destination.network,
                mask: maskText(destination),
                nextHop: firstHop ? wanEndpointIp(firstHop.wanId, firstHop.routerId) : ''
            };
        });
        routerState.applied = true;
        routerState.locked = false;
    });

    ex.scenario.lans.forEach(lan => {
        const block = lanBlocks[lan.id];
        ex.model.hosts.filter(host => host.lanId === lan.id).forEach((host, index) => {
            state.hosts[host.id] = {
                ip: atom6IntToIp(block.networkInt + 2 + index),
                mask: maskText(block),
                gateway: block.first,
                applied: true,
                locked: false
            };
        });
    });

    ex.atom8State = state;
    atom8InvalidateOfficialTests(ex, 'Answer key populated. Run the official tests to generate a score.');
    atom8Validate(ex);
    saveSessionProgress();
    renderAtom8View();
    updateSummaryPanel();
}

function atom9ResetCurrentItem() {
    const ex = atom8CurrentExercise();
    if (!ex || ex.type !== 'atom9') return;
    if (!isRetryAllowed()) {
        showAlertModal('Reset Not Allowed', sessionTimedOut ? 'Reset is not allowed after time expires.' : 'Reset is not allowed in Exam Mode.');
        return;
    }

    atom8CancelPingAnimation();
    atom8OfficialRunAllActive = false;
    atom8SelfRunAllActive = false;
    atom8RestartRequest = null;
    atom8WorkspaceMode = 'configure';
    atom8RenderedWorkspaceMode = 'configure';
    atom8TopologyZoom = Number(QUESTION_CONFIG.atom8.topologyView?.defaultZoom) || 1;
    Object.keys(atom8ListScrollByMode).forEach(mode => { atom8ListScrollByMode[mode] = 0; });
    Object.keys(atom8TopologyPanByMode).forEach(mode => { atom8TopologyPanByMode[mode] = { x: 0, y: 0 }; });
    Object.assign(atom8PingState, {
        active: false,
        mode: null,
        caseId: null,
        sourceId: null,
        destinationId: null,
        running: false,
        paused: false,
        stopRequested: false,
        phase: 'idle',
        outcome: null,
        message: 'Select Test Connection to begin.'
    });

    const officialCases = ex.generatedOfficialCases || atom8OfficialCases(ex);
    ex.atom8State = atom8InitialState(ex.model, officialCases);
    ex.userAnswer = JSON.stringify(ex.atom8State);
    ex.score = 0;
    ex.locked = false;
    ex.isPartial = false;
    atom8Validate(ex);
    saveSessionProgress();
    renderAtom8View();
    updateAtom8NavScore();
    updateSummaryPanel();
}

function atom8HandleDeviceClick(event) {
    if (event.target.closest?.('[data-review-kind]')) {
        atom8HandleQuickReview(event);
        event.stopPropagation();
        return;
    }
    if (event.target.closest('.atom8-populate-key')) {
        atom8PopulateAnswerKey();
        return;
    }
    if (event.target.closest('.atom9-reset-item')) {
        const modal = document.querySelector(atom8CurrentContainerSelector() + ' .atom9-reset-confirm-modal');
        if (modal) modal.hidden = false;
        return;
    }
    if (event.target.closest('.atom9-reset-cancel')) {
        const modal = document.querySelector(atom8CurrentContainerSelector() + ' .atom9-reset-confirm-modal');
        if (modal) modal.hidden = true;
        return;
    }
    if (event.target.closest('.atom9-reset-confirm')) {
        atom9ResetCurrentItem();
        return;
    }
    if (event.target.closest('.atom8-zoom-in')) {
        atom8SetTopologyZoom(atom8TopologyZoom + (Number(QUESTION_CONFIG.atom8.topologyView?.zoomStep) || 0.05));
        return;
    }
    if (event.target.closest('.atom8-zoom-out')) {
        atom8SetTopologyZoom(atom8TopologyZoom - (Number(QUESTION_CONFIG.atom8.topologyView?.zoomStep) || 0.05));
        return;
    }
    if (event.target.closest('.atom8-zoom-reset')) {
        atom8TopologyPanByMode[atom8WorkspaceMode] = { x: 0, y: 0 };
        atom8SetTopologyZoom(Number(QUESTION_CONFIG.atom8.topologyView?.defaultZoom) || 1, true);
        return;
    }
    const modeTab = event.target.closest('.atom8-mode-tab');
    if (modeTab) {
        atom8SetWorkspaceMode(modeTab.dataset.mode);
        return;
    }
    if (event.target.closest('.atom8-subnetmap-open')) {
        const ex = atom8CurrentExercise();
        const modal = document.querySelector(atom8CurrentContainerSelector() + ' .atom8-subnetmap-modal');
        const viewport = modal?.querySelector('.atom8-subnetmap-viewport');
        if (!ex || !viewport || !atom8SubnetDiagramEnabled(ex)) return;
        modal._atom8ViewKey = atom8SubnetMapViewKey(ex);
        const savedView = atom8LoadSubnetMapView(modal._atom8ViewKey);
        modal._atom8OpenRows = new Set(Array.isArray(savedView?.open) ? savedView.open : []);
        viewport.innerHTML = atom8BuildSubnetMap(ex, modal._atom8OpenRows);
        modal._atom8Opener = event.target.closest('.atom8-subnetmap-open');
        modal.hidden = false;
        atom8RestoreSubnetMapView(modal, savedView);
        modal.querySelector('.atom8-subnetmap-close')?.focus();
        return;
    }
    const subnetMapJump = event.target.closest('.atom8-subnetmap-jump');
    if (subnetMapJump) {
        atom8JumpToSubnetMapCard(subnetMapJump.closest('.atom8-subnetmap-modal'), subnetMapJump.dataset.targetTable);
        return;
    }
    const subnetMapRow = event.target.closest('.atom8-subnetmap-row');
    if (subnetMapRow) {
        const modal = subnetMapRow.closest('.atom8-subnetmap-modal');
        const ex = atom8CurrentExercise();
        if (!modal || !ex || !atom8SubnetDiagramEnabled(ex)) return;
        const key = subnetMapRow.dataset.rowKey;
        const open = modal._atom8OpenRows || (modal._atom8OpenRows = new Set());
        if (open.has(key)) open.delete(key); else open.add(key);
        atom8RenderSubnetMap(modal, ex);
        atom8ScheduleSubnetMapViewSave(modal);
        modal.querySelector('.atom8-subnetmap-row[data-row-key="' + key + '"]')?.focus({ preventScroll: true });
        return;
    }
    if (event.target.closest('.atom8-subnetmap-close, .atom8-subnetmap-backdrop')) {
        const modal = event.target.closest('.atom8-subnetmap-modal');
        if (modal) atom8CloseSubnetMap(modal);
        return;
    }
    const subnetMapZoomButton = event.target.closest('.atom8-subnetmap-zoom-in, .atom8-subnetmap-zoom-out, .atom8-subnetmap-zoom-fit');
    if (subnetMapZoomButton) {
        const modal = subnetMapZoomButton.closest('.atom8-subnetmap-modal');
        const plane = modal?.querySelector('.atom8-subnetmap-plane');
        if (!plane) return;
        if (subnetMapZoomButton.classList.contains('atom8-subnetmap-zoom-fit')) {
            atom8FitSubnetMap(modal);
            atom8RememberSubnetMapZoom('fit', undefined, modal);
        } else {
            const step = ATOM8_SUBNET_MAP.zoomStep * (subnetMapZoomButton.classList.contains('atom8-subnetmap-zoom-in') ? 1 : -1);
            atom8ApplySubnetMapZoom(modal, (Number(plane.dataset.zoom) || 1) + step);
            atom8RememberSubnetMapZoom('manual', Number(plane.dataset.zoom), modal);
        }
        return;
    }
    if (event.target.closest('.atom8-requirements-open')) {
        const modal = document.querySelector(atom8CurrentContainerSelector() + ' .atom8-requirements-modal');
        if (modal) modal.hidden = false;
        return;
    }
    if (event.target.closest('.atom8-requirements-close, .atom8-requirements-backdrop')) {
        const modal = document.querySelector(atom8CurrentContainerSelector() + ' .atom8-requirements-modal');
        if (modal) modal.hidden = true;
        return;
    }
    if (event.target.closest('.atom8-play-selected-test')) {
        atom8PlaySelectedTest();
        return;
    }
    if (event.target.closest('.atom8-pause-active-test')) {
        atom8ToggleActiveTestPause();
        return;
    }
    if (event.target.closest('.atom8-reset-active-test')) {
        atom8ResetActiveTest();
        return;
    }
    if (event.target.closest('.atom8-stop-active-test')) {
        atom8StopActiveTest();
        return;
    }
    const officialCase = event.target.closest('.atom8-run-official-case');
    if (officialCase) {
        atom8RunOfficialCase(officialCase.dataset.caseId);
        return;
    }
    const selfPairButton = event.target.closest('.atom8-run-self-pair');
    if (selfPairButton) {
        atom8RunSelfPair(selfPairButton.dataset.pairId);
        return;
    }
    if (event.target.closest('.atom8-run-all-self-tests')) {
        atom8RunAllSelfPairs();
        return;
    }
    if (event.target.closest('.atom8-run-all-tests')) {
        atom8RunAllOfficialCases();
        return;
    }
    const pingToggle = event.target.closest('.atom8-ping-toggle');
    if (pingToggle) {
        if (atom8PingState.running || atom8OfficialRunAllActive || atom8SelfRunAllActive) return;
        atom8CancelPingAnimation();
        const opening = !(atom8PingState.active && atom8PingState.mode === 'manual');
        atom8PingState.active = opening;
        atom8PingState.mode = opening ? 'manual' : null;
        atom8PingState.caseId = null;
        atom8PingState.sourceId = null;
        atom8PingState.destinationId = null;
        atom8PingState.phase = 'idle';
        atom8PingState.outcome = null;
        atom8PingState.message = opening ? 'Select the source PC in the topology.' : 'Select Test Connection to begin.';
        renderAtom8View();
        return;
    }
    if (event.target.closest('.atom8-ping-reset')) {
        atom8CancelPingAnimation();
        atom8PingState.sourceId = null;
        atom8PingState.destinationId = null;
        atom8PingState.phase = 'select-source';
        atom8PingState.outcome = null;
        atom8PingState.message = 'Select the source PC in the topology.';
        renderAtom8View();
        return;
    }
    if (event.target.closest('.atom8-self-run')) {
        if (atom8PingState.caseId) atom8RunSelfPair(atom8PingState.caseId);
        return;
    }
    if (event.target.closest('.atom8-clear-self-pairs')) {
        const ex = atom8CurrentExercise();
        if (!ex || atom8PingState.running) return;
        ex.atom8State.connectivityTest.pairs = [];
        atom8PingState.caseId = null;
        atom8PingState.sourceId = null;
        atom8PingState.destinationId = null;
        atom8PingState.phase = 'select-source';
        atom8PingState.outcome = null;
        atom8PingState.message = 'Select the source PC in the topology.';
        ex.userAnswer = JSON.stringify(ex.atom8State);
        saveSessionProgress();
        renderAtom8View();
        return;
    }
    const selfCase = event.target.closest('.atom8-self-case');
    if (selfCase && !atom8PingState.running) {
        const ex = atom8CurrentExercise();
        const pair = ex?.atom8State.connectivityTest?.pairs?.find(item => item.id === selfCase.dataset.pairId);
        if (pair) {
            atom8PingState.active = true;
            atom8PingState.mode = 'manual';
            atom8PingState.caseId = pair.id;
            atom8PingState.sourceId = pair.sourceId;
            atom8PingState.destinationId = pair.destinationId;
            atom8PingState.phase = pair.status === 'green' || pair.status === 'red' ? 'complete' : 'idle';
            atom8PingState.outcome = pair.status === 'green' ? 'success' : pair.status === 'red' ? 'failure' : null;
            atom8PingState.message = pair.message || 'Selected pair is ready to run.';
            renderAtom8View();
        }
        return;
    }
    const reviewCase = event.target.closest('.atom8-official-case');
    if (reviewCase && !atom8PingState.running) {
        const ex = atom8CurrentExercise();
        const testCase = atom8OfficialCases().find(item => item.id === reviewCase.dataset.caseId);
        const source = atom8ResolveOfficialEndpoint(ex, testCase?.source);
        const destination = atom8ResolveOfficialEndpoint(ex, testCase?.destination);
        if (source && destination) {
            atom8PingState.active = true;
            atom8PingState.mode = 'official';
            atom8PingState.caseId = testCase.id;
            atom8PingState.sourceId = source.id;
            atom8PingState.destinationId = destination.id;
            atom8PingState.phase = 'idle';
            atom8PingState.outcome = null;
            atom8PingState.message = 'Selected case endpoints are highlighted. Choose Test to run it.';
            renderAtom8View();
        }
        return;
    }
    const button = event.target.closest('.atom8-device-button');
    if (!button) return;
    if (atom8WorkspaceMode === 'self-test') {
        if (button.dataset.deviceKind === 'host') atom8SelectPingHost(button.dataset.deviceId);
        return;
    }
    if (atom8WorkspaceMode === 'official') return;
    if (button.dataset.deviceKind === 'router') atom8OpenRouterModal(button.dataset.deviceId);
    else atom8OpenHostModal(button.dataset.deviceId);
}

function atom8ToggleActiveTestPause() {
    if (!atom8PingState.running) return;
    atom8PingState.paused = !atom8PingState.paused;
    if (atom8PingState.paused) atom8PingAnimation?.pause();
    else atom8PingAnimation?.play();
    const button = document.querySelector(atom8CurrentContainerSelector() + ' .atom8-transport-primary');
    const icon = button?.querySelector('i');
    button?.classList.toggle('is-paused', atom8PingState.paused);
    button?.setAttribute('aria-label', atom8PingState.paused ? 'Resume active test' : 'Pause active test');
    button?.setAttribute('title', atom8PingState.paused ? 'Resume' : 'Pause');
    if (icon) icon.className = 'fa-solid ' + (atom8PingState.paused ? 'fa-play' : 'fa-pause');
    const state = document.querySelector(atom8CurrentContainerSelector() + ' .atom8-transport-current > span');
    if (state) state.innerHTML = '<i class="fa-solid fa-circle" aria-hidden="true"></i>' + (atom8PingState.paused ? 'Paused' : 'Running');
    const activity = document.querySelector(atom8CurrentContainerSelector() + ' .atom8-case-activity');
    activity?.classList.toggle('paused', atom8PingState.paused);
    const activityIcon = activity?.querySelector('i');
    if (activityIcon) activityIcon.className = 'fa-solid ' + (atom8PingState.paused ? 'fa-pause' : 'fa-wave-square');
}

function atom8PlaySelectedTest() {
    if (atom8PingState.running || !atom8PingState.caseId) return;
    if (atom8PingState.mode === 'official') atom8RunOfficialCase(atom8PingState.caseId);
    else if (atom8PingState.mode === 'manual') atom8RunSelfPair(atom8PingState.caseId);
}

function atom8ResetActiveTest() {
    if (!atom8PingState.running || !atom8PingState.caseId) return;
    atom8RestartRequest = { mode: atom8PingState.mode, caseId: atom8PingState.caseId };
    atom8StopActiveTest(true);
}

function atom8StopActiveTest(preserveRestart = false) {
    if (!atom8PingState.running) return;
    const ex = atom8CurrentExercise();
    if (!ex) return;
    if (!preserveRestart) atom8RestartRequest = null;
    atom8PingState.stopRequested = true;
    atom8OfficialRunAllActive = false;
    atom8SelfRunAllActive = false;
    atom8CancelPingAnimation();
    if (atom8PingState.mode === 'official' && atom8PingState.caseId) {
        const result = ex.atom8State.officialTests?.results?.[atom8PingState.caseId];
        if (result) {
            result.status = 'gray';
            result.message = 'Stopped · Ready to test again.';
        }
        ex.atom8State.officialTests.message = 'Official test stopped. No result was recorded.';
        atom8ApplyOfficialScore(ex);
    } else if (atom8PingState.caseId) {
        const pair = ex.atom8State.connectivityTest?.pairs?.find(item => item.id === atom8PingState.caseId);
        if (pair) {
            pair.status = 'gray';
            pair.message = 'Stopped · Ready to test again.';
        }
        atom8PingState.message = 'Self-test stopped. No result was recorded.';
    }
    ex.userAnswer = JSON.stringify(ex.atom8State);
    saveSessionProgress();
    renderAtom8View();
    updateSummaryPanel();
}

function atom8SelectPingHost(hostId) {
    if (atom8PingState.running) return;
    if (!atom8PingState.sourceId || atom8PingState.destinationId) {
        atom8PingState.caseId = null;
        atom8PingState.sourceId = hostId;
        atom8PingState.destinationId = null;
        atom8PingState.phase = 'select-destination';
        atom8PingState.outcome = null;
        atom8PingState.message = 'Source selected. Select a different PC as the destination.';
        renderAtom8View();
        return;
    }
    if (atom8PingState.sourceId === hostId) {
        atom8SetPingMessage('Source and destination must be different PCs.', 'select-destination', 'failure');
        return;
    }
    atom8PingState.destinationId = hostId;
    const ex = atom8CurrentExercise();
    const pairs = ex.atom8State.connectivityTest.pairs;
    const pair = {
        id: 'self-' + Date.now().toString(36) + '-' + pairs.length,
        sourceId: atom8PingState.sourceId,
        destinationId: hostId,
        status: 'gray',
        message: 'Not tested'
    };
    pairs.push(pair);
    atom8PingState.caseId = pair.id;
    atom8PingState.phase = 'ready';
    atom8PingState.outcome = null;
    atom8PingState.message = ex.atom8State.connectivityTest.autoSend ? 'Pair added. Sending automatically…' : 'Pair added. Choose Run Self-Test or its play icon.';
    ex.userAnswer = JSON.stringify(ex.atom8State);
    saveSessionProgress();
    renderAtom8View();
    if (ex.atom8State.connectivityTest.autoSend) setTimeout(() => atom8RunSelfPair(pair.id), 80);
}

function atom8HandleConnectivityInput(event) {
    const zoomSlider = event.target.closest('.atom8-zoom-slider');
    if (zoomSlider) {
        atom8SetTopologyZoom(Number(zoomSlider.value));
        return;
    }
    const autoSend = event.target.closest('.atom8-auto-send-input');
    if (autoSend) {
        const ex = atom8CurrentExercise();
        if (!ex) return;
        ex.atom8State.connectivityTest.autoSend = autoSend.checked;
        ex.userAnswer = JSON.stringify(ex.atom8State);
        saveSessionProgress();
        return;
    }
    const slider = event.target.closest('.atom8-ping-speed');
    if (!slider) return;
    const ex = atom8CurrentExercise();
    if (!ex) return;
    ex.atom8State.connectivityTest.speed = Number(slider.value);
    const output = slider.closest('.atom8-speed-control')?.querySelector('output');
    if (output) output.textContent = Number(slider.value).toFixed(2).replace(/\.00$/, '') + '×';
    ex.userAnswer = JSON.stringify(ex.atom8State);
    saveSessionProgress();
}

function atom8SetTopologyZoom(value, resetPan = false) {
    const viewConfig = QUESTION_CONFIG.atom8.topologyView || {};
    const minZoom = Number(viewConfig.minZoom) || 0.65;
    const maxZoom = Number(viewConfig.maxZoom) || 1.4;
    const nextZoom = Math.min(maxZoom, Math.max(minZoom, Number(value) || 1));
    const viewport = document.querySelector(atom8CurrentContainerSelector() + ' .atom8-topology-viewport');
    const plane = viewport?.querySelector('.atom8-topology-zoom-plane');
    const canvas = plane?.querySelector('.atom8-topology-canvas');
    const previousZoom = atom8TopologyZoom || 1;
    const centerX = viewport ? viewport.scrollLeft + viewport.clientWidth / 2 : 0;
    const centerY = viewport ? viewport.scrollTop + viewport.clientHeight / 2 : 0;
    atom8TopologyZoom = nextZoom;
    if (!viewport || !plane || !canvas) return;
    const baseWidth = Number(plane.dataset.baseWidth) || canvas.offsetWidth;
    const baseHeight = Number(plane.dataset.baseHeight) || Number(viewConfig.canvasHeight) || 500;
    plane.style.width = Math.ceil(baseWidth * nextZoom) + 'px';
    plane.style.height = Math.ceil(baseHeight * nextZoom) + 'px';
    canvas.style.transform = 'scale(' + nextZoom + ')';
    const topology = viewport.closest('.atom8-topology');
    const slider = topology?.querySelector('.atom8-zoom-slider');
    const output = topology?.querySelector('.atom8-zoom-controls output');
    if (slider) slider.value = String(nextZoom);
    if (output) output.textContent = Math.round(nextZoom * 100) + '%';
    if (resetPan) {
        viewport.scrollLeft = 0;
        viewport.scrollTop = 0;
    } else {
        const ratio = nextZoom / previousZoom;
        viewport.scrollLeft = Math.max(0, centerX * ratio - viewport.clientWidth / 2);
        viewport.scrollTop = Math.max(0, centerY * ratio - viewport.clientHeight / 2);
    }
    atom8TopologyPanByMode[atom8WorkspaceMode] = { x: viewport.scrollLeft, y: viewport.scrollTop };
    atom8ScheduleTopologyConnections();
}

function atom8HandleTopologyPanStart(event) {
    const viewport = event.target.closest?.('.atom8-topology-viewport');
    if (!viewport || event.button !== 0 || event.target.closest('button, input, [data-review-kind], .atom8-link-port-label')) return;
    atom8TopologyPanState = {
        viewport,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        scrollLeft: viewport.scrollLeft,
        scrollTop: viewport.scrollTop
    };
    viewport.setPointerCapture?.(event.pointerId);
    viewport.classList.add('is-dragging');
}

function atom8HandleTopologyPanMove(event) {
    const state = atom8TopologyPanState;
    if (!state || state.pointerId !== event.pointerId) return;
    state.viewport.scrollLeft = state.scrollLeft - (event.clientX - state.startX);
    state.viewport.scrollTop = state.scrollTop - (event.clientY - state.startY);
    atom8TopologyPanByMode[atom8WorkspaceMode] = { x: state.viewport.scrollLeft, y: state.viewport.scrollTop };
    event.preventDefault();
}

function atom8HandleTopologyPanEnd(event) {
    const state = atom8TopologyPanState;
    if (!state || state.pointerId !== event.pointerId) return;
    state.viewport.releasePointerCapture?.(event.pointerId);
    state.viewport.classList.remove('is-dragging');
    atom8TopologyPanState = null;
}

function atom8HandleModalClick(event) {
    if (event.target.closest('.atom8-modal-close')) { closeAtom8Modal(); return; }
    const addRoute = event.target.closest('.atom8-add-route');
    if (addRoute) {
        const modal = document.getElementById('atom8ConfigModal');
        const list = modal.querySelector('.atom8-route-list');
        const count = list.querySelectorAll('.atom8-route-entry').length;
        if (count < Number(addRoute.dataset.maxRoutes)) {
            list.insertAdjacentHTML('beforeend', atom8RouteEntry({ destination: '', mask: '', nextHop: '' }, count, false));
            atom8ReindexRouteEntries(modal);
        }
        return;
    }
    const removeRoute = event.target.closest('.atom8-remove-route');
    if (removeRoute) {
        const modal = document.getElementById('atom8ConfigModal');
        removeRoute.closest('.atom8-route-entry')?.remove();
        atom8ReindexRouteEntries(modal);
        return;
    }
    const panelButton = event.target.closest('.atom8-config-nav-btn');
    if (panelButton) {
        const modal = document.getElementById('atom8ConfigModal');
        modal.querySelectorAll('.atom8-config-nav-btn').forEach(button => {
            const active = button === panelButton;
            button.classList.toggle('active', active);
            button.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        modal.querySelectorAll('.atom8-config-panel').forEach(panel => {
            const active = panel.dataset.configPanelContent === panelButton.dataset.configPanel;
            panel.classList.toggle('active', active);
            panel.hidden = !active;
        });
        return;
    }
    if (!event.target.closest('#atom8ApplyConfig')) return;
    const modal = document.getElementById('atom8ConfigModal');
    const ex = atom8CurrentExercise();
    const kind = modal.dataset.kind;
    const id = modal.dataset.id;
    if (kind === 'router') {
        const target = ex.atom8State.routers[id];
        document.querySelectorAll('#atom8ModalBody [data-config-kind="port"]').forEach(input => {
            target.ports[input.dataset.configId][input.dataset.field] = input.type === 'checkbox' ? input.checked : input.value.trim();
        });
        target.routes = [...document.querySelectorAll('#atom8ModalBody .atom8-route-entry')].map(entry => ({
            destination: entry.querySelector('[data-field="destination"]').value.trim(),
            mask: entry.querySelector('[data-field="mask"]').value.trim(),
            nextHop: entry.querySelector('[data-field="nextHop"]').value.trim()
        }));
        target.applied = true;
        if (!isRetryAllowed()) target.locked = true;
    } else {
        const target = ex.atom8State.hosts[id];
        document.querySelectorAll('#atom8ModalBody [data-config-kind="host"]').forEach(input => { target[input.dataset.field] = input.value.trim(); });
        target.applied = true;
        if (!isRetryAllowed()) target.locked = true;
    }
    atom8InvalidateOfficialTests(ex);
    atom8Validate(ex);
    saveSessionProgress();
    renderAtom8View();
    updateSummaryPanel();
    closeAtom8Modal();
}

function showAtom8Page() {
    if (!QUESTION_CONFIG.atom8?.enabled || !exerciseData['atom8-main']) return;
    activeDeploymentExerciseKey = 'atom8-main';
    document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
    document.getElementById('nav-atom8')?.classList.add('active');
    ['exerciseArea', 'subnetVisualizerView', 'atomPlaceholderView', 'atom1View', 'atom2View', 'atom3View', 'atom4View', 'atom5View', 'atom6View', 'atom7View', 'atom9View'].forEach(id => {
        const view = document.getElementById(id);
        if (view) view.style.display = 'none';
    });
    document.getElementById('atom8View').style.display = 'flex';
    renderAtom8View();
    atom8ScheduleTopologyConnections();
    document.getElementById('timerContainer').style.display = timerIntervalId ? 'flex' : 'none';
    hideAllAtomPaginationBars();
    currentFile = '';
    closeSampleOutputModal();
    updateConsoleDrawerTab(false);
    closeSidebarIfMobile();
}

function atom9SelectItem(index, options = {}) {
    if (!atom9QuestionIds.length) return;
    const nextIndex = Math.max(0, Math.min(atom9QuestionIds.length - 1, Number(index) || 0));
    atom8CancelPingAnimation();
    atom9ActiveIndex = nextIndex;
    activeDeploymentExerciseKey = atom9QuestionIds[nextIndex];
    atom8WorkspaceMode = options.keepMode ? atom8WorkspaceMode : 'configure';
    atom8RenderedWorkspaceMode = atom8WorkspaceMode;
    atom8TopologyZoom = Number(QUESTION_CONFIG.atom8.topologyView?.defaultZoom) || 1;
    Object.keys(atom8ListScrollByMode).forEach(mode => { atom8ListScrollByMode[mode] = 0; });
    Object.keys(atom8TopologyPanByMode).forEach(mode => { atom8TopologyPanByMode[mode] = { x: 0, y: 0 }; });
    atom8PingState.active = false;
    atom8PingState.mode = null;
    atom8PingState.caseId = null;
    atom8PingState.sourceId = null;
    atom8PingState.destinationId = null;
    atom8PingState.phase = 'idle';
    atom8PingState.outcome = null;
    atom8PingState.message = 'Select Test Connection to begin.';
    if (!ATOM_PAGINATION.atom9 || ATOM_PAGINATION.atom9.total !== atom9QuestionIds.length) {
        ATOM_PAGINATION.atom9 = { total: atom9QuestionIds.length, current: nextIndex };
    } else {
        ATOM_PAGINATION.atom9.current = nextIndex;
    }
    renderAtomPaginationBar('atom9');
    renderAtom8View();
}

function renderAtom9View() {
    const nav = document.getElementById('nav-atom9');
    const enabled = !!(QUESTION_CONFIG.atom9?.enabled && atom9QuestionIds.length);
    if (nav) nav.style.display = enabled ? '' : 'none';
    if (!enabled) {
        const container = document.getElementById('atom9Container');
        if (container) container.innerHTML = '';
        return;
    }
    attachAtomPaginationHandlers();
    atom9ActiveIndex = Math.max(0, Math.min(atom9ActiveIndex, atom9QuestionIds.length - 1));
    if (!ATOM_PAGINATION.atom9 || ATOM_PAGINATION.atom9.total !== atom9QuestionIds.length) {
        ATOM_PAGINATION.atom9 = { total: atom9QuestionIds.length, current: atom9ActiveIndex };
    } else {
        ATOM_PAGINATION.atom9.current = atom9ActiveIndex;
    }
    activeDeploymentExerciseKey = atom9QuestionIds[atom9ActiveIndex];
    renderAtomPaginationBar('atom9');
    renderAtom8View();
}

function syncAtom9ViewDOM() {
    atom9QuestionIds.forEach(qid => {
        const ex = exerciseData[qid];
        if (!ex) return;
        ex.atom8State = atom8RestoreState(ex);
        atom8Validate(ex);
    });
    renderAtom9View();
    updateAtom8NavScore();
    updateSummaryPanel();
}

function showAtom9Page() {
    if (!QUESTION_CONFIG.atom9?.enabled || !atom9QuestionIds.length) return;
    document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
    document.getElementById('nav-atom9')?.classList.add('active');
    ['exerciseArea', 'subnetVisualizerView', 'atomPlaceholderView', 'atom1View', 'atom2View', 'atom3View', 'atom4View', 'atom5View', 'atom6View', 'atom7View', 'atom8View'].forEach(id => {
        const view = document.getElementById(id);
        if (view) view.style.display = 'none';
    });
    document.getElementById('atom9View').style.display = 'flex';
    atom9SelectItem(atom9ActiveIndex, { keepMode: true });
    document.getElementById('timerContainer').style.display = timerIntervalId ? 'flex' : 'none';
    showAtomPaginationBar('atom9');
    currentFile = '';
    closeSampleOutputModal();
    updateConsoleDrawerTab(false);
    closeSidebarIfMobile();
}

function renderQuestionHtml(qid, q) {
    if (q.type === 'atom1') return renderAtom1QuestionHtml(qid, q);
    // Atom 2 lives entirely in its own dedicated view, rendered directly
    // from exerciseData via buildAtom2PanelHtml (see renderAtom2View) —
    // this .html field is never read for it, so nothing further to build.
    if (q.type === 'atom2') return '';
    // Same rationale for Atom 3 (see renderAtom3View/buildAtom3PanelHtml).
    if (q.type === 'atom3') return '';
    // Atom 4 reuses Atom 3's dedicated panel and adds its own boundary rows.
    if (q.type === 'atom4') return '';
    // Atom 5 lives entirely in its own dedicated view (see renderAtom5View/
    // buildAtom5PanelHtml) — a narrative scenario + single text answer, not
    // one of the input types handled below.
    if (q.type === 'atom5') return '';
    let inputHtml = '';
    let answerRowClass = 'conversion-answer-row';
    if (q.type === 'd2b') {
        inputHtml = renderBitGroup(qid, q.bitWidth);
    } else if (q.type === 'b2d') {
        const givenGroup = renderReadOnlyBitGroup(qid, q.given, q.bitWidth);
        inputHtml = `<div class="b2d-given-wrap">
                        <span class="b2d-given-label">Given</span>
                        ${givenGroup}
                     </div>
                     <span class="conversion-equals" aria-hidden="true">=</span>
                     <input type="text" class="answer-input-num" data-qid="${qid}" inputmode="numeric" placeholder="decimal">`;
        // The "Given" label sits above the bit grid, making that column
        // taller than the bare "=" and decimal input beside it. Row-level
        // `align-items: center` would center against that extra height and
        // visibly sink the equals sign/input below the bit boxes — this
        // modifier switches just this row to bottom alignment instead, so
        // the bit-box row and the decimal field line up on the same
        // baseline regardless of the label above.
        answerRowClass += ' answer-row-bottom-align';
    } else if (q.type === 'ip_d2b' || q.type === 'mask_d2b') {
        // Phase 3 (IP Dec→Bin) and Phase 6 (Mask Dec→Bin) are structurally
        // identical input-wise — both ask for four 8-bit binary octets —
        // so they share the same expand-on-focus bit-grid UI. Grading stays
        // untouched: buildConversionExerciseData still only awards partial,
        // per-octet credit for 'ip_d2b' (see isOctetScored there); this is
        // purely about how the value gets typed in, not how it's scored.
        inputHtml = renderIpOctetBinExpandable(qid);
    } else if (q.type === 'ip_b2d' || q.type === 'mask_c2d') {
        inputHtml = renderIpOctetInputs(qid, 'dec');
    } else if (q.type === 'class_cidr') {
        inputHtml = renderClassCidrInput(qid, q.given);
    }
    return `<div class="conversion-question">
                <div class="conversion-prompt">${q.promptHtml}</div>
                <div class="${answerRowClass}">${inputHtml}</div>
            </div>`;
}

// Reads whatever is currently typed into the DOM for the active question.
// Only one question's inputs exist in #codeDisplay at a time, so no qid
// scoping is needed on the selectors.
function collectConversionAnswer(ex) {
    if (!ex) return '';
    if (ex.type === 'atom1') {
        const grid = document.getElementById('atom1BitGrid-' + currentFile);
        return grid ? (grid.dataset.borrowed || '0') : (ex.userAnswer || '');
    }
    if (ex.type === 'd2b') {
        return Array.from(document.querySelectorAll('.bitbox')).map(b => b.value || '_').join('');
    }
    if (ex.type === 'b2d' || ex.type === 'class_cidr') {
        const inp = document.querySelector('.answer-input-num');
        return inp ? inp.value.trim() : '';
    }
    if (ex.type === 'ip_d2b' || ex.type === 'mask_d2b') {
        const parts = [0, 1, 2, 3].map(i => {
            const el = document.querySelector(`.ip-octet-bin[data-oct="${i}"]`);
            return el ? el.value.trim() : '';
        });
        return parts.join('.');
    }
    if (ex.type === 'ip_b2d' || ex.type === 'mask_c2d') {
        const parts = [0, 1, 2, 3].map(i => {
            const el = document.querySelector(`.ip-octet-dec[data-oct="${i}"]`);
            return el ? el.value.trim() : '';
        });
        return parts.join('.');
    }
    return '';
}

function gradeConversionAnswer(ex, userAnswer) {
    if (!ex) return false;
    // Exact match required for binary answers (leading zeros matter).
    return (userAnswer || '').trim() === (ex.correct || '').trim();
}

// Returns { score, allCorrect } for the current question. IP address
// questions (Phase 3/4) are graded per octet — 1 point for each of the 4
// octets that matches — so partial credit is possible. Every other
// conversion type (individual dec/bin, subnet mask) is still all-or-nothing
// (1 point), matching ex.answers.length set in buildConversionExerciseData.
function gradeConversionScore(ex, userAnswer) {
    if (!ex) return { score: 0, allCorrect: false };
    if (ex.type === 'ip_d2b' || ex.type === 'ip_b2d') {
        const correctParts = (ex.correct || '').split('.');
        const userParts = (userAnswer || '').split('.');
        let score = 0;
        for (let i = 0; i < correctParts.length; i++) {
            if ((userParts[i] || '').trim() === correctParts[i].trim()) score++;
        }
        return { score, allCorrect: score === correctParts.length };
    }
    const isCorrect = gradeConversionAnswer(ex, userAnswer);
    return { score: isCorrect ? 1 : 0, allCorrect: isCorrect };
}

// Applies per-octet correct/incorrect visual feedback for the IP address
// conversion questions (Phase 3 · IP Dec→Bin and Phase 4 · IP Bin→Dec),
// where each of the 4 octets is scored independently. Mirrors the
// border-color convention already used for the legacy fill-in-the-blank
// inputs elsewhere in this file, so it stays visually consistent without
// needing new CSS. Called right after grading (checkAnswers) and when
// redisplaying an already-locked question (switchExercise), so the
// coloring survives navigating away and back.
function applyOctetFeedback(ex) {
    if (!ex || (ex.type !== 'ip_d2b' && ex.type !== 'ip_b2d')) return;

    const selectorClass = ex.type === 'ip_d2b' ? '.ip-octet-bin' : '.ip-octet-dec';
    const correctParts = (ex.correct || '').split('.');

    document.querySelectorAll(selectorClass).forEach(el => {
        const idx = parseInt(el.dataset.oct, 10);
        const userVal = (el.value || '').trim();
        const isRight = userVal === (correctParts[idx] || '').trim();

        el.classList.remove('octet-correct', 'octet-incorrect');
        el.classList.add(isRight ? 'octet-correct' : 'octet-incorrect');
        el.style.borderColor = isRight ? 'var(--secondary)' : 'var(--error)';
        el.style.borderBottomColor = isRight ? 'var(--secondary)' : 'var(--error)';
        el.setAttribute('aria-invalid', isRight ? 'false' : 'true');
        el.title = isRight ? 'Correct' : 'Incorrect';
    });
}

// Clears any per-octet correct/incorrect styling/attributes applied by
// applyOctetFeedback, used on reset so a fresh attempt doesn't start out
// still colored from the previous one.
function clearOctetFeedback() {
    document.querySelectorAll('.ip-octet-bin, .ip-octet-dec').forEach(el => {
        el.classList.remove('octet-correct', 'octet-incorrect');
        el.style.borderColor = '';
        el.style.borderBottomColor = '';
        el.removeAttribute('aria-invalid');
        el.removeAttribute('title');
    });
}

// Repopulates the current question's inputs from a previously saved
// ex.userAnswer (e.g. after switching away and back, or resuming an
// exam session mid-question).
function restoreConversionAnswer(ex) {
    if (!ex || !ex.userAnswer) return;
    if (ex.type === 'd2b') {
        const chars = ex.userAnswer.split('');
        document.querySelectorAll('.bitbox').forEach((box, i) => {
            const c = chars[i];
            box.classList.remove('on', 'off');
            if (c === '0' || c === '1') {
                box.value = c;
                box.classList.add(c === '1' ? 'on' : 'off');
            }
            updatePlainBitPlaceValueLabel(box.dataset.qid, i, box.value);
        });
    } else if (ex.type === 'b2d' || ex.type === 'class_cidr') {
        const inp = document.querySelector('.answer-input-num');
        if (inp) inp.value = ex.userAnswer;
    } else if (ex.type === 'ip_d2b' || ex.type === 'mask_d2b') {
        const parts = ex.userAnswer.split('.');
        document.querySelectorAll('.ip-octet-bin').forEach(el => {
            const idx = parseInt(el.dataset.oct, 10);
            el.value = parts[idx] || '';
        });
    } else if (ex.type === 'ip_b2d' || ex.type === 'mask_c2d') {
        const parts = ex.userAnswer.split('.');
        document.querySelectorAll('.ip-octet-dec').forEach(el => {
            const idx = parseInt(el.dataset.oct, 10);
            el.value = parts[idx] || '';
        });
    } else if (ex.type === 'atom1') {
        const borrowed = parseInt(ex.userAnswer, 10);
        if (!isNaN(borrowed)) {
            updateAtom1Grid(currentFile, ex, Math.max(0, Math.min(borrowed, ex.maxBorrow)));
        }
    }
}

// Persists the in-progress answer for the current question (debounced by
// the caller via the input event) and, in exam mode, saves the session so
// a reload mid-question doesn't lose it.
function saveConversionProgress() {
    const ex = exerciseData[currentFile];
    if (!ex || !ex.isConversionQuestion || ex.locked) return;
    ex.userAnswer = collectConversionAnswer(ex);
    saveSessionProgress();
}

// --- PHASE 3 & PHASE 6: EXPAND-ON-FOCUS OCTET BINARY INPUT ---
// The bit-grid "card" is a floating popover (see .octet-bitgroup in
// style.css) anchored under its compact field. It uses position: fixed
// with JS-computed coordinates rather than position: absolute relative to
// its wrapper — .code-editor sets overflow-x: auto without an explicit
// overflow-y, which per spec silently forces overflow-y to 'auto' too,
// turning it into a clipping/scrolling container that cut an
// absolutely-positioned popover off before it could render below its
// field. Fixed positioning escapes any such ancestor clipping entirely.
//
// Showing/hiding is just a class toggle — the opacity/transform/
// visibility crossfade is entirely owned by CSS transitions on
// .octet-bitgroup / .octet-bitgroup.expanded and .ip-octet-collapsed /
// .ip-octet-collapsed.field-hidden, so both halves of the swap animate
// together as one continuous motion instead of two separately-timed
// animations that could drift out of sync.

// Computes and applies the popover's viewport position from its field's
// current on-screen location, clamping horizontally so it can't run off
// the right edge of the screen on narrow viewports. Safe to call while
// the card is still invisible (visibility: hidden doesn't remove it from
// layout, only display: none would), so its real measured size is
// available for the clamp check even before it's shown.
function positionOctetCard(collapsedInput, bitgroup) {
    const fieldRect = collapsedInput.getBoundingClientRect();
    const cardRect = bitgroup.getBoundingClientRect();
    const margin = 8;

    let left = fieldRect.left;
    const maxLeft = window.innerWidth - cardRect.width - margin;
    if (left > maxLeft) left = Math.max(margin, maxLeft);

    bitgroup.style.left = `${Math.round(left)}px`;
    bitgroup.style.top = `${Math.round(fieldRect.bottom + 10)}px`;
}

// Keeps any currently-expanded octet card(s) glued to their field while
// the page (or any scrollable ancestor, e.g. the sidebar or a mobile
// keyboard-triggered scroll) moves underneath them — fixed-position
// elements don't follow scrolling on their own, so without this the
// popover would visually detach from its field the moment the page
// scrolled while it was open.
function repositionExpandedOctetCards() {
    document.querySelectorAll('.octet-bitgroup.expanded').forEach(bitgroup => {
        const collapsedInput = document.querySelector(
            `.ip-octet-collapsed[data-qid="${bitgroup.dataset.qid}"][data-oct="${bitgroup.dataset.oct}"]`
        );
        if (collapsedInput) positionOctetCard(collapsedInput, bitgroup);
    });
}
window.addEventListener('scroll', repositionExpandedOctetCards, { passive: true, capture: true });
window.addEventListener('resize', repositionExpandedOctetCards);

function showOctetCard(bitgroup) {
    bitgroup.classList.add('expanded');
}

function hideOctetCard(bitgroup) {
    bitgroup.classList.remove('expanded');
}

// tabIndex (not visibility) is what keeps a hidden compact field out of
// Tab-key reach — see the comment on expandOctetBinaryInput for why
// visibility can't be used here.
function hideCollapsedField(input) {
    input.classList.add('field-hidden');
    input.tabIndex = -1;
    input.title = 'Editing in the expanded view below';
    // NOT input.disabled — disabling a currently-focused element forces an
    // immediate blur (same reason visibility:hidden was ruled out for this
    // field, see the CSS comment on .ip-octet-collapsed.field-hidden), which
    // would fire ahead of the deferred focus handoff into the bit grid and
    // break it. readOnly has no such side effect: it still blocks the
    // student from typing/editing this field while it's muted, but doesn't
    // touch focus at all.
    input.readOnly = true;
}

function showCollapsedField(input) {
    input.classList.remove('field-hidden');
    input.removeAttribute('tabindex');
    input.removeAttribute('title');
    input.readOnly = false;
}

// Reconstructs the 8-bit string for one octet from its bit boxes (using
// '_' for any box left blank, same convention as Phase 1's own collector)
// and writes it into that octet's collapsed text field — the field
// collectConversionAnswer/applyOctetFeedback/restoreConversionAnswer
// already know how to read, so no changes were needed there.
function updateCollapsedOctetValue(qid, oct) {
    const boxes = Array.from(document.querySelectorAll(`.octet-bitbox[data-qid="${qid}"][data-oct="${oct}"]`))
        .sort((a, b) => parseInt(a.dataset.idx, 10) - parseInt(b.dataset.idx, 10));
    if (!boxes.length) return;
    const val = boxes.map(b => b.value || '_').join('');
    const collapsedInput = document.querySelector(`.ip-octet-collapsed[data-qid="${qid}"][data-oct="${oct}"]`);
    if (collapsedInput) collapsedInput.value = val;
}

// Shared core: flips a place-value label between "active" (bit is 1 — this
// place value counts toward the total) and "muted" (bit is 0 or not yet
// answered). Used by both the octet grid (Phase 3/6) and the plain grid
// (Phase 1) — they differ only in how the label element is looked up.
function setPlaceValueLabelState(label, value) {
    if (!label) return;
    label.classList.toggle('active', value === '1');
    label.classList.toggle('muted', value !== '1');
}

// Phase 3/6: each rendered exercise has four octets' worth of bit boxes in
// the DOM at once (idx 0–7 repeats per octet), so the lookup needs both
// data-oct and data-idx to find the right label.
function updateBitPlaceValueLabel(qid, oct, idx, value) {
    const label = document.querySelector(`.bit-place-value[data-qid="${qid}"][data-oct="${oct}"][data-idx="${idx}"]`);
    setPlaceValueLabelState(label, value);
}

// Phase 1: only one bit grid is ever rendered per exercise, so data-qid +
// data-idx alone is already unique — no octet to scope by.
function updatePlainBitPlaceValueLabel(qid, idx, value) {
    const label = document.querySelector(`.bit-place-value[data-qid="${qid}"][data-idx="${idx}"]`);
    setPlaceValueLabelState(label, value);
}

// --- PHASE 3 & PHASE 6: WHICH OCTET IS CURRENTLY EXPANDED ---
// Single source of truth for "which octet's popover is open right now",
// driven entirely by the delegated focusin/focusout listeners set up in
// attachExpandableOctetHandlers (below) rather than by each individual
// element deciding for itself. See the comment on expandOctetBinaryInput
// for why the old per-element approach was unreliable.
let currentlyExpandedOctet = null; // { qid, oct } | null

// Guards handleOctetFocusOutFallback from collapsing the octet card while
// we're in the middle of our own programmatic focus handoff (compact field
// -> first bit box). Without this, a focusout fired as a side effect of
// hiding/disabling the compact field (e.g. the tabIndex change inside
// hideCollapsedField, called from expandOctetBinaryInput) can race ahead of
// the setTimeout that actually moves focus into the bit grid, making the
// card flash open and immediately collapse again. It's set true the moment
// we decide to expand, and cleared once focus has genuinely landed inside
// the octet (or the handoff attempt has finished, successfully or not).
let suppressOctetCollapseUntilExpanded = false;

// Seeds the bit boxes for [qid, oct] from its compact field's current
// value and shows the popover card. Deliberately does NOT move focus
// itself — see attachExpandableOctetHandlers for why that's handled
// separately, in a fresh task. Returns the sorted box elements so the
// caller can decide what (if anything) to focus.
function expandOctetBinaryInput(qid, oct) {
    const wrapper = document.querySelector(`.octet-expand-wrapper[data-qid="${qid}"][data-oct="${oct}"]`);
    if (!wrapper) return null;
    const collapsedInput = wrapper.querySelector('.ip-octet-collapsed');
    const bitgroup = wrapper.querySelector('.octet-bitgroup');
    if (!collapsedInput || !bitgroup || collapsedInput.disabled) return null;

    const chars = (collapsedInput.value || '').split('');
    const boxes = Array.from(bitgroup.querySelectorAll('.octet-bitbox'))
        .sort((a, b) => parseInt(a.dataset.idx, 10) - parseInt(b.dataset.idx, 10));
    boxes.forEach((box, i) => {
        const c = chars[i];
        box.classList.remove('on', 'off');
        if (c === '0' || c === '1') {
            box.value = c;
            box.classList.add(c === '1' ? 'on' : 'off');
        } else {
            box.value = '';
        }
        updateBitPlaceValueLabel(qid, oct, i, box.value);
    });

    positionOctetCard(collapsedInput, bitgroup);
    showOctetCard(bitgroup);

    // Force a synchronous style/layout flush right here, immediately after
    // the 'expanded' class is added. Reading a layout property forces the
    // browser to resolve the just-added class into real computed style
    // (visibility, in particular) right now rather than lazily on whatever
    // later render pass happens to come next. Without this, a focus() call
    // shortly afterward could land while the card's focusability is still
    // effectively unresolved, and silently no-op.
    void bitgroup.offsetHeight;

    hideCollapsedField(collapsedInput);
    currentlyExpandedOctet = { qid, oct };

    return boxes;
}

// Swaps a Phase 3 octet's bit grid back to its compact text field,
// syncing whatever was typed into the boxes back into that field first.
function collapseOctetBinaryInput(qid, oct) {
    const wrapper = document.querySelector(`.octet-expand-wrapper[data-qid="${qid}"][data-oct="${oct}"]`);
    if (!wrapper) return;
    const collapsedInput = wrapper.querySelector('.ip-octet-collapsed');
    const bitgroup = wrapper.querySelector('.octet-bitgroup');
    if (!collapsedInput || !bitgroup) return;

    updateCollapsedOctetValue(qid, oct);
    hideOctetCard(bitgroup);
    showCollapsedField(collapsedInput);
    if (currentlyExpandedOctet && currentlyExpandedOctet.qid === qid && currentlyExpandedOctet.oct === oct) {
        currentlyExpandedOctet = null;
    }
}

// Attached once, globally (see the guard in attachExpandableOctetHandlers)
// rather than per-wrapper. This is the actual fix for "expands, then
// immediately collapses again": the previous version decided whether to
// expand/collapse from each field's own 'focus' handler, and — critically
// — called `someBox.focus()` synchronously FROM WITHIN that handler to
// hand focus off to the bit grid. Calling .focus() on a different element
// from inside another element's own focus event handler is a well-known
// cross-browser inconsistency: some browsers defer that re-focus to a
// later tick instead of applying it immediately. When that happened here,
// the code went on to hide the compact field before focus had actually,
// reliably landed in the bit grid, so the "did focus leave?" check fired
// against a field that — from the browser's perspective — hadn't
// finished losing focus yet, and collapsed the card right back.
//
// This version instead treats focusin as the single, authoritative signal
// for "focus is now here" (fired only once focus has actually landed,
// regardless of any deferral), and — when it needs to move focus into the
// bit grid itself — defers that .focus() call to a double
// requestAnimationFrame rather than setTimeout(0). Both approaches equally
// avoid the nested/reentrant-focus problem described above (they run as a
// fresh, top-level task outside any browser focus-dispatch call stack), but
// setTimeout(0) makes no promise that a style/layout pass has happened by
// the time it fires — only that ~0ms of real time has elapsed — so it can
// land while the just-expanded card's focusability is still unresolved and
// the focus() call silently no-ops. Two nested rAFs (the same pattern this
// file already uses in animateRowSwap for a similar "wait for the browser
// to actually render this" need) guarantee at least one full render pass
// has completed first. A one-shot retry immediately after covers the rare
// case where focus still didn't land on the first attempt.
function handleOctetFocusIn(e) {
    const wrapper = e.target.closest('.octet-expand-wrapper');

    if (!wrapper) {
        // Focus landed somewhere unrelated to any octet — collapse
        // whatever was open.
        if (currentlyExpandedOctet) {
            collapseOctetBinaryInput(currentlyExpandedOctet.qid, currentlyExpandedOctet.oct);
        }
        return;
    }

    const qid = wrapper.dataset.qid;
    const oct = wrapper.dataset.oct;
    const isSameOctet = currentlyExpandedOctet && currentlyExpandedOctet.qid === qid && currentlyExpandedOctet.oct === oct;

    // Focus has genuinely landed inside an octet's own markup (whether
    // it's the one already expanded or a new one we're about to expand),
    // so any handoff that was in flight has resolved — safe to stop
    // suppressing the fallback below.
    suppressOctetCollapseUntilExpanded = false;

    if (isSameOctet) {
        // Focus moved within the same already-expanded octet. The one case
        // that still needs handling here: focus landing back on the
        // octet's own compact field, which is muted + read-only while
        // expanded and was never meant to hold focus at all (a stray
        // .focus() call, browser autofill, or assistive-tech navigation
        // can still land it there even with tabIndex -1 and
        // pointer-events: none). Bounce it straight to the first bit box
        // instead of leaving focus stranded in a field the student can no
        // longer edit but could still select text in.
        if (e.target.classList.contains('ip-octet-collapsed')) {
            const firstBit = document.querySelector(
                `.octet-bitbox[data-qid="${qid}"][data-oct="${oct}"][data-idx="0"]`
            );
            if (firstBit) firstBit.focus();
        }
        return;
    }

    if (currentlyExpandedOctet) {
        collapseOctetBinaryInput(currentlyExpandedOctet.qid, currentlyExpandedOctet.oct);
    }

    // Set BEFORE expandOctetBinaryInput runs: that call mutates the still-
    // focused compact field (hideCollapsedField flips its tabIndex/opacity),
    // which can itself synchronously trigger a focusout in some browsers —
    // ahead of the deferred rAF callback below that actually moves focus
    // into the bit grid. Flagging the handoff as "in progress" first means
    // that incidental focusout gets ignored instead of collapsing the card
    // we just opened.
    suppressOctetCollapseUntilExpanded = true;

    const boxes = expandOctetBinaryInput(qid, oct);
    if (!boxes) {
        suppressOctetCollapseUntilExpanded = false;
        return;
    }

    // If focus landed on the compact field itself (a fresh click/tab into
    // this octet, as opposed to a programmatic .focus() aimed straight at
    // a box — e.g. the last-bit auto-advance below), hand focus to the
    // first bit box. Deferred (via rAF) to its own task so it's never
    // nested inside this focusin dispatch.
    if (e.target.classList.contains('ip-octet-collapsed')) {
        const firstBit = boxes[0];
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (!firstBit) {
                    suppressOctetCollapseUntilExpanded = false;
                    return;
                }
                firstBit.focus();
                if (document.activeElement === firstBit) {
                    suppressOctetCollapseUntilExpanded = false;
                    return;
                }
                // Rare fallback: if focus still didn't land (e.g. an even
                // slower style/layout resolution on some browser/device),
                // give it one more attempt a frame later rather than
                // silently leaving focus stranded. Suppression stays on
                // through this retry too, so a stray focusout in between
                // can't collapse the card before the retry gets its chance.
                requestAnimationFrame(() => {
                    firstBit.focus();
                    suppressOctetCollapseUntilExpanded = false;
                });
            });
        });
    } else {
        suppressOctetCollapseUntilExpanded = false;
    }
}

// Fallback for the case focusin can't resolve on its own: focus leaving
// to nowhere at all (e.g. clicking non-interactive blank space, or the
// last octet's last box releasing focus with nothing next to take it) —
// this fires a focusout with no corresponding focusin anywhere.
function handleOctetFocusOutFallback(e) {
    // We're mid-handoff (compact field -> first bit box, or one octet
    // collapsing while another expands) — this focusout is incidental to
    // our own choreography, not a real "the user moved focus away" event.
    // Ignore it; handleOctetFocusIn will clear this flag once focus
    // actually lands, or the pending setTimeout will clear it either way.
    if (suppressOctetCollapseUntilExpanded) return;

    // When the browser tells us exactly where focus is going, resolve it
    // synchronously instead of guessing after a timeout.
    const next = e && e.relatedTarget;
    if (next) {
        const nextWrapper = next.closest && next.closest('.octet-expand-wrapper');
        if (currentlyExpandedOctet && nextWrapper &&
            nextWrapper.dataset.qid === currentlyExpandedOctet.qid &&
            nextWrapper.dataset.oct === currentlyExpandedOctet.oct) {
            return; // staying within the same expanded octet — nothing to do
        }
    }

    setTimeout(() => {
        // Re-check: a handoff may have started (and been flagged) after
        // this timeout was scheduled but before it ran.
        if (suppressOctetCollapseUntilExpanded) return;
        if (!currentlyExpandedOctet) return;
        const wrapper = document.querySelector(
            `.octet-expand-wrapper[data-qid="${currentlyExpandedOctet.qid}"][data-oct="${currentlyExpandedOctet.oct}"]`
        );
        if (wrapper && !wrapper.contains(document.activeElement)) {
            collapseOctetBinaryInput(currentlyExpandedOctet.qid, currentlyExpandedOctet.oct);
            saveConversionProgress();
        }
    }, 0);
}

let octetFocusTrackingAttached = false;

// Wires up Phase 3's expand-on-focus behavior: focusing a collapsed octet
// field expands it into Phase 1-style bit boxes; typing a bit auto-advances
// within the octet (mirroring Phase 1); filling the 8th bit auto-collapses
// and advances to the next octet; and focus leaving the octet entirely
// (tab, click elsewhere) also collapses it back to the compact field.
function attachExpandableOctetHandlers() {
    document.querySelectorAll('.ip-octet-collapsed').forEach(inp => {
        inp.addEventListener('input', () => saveConversionProgress());
        // Note: no direct 'focus' listener here that calls
        // expandOctetBinaryInput — that's handled centrally by the
        // delegated focusin listener attached once below. See the big
        // comment on handleOctetFocusIn for why.
    });

    // The delegated focusin/focusout listeners aren't tied to any
    // particular exercise's DOM (they look elements up by data-qid/
    // data-oct at the time they fire), so they only need attaching once
    // ever — attaching them again on every exercise switch would stack up
    // duplicate listeners.
    if (!octetFocusTrackingAttached) {
        octetFocusTrackingAttached = true;
        document.addEventListener('focusin', handleOctetFocusIn);
        document.addEventListener('focusout', handleOctetFocusOutFallback);
    }

    const boxes = Array.from(document.querySelectorAll('.octet-bitbox'));
    boxes.forEach(box => {
        // Select any existing digit when the box gains focus (via click,
        // Tab, or arrow-key navigation) so typing immediately overwrites
        // it instead of requiring a manual delete first. Deferred a tick
        // since some mobile browsers reset the selection right after the
        // focus event if select() is called synchronously.
        box.addEventListener('focus', () => {
            setTimeout(() => box.select(), 0);
        });
        box.addEventListener('input', e => {
            const qid = e.target.dataset.qid;
            const oct = e.target.dataset.oct;
            const idx = parseInt(e.target.dataset.idx, 10);

            let v = e.target.value.replace(/[^01]/g, '').slice(-1);
            e.target.value = v;
            e.target.classList.remove('on', 'off');
            if (v === '1') e.target.classList.add('on');
            else if (v === '0') e.target.classList.add('off');
            updateBitPlaceValueLabel(qid, oct, idx, v);

            updateCollapsedOctetValue(qid, oct);
            saveConversionProgress();

            if (v && idx < 7) {
                const nextBox = document.querySelector(`.octet-bitbox[data-qid="${qid}"][data-oct="${oct}"][data-idx="${idx + 1}"]`);
                if (nextBox) nextBox.focus();
            } else if (v && idx === 7) {
                // Last bit of this octet — hop to the next octet's field,
                // same "keep moving forward" feel as Phase 1's own
                // auto-advance. Just move focus: the delegated focusin
                // listener (handleOctetFocusIn) reacts to that focus
                // change and handles collapsing this octet's card and
                // expanding the next one, in that order, automatically.
                const nextOct = parseInt(oct, 10) + 1;
                const nextCollapsed = nextOct <= 3
                    ? document.querySelector(`.ip-octet-collapsed[data-qid="${qid}"][data-oct="${nextOct}"]`)
                    : null;

                if (nextCollapsed) {
                    nextCollapsed.focus();
                } else {
                    // Last bit of the last octet — nothing further to
                    // focus; releasing focus lets the focusout fallback
                    // collapse this card.
                    e.target.blur();
                }
            }
        });
        box.addEventListener('keydown', e => {
            const qid = e.target.dataset.qid;
            const oct = e.target.dataset.oct;
            const idx = parseInt(e.target.dataset.idx, 10);
            if (e.key === 'Backspace' && !e.target.value && idx > 0) {
                const prevBox = document.querySelector(`.octet-bitbox[data-qid="${qid}"][data-oct="${oct}"][data-idx="${idx - 1}"]`);
                if (prevBox) prevBox.focus();
            }
            if (e.key === 'ArrowLeft' && idx > 0) {
                const prevBox = document.querySelector(`.octet-bitbox[data-qid="${qid}"][data-oct="${oct}"][data-idx="${idx - 1}"]`);
                if (prevBox) prevBox.focus();
            }
            if (e.key === 'ArrowRight' && idx < 7) {
                const nextBox = document.querySelector(`.octet-bitbox[data-qid="${qid}"][data-oct="${oct}"][data-idx="${idx + 1}"]`);
                if (nextBox) nextBox.focus();
            }
        });
    });
}

// Wires up input formatting/auto-advance for bit boxes, and plain change
// listeners for the other input types, on whatever is currently rendered
// in #codeDisplay.
function attachConversionInputHandlers(ex) {
    if (!ex) return;
    if (ex.type === 'd2b') {
        const boxes = Array.from(document.querySelectorAll('.bitbox'));
        boxes.forEach((box, idx) => {
            // Select any existing digit on focus so typing overwrites it
            // instead of requiring a manual delete first (see the matching
            // comment in attachExpandableOctetHandlers for why this is
            // deferred a tick).
            box.addEventListener('focus', () => {
                setTimeout(() => box.select(), 0);
            });
            box.addEventListener('input', e => {
                let v = e.target.value.replace(/[^01]/g, '').slice(-1);
                e.target.value = v;
                e.target.classList.remove('on', 'off');
                if (v === '1') e.target.classList.add('on');
                else if (v === '0') e.target.classList.add('off');
                updatePlainBitPlaceValueLabel(e.target.dataset.qid, idx, v);
                if (v && idx < boxes.length - 1) boxes[idx + 1].focus();
                saveConversionProgress();
            });
            box.addEventListener('keydown', e => {
                if (e.key === 'Backspace' && !e.target.value && idx > 0) boxes[idx - 1].focus();
                if (e.key === 'ArrowLeft' && idx > 0) boxes[idx - 1].focus();
                if (e.key === 'ArrowRight' && idx < boxes.length - 1) boxes[idx + 1].focus();
            });
        });
    } else if (ex.type === 'ip_d2b' || ex.type === 'mask_d2b') {
        attachExpandableOctetHandlers();
    } else if (ex.type === 'atom1') {
        attachAtom1Handlers(currentFile, ex);
    } else {
        document.querySelectorAll('.answer-input-num, .ip-octet-bin, .ip-octet-dec').forEach(inp => {
            inp.addEventListener('input', () => saveConversionProgress());
        });
    }
}


function saveProgress(index, value) {
    if (exerciseData[currentFile]) {
        if (exerciseData[currentFile].isLineOrdering) {
            // For line ordering, progress tracking happens via drag/drop
            return;
        } else {
            // Legacy: for fill-in-the-blank
            exerciseData[currentFile].userProgress[index] = value;
        }
    }
    saveSessionProgress();
}

function setInputsDisabled(disabled) {
    const ex = exerciseData[currentFile];
    
    // Handle line ordering exercises
    if (ex && ex.isLineOrdering) {
        const draggableLines = document.querySelectorAll('.draggable-line');
        draggableLines.forEach(line => {
            line.draggable = !disabled;
            const jumpSelect = line.querySelector('.jump-to-select');
            if (jumpSelect) jumpSelect.disabled = disabled;
            if (disabled) {
                line.classList.add('locked');
                line.setAttribute('title', 'Locked');
            } else {
                line.classList.remove('locked');
                line.removeAttribute('title');
            }
        });
        refreshUpDownButtonStates(disabled);
    }

    // Handle binary/IP conversion questions
    if (ex && ex.isConversionQuestion) {
        document.querySelectorAll('.bitbox, .answer-input-num, .ip-octet-bin, .ip-octet-dec').forEach(inp => {
            inp.disabled = disabled;
            if (disabled) {
                inp.classList.add('locked');
                inp.setAttribute('title', 'Locked');
            } else {
                inp.classList.remove('locked');
                inp.removeAttribute('title');
            }
        });
        // Atom 1's answer mechanism is clicking bits, not typing into an
        // <input>, so it gets its own lock toggle (pointer-events, see CSS).
        document.querySelectorAll('.atom1-bitgrid').forEach(grid => {
            grid.classList.toggle('atom1-locked', disabled);
        });
    }
    
    // Legacy: handle fill-in-the-blank exercises
    const inputs = document.querySelectorAll('.code-input');
    inputs.forEach(input => {
        input.disabled = disabled;
        if (disabled) {
            input.classList.add('locked');
            input.setAttribute('title', 'Locked');
        } else {
            input.classList.remove('locked');
            input.removeAttribute('title');
        }
    });
    
    const editor = document.querySelector('.code-editor');
    if (editor) {
        if (disabled) editor.classList.add('locked'); 
        else editor.classList.remove('locked');
    }
}

function updateSidebarScore(file) {
    const safeId = file.replace(/\./g, '-');
    const scoreSpan = document.getElementById(`score-${safeId}`);
    const ex = exerciseData[file];
    if (!scoreSpan || !ex) return;
    scoreSpan.textContent = `${ex.score}/${ex.answers.length}`;
    
    // Remove all score classes first
    scoreSpan.classList.remove('completed-score', 'partial-score');
    
    // Add appropriate class based on score
    if (ex.score === ex.answers.length) {
        scoreSpan.classList.add('completed-score');  // 100% correct
    } else if (ex.score > 0) {
        scoreSpan.classList.add('partial-score');     // Partial correct
    }
    // If score is 0, keep default styling (unanswered)
}

function updateSummaryPanel() {
    let totalGot = 0;
    let totalPossible = 0;
    for (const file in exerciseData) {
        const ex = exerciseData[file];
        totalGot += Number(ex.score || 0);
        totalPossible += ex.answers.length;
    }
    document.getElementById('summaryValue').textContent = `${totalGot} / ${totalPossible}`;

    // Keep the sidebar QR code in sync with the running total so it always
    // reflects the student's current score, not just the score at the end.
    // Encryption is async, so this fires and updates the QR once ready.
    if (currentUser) {
        buildResultsShareUrl(totalGot, totalPossible).then(shareUrl => {
            renderQrInto('sidebarQrCodeBox', shareUrl, 110);
        });
    }
}

// --- MODE-AWARE DEFAULT LANDING PAGE ---
// Practice Mode lands on the ungraded Subnet Visualizer (exploratory,
// no stakes). Exam Mode must never land there — it's a live answer
// calculator, the opposite of what a timed assessment should hand a
// student by default — so instead this walks the Atoms in order and
// opens the first one that actually has generated questions (an Atom
// with numQuestions: 0 or enabled: false produces none, per
// buildAtomNQuestionList). If literally no Atom has questions, it falls
// back to the first item in the graded Exercises list, and if THAT'S
// empty too, leaves the exerciseArea's own "Select an Exercise" empty
// state showing rather than opening anything.
function showDefaultLandingPage() {
    const hasAtom6 = Object.keys(exerciseData).some(file => file.indexOf('atom6-') === 0);
    if (hasAtom6) {
        showAtom6Page();
        return;
    }

    const atomPages = [
        ['atom6', showAtom6Page],
        ['atom8', showAtom8Page],
        ['atom9', showAtom9Page],
        ['atom1', showAtom1Page],
        ['atom2', showAtom2Page],
        ['atom3', showAtom3Page],
        ['atom4', showAtom4Page],
        ['atom5', showAtom5Page]
    ];
    for (const [key, showFn] of atomPages) {
        const hasQuestions = key === 'atom8'
            ? !!exerciseData['atom8-main']
            : key === 'atom9'
                ? atom9QuestionIds.length > 0
                : Object.keys(exerciseData).some(file => file.indexOf(key + '-q') === 0);
        if (hasQuestions) {
            showFn();
            return;
        }
    }

    const firstExerciseLi = document.querySelector('#fileList li:not(.sidebar-phase-header)');
    if (firstExerciseLi) {
        firstExerciseLi.click();
        return;
    }

    // Nothing scored is configured at all — show the empty "Select an
    // Exercise" state instead of leaving every view hidden.
    document.querySelectorAll('.sidebar li').forEach(l => l.classList.remove('active'));
    hideAllAtomPaginationBars();
    document.getElementById('subnetVisualizerView').style.display = 'none';
    document.getElementById('atomPlaceholderView').style.display = 'none';
    ['atom1View', 'atom2View', 'atom3View', 'atom4View', 'atom5View', 'atom6View', 'atom7View', 'atom8View', 'atom9View'].forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
    document.getElementById('exerciseArea').style.display = 'block';
    currentFile = '';
}

// --- SUBNET VISUALIZER (ungraded tool) — sidebar view toggle ---
// Swaps the main content column between the graded exercise view and the
// Subnetify panels. Lazily initializes the visualizer engine on first
// open (its DOM already exists, just hidden, so this only wires up event
// listeners + does the first render — see SubnetVisualizer.init's guard).
function showSubnetVisualizer() {
    document.querySelectorAll('.sidebar li').forEach(l => l.classList.remove('active'));
    const navItem = document.getElementById('nav-subnetVisualizer');
    if (navItem) navItem.classList.add('active');

    document.getElementById('exerciseArea').style.display = 'none';
    document.getElementById('atomPlaceholderView').style.display = 'none';
    document.getElementById('atom1View').style.display = 'none';
    document.getElementById('atom2View').style.display = 'none';
    document.getElementById('atom3View').style.display = 'none';
    document.getElementById('atom4View').style.display = 'none';
    document.getElementById('atom5View').style.display = 'none';
    document.getElementById('atom6View').style.display = 'none';
    document.getElementById('atom7View').style.display = 'none';
    document.getElementById('atom8View').style.display = 'none';
    document.getElementById('atom9View').style.display = 'none';
    document.getElementById('subnetVisualizerView').style.display = 'flex';

    hideAllAtomPaginationBars();

    currentFile = ''; // no graded exercise is "current" while the tool is open

    // The console drawer/output panel is exercise-specific (sample output
    // for a conversion question) and has no meaning here — close it so it
    // doesn't linger over the visualizer. currentFile is cleared first so
    // updateConsoleDrawerTab correctly finds no sample output to pull up.
    closeSampleOutputModal();
    updateConsoleDrawerTab(false);

    SubnetVisualizer.init();

    closeSidebarIfMobile();
}

// --- ATOM PAGES (ungraded, placeholder) — sidebar sub-navigation under Subnetify ---
// Swaps the main content column to a simple "coming soon" placeholder view.
// Mirrors showSubnetVisualizer's pattern (hide every other view, clear
// currentFile, close the console drawer) so the same page-switching rules
// apply uniformly once real content replaces this placeholder.
function showAtomPage(atomNumber) {
    document.querySelectorAll('.sidebar li').forEach(l => l.classList.remove('active'));
    const navItem = document.getElementById(`nav-atom${atomNumber}`);
    if (navItem) navItem.classList.add('active');

    document.getElementById('exerciseArea').style.display = 'none';
    document.getElementById('timerContainer').style.display = 'none';
    document.getElementById('subnetVisualizerView').style.display = 'none';
    document.getElementById('atom1View').style.display = 'none';
    document.getElementById('atom2View').style.display = 'none';
    document.getElementById('atom3View').style.display = 'none';
    document.getElementById('atom4View').style.display = 'none';
    document.getElementById('atom5View').style.display = 'none';
    document.getElementById('atom6View').style.display = 'none';
    document.getElementById('atom7View').style.display = 'none';
    document.getElementById('atom8View').style.display = 'none';
    document.getElementById('atom9View').style.display = 'none';
    document.getElementById('atomPlaceholderView').style.display = 'block';
    document.getElementById('atomPlaceholderTitle').textContent = `Atom ${atomNumber}`;

    hideAllAtomPaginationBars();

    currentFile = ''; // no graded exercise is "current" while a placeholder page is open

    // Same reasoning as showSubnetVisualizer: the console drawer/output
    // panel is exercise-specific and has no meaning here.
    closeSampleOutputModal();
    updateConsoleDrawerTab(false);

    closeSidebarIfMobile();
}

function switchExercise(name, el) {
    currentFile = name;
    document.getElementById('subnetVisualizerView').style.display = 'none';
    document.getElementById('atomPlaceholderView').style.display = 'none';
    document.getElementById('atom1View').style.display = 'none';
    document.getElementById('atom2View').style.display = 'none';
    document.getElementById('atom3View').style.display = 'none';
    document.getElementById('atom4View').style.display = 'none';
    document.getElementById('atom5View').style.display = 'none';
    document.getElementById('atom6View').style.display = 'none';
    document.getElementById('atom7View').style.display = 'none';
    document.getElementById('atom8View').style.display = 'none';
    document.getElementById('atom9View').style.display = 'none';
    document.getElementById('exerciseArea').style.display = 'block';
    // The atom pagination bars are direct children of <main> now (real
    // block-level siblings of #contentScrollArea, not nested inside their
    // own atomXView — see index.html), so hiding an atomXView no longer
    // hides its bar "for free"; hide all four explicitly here too.
    hideAllAtomPaginationBars();
    // Keep the optional activity timer visible when it is running.
    if (timerIntervalId) {
        document.getElementById('timerContainer').style.display = 'flex';
    }
    document.querySelectorAll('.sidebar li').forEach(l => l.classList.remove('active'));
    el.classList.add('active');
    
    document.getElementById('currentFileName').textContent = exerciseData[name].label || name;
    const display = document.getElementById('codeDisplay');
    display.innerHTML = exerciseData[name].html;

    // Handle line ordering exercises
    if (exerciseData[name].isLineOrdering) {
        setupDragAndDrop();
        setupJumpToUI(name);
        restoreUserOrder(name);
        setupUpDownButtons();
    } else if (exerciseData[name].isConversionQuestion) {
        attachConversionInputHandlers(exerciseData[name]);
        restoreConversionAnswer(exerciseData[name]);
    } else {
        // Legacy: fill-in-the-blank handling
        const inputs = display.querySelectorAll('.code-input');
        inputs.forEach((input, index) => {
            input.value = exerciseData[name].userProgress[index];
        });
    }

    // Restore disabled state and styles if previously verified (locked)
    const ex = exerciseData[name];
    if (ex.locked) {
        if (ex.isLineOrdering) {
            document.querySelectorAll('.draggable-line').forEach(draggableEl => {
                draggableEl.draggable = false;
                draggableEl.classList.add('locked');
                const jumpSelect = draggableEl.querySelector('.jump-to-select');
                if (jumpSelect) jumpSelect.disabled = true;
            });
            // Re-derive correct/incorrect styling from the (possibly
            // restored) line order, since the DOM was just rebuilt from
            // ex.html above and doesn't carry the classes over on its own.
            applyLineOrderingLockedStyling(ex);
        } else if (ex.isConversionQuestion) {
            const { allCorrect } = gradeConversionScore(ex, ex.userAnswer);
            const qCard = document.querySelector('.conversion-question');
            if (qCard) qCard.classList.add(allCorrect ? 'correct' : 'incorrect');
            applyOctetFeedback(ex); // Phase 3/4: re-color each octet on return visits
        } else {
            const inputs = display.querySelectorAll('.code-input');
            inputs.forEach((input, idx) => {
                const val = input.value.trim();
                if (ex.answers[idx].includes(val)) {
                    input.style.borderBottomColor = "var(--secondary)";
                } else {
                    input.style.borderBottomColor = "var(--error)";
                }
            });
        }
        setInputsDisabled(true);
        
        // Only Practice mode permits another attempt after verification.
        if (isRetryAllowed()) {
            document.getElementById('actionButton').textContent = 'Reset';
        } else {
            document.getElementById('actionButton').textContent = 'Locked';
            document.getElementById('actionButton').disabled = true;
        }
    } else {
        // Editable
        setInputsDisabled(false);
        if (!ex.isLineOrdering && !ex.isConversionQuestion) {
            display.querySelectorAll('.code-input').forEach(i => i.style.borderBottomColor = 'var(--secondary)');
        }
        document.getElementById('actionButton').textContent = 'Verify Answer';
        document.getElementById('actionButton').disabled = false;
    }

    updateSidebarScore(name);
    updateSummaryPanel();

    // Show the persisted feedback if this question was already checked
    // (so switching away and back — including across an exam-mode
    // reload — doesn't lose it), otherwise fully clear both the text AND
    // the class. Clearing text alone previously left the colored
    // success/error/warning box styling behind on a blank feedback area.
    const feedbackEl = document.getElementById('feedback');
    if (ex.locked) {
        const feedback = buildFeedbackForExercise(ex);
        renderFeedback(feedbackEl, feedback);
        feedbackEl.className = feedback.cls;
    } else {
        feedbackEl.textContent = "";
        feedbackEl.className = "";
    }

    // Auto-show/hide the console panel per the global "Sample Output"
    // setting (Settings modal), which now applies uniformly across every
    // activity rather than being toggled per exercise. The drawer tab
    // (updated inside showSampleOutput/closeSampleOutputModal) remains
    // available for the student to manually pull the panel into view for
    // this activity regardless of the setting.
    applyAutoShowForCurrentExercise();
}

// Marks each draggable line in the current #orderingArea as correct/incorrect
// based on its DOM position vs. ex.validPositionsMap. Shared by checkAnswers
// (right after verifying) and by switchExercise (when redisplaying an
// already-locked exercise, e.g. after restoring a persisted exam session),
// so the green/red styling matches the stored result either way.
function applyLineOrderingLockedStyling(ex) {
    if (!ex || !ex.isLineOrdering) return [];
    const orderingArea = document.getElementById('orderingArea');
    if (!orderingArea) return [];

    const orderedLines = Array.from(orderingArea.querySelectorAll('.draggable-line'));
    const usedValidPositions = new Set();

    orderedLines.forEach((lineEl, idx) => {
        lineEl.classList.remove('correct', 'incorrect');
        const originalIdx = parseInt(lineEl.getAttribute('data-original-idx'));
        const validPositions = ex.validPositionsMap[originalIdx];

        let isCorrect = false;
        if (validPositions && validPositions.length === 1) {
            isCorrect = (originalIdx === idx);
        } else if (validPositions && validPositions.length > 1) {
            isCorrect = validPositions.includes(idx) && !usedValidPositions.has(idx);
            if (isCorrect) usedValidPositions.add(idx);
        }

        lineEl.classList.add(isCorrect ? 'correct' : 'incorrect');
    });

    return orderedLines;
}

// Determines whether a conversion question's stored answer represents no
// attempt at all (as opposed to an attempt that happens to be wrong). This
// matters because exam-time-expiry force-locks every exercise — including
// ones the student never opened or typed into — and without this check
// those would be graded/labeled the same as a genuine wrong attempt.
function isConversionAnswerEmpty(ex) {
    if (!ex || !ex.isConversionQuestion) return true;
    const ans = ex.userAnswer || '';
    if (ex.type === 'd2b') {
        // Untouched bit boxes are represented as '_' by
        // collectConversionAnswer, so all-underscore (or empty) means
        // nothing was typed.
        return ans.length === 0 || /^_+$/.test(ans);
    }
    if (ex.type === 'ip_d2b' || ex.type === 'ip_b2d' || ex.type === 'mask_d2b' || ex.type === 'mask_c2d') {
        return ans.split('.').every(part => part.trim() === '');
    }
    // b2d, class_cidr
    return ans.trim() === '';
}

// Builds the feedback message + CSS class for an exercise based on its
// current score/lock state. Shared by checkAnswers (right after verifying)
// and switchExercise (to restore the same feedback when the student
// navigates back to an already-checked question, instead of leaving it
// blank) — so the message is always consistent no matter how it's reached,
// and exam mode never reveals the correct answer either way.
function buildFeedbackForExercise(ex) {
    const totalLines = ex.answers.length;
    const score = ex.score || 0;
    const perfect = score === totalLines;

    if (perfect) {
        return {
            text: ex.isConversionQuestion ? "Correct!" : "Perfect! All lines in correct order!",
            icon: "fa-solid fa-sparkles",
            cls: "success show",
            perfect: true
        };
    }
    if (ex.isConversionQuestion) {
        // If time ran out (or the student otherwise never entered anything)
        // before this question was ever attempted, say so plainly instead
        // of "Not quite" — there was nothing to grade as wrong.
        if (score === 0 && isConversionAnswerEmpty(ex)) {
            return {
                text: "No answer submitted.",
                icon: null,
                cls: "error show",
                perfect: false
            };
        }
        // Neither mode reveals the correct value here: practice mode lets
        // the student reset and try again, and exam mode has no reset, so
        // showing it would double as an answer key mid-exam.
        if (totalLines > 1) {
            // Octet-scored (Phase 3 · IP Dec→Bin / Phase 4 · IP Bin→Dec) or
            // item-scored (Atom 3: boundary + mask + each subnet row):
            // partial credit is possible either way, so surface how many
            // were right rather than a flat "not quite".
            const unit = ex.type === 'atom3' ? 'items' : 'octets';
            return {
                text: isRetryAllowed()
                    ? `${score}/${totalLines} ${unit} correct — try again.`
                    : `${score}/${totalLines} ${unit} correct.`,
                icon: null,
                cls: score > 0 ? "warning show" : "error show",
                perfect: false
            };
        }
        return {
            text: "Not quite" + (isRetryAllowed() ? " — try again." : "."),
            icon: null,
            cls: "error show",
            perfect: false
        };
    }
    return {
        text: `Progress: ${score}/${totalLines} correct.`,
        icon: null,
        cls: "warning show",
        perfect: false
    };
}

// Renders a buildFeedbackForExercise() result into a target element as
// FontAwesome icon + text (when an icon is present) or plain text
// otherwise. Centralized here so every call site renders feedback the
// same way instead of duplicating the innerHTML-vs-textContent choice.
function renderFeedback(targetEl, feedback) {
    if (feedback.icon) {
        targetEl.innerHTML = `<i class="${feedback.icon}" aria-hidden="true"></i> ${feedback.text}`;
    } else {
        targetEl.textContent = feedback.text;
    }
}

function checkAnswers() {
    if (!currentFile) return;
    const ex = exerciseData[currentFile];
    let score = 0;

    if (ex.isLineOrdering) {
        // Save user's ordering before verification
        const orderingArea = document.getElementById('orderingArea');
        const orderedLinesBefore = Array.from(orderingArea.querySelectorAll('.draggable-line'));
        ex.userOrder = orderedLinesBefore.map(el => parseInt(el.getAttribute('data-original-idx')));

        // Verify line ordering (with semantic equivalence for identical
        // lines) and apply correct/incorrect styling in one pass.
        const orderedLines = applyLineOrderingLockedStyling(ex);
        score = orderedLines.filter(el => el.classList.contains('correct')).length;
    } else if (ex.isConversionQuestion) {
        ex.userAnswer = collectConversionAnswer(ex);
        const { score: earnedScore, allCorrect } = gradeConversionScore(ex, ex.userAnswer);
        score = earnedScore;
        const qCard = document.querySelector('.conversion-question');
        if (qCard) qCard.classList.add(allCorrect ? 'correct' : 'incorrect');
        applyOctetFeedback(ex); // Phase 3/4: color each octet individually
    } else {
        // Legacy: fill-in-the-blank verification
        const inputs = document.querySelectorAll('.code-input');
        const correctArr = ex.answers;

        inputs.forEach((input, index) => {
            const val = input.value.trim();
            if (correctArr[index].includes(val)) {
                input.style.borderBottomColor = "var(--secondary)";
                score++;
            } else {
                input.style.borderBottomColor = "var(--error)";
            }
        });
    }

    // Lock inputs and mark exercise locked
    setInputsDisabled(true);
    ex.score = score;
    ex.locked = true;
    
    const totalLines = ex.answers.length;
    ex.isPartial = score > 0 && score < totalLines;

    // Update Sidebar Score
    updateSidebarScore(currentFile);
    updateSummaryPanel();

    const msg = document.getElementById('feedback');
    const feedback = buildFeedbackForExercise(ex);
    renderFeedback(msg, feedback);
    msg.className = feedback.cls;
    if (feedback.perfect) {
        // Bigger & longer confetti
        triggerBigConfetti();
    }

    saveSessionProgress();

    // Change action button based on mode
    const actionBtn = document.getElementById('actionButton');
    if (appSettings.mode === 'exam') {
        actionBtn.textContent = 'Locked';
        actionBtn.disabled = true;

        // Check if all exercises have been answered in exam mode
        if (checkIfAllAnswered()) {
            // Stop timer early and show score summary
            stopTimer();
            setTimeout(() => {
                showScoreSummaryModal('Congratulations! All exercises completed before time ran out!', 'success');
            }, 500);
        }
    } else {
        actionBtn.textContent = 'Reset';
    }
}

function resetCurrentExercise() {
    if (!currentFile) return;
    
    // Prevent reset in exam mode
    if (!isRetryAllowed()) {
        showAlertModal('Reset Not Allowed', sessionTimedOut ? 'Reset is not allowed after time expires.' : 'Reset is not allowed in Exam Mode.');
        return;
    }
    
    const ex = exerciseData[currentFile];
    
    if (ex.isLineOrdering) {
        ex.userOrder = [];
        const orderingArea = document.getElementById('orderingArea');
        
        // Reshuffle the lines back to their original shuffled positions
        const shuffledLines = ex.shuffledIndices.map(origIdx => {
            const draggableEl = orderingArea.querySelector(`[data-original-idx="${origIdx}"]`);
            return draggableEl;
        });
        
        // Sort by current position in shuffled order and re-render
        shuffledLines.forEach((el, idx) => {
            if (el) {
                orderingArea.appendChild(el);
                el.classList.remove('correct', 'incorrect');
            }
        });
        setupDragAndDrop();
        setupJumpToUI(currentFile);
        setupUpDownButtons();
    } else if (ex.isConversionQuestion) {
        ex.userAnswer = '';
        document.querySelectorAll('.bitbox').forEach(b => {
            b.value = '';
            b.classList.remove('on', 'off');
        });
        document.querySelectorAll('.answer-input-num, .ip-octet-bin, .ip-octet-dec').forEach(i => i.value = '');
        const qCard = document.querySelector('.conversion-question');
        if (qCard) qCard.classList.remove('correct', 'incorrect');
        clearOctetFeedback(); // Phase 3/4: remove leftover per-octet coloring from the prior attempt
        if (ex.type === 'atom1') {
            updateAtom1Grid(currentFile, ex, 0);
        }
    } else {
        // Legacy: fill-in-the-blank reset
        ex.userProgress = ex.userProgress.map(() => "");
        const display = document.getElementById('codeDisplay');
        const inputs = display.querySelectorAll('.code-input');
        inputs.forEach((input) => {
            input.value = '';
            input.style.borderBottomColor = 'var(--secondary)';
        });
    }
    
    ex.score = 0;
    ex.locked = false;
    setInputsDisabled(false);

    // Update sidebar and summary
    updateSidebarScore(currentFile);
    updateSummaryPanel();

    // Reset feedback and action button
    const feedbackEl = document.getElementById('feedback');
    feedbackEl.textContent = '';
    feedbackEl.className = '';
    document.getElementById('actionButton').textContent = 'Verify Answer';
    saveSessionProgress();
}

function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6200ee', '#03dac6', '#ffca28']
    });
}

function triggerBigConfetti() {
    // Burst multiple waves for a bigger, longer celebration
    const colors = ['#6200ee', '#03dac6', '#ffca28', '#ff4081', '#00bcd4'];
    const bursts = [
        { particleCount: 300, spread: 120, startVelocity: 40 },
        { particleCount: 200, spread: 140, startVelocity: 30 },
        { particleCount: 150, spread: 160, startVelocity: 20 }
    ];

    let delay = 0;
    bursts.forEach(b => {
        setTimeout(() => {
            confetti(Object.assign({}, b, { origin: { y: 0.6 }, colors }));
        }, delay);
        delay += 500; // space the bursts
    });
}
function exportProgress() {
    let csv = "Student,Exercise,Score\n";
    for (const file in exerciseData) {
        const ex = exerciseData[file];
        const label = (ex.label || file).replace(/"/g, '""');
        csv += `${currentUser},"${label}",${ex.score || 0}/${ex.answers.length}\n`;
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentUser}_results.csv`;
    a.click();
}

// --- SETTINGS AND MODE MANAGEMENT ---
function openSettingsModal() {
    document.getElementById('settingsModal').style.display = 'block';
    document.getElementById('settingsOverlay').style.display = 'block';
    
    // Set current settings in the modal
    document.querySelector(`input[name="mode"][value="${appSettings.mode}"]`).checked = true;
    document.getElementById('timerInput').value = appSettings.timerMinutes;
    const timerToggle = document.getElementById('timerEnabledToggle');
    if (timerToggle) timerToggle.checked = appSettings.timerEnabled;
    const persistenceToggle = document.getElementById('persistenceEnabledToggle');
    if (persistenceToggle) persistenceToggle.checked = appSettings.persistenceEnabled;
    updateTimerSettingState();

    const autoShowToggle = document.getElementById('autoShowSampleToggle');
    if (autoShowToggle) {
        autoShowToggle.checked = appSettings.autoShowSample;
    }

    const practiceSeedInput = document.querySelector(`input[name="practiceSeedMode"][value="${appSettings.practiceQuestionMode}"]`);
    if (practiceSeedInput) practiceSeedInput.checked = true;
    
}

function closeSettingsModal() {
    document.getElementById('settingsModal').style.display = 'none';
    document.getElementById('settingsOverlay').style.display = 'none';
}

function handleModeChange() {
    // Mode controls retry permission only. Timer, persistence, and seeding
    // remain visible and independently configurable.
}

function updateTimerSettingState() {
    const toggle = document.getElementById('timerEnabledToggle');
    const input = document.getElementById('timerInput');
    if (input) input.disabled = !(toggle && toggle.checked);
}

function validateTimerInput(input) {
    let value = parseInt(input.value, 10);
    
    if (isNaN(value)) {
        input.classList.add('invalid');
        return false;
    }
    
    if (value < 1) {
        input.value = '1';
        input.classList.remove('invalid');
    } else if (value > 999) {
        input.value = '999';
        input.classList.remove('invalid');
    } else {
        input.classList.remove('invalid');
    }
    
    return true;
}

function saveSettings() {
    const selectedMode = document.querySelector('input[name="mode"]:checked').value;
    const timerInput = document.getElementById('timerInput');
    const timerValue = parseInt(timerInput.value, 10);
    const timerEnabled = !!document.getElementById('timerEnabledToggle')?.checked;
    const persistenceEnabled = !!document.getElementById('persistenceEnabledToggle')?.checked;
    
    // Validate timer input
    if (timerEnabled) {
        if (isNaN(timerValue) || timerValue < 1 || timerValue > 999) {
            alert('Please enter a valid timer value between 1 and 999 minutes.');
            return;
        }
        appSettings.timerMinutes = timerValue;
    }
    
    appSettings.mode = selectedMode;
    appSettings.timerEnabled = timerEnabled;
    appSettings.persistenceEnabled = persistenceEnabled;

    const autoShowToggle = document.getElementById('autoShowSampleToggle');
    if (autoShowToggle) {
        appSettings.autoShowSample = autoShowToggle.checked;
    }

    const practiceSeedInput = document.querySelector('input[name="practiceSeedMode"]:checked');
    if (practiceSeedInput) {
        const previousPracticeQuestionMode = appSettings.practiceQuestionMode;
        appSettings.practiceQuestionMode = practiceSeedInput.value;
        // Clear any already-generated random seed whenever the setting
        // changes, so the next login/session generates a genuinely fresh
        // one rather than reusing whatever was current before the switch
        // (relevant mainly if this setting is ever changed mid-session in
        // the future; currently Settings is only reachable pre-login).
        if (previousPracticeQuestionMode !== appSettings.practiceQuestionMode) {
            currentPracticeSeed = null;
        }
    }
    saveAppPreferences();

    closeSettingsModal();

    // Re-apply the (possibly just-changed) auto-show preference to
    // whatever exercise is currently open, so the console panel reacts
    // immediately rather than waiting for the next exercise switch.
    applyAutoShowForCurrentExercise();
    
    // Show toast notification
    const timerLabel = timerEnabled ? `, timer: ${timerValue} min` : ', timer: off';
    const persistenceLabel = persistenceEnabled ? ', local progress: on' : ', local progress: off';
    showNotification(`Settings saved! Mode: ${selectedMode === 'exam' ? 'Exam' : 'Practice'}${timerLabel}${persistenceLabel}`);
}

function showNotification(message) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary);
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        z-index: 2001;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// --- LOCAL SESSION PERSISTENCE (keyed by mode and student email) ---
// Exam and Practice use separate per-student records. Both store every seed
// before serialized answers/progress so the exact activity can be rebuilt
// before its saved state is restored.
function getExamStorageKey(email) {
    return `examSession_${appSettings.practiceQuestionMode}_${email}`;
}

function getPracticeStorageKey(email) {
    return `practiceSession_${appSettings.practiceQuestionMode}_${email}`;
}

function saveSessionProgress() {
    if (!appSettings.persistenceEnabled || !currentUser) return;

    const exercises = {};
    for (const file in exerciseData) {
        const ex = exerciseData[file];
        exercises[file] = {
            locked: !!ex.locked,
            score: ex.score || 0,
            isPartial: !!ex.isPartial,
            userOrder: ex.isLineOrdering ? (ex.userOrder || []) : undefined,
            userAnswer: ex.isConversionQuestion ? (ex.userAnswer || '') : undefined
        };
    }

    const isTimerActive = appSettings.timerEnabled;
    const isTimeUp = isTimerActive && typeof examEndTimestamp === 'number' && Date.now() >= examEndTimestamp;

    const session = {
        schemaVersion: LOCAL_SESSION_SCHEMA_VERSION,
        studentEmail: currentUser,
        mode: appSettings.mode,
        practiceQuestionMode: appSettings.practiceQuestionMode,
        practiceSeed: currentQuestionSeed,
        atom7Seed: currentAtom7Seed,
        atom9Seed: currentAtom9Seed,
        persistenceEnabled: appSettings.persistenceEnabled,
        timerEnabled: appSettings.timerEnabled,
        timerMinutes: isTimerActive ? appSettings.timerMinutes : null,
        examEndTimestamp: isTimerActive ? examEndTimestamp : null,
        completed: checkIfAllAnswered() || isTimeUp,
        exercises,
        savedAt: Date.now()
    };

    try {
        const storageKey = appSettings.mode === 'exam' ? getExamStorageKey(currentUser) : getPracticeStorageKey(currentUser);
        localStorage.setItem(storageKey, JSON.stringify(session));
    } catch (e) {
        console.warn('Could not save local session progress:', e);
    }
}

function saveTimerProgress() {
    if (appSettings.timerEnabled) saveSessionProgress();
}

function loadExamSession(email) {
    if (!appSettings.persistenceEnabled) return null;
    try {
        const raw = localStorage.getItem(getExamStorageKey(email));
        const session = raw ? JSON.parse(raw) : null;
        const matchesStudent = !session?.studentEmail || session.studentEmail === email;
        return session && matchesStudent && session.mode === 'exam' && session.schemaVersion === LOCAL_SESSION_SCHEMA_VERSION ? session : null;
    } catch (e) {
        console.warn('Could not load exam session progress:', e);
        return null;
    }
}

function loadPracticeSession(email) {
    if (!appSettings.persistenceEnabled) return null;
    try {
        const raw = localStorage.getItem(getPracticeStorageKey(email));
        const session = raw ? JSON.parse(raw) : null;
        const matchesStudent = !session?.studentEmail || session.studentEmail === email;
        return session && matchesStudent && session.mode === 'practice' && session.schemaVersion === LOCAL_SESSION_SCHEMA_VERSION ? session : null;
    } catch (e) {
        console.warn('Could not load Practice session progress:', e);
        return null;
    }
}

// Timer Management
// resumeSeconds, when provided, resumes a persisted timed session at the
// real remaining time (e.g. after a page reload) instead of granting a
// fresh full-length timer.
function startTimer(resumeSeconds) {
    if (!appSettings.timerEnabled) {
        return;
    }

    sessionTimedOut = false;
    if (typeof resumeSeconds === 'number' && resumeSeconds >= 0) {
        timeRemaining = resumeSeconds;
        examEndTimestamp = Date.now() + timeRemaining * 1000;
    } else {
        timeRemaining = appSettings.timerMinutes * 60; // Convert to seconds
        examEndTimestamp = Date.now() + timeRemaining * 1000;
    }

    const timerContainer = document.getElementById('timerContainer');
    timerContainer.style.display = 'flex';

    updateTimerDisplay();
    saveTimerProgress(); // persist the deadline right away, before any answers are checked

    let tickCount = 0;
    timerIntervalId = setInterval(() => {
        // Recompute from the fixed deadline each tick (rather than just
        // decrementing) so setInterval drift can't desync the displayed
        // time — or a persisted deadline — from the real cutoff.
        timeRemaining = Math.max(0, Math.round((examEndTimestamp - Date.now()) / 1000));
        updateTimerDisplay();

        // Throttle persistence to avoid writing to storage every second.
        tickCount++;
        if (tickCount % 5 === 0) {
            saveTimerProgress();
        }

        if (timeRemaining <= 0) {
            clearInterval(timerIntervalId);
            handleTimerExpired();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timerDisplay').textContent = display;
    
    const timerDisplay = document.getElementById('timerDisplay');
    timerDisplay.classList.remove('warning', 'critical');
    
    if (timeRemaining <= 60) {
        timerDisplay.classList.add('critical');
    } else if (timeRemaining <= 300) {
        timerDisplay.classList.add('warning');
    }
}

function stopTimer() {
    if (timerIntervalId) {
        clearInterval(timerIntervalId);
        timerIntervalId = null;
    }
    const timerContainer = document.getElementById('timerContainer');
    timerContainer.style.display = 'none';
}

function handleTimerExpired() {
    stopTimer();
    sessionTimedOut = true;
    
    // Lock all exercises
    for (const file in exerciseData) {
        if (!exerciseData[file].locked) {
            exerciseData[file].locked = true;
        }
    }
    setInputsDisabled(true);
    document.getElementById('actionButton').disabled = true;

    // Persist the final, fully-locked state for this student.
    saveTimerProgress();

    // Show score summary modal
    showScoreSummaryModal('Time is up! Your exam session has ended.', 'warning');
}

// --- DRAG AND DROP LINE ORDERING ---
function setupDragAndDrop() {
    const orderingArea = document.getElementById('orderingArea');
    
    if (!orderingArea) return;
    
    // Attach listeners to all draggable lines
    const draggableLines = orderingArea.querySelectorAll('.draggable-line');
    draggableLines.forEach(line => attachDragListeners(line));
    
    // Setup drop zone for the single ordering area
    setupDropZone(orderingArea);
}

function attachDragListeners(element) {
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragend', handleDragEnd);
}

function handleDragStart(e) {
    if (exerciseData[currentFile]?.locked) {
        e.preventDefault();
        return;
    }
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    this.classList.add('dragging');
    draggedElement = this;
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    // Remove any drop placeholder when dragging ends
    document.querySelectorAll('.drop-placeholder').forEach(p => p.remove());
}

function setupDropZone(zone) {
    if (!zone) return;

    // Create a single placeholder element used during drag to indicate insertion point
    const placeholder = document.createElement('div');
    placeholder.className = 'drop-placeholder';

    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        zone.classList.add('drag-over');

        // Determine nearest element to insert before based on mouse Y
        const afterElement = getDragAfterElement(zone, e.clientY);

        if (!afterElement) {
            // Append to end
            if (zone.lastElementChild !== placeholder) zone.appendChild(placeholder);
        } else {
            if (afterElement !== placeholder) zone.insertBefore(placeholder, afterElement);
        }
    });

    zone.addEventListener('dragleave', (e) => {
        // If leaving the zone entirely, remove visual hints
        const related = e.relatedTarget;
        if (!related || !zone.contains(related)) {
            zone.classList.remove('drag-over');
            placeholder.remove();
        }
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');

        if (exerciseData[currentFile]?.locked || !draggedElement) return;

        // Insert dragged element at placeholder position if present
        const ph = zone.querySelector('.drop-placeholder');
        if (ph) {
            zone.insertBefore(draggedElement, ph);
            ph.remove();
        } else {
            zone.appendChild(draggedElement);
        }
    });
}

// Helper: returns the first element that the dragged item should be placed before
function getDragAfterElement(container, y) {
    const draggableLines = [...container.querySelectorAll('.draggable-line:not(.dragging)')];

    return draggableLines.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > (closest.offset || Number.NEGATIVE_INFINITY)) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element || null;
}

function restoreUserOrder(fileName) {
    const ex = exerciseData[fileName];
    if (!ex.isLineOrdering || ex.userOrder.length === 0) return;
    
    const orderingArea = document.getElementById('orderingArea');
    if (!orderingArea) return;
    
    // Reorder lines based on saved userOrder
    ex.userOrder.forEach(origIdx => {
        const draggableEl = orderingArea.querySelector(`[data-original-idx="${origIdx}"]`);
        if (draggableEl) {
            orderingArea.appendChild(draggableEl);
        }
    });
}

let draggedElement = null;

// --- UP/DOWN BUTTONS (touch-friendly alternative to drag-and-drop) ---
function setupUpDownButtons() {
    const orderingArea = document.getElementById('orderingArea');
    if (!orderingArea) return;

    const draggableLines = orderingArea.querySelectorAll('.draggable-line');

    draggableLines.forEach(lineEl => {
        const upBtn = lineEl.querySelector('.move-up-btn');
        const downBtn = lineEl.querySelector('.move-down-btn');
        if (!upBtn || !downBtn) return;

        // Avoid stacking duplicate listeners if this is called more than once
        upBtn.replaceWith(upBtn.cloneNode(true));
        downBtn.replaceWith(downBtn.cloneNode(true));
    });

    // Re-query after cloning, then attach fresh listeners
    orderingArea.querySelectorAll('.move-up-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            moveLineByOffset(btn.closest('.draggable-line'), -1);
        });
    });
    orderingArea.querySelectorAll('.move-down-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            moveLineByOffset(btn.closest('.draggable-line'), 1);
        });
    });

    refreshUpDownButtonStates();
}

function moveLineByOffset(lineEl, offset) {
    if (!lineEl || exerciseData[currentFile]?.locked) return;

    const orderingArea = document.getElementById('orderingArea');
    const allLines = Array.from(orderingArea.querySelectorAll('.draggable-line'));
    const currentIdx = allLines.indexOf(lineEl);
    const targetIdx = currentIdx + offset;

    if (targetIdx < 0 || targetIdx >= allLines.length) return; // out of bounds

    const targetEl = allLines[targetIdx];

    // Capture each affected row's position before the DOM move (FLIP: First)
    const movedFirstRect = lineEl.getBoundingClientRect();
    const targetFirstRect = targetEl.getBoundingClientRect();

    if (offset < 0) {
        orderingArea.insertBefore(lineEl, allLines[targetIdx]);
    } else {
        orderingArea.insertBefore(lineEl, targetEl.nextSibling);
    }

    // Animate both the moved row and the row it displaced sliding into place
    animateRowSwap(lineEl, movedFirstRect);
    animateRowSwap(targetEl, targetFirstRect);

    refreshUpDownButtonStates();
}

// Slides an element from its previous position (firstRect) to wherever it
// now sits in the DOM (Last), using the FLIP technique: Invert the visual
// position with a transform, then Play by transitioning that transform away.
function animateRowSwap(el, firstRect) {
    const lastRect = el.getBoundingClientRect();
    const deltaY = firstRect.top - lastRect.top;

    if (!deltaY) return; // already in place, nothing to animate

    el.style.transition = 'none';
    el.style.transform = `translateY(${deltaY}px)`;
    el.style.zIndex = '5';
    el.classList.add('swapping');

    // Wait a frame so the browser paints the inverted position before we
    // transition it away, otherwise the transform jump itself would animate.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            el.style.transition = 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
            el.style.transform = '';
        });
    });

    const cleanup = () => {
        el.style.transition = '';
        el.style.zIndex = '';
        el.classList.remove('swapping');
        el.removeEventListener('transitionend', cleanup);
    };
    el.addEventListener('transitionend', cleanup);
}

// Disable Up on the first line and Down on the last line.
// forceLocked lets callers (like setInputsDisabled) specify the lock state
// directly, since ex.locked isn't always updated yet at call time.
function refreshUpDownButtonStates(forceLocked) {
    const orderingArea = document.getElementById('orderingArea');
    if (!orderingArea) return;

    const allLines = Array.from(orderingArea.querySelectorAll('.draggable-line'));
    const locked = forceLocked !== undefined ? forceLocked : exerciseData[currentFile]?.locked;

    allLines.forEach((lineEl, idx) => {
        const upBtn = lineEl.querySelector('.move-up-btn');
        const downBtn = lineEl.querySelector('.move-down-btn');
        if (upBtn) upBtn.disabled = locked || idx === 0;
        if (downBtn) downBtn.disabled = locked || idx === allLines.length - 1;
    });
}

// --- JUMP-TO POSITIONING UI ---
function setupJumpToUI(fileName) {
    const orderingArea = document.getElementById('orderingArea');
    if (!orderingArea) return;

    const draggableLines = orderingArea.querySelectorAll('.draggable-line');
    const totalLines = draggableLines.length;

    draggableLines.forEach(draggableEl => {
        // Remove old dropdown if exists
        const oldDropdown = draggableEl.querySelector('.jump-to-container');
        if (oldDropdown) oldDropdown.remove();

        // Create jump-to dropdown container
        const jumpToDiv = document.createElement('div');
        jumpToDiv.className = 'jump-to-container';
        
        // Build options for all available line positions
        let optionsHtml = '<option value="">Jump to →</option>';
        for (let i = 1; i <= totalLines; i++) {
            optionsHtml += `<option value="${i - 1}">Line ${i}</option>`;
        }
        
        jumpToDiv.innerHTML = `<select class="jump-to-select">${optionsHtml}</select>`;
        
        // Add change handler
        jumpToDiv.querySelector('.jump-to-select').addEventListener('change', (e) => {
            if (e.target.value === '') return;
            const targetIdx = parseInt(e.target.value);
            moveLineToPosition(orderingArea, draggableEl, targetIdx);
            e.target.value = ''; // Reset dropdown
        });

        draggableEl.appendChild(jumpToDiv);
    });
}

function moveLineToPosition(container, draggableElement, targetIdx) {
    if (exerciseData[currentFile]?.locked) return;

    const allDraggableLines = Array.from(container.querySelectorAll('.draggable-line'));
    const currentIdx = allDraggableLines.indexOf(draggableElement);

    if (currentIdx === targetIdx) return; // Already at target

    // Remove from current position
    container.removeChild(draggableElement);

    // Insert at target position
    if (targetIdx >= allDraggableLines.length - 1) {
        container.appendChild(draggableElement);
    } else {
        const targetElement = allDraggableLines[targetIdx];
        container.insertBefore(draggableElement, targetElement);
    }

    refreshUpDownButtonStates();
}

// --- ALERT AND SCORE SUMMARY MODALS ---
function showAlertModal(title, message) {
    document.getElementById('alertTitle').textContent = title;
    document.getElementById('alertMessage').textContent = message;
    document.getElementById('alertModal').style.display = 'block';
    document.getElementById('alertOverlay').style.display = 'block';
}

function closeAlertModal() {
    document.getElementById('alertModal').style.display = 'none';
    document.getElementById('alertOverlay').style.display = 'none';
}

// --- SAMPLE OUTPUT CONSOLE PANEL (slides in from the right) ---
function showSampleOutput(fileName) {
    const ex = exerciseData[fileName];
    const panel = document.getElementById('sampleOutputPanel');
    const overlay = document.getElementById('sampleOutputOverlay');
    const content = document.getElementById('sampleOutputContent');
    if (!ex || !panel || !overlay || !content) return;

    content.textContent = ex.sampleOutput && ex.sampleOutput.length ? ex.sampleOutput : 'No sample output available.';

    overlay.style.display = 'block';
    panel.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');
    updateConsoleDrawerTab(true);
    // Force the transform to its initial state before adding .open so the
    // slide-in transition actually plays (rather than snapping into place)
    // even if the panel was just re-shown right after being closed.
    requestAnimationFrame(() => {
        panel.classList.add('open');
    });
}

function closeSampleOutputModal() {
    const panel = document.getElementById('sampleOutputPanel');
    const overlay = document.getElementById('sampleOutputOverlay');
    if (!panel) return;

    const wasOpen = panel.classList.contains('open');
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    updateConsoleDrawerTab(false);

    if (overlay) {
        overlay.setAttribute('aria-hidden', 'true');
        if (wasOpen) {
            // Wait for the slide-out transition to finish before hiding the
            // overlay, otherwise it disappears abruptly mid-animation.
            const onTransitionEnd = () => {
                overlay.style.display = 'none';
                panel.removeEventListener('transitionend', onTransitionEnd);
            };
            panel.addEventListener('transitionend', onTransitionEnd);
        } else {
            // Nothing was actually open, so there's no transition to wait
            // for — hide the overlay immediately instead of leaving a
            // transitionend listener that would never fire.
            overlay.style.display = 'none';
        }
    }
}

// --- CONSOLE DRAWER TAB ---
// A per-activity handle, always available (when the current exercise has
// sample output) for pulling the console into view by hand, independent of
// the global auto-show setting.
function toggleConsolePanel() {
    const panel = document.getElementById('sampleOutputPanel');
    if (!panel || !currentFile) return;
    if (panel.classList.contains('open')) {
        closeSampleOutputModal();
    } else {
        showSampleOutput(currentFile);
    }
}

function updateConsoleDrawerTab(forceOpen) {
    const tab = document.getElementById('consoleDrawerTab');
    const panel = document.getElementById('sampleOutputPanel');
    if (!tab || !panel) return;

    const ex = exerciseData[currentFile];
    const hasSampleOutput = !!(ex && ex.sampleOutput && ex.sampleOutput.trim().length > 0);
    const isOpen = forceOpen !== undefined ? forceOpen : panel.classList.contains('open');

    tab.style.display = (hasSampleOutput && !isOpen) ? 'flex' : 'none';
    tab.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

function getCleanSourceUrl() {
    // Full source URL — host and path — with the query string/hash AND
    // the protocol stripped off. The protocol isn't needed: results.html
    // already strips "https://" before displaying it, and every "/" or
    // ":" left in a URL param gets percent-encoded to 3 characters
    // (e.g. "/" -> "%2F"), which is the single biggest thing bloating
    // the QR's data length. Dropping "https://" alone removes 8 raw
    // characters (and avoids encoding its ":" and "//").
    return window.location.href.split(/[?#]/)[0].replace(/^https?:\/\//i, '');
}

function getActivityName() {
    // The web app's own page title, used as the "activity name" field.
    return document.title;
}

// --- QR PAYLOAD ENCRYPTION ---
// Runs entirely in the browser, so this passphrase is visible to anyone
// who reads this file — it is NOT a security boundary. It only keeps the
// score/email/timestamp out of the *plain* QR payload/URL so a casual
// scan or glance at the address bar doesn't show readable data. This
// passphrase MUST exactly match the one in results.html.
const QR_SHARED_PASSPHRASE = 'AA-9002341ds2sd14-dsfs12sd-54231hg';
const QR_SALT_STRING = 'java-activity-qr-salt-v1';

async function deriveQrKey() {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        enc.encode(QR_SHARED_PASSPHRASE),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );
    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: enc.encode(QR_SALT_STRING),
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

function bufferToBase64Url(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function encryptQrPayload(dataObj) {
    const key = await deriveQrKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const plaintext = enc.encode(JSON.stringify(dataObj));
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);

    // Pack iv + ciphertext into a single token so results.html only needs
    // one query parameter to decrypt.
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), iv.length);

    return bufferToBase64Url(combined);
}

async function buildResultsShareUrl(rawScore, maxScore) {
    // Keep the ENCRYPTED payload as short as possible: short keys only,
    // no domain name inside it (see note below on why the domain travels
    // separately). A shorter encrypted payload lets the QR library pick
    // a lower "version," meaning fewer total modules (squares) — each
    // one rendered bigger and easier for a phone camera to resolve.
    const payload = {
        e: currentUser,
        t: Math.floor(Date.now() / 1000), // unix seconds, shorter than ISO string
        s: rawScore,
        m: maxScore
    };

    const token = await encryptQrPayload(payload);
    const url = new URL('https://mratamayo-tsatinc.github.io/qr/it5b-w4.html');
    url.searchParams.set('d', token);
    url.searchParams.set('a', getCleanSourceUrl());
    url.searchParams.set('n', getActivityName());
    return url.toString();
}

function renderResultsQrCode(shareUrl) {
    // Bigger box for the same module count = each square renders larger
    // and more visible, on top of the data-shrinking above.
    renderQrInto('qrCodeBox', shareUrl, 260);
    renderQrInto('sidebarQrCodeBox', shareUrl, 170);
}

function renderQrInto(boxId, shareUrl, size) {
    const box = document.getElementById(boxId);
    if (!box || typeof QRCode === 'undefined') return;
    box.innerHTML = ''; // clear any previously rendered code first
    new QRCode(box, {
        text: shareUrl,
        width: size,
        height: size,
        colorDark: '#1a1a1a',
        colorLight: '#ffffff',
        // L = lowest error correction (~7% recoverable). Combined with a
        // short payload, this keeps the QR at a low "version" — fewer
        // total modules (squares), each rendered bigger at the same box
        // size, which is what actually makes a phone camera able to
        // resolve it. (More error correction sounds safer but backfires:
        // it adds redundancy bytes, which forces MORE modules for the
        // same data, making each one smaller.)
        correctLevel: QRCode.CorrectLevel.L
    });
}

function calculateTotalScore() {
    let totalGot = 0;
    let totalPossible = 0;
    for (const file in exerciseData) {
        const ex = exerciseData[file];
        totalGot += Number(ex.score || 0);
        totalPossible += ex.answers.length;
    }
    return { got: totalGot, possible: totalPossible };
}

async function showScoreSummaryModal(completionMessage, messageType = 'success') {
    const { got, possible } = calculateTotalScore();
    
    document.getElementById('finalScore').textContent = got;
    document.getElementById('maxScore').textContent = possible;
    document.getElementById('summaryEmail').textContent = currentUser;
    
    const messageElement = document.getElementById('completionMessage');
    messageElement.textContent = completionMessage;
    messageElement.className = `completion-message ${messageType}`;

    const shareUrl = await buildResultsShareUrl(got, possible);
    renderResultsQrCode(shareUrl);
    
    document.getElementById('scoreSummaryModal').style.display = 'block';
    document.getElementById('scoreSummaryOverlay').style.display = 'block';
}

function closeSummaryModal() {
    document.getElementById('scoreSummaryModal').style.display = 'none';
    document.getElementById('scoreSummaryOverlay').style.display = 'none';
}

// Check if all exercises have been answered
function checkIfAllAnswered() {
    for (const file in exerciseData) {
        const ex = exerciseData[file];
        if (!ex.locked || ex.score === 0) {
            return false;
        }
    }
    return true;
}

/* ============================================================
   SUBNET VISUALIZER ENGINE — ported from Subnetify (app.js)
   Wrapped in an IIFE and exposed as window.SubnetVisualizer so its
   internal names (state, el, render, WEIGHTS, ...) never touch the
   global scope this file's own quiz-engine code runs in.
   ============================================================ */
const SubnetVisualizer = (function () {
'use strict';

let _initialized = false;

/* ============================================================
   SUBNETIFY — deterministic CIDR / subnetting engine
   No external IP math libraries. All arithmetic uses explicit
   spatial bit weights: 128, 64, 32, 16, 8, 4, 2, 1
   ============================================================ */

const WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1];

/* Renders the 128/64/32/16/8/4/2/1 header row for a single octet's worth of
   bits (8 values). Each weight number is "lit" when its corresponding bit
   is 1, and "muted" when the bit is 0 — reinforcing how the active weights
   sum to the decimal value. variantClass controls sizing (see CSS).
   kindsSlice (optional) is an array of 8 strings — 'locked' | 'borrowed' |
   'host' — so a lit weight picks up the SAME semantic color as its bit
   (blue / amber / green) instead of a single flat "active" color. This
   keeps host-side weights in Panel 5 visually distinct from subnet-side
   weights in Panel 4, matching the bit coloring itself. */
function buildWeightRowHtml(bitsSlice, variantClass, kindsSlice, weightsArr) {
  const weights = weightsArr || WEIGHTS;
  const n = bitsSlice.length;
  let html = '<div class="weight-row ' + variantClass + '">';
  for (let k = 0; k < n; k++) {
    const lit = bitsSlice[k] === 1;
    let cls = 'weight-num';
    if (lit) {
      const kind = kindsSlice ? kindsSlice[k] : null;
      cls += ' weight-lit' + (kind ? ' weight-lit-' + kind : '');
    } else {
      cls += ' weight-muted';
    }
    html += '<span class="' + cls + '">' + weights[k] + '</span>';
  }
  html += '</div>';
  return html;
}

/* Renders the decimal total that the octet's active weights sum to (the
   same value bitsToOctet would compute). Sits above the weight row so the
   summation reads top-down: "here's the answer" -> "here's the math" ->
   "here's the binary". Deliberately styled with NO locked/borrowed/host
   coloring — in decimal form (e.g. 192.168.1.0) there is no visual cue for
   which bits were network vs. host, and the total should reflect that same
   truth rather than borrowing the bit-level color language. appendDot, when
   true, suffixes a "." so that reading only the total badges left-to-right
   across an octet's siblings reconstructs the ordinary dotted-decimal IP
   notation that the rest of the visualization deliberately breaks apart. */
function buildOctetTotalHtml(bitsSlice, variantClass, appendDot) {
  const total = bitsToOctet(bitsSlice);
  const dot = appendDot ? '<span class="octet-total-dot">.</span>' : '';
  return '<div class="octet-total ' + variantClass + '">' + total + dot + '</div>';
}

/* ---------------- Global State (single source of truth) ---------------- */
const state = {
  octets: [192, 168, 1, 0],
  borrowedBits: 0,
  activeSubnetIndex: 0,
  subnetsExpanded: false,
  hostsExpanded: false,
  presenterMode: false,
  subnetFormulaVisible: false,
  hostFormulaVisible: false,
  compareExpanded: false,
  // 'viz' = bit-level octet visualization, 'decimal' = plain dotted-decimal.
  // Each panel key is either 'global' (defer to viewMode.global) or an
  // explicit override of its own.
  viewMode: {
    global: 'viz',
    panel2: 'global',
    panel3: 'global',
    panel4: 'global',
    panel5: 'global',
  },
};

/* Resolves a panel's effective display mode, following 'global' through to
   the global default when the panel hasn't been explicitly overridden. */
function effectiveMode(panelKey) {
  const v = state.viewMode[panelKey];
  return v === 'global' ? state.viewMode.global : v;
}

/* ---------------- Bit-level helpers ---------------- */
function toBinary8(n) {
  const v = Math.max(0, Math.min(255, Number(n) || 0));
  return v.toString(2).padStart(8, '0').split('').map(Number);
}

function bitsToOctet(bitsArr) {
  if (!bitsArr.length) return 0;
  return parseInt(bitsArr.join(''), 2);
}

function octetsToBits(octets) {
  return octets.flatMap(toBinary8);
}

function bitsToOctets(bits) {
  const out = [];
  for (let i = 0; i < 4; i++) {
    out.push(bitsToOctet(bits.slice(i * 8, i * 8 + 8)));
  }
  return out;
}

function bitsArrayToInt(bitsArr) {
  let n = 0;
  for (let i = 0; i < bitsArr.length; i++) n = n * 2 + bitsArr[i];
  return n;
}

function intToBitsArray(n, len) {
  return n.toString(2).padStart(len, '0').split('').map(Number);
}

/* Given a fixed-length prefix (the bits that are locked for a given
   network/subnet — classful network bits alone, or network+borrowed bits
   for a specific subnet), derives every address-level fact about that
   block: network address, broadcast address, mask, host counts, and the
   usable range. Used by Panel 6 to compare a classful network against a
   classless subnet using the exact same math, just with a different
   prefix length/value. */
function summarizeAddressBlock(prefixBitsArr) {
  const prefixLen = prefixBitsArr.length;
  const hostBitsCount = 32 - prefixLen;
  const totalHosts = Math.pow(2, hostBitsCount);
  const usableHosts = Math.max(0, totalHosts - 2);

  const networkBitsFull = prefixBitsArr.concat(new Array(hostBitsCount).fill(0));
  const broadcastBitsFull = prefixBitsArr.concat(new Array(hostBitsCount).fill(1));
  const networkInt = bitsArrayToInt(networkBitsFull);
  const broadcastInt = bitsArrayToInt(broadcastBitsFull);
  const maskBits = new Array(prefixLen).fill(1).concat(new Array(hostBitsCount).fill(0));

  let firstUsableOctets = null;
  let lastUsableOctets = null;
  if (usableHosts > 0) {
    firstUsableOctets = bitsToOctets(intToBitsArray(networkInt + 1, 32));
    lastUsableOctets = bitsToOctets(intToBitsArray(broadcastInt - 1, 32));
  }

  return {
    prefixLen,
    totalHosts,
    usableHosts,
    networkOctets: bitsToOctets(networkBitsFull),
    broadcastOctets: bitsToOctets(broadcastBitsFull),
    maskOctets: bitsToOctets(maskBits),
    firstUsableOctets,
    lastUsableOctets,
  };
}

/* ---------------- Class detection ---------------- */
function detectClass(o1) {
  if (o1 >= 1 && o1 <= 126) {
    return { label: 'A', networkBits: 8, warning: null };
  }
  if (o1 === 127) {
    return {
      label: 'Loopback',
      networkBits: 8,
      warning: 'Loopback range (127.0.0.0/8): reserved for a host to talk to itself. Not used for subnetting exercises — bit-borrowing is disabled.',
    };
  }
  if (o1 >= 128 && o1 <= 191) {
    return { label: 'B', networkBits: 16, warning: null };
  }
  if (o1 >= 192 && o1 <= 223) {
    return { label: 'C', networkBits: 24, warning: null };
  }
  if (o1 >= 224 && o1 <= 239) {
    return {
      label: 'D (Multicast)',
      networkBits: 32,
      warning: 'Multicast range (224.0.0.0 – 239.255.255.255): addresses identify a group of receivers, not a single host. There is no host/network split to subnet — bit-borrowing is disabled.',
    };
  }
  return {
    label: 'E (Experimental)',
    networkBits: 32,
    warning: 'Experimental / reserved range (240.0.0.0+): reserved for future use and not routable. Bit-borrowing is disabled.',
  };
}

/* ---------------- Derived state ---------------- */
function computeDerived() {
  const classInfo = detectClass(state.octets[0]);
  const networkBits = classInfo.networkBits;
  const maxBorrow = classInfo.warning ? 0 : Math.max(0, 30 - networkBits);
  const borrowedBits = classInfo.warning ? 0 : Math.min(state.borrowedBits, maxBorrow);
  const hostBits = 32 - networkBits - borrowedBits;
  const inputBits = octetsToBits(state.octets);
  const totalSubnets = Math.pow(2, borrowedBits);
  const totalHosts = Math.pow(2, hostBits);

  return { classInfo, networkBits, maxBorrow, borrowedBits, hostBits, inputBits, totalSubnets, totalHosts };
}

/* ---------------- DOM references ---------------- */
const el = {
  octetInputs: [0, 1, 2, 3].map((i) => document.getElementById('octet' + i)),
  octetFields: [0, 1, 2, 3].map((i) => document.getElementById('octetField' + i)),
  octetLockIcons: [0, 1, 2, 3].map((i) => document.getElementById('octetLock' + i)),
  classBadge: document.getElementById('classBadge'),
  cidrBadge: document.getElementById('cidrBadge'),
  borrowBadge: document.getElementById('borrowBadge'),
  warningBanner: document.getElementById('warningBanner'),
  bitGrid: document.getElementById('bitGrid'),
  bitGridLegend: document.getElementById('bitGridLegend'),
  panel2Hint: document.getElementById('panel2Hint'),
  classfulMaskBinary: document.getElementById('classfulMaskBinary'),
  classfulMaskDecimal: document.getElementById('classfulMaskDecimal'),
  classlessMaskBinary: document.getElementById('classlessMaskBinary'),
  classlessMaskDecimal: document.getElementById('classlessMaskDecimal'),
  maskDotDecimal: document.getElementById('maskDotDecimal'),
  maskCidr: document.getElementById('maskCidr'),
  subnetCountMeta: document.getElementById('subnetCountMeta'),
  subnetFormulaToggle: document.getElementById('subnetFormulaToggle'),
  subnetFormulaBox: document.getElementById('subnetFormulaBox'),
  subnetTableBody: document.getElementById('subnetTableBody'),
  activeSubnetMeta: document.getElementById('activeSubnetMeta'),
  hostFormulaToggle: document.getElementById('hostFormulaToggle'),
  hostFormulaBox: document.getElementById('hostFormulaBox'),
  hostTableBody: document.getElementById('hostTableBody'),
  presenterToggle: document.getElementById('presenterToggle'),
  resetBorrowBtn: document.getElementById('resetBorrowBtn'),
  globalViewModeSegmented: document.getElementById('globalViewModeSegmented'),
  panel2ViewSelect: document.getElementById('panel2ViewMode'),
  panel3ViewSelect: document.getElementById('panel3ViewMode'),
  panel4ViewSelect: document.getElementById('panel4ViewMode'),
  panel5ViewSelect: document.getElementById('panel5ViewMode'),
  classfulCompareStats: document.getElementById('classfulCompareStats'),
  classfulCompareCards: document.getElementById('classfulCompareCards'),
  classlessCompareStats: document.getElementById('classlessCompareStats'),
  classlessCompareCards: document.getElementById('classlessCompareCards'),
};

/* ---------------- Octet edit-lock guard (Panel 1) ---------------- */
/* Only the octets that make up the CLASSFUL network portion are editable —
   Class A: octet 1 only. Class B: octets 1-2. Class C: octets 1-3.
   Everything after that is the host portion of the base network address
   and must stay 0 (that's what "classful base network" means — 10.0.0.0,
   172.16.0.0, 192.168.1.0). Only Octet 1 ever drives class detection, so
   this is safe to compute before the rest of computeDerived() runs, and
   must run BEFORE it — it mutates state.octets so every downstream panel
   (bit grid, masks, subnet/host tables) sees the already-zeroed values
   rather than stale digits left over from a previous class. */
function syncOctetLocking() {
  const classInfo = detectClass(state.octets[0]);
  const editableCount = classInfo.networkBits / 8;
  for (let i = editableCount; i < 4; i++) {
    state.octets[i] = 0;
  }
  return editableCount;
}

/* Reflects the lock state onto the actual <input> elements: disables the
   host-portion octets (so they can't be typed into at all, not just
   validated after the fact), keeps their displayed value pinned to 0, and
   surfaces a lock icon next to the label. Skips overwriting an input the
   teacher currently has focused, so mid-typing on an editable octet is
   never clobbered by its own re-render. */
function updateOctetInputsUI(editableCount) {
  el.octetInputs.forEach((inp, i) => {
    const isEditable = i < editableCount;
    inp.disabled = !isEditable;
    if (el.octetFields[i]) el.octetFields[i].classList.toggle('octet-locked', !isEditable);
    if (el.octetLockIcons[i]) el.octetLockIcons[i].classList.toggle('hidden', isEditable);
    if (!isEditable) {
      inp.value = '0';
    } else if (document.activeElement !== inp) {
      inp.value = String(state.octets[i]);
    }
  });
}

/* ---------------- Renderers ---------------- */

function renderPanel1(d) {
  el.classBadge.textContent = d.classInfo.label;
  el.classBadge.classList.toggle('class-value-long', d.classInfo.label.length > 2);
  el.cidrBadge.textContent = '/' + d.networkBits;
  el.borrowBadge.textContent = d.borrowedBits + ' bit' + (d.borrowedBits === 1 ? '' : 's') + ' borrowed';

  const cantReset = Boolean(d.classInfo.warning) || d.borrowedBits === 0;
  el.resetBorrowBtn.disabled = cantReset;
  el.resetBorrowBtn.title = d.classInfo.warning
    ? 'Bit-borrowing is disabled for this address range'
    : d.borrowedBits === 0
      ? 'Already classful (0 bits borrowed)'
      : 'Reset to classful (0 bits borrowed)';

  if (d.classInfo.warning) {
    el.warningBanner.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> ' + d.classInfo.warning;
    el.warningBanner.classList.remove('hidden');
  } else {
    el.warningBanner.classList.add('hidden');
  }
}

function renderPanel2(d) {
  const decimalMode = effectiveMode('panel2') === 'decimal';
  el.bitGridLegend.classList.toggle('hidden', decimalMode);
  el.panel2Hint.classList.toggle('hidden', decimalMode);

  const totalPrefix = d.networkBits + d.borrowedBits;

  if (decimalMode) {
    let html = '<div class="decimal-ip-row">';
    for (let g = 0; g < 4; g++) {
      const bitsSlice = d.inputBits.slice(g * 8, g * 8 + 8);
      html += buildOctetTotalHtml(bitsSlice, 'octet-total-main', g < 3);
    }
    html += '<span class="decimal-cidr-suffix">/' + totalPrefix + '</span>';
    html += '</div>';
    el.bitGrid.innerHTML = html;
    return;
  }

  el.bitGrid.innerHTML = '';
  const totalBorrowEnd = d.networkBits + d.borrowedBits;

  for (let g = 0; g < 4; g++) {
    const octetBlock = document.createElement('div');
    octetBlock.className = 'octet-block';

    const bitsSlice = d.inputBits.slice(g * 8, g * 8 + 8);
    const kindsSlice = bitsSlice.map((_, k) => {
      const globalIndex = g * 8 + k;
      if (globalIndex < d.networkBits) return 'locked';
      if (globalIndex < totalBorrowEnd) return 'borrowed';
      return 'host';
    });

    // The last octet (Octet 4) has no trailing dot, since it's the end
    // of the address — this is exactly where the CIDR suffix belongs too,
    // read the same way it is in Decimal Only: "...0/27" at the very end
    // of the address, not a separate label elsewhere on the panel.
    const totalHtml = g === 3
      ? '<div class="octet-total-cidr-wrap">' +
          buildOctetTotalHtml(bitsSlice, 'octet-total-main', false) +
          '<span class="decimal-cidr-suffix cidr-suffix-viz">/' + totalPrefix + '</span>' +
        '</div>'
      : buildOctetTotalHtml(bitsSlice, 'octet-total-main', g < 3);

    octetBlock.innerHTML =
      totalHtml +
      buildWeightRowHtml(bitsSlice, 'weight-row-main', kindsSlice);

    const group = document.createElement('div');
    group.className = 'bit-octet-group';

    for (let b = 0; b < 8; b++) {
      const globalIndex = g * 8 + b;
      const cell = document.createElement('div');
      cell.dataset.index = String(globalIndex);
      const bitVal = d.inputBits[globalIndex];

      if (globalIndex < d.networkBits) {
        cell.className = 'bit-cell locked';
        cell.innerHTML = '<span class="lock-icon"><i class="fa-solid fa-lock"></i></span><span class="bit-value">' + bitVal + '</span>';
      } else if (globalIndex < totalBorrowEnd) {
        cell.className = 'bit-cell borrowed';
        cell.innerHTML = '<span class="bit-value">' + bitVal + '</span>';
        cell.title = 'Click to set subnet boundary here';
      } else {
        cell.className = 'bit-cell host';
        cell.innerHTML = '<span class="bit-value">' + bitVal + '</span>';
        cell.title = 'Click to set subnet boundary here';
      }

      cell.addEventListener('click', () => onBitClick(globalIndex));
      group.appendChild(cell);
    }

    octetBlock.appendChild(group);

    const label = document.createElement('div');
    label.className = 'octet-viz-label';
    label.textContent = 'Octet ' + (g + 1);
    octetBlock.appendChild(label);

    el.bitGrid.appendChild(octetBlock);

    if (g < 3) {
      const sep = document.createElement('div');
      sep.className = 'octet-dot-separator';
      sep.textContent = '.';
      el.bitGrid.appendChild(sep);
    }
  }
}

function renderPanel3(d) {
  const classfulBits = new Array(32).fill(0).map((_, i) => (i < d.networkBits ? 1 : 0));
  const classlessBits = new Array(32).fill(0).map((_, i) => (i < d.networkBits + d.borrowedBits ? 1 : 0));

  const renderMaskBinary = (bits, container, borrowedStart, borrowedEnd) => {
    container.innerHTML = '';
    for (let g = 0; g < 4; g++) {
      const block = document.createElement('div');
      block.className = 'mask-octet-block';

      const bitsSlice = bits.slice(g * 8, g * 8 + 8);
      const kindsSlice = bitsSlice.map((_, k) => {
        const i = g * 8 + k;
        return (i >= borrowedStart && i < borrowedEnd) ? 'borrowed' : 'locked';
      });
      block.innerHTML =
        buildOctetTotalHtml(bitsSlice, 'octet-total-mask', g < 3) +
        buildWeightRowHtml(bitsSlice, 'weight-row-mask', kindsSlice);

      const bitRow = document.createElement('div');
      bitRow.className = 'mask-bit-row';
      for (let k = 0; k < 8; k++) {
        const i = g * 8 + k;
        const span = document.createElement('span');
        const isBorrowed = i >= borrowedStart && i < borrowedEnd;
        span.className = 'mask-bit bit-' + bits[i] + ' ' + (bits[i] === 1 ? (isBorrowed ? 'borrowed-bit' : 'locked-bit') : '');
        span.textContent = bits[i];
        bitRow.appendChild(span);
      }
      block.appendChild(bitRow);

      const label = document.createElement('div');
      label.className = 'octet-viz-label';
      label.textContent = 'Octet ' + (g + 1);
      block.appendChild(label);

      container.appendChild(block);

      if (g < 3) {
        const sep = document.createElement('div');
        sep.className = 'mask-dot-separator';
        sep.textContent = '.';
        container.appendChild(sep);
      }
    }
  };

  const decimalMode = effectiveMode('panel3') === 'decimal';
  el.classfulMaskBinary.classList.toggle('hidden', decimalMode);
  el.classlessMaskBinary.classList.toggle('hidden', decimalMode);

  if (!decimalMode) {
    renderMaskBinary(classfulBits, el.classfulMaskBinary, d.networkBits, d.networkBits);
    renderMaskBinary(classlessBits, el.classlessMaskBinary, d.networkBits, d.networkBits + d.borrowedBits);
  }

  const classfulOctets = bitsToOctets(classfulBits.concat());
  const classlessOctets = bitsToOctets(classlessBits.concat());
  el.classfulMaskDecimal.textContent = classfulOctets.join('.') + '  (/' + d.networkBits + ')';
  el.classlessMaskDecimal.textContent = classlessOctets.join('.') + '  (/' + (d.networkBits + d.borrowedBits) + ')';

  el.maskDotDecimal.textContent = classlessOctets.join('.');
  el.maskCidr.textContent = '/' + (d.networkBits + d.borrowedBits);
}

/* Renders the borrowed-bits pattern (Panel 4) using the same top-to-bottom
   octet visualization language: total -> weight row -> bits -> label. The
   key difference from a real octet is that the weight row is NOT always
   128-1 — it's scaled to however many bits were borrowed. 3 borrowed bits
   means the pattern can only ever represent 0-7, so the place values are
   4-2-1, not 128-64-32. All bits here are inherently "borrowed" bits, so
   lit weights consistently use the borrowed (amber) color — there's no
   locked/host ambiguity to represent, unlike a full octet. */
function buildBorrowedPatternViz(borrowedPattern) {
  const n = borrowedPattern.length;
  const weights = [];
  for (let k = 0; k < n; k++) weights.push(Math.pow(2, n - 1 - k));
  const kindsSlice = borrowedPattern.map(() => 'borrowed');

  let cellsHtml = '';
  for (let k = 0; k < n; k++) {
    cellsHtml += '<span class="u-bit borrowed-bit">' + borrowedPattern[k] + '</span>';
  }

  // Explicit width (bits * 20px u-bit + 2px border) is required here: with
  // container-type:inline-size set on .octet-bits-group (below, via CSS),
  // container-SIZE containment strips the element's ability to size itself
  // from its own inline-flex content, so an auto/shrink-to-fit width
  // collapses toward 0. That both starves the 30cqi font calc (font stays
  // pinned to its minimum forever) AND makes adjacent .octet-bits-group
  // siblings overlap in normal flow, since the box reports ~0 width while
  // still painting its full content. A definite pixel width sidesteps
  // containment entirely and gives cqi a real basis to scale against.
  const groupWidthPx = n * 20 + 2;

  return '<div class="octet-bits-group" style="width:' + groupWidthPx + 'px">' +
    buildOctetTotalHtml(borrowedPattern, 'octet-total-compact') +
    (n > 0 ? buildWeightRowHtml(borrowedPattern, 'weight-row-compact', kindsSlice, weights) : '') +
    '<span class="unified-octet-cell">' + cellsHtml + '</span>' +
    '<span class="octet-viz-label">Subnet</span>' +
    '</div>';
}

/* Panel 4 formula box: how the borrowed bits determine the subnet count.
   2^n, where n is the number of borrowed bits. */
function buildSubnetFormulaHtml(d) {
  const n = d.borrowedBits;
  return (
    '<span class="formula-line">' +
      '<span class="formula-term">Total Subnets</span> = 2<sup>borrowed bits</sup> = 2<sup>' + n + '</sup> = ' +
      '<span class="formula-highlight-subnet">' + d.totalSubnets + '</span>' +
    '</span>' +
    '<span class="formula-note">Each borrowed bit doubles the number of possible subnets. With ' +
      n + ' bit' + (n === 1 ? '' : 's') + ' borrowed, the classful network splits into 2<sup>' + n + '</sup> = ' +
      d.totalSubnets + ' equal-sized subnet' + (d.totalSubnets === 1 ? '' : 's') + '.</span>'
  );
}

/* Panel 5 formula box: how the remaining host bits determine both the total
   address count (2^h) and the usable host count (2^h - 2, reserving the
   all-zeros Network ID and all-ones Broadcast Address). */
function buildHostFormulaHtml(d) {
  const h = d.hostBits;
  const usable = Math.max(0, d.totalHosts - 2);
  return (
    '<span class="formula-line">' +
      '<span class="formula-term">Total Addresses</span> = 2<sup>host bits</sup> = 2<sup>' + h + '</sup> = ' +
      '<span class="formula-highlight-host">' + d.totalHosts + '</span>' +
    '</span>' +
    '<span class="formula-line">' +
      '<span class="formula-term">Usable Hosts</span> = 2<sup>host bits</sup> &minus; 2 = ' + d.totalHosts + ' &minus; 2 = ' +
      '<span class="formula-highlight-host">' + usable + '</span>' +
    '</span>' +
    '<span class="formula-note">The two reserved addresses are the all-zeros Network ID and the all-ones Broadcast Address — every other host-bit pattern is assignable to a device.</span>'
  );
}

function buildSubnetRows(d) {
  const rows = [];
  const netPrefixBits = d.inputBits.slice(0, d.networkBits);
  for (let n = 0; n < d.totalSubnets; n++) {
    const borrowedPattern = n.toString(2).padStart(d.borrowedBits, '0').split('').map(Number);
    const fullBits = netPrefixBits.concat(borrowedPattern).concat(new Array(d.hostBits).fill(0));
    const octets = bitsToOctets(fullBits);
    rows.push({ index: n, binaryIndex: borrowedPattern.join(''), borrowedBitsArr: borrowedPattern, octets, fullBits });
  }
  return rows;
}

function renderPanel4(d) {
  const rows = buildSubnetRows(d);
  el.subnetCountMeta.innerHTML =
    '<i class="fa-solid fa-list-ol"></i> <strong>' + d.totalSubnets + '</strong> total subnet' + (d.totalSubnets === 1 ? '' : 's') +
    '<span class="meta-caret"> — sets the ' + d.totalSubnets + ' row' + (d.totalSubnets === 1 ? '' : 's') + ' below</span>';
  el.subnetCountMeta.title = 'Every borrowed-bit permutation becomes one row in the table below.';

  el.subnetFormulaBox.innerHTML = buildSubnetFormulaHtml(d);
  el.subnetFormulaBox.classList.toggle('hidden', !state.subnetFormulaVisible);
  el.subnetFormulaToggle.classList.toggle('active', state.subnetFormulaVisible);
  el.subnetFormulaToggle.setAttribute('aria-expanded', String(state.subnetFormulaVisible));
  el.subnetFormulaToggle.innerHTML = state.subnetFormulaVisible
    ? '<i class="fa-solid fa-square-root-variable"></i> Hide Formula'
    : '<i class="fa-solid fa-square-root-variable"></i> Show Formula';

  // clamp active index if borrowed bits changed
  if (state.activeSubnetIndex >= d.totalSubnets) state.activeSubnetIndex = 0;

  el.subnetTableBody.innerHTML = '';

  const decimalMode = effectiveMode('panel4') === 'decimal';

  const renderRow = (row) => {
    const tr = document.createElement('tr');
    const isActive = row.index === state.activeSubnetIndex;
        tr.innerHTML = buildPanel4SubnetRow(row, d, decimalMode, isActive).replace(/^<tr[^>]*>|<\/tr>$/g, '');
        const subnetRow = tr.querySelector('.panel4-selectable');
        const selectRow = () => {
      state.activeSubnetIndex = row.index;
      render();
            requestAnimationFrame(() => {
                const panel5 = document.getElementById('panel5');
                if (panel5) panel5.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        };
        subnetRow.addEventListener('click', selectRow);
        subnetRow.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            selectRow();
        });
    el.subnetTableBody.appendChild(tr);
  };

  if (d.totalSubnets <= 8) {
    rows.forEach(renderRow);
  } else if (!state.subnetsExpanded) {
    rows.slice(0, 5).forEach(renderRow);
    const hiddenCount = d.totalSubnets - 8;
    const trExp = document.createElement('tr');
    trExp.className = 'expansion-row';
    trExp.innerHTML =
      '<td class="expansion-index" title="' + hiddenCount + ' hidden rows"><i class="fa-solid fa-ellipsis-vertical" aria-hidden="true"></i></td>' +
      '<td colspan="3"><button class="expansion-btn" id="subnetExpandBtn"><i class="fa-solid fa-eye"></i> Show ' + hiddenCount + ' Hidden Subnets</button></td>';
    el.subnetTableBody.appendChild(trExp);
    document.getElementById('subnetExpandBtn').addEventListener('click', () => {
      state.subnetsExpanded = true;
      render();
    });
    rows.slice(-3).forEach(renderRow);
  } else {
    rows.forEach(renderRow);
    const trCollapse = document.createElement('tr');
    trCollapse.className = 'expansion-row';
    trCollapse.innerHTML = '<td colspan="4"><button class="expansion-btn" id="subnetCollapseBtn"><i class="fa-solid fa-chevron-up"></i> Collapse</button></td>';
    el.subnetTableBody.appendChild(trCollapse);
    document.getElementById('subnetCollapseBtn').addEventListener('click', () => {
      state.subnetsExpanded = false;
      render();
    });
  }

  return rows;
}

function roleForHostIndex(h, total) {
  if (h === 0) return { label: '<i class="fa-solid fa-ban"></i> Network ID', cls: 'role-network' };
  if (h === 1) return { label: '<i class="fa-solid fa-circle-check"></i> First Usable Host', cls: 'role-first' };
  if (h === total - 2) return { label: '<i class="fa-solid fa-circle-check"></i> Last Usable Host', cls: 'role-last' };
  if (h === total - 1) return { label: '<i class="fa-solid fa-bullhorn"></i> Broadcast Address', cls: 'role-broadcast' };
  return { label: 'Usable Host', cls: 'role-usable' };
}

function buildSingleOctetBits(fullBits, d, octetIndex) {
  const octetStart = octetIndex * 8;
  const bitsSlice = fullBits.slice(octetStart, octetStart + 8);
  const kindsSlice = [];
  let cellsHtml = '';
  for (let k = 0; k < 8; k++) {
    const globalIndex = octetStart + k;
    let kind = 'host';
    if (globalIndex < d.networkBits) kind = 'locked';
    else if (globalIndex < d.networkBits + d.borrowedBits) kind = 'borrowed';
    kindsSlice.push(kind);
    const isCurtainBit = globalIndex === d.networkBits + d.borrowedBits - 1 && d.borrowedBits > 0 && globalIndex < octetStart + 7;
    cellsHtml += '<span class="u-bit ' + kind + '-bit' + (isCurtainBit ? ' curtain-before' : '') + '">' + fullBits[globalIndex] + '</span>';
  }
    const groupWidthPx = 8 * 20 + 2;
    return '<div class="octet-bits-group" style="width:' + groupWidthPx + 'px">' +
        buildOctetTotalHtml(bitsSlice, 'octet-total-compact', octetIndex < 3) +
        buildWeightRowHtml(bitsSlice, 'weight-row-compact', kindsSlice) +
        '<span class="unified-octet-cell">' + cellsHtml + '</span>' +
        '<span class="octet-viz-label">Octet ' + (octetIndex + 1) + '</span>' +
        '</div>';
}

function buildPanel4AddressViz(fullBits, d) {
    const borrowEnd = d.networkBits + d.borrowedBits;
    let out = '<div class="addr-row">';
    for (let o = 0; o < 4; o++) {
        out += atom3BuildSingleOctetBits(fullBits, d.networkBits, borrowEnd, o);
    }
    return out + '</div>';
}

function buildPanel4SubnetIndex(row, decimalMode) {
    const indexValue = decimalMode ? row.index : parseInt(row.binaryIndex || '0', 2);
    const indexDisplay = decimalMode
        ? '<div class="idx-pill-row"><span class="idx-pill-label">Subnet Index <span class="idx-hint">&middot; read-only</span></span><span class="idx-pill-badge">' + indexValue + '</span></div>' +
            '<div class="panel4-index-decimal">' + row.index + '</div>'
        : '<div class="panel4-index-bits" aria-label="Binary subnet index ' + row.binaryIndex + '">' + buildSubnetIndexInner(row.borrowedBitsArr, {
                interactive: false,
                bitClass: 'panel4-index-bit',
                hint: '&middot; read-only',
                footerHtml: '<div class="idx-viz-label">Derived from borrowed bits</div>'
            }) + '</div>';

    return '<div class="idx-block panel4-index-block">' +
        indexDisplay +
        (decimalMode ? '<div class="idx-viz-label">Derived from borrowed bits</div>' : '') +
    '</div>';
}

function buildPanel4SubnetRow(row, d, decimalMode, isActive) {
    const address = decimalMode
        ? '<div class="panel4-address-decimal">' + row.octets.join('.') + '</div>'
        : buildPanel4AddressViz(row.fullBits, d);

    return '<tr class="panel4-subnet-table-row' + (isActive ? ' active-row' : '') + '">' +
        '<td colspan="4"><div class="subnet-row panel4-subnet-row panel4-selectable' + (isActive ? ' panel4-selected' : '') + '" role="button" tabindex="0" aria-current="' + (isActive ? 'true' : 'false') + '" aria-label="' + (isActive ? 'Active subnet ' : 'Select subnet ') + row.index + '">' +
            buildPanel4SubnetIndex(row, decimalMode) +
            '<div class="atom3-row-network panel4-address-block"><div class="panel4-address-heading">Subnet ' + row.index + ' address</div>' + address + '</div>' +
        '</div></td></tr>';
}
// Renders bit-level detail for all 4 octets, including any that are
// 100% locked network bits. Showing the locked octets too (not just the
// ones touched by borrowed/host bits) keeps the full 32-bit picture
// consistent with Panel 2/3 above, and makes it visually obvious *why*
// e.g. a Class A address only has 3 octets left to subnet/host: the first
// octet is right there, fully blue, instead of silently missing.
function buildOctetBitsDisplay(fullBits, d) {
  let out = '<div class="octet-bits-row">';
  for (let o = 0; o < 4; o++) {
    out += buildSingleOctetBits(fullBits, d, o);
  }
  out += '</div>';
  return out;
}

function renderPanel5(d, subnetRows) {
  const activeSubnet = subnetRows[state.activeSubnetIndex] || subnetRows[0];
  el.activeSubnetMeta.innerHTML =
    '<i class="fa-solid fa-crosshairs"></i> Inspecting <strong>Subnet ' + (activeSubnet ? activeSubnet.index : 0) + '</strong>' +
    ' (' + (activeSubnet ? activeSubnet.octets.join('.') : '') + ')' +
    '<span class="meta-caret"> — generates the ' + d.totalHosts + ' addresses below</span>';
  el.activeSubnetMeta.title = 'This is the subnet selected in the table above; every row below is an address within it.';

  el.hostFormulaBox.innerHTML = buildHostFormulaHtml(d);
  el.hostFormulaBox.classList.toggle('hidden', !state.hostFormulaVisible);
  el.hostFormulaToggle.classList.toggle('active', state.hostFormulaVisible);
  el.hostFormulaToggle.setAttribute('aria-expanded', String(state.hostFormulaVisible));
  el.hostFormulaToggle.innerHTML = state.hostFormulaVisible
    ? '<i class="fa-solid fa-square-root-variable"></i> Hide Formula'
    : '<i class="fa-solid fa-square-root-variable"></i> Show Formula';

  el.hostTableBody.innerHTML = '';
  if (!activeSubnet) return;

  const baseBits = activeSubnet.fullBits.slice(0, d.networkBits + d.borrowedBits);
  const decimalMode = effectiveMode('panel5') === 'decimal';

  const renderHostRow = (h) => {
    const hostBitsArr = h.toString(2).padStart(d.hostBits, '0').split('').map(Number);
    const fullBits = baseBits.concat(hostBitsArr);
    const role = roleForHostIndex(h, d.totalHosts);
    const addressCell = decimalMode ? bitsToOctets(fullBits).join('.') : buildOctetBitsDisplay(fullBits, d);

    const tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + (h + 1) + '</td>' +
      '<td class="nowrap-cell">' + addressCell + '</td>' +
      '<td><span class="badge-role ' + role.cls + '">' + role.label + '</span></td>';
    el.hostTableBody.appendChild(tr);
  };

  if (d.totalHosts <= 8) {
    for (let h = 0; h < d.totalHosts; h++) renderHostRow(h);
  } else if (!state.hostsExpanded) {
    for (let h = 0; h < 5; h++) renderHostRow(h);
    const hiddenCount = d.totalHosts - 8;
    const trExp = document.createElement('tr');
    trExp.className = 'expansion-row';
        trExp.innerHTML =
      '<td colspan="2"><button class="expansion-btn" id="hostExpandBtn"><i class="fa-solid fa-eye"></i> Show ' + hiddenCount + ' Hidden Hosts</button></td>';
    el.hostTableBody.appendChild(trExp);
        document.getElementById('hostExpandBtn').addEventListener('click', () => {
      state.hostsExpanded = true;
      render();
    });
    for (let h = d.totalHosts - 3; h < d.totalHosts; h++) renderHostRow(h);
  } else {
    const cap = Math.min(d.totalHosts, 4096);
    for (let h = 0; h < cap; h++) renderHostRow(h);
    const trCollapse = document.createElement('tr');
    trCollapse.className = 'expansion-row';
    trCollapse.innerHTML = '<td colspan="3"><button class="expansion-btn" id="hostCollapseBtn"><i class="fa-solid fa-chevron-up"></i> Collapse</button></td>';
    el.hostTableBody.appendChild(trCollapse);
    document.getElementById('hostCollapseBtn').addEventListener('click', () => {
      state.hostsExpanded = false;
      render();
    });
  }
}

/* ---------------- Master render ---------------- */
/* Panel 6: side-by-side decimal comparison of the original classful network
   against the currently-inspected classless subnet (Panel 4's active
   row). No bit representation here by design — this panel is the plain-
   language payoff after Panels 2-5 walked through the binary reasoning. */
const fmtOctets = (octets) => (octets ? octets.join('.') : '—');

function buildCompareCommonStatsHtml(summary, countLabel, count, usableHostsLabel) {
  return (
    '<div class="compare-stat">' +
      '<span class="compare-stat-label">Subnet Mask</span>' +
      '<span class="compare-stat-value">' + fmtOctets(summary.maskOctets) + ' (/' + summary.prefixLen + ')</span>' +
    '</div>' +
    '<div class="compare-stat">' +
      '<span class="compare-stat-label">' + countLabel + '</span>' +
      '<span class="compare-stat-value">' + count + '</span>' +
    '</div>' +
    '<div class="compare-stat">' +
      '<span class="compare-stat-label">' + (usableHostsLabel || 'Usable Hosts') + '</span>' +
      '<span class="compare-stat-value">' + summary.usableHosts + '</span>' +
    '</div>'
  );
}

function buildCompareCardHtml(indexLabel, summary) {
  const usableRangeText = summary.usableHosts > 0
    ? fmtOctets(summary.firstUsableOctets) + ' – ' + fmtOctets(summary.lastUsableOctets)
    : '—';
  return (
    '<div class="compare-card">' +
      '<div class="compare-card-index">' + indexLabel + '</div>' +
      '<div class="compare-card-row"><span class="compare-card-label">Network Address</span><span class="compare-card-value">' + fmtOctets(summary.networkOctets) + '</span></div>' +
      '<div class="compare-card-row"><span class="compare-card-label">Usable Host Range</span><span class="compare-card-value">' + usableRangeText + '</span></div>' +
      '<div class="compare-card-row"><span class="compare-card-label">Broadcast</span><span class="compare-card-value">' + fmtOctets(summary.broadcastOctets) + '</span></div>' +
    '</div>'
  );
}

/* Renders one card per item into a container, applying the same First 5 /
   Interactive Ellipsis / Last 3 truncation rule used by Panels 4 & 5 once
   there are more than 8 items. */
function renderCompareCards(container, items, buildIndexLabel, expandBtnId, onToggle) {
  container.innerHTML = '';
  const total = items.length;

  const appendCard = (item) => {
    container.insertAdjacentHTML('beforeend', buildCompareCardHtml(buildIndexLabel(item), item.summary));
  };

  if (total <= 8) {
    items.forEach(appendCard);
    return;
  }

  if (!state.compareExpanded) {
    items.slice(0, 5).forEach(appendCard);
    const hiddenCount = total - 8;
    container.insertAdjacentHTML(
      'beforeend',
      '<div class="compare-expand-card"><button class="expansion-btn" id="' + expandBtnId + '">' +
        '<i class="fa-solid fa-eye"></i> Show ' + hiddenCount + ' Hidden Subnets</button></div>'
    );
    document.getElementById(expandBtnId).addEventListener('click', () => onToggle(true));
    items.slice(-3).forEach(appendCard);
  } else {
    items.forEach(appendCard);
    const collapseBtnId = expandBtnId + 'Collapse';
    container.insertAdjacentHTML(
      'beforeend',
      '<div class="compare-expand-card"><button class="expansion-btn" id="' + collapseBtnId + '">' +
        '<i class="fa-solid fa-chevron-up"></i> Collapse</button></div>'
    );
    document.getElementById(collapseBtnId).addEventListener('click', () => onToggle(false));
  }
}

/* Panel 6: decimal-only comparison of the original classful network against
   every classless subnet it splits into — no bit representation, no
   dependency on Panel 4's currently-inspected row. Each group shows its
   shared facts (mask, count, usable hosts) once up top, then one card per
   network (Classful: always exactly 1) or per subnet (Classless: all of
   them, subject to the same >8 truncation rule as Panels 4/5). */
function renderPanel6(d, subnetRows) {
  const classfulSummary = summarizeAddressBlock(d.inputBits.slice(0, d.networkBits));
  el.classfulCompareStats.innerHTML = buildCompareCommonStatsHtml(classfulSummary, 'Number of Networks', 1);
  el.classfulCompareCards.innerHTML = buildCompareCardHtml('Whole Network', classfulSummary);

  const classlessItems = subnetRows.map((row) => ({
    index: row.index,
    summary: summarizeAddressBlock(row.fullBits.slice(0, d.networkBits + d.borrowedBits)),
  }));
  const referenceSummary = classlessItems[0]
    ? classlessItems[0].summary
    : summarizeAddressBlock(d.inputBits.slice(0, d.networkBits + d.borrowedBits));
  el.classlessCompareStats.innerHTML = buildCompareCommonStatsHtml(referenceSummary, 'Number of Subnets', d.totalSubnets, 'Usable Hosts / Subnet');

  renderCompareCards(
    el.classlessCompareCards,
    classlessItems,
    (item) => 'Subnet ' + item.index,
    'compareExpandBtn',
    (expand) => {
      state.compareExpanded = expand;
      render();
    }
  );
}

function render() {
  const editableCount = syncOctetLocking();
  const d = computeDerived();
  // keep state.borrowedBits clamped so UI/state stay in sync
  state.borrowedBits = d.borrowedBits;

  updateOctetInputsUI(editableCount);
  renderPanel1(d);
  renderPanel2(d);
  renderPanel3(d);
  const subnetRows = renderPanel4(d);
  renderPanel5(d, subnetRows);
  renderPanel6(d, subnetRows);
}

/* ---------------- Event handlers ---------------- */
function onBitClick(globalIndex) {
  const d = computeDerived();
  if (d.classInfo.warning) return; // borrowing disabled
  if (globalIndex < d.networkBits) return; // locked network bit

  let newBorrowed = globalIndex - d.networkBits + 1;
  newBorrowed = Math.max(0, Math.min(newBorrowed, d.maxBorrow));

  state.borrowedBits = newBorrowed;
  state.activeSubnetIndex = 0;
  state.subnetsExpanded = false;
  state.hostsExpanded = false;
  render();
}

function onOctetInput() {
  state.octets = el.octetInputs.map((inp) => {
    const v = parseInt(inp.value, 10);
    return Number.isFinite(v) ? Math.max(0, Math.min(255, v)) : 0;
  });
  // Reset subnetting context on IP change (class may have changed). Borrowed
  // bits reset to 0 (classful) rather than an assumed default — the teacher
  // picks the boundary themselves by clicking a bit in Panel 2.
  state.activeSubnetIndex = 0;
  state.subnetsExpanded = false;
  state.hostsExpanded = false;
  state.borrowedBits = 0;
  render();
}

function applyPreset(name) {
  const presets = {
    A: [10, 0, 0, 0],
    B: [172, 16, 0, 0],
    C: [192, 168, 1, 0],
  };
  state.octets = presets[name];
  el.octetInputs.forEach((inp, i) => (inp.value = state.octets[i]));
  // Load classful (0 bits borrowed) — the teacher clicks a bit in Panel 2
  // to choose where the subnet boundary starts.
  state.borrowedBits = 0;
  state.activeSubnetIndex = 0;
  state.subnetsExpanded = false;
  state.hostsExpanded = false;
  render();
}

function resetToClassful() {
  const d = computeDerived();
  if (d.classInfo.warning) return; // nothing to reset when borrowing is already disabled
  state.borrowedBits = 0;
  state.activeSubnetIndex = 0;
  state.subnetsExpanded = false;
  state.hostsExpanded = false;
  render();
}

function togglePresenterMode() {
  state.presenterMode = !state.presenterMode;
  document.body.classList.toggle('presenter-mode', state.presenterMode);
  el.presenterToggle.classList.toggle('active', state.presenterMode);
  el.presenterToggle.innerHTML = state.presenterMode
    ? '<i class="fa-solid fa-tv"></i> Presenter Mode: On'
    : '<i class="fa-solid fa-tv"></i> Presenter Mode';
}

/* ---------------- Init ---------------- */
function init() {
  if (_initialized) { render(); return; }
  _initialized = true;
  el.octetInputs.forEach((inp) => inp.addEventListener('input', onOctetInput));
  document.querySelectorAll('.preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => applyPreset(btn.dataset.preset));
  });
  el.presenterToggle.addEventListener('click', togglePresenterMode);
  el.resetBorrowBtn.addEventListener('click', resetToClassful);
  el.subnetFormulaToggle.addEventListener('click', () => {
    state.subnetFormulaVisible = !state.subnetFormulaVisible;
    render();
  });
  el.hostFormulaToggle.addEventListener('click', () => {
    state.hostFormulaVisible = !state.hostFormulaVisible;
    render();
  });

  el.globalViewModeSegmented.querySelectorAll('.segment-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.viewMode.global = btn.dataset.mode;
      el.globalViewModeSegmented.querySelectorAll('.segment-btn').forEach((b) => {
        b.classList.toggle('active', b === btn);
      });
      render();
    });
  });

  [
    ['panel2ViewSelect', 'panel2'],
    ['panel3ViewSelect', 'panel3'],
    ['panel4ViewSelect', 'panel4'],
    ['panel5ViewSelect', 'panel5'],
  ].forEach(([elKey, panelKey]) => {
    el[elKey].addEventListener('change', () => {
      state.viewMode[panelKey] = el[elKey].value;
      render();
    });
  });

  render();
}

// init() is called by showSubnetVisualizer() in script.js instead of on DOMContentLoaded,
// since this panel starts hidden and its DOM elements only need to be wired up once, lazily.

  return { init, render };
})();