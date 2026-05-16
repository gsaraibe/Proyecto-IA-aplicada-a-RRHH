const User = require('../models/User');
const Employee = require('../models/Employee');
const Job = require('../models/Job');
const Candidate = require('../models/Candidate');
const CvAnalysis = require('../models/CvAnalysis');
const OnboardingPlan = require('../models/OnboardingPlan');

const seedDB = async () => {
  try {
    const count = await User.countDocuments();
    if (count > 0) return;

    console.log('🌱 Creando datos de ejemplo para CH Assist...');

    const admin = await User.create({
      name: 'Admin Demo',
      email: 'demo@chassist.com',
      password: 'Demo123!',
      role: 'admin',
      position: 'Gerente de RRHH',
      department: 'Recursos Humanos',
      bio: 'Especialista en gestión del talento y desarrollo organizacional.',
    });

    await Employee.insertMany([
      { firstName: 'Valentina', lastName: 'García', email: 'v.garcia@empresa.com', position: 'Desarrolladora Senior', department: 'Tecnología', status: 'active', startDate: new Date('2022-03-15'), salary: 350000, skills: ['React', 'Node.js', 'MongoDB'] },
      { firstName: 'Martín', lastName: 'López', email: 'm.lopez@empresa.com', position: 'Diseñador UX/UI', department: 'Diseño', status: 'active', startDate: new Date('2021-07-01'), salary: 280000, skills: ['Figma', 'Adobe XD'] },
      { firstName: 'Sofía', lastName: 'Rodríguez', email: 's.rodriguez@empresa.com', position: 'Gerente de Marketing', department: 'Marketing', status: 'active', startDate: new Date('2020-01-10'), salary: 420000, skills: ['Marketing Digital', 'Google Ads'] },
      { firstName: 'Lucas', lastName: 'Méndez', email: 'l.mendez@empresa.com', position: 'Analista Financiero', department: 'Finanzas', status: 'active', startDate: new Date('2023-02-20'), salary: 310000, skills: ['Excel', 'SAP', 'Power BI'] },
      { firstName: 'Camila', lastName: 'Torres', email: 'c.torres@empresa.com', position: 'Coordinadora de Ventas', department: 'Ventas', status: 'vacation', startDate: new Date('2021-11-05'), salary: 295000, skills: ['CRM', 'Salesforce'] },
      { firstName: 'Nicolás', lastName: 'Fernández', email: 'n.fernandez@empresa.com', position: 'DevOps Engineer', department: 'Tecnología', status: 'active', startDate: new Date('2022-08-15'), salary: 380000, skills: ['Docker', 'Kubernetes', 'AWS'] },
    ]);

    const jobs = await Job.insertMany([
      { title: 'Desarrollador Full Stack Senior', department: 'Tecnología', description: 'Buscamos un desarrollador full stack con experiencia en React y Node.js.', requirements: ['5+ años', 'React y Node.js', 'MongoDB'], location: 'Buenos Aires (Híbrido)', type: 'hybrid', salaryMin: 400000, salaryMax: 600000, status: 'open', applicants: 12, createdBy: admin._id },
      { title: 'Diseñador UX/UI Junior', department: 'Diseño', description: 'Oportunidad para diseñadores junior con ganas de crecer.', requirements: ['1-2 años', 'Figma avanzado', 'Portfolio sólido'], location: 'Remoto', type: 'remote', salaryMin: 180000, salaryMax: 280000, status: 'open', applicants: 28, createdBy: admin._id },
      { title: 'Gerente de Marketing Digital', department: 'Marketing', description: 'Liderá el equipo de marketing digital.', requirements: ['7+ años', 'Gestión de equipos', 'Google Ads'], location: 'Buenos Aires', type: 'full-time', salaryMin: 500000, salaryMax: 750000, status: 'open', applicants: 7, createdBy: admin._id },
    ]);

    await Candidate.insertMany([
      { firstName: 'Agustín', lastName: 'Pereyra', email: 'agustin.pereyra@gmail.com', jobId: jobs[0]._id, jobTitle: 'Desarrollador Full Stack Senior', status: 'interview', score: 87, skills: ['React', 'Node.js'], source: 'linkedin' },
      { firstName: 'Florencia', lastName: 'Vidal', email: 'florencia.vidal@gmail.com', jobId: jobs[1]._id, jobTitle: 'Diseñador UX/UI Junior', status: 'screening', score: 72, skills: ['Figma'], source: 'referido' },
      { firstName: 'Julieta', lastName: 'Núñez', email: 'julieta.nunez@gmail.com', jobId: jobs[2]._id, jobTitle: 'Gerente de Marketing Digital', status: 'offer', score: 94, skills: ['Marketing Digital', 'Google Ads'], source: 'linkedin' },
    ]);

    // Sample CV analyses for the dashboard
    await CvAnalysis.insertMany([
      {
        candidateName: 'A.P. (Candidato 1)',
        jobTitle: 'Desarrollador Full Stack Senior',
        score: 87,
        recommendation: 'Recomendado',
        summary: 'Perfil sólido con 6 años de experiencia en desarrollo full stack. Dominio demostrado de React y Node.js en entornos de startup. Historial de proyectos escalables y trabajo en equipo ágil.',
        skills: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'TypeScript'],
        strengths: ['Experiencia comprobada en React y Node.js (requisito excluyente)', 'Historial de trabajo en equipos ágiles', 'Proyectos de alta escala documentados en portfolio'],
        gaps: ['Sin experiencia explícita en MongoDB', 'Inglés no mencionado en el CV'],
        fullAnalysis: 'Análisis de ejemplo. En un análisis real, aquí aparecería el informe completo generado por la IA.',
        analyzedBy: admin._id,
      },
      {
        candidateName: 'F.V. (Candidato 2)',
        jobTitle: 'Diseñador UX/UI Junior',
        score: 72,
        recommendation: 'En revisión',
        summary: 'Diseñadora con 2 años de experiencia y portfolio interesante para su nivel. Dominio de Figma y conocimientos de HTML/CSS. Requiere validación en trabajo con Design Systems.',
        skills: ['Figma', 'Adobe XD', 'HTML/CSS', 'Ilustrator'],
        strengths: ['Portfolio alineado con la vacante', 'Dominio de Figma (herramienta principal)'],
        gaps: ['Experiencia limitada con Design Systems', 'Sin evidencia de trabajo en proyectos de alta complejidad'],
        fullAnalysis: 'Análisis de ejemplo generado para demostración.',
        analyzedBy: admin._id,
      },
      {
        candidateName: 'J.N. (Candidato 3)',
        jobTitle: 'Gerente de Marketing Digital',
        score: 94,
        recommendation: 'Recomendado',
        summary: 'Candidata excepcional con 8 años de trayectoria en marketing digital. Liderazgo comprobado de equipos de alto rendimiento, expertise en Google Ads y Meta. Impacto medible en resultados.',
        skills: ['Google Ads', 'Meta Ads', 'Analytics', 'Liderazgo de equipos', 'SEO', 'Performance Marketing'],
        strengths: ['Cumple todos los requisitos excluyentes', 'Historial de liderazgo de equipos', 'Resultados medibles documentados', 'Inglés avanzado certificado'],
        gaps: ['Salario esperado podría superar el rango definido'],
        fullAnalysis: 'Análisis de ejemplo generado para demostración.',
        analyzedBy: admin._id,
      },
      {
        candidateName: 'T.A. (Candidato 4)',
        jobTitle: 'Diseñador UX/UI Junior',
        score: 38,
        recommendation: 'Descartado',
        summary: 'Perfil con experiencia mínima no alineada con los requerimientos de la vacante. Portfolio insuficiente para el nivel buscado.',
        skills: ['Figma básico', 'Canva'],
        strengths: [],
        gaps: ['Sin cumplimiento de requisitos mínimos', 'Portfolio no alineado con los requerimientos', 'Sin experiencia en herramientas clave'],
        fullAnalysis: 'Análisis de ejemplo generado para demostración.',
        analyzedBy: admin._id,
      },
    ]);

    // Sample onboarding plan
    await OnboardingPlan.create({
      employeeName: 'Valentina Suárez',
      position: 'Desarrolladora Frontend',
      department: 'Tecnología',
      startDate: new Date('2024-02-01'),
      weeks: [
        {
          number: 1,
          title: 'Semana 1 — Integración inicial',
          objective: 'Familiarizarse con el equipo, los procesos y el entorno de trabajo.',
          tasks: [
            { text: 'Reunión de bienvenida con RRHH y firma de documentación', responsible: 'RRHH', completed: true },
            { text: 'Configuración de accesos y herramientas (GitHub, Slack, Jira, Google Workspace)', responsible: 'IT', completed: true },
            { text: 'Presentación con el equipo de Tecnología y reunión con el líder directo', responsible: 'Líder', completed: true },
            { text: 'Lectura de documentación del proyecto y arquitectura del sistema', responsible: 'Equipo', completed: false },
            { text: 'Instalación y configuración del entorno de desarrollo local', responsible: 'IT / Equipo', completed: false },
          ],
          expectedResult: 'La colaboradora tiene accesos, conoce al equipo y entiende el contexto del proyecto.',
        },
        {
          number: 2,
          title: 'Semana 2 — Capacitación técnica',
          objective: 'Comprender la arquitectura del sistema y comenzar a trabajar en tareas de baja complejidad.',
          tasks: [
            { text: 'Code review de las últimas pull requests del equipo', responsible: 'Equipo', completed: false },
            { text: 'Resolución de un bug menor asignado como primer tarea', responsible: 'Líder', completed: false },
            { text: 'Sesión de pair programming con un desarrollador senior', responsible: 'Senior Dev', completed: false },
            { text: 'Revisión de estándares y guías de código del proyecto', responsible: 'Equipo', completed: false },
          ],
          expectedResult: 'La colaboradora realizó su primera contribución al codebase de forma autónoma.',
        },
        {
          number: 3,
          title: 'Semana 3 — Integración al flujo de trabajo',
          objective: 'Participar activamente en el ciclo ágil del equipo.',
          tasks: [
            { text: 'Participación en la ceremonia de planning y estimación', responsible: 'Equipo', completed: false },
            { text: 'Tomar al menos 2 user stories del backlog de forma autónoma', responsible: 'Líder', completed: false },
            { text: 'Presentar avances en la demo semanal', responsible: 'Equipo', completed: false },
            { text: 'Reunión de feedback con el líder (30 min)', responsible: 'Líder', completed: false },
          ],
          expectedResult: 'La colaboradora opera dentro del flujo de trabajo ágil del equipo.',
        },
        {
          number: 4,
          title: 'Semana 4 — Autonomía inicial',
          objective: 'Consolidar conocimientos y definir objetivos del primer mes.',
          tasks: [
            { text: 'Entrega de una funcionalidad completa de principio a fin', responsible: 'Equipo', completed: false },
            { text: 'Reunión de cierre de onboarding con RRHH y líder', responsible: 'RRHH / Líder', completed: false },
            { text: 'Definición de objetivos del próximo trimestre', responsible: 'Líder', completed: false },
            { text: 'Encuesta de experiencia de onboarding', responsible: 'RRHH', completed: false },
          ],
          expectedResult: 'La colaboradora opera con autonomía y tiene objetivos claros para el siguiente período.',
        },
      ],
      fullPlan: 'Plan de onboarding de ejemplo generado para demostración. En un plan real, aquí aparecería el informe completo generado por la IA.',
      savedBy: admin._id,
    });

    console.log('✅ Datos de ejemplo creados correctamente.');
    console.log('📧 Usuario demo: demo@chassist.com');
    console.log('🔑 Contraseña:   Demo123!');
  } catch (error) {
    console.error('Error en seeds:', error.message);
  }
};

module.exports = seedDB;
