// Catálogo central dos serviços com chaves únicas, rótulos e hrefs padrão
// Admin poderá sobrescrever cada href via PainelAdmin

export const CITY_HALL_BASE_URL = 'https://bomconselho.pe.gov.br/'; // ajuste para domínio real

export const servicesSections = [
  {
    title: 'Acesso Rápido',
    icon: 'globe-outline',
    data: [
      { key: 'site_prefeitura', label: 'Site da Prefeitura', href: CITY_HALL_BASE_URL }
    ],
  },
  {
    title: 'Serviços de arrecadação e tributos',
    icon: 'cash-outline',
    data: [
      { key: 'arrecadacao_guias', label: 'Emissão de guias de pagamento (IPTU, ISS, etc.)', href: '/tributos/guias' },
      { key: 'arrecadacao_codigo', label: 'Consulta ao código tributário municipal', href: '/tributos/codigo' },
      { key: 'nfe', label: 'Nota Fiscal Eletrônica', href: 'https://www.tributosmunicipais.com.br/NFE-bomconselho/' },
      { key: 'contracheque_ativos', label: 'Contracheque Ativos', href: 'contracheque.html' },
      { key: 'contracheque_inativos', label: 'Contracheque Inativos', href: 'contracheque.html' },
    ],
  },
  {
    title: 'Gestão de protocolos e processos',
    icon: 'document-text-outline',
    data: [
      { key: 'protocolos_abertura', label: 'Abertura e acompanhamento de protocolos', href: '/protocolos' },
      { key: 'licitacoes_consulta', label: 'Consulta a processos de licitação', href: '/licitacoes' },
    ],
  },
  {
    title: 'Acesso à informação e transparência',
    icon: 'newspaper-outline',
    data: [
      { key: 'transparencia_portal', label: 'Portal da transparência', href: 'https://router.portaltransparencia.app.br/11285954000104' },
      { key: 'diario_oficial', label: 'Diário oficial e avisos de licitação', href: '/diario-oficial' },
      { key: 'faq_institucional', label: 'Perguntas frequentes institucionais', href: '/faq' },
      { key: 'pesquisa_satisfacao', label: 'Pesquisa de Satisfação', href: 'pesquisa-satisfacao.php' },
    ],
  },
  {
    title: 'Agendamentos e solicitações',
    icon: 'calendar-outline',
    data: [
      { key: 'agendamento_atendimento', label: 'Agendamento de atendimento presencial', href: '/agendamentos/atendimento' },
      { key: 'solicitacao_documentos', label: 'Solicitação de documentos (identidade, certidões)', href: '/solicitacoes/documentos' },
      { key: 'servicos_urbanos', label: 'Serviços urbanos (poda de árvores, tapa-buracos)', href: '/servicos-urbanos' },
      { key: 'agendamentos_eventos', label: 'Agendamento de eventos e ações de cidadania', href: '/agendamentos/eventos' },
    ],
  },
  {
    title: 'Comunicação e cidadania',
    icon: 'people-outline',
    data: [
      { key: 'ouvidoria', label: 'Ouvidoria municipal online', href: '/ouvidoria' },
      { key: 'esic', label: 'Sistema e-SIC (acesso à informação)', href: '/esic' },
      { key: 'consultas_publicas', label: 'Consultas públicas para participação popular', href: '/consultas-publicas' },
      { key: 'webmail', label: 'WebMail', href: 'https://titan.hostgator.com.br/login/' },
    ],
  },
  {
    title: 'Integrações e serviços complementares',
    icon: 'link-outline',
    data: [
      { key: 'integracoes_cidades', label: 'Integração com Cidades GOV.BR', href: 'https://www.gov.br/cidades' },
      { key: 'consignavel', label: 'Sistema de gestão de margem consignável (servidores)', href: '/consignavel' },
      { key: 'imoveis_publicos', label: 'Plataforma de venda de imóveis públicos', href: '/imoveis-publicos' },
      { key: 'funprev', label: 'Fundo de Previdência', href: 'http://funprevbc.pe.gov.br/' },
      { key: 'rendimentos_dirf', label: 'Informe de Rendimentos', href: 'https://www.dataimpress.com.br/bomconselho/dirf2024/' },
    ],
  },
];

export const flattenServiceItems = () => {
  const items = [];
  for (const section of servicesSections) {
    for (const item of section.data) {
      items.push({ ...item, sectionTitle: section.title });
    }
  }
  return items;
};