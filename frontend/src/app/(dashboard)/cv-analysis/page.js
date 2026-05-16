'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { api, triggerDownload } from '@/lib/api';
import {
  Upload, FileText, X, Sparkles, CheckCircle, LayoutDashboard,
  RotateCcw, Download, FileSpreadsheet, AlertCircle, ChevronDown, ChevronUp,
} from 'lucide-react';

const DEFAULT_PROMPT = `Actúa como especialista senior en selección de talento y evaluación objetiva de candidatos con experiencia en screening asistido por IA.

OBJETIVO:
Analizar CVs y compararlos con la descripción de un puesto para evaluar el grado de compatibilidad de cada candidato de forma estructurada, objetiva y basada en evidencia.

PRINCIPIOS DE EVALUACIÓN:
- Analizar únicamente información explícita en el CV y descripción del puesto.
- No asumir conocimientos, experiencia ni certificaciones no mencionadas.
- Mantener consistencia evaluativa entre candidatos.
- Priorizar evidencia verificable sobre inferencias.
- Si existe información ambigua o insuficiente, indicarlo explícitamente.
- Toda evaluación debe ser trazable a evidencia del CV.

CONTROL DE SESGOS:
Ignorar completamente: género, edad, nacionalidad, fotografía, universidad, estado civil, religión, etnia, discapacidad, apariencia física.

CONFIDENCIALIDAD:
- No exponer datos sensibles.
- Utilizar ID o iniciales cuando sea posible.
- Mantener enfoque profesional y objetivo.

HUMAN-IN-THE-LOOP:
- Este sistema apoya la toma de decisiones de RRHH, pero la decisión final siempre corresponde a una persona.

INPUT:
1. Descripción del puesto: requisitos excluyentes, requisitos valorados, habilidades técnicas requeridas, seniority esperado, herramientas requeridas.
2. CVs de candidatos.

METODOLOGÍA DE EVALUACIÓN:
1. Requisitos excluyentes (filtro obligatorio) → Si no cumple: "No cumple requisitos mínimos" pero incluir en el ranking.
2. Requisitos valorados → Asignar puntaje adicional.
3. Habilidades técnicas y experiencia práctica → Evaluar únicamente evidencia concreta.

MODELO DE SCORING:
- Requisitos excluyentes: 60 puntos
- Habilidades técnicas: 25 puntos
- Requisitos valorados: 15 puntos
- TOTAL: 100 puntos

CLASIFICACIÓN FINAL:
- 85 - 100 → Avanza (alto ajuste)
- 70 - 84 → Avanza (ajuste medio)
- 50 - 69 → Considerar
- 0 - 49 → No avanza

REGLAS IMPORTANTES:
- No asumir información faltante.
- Penalizar ausencia de evidencia técnica relevante.
- No interpretar brevedad del CV como falta absoluta de capacidad.
- Indicar cuando la información es insuficiente.
- Priorizar experiencia práctica cuando aplique.
- Aplicar los mismos criterios a todos los candidatos.
- Toda evaluación debe ser explicable, trazable y consistente.

OUTPUT ESPERADO POR CANDIDATO:
1. ID o nombre anonimizado
2. Resultado del filtro excluyente (Cumple / No cumple + explicación)
3. Puntaje desglosado (Excluyentes/60, Técnicas/25, Valorados/15, Total/100)
4. Resumen profesional del perfil
5. Fortalezas principales
6. Riesgos o puntos a validar
7. Justificación basada en evidencia del CV (máximo 5 líneas)
8. Clasificación final (Avanza / Considerar / No avanza)
9. Preguntas sugeridas para entrevista

RANKING FINAL: ordenar todos los candidatos de mayor a menor puntaje.
INCLUIR: candidatos recomendados, comparativa breve entre mejores perfiles, principales motivos de exclusión.

FORMATO: lenguaje profesional, estructura clara, tablas cuando sea útil, objetividad y consistencia.`;

