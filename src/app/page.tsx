'use client'; // Indica que este componente será renderizado no cliente

import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';

// Uma lista expandida de emojis
const emojis = [
  '👍', '❤️', '✨', '🎉', '🤔', '💯', '🌈',
  '🐶', '🐱', '🐰', '🌻', '🌴', '🍕', '☕', '🎵', '💡', '⭐',
  '🎁', '🎈', '🛍️', '📸', '✍️', '🗺️', '📚', '🎧', '🎮', '⚽',
  '🍎', '🍦', '🍹', '🚗', '✈️', '🏠', '⏰', '📌', '🔗', '✅',
  '❓', '❔', '🤨', '🗿', '🏛️', '🎭', '🍔', '🍣', '🥗','🏖️', '🏞️', 
  '🧘', '💬', '🗣️', '🗨️', '🗼', '🗽', '⛰️', '👋', '🤝', '🙏',
  '🏀', '🏈', '⚾', '🎾', '🏐', '🏓', '🏸', '🏒', '⛳', '⛸️', 
  '🎿', '⛷️', '🏂', '🚴', '🏋️', '🤸', '🏃', '🏊', '🏄', '🚣', '🧗',
  '⛪', '✝️', '😃', '😄', '😁', '😊', '😂', '😨', '😰', '😥', '😓', 
  '😬', '👩‍❤️‍👨', '👨‍❤️‍👨', '👩‍❤️‍👩', '💑', '👪', '👨‍👩‍👧', '👨‍👩‍👧‍👦', '👨‍👩‍👦‍👦', '👨‍👩‍👧‍👧', 
  '😠', '😡', '😤', '🤬', '😒', '🙄', '🌃', '🌑', '🌒', '🌓', '🌔', 
  '🌕',  '🌙', '😴', '😪', '💤', '🛌', '🌧️', '☔', '💧', 
  '🥶', '🧊', '🧤', '🧣', '🥵', '🔥', '☀️', '🌡️',
];

interface Styles {
  [key: string]: React.CSSProperties;
}

const styles: Styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Times new Roman',
    background: '#fff',
    borderRadius: '8px',
    maxWidth: '95%',
    margin: '20px auto',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  title: {
    marginBottom: '15px',
    color: '#333',
    textAlign: 'center',
    fontSize: '1.8em',
  },
  emojiArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // Alinha os emojis à esquerda
    marginBottom: '15px',
    width: '100%', // Ocupa a largura total do container
  },
  emojiTitle: {
    fontSize: '1em',
    color: '#555',
    marginBottom: '5px',
    textAlign: 'left',
    width: '100%',
  },
  emojiPicker: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px', // Reduzi o gap
    marginTop: '5px',
    justifyContent: 'flex-start', // Alinha os emojis à esquerda
    width: '100%',
  },
  emojiButton: {
    fontSize: '1.2em', // Reduzi o tamanho dos emojis
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    padding: '5px', // Adicionei um pouco de padding aos botões
    transition: 'transform 0.1s ease-in-out',
  },
  uploadArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '15px',
    border: '2px dashed #333',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    width: '100%',
    boxSizing: 'border-box',
  },
  uploadLabel: {
    fontSize: '18px',
    color: '#555',
    marginBottom: '10px',
    cursor: 'pointer',
  },
  previewContainer: {
    marginTop: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    overflow: 'hidden',
    maxWidth: '100%',
    marginBottom: '10px',
  },
  previewImage: {
    display: 'block',
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '3px'
  },
  legendaArea: {
    marginBottom: '15px',
    width: '100%',
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
    padding: '0 10px',
    //justifyContent: 'center',
  },
  captionContainer: { // Novo container para controlar a largura da legenda
    width: '110%',
    display: 'flex',
    justifyContent: 'center',
    padding: '5px', // Adiciona um pouco de padding ao redor da legenda
    background: 'none', // Adiciona um fundo azul à legenda
    borderRadius: '1px',
    boxSizing: 'border-box',
  },
  captionText: {
    textAlign: 'justify',
    fontSize: '8px',
    color: '#fff',
    //fontWeight: 'semibold',
    //color: '#def6fc',
    //padding: '1px 0',
    //background: '#def6fc',
    background: 'none',
    borderRadius: '5px',
    border: 'none',
    boxSizing: 'border-box',
    wordWrap: 'break-word',
    maxWidth: '90%',
  },
  legendaTexto: {
    textAlign: 'center',
    fontSize: '14px',
    //color: '#333',
    color: '#77cff4',
    padding: '10px',
    //background: '#fff',
    background: '#77cff4',
    borderRadius: '5px',
    border: '1px solid #eee',
    wordWrap: 'break-word',
    maxWidth: '60%',
  },
  textarea: {
    width: '100%',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '14px',
    minHeight: '80px',
    boxSizing: 'border-box',
    marginBottom: '5px',
  },
  downloadButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1em',
    transition: 'background-color 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    marginTop: '15px',
  },
  imageWithCaption: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
    padding: '5px', // Adicionei um pouco de padding interno
    background: '#000000', // Adicionei um fundo preto para melhor visualização
    borderRadius: '8px',
    marginBottom: '10px',
    maxWidth: '23%',
  },

  excluirButton: {
    backgroundColor: '#f44336', // Vermelho
    color: 'white',
    border: '2px solid black',
    borderRadius: '5px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '0.9em',
    marginTop: '20px',
    marginBottom: '10px',
    marginLeft: '10px',
    transition: 'background-color 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    
  },
  trashIcon: {
    width: '18px',
    height: '18px',
    fill: 'white',
  },
    
};

