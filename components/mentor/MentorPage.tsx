"use client"
import { MentorCard } from '@/components/mentor/MentorCard';
import { MentorFilters, FilterState } from '@/components/mentor/MentorFilters';
import Container from '@/components/Container';
import { Mentor } from '@/types/mentorship';
import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { ViewToggle } from '@/components/mentor/MentorCard';

const mockMentors: Mentor[] = [
  {
    id: '1',
    name: 'Andre RN',
    title: 'Senior Software Engineer',
    company: 'Tech Solutions Mozambique',
    experience: 8,
    rating: 4.9,
    price: 350,
    location: 'Maputo, Matola',
    categories: ['Desenvolvimento Web', 'JavaScript', 'React', 'Node.js'],
    image: '/images/mentorhero.jpg',
    description: 'Especialista em desenvolvimento full-stack com 8 anos de experiência em startups e empresas de tecnologia.',
    availability: ['2025-10-17', '18:00-21:00', '2025-10-18', '18:00-21:00', '2025-10-19', '18:00-21:00'],
    languages: ['Português', 'Inglês'],
    isOnline: true,
    isLocal: true,
    availableSlots: []
  },
  {
    id: '2',
    name: 'Akil Machava',
    title: 'Product Manager',
    company: 'Innovation Labs',
    experience: 6,
    rating: 4.7,
    price: 280,
    location: 'Maputo, Centro',
    categories: ['Gestão de Produto', 'Agile', 'Scrum', 'UX Research'],
    image: '/images/uni(3).jpg',
    description: 'Product Manager com experiência em liderar equipes ágeis e desenvolver produtos digitais de sucesso.',
    availability: ['Segunda a Sexta', '09:00-17:00'],
    languages: ['Português', 'Inglês', 'Xangana'],
    isOnline: false,
    isLocal: true,
    availableSlots: []
  },
  {
    id: '3',
    name: 'Williamo Muhammed',
    title: 'Digital Marketing Specialist',
    company: 'Digital Moçambique',
    experience: 5,
    rating: 4.8,
    price: 220,
    location: 'Beira, Sofala',
    categories: ['Marketing Digital', 'SEO', 'Redes Sociais', 'Google Ads'],
    image: '/images/uni(4).jpg',
    description: 'Especialista em marketing digital com foco em estratégias para o mercado moçambicano.',
    availability: ['Terça a Sábado', '10:00-19:00'],
    languages: ['Português', 'Inglês'],
    isOnline: true,
    isLocal: true,
    availableSlots: []
  },
  {
    id: '4',
    name: 'João Tembe',
    title: 'Data Scientist',
    company: 'Data Analytics Lda',
    experience: 4,
    rating: 4.6,
    price: 320,
    location: 'Maputo, Polana',
    categories: ['Data Science', 'Python', 'Machine Learning', 'SQL'],
    image: '/images/mentorhero.jpg',
    description: 'Cientista de dados com experiência em projetos de análise preditiva e machine learning.',
    availability: ['Segunda a Sexta', '14:00-20:00'],
    languages: ['Português', 'Inglês'],
    isOnline: true,
    isLocal: true,
    availableSlots: []
  },
  {
    id: '5',
    name: 'Sofia Nhampossa',
    title: 'UX/UI Designer',
    company: 'Design Studio',
    experience: 5,
    rating: 4.9,
    price: 270,
    location: 'Nampula',
    categories: ['UX Design', 'UI Design', 'Figma', 'Design Thinking'],
    image: '/images/mentorhero.jpg',
    description: 'Designer especializada em experiência do usuário para aplicações web e mobile.',
    availability: ['Segunda a Sexta', '08:00-16:00'],
    languages: ['Português', 'Inglês', 'Macua'],
    isOnline: true,
    isLocal: true,
    availableSlots: []
  },
  {
    id: '6',
    name: 'David Manhique',
    title: 'Business Consultant',
    company: 'Business Growth',
    experience: 10,
    rating: 4.8,
    price: 450,
    location: 'Maputo, Baixa',
    categories: ['Consultoria Empresarial', 'Startups', 'Plano de Negócios', 'Finanças'],
    image: '/images/mentorhero.jpg',
    description: 'Consultor empresarial com vasta experiência em ajudar pequenas e médias empresas moçambicanas.',
    availability: ['Segunda a Quinta', '09:00-18:00'],
    languages: ['Português', 'Inglês', 'Xangana'],
    isOnline: false,
    isLocal: true,
    availableSlots: []
  },
];

const allCategories = Array.from(new Set(mockMentors.flatMap(mentor => mentor.categories)));
const allLocations = Array.from(new Set(mockMentors.map(mentor => mentor.location)));

export default function MentoresPage() {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all-categories',
    location: 'all-locations',
    priceRange: 'all-prices',
    experience: 'all-experience',
    sessionType: 'all',
  });

  const filteredMentors = useMemo(() => {
    return mockMentors.filter(mentor =>
      mentor.price >= priceRange[0] &&
      mentor.price <= priceRange[1] &&
      (filters.search === '' ||
        mentor.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        mentor.categories.some(cat => cat.toLowerCase().includes(filters.search.toLowerCase())) ||
        mentor.title.toLowerCase().includes(filters.search.toLowerCase())) &&
      (filters.category === 'all-categories' || mentor.categories.includes(filters.category)) &&
      (filters.experience === 'all-experience' || (
        filters.experience === '0-2' && mentor.experience <= 2 ||
        filters.experience === '3-5' && mentor.experience >= 3 && mentor.experience <= 5 ||
        filters.experience === '5-10' && mentor.experience >= 5 && mentor.experience <= 10 ||
        filters.experience === '10+' && mentor.experience > 10
      )) &&
      (filters.sessionType === 'all' ||
        (filters.sessionType === 'online' && mentor.isOnline) ||
        (filters.sessionType === 'presencial' && mentor.isLocal))
    );
  }, [priceRange, filters]);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <Container>
      <div className="py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Encontre Mentores Locais
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Conecte-se com profissionais experientes para acelerar
            sua carreira e desenvolvimento pessoal
          </p>
        </div>

        <div className="mb-8">
          <MentorFilters
            categories={allCategories}
            locations={allLocations}
            onFiltersChange={handleFiltersChange}
          />
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Mentores Disponíveis
            </h2>
            <span className="text-gray-600 dark:text-gray-400">
              {filteredMentors.length} mentores encontrados
            </span>
            <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>

          {filteredMentors.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
            }>
              {filteredMentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Nenhum mentor encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tente ajustar os filtros para ver mais resultados
              </p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}