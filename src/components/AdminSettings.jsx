import React, { useEffect, useState } from 'react';
import { Save, Phone, ExternalLink } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import AdminCoupons from './AdminCoupons';
import AdminBrandLogos from './AdminBrandLogos';
import './AdminSettings.css';

const stripNonDigits = (s) => String(s || '').replace(/\D/g, '');
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || '').trim());

const AdminSettings = () => {
  const { getSetting, setSetting, loaded } = useSettings();
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (loaded) {
      setWhatsapp(getSetting('whatsapp_number', ''));
      setInstagram(getSetting('instagram_url', ''));
      setEmail(getSetting('email', ''));
    }
  }, [loaded, getSetting]);

  const cleaned = stripNonDigits(whatsapp);
  const isValid = cleaned.length >= 10 && cleaned.length <= 15;
  const previewUrl = isValid ? `https://wa.me/${cleaned}` : '';
  const emailValid = !email.trim() || isEmail(email); // vacío es válido (opcional)

  const handleSave = async () => {
    setError('');
    setSavedMsg('');
    if (!isValid) {
      setError('El número de WhatsApp debe tener entre 10 y 15 dígitos (incluyendo código de país).');
      return;
    }
    if (!emailValid) {
      setError('El correo no tiene un formato válido (ej: nura@gmail.com).');
      return;
    }
    setSaving(true);
    try {
      await setSetting('whatsapp_number', cleaned);
      await setSetting('instagram_url', instagram.trim());
      await setSetting('email', email.trim());
      setSavedMsg('Guardado. Los datos ya están activos en el sitio.');
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
          <h4>Contacto y redes</h4>
          <p>
            Estos datos alimentan el botón de WhatsApp y los íconos del pie de página
            (Instagram y correo aparecen sólo si los completás).
          </p>
        </div>

        <div className="admin-settings__field">
          <label>Número de WhatsApp</label>
          <input
            type="tel"
            value={whatsapp}
            onChange={e => setWhatsapp(e.target.value)}
            placeholder="543562447897"
            inputMode="numeric"
            autoComplete="off"
          />
          <span className="admin-settings__hint">
            Con código de país <strong>sin el +</strong> ni espacios (ej: <code>543562447897</code>).
            {whatsapp && cleaned !== whatsapp && <> Se guarda como <code>{cleaned}</code>.</>}
          </span>
          {previewUrl && (
            <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="admin-settings__preview">
              <ExternalLink size={14} /> Probar enlace de WhatsApp
            </a>
          )}
        </div>

        <div className="admin-settings__field">
          <label>Instagram</label>
          <input
            type="text"
            value={instagram}
            onChange={e => setInstagram(e.target.value)}
            placeholder="@nurafragancias  o  https://instagram.com/nurafragancias"
            autoComplete="off"
          />
          <span className="admin-settings__hint">
            Podés poner tu usuario (<code>@nurafragancias</code>) o el link completo.
          </span>
        </div>

        <div className="admin-settings__field">
          <label>Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="nura@gmail.com"
            autoComplete="off"
          />
          <span className="admin-settings__hint">
            Al tocar el ícono de correo, se le abre al cliente para escribirte.
          </span>
        </div>

        {error && <div className="admin-settings__error">{error}</div>}
        {savedMsg && <div className="admin-settings__success">{savedMsg}</div>}

        <button
          type="button"
          className="btn-gold admin-settings__save"
          onClick={handleSave}
          disabled={saving || !isValid || !emailValid}
        >
          <Save size={16} />
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>

      <AdminBrandLogos />

      <AdminCoupons />
    </div>
  );
};

export default AdminSettings;
