import React, { useState } from 'react';
import Card from '../components/Card';
import PageHeader from '../components/PageHeader';
import { useToast } from '../components/Toast';
import styles from './Settings.module.css';

const SECTIONS = ['General', 'Notificaciones', 'Integraciones', 'Apariencia'];

export default function Settings() {
  const [activeSection, setActiveSection] = useState('General');
  const [settings, setSettings] = useState({
    language: 'es',
    timezone: 'America/Argentina/Buenos_Aires',
    cvAutoAnalysis: true,
    emailNotifications: true,
    weeklyReport: true,
    slackIntegration: false,
    darkMode: false,
    compactMode: false,
    autoAssignTests: true,
    retentionDays: '90',
  });
  const [saved, setSaved] = useState(false);
  const toast = useToast();

  const toggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));
  const set = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    toast.success('Configuración guardada correctamente.');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className={styles.page}>
      <PageHeader title="Configuración" subtitle="Personalizá tu experiencia en GestiónRH" />

      <div className={styles.layout}>
        <Card className={styles.sidebar}>
          {SECTIONS.map(s => (
            <button
              key={s}
              className={`${styles.sectionBtn} ${activeSection === s ? styles.active : ''}`}
              onClick={() => setActiveSection(s)}
            >
              {s}
            </button>
          ))}
        </Card>

        <div className={styles.content}>
          {saved && <div className={styles.successBanner}>✓ Configuración guardada correctamente</div>}

          {activeSection === 'General' && (
            <Card className={styles.section}>
              <h3>Configuración general</h3>
              <div className={styles.settingsList}>
                <div className={styles.settingItem}>
                  <div>
                    <div className={styles.settingLabel}>Idioma</div>
                    <div className={styles.settingDesc}>Idioma de la interfaz</div>
                  </div>
                  <select value={settings.language} onChange={e => set('language', e.target.value)} className={styles.select}>
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="pt">Português</option>
                  </select>
                </div>
                <div className={styles.settingItem}>
                  <div>
                    <div className={styles.settingLabel}>Zona horaria</div>
                    <div className={styles.settingDesc}>Usada para fechas y horarios</div>
                  </div>
                  <select value={settings.timezone} onChange={e => set('timezone', e.target.value)} className={styles.select}>
                    <option value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</option>
                    <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                    <option value="America/Bogota">Bogotá (GMT-5)</option>
                    <option value="Europe/Madrid">Madrid (GMT+2)</option>
                  </select>
                </div>
                <div className={styles.settingItem}>
                  <div>
                    <div className={styles.settingLabel}>Análisis automático de CVs</div>
                    <div className={styles.settingDesc}>Analizar con IA al cargar un nuevo CV</div>
                  </div>
                  <Toggle value={settings.cvAutoAnalysis} onChange={() => toggle('cvAutoAnalysis')} />
                </div>
                <div className={styles.settingItem}>
                  <div>
                    <div className={styles.settingLabel}>Asignación automática de pruebas</div>
                    <div className={styles.settingDesc}>Asignar pruebas según el perfil del candidato</div>
                  </div>
                  <Toggle value={settings.autoAssignTests} onChange={() => toggle('autoAssignTests')} />
                </div>
                <div className={styles.settingItem}>
                  <div>
                    <div className={styles.settingLabel}>Retención de datos</div>
                    <div className={styles.settingDesc}>Días que se conservan los registros inactivos</div>
                  </div>
                  <select value={settings.retentionDays} onChange={e => set('retentionDays', e.target.value)} className={styles.select}>
                    <option value="30">30 días</option>
                    <option value="60">60 días</option>
                    <option value="90">90 días</option>
                    <option value="180">180 días</option>
                    <option value="365">1 año</option>
                  </select>
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'Notificaciones' && (
            <Card className={styles.section}>
              <h3>Notificaciones</h3>
              <div className={styles.settingsList}>
                {[
                  { key: 'emailNotifications', label: 'Notificaciones por email', desc: 'Recibir alertas de nuevos candidatos' },
                  { key: 'weeklyReport', label: 'Reporte semanal', desc: 'Resumen de actividad cada lunes' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className={styles.settingItem}>
                    <div>
                      <div className={styles.settingLabel}>{label}</div>
                      <div className={styles.settingDesc}>{desc}</div>
                    </div>
                    <Toggle value={settings[key]} onChange={() => toggle(key)} />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeSection === 'Integraciones' && (
            <Card className={styles.section}>
              <h3>Integraciones</h3>
              <div className={styles.settingsList}>
                <div className={styles.settingItem}>
                  <div className={styles.integrationInfo}>
                    <span className={styles.integIcon}>🔔</span>
                    <div>
                      <div className={styles.settingLabel}>Slack</div>
                      <div className={styles.settingDesc}>Notificaciones en tiempo real a tu equipo</div>
                    </div>
                  </div>
                  <Toggle value={settings.slackIntegration} onChange={() => toggle('slackIntegration')} />
                </div>
                <div className={styles.integrationItem}>
                  <span className={styles.integIcon}>📊</span>
                  <div>
                    <div className={styles.settingLabel}>Google Sheets</div>
                    <div className={styles.settingDesc}>Exportar datos automáticamente</div>
                  </div>
                  <span className={styles.comingSoon}>Próximamente</span>
                </div>
                <div className={styles.integrationItem}>
                  <span className={styles.integIcon}>💼</span>
                  <div>
                    <div className={styles.settingLabel}>LinkedIn Jobs</div>
                    <div className={styles.settingDesc}>Importar candidatos desde LinkedIn</div>
                  </div>
                  <span className={styles.comingSoon}>Próximamente</span>
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'Apariencia' && (
            <Card className={styles.section}>
              <h3>Apariencia</h3>
              <div className={styles.settingsList}>
                <div className={styles.settingItem}>
                  <div>
                    <div className={styles.settingLabel}>Modo oscuro</div>
                    <div className={styles.settingDesc}>Activar tema oscuro en la interfaz</div>
                  </div>
                  <Toggle value={settings.darkMode} onChange={() => toggle('darkMode')} />
                </div>
                <div className={styles.settingItem}>
                  <div>
                    <div className={styles.settingLabel}>Modo compacto</div>
                    <div className={styles.settingDesc}>Reducir espaciado para ver más contenido</div>
                  </div>
                  <Toggle value={settings.compactMode} onChange={() => toggle('compactMode')} />
                </div>
              </div>
            </Card>
          )}

          <div className={styles.saveRow}>
            <button className={styles.saveBtn} onClick={handleSave}>Guardar configuración</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button
      type="button"
      className={`${styles.toggle} ${value ? styles.on : ''}`}
      onClick={onChange}
      aria-checked={value}
      role="switch"
    >
      <span className={styles.toggleKnob} />
    </button>
  );
}
