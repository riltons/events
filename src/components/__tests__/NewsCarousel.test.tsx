import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import NewsCarousel from '../NewsCarousel'

/**
 * Mock de notícias para testes
 */
const mockNoticias = [
  {
    id: '1',
    titulo: 'Festival de Forró 2025',
    resumo: 'Grande festival de forró em Garanhuns',
    data: '2025-07-30',
    destaque: true,
    categoria: 'Musical'
  },
  {
    id: '2',
    titulo: 'Show de Alceu Valença',
    resumo: 'Show especial do rei do forró',
    data: '2025-08-01',
    destaque: false,
    categoria: 'Musical'
  }
]

describe('NewsCarousel', () => {
  beforeEach(() => {
    // Mock do setInterval para testes
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('deve renderizar corretamente com notícias', () => {
    render(<NewsCarousel noticias={mockNoticias} />)
    
    // Verifica se o primeiro item está sendo exibido
    expect(screen.getByText('Festival de Forró 2025')).toBeInTheDocument()
    expect(screen.getByText('Grande festival de forró em Garanhuns')).toBeInTheDocument()
  })

  it('deve retornar null quando não há notícias', () => {
    const { container } = render(<NewsCarousel noticias={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('deve exibir controles de navegação quando há múltiplas notícias', () => {
    render(<NewsCarousel noticias={mockNoticias} />)
    
    // Verifica se os botões de navegação estão presentes
    expect(screen.getByLabelText('Notícia anterior')).toBeInTheDocument()
    expect(screen.getByLabelText('Próxima notícia')).toBeInTheDocument()
  })

  it('deve navegar para a próxima notícia ao clicar no botão', async () => {
    render(<NewsCarousel noticias={mockNoticias} autoPlay={false} />)
    
    // Clica no botão de próxima notícia
    const nextButton = screen.getByLabelText('Próxima notícia')
    fireEvent.click(nextButton)
    
    // Aguarda a transição e verifica se mudou para a segunda notícia
    await waitFor(() => {
      expect(screen.getByText('Show de Alceu Valença')).toBeInTheDocument()
    })
  })

  it('deve exibir badge de destaque quando a notícia é destaque', () => {
    render(<NewsCarousel noticias={mockNoticias} />)
    
    // Verifica se o badge de destaque está presente
    expect(screen.getByText('✨ DESTAQUE')).toBeInTheDocument()
  })

  it('deve formatar a data corretamente', () => {
    render(<NewsCarousel noticias={mockNoticias} />)
    
    // Verifica se a data está formatada corretamente (DD/MM)
    expect(screen.getByText('30/07')).toBeInTheDocument()
  })

  it('deve funcionar o autoPlay quando habilitado', () => {
    render(<NewsCarousel noticias={mockNoticias} autoPlay={true} interval={1000} />)
    
    // Avança o timer
    vi.advanceTimersByTime(1000)
    
    // Verifica se mudou para a próxima notícia
    expect(screen.getByText('Show de Alceu Valença')).toBeInTheDocument()
  })

  it('deve ter atributos de acessibilidade adequados', () => {
    render(<NewsCarousel noticias={mockNoticias} />)
    
    // Verifica se os elementos têm atributos ARIA apropriados
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    
    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(2)
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
  })
}) 