export interface Projeto {
  nome: string
  descricao: string
  tecnologias: string[]
  // Repositórios privados não têm link público
  github?: string
  deploy: string
  destaque: boolean
}

export const PROJETOS: Projeto[] = [
  {
    nome: 'OPI-RJ',
    descricao: 'Portal do Observatório da Pessoa Idosa do Rio de Janeiro. Mapa coroplético dos 92 municípios, painel de indicadores por município, comparador lado a lado, dados abertos com export CSV/JSON e foco em acessibilidade — tudo lido ao vivo da OPI API.',
    tecnologias: ['React', 'TypeScript', 'Vite', 'Leaflet', 'SVG Charts', 'Acessibilidade'],
    deploy: 'https://opi-rj.os.eti.br',
    destaque: true
  },
  {
    nome: 'OPI API',
    descricao: 'API REST que consolida, versiona e serve os indicadores da população idosa dos 92 municípios do RJ. Coletores agendados no GitHub Actions (IBGE, CAGED, ISP, TSE…), cache com fallback e snapshots versionados.',
    tecnologias: ['Python', 'FastAPI', 'PostgreSQL', 'GitHub Actions', 'ETL'],
    deploy: 'https://opi-api.os.eti.br',
    destaque: true
  },
  {
    nome: 'SIME',
    descricao: 'Sistema de Informações e Monitoramento sobre o Envelhecimento, desenvolvido para a SEIJES-RJ. Dashboard com mapa interativo e gráficos alimentado por um pipeline de dados em Python que consolida planilhas oficiais.',
    tecnologias: ['Angular 21', 'Signals', 'ApexCharts', 'Leaflet', 'Python'],
    deploy: 'https://sime.os.eti.br',
    destaque: true
  },
  {
    nome: 'Vibe Coding',
    descricao: 'Plataforma educacional premium desenvolvida com Angular 18+, focada em performance zoneless, reatividade com Signals e fluxo de trabalho assistido por IA.',
    tecnologias: ['Angular 18+', 'Signals', 'Zoneless', 'IA Assisted', 'TypeScript'],
    github: 'https://github.com/marcosgmrs/vibecoding',
    deploy: 'https://vibecoding.os.eti.br',
    destaque: true
  },
  {
    nome: 'aprenda-angular',
    descricao: 'Aplicação Angular completa, com finalidade educacional, reproduzindo de forma didática minha rotina de estudos.',
    tecnologias: ['Angular 18', 'TypeScript', 'Signals', 'Breadcrumbs'],
    github: 'https://github.com/marcosgmrs/aprenda-angular',
    deploy: 'https://aprenda-angular.os.eti.br',
    destaque: true
  },
  {
    nome: 'meu-app-angular',
    descricao: 'Aplicação Angular completa com autenticação, rotas protegidas por guards, consumo de API REST, formulários reativos e dashboard de perfil com dados reais do GitHub.',
    tecnologias: ['Angular 18', 'TypeScript', 'RxJS', 'GitHub API'],
    github: 'https://github.com/marcosgmrs/estudos-angular',
    deploy: 'https://meu-app-angular.os.eti.br',
    destaque: true
  },
  {
    nome: 'mineralogia',
    descricao: 'Catálogo satírico de minerais comparando propriedades científicas com promessas esotéricas. Inclui quiz interativo e página de detalhe com revelação progressiva.',
    tecnologias: ['Angular 21', 'TypeScript', 'CSS', 'Vercel'],
    github: 'https://github.com/marcosgmrs/mineralogia',
    deploy: 'https://mineralogia.os.eti.br',
    destaque: true
  }
]
