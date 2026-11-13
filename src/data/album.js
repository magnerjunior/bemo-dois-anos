export const APP_TITLE = 'Bê & Mô — Dois anos de nós'
export const START_DATE = new Date('2024-11-15T00:00:00-03:00')
export const PAGE_TITLES = [
  'Para meu amor', 'Se eu pudesse escolher', 'Antes mesmo de nós',
  'O dia em que tudo ganhou cor', 'O dia que não terminava', 'Eu te amo',
  'O tempo passou', 'Nossa jornada', 'Nosso mural', 'Por que eu te amo',
  'Cabine de fotos', 'Sorria, meu amor', 'As pequenas coisas', 'Você é luz',
  'Eu escolho ficar', 'Minha escolha', 'Todos os amanhãs', 'Nossa próxima melodia'
]

// Exatamente 24 fotografias originais. A câmera instantânea reaproveita 3 delas.
// O nome de arquivo deve ter esta numeração, com .jpg/.jpeg/.png/.webp.
export const PHOTOS = [
  { id: 1,  name: 'Primeiro encontro / reencontro', label: 'O nosso reencontro', group: 'reencontro' },
  { id: 2,  name: 'Aniversário de 19 anos em Paraopeba', label: 'Meu aniversário', group: 'jornada' },
  { id: 3,  name: 'Primeiro Dia dos Namorados juntos', label: 'Nosso primeiro 12 de junho', group: 'jornada' },
  { id: 4,  name: 'Primeira foto no meu Golzinho', label: 'No meu Golzinho', group: 'jornada' },
  { id: 5,  name: 'Primeira Umadecamp juntos', label: 'Nossa primeira Umadecamp', group: 'jornada' },
  { id: 6,  name: 'Primeira foto no dia 15/11/2025', label: 'Um ano de nós', group: 'jornada' },
  { id: 7,  name: 'Viagem para Jales, São Paulo', label: 'Jales', group: 'jornada' },
  { id: 8,  name: 'Presente do primeiro aniversário de namoro', label: 'Uma lembrança especial', group: 'mural' },
  { id: 9,  name: '23/12/2025, ela de cabelão e ele de barba', label: 'Cabelão e barba', group: 'mural' },
  { id: 10, name: 'Primeira feira de Buritizeiro', label: 'Feira de Buritizeiro', group: 'mural' },
  { id: 11, name: 'Foto juntos em um casamento', label: 'Lado a lado', group: 'mural' },
  { id: 12, name: 'Segunda Umadecamp juntos', label: 'Mais uma Umadecamp', group: 'mural' },
  { id: 13, name: 'Foto de 07/09/2026', label: 'Uma tarde nossa', group: 'mural' },
  { id: 14, name: 'Foto brincando de emo', label: 'Nossa fase emo', group: 'cabine' },
  { id: 15, name: 'Foto pescando juntos', label: 'Nossa pescaria', group: 'cabine' },
  { id: 16, name: 'Foto dela sozinha, esplêndida', label: 'Olha só você', group: 'cabine' },
  { id: 17, name: 'Foto juntos no rio à noite', label: 'Aquela noite', group: 'cabine' },
  { id: 18, name: 'Primeira foto após tirar a barba, só de cavanhaque', label: 'Novo visual', group: 'cabine' },
  { id: 19, name: 'Foto juntos na conveniência', label: 'Nossa conveniência', group: 'cabine' },
  { id: 20, name: 'Casquinhas de baunilha com cobertura de creme de avelã', label: 'Nossa combinação favorita', group: 'detalhes' },
  { id: 21, name: 'Ela sozinha com reflexo de luz que parece coroa', label: 'Minha luz', group: 'luz' },
  { id: 22, name: 'Foto mostrando as alianças', label: 'Nossa promessa', group: 'aliancas' },
  { id: 23, name: 'Última foto juntos na beira do rio', label: 'Todos os amanhãs', group: 'final' },
  { id: 24, name: 'Gabriella tocando flauta', label: 'Sua música', group: 'musica' },
]

export const PHOTO_BY_ID = Object.fromEntries(PHOTOS.map(photo => [photo.id, photo]))
export const JOURNEY_IDS = [2, 3, 4, 5, 6, 7]
export const WALL_IDS = [8, 9, 10, 11, 12, 13]
export const BOOTH_STRIPS = [[14,15,16],[17,18,19]]
export const INSTANT_IDS = [4,11,19] // reutilizadas, sem arquivos adicionais
