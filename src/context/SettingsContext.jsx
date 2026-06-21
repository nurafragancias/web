import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const DEFAULT_SETTINGS = {
  whatsapp_number: '543562447897'
};

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoaded(true); return; }
    (async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');
      if (!error && Array.isArray(data)) {
        const obj = { ...DEFAULT_SETTINGS };
        for (const row of data) {
          if (row?.key) obj[row.key] = row.value ?? '';
        }
        setSettings(obj);
      }
      setLoaded(true);
    })();
  }, []);

  const getSetting = useCallback(
    (key, fallback = '') => settings[key] ?? fallback,
    [settings]
  );

  const setSetting = useCallback(async (key, value) => {
    const cleaned = String(value ?? '');
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key, value: cleaned, updated_at: new Date().toISOString() });
      if (error) throw error;
    }
    setSettings(prev => ({ ...prev, [key]: cleaned }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loaded, getSetting, setSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
