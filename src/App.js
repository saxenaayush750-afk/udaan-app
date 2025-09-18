import React, { useState } from "react";
import { auth, db } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

/* Utility Components from Previous Code */
function Splash({ onContinue }) {
  React.useEffect(() => {
    const t = setTimeout(onContinue, 1200);
    return () => clearTimeout(t);
  }, [onContinue]);
  return (
    <div style={styles.center}>
      <h1 style={{fontSize:40, color:"#4b6cb7"}}>UDAAN 🚀</h1>
      <p style={{marginTop:10}}>One Stop Career & Education Advisor</p>
      <button style={styles.button} onClick={onContinue}>Continue</button>
    </div>
  );
}

function RoleSelection({ go }) {
  return (
    <div style={styles.center}>
      <h2>Choose Role</h2>
      <div style={{marginTop:20}}>
        <button style={{...styles.button, background:"#2979ff"}} onClick={() => go("studentLogin")}>Student</button>
        <button style={{...styles.button, background:"#27ae60", marginLeft:12}} onClick={() => go("counselorLogin")}>Counselor</button>
      </div>
    </div>
  );
}

function StudentRegister({ onBack, onLogin }) {
  const [name,setName] = useState("");
  const [age,setAge] = useState("");
  const [gender,setGender] = useState("");
  const [education,setEducation] = useState("");
  const [email,setEmail] = useState("");
  const [phone,setPhone] = useState("");
  const [password,setPassword] = useState("");

  const register = async () => {
    if(!email || !password || !name){ alert("Please fill name, email & password"); return; }
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "students", userCred.user.uid), {
        name, age, gender, currentEducation: education, email, phone,
        createdAt: serverTimestamp(), verified: false
      });
      alert("Registered! Please verify your email from Firebase console if needed.");
      onBack();
    } catch(e) {
      alert("Register error: " + e.message);
    }
  };

  return (
    <div style={styles.formCard}>
      <h3>Student Register</h3>
      <input style={styles.input} placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
      <input style={styles.input} placeholder="Age" value={age} onChange={e=>setAge(e.target.value)} />
      <input style={styles.input} placeholder="Gender" value={gender} onChange={e=>setGender(e.target.value)} />
      <input style={styles.input} placeholder="Current Education" value={education} onChange={e=>setEducation(e.target.value)} />
      <input style={styles.input} placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input style={styles.input} placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
      <input style={styles.input} placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <div style={{display:"flex", gap:10}}>
        <button style={styles.button} onClick={register}>Register</button>
        <button style={styles.ghost} onClick={onBack}>Back</button>
      </div>
    </div>
  );
}

function StudentLogin({ onBack, onLoginSuccess, onRegisterClick }) {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch(e) {
      alert("Login failed: " + e.message);
    }
  };

  const forgot = async () => {
    const em = prompt("Enter your registered email for reset:");
    if(!em) return;
    try {
      await sendPasswordResetEmail(auth, em);
      alert("Password reset email sent (check inbox).");
    } catch(e) {
      alert("Error: " + e.message);
    }
  };

  return (
    <div style={styles.formCard}>
      <h3>Student Login</h3>
      <input style={styles.input} placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input style={styles.input} placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <div style={{display:"flex", gap:10}}>
        <button style={styles.button} onClick={login}>Login</button>
        <button style={styles.ghost} onClick={onBack}>Back</button>
      </div>
      <button style={{marginTop:10, background:"transparent", color:"#2b6cb0", border:"none"}} onClick={forgot}>Forgot Password?</button>
      <button style={{marginTop:10, background:"transparent", color:"#2b6cb0", border:"none"}} onClick={onRegisterClick}>Don't have an account? Register</button>
    </div>
  );
}

/* Student Dashboard */
function StudentDashboard({ onLogout }) {
  return (
    <div style={styles.dashboardPage}>
      <h2 style={{color:"#4b6cb7"}}>UDAAN: Student Dashboard</h2>
      <div style={styles.grid}>
        <button style={styles.gridItem}>
          <span style={{fontSize:24}}>🧭</span>
          <h3>Career Compass</h3>
        </button>
        <button style={styles.gridItem}>
          <span style={{fontSize:24}}>👨‍🏫</span>
          <h3>Find a Mentor</h3>
        </button>
        <button style={styles.gridItem}>
          <span style={{fontSize:24}}>💬</span>
          <h3>My Chats</h3>
        </button>
        <button style={styles.gridItem}>
          <span style={{fontSize:24}}>❓</span>
          <h3>FAQs</h3>
        </button>
        <button style={styles.gridItem}>
          <span style={{fontSize:24}}>🌟</span>
          <h3>Success Stories</h3>
        </button>
        <button style={styles.gridItem}>
          <span style={{fontSize:24}}>👤</span>
          <h3>My Profile</h3>
        </button>
      </div>
      <button style={{...styles.button, marginTop:40}} onClick={onLogout}>Logout</button>
    </div>
  );
}

