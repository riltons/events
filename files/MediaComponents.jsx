import React, { useState, useRef } from 'react'
import { Upload, Camera, Users, Heart, MessageCircle, Share2, X } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'

const MediaUpload = ({ eventId, onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false)
  const [caption, setCaption] = useState('')
  const [taggedUsers, setTaggedUsers] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      
      // Criar preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('user_id', '1') // TODO: Obter do contexto de autenticação
      formData.append('event_id', eventId)
      formData.append('caption', caption)
      formData.append('tagged_users', JSON.stringify(taggedUsers))

      const response = await fetch('https://e5h6i7c0x97j.manus.space/api/media/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        onUploadSuccess && onUploadSuccess(result)
        
        // Limpar formulário
        setSelectedFile(null)
        setPreviewUrl(null)
        setCaption('')
        setTaggedUsers([])
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        console.error('Erro no upload:', await response.text())
      }
    } catch (error) {
      console.error('Erro no upload:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Compartilhar Foto/Vídeo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload de arquivo */}
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
          {previewUrl ? (
            <div className="relative">
              {selectedFile?.type.startsWith('image/') ? (
                <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded" />
              ) : (
                <video src={previewUrl} controls className="max-h-48 mx-auto rounded" />
              )}
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => {
                  setSelectedFile(null)
                  setPreviewUrl(null)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div>
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Clique para selecionar uma foto ou vídeo
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Selecionar Arquivo
              </Button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Legenda */}
        <div>
          <label className="text-sm font-medium mb-2 block">Legenda</label>
          <Textarea
            placeholder="Escreva uma legenda para sua foto/vídeo..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
          />
        </div>

        {/* Marcar usuários */}
        <div>
          <label className="text-sm font-medium mb-2 block flex items-center gap-2">
            <Users className="w-4 h-4" />
            Marcar Pessoas
          </label>
          <Input
            placeholder="Digite o nome dos usuários para marcar..."
            // TODO: Implementar busca de usuários
          />
        </div>

        {/* Botão de upload */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="w-full"
        >
          {isUploading ? 'Enviando...' : 'Compartilhar'}
        </Button>
      </CardContent>
    </Card>
  )
}

const MediaGallery = ({ eventId }) => {
  const [medias, setMedias] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all', 'image', 'video'

  React.useEffect(() => {
    loadMedias()
  }, [eventId, filter])

  const loadMedias = async () => {
    try {
      const filterParam = filter !== 'all' ? `?type=${filter}` : ''
      const response = await fetch(`https://e5h6i7c0x97j.manus.space/api/media/event/${eventId}${filterParam}`)
      
      if (response.ok) {
        const data = await response.json()
        setMedias(data)
      }
    } catch (error) {
      console.error('Erro ao carregar mídias:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (mediaId) => {
    try {
      const response = await fetch(`https://e5h6i7c0x97j.manus.space/api/media/${mediaId}/like`, {
        method: 'POST'
      })
      
      if (response.ok) {
        const result = await response.json()
        setMedias(medias.map(media => 
          media.id === mediaId 
            ? { ...media, likes_count: result.likes_count }
            : media
        ))
      }
    } catch (error) {
      console.error('Erro ao curtir mídia:', error)
    }
  }

  const shareToSocial = (media, platform) => {
    const url = `${window.location.origin}${media.file_path}`
    const text = media.caption || 'Confira esta foto do evento!'
    
    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
    } else if (platform === 'instagram') {
      // Instagram não permite compartilhamento direto via URL
      // Aqui você implementaria a integração com a API do Instagram
      alert('Funcionalidade de compartilhamento no Instagram em desenvolvimento')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Carregando mídias...</div>
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          Todas
        </Button>
        <Button
          variant={filter === 'image' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('image')}
        >
          Fotos
        </Button>
        <Button
          variant={filter === 'video' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('video')}
        >
          Vídeos
        </Button>
      </div>

      {/* Grid de mídias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {medias.map((media) => (
          <Card key={media.id} className="overflow-hidden">
            <div className="relative">
              {media.file_type === 'image' ? (
                <img
                  src={`https://e5h6i7c0x97j.manus.space${media.file_path}`}
                  alt={media.caption}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <video
                  src={`https://e5h6i7c0x97j.manus.space${media.file_path}`}
                  className="w-full h-48 object-cover"
                  controls
                />
              )}
              
              {/* Badge do tipo */}
              <Badge className="absolute top-2 left-2">
                {media.file_type === 'image' ? 'Foto' : 'Vídeo'}
              </Badge>
            </div>

            <CardContent className="p-4">
              {/* Informações do usuário */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                  {media.user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium">{media.user?.username || 'Usuário'}</span>
              </div>

              {/* Legenda */}
              {media.caption && (
                <p className="text-sm text-muted-foreground mb-3">{media.caption}</p>
              )}

              {/* Usuários marcados */}
              {media.tagged_users_info && media.tagged_users_info.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-1">Pessoas marcadas:</p>
                  <div className="flex flex-wrap gap-1">
                    {media.tagged_users_info.map((user) => (
                      <Badge key={user.id} variant="secondary" className="text-xs">
                        @{user.username}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Ações */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(media.id)}
                    className="flex items-center gap-1"
                  >
                    <Heart className="w-4 h-4" />
                    {media.likes_count || 0}
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    Comentar
                  </Button>
                </div>

                {/* Compartilhamento */}
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => shareToSocial(media, 'facebook')}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Data */}
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(media.created_at).toLocaleDateString('pt-BR')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {medias.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma mídia encontrada para este evento.
        </div>
      )}
    </div>
  )
}

export { MediaUpload, MediaGallery }

