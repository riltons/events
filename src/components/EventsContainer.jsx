// Container para gerenciar eventos com dados da API
// Portal de Eventos Garanhuns

import React, { useState, useEffect, useMemo } from 'react';
import { useEvents, useCategories } from '../hooks/useEvents';
import api from '../services/api';

const EventsContainer = ({ filters = {}, onEventSelect, maxEvents = 12 }) => {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  
  // Combinar filtros externos com categoria selecionada usando useMemo
  const combinedFilters = useMemo(() => ({
    ...filters,
    category: selectedCategory !== 'todos' ? selectedCategory : undefined,
    limit: maxEvents
  }), [filters, selectedCategory, maxEvents]);
  
  const { events, loading, error, refetch } = useEvents(combinedFilters);
  const { categories } = useCategories();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse h-8 w-20 rounded"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-300 h-48 w-full"></div>
              <div className="p-4 space-y-3">
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                <div className="bg-gray-200 h-6 rounded"></div>
                <div className="bg-gray-200 h-3 rounded w-full"></div>
                <div className="bg-gray-200 h-3 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">⚠️</div>
        <p className="text-red-600 mb-4 text-lg">Erro ao carregar eventos</p>
        <p className="text-gray-600 mb-4 text-sm">{error}</p>
        <button 
          onClick={refetch}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros de categoria */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'todos' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedCategory('todos')}
          >
            Todos
          </button>
          {categories.filter(cat => !cat.parent_id).map(category => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.slug 
                  ? 'text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: selectedCategory === category.slug ? category.color : undefined
              }}
              onClick={() => setSelectedCategory(category.slug)}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* Estatísticas */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {events.length} evento{events.length !== 1 ? 's' : ''} encontrado{events.length !== 1 ? 's' : ''}
          {selectedCategory !== 'todos' && (
            <span className="ml-2 text-blue-600">
              • Filtrado por: {categories.find(c => c.slug === selectedCategory)?.name}
            </span>
          )}
        </div>
      </div>

      {/* Grid de eventos */}
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div 
              key={event.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer border hover:border-blue-200"
              onClick={() => onEventSelect && onEventSelect(event)}
            >
              <div className="relative">
                <img 
                  src={api.getEventImage(event)}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop';
                  }}
                />
                {event.is_featured && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                      ⭐ Destaque
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span 
                    className="inline-block px-3 py-1 text-xs rounded-full text-white font-medium"
                    style={{ backgroundColor: event.category_color || '#6B7280' }}
                  >
                    {event.category_name}
                  </span>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    event.is_free 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {event.is_free ? 'Gratuito' : 'Pago'}
                  </span>
                </div>
                
                <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900">
                  {event.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {event.short_description || event.description}
                </p>
                
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📅</span>
                    <span className="font-medium">{api.formatEventDate(event.start_date)}</span>
                  </div>
                  
                  {event.venue_name && (
                    <div className="flex items-center gap-2">
                      <span className="text-base">📍</span>
                      <span className="truncate">{event.venue_name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-8xl mb-6">🎭</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Nenhum evento encontrado
          </h3>
          <p className="text-gray-500 mb-6">
            {selectedCategory !== 'todos' 
              ? `Não há eventos na categoria "${categories.find(c => c.slug === selectedCategory)?.name}"`
              : 'Não há eventos disponíveis no momento'
            }
          </p>
          {selectedCategory !== 'todos' && (
            <button
              onClick={() => setSelectedCategory('todos')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Ver todos os eventos
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventsContainer; 