import React, { useState, useEffect, useCallback } from "react";
// Stubbed Firebase Imports (Ready for future login/auth implementation)
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// --- Minimal Firebase Setup (Not fully initialized until needed) ---
// Note: These global variables are required by the canvas environment.
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
// let auth = null;
// let db = null;   

// if (Object.keys(firebaseConfig).length > 0) {
//     const firebaseApp = initializeApp(firebaseConfig);
//     auth = getAuth(firebaseApp);
//     db = getFirestore(firebaseApp);
// }
// -----------------------------------------------------------------

/* --- Custom SVG Logo Component --- */
const UDAANSVGLogo = ({ size = 80, color = "#1F78D1" }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ 
            marginBottom: 10, 
            filter: `drop-shadow(0 0 5px ${color}80)`, // Subtle shadow for depth
        }}
    >
        {/* Abstract upward flight path / Swoosh */}
        <path 
            d="M 20 80 Q 50 20 80 80" // Quadratic Bezier curve: start(20,80) -> control(50,20) -> end(80,80)
            stroke={color} 
            strokeWidth="8" 
            strokeLinecap="round"
            fill="none"
        />
        {/* Goal/Star/Sun element at the peak */}
        <circle 
            cx="50" 
            cy="20" 
            r="10" 
            fill={color}
        />
        {/* Small decorative inner line for dynamics */}
        <path 
            d="M 40 80 L 50 60 L 60 80" 
            stroke={color} 
            strokeWidth="3" 
            strokeLinecap="round"
            fill="none"
        />
    </svg>
);