const RECOMMENDATION_CONFIG = {
  'Recomendado': { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  'En revisión': { color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  'Descartado':  { color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
};

function FileDropZone({ label, accept, hint, onFiles, files, multiple = false }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    onFiles(multiple ? dropped : [dropped[0]]);
  };

  const handleChange = (e) => {
    const selected = Array.from(e.target.files);
    onFiles(multiple ? selected : [selected[0]]);
    e.target.value = '';
  };

  const removeFile = (idx) => {
    const next = files.filter((_, i) => i !== idx);
    onFiles(next);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all
          ${dragging ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}
      >
        <Upload size={22} className={`mb-2 ${dragging ? 'text-indigo-500' : 'text-slate-400'}`} />
        <p className="text-sm font-medium text-slate-600 text-center">
          Arrastrá un archivo o <span className="text-indigo-600">hacé clic aquí</span>
        </p>
        <p className="text-xs text-slate-400 mt-1 text-center">{hint}</p>
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} onChange={handleChange} className="hidden" />
      </div>

      {files.length > 0 && (
        <ul className="space-y-1.5">
          {files.map((f, i) => (
            <li key={i} className="flex items-center gap-2.5 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm">
              <FileText size={14} className="text-indigo-500 flex-shrink-0" />
              <span className="flex-1 truncate text-slate-700">{f.name}</span>
              <span className="text-xs text-slate-400 whitespace-nowrap">{(f.size / 1024).toFixed(0)} KB</span>
              <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0">
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ResultCard({ result, onSave, onExportExcel, onExportPdf, saving }) {
  const [showFull, setShowFull] = useState(false);
  const cfg = RECOMMENDATION_CONFIG[result.recommendation] || RECOMMENDATION_CONFIG['En revisión'];
  const scoreColor = result.score >= 70 ? 'text-emerald-600' : result.score >= 50 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="card p-6 space-y-5">
      {/* Name + recommendation */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-lg font-bold text-slate-800">{result.candidateName}</h3>
          {result.jobTitle && <p className="text-sm text-slate-500 mt-0.5">{result.jobTitle}</p>}
        </div>
        <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full border ${cfg.color}`}>
          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
          {result.recommendation}
        </span>
      </div>

      {/* Score */}
      <div>
        <div className="flex items-baseline gap-1 mb-2">
          <span className={`text-4xl font-bold ${scoreColor}`}>{result.score}</span>
          <span className="text-slate-400">/100</span>
          <span className="text-xs text-slate-400 ml-1">Score de compatibilidad</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${result.score >= 70 ? 'bg-emerald-500' : result.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
            style={{ width: `${result.score}%` }}
          />
        </div>
      </div>

      {/* Summary */}
      {result.summary && (
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-1.5">Resumen del perfil</h4>
          <p className="text-sm text-slate-600 leading-relaxed">{result.summary}</p>
        </div>
      )}

      {/* Skills */}
      {result.skills?.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Skills principales</h4>
          <div className="flex flex-wrap gap-1.5">
            {result.skills.map((s, i) => (
              <span key={i} className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full font-medium">{s}</span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Strengths */}
        {result.strengths?.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <CheckCircle size={14} className="text-emerald-500" /> Coincidencias
            </h4>
            <ul className="space-y-1">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                  <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>{s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Gaps */}
        {result.gaps?.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <X size={14} className="text-red-400" /> Gaps / Puntos a validar
            </h4>
            <ul className="space-y-1">
              {result.gaps.map((g, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>{g}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Full analysis toggle */}
      {result.fullAnalysis && (
        <div>
          <button
            onClick={() => setShowFull(!showFull)}
            className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            {showFull ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showFull ? 'Ocultar' : 'Ver'} análisis completo
          </button>
          {showFull && (
            <div className="mt-3 p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 whitespace-pre-wrap leading-relaxed font-mono max-h-80 overflow-y-auto">
              {result.fullAnalysis}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={() => onSave(result)}
          disabled={result._saved || saving}
          className="btn-primary btn-md gap-2"
        >
          {saving ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : result._saved ? (
            <><CheckCircle size={14} /> Guardado</>
          ) : (
            <><CheckCircle size={14} /> Guardar análisis</>
          )}
        </button>
        <button onClick={() => onExportExcel(result)} className="btn-secondary btn-md gap-2">
          <FileSpreadsheet size={14} /> Excel
        </button>
        <button onClick={() => onExportPdf(result)} className="btn-secondary btn-md gap-2">
          <Download size={14} /> PDF
        </button>
      </div>
    </div>
  );
}

export default function CvAnalysisPage() {
  const [cvFiles, setCvFiles] = useState([]);
  const [jobDescFiles, setJobDescFiles] = useState([]);
  const [jobDescText, setJobDescText] = useState('');
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [savingIdx, setSavingIdx] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (cvFiles.length === 0) {
      setError('Debés subir al menos un CV para analizar.');
      return;
    }
    setError('');
    setAnalyzing(true);
    setResults([]);

    try {
      const formData = new FormData();
      cvFiles.forEach((f) => formData.append('cvFiles', f));
      if (jobDescFiles.length > 0) formData.append('jobDescFile', jobDescFiles[0]);
      formData.append('prompt', prompt);
      formData.append('jobDescText', jobDescText);

      const { results: data } = await api.upload('/ai/analyze-cv', formData);
      setResults(data.map((r) => ({ ...r, _saved: false })));
    } catch (err) {
      setError(err.message || 'Error al analizar. Verificá la configuración de la API Key en Ajustes.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async (result) => {
    const idx = results.findIndex((r) => r.candidateName === result.candidateName && r.score === result.score);
    setSavingIdx(idx);
    try {
      await api.post('/analyses', result);
      setResults((prev) => prev.map((r, i) => i === idx ? { ...r, _saved: true } : r));
    } catch (err) {
      setError('Error al guardar: ' + err.message);
    } finally {
      setSavingIdx(null);
    }
  };

  const handleExportExcel = async (result) => {
    try {
      const blob = await api.download('/analyses/export/excel', 'POST', { analyses: [result] });
      triggerDownload(blob, `analisis-${(result.candidateName || 'cv').replace(/\s+/g, '-')}.xlsx`);
    } catch (err) {
      setError('Error al exportar Excel: ' + err.message);
    }
  };

  const handleExportPdf = async (result) => {
    try {
      const blob = await api.download('/analyses/export/pdf', 'POST', { analysis: result });
      triggerDownload(blob, `analisis-${(result.candidateName || 'cv').replace(/\s+/g, '-')}.pdf`);
    } catch (err) {
      setError('Error al exportar PDF: ' + err.message);
    }
  };

  const handleReset = () => {
    setCvFiles([]);
    setJobDescFiles([]);
    setJobDescText('');
    setPrompt(DEFAULT_PROMPT);
    setResults([]);
    setError('');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Análisis de CVs</h1>
          <p className="text-slate-500 text-sm mt-0.5">Subí CVs y una descripción del puesto para obtener un análisis objetivo generado por IA.</p>
        </div>
        <Link href="/cv-dashboard" className="btn-secondary btn-md gap-2">
          <LayoutDashboard size={14} /> Ver Dashboard
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleAnalyze} className="card p-6 space-y-6">
        <FileDropZone
          label="CV(s) del candidato"
          accept=".pdf,.docx,.zip"
          hint="PDF, DOCX o ZIP con múltiples CVs (máx. 20 archivos, 30 MB total)"
          onFiles={setCvFiles}
          files={cvFiles}
          multiple
        />

        <div className="space-y-2">
          <FileDropZone
            label="Descripción del puesto"
            accept=".pdf,.docx"
            hint="PDF o DOCX con la descripción del rol, requisitos y tareas"
            onFiles={setJobDescFiles}
            files={jobDescFiles}
          />
          {jobDescFiles.length === 0 && (
            <div>
              <p className="text-xs text-slate-400 mb-1.5">O escribí la descripción directamente:</p>
              <textarea
                value={jobDescText}
                onChange={(e) => setJobDescText(e.target.value)}
                placeholder="Describí el puesto, requisitos, responsabilidades y habilidades requeridas..."
                className="input-base min-h-[80px] resize-y text-sm"
              />
            </div>
          )}
        </div>

        {/* Prompt */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <Sparkles size={14} className="text-indigo-500" />
            ¿Qué querés que analice la IA?
          </label>
          <p className="text-xs text-slate-400">Este prompt guía el análisis. Podés editarlo o dejarlo como está.</p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="input-base min-h-[180px] resize-y text-xs font-mono leading-relaxed"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={analyzing || cvFiles.length === 0}
            className="btn-primary btn-lg gap-2 flex-1"
          >
            {analyzing ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analizando con IA...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Analizar con IA
              </>
            )}
          </button>
          {(results.length > 0 || cvFiles.length > 0) && (
            <button type="button" onClick={handleReset} className="btn-secondary btn-lg gap-2">
              <RotateCcw size={16} /> Nuevo análisis
            </button>
          )}
        </div>
      </form>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">
              Resultados del análisis ({results.length} candidato{results.length !== 1 ? 's' : ''})
            </h2>
            {results.length > 1 && (
              <button
                onClick={async () => {
                  try {
                    const blob = await api.download('/analyses/export/excel', 'POST', { analyses: results });
                    triggerDownload(blob, 'analisis-candidatos.xlsx');
                  } catch (err) { setError('Error al exportar: ' + err.message); }
                }}
                className="btn-secondary btn-md gap-2"
              >
                <FileSpreadsheet size={14} /> Exportar todos (Excel)
              </button>
            )}
          </div>

          {results.map((result, idx) => (
            <ResultCard
              key={idx}
              result={result}
              onSave={handleSave}
              onExportExcel={handleExportExcel}
              onExportPdf={handleExportPdf}
              saving={savingIdx === idx}
            />
          ))}
        </div>
      )}
    </div>
  );
}
