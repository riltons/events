// Página de teste com dados reais da API
// Portal de Eventos Garanhuns

import React, { useState } from 'react';
import EventsContainer from './components/EventsContainer';
import { useApiHealth, useEvents, useCategories } from './hooks/useEvents';

const TestPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const apiStatus = useApiHealth();
  const { categories } = useCategories();
  const { events, loading, error } = useEvents({ limit: 20 });

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    console.log('Evento selecionado:', event);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              🎉 Portal de Eventos - Teste com API Real
            </h1>
            
            {/* Status da API */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                apiStatus.isOnline ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm text-gray-600">
                API {apiStatus.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Estatísticas</h3>
            <div className="space-y-2 text-sm">
              <div>🎉 Eventos: {loading ? '...' : events.length}</div>
              <div>🏷️ Categorias: {categories.length}</div>
              <div>⭐ Em destaque: {loading ? '...' : events.filter(e => e.is_featured).length}</div>
              <div>📅 Próximos: {loading ? '...' : events.filter(e => new Date(e.start_date) > new Date()).length}</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🔗 API Status</h3>
            <div className="space-y-2 text-sm">
              <div>Status: {apiStatus.isOnline ? '✅ Online' : '❌ Offline'}</div>
              <div>Endpoint: localhost:3001</div>
              <div>Última verificação:</div>
              <div className="text-xs text-gray-500">
                {apiStatus.timestamp ? new Date(apiStatus.timestamp).toLocaleTimeString('pt-BR') : 'N/A'}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📂 Categorias</h3>
            <div className="space-y-1 text-sm">
              {categories.slice(0, 4).map(cat => (
                <div key={cat.id} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: cat.color }}
                  ></div>
                  <span>{cat.name}</span>
                </div>
              ))}
              {categories.length > 4 && (
                <div className="text-gray-500">+{categories.length - 4} mais...</div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🎯 Próximo Evento</h3>
            <div className="text-sm">
              {loading ? (
                <div>Carregando...</div>
              ) : events.length > 0 ? (
                <div>
                  <div className="font-medium">{events[0].title}</div>
                  <div className="text-gray-500">{events[0].venue_name}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(events[0].start_date).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">Nenhum evento encontrado</div>
              )}
            </div>
          </div>
        </div>

        {/* Eventos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            🎪 Eventos do Banco PostgreSQL
          </h2>
          
          {error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">❌ Erro ao carregar eventos</div>
              <div className="text-sm text-gray-500">{error}</div>
              <div className="mt-4 text-xs text-gray-400">
                Verifique se a API está rodando: npm run api
              </div>
            </div>
          ) : (
            <EventsContainer 
              filters={{}}
              onEventSelect={handleEventSelect}
              maxEvents={20}
            />
          )}
        </div>

        {/* Evento selecionado */}
        {selectedEvent && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              🎯 Evento Selecionado
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">{selectedEvent.title}</h3>
                <p className="text-gray-600 mb-4">{selectedEvent.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div><strong>Categoria:</strong> {selectedEvent.category_name}</div>
                  <div><strong>Local:</strong> {selectedEvent.venue_name}</div>
                  <div><strong>Data:</strong> {new Date(selectedEvent.start_date).toLocaleDateString('pt-BR')}</div>
                  <div><strong>Horário:</strong> {new Date(selectedEvent.start_date).toLocaleTimeString('pt-BR')}</div>
                  <div><strong>Preço:</strong> {selectedEvent.is_free ? 'Gratuito' : 'Pago'}</div>
                  <div><strong>Status:</strong> {selectedEvent.status}</div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-medium mb-2">🔧 Dados Técnicos:</h4>
                <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-auto">
                  {JSON.stringify(selectedEvent, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Instruções */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            ℹ️ Como funciona
          </h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>✅ Esta página está conectada ao banco PostgreSQL via API</p>
            <p>✅ Dados são carregados em tempo real do banco local</p>
            <p>✅ Filtros funcionam dinamicamente</p>
            <p>✅ Categorias são carregadas do banco</p>
            <p>🔧 Para testar: clique em um evento para ver os dados completos</p>
            <p>🚀 Próximo passo: integrar ao App.tsx principal</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestPage; 