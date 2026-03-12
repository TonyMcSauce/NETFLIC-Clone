import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

// Central app store for media catalog + local profile data.
const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [media, setMedia] = useState([]);
  const [rows, setRows] = useState({});
  const [featured, setFeatured] = useState(null);
  const [userData, setUserData] = useState(null);

  const loadInitial = async (params = {}) => {
    setLoading(true);
    try {
      const [mediaPayload, userPayload] = await Promise.all([api.getMedia(params), api.getProfiles()]);
      setMedia(mediaPayload.items);
      setRows(mediaPayload.rows);
      setFeatured(mediaPayload.featured);
      setUserData(userPayload);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitial();
  }, []);

  const value = useMemo(
    () => ({ loading, media, rows, featured, userData, reload: loadInitial, setUserData }),
    [loading, media, rows, featured, userData]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
};