/* --- 1. Splash Screen Component --- */
function Splash({ onContinue }) {
  // Use useEffect to automatically navigate after 4000 milliseconds (4 seconds)
  useEffect(() => {
    // Set the timer for 4 seconds
    const timer = setTimeout(onContinue, 4000); 
    
    // Cleanup function to clear the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div style={styles.splashContainer}>
      {/* UDAAN Logo (Using a combined div for better visual centering) */}
      <div style={styles.logoWrapper}>
          {/* Custom SVG Logo placed here */}
          <UDAANSVGLogo />
          <h1 style={styles.splashTitle}>UDAAN</h1> 
      </div>
      
      {/* UPDATED SUBTITLE */}
      <p style={styles.splashSubtitle}>Seamless Placement & Training Nexus</p>
      
      {/* A simple loading indicator for visual effect */}
      <div style={styles.loadingBar}>
        <div style={styles.loadingProgress}></div>
      </div>
      
      <button style={{...styles.button, marginTop: 40, background: '#1F78D1'}} onClick={onContinue}>
        Continue
      </button>
    </div>
  );
}

/* --- 2. Role Selection Component (Next Screen) --- */

const RoleCard = ({ role, onClick }) => {
    // Custom style for dynamic hover effect using inline styles (for React environment)
    const [isHovered, setIsHovered] = useState(false);

    const cardStyle = {
        ...styles.roleCard,
        background: isHovered ? 'linear-gradient(135deg, #1F78D1, #125DB0)' : '#2C2C2C', // Gradient on hover
        transform: isHovered ? 'translateY(-8px) scale(1.03)' : 'translateY(0)',
        boxShadow: isHovered ? '0 15px 35px rgba(31, 120, 209, 0.4), 0 0 20px rgba(31, 120, 209, 0.2)' : '0 8px 16px rgba(0,0,0,0.5)',
        border: isHovered ? '2px solid #1F78D1' : '2px solid #444',
    };

    return (
        <div 
            style={cardStyle} 
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span style={styles.roleIcon}>{role.icon}</span>
            <h3 style={styles.roleTitle}>{role.name}</h3>
            <p style={styles.roleDescription}>{role.description}</p>
        </div>
    );
};

function RoleSelection({ go }) {
    // Based on the provided PDF, the three main roles are:
    // 1. Student
    // 2. Placement Cell (DTE) / Placement Officer
    // 3. Industry / Recruiter
    
    const roles = [
        {
            name: "Student",
            icon: "🎓",
            description: "Apply for Internships/Jobs, track progress, and access resources."
        },
        {
            name: "Placement Officer",
            icon: "🏫",
            description: "Manage companies, approve applications, and generate MIS reports."
        },
        {
            name: "Recruiter/Industry",
            icon: "💼",
            description: "Post vacancies, shortlist candidates, and issue digital offer letters."
        }
    ];

    return (
        <div style={styles.roleSelectionContainer}>
            <h2 style={{ color: "#fff", marginBottom: 15, fontSize: 32, fontWeight: 700 }}>Select Your Role</h2>
            <p style={{ color: '#aaa', marginBottom: 40 }}>Choose the role that best defines your interaction with the UDAAN platform.</p>
            <div style={styles.roleGrid}>
                {roles.map(role => (
                    <RoleCard 
                        key={role.name} 
                        role={role} 
                        onClick={() => go(role.name.toLowerCase().replace(/\s|\//g, ''))} // e.g., 'student', 'placementofficer', 'recruiterindustry'
                    />
                ))}
            </div>
        </div>
    );
}

/* --- 3. Main App Component --- */
export default function App() {
  const [screen, setScreen] = useState("splash");
  
  const navigateTo = useCallback((page) => setScreen(page), []);

  const renderScreen = () => {
    switch (screen) {
      case "splash":
        return <Splash onContinue={() => navigateTo("roleSelection")} />;
      case "roleSelection":
        return <RoleSelection go={navigateTo} />;
      default:
        // Placeholder for future screens like 'studentlogin', 'placementofficerlogin', etc.
        return (
          <div style={styles.center}>
            <h1 style={{color: '#fff'}}>Welcome to UDAAN!</h1>
            <p style={{color: '#ccc'}}>You selected: {screen}</p>
            <button style={styles.button} onClick={() => navigateTo("roleSelection")}>
                Go Back to Role Selection
            </button>
          </div>
        );
    }
  };

  return (
    <div style={styles.page}>
      {renderScreen()}
    </div>
  );
}


/* --- 4. Styles --- */
const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#121212", // Dark background for the whole page
        padding: 20,
        boxSizing: "border-box",
        fontFamily: "'Inter', sans-serif",
    },
<<<<<<< HEAD
    splashContainer: {
        textAlign: "center",
        padding: 60,
        background: "#1E1E1E", // Dark background for the splash box
        borderRadius: 20,
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        width: 400,
        maxWidth: '90%',
    },
    logoWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 20,
    },
    splashTitle: {
        fontSize: 48,
        color: "#1F78D1", // Primary blue color for contrast
        fontWeight: 800,
        margin: "0",
    },
    splashSubtitle: {
        fontSize: 18,
        color: "#B0B0B0", // Light gray text for visibility
        marginBottom: 30,
    },
    loadingBar: {
        width: '100%',
        height: 8,
        backgroundColor: '#444', // Darker background for loading bar
        borderRadius: 4,
        overflow: 'hidden',
    },
    loadingProgress: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1F78D1', // Primary blue color
        borderRadius: 4,
        animation: 'progress-anim 4s linear forwards',
    },
    button: {
        padding: "12px 25px",
        background: "#1F78D1",
        color: "#fff",
        border: "none",
        borderRadius: 10,
        cursor: "pointer",
        fontSize: 16,
        fontWeight: 600,
        transition: 'background 0.2s, transform 0.1s',
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
    },
    center: {
        textAlign: "center",
        padding: 20,
    },
    // Role Selection Styles (Updated for enhanced design)
    roleSelectionContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 50, // Increased padding
        background: "#1E1E1E", // Dark background
        borderRadius: 25, // More rounded corners
        boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
        width: 1000, // Increased width for better layout
        maxWidth: '95%',
    },
    roleGrid: {
        display: "flex",
        gap: 30, // Increased gap
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        width: '100%',
    },
    roleCard: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "35px 25px", // Increased padding inside card
        background: "#2C2C2C", 
        borderRadius: 15,
        cursor: "pointer",
        width: 280, // Slightly wider cards
        minHeight: 220, // Set min height for uniformity
        textAlign: "center",
        border: "2px solid #444",
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)", // Smooth transition
    },
    roleIcon: {
        fontSize: 60, // Larger icon
        marginBottom: 15,
    },
    roleTitle: {
        fontSize: 22, // Larger title
        fontWeight: 700,
        color: "#fff", 
        margin: 0,
    },
    roleDescription: {
        fontSize: 15,
        color: "#B0B0B0", 
        marginTop: 10,
    },
=======
  },
>>>>>>> 72f31b25d3dfd3cbc095efb69ce27891a360ba94
};