export default function LegendarFoto() {
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [legenda, setLegenda] = useState<string>('');
  //const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageWithCaptionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [captionMaxWidth, setCaptionMaxWidth] = useState<string>('90%'); // Estado para controlar a largura máxima da legenda
  const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null);
  const [resizedImageUrl, setResizedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (imageRef.current) {
      const handleLoad = () => {
        if (imageRef.current) { // Verificação adicional aqui
          setCaptionMaxWidth(`${imageRef.current.offsetWidth * 0.9}px`);
        }
      };

      if (imageRef.current.complete) {
        handleLoad();
      } else {
        imageRef.current.addEventListener('load', handleLoad);
        return () => {
          if (imageRef.current) { // Verificação adicional na limpeza
            imageRef.current.removeEventListener('load', handleLoad);
          }
        };
      }
    }
  }, [fotoUrl]);

  const handleFotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFotoUrl(URL.createObjectURL(file));
    }
  };

  const handleLegendaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLegenda(event.target.value);
  };

  const handleExcluirFoto = () => {
    setFotoUrl(null);
    setResizedImageUrl(null); // Limpa a imagem redimensionada também, se estiver usando
  };

  const handleEmojiClick = (emoji: string) => {
    const textarea = document.getElementById('legenda-textarea') as HTMLTextAreaElement | null;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newLegenda = textarea.value.substring(0, start) + emoji + textarea.value.substring(end);
      setLegenda(newLegenda);
      // Move o cursor para após o emoji inserido
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
      textarea.focus(); // Mantém o foco na textarea
    }
  };

  const handleResizeForInstagram = (imageDataURL: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxWidth = 1080;
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);

      const resizedDataURL = canvas.toDataURL('image/jpeg', 0.8);
      //setResizedImageUrlForDownload(resizedDataURL); // Novo estado para a URL redimensionada para download

      // Oferecer a opção de baixar a imagem redimensionada
      const a = document.createElement('a');
      a.href = resizedDataURL;
      a.download = 'foto_legendada_instagram.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      //setResizedImageUrlForDownload(null); // Limpar o estado após o download
    };
    img.src = imageDataURL;
  };

  //const [resizedImageUrlForDownload, setResizedImageUrlForDownload] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!fotoUrl) {
      alert('Por favor, selecione uma foto primeiro.');
      return;
    }

    const element = imageWithCaptionRef.current;
    if (!element) {
      console.error('Elemento para captura não encontrado.');
      return;
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // Aumenta a escala para uma imagem de melhor qualidade
        useCORS: true, // Importante se as imagens vêm de domínios diferentes
        backgroundColor: null,
      });
      const dataURL = canvas.toDataURL('image/png', 0.8);
      
      // Chame a função para redimensionar a imagem legendada
      handleResizeForInstagram(dataURL);
    
    } catch (error) {
      console.error('Erro ao gerar a imagem:', error);
      alert('Ocorreu um erro ao gerar a imagem para download.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Crie sua legenda personalizada para o Instagram</h1>

      <div style={styles.emojiArea}>
        <h2 style={styles.emojiTitle}>Clique em um emoji para animar o seu texto</h2>
        <div style={styles.emojiPicker}>
          {emojis.map((emoji) => (
            <button
              key={emoji}
              style={{
                ...styles.emojiButton,
                transform: hoveredEmoji === emoji ? 'scale(1.2)' : 'scale(1)',
              }}
              onClick={() => handleEmojiClick(emoji)}
              onMouseEnter={() => setHoveredEmoji(emoji)}
              onMouseLeave={() => setHoveredEmoji(null)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.uploadArea}>
        <label htmlFor="upload-input" style={styles.uploadLabel}>
          Clique aqui para escolher uma foto
        </label>
        <input
          id="upload-input"
          type="file"
          accept="image/*"
          onChange={handleFotoChange}
          style={{ display: 'none' }}
        />
        {fotoUrl && (
          <div style={styles.previewContainer}>
            <img src={fotoUrl} alt="Pré-visualização" style={styles.previewImage} />
            <button onClick={handleExcluirFoto} style={styles.excluirButton}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={styles.trashIcon}>
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
              Excluir Foto
            </button>
          </div>
        )}
      </div>

      {fotoUrl && (
        <div style={styles.legendaArea}>
          <textarea
            id="legenda-textarea"
            placeholder="Digite sua legenda aqui..."
            value={legenda}
            onChange={handleLegendaChange}
            style={styles.textarea}
          />
        </div>
      )}

      {fotoUrl && legenda && (
        <div ref={imageWithCaptionRef} style={styles.imageWithCaption}>
          <img ref={imageRef} src={fotoUrl} alt="Foto para legenda" style={{ maxWidth: '97%', maxHeight: '50%', display: 'block' }} />
          <div style={styles.captionContainer}>
            <div style={{ ...styles.captionText, maxWidth: captionMaxWidth }}>{legenda}</div>
          </div>
        </div>
      )}

      {fotoUrl && legenda && (
        <button onClick={handleDownload} style={styles.downloadButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginRight: '8px', verticalAlign: 'middle' }}
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 10l-5 5-5-5M12 15V3" />
          </svg>
          Baixar Foto com Legenda
        </button>
      )}
    </div>
  );
}