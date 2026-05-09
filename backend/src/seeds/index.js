const User = require('../models/User');
const Employee = require('../models/Employee');
const Job = require('../models/Job');
const Candidate = require('../models/Candidate');

const seedDB = async () => {
  try {
    const count = await User.countDocuments();
    if (count > 0) return;

    console.log('🌱 Creando datos de ejemplo...');

    const admin = await User.create({
      name: 'Admin Demo',
      email: 'demo@talentai.com',
      password: 'Demo123!',
      role: 'admin',
      position: 'Gerente de RRHH',
      department: 'Recursos Humanos',
      bio: 'Especialista en gestión del talento y desarrollo organizacional con más de 10 años de experiencia.',
    });

    await Employee.insertMany([
      {
        firstName: 'Valentina', lastName: 'García',
        email: 'v.garcia@empresa.com', phone: '+54 11 4567-8901',
        position: 'Desarrolladora Senior', department: 'Tecnología',
        status: 'active', startDate: new Date('2022-03-15'), salary: 350000,
        location: 'Buenos Aires', skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
        manager: 'Carlos Romero',
      },
      {
        firstName: 'Martín', lastName: 'López',
        email: 'm.lopez@empresa.com', phone: '+54 11 4567-8902',
        position: 'Diseñador UX/UI', department: 'Diseño',
        status: 'active', startDate: new Date('2021-07-01'), salary: 280000,
        location: 'Rosario', skills: ['Figma', 'Adobe XD', 'Sketch', 'Illustrator'],
        manager: 'Ana Martínez',
      },
      {
        firstName: 'Sofía', lastName: 'Rodríguez',
        email: 's.rodriguez@empresa.com', phone: '+54 11 4567-8903',
        position: 'Gerente de Marketing', department: 'Marketing',
        status: 'active', startDate: new Date('2020-01-10'), salary: 420000,
        location: 'Buenos Aires', skills: ['Marketing Digital', 'Google Ads', 'Analytics', 'SEO'],
        manager: 'Roberto Fernández',
      },
      {
        firstName: 'Lucas', lastName: 'Méndez',
        email: 'l.mendez@empresa.com', phone: '+54 11 4567-8904',
        position: 'Analista Financiero', department: 'Finanzas',
        status: 'active', startDate: new Date('2023-02-20'), salary: 310000,
        location: 'Córdoba', skills: ['Excel', 'SAP', 'Power BI', 'SQL'],
        manager: 'Patricia Suárez',
      },
      {
        firstName: 'Camila', lastName: 'Torres',
        email: 'c.torres@empresa.com', phone: '+54 11 4567-8905',
        position: 'Coordinadora de Ventas', department: 'Ventas',
        status: 'vacation', startDate: new Date('2021-11-05'), salary: 295000,
        location: 'Buenos Aires', skills: ['CRM', 'Negociación', 'Salesforce'],
        manager: 'Diego Herrera',
      },
      {
        firstName: 'Nicolás', lastName: 'Fernández',
        email: 'n.fernandez@empresa.com', phone: '+54 11 4567-8906',
        position: 'DevOps Engineer', department: 'Tecnología',
        status: 'active', startDate: new Date('2022-08-15'), salary: 380000,
        location: 'Mendoza', skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
        manager: 'Carlos Romero',
      },
      {
        firstName: 'Isabella', lastName: 'Morales',
        email: 'i.morales@empresa.com', phone: '+54 11 4567-8907',
        position: 'Product Manager', department: 'Producto',
        status: 'active', startDate: new Date('2020-06-01'), salary: 450000,
        location: 'Buenos Aires', skills: ['Agile', 'Scrum', 'Jira', 'Product Strategy'],
        manager: 'Roberto Fernández',
      },
      {
        firstName: 'Alejandro', lastName: 'Castro',
        email: 'a.castro@empresa.com', phone: '+54 11 4567-8908',
        position: 'Analista de RRHH', department: 'Recursos Humanos',
        status: 'inactive', startDate: new Date('2019-09-01'), salary: 240000,
        location: 'Buenos Aires', skills: ['Recruitment', 'HR Analytics', 'Payroll'],
        manager: 'Admin Demo',
      },
    ]);

    const jobs = await Job.insertMany([
      {
        title: 'Desarrollador Full Stack Senior',
        department: 'Tecnología',
        description: 'Buscamos un desarrollador full stack con experiencia en React y Node.js para unirse a nuestro equipo de tecnología. Trabajarás en proyectos de alto impacto con tecnologías modernas en un entorno ágil y colaborativo.',
        requirements: ['5+ años de experiencia', 'React y Node.js avanzado', 'MongoDB o PostgreSQL', 'Trabajo en equipo', 'Inglés intermedio'],
        location: 'Buenos Aires (Híbrido)', type: 'hybrid',
        salaryMin: 400000, salaryMax: 600000,
        status: 'open', applicants: 12, createdBy: admin._id,
      },
      {
        title: 'Diseñador UX/UI Junior',
        department: 'Diseño',
        description: 'Oportunidad para diseñadores junior con ganas de crecer. Trabajarás en el equipo de diseño creando experiencias digitales para miles de usuarios.',
        requirements: ['1-2 años de experiencia', 'Figma avanzado', 'Portfolio sólido', 'Conocimiento de Design Systems'],
        location: 'Remoto', type: 'remote',
        salaryMin: 180000, salaryMax: 280000,
        status: 'open', applicants: 28, createdBy: admin._id,
      },
      {
        title: 'Gerente de Marketing Digital',
        department: 'Marketing',
        description: 'Liderá el equipo de marketing digital y llevá nuestra estrategia de adquisición al siguiente nivel. Rol estratégico con alto impacto en el negocio.',
        requirements: ['7+ años en marketing digital', 'Gestión de equipos', 'Google Ads y Meta Ads', 'Inglés avanzado'],
        location: 'Buenos Aires', type: 'full-time',
        salaryMin: 500000, salaryMax: 750000,
        status: 'open', applicants: 7, createdBy: admin._id,
      },
      {
        title: 'Analista de Datos - BI',
        department: 'Tecnología',
        description: 'Buscamos un analista de datos para trabajar con grandes volúmenes de información y generar insights estratégicos.',
        requirements: ['SQL avanzado', 'Power BI o Tableau', 'Python para análisis', 'Estadística básica'],
        location: 'Córdoba (Híbrido)', type: 'hybrid',
        salaryMin: 320000, salaryMax: 450000,
        status: 'draft', applicants: 0, createdBy: admin._id,
      },
    ]);

    await Candidate.insertMany([
      {
        firstName: 'Agustín', lastName: 'Pereyra',
        email: 'agustin.pereyra@gmail.com', phone: '+54 11 5678-1234',
        jobId: jobs[0]._id, jobTitle: 'Desarrollador Full Stack Senior',
        status: 'interview', score: 87, experience: 6,
        skills: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
        source: 'linkedin', notes: 'Candidato muy sólido. Tiene experiencia en startups.',
      },
      {
        firstName: 'Florencia', lastName: 'Vidal',
        email: 'florencia.vidal@gmail.com', phone: '+54 11 5678-2345',
        jobId: jobs[1]._id, jobTitle: 'Diseñador UX/UI Junior',
        status: 'screening', score: 72, experience: 2,
        skills: ['Figma', 'Adobe XD', 'HTML/CSS'],
        source: 'referido', notes: 'Referida por Martín López. Portfolio interesante.',
      },
      {
        firstName: 'Ramiro', lastName: 'Sosa',
        email: 'ramiro.sosa@gmail.com', phone: '+54 11 5678-3456',
        jobId: jobs[0]._id, jobTitle: 'Desarrollador Full Stack Senior',
        status: 'new', score: 65, experience: 4,
        skills: ['Vue.js', 'PHP', 'MySQL'],
        source: 'web', notes: '',
      },
      {
        firstName: 'Julieta', lastName: 'Núñez',
        email: 'julieta.nunez@gmail.com', phone: '+54 11 5678-4567',
        jobId: jobs[2]._id, jobTitle: 'Gerente de Marketing Digital',
        status: 'offer', score: 94, experience: 8,
        skills: ['Marketing Digital', 'Google Ads', 'Análisis de datos', 'Liderazgo'],
        source: 'linkedin', notes: 'Candidata excepcional. Enviando oferta esta semana.',
      },
      {
        firstName: 'Tomás', lastName: 'Aguirre',
        email: 'tomas.aguirre@gmail.com', phone: '+54 11 5678-5678',
        jobId: jobs[1]._id, jobTitle: 'Diseñador UX/UI Junior',
        status: 'rejected', score: 45, experience: 0,
        skills: ['Figma básico'],
        source: 'portal', notes: 'Portfolio no alineado con los requerimientos del puesto.',
      },
      {
        firstName: 'Micaela', lastName: 'Blanco',
        email: 'micaela.blanco@gmail.com', phone: '+54 11 5678-6789',
        jobId: jobs[0]._id, jobTitle: 'Desarrollador Full Stack Senior',
        status: 'hired', score: 96, experience: 7,
        skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'TypeScript'],
        source: 'linkedin', notes: 'Contratada. Incorporación el próximo lunes.',
      },
      {
        firstName: 'Sebastián', lastName: 'Romero',
        email: 'sebastian.romero@gmail.com', phone: '+54 11 5678-7890',
        jobId: jobs[2]._id, jobTitle: 'Gerente de Marketing Digital',
        status: 'interview', score: 81, experience: 9,
        skills: ['Performance Marketing', 'Analytics', 'Team Management'],
        source: 'referido', notes: 'Segunda entrevista agendada para el viernes.',
      },
      {
        firstName: 'Natalia', lastName: 'Paz',
        email: 'natalia.paz@gmail.com', phone: '+54 11 5678-8901',
        jobId: jobs[1]._id, jobTitle: 'Diseñador UX/UI Junior',
        status: 'screening', score: 68, experience: 1,
        skills: ['Figma', 'Illustrator', 'Design Thinking'],
        source: 'web', notes: 'Portfolio prometedor para su nivel de experiencia.',
      },
    ]);

    console.log('✅ Datos de ejemplo creados correctamente.');
    console.log('📧 Usuario demo: demo@talentai.com');
    console.log('🔑 Contraseña:   Demo123!');
  } catch (error) {
    console.error('Error en seeds:', error.message);
  }
};

module.exports = seedDB;
