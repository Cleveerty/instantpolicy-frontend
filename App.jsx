import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB18QHbEPiX_bNL0PtGnxpXdqE8SF2-EcA",
  authDomain: "money-4d4ae.firebaseapp.com",
  projectId: "money-4d4ae",
  storageBucket: "money-4d4ae.firebasestorage.app",
  messagingSenderId: "68852380456",
  appId: "1:68852380456:web:0cf3a65ee996e60d05161d"
};

initializeApp(firebaseConfig);
const auth = getAuth();

function App() {
  const [form, setForm] = useState({
    businessName: '',
    location: '',
    serviceType: '',
    email: ''
  });
  const [user, setUser] = useState(null);
  const [pdfLink, setPdfLink] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) setUser(user); else setUser(null);
    });
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleLoginChange = e => setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
    } catch (err) {
      alert('Login failed.');
    }
  };

  const logout = () => signOut(auth);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user) return alert("Please log in first");
    const res = await axios.post('http://localhost:3001/api/generate-policy', {
      ...form,
      uid: user.uid
    });
    setPdfLink(res.data.pdfUrl);
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">InstantPolicy Generator</h1>

      {!user ? (
        <div className="mb-6 space-y-2">
          <input name="email" placeholder="Email" className="border p-2 w-full" onChange={handleLoginChange} />
          <input type="password" name="password" placeholder="Password" className="border p-2 w-full" onChange={handleLoginChange} />
          <button onClick={login} className="bg-green-600 text-white p-2 rounded">Log In</button>
        </div>
      ) : (
        <>
          <button onClick={logout} className="text-sm text-red-500 mb-4">Log Out</button>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="businessName" placeholder="Business Name" className="border p-2 w-full" onChange={handleChange} />
            <input name="location" placeholder="Location (State/Province)" className="border p-2 w-full" onChange={handleChange} />
            <input name="serviceType" placeholder="Type of Service (e.g., Freelance Design)" className="border p-2 w-full" onChange={handleChange} />
            <input name="email" placeholder="Your Email" className="border p-2 w-full" onChange={handleChange} />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded">Generate Policy</button>
          </form>
        </>
      )}

      {pdfLink && (
        <div className="mt-6">
          <a href={pdfLink} target="_blank" className="text-blue-500 underline">Download Your Policy Document</a>
        </div>
      )}
    </div>
  );
}

export default App;
