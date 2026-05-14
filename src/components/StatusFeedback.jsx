import React from 'react';

const StatusFeedback = ({ type, message }) => {
  // Estilos rápidos para que se vea bien en la defensa
  const styles = {
    container: {
      padding: '20px',
      textAlign: 'center',
      marginTop: '50px',
      borderRadius: '8px',
      fontFamily: 'sans-serif'
    },
    loading: {
      backgroundColor: '#f0f0f0',
      color: '#1DB954', // Verde Spotify
      border: '1px solid #1DB954'
    },
    error: {
      backgroundColor: '#ffebee',
      color: '#c62828',
      border: '1px solid #c62828'
    }
  };

  const currentStyle = type === 'loading' ? styles.loading : styles.error;

  return (
    <div style={{ ...styles.container, ...currentStyle }}>
      {type === 'loading' ? (
        <h2>⏳ {message || 'Cargando...'}</h2>
      ) : (
        <h2>⚠️ Error: {message || 'Algo salió mal'}</h2>
      )}
    </div>
  );
};

export default StatusFeedback;