'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import {
  Upload, FileText, ChevronLeft, Loader2, CheckCircle2,
  XCircle, Download, RotateCcw, Save,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const scoreColor = (s) => {
  if (s >= 75) return 'text-emerald-600';
  if (s >= 50) return 'text-amber-600';
  return 'text-red-500';
};

const scoreBarColor = (s) => {
  if (s >= 75) return 'bg-emerald-500';
  if (s >= 50) return 'bg-amber-500';
  return 'bg-red-500';
};

function ResultCard({ result, onSave, saved }) {
  return (
    <div className="card p-6 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">{result.nombre}</h3>
          <p className="text-sm text-slate-500 mt-1">{result.resumen}</p>
        </div>
        <Badge status={result.recomendacion} className="flex-shrink-0 mt-1" />
      </div>

      {/* Score */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Score de compatibilidad</p>
          <span className={`text-lg font-bold ${scoreColor(result.score)}`}>{result.score}/100</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${scoreBarColor(result.score)}`}
            style={{ width: `${result.score}%` }}
          />
        </div>
      </div>

      {/* Skills */}
      {result.skills?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Habilidades</p>
          <div className="flex flex-wrap gap-1.5">
            {result.skills.map((s, i) => (
              <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Coincidencias / Gaps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {result.coincidencias?.length > 0 && (
          <div className="bg-emerald-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">Coincidencias</p>
            <ul className="space-y-1.5">
              {result.coincidencias.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-emerald-800">
                  <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-emerald-600" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {result.gaps?.length > 0 && (
          <div className="bg-red-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-2">Gaps</p>
            <ul className="space-y-1.5">
              {result.gaps.map((g, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-800">
                  <XCircle size={14} className="mt-0.5 flex-shrink-0 text-red-500" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-1">
        <Button
          onClick={() => onSave(result)}
          disabled={saved}
          className="btn-md"
          variant={saved ? 'secondary' : 'primary'}
        >
          {saved ? (
            <><CheckCircle2 size={15} /> Guardado</>
          ) : (
            <><Save size={15} /> Guardar</>
          )}
        </Button>
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [feedback, setFeedback] = useState(null);
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) return setFeedback({ type: 'error', msg: 'Seleccioná un archivo primero.' });
    if (!jobDescription.trim()) return setFeedback({ type: 'error', msg: 'Ingresá la descripción del puesto.' });

    setLoading(true);
    setFeedback(null);
    setResults([]);
    setSavedIds(new Set());

    try {
      const formData = new FormData();
      formData.append('cv', file);
      formData.append('jobDescription', jobDescription);

      const response = await fetch(`${API_URL}/hr-intelligence/analyze`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Error ${response.status}`);

      setResults(data.results || []);
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message || 'Error al analizar el CV.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (result, index) => {
    try {
      await api.post('/hr-intelligence/save', { ...result, jobDescription });
      setSavedIds((prev) => new Set([...prev, index]));
      setFeedback({ type: 'success', msg: `Análisis de ${result.nombre} guardado.` });
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message || 'Error al guardar.' });
    }
  };

  const handleExportExcel = async () => {
    if (results.length === 0) return;
    const XLSX = (await import('xlsx')).default;
    const rows = results.map((r) => ({
      Nombre: r.nombre,
      Score: r.score,
      Recomendación: r.recomendacion,
      Skills: (r.skills || []).join(', '),
      Coincidencias: (r.coincidencias || []).join('; '),
      Gaps: (r.gaps || []).join('; '),
      Resumen: r.resumen,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Análisis CVs');
    XLSX.writeFile(wb, 'analisis-cvs.xlsx');
  };

  const handleReset = () => {
    setFile(null);
    setResults([]);
    setSavedIds(new Set());
    setFeedback(null);
    setJobDescription('');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="max-w-4xl space-y-5">
      <div className="page-header">
        <div>
          <Link href="/hr-intelligence" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-1 transition-colors">
            <ChevronLeft size={14} /> Volver a Análisis
          </Link>
          <h2 className="page-title">Analizar CV con IA</h2>
        </div>
        {results.length > 0 && (
          <div className="flex gap-2">
            <Button onClick={handleExportExcel} variant="secondary" className="btn-md">
              <Download size={15} /> Exportar Excel
            </Button>
            <Button onClick={() => window.print()} variant="secondary" className="btn-md">
              <Download size={15} /> Exportar PDF
            </Button>
          </div>
        )}
      </div>

      {feedback && <Alert variant={feedback.type} message={feedback.msg} onClose={() => setFeedback(null)} />}

      {results.length === 0 ? (
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* File upload */}
            <div className="card p-6">
              <p className="text-sm font-semibold text-slate-700 mb-3">CV del candidato</p>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
                  ${file ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
              >
                {file ? (
                  <div className="space-y-2">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto">
                      <FileText size={20} className="text-indigo-600" />
                    </div>
                    <p className="text-sm font-medium text-indigo-700">{file.name}</p>
                    <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB</p>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFile(null); if (fileRef.current) fileRef.current.value = ''; }}
                      className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                    >
                      Cambiar archivo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mx-auto">
                      <Upload size={20} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Arrastrá o hacé clic para subir</p>
                      <p className="text-xs text-slate-400 mt-1">PDF, Word, JPG, o ZIP con varios CVs</p>
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                onChange={handleFile}
              />
            </div>

            {/* Job description */}
            <div className="card p-6">
              <p className="text-sm font-semibold text-slate-700 mb-3">Descripción del puesto</p>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Describí el puesto, los requisitos y las responsabilidades del rol..."
                rows={10}
                className="input-base resize-none text-sm h-[calc(100%-2rem)]"
                style={{ minHeight: '200px' }}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button type="submit" loading={loading} className="btn-lg px-10">
              {loading ? 'Analizando con IA...' : 'Analizar con IA'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
            </p>
            <Button onClick={handleReset} variant="secondary" className="btn-md">
              <RotateCcw size={15} /> Nuevo análisis
            </Button>
          </div>
          {results.map((r, i) => (
            <ResultCard
              key={i}
              result={r}
              onSave={(result) => handleSave(result, i)}
              saved={savedIds.has(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
