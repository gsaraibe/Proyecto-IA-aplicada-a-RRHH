const User = require('../models/User');
const CV = require('../models/CV');
const HRTest = require('../models/HRTest');
const Metric = require('../models/Metric');

const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) return;

    console.log('Cargando datos de ejemplo...');

    const demoUser = await User.create({
      name: 'Demo Usuario',
      email: 'demo@gestionrh.app',
      password: 'Demo1234',
      role: 'admin',
      department: 'Recursos Humanos',
      phone: '+54 11 1234-5678',
    });

    await User.create([
      { name: 'Ana García', email: 'ana@gestionrh.app', password: 'Pass1234', role: 'manager', department: 'Tecnología' },
      { name: 'Carlos López', email: 'carlos@gestionrh.app', password: 'Pass1234', role: 'recruiter', department: 'Recursos Humanos' },
    ]);

    const cvs = [
      { candidateName: 'Martina Rodríguez', email: 'martina.r@email.com', phone: '+54 11 2345-6789', position: 'Desarrollador Frontend', status: 'approved', score: 87, skills: ['React', 'TypeScript', 'CSS', 'Node.js'], experience: 4, education: 'Ingeniería en Sistemas', summary: 'Desarrolladora con sólida experiencia en React y ecosistema JavaScript moderno.', aiAnalysis: { strengths: ['Excelente dominio de React', 'Experiencia en proyectos escalables', 'Buenas prácticas de código'], weaknesses: ['Poca experiencia en backend', 'Sin experiencia en AWS'], recommendation: 'Candidata recomendada para el puesto. Fuerte perfil técnico frontend.', fitScore: 89 } },
      { candidateName: 'Javier Moreno', email: 'javier.m@email.com', phone: '+54 11 3456-7890', position: 'Desarrollador Backend', status: 'reviewing', score: 74, skills: ['Node.js', 'Python', 'MongoDB', 'Docker'], experience: 3, education: 'Licenciatura en Informática', summary: 'Backend developer con enfoque en APIs RESTful y microservicios.', aiAnalysis: { strengths: ['Buen conocimiento de Node.js', 'Experiencia con Docker', 'Entiende patrones de diseño'], weaknesses: ['Poca experiencia con bases de datos relacionales', 'Sin experiencia en Kubernetes'], recommendation: 'Candidato con potencial. Recomendamos entrevista técnica.', fitScore: 72 } },
      { candidateName: 'Lucía Fernández', email: 'lucia.f@email.com', phone: '+54 11 4567-8901', position: 'Diseñadora UX/UI', status: 'pending', score: 91, skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'], experience: 5, education: 'Diseño Gráfico', summary: 'Diseñadora UX con amplia experiencia en productos digitales y metodologías ágiles.', aiAnalysis: { strengths: ['Portfolio excepcional', 'Conocimiento de accesibilidad', 'Experiencia con sistemas de diseño'], weaknesses: ['Poca experiencia en startups', 'Sin experiencia en AR/VR'], recommendation: 'Candidata altamente recomendada. Top 5% de los perfiles revisados.', fitScore: 93 } },
      { candidateName: 'Santiago Gómez', email: 'santiago.g@email.com', phone: '+54 11 5678-9012', position: 'Data Scientist', status: 'hired', score: 95, skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Power BI'], experience: 6, education: 'Maestría en Ciencia de Datos', summary: 'Data Scientist con especialización en ML y análisis predictivo.', aiAnalysis: { strengths: ['Dominio profundo de ML', 'Experiencia con grandes datasets', 'Habilidades de comunicación'], weaknesses: ['Poca experiencia en producción', 'Sin certificaciones cloud'], recommendation: 'Candidato excepcional. Contratación inmediata recomendada.', fitScore: 96 } },
      { candidateName: 'Valentina Torres', email: 'valentina.t@email.com', phone: '+54 11 6789-0123', position: 'Product Manager', status: 'rejected', score: 58, skills: ['Agile', 'Scrum', 'JIRA', 'Roadmapping'], experience: 2, education: 'Administración de Empresas', summary: 'PM con experiencia en startups tempranas.', aiAnalysis: { strengths: ['Conocimiento de metodologías ágiles', 'Buenas habilidades de comunicación'], weaknesses: ['Poca experiencia técnica', 'Sin track record en productos de escala', 'Gestión de stakeholders limitada'], recommendation: 'No recomendado para el nivel de seniority requerido.', fitScore: 55 } },
      { candidateName: 'Nicolás Herrera', email: 'nicolas.h@email.com', phone: '+54 11 7890-1234', position: 'DevOps Engineer', status: 'approved', score: 82, skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux'], experience: 4, education: 'Ingeniería en Sistemas', summary: 'DevOps especializado en automatización e infraestructura cloud.', aiAnalysis: { strengths: ['Experiencia comprobada en AWS', 'Conocimiento de IaC', 'Seguridad en cloud'], weaknesses: ['Poca experiencia en Azure', 'Sin certificación Kubernetes'], recommendation: 'Candidato recomendado. Fuerte perfil de infraestructura.', fitScore: 83 } },
      { candidateName: 'Camila Ruiz', email: 'camila.r@email.com', phone: '+54 11 8901-2345', position: 'Desarrollador Frontend', status: 'reviewing', score: 79, skills: ['Vue.js', 'JavaScript', 'SCSS', 'Git'], experience: 3, education: 'Ingeniería en Software', summary: 'Frontend developer con experiencia en Vue.js y React.', aiAnalysis: { strengths: ['Buen manejo de CSS avanzado', 'Experiencia con Vue 3', 'Testing con Jest'], weaknesses: ['React con menos profundidad', 'Sin experiencia en mobile'], recommendation: 'Candidata apta. Considerar para equipo de frontend.', fitScore: 78 } },
      { candidateName: 'Diego Martínez', email: 'diego.m@email.com', phone: '+54 11 9012-3456', position: 'Data Scientist', status: 'pending', score: 68, skills: ['Python', 'Pandas', 'Scikit-learn', 'SQL'], experience: 2, education: 'Ingeniería Industrial', summary: 'Junior Data Scientist con base sólida en estadística y ML.', aiAnalysis: { strengths: ['Sólida base matemática', 'Proyectos propios en GitHub', 'Motivado para aprender'], weaknesses: ['Poca experiencia laboral', 'Sin experiencia en producción', 'Desconoce herramientas cloud'], recommendation: 'Perfil junior con potencial. Considerar para posición trainee.', fitScore: 65 } },
    ];

    const createdCVs = await CV.insertMany(cvs.map(cv => ({ ...cv, uploadedBy: demoUser._id })));

    const tests = [
      { candidateName: 'Martina Rodríguez', email: 'martina.r@email.com', testType: 'technical', position: 'Desarrollador Frontend', status: 'completed', score: 88, duration: 90, scheduledAt: new Date('2024-05-10'), completedAt: new Date('2024-05-10'), results: { categories: [{ name: 'JavaScript', score: 92 }, { name: 'React', score: 90 }, { name: 'CSS', score: 85 }, { name: 'TypeScript', score: 84 }], summary: 'Excelente desempeño en prueba técnica.', recommendation: 'Apta para siguiente etapa.' } },
      { candidateName: 'Javier Moreno', email: 'javier.m@email.com', testType: 'personality', position: 'Desarrollador Backend', status: 'completed', score: 76, duration: 45, scheduledAt: new Date('2024-05-12'), completedAt: new Date('2024-05-12'), results: { categories: [{ name: 'Liderazgo', score: 70 }, { name: 'Trabajo en equipo', score: 82 }, { name: 'Gestión del estrés', score: 75 }, { name: 'Comunicación', score: 78 }], summary: 'Perfil colaborativo con buen trabajo en equipo.', recommendation: 'Apto para trabajo en equipo.' } },
      { candidateName: 'Santiago Gómez', email: 'santiago.g@email.com', testType: 'cognitive', position: 'Data Scientist', status: 'completed', score: 96, duration: 60, scheduledAt: new Date('2024-05-08'), completedAt: new Date('2024-05-08'), results: { categories: [{ name: 'Razonamiento lógico', score: 98 }, { name: 'Razonamiento numérico', score: 97 }, { name: 'Resolución de problemas', score: 94 }, { name: 'Pensamiento crítico', score: 96 }], summary: 'Resultado sobresaliente. Top 2% de candidatos evaluados.', recommendation: 'Altamente recomendado.' } },
      { candidateName: 'Lucía Fernández', email: 'lucia.f@email.com', testType: 'leadership', position: 'Diseñadora UX/UI', status: 'scheduled', score: null, duration: 60, scheduledAt: new Date('2024-05-20'), results: { categories: [], summary: '', recommendation: '' } },
      { candidateName: 'Nicolás Herrera', email: 'nicolas.h@email.com', testType: 'technical', position: 'DevOps Engineer', status: 'completed', score: 84, duration: 75, scheduledAt: new Date('2024-05-09'), completedAt: new Date('2024-05-09'), results: { categories: [{ name: 'AWS', score: 88 }, { name: 'Linux', score: 90 }, { name: 'Kubernetes', score: 78 }, { name: 'CI/CD', score: 82 }], summary: 'Buen desempeño técnico en infraestructura.', recommendation: 'Apto para el puesto.' } },
      { candidateName: 'Camila Ruiz', email: 'camila.r@email.com', testType: 'emotional', position: 'Desarrollador Frontend', status: 'in_progress', score: null, duration: 45, scheduledAt: new Date('2024-05-14'), results: { categories: [], summary: '', recommendation: '' } },
      { candidateName: 'Diego Martínez', email: 'diego.m@email.com', testType: 'cognitive', position: 'Data Scientist', status: 'scheduled', score: null, duration: 60, scheduledAt: new Date('2024-05-22'), results: { categories: [], summary: '', recommendation: '' } },
      { candidateName: 'Valentina Torres', email: 'valentina.t@email.com', testType: 'personality', position: 'Product Manager', status: 'completed', score: 62, duration: 45, scheduledAt: new Date('2024-05-07'), completedAt: new Date('2024-05-07'), results: { categories: [{ name: 'Liderazgo', score: 58 }, { name: 'Toma de decisiones', score: 65 }, { name: 'Gestión de conflictos', score: 60 }, { name: 'Visión estratégica', score: 64 }], summary: 'Perfil con áreas de mejora en liderazgo y estrategia.', recommendation: 'No recomendado para el nivel de seniority.' } },
    ];

    await HRTest.insertMany(tests.map(test => ({ ...test, assignedBy: demoUser._id })));

    const months = [
      { month: 'Ene', year: 2024, applicants: 34, hired: 4, rejected: 18, avgTimeToHire: 28, openPositions: 6, testsCompleted: 12 },
      { month: 'Feb', year: 2024, applicants: 41, hired: 5, rejected: 22, avgTimeToHire: 25, openPositions: 7, testsCompleted: 18 },
      { month: 'Mar', year: 2024, applicants: 38, hired: 6, rejected: 19, avgTimeToHire: 22, openPositions: 8, testsCompleted: 15 },
      { month: 'Abr', year: 2024, applicants: 52, hired: 7, rejected: 27, avgTimeToHire: 20, openPositions: 9, testsCompleted: 22 },
      { month: 'May', year: 2024, applicants: 47, hired: 5, rejected: 25, avgTimeToHire: 23, openPositions: 7, testsCompleted: 19 },
      { month: 'Jun', year: 2024, applicants: 63, hired: 9, rejected: 31, avgTimeToHire: 19, openPositions: 10, testsCompleted: 28 },
    ];

    await Metric.insertMany(months);

    console.log('Datos de ejemplo cargados exitosamente.');
  } catch (err) {
    console.error('Error al cargar datos de ejemplo:', err.message);
  }
};

module.exports = seedDatabase;
