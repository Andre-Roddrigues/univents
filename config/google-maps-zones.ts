export const deliveryPolygon = [
  { lat: -25.9224943, lng: 32.6247421 },
  { lat: -25.9336028, lng: 32.5793338 },
  { lat: -25.9344646, lng: 32.550558 },
  { lat: -25.9458648, lng: 32.5386251 },
  { lat: -25.9650448, lng: 32.5588944 },
  { lat: -25.9700905, lng: 32.5663449 },
  { lat: -25.9807145, lng: 32.5805711 },
  { lat: -25.978316, lng: 32.5956998 },
  { lat: -25.9259849, lng: 32.6369274 },
  { lat: -25.9224573, lng: 32.6250233 },
  { lat: -25.9224943, lng: 32.6247421 },
];
const deliveryCircle2 = [
  { lat: -25.94345165512911, lng: 32.541192626107375 }, // Brigada Montada
  { lat: -25.947743323295008, lng: 32.54517965620015 }, //Hospital geral josé macamo
  { lat: -25.934, lng: 32.612 }, // Costa do Sol
  { lat: -25.938, lng: 32.61 }, // Viragem
  { lat: -25.942, lng: 32.608 }, // Direção Praça dos Heróis
  { lat: -25.948, lng: 32.598 }, // Chegando à Praça
  { lat: -25.9553, lng: 32.5892 }, // Praça dos Heróis
  { lat: -25.958, lng: 32.595 }, // Avenida Samora Machel
  { lat: -25.962, lng: 32.598 }, // Praça Filipe Samuel Magaia
  { lat: -25.96, lng: 32.605 }, // Avenida Julius Nyerere
  { lat: -25.955, lng: 32.607 }, // Continuando
  { lat: -25.95, lng: 32.608 }, // Direção UP
  { lat: -25.945, lng: 32.606 }, // Próximo à UP
  { lat: -25.94, lng: 32.602 }, // Descendo para baixa
  { lat: -25.945, lng: 32.59 }, // Baixa da Cidade (Norte)
  { lat: -25.95, lng: 32.585 }, // Baixa da Cidade (Centro)
  { lat: -25.958, lng: 32.588 }, // Baixa da Cidade
  { lat: -25.965, lng: 32.585 }, // Baixa da Cidade (Sul)
  { lat: -25.968, lng: 32.575 }, // Porto de Maputo
  { lat: -25.965, lng: 32.582 }, // Avenida Marginal (Sul)
  { lat: -25.96, lng: 32.59 }, // Subindo Marginal
  { lat: -25.955, lng: 32.595 }, // Continuando
  { lat: -25.95, lng: 32.598 }, // Marginal
  { lat: -25.945, lng: 32.6 }, // Marginal
  { lat: -25.94, lng: 32.595 }, // Avenida Marginal (Retorno)
  { lat: -25.935, lng: 32.6 }, // Marginal Norte
  { lat: -25.93, lng: 32.603 }, // Marginal Norte
  { lat: -25.928, lng: 32.605 }, // Volta ao início
];

