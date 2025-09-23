import React, { useState, useEffect, createContext, useContext } from 'react';
import { auth, db, analytics } from '../utils/firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import { logEvent } from 'firebase/analytics';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [view, setView] = useState('dashboard');
  const [language, setLanguage] = useState('en');
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userFarms, setUserFarms] = useState([]);
  const [firebaseConnected, setFirebaseConnected] = useState(false);

  // Safe analytics logging - only on client side
  const safeLogEvent = (eventName, eventParams) => {
    if (typeof window !== 'undefined' && analytics) {
      try {
        logEvent(analytics, eventName, eventParams);
      } catch (error) {
        console.log('Analytics event failed:', error);
      }
    }
  };

    const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme);
    
    // Save to localStorage and apply class to html element
    if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme)
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }
    
    safeLogEvent('theme_toggle', { theme: newTheme });
    };

    // Also update the initial theme state to load from localStorage
    useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme') || 'light'
        setTheme(savedTheme)
        document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    }
    }, [])

  const setViewWithTracking = (newView) => {
    setView(newView);
    safeLogEvent('page_view', { page: newView });
  };

  const setLanguageWithTracking = (newLanguage) => {
    setLanguage(newLanguage);
    safeLogEvent('language_change', { language: newLanguage });
  };

  // Firebase Auth State Listener - client side only
  useEffect(() => {
    // Skip if on server side or Firebase not available
    if (typeof window === 'undefined' || !auth) {
      console.log('🚫 Firebase not available, using demo mode');
      setUserId('demo-user-' + Math.random().toString(36).substr(2, 9));
      setIsAuthReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseConnected(true);
        setUserId(user.uid);
        console.log('✅ User authenticated:', user.uid);
        
        safeLogEvent('login', { method: 'anonymous' });
        
        try {
          // Get or create user document
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            await setDoc(userDocRef, {
              createdAt: new Date(),
              lastLogin: new Date(),
              language: 'en',
              theme: 'light',
              farms: [],
              predictions: []
            });
            setUserData({ 
              createdAt: new Date(), 
              language: 'en', 
              theme: 'light',
              farms: [],
              predictions: []
            });
          }
          
          await loadUserFarms(user.uid);
        } catch (error) {
          console.warn('⚠️ Firestore error:', error);
        }
      } else {
        try {
          await signInAnonymously(auth);
        } catch (error) {
          console.warn('⚠️ Anonymous sign-in failed, using demo mode:', error);
          setUserId('demo-user-' + Math.random().toString(36).substr(2, 9));
        }
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const loadUserFarms = async (uid) => {
    if (!db) return;
    
    try {
      const farmsQuery = collection(db, 'users', uid, 'farms');
      const farmsSnapshot = await getDocs(farmsQuery);
      const farms = farmsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUserFarms(farms);
    } catch (error) {
      console.warn('⚠️ Error loading farms:', error);
    }
  };

  const addNewFarm = async (farmData) => {
    safeLogEvent('farm_created', farmData);
    
    if (!userId || !db) {
      const newFarm = { id: Date.now().toString(), ...farmData, createdAt: new Date() };
      setUserFarms(prev => [...prev, newFarm]);
      return newFarm;
    }
    
    try {
      const farmDocRef = await addDoc(collection(db, 'users', userId, 'farms'), {
        ...farmData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const newFarm = { id: farmDocRef.id, ...farmData };
      setUserFarms(prev => [...prev, newFarm]);
      return newFarm;
    } catch (error) {
      console.warn('⚠️ Error adding farm:', error);
      return null;
    }
  };

  const savePrediction = async (predictionData) => {
    safeLogEvent('prediction_made', {
      district: predictionData.district,
      season: predictionData.season,
      crop: predictionData.crop,
      area: predictionData.totalArea
    });
    
    if (!userId || !db) {
      console.log('📊 Prediction (demo mode):', predictionData);
      return 'demo-prediction-id';
    }
    
    try {
      const predictionDocRef = await addDoc(collection(db, 'users', userId, 'predictions'), {
        ...predictionData,
        createdAt: new Date(),
        timestamp: new Date(),
        userId: userId
      });
      return predictionDocRef.id;
    } catch (error) {
      console.warn('⚠️ Error saving prediction:', error);
      return null;
    }
  };

  const value = { 
    theme, 
    toggleTheme, 
    view, 
    setView: setViewWithTracking, 
    language, 
    setLanguage: setLanguageWithTracking, 
    userId, 
    userData,
    userFarms,
    isAuthReady,
    firebaseConnected,
    addNewFarm,
    savePrediction
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};