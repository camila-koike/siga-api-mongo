import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Cria usuários um a um para pegar o id gerado
  const usuariosData = [
    {
      cpf: '11111111111',
      foto: '93b163f73780fecd32914da83a2b4a15.avif',
      email: 'aurelio@gmail.com',
      data_nascimento: new Date('2023-06-14'),
      nome: 'Aurelio Junior',
      senha: '123',
    },
    {
      cpf: '1333123123',
      foto: '8c251fdfa28a245ce68ae6d1531cd260.webp',
      email: 'camilap@gmail.com',
      data_nascimento: new Date('2023-06-14'),
      nome: 'Camila',
      senha: '123',
    },
    {
      cpf: '123312312',
      foto: '2dc85bb4902b6b68dc41d4b80a7addaf.jpg',
      email: 'leandro@gmail.com',
      data_nascimento: new Date('2023-06-15'),
      nome: 'Leandro Steffen',
      senha: '123',
    },
    {
      cpf: '123213123123',
      foto: '5c5b41d23a686f62b030041349c3995f.jpg',
      email: 'ricardo@gmail.com',
      data_nascimento: new Date('2023-06-09'),
      nome: 'Ricardo',
      senha: '123',
    },
    {
      cpf: '12345678911',
      foto: '8adb7c513055483e133039ccc4fc66e0.webp',
      email: 'cat@gmail.com',
      data_nascimento: new Date('2023-10-06'),
      nome: 'cat',
      senha: '123',
    },
  ];

  const usuarios = [];

  for (const userData of usuariosData) {
    const usuario = await prisma.usuario.create({
      data: userData,
    });
    usuarios.push(usuario);
  }

  // Cria professores, associando ao id do usuário correspondente
  const professoresData = [
    { siape: 1, usuarioEmail: 'aurelio@gmail.com' },
    { siape: 2, usuarioEmail: 'camilap@gmail.com' },
    { siape: 3, usuarioEmail: 'leandro@gmail.com' },
    { siape: 4, usuarioEmail: 'ricardo@gmail.com' },
  ];

  for (const prof of professoresData) {
    const usuario = usuarios.find(u => u.email === prof.usuarioEmail);
    const professor = await prisma.professor.create({
      data: {
        siape: prof.siape,
        usuarioId: usuario.id,
      },
    });

    // opcional: atualizar o usuário com reference inversa
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        professorId: professor.id,
      },
    });
  }

  // Cria estudante
  const estudanteUser = usuarios.find(u => u.email === 'cat@gmail.com');

  const estudante = await prisma.estudante.create({
    data: {
      ra: 4,
      usuarioId: estudanteUser.id,
    },
  });

  await prisma.usuario.update({
    where: { id: estudanteUser.id },
    data: {
      estudanteId: estudante.id,
    },
  });

  // Cria disciplinas, associando professores
  const disciplinasData = [
    {
      periodo: 1,
      turno: 'Noturno',
      nome: 'Algoritmos 1',
      qnt_total_aulas: 80,
      carga_horaria: 60,
      curso: 'PROEJA-Informática para Internet',
      professorEmail: 'aurelio@gmail.com',
    },
    {
      periodo: 1,
      turno: 'Noturno',
      nome: 'Projeto e Design',
      qnt_total_aulas: 100,
      carga_horaria: 75,
      curso: 'PROEJA-Informática para Internet',
      professorEmail: 'camilap@gmail.com',
    },
    {
      periodo: 1,
      turno: 'Noturno',
      nome: 'Filosofia 1',
      qnt_total_aulas: 40,
      carga_horaria: 30,
      curso: 'PROEJA-Informática para Internet',
      professorEmail: 'ricardo@gmail.com',
    },
    {
      periodo: 1,
      turno: 'Noturno',
      nome: 'Redes de Computadores',
      qnt_total_aulas: 80,
      carga_horaria: 60,
      curso: 'PROEJA-Informática para Internet',
      professorEmail: 'leandro@gmail.com',
    },
    {
      periodo: 1,
      turno: 'Noturno',
      nome: 'Algoritmos 2',
      qnt_total_aulas: 80,
      carga_horaria: 60,
      curso: 'Licenciatura em Computação',
      professorEmail: 'aurelio@gmail.com',
    },
  ];

  for (const disc of disciplinasData) {
    const usuarioProf = usuarios.find(u => u.email === disc.professorEmail);
    const professor = await prisma.professor.findFirst({
      where: { usuarioId: usuarioProf.id },
    });

    await prisma.disciplina.create({
      data: {
        periodo: disc.periodo,
        turno: disc.turno,
        nome: disc.nome,
        qnt_total_aulas: disc.qnt_total_aulas,
        carga_horaria: disc.carga_horaria,
        curso: disc.curso,
        professorId: professor.id,
      },
    });
  }

  console.log('Dados inseridos com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