export const deliveryBoundaryPoints = [
  // 🏛️ Locais históricos e culturais
  { name: "Praça dos Heróis", lat: -25.9336, lng: 32.5793 },
  { name: "Estação Central (CFM)", lat: -25.96, lng: 32.58 },
  { name: "Museu de História Natural", lat: -25.9654, lng: 32.5899 },
  { name: "Fortaleza de Maputo", lat: -25.9653, lng: 32.5747 },

  // 🏫 Universidades e escolas
  { name: "Universidade Pedagógica", lat: -25.932, lng: 32.608 },
  { name: "Universidade Eduardo Mondlane", lat: -25.9642, lng: 32.5809 },
  { name: "Escola Secundária Josina Machel", lat: -25.9548, lng: 32.6002 },
  { name: "Escola Secundária Francisco Manyanga", lat: -25.9486, lng: 32.5725 },

  // 🏥 Hospitais e centros de saúde
  { name: "Hospital Central de Maputo", lat: -25.9655, lng: 32.5868 },
  { name: "Clínica Cruz Azul", lat: -25.9371, lng: 32.5913 },

  // 🛍️ Zonas comerciais
  { name: "Mercado Central", lat: -25.958, lng: 32.592 },
  { name: "Shopping 24", lat: -25.9575, lng: 32.6058 },
  { name: "Centro Comercial Maputo", lat: -25.9561, lng: 32.586 },
  { name: "Shoprite Baixa", lat: -25.9627, lng: 32.5783 },

  // 🍔 Restaurantes, lanchonetes, cafés
  { name: "SALT (Av. Joaquim Chissano)", lat: -25.9783, lng: 32.5957 },
  { name: "Padaria do Bairro", lat: -25.9551, lng: 32.5942 },
  { name: "KFC Baixa", lat: -25.9622, lng: 32.5788 },
  { name: "Pastelaria Cristal", lat: -25.9574, lng: 32.5847 },
  { name: "Restaurante Costa do Sol (centro)", lat: -25.9633, lng: 32.5909 },
  { name: "Taverna", lat: -25.9648, lng: 32.5901 },
  { name: "Cantina da UP", lat: -25.9323, lng: 32.6082 },
  { name: "Cantina da Josina Machel", lat: -25.9546, lng: 32.5999 },
  { name: "Café Acácia", lat: -25.9618, lng: 32.5855 },
  { name: "Mimmos Pizza Maputo", lat: -25.9625, lng: 32.5862 },
  { name: "Art Café", lat: -25.9637, lng: 32.5894 },
  { name: "Cantinho do Céu", lat: -25.951, lng: 32.5958 },
  { name: "Bar Lounge Palmeiras", lat: -25.9489, lng: 32.5877 },

  { name: "Cemitério de Lhanguene", lat: -25.9534, lng: 32.5786 },
  { name: "Cemitério de Malanga", lat: -25.9625, lng: 32.5681 },
  { name: "Cemitério de Xipamanine", lat: -25.9543, lng: 32.5546 },
  { name: "Cemitério de Michafutene", lat: -25.9005, lng: 32.6239 },
  // 🚏 Terminais e transporte
  { name: "Junta (Praça Filipe Samuel Magaia)", lat: -25.9345, lng: 32.5506 },
  { name: "Terminal Museu", lat: -25.9601, lng: 32.5846 },
  { name: "Terminal Malanga", lat: -25.9604, lng: 32.5671 },

  // 🌆 Cruzamentos e avenidas populares
  {
    name: "Av. Mao Tse Tung x Av. Julius Nyerere",
    lat: -25.9301,
    lng: 32.6057,
  },
  {
    name: "Av. de Angola x Av. de Moçambique (Chamanculo)",
    lat: -25.956,
    lng: 32.5662,
  },
  {
    name: "Av. das FPLM x Av. de Angola (Malanga)",
    lat: -25.961,
    lng: 32.5675,
  },
  {
    name: "Av. Eduardo Mondlane x Av. Acordos de Lusaka",
    lat: -25.9585,
    lng: 32.5921,
  },
  {
    name: "Av. Eduardo Mondlane x Av. 24 de Julho",
    lat: -25.9603,
    lng: 32.5934,
  },
  { name: "Av. Patrice Lumumba", lat: -25.945, lng: 32.585 },
  { name: "Av. Vladimir Lenine", lat: -25.952, lng: 32.588 },
  { name: "Av. Acordos de Lusaka", lat: -25.938, lng: 32.592 },

  // 🧭 Limites e extremos da zona de entrega
  { name: "Zimpeto (limite norte)", lat: -25.9224, lng: 32.6247 },
  { name: "Porto de Maputo", lat: -25.965, lng: 32.575 },
];
