'use client'

import React, { useState, useRef, useCallback } from 'react'
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import Button from './Button'

interface ImageCropModalProps {
  isOpen: boolean
  onClose: () => void
  onCropComplete: (croppedImageBlob: Blob) => void
  imageSrc: string
}

export default function ImageCropModal({ isOpen, onClose, onCropComplete, imageSrc }: ImageCropModalProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [isProcessing, setIsProcessing] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Configurar crop inicial (círculo)
  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget
    
    // Criar crop circular no centro da imagem
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 80, // 80% da imagem
        },
        1, // Aspect ratio 1:1 (círculo)
        width,
        height
      ),
      width,
      height
    )
    
    setCrop(crop)
  }, [])

  // Gerar imagem cortada
  const generateCroppedImage = useCallback(async () => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) {
      return
    }

    setIsProcessing(true)
    
    try {
      const image = imgRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('No 2d context')
      }

      // Configurar dimensões do canvas
      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height

      canvas.width = completedCrop.width * scaleX
      canvas.height = completedCrop.height * scaleY

      // Desenhar imagem cortada
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY
      )

      // Converter para blob
      canvas.toBlob((blob) => {
        if (blob) {
          onCropComplete(blob)
          onClose()
        }
      }, 'image/jpeg', 0.9)
    } catch (error) {
      console.error('Erro ao processar imagem:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [completedCrop, onCropComplete, onClose])

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--ink-800)' }}>
            Ajustar foto do perfil
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--neutral-100)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <i className="ph ph-x" style={{ fontSize: '24px', color: 'var(--ink-600)' }}></i>
          </button>
        </div>

        {/* Instructions */}
        <p style={{
          color: 'var(--ink-600)',
          fontSize: '14px',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          Arraste e redimensione a área para ajustar sua foto. A imagem será cortada em formato circular.
        </p>

        {/* Crop Area */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '24px',
          maxHeight: '400px',
          overflow: 'hidden'
        }}>
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1} // Força formato quadrado (círculo)
            minWidth={100}
            minHeight={100}
            style={{
              maxWidth: '100%',
              maxHeight: '400px'
            }}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imageSrc}
              onLoad={onImageLoad}
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                objectFit: 'contain'
              }}
            />
          </ReactCrop>
        </div>

        {/* Hidden Canvas */}
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <Button
            onClick={onClose}
            className="bg-neutral-200 text-neutral-800 hover:bg-neutral-300"
          >
            Cancelar
          </Button>
          <Button
            onClick={generateCroppedImage}
            disabled={!completedCrop || isProcessing}
            className="bg-green-900 hover:bg-green-950 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processando...' : 'Confirmar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
