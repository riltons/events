import React, { useState, useEffect } from 'react'
import { X, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import propagandaAfya from '../assets/images/propaganda_afya.jpg'
import propagandaVC from '../assets/images/propaganda_vc.jpg'
import propagandaPrefeitura from '../assets/images/propaganda_prefeitura.jpeg'

const propagandas = [
  {
    id: 1,
    titulo: "Afya Garanhuns - Marketing",
    imagem: propagandaAfya,
    link: "https://garanhuns.afya.com.br",
    descricao: "Descubra por que o marketing é uma área em crescimento",
    tipo: "educacao"
  },
  {
    id: 2,
    titulo: "V&C Garanhuns",
    imagem: propagandaVC,
    link: "https://www.vecgaranhuns.com",
    descricao: "Sua loja de departamentos em Garanhuns",
    tipo: "comercio"
  },
  {
    id: 3,
    titulo: "Prefeitura de Garanhuns",
    imagem: propagandaPrefeitura,
    link: "https://garanhuns.pe.gov.br",
    descricao: "Um novo tempo para todos",
    tipo: "governo"
  }
]

const AdBanner = ({ propaganda, onClose, position = "top" }) => {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const handleClose = () => {
    setIsVisible(false)
    onClose && onClose()
  }

  const positionClasses = {
    top: "fixed top-0 left-0 right-0 z-50",
    bottom: "fixed bottom-0 left-0 right-0 z-50",
    sidebar: "sticky top-4"
  }

  return (
    <div className={`${positionClasses[position]} bg-white shadow-lg border-b`}>
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={propaganda.imagem} 
              alt={propaganda.titulo}
              className="h-12 w-20 object-cover rounded"
            />
            <div>
              <h4 className="font-medium text-sm">{propaganda.titulo}</h4>
              <p className="text-xs text-muted-foreground">{propaganda.descricao}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.open(propaganda.link, '_blank')}
              className="text-xs"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Visitar
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={handleClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const SidebarAd = ({ propaganda }) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground mb-2">Publicidade</div>
        <img 
          src={propaganda.imagem} 
          alt={propaganda.titulo}
          className="w-full h-32 object-cover rounded mb-3"
        />
        <h4 className="font-medium text-sm mb-1">{propaganda.titulo}</h4>
        <p className="text-xs text-muted-foreground mb-3">{propaganda.descricao}</p>
        <Button 
          size="sm" 
          className="w-full"
          onClick={() => window.open(propaganda.link, '_blank')}
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          Saiba Mais
        </Button>
      </CardContent>
    </Card>
  )
}

const InlineAd = ({ propaganda }) => {
  return (
    <Card className="my-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-200">
      <CardContent className="p-6">
        <div className="text-xs text-muted-foreground mb-2 text-center">Publicidade</div>
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <img 
            src={propaganda.imagem} 
            alt={propaganda.titulo}
            className="w-full md:w-48 h-32 object-cover rounded"
          />
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-bold text-lg mb-2">{propaganda.titulo}</h3>
            <p className="text-muted-foreground mb-4">{propaganda.descricao}</p>
            <Button 
              onClick={() => window.open(propaganda.link, '_blank')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Visitar Site
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const AdManager = () => {
  const [currentBannerAd, setCurrentBannerAd] = useState(null)
  const [sidebarAds, setSidebarAds] = useState([])
  const [inlineAd, setInlineAd] = useState(null)

  useEffect(() => {
    // Configurar propagandas aleatórias
    const shuffled = [...propagandas].sort(() => 0.5 - Math.random())
    
    setCurrentBannerAd(shuffled[0])
    setSidebarAds(shuffled.slice(1, 3))
    setInlineAd(shuffled[2])
  }, [])

  return {
    BannerAd: currentBannerAd ? (
      <AdBanner 
        propaganda={currentBannerAd} 
        position="top"
        onClose={() => setCurrentBannerAd(null)}
      />
    ) : null,
    
    SidebarAds: sidebarAds.map(propaganda => (
      <SidebarAd key={propaganda.id} propaganda={propaganda} />
    )),
    
    InlineAd: inlineAd ? <InlineAd propaganda={inlineAd} /> : null
  }
}

export { AdBanner, SidebarAd, InlineAd, AdManager }

