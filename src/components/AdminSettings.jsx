import React, { useEffect, useState } from 'react';
import { Save, Phone, ExternalLink } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import './AdminSettings.css';

const stripNonDigits = (s) => String(s || '').replace(/\D/g, '');

const AdminSettings = () => {
  const { getSetting, setSetting, loaded } = useSettings();
  const [whatsapp, setWhatsapp] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (loaded) setWhatsapp(getSetting('whatsapp_number', ''));
  }, [loaded, getSetting]);

  const cleaned = stripNonDigits(whatsapp);
  const isValid = cleaned.length >= 10 && cleaned.length <= 15;
  const previewUrl = isValid ? `https://wa.me/${cleaned}` : '';

  const handleSave = async () => {
    setError('');
    setSavedMsg('');
    if (!isValid) {
      setError('El número debe tener entre 10 y 15 dígitos (incluyendo código de país).');
      return;
    }
    setSaving(true);
    try {
      await setSetting('whatsapp_number', cleaned);
      setSavedMsg('Guardado. El número ya está activo en el sitio.');
      setTimeout(() => setSavedMsg(''), 4000);
    } catch (err) {
      setError('No se pudo guardar: ' + (err?.message || 'error desconocido'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-settings">
      <div className="admin-settings__intro">
        <Phone size={20} />
        <div>
          <h3>Ajustes del sitio</h3>
          <p>Configurá los datos de contacto que ven los clientes.</p>
        </div>
      </div>

      <div className="admin-settings__card">
        <div className="admin-settings__card-head">
          <h4>Número de WhatsApp</h4>
          <p>
            Es el número al que llegan los pedidos del carrito y el ícono del footer.
            Incluí el código de país <strong>sin el +</strong> ni espacios. Ejemplo
            para Argentina: <code>54</code> + área + número (ej: <code>543562447897</code>).
          </p>
        </div>

        <div className="admin-settings__field">
          <label>Número</label>
          <input
            type="tel"
            value={whatsapp}
            onChange={e => setWhatsapp(e.target.value)}
            placeholder="543562447897"
            inputMode="numeric"
            autoComplete="off"
          />
          {whatsapp && cleaned !== whatsapp && (
            <span className="admin-settings__hint">
              Se va a guardar como: <code>{cleaned}</code> (sin símbolos)
            </span>
          )}
        </div>

        {previewUrl && (
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-settings__preview"
          >
            <ExternalLink size={14} />
            Probar enlace de WhatsApp
          </a>
        )}

        {error && <div className="admin-settings__error">{error}</div>}
        {savedMsg && <div className="admin-settings__success">{savedMsg}</div>}

        <button
          type="button"
          className="btn-gold admin-settings__save"
          onClick={handleSave}
          disabled={saving || !isValid}
        >
          <Save size={16} />
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