/* Counselor Register & Login */
function CounselorRegister({ onBack, onLogin }) {
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [phone,setPhone] = useState("");
  const [password,setPassword] = useState("");

  const register = async () => {
    if(!email || !password || !name){ alert("Please fill name, email & password"); return; }
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "counselors", userCred.user.uid), {
        name, email, phone, studentsHelped: 0, createdAt: serverTimestamp()
      });
      alert("Counselor registered!");
      onBack();
    } catch(e) {
      alert("Error: " + e.message);
    }
  };

  return (
    <div style={styles.formCard}>
      <h3>Counselor Register</h3>
      <input style={styles.input} placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input style={styles.input} placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input style={styles.input} placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
      <input style={styles.input} placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <div style={{display:"flex", gap:10}}>
        <button style={styles.button} onClick={register}>Register</button>
        <button style={styles.ghost} onClick={onBack}>Back</button>
      </div>
    </div>
  );
}

function CounselorLogin({ onBack, onLoginSuccess, onRegisterClick }) {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch(e) { alert("Login failed: " + e.message); }
  };
  return (
    <div style={styles.formCard}>
      <h3>Counselor Login</h3>
      <input style={styles.input} placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input style={styles.input} placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <div style={{display:"flex", gap:10}}>
        <button style={styles.button} onClick={login}>Login</button>
        <button style={styles.ghost} onClick={onBack}>Back</button>
      </div>
      <button style={{marginTop:10, background:"transparent", color:"#2b6cb0", border:"none"}} onClick={onRegisterClick}>Don't have an account? Register</button>
    </div>
  );
}

/* NEW Counselor Dashboard */
function CounselorDashboard({ onLogout }) {
  return (
    <div style={styles.dashboardPage}>
      <h2 style={{color:"#27ae60"}}>UDAAN: Counselor Dashboard</h2>
      <div style={styles.grid}>
        <button style={styles.gridItem}>
          <span style={{fontSize:24}}>👤</span>
          <h3>My Profile</h3>
        </button>
        <button style={styles.gridItem}>
          <span style={{fontSize:24}}>🙋‍♂</span>
          <h3>Student Requests</h3>
        </button>
        <button style={styles.gridItem}>
          <span style={{fontSize:24}}>💬</span>
          <h3>My Chats</h3>
        </button>
        <button style={styles.gridItem}>
          <span style={{fontSize:24}}>📈</span>
          <h3>Impact Tracker</h3>
        </button>
        <button style={styles.gridItem}>
          <span style={{fontSize:24}}>📅</span>
          <h3>Session Management</h3>
        </button>
        <button style={styles.gridItem}>
          <span style={{fontSize:24}}>📜</span>
          <h3>Certification</h3>
        </button>
      </div>
      <button style={{...styles.button, background:"#e74c3c", marginTop:40}} onClick={onLogout}>Logout</button>
    </div>
  );
}

/* Main App */
export default function App(){
  const [screen, setScreen] = useState("splash");
  const [userType, setUserType] = useState(null);

  const go = (page) => setScreen(page);

  const logout = async () => { await signOut(auth); setScreen("role"); setUserType(null); };

  const onStudentLoginSuccess = () => { setUserType("student"); setScreen("studentDash"); };
  const onCounselorLoginSuccess = () => { setUserType("counselor"); setScreen("counselorDash"); };

  return (
    <div style={styles.page}>
      {screen === "splash" && <Splash onContinue={() => setScreen("role")} />}
      {screen === "role" && <RoleSelection go={go} />}
      {screen === "studentLogin" && (
        <StudentLogin
          onBack={() => setScreen("role")}
          onLoginSuccess={onStudentLoginSuccess}
          onRegisterClick={() => setScreen("studentRegister")}
        />
      )}
      {screen === "studentRegister" && (
        <StudentRegister
          onBack={() => setScreen("studentLogin")}
        />
      )}
      {screen === "studentDash" && <StudentDashboard onLogout={logout} />}
      {screen === "counselorLogin" && (
        <CounselorLogin
          onBack={() => setScreen("role")}
          onLoginSuccess={onCounselorLoginSuccess}
          onRegisterClick={() => setScreen("counselorRegister")}
        />
      )}
      {screen === "counselorRegister" && (
        <CounselorRegister
          onBack={() => setScreen("counselorLogin")}
        />
      )}
      {screen === "counselorDash" && <CounselorDashboard onLogout={logout} />}
    </div>
  );
}

const styles = {
  page: { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f3f6ff", padding:20 },
  dashboardPage: { display:"flex", flexDirection:"column", alignItems:"center", padding:20, background:"#fff", borderRadius:16, boxShadow:"0 6px 18px rgba(0,0,0,0.08)" },
  center: { textAlign:"center" },
  button: { padding:"10px 18px", background:"#4b6cb7", color:"#fff", border:"none", borderRadius:8, cursor:"pointer", marginTop:12 },
  ghost: { padding:"10px 18px", background:"#ddd", color:"#333", border:"none", borderRadius:8, cursor:"pointer" },
  formCard: { width:320, padding:16, borderRadius:12, background:"#fff", boxShadow:"0 6px 18px rgba(0,0,0,0.08)", display:"flex", flexDirection:"column", gap:8 },
  input: { padding:10, borderRadius:8, border:"1px solid #ccc", marginBottom:6 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginTop: "40px", maxWidth: "800px" },
  gridItem: {
    padding: "20px",
    background: "#f0f4f8",
    borderRadius: 12,
    border: "1px solid #d4e0ee",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
    },
  },
};