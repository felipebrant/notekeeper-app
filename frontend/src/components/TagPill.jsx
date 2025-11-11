import React from 'react';

// Esta função decide se o texto deve ser preto ou branco
const getContrastColor = (hexcolor) => {
  if (!hexcolor || hexcolor === '#FFFFFF') {
    // Se for branco ou sem cor, força o texto a ser escuro
    return '#343a40'; 
  }
  
  hexcolor = hexcolor.replace('#', '');
  
  const r = parseInt(hexcolor.substring(0, 2), 16);
  const g = parseInt(hexcolor.substring(2, 4), 16);
  const b = parseInt(hexcolor.substring(4, 6), 16);
  
  // Fórmula YIQ
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Se for uma cor clara (YIQ >= 128), retorna texto preto.
  // Se for escura, retorna texto branco.
  return yiq >= 128 ? '#343a40' : '#FFFFFF';
};

export default function TagPill({ tag }) {
  if (!tag) return null;

  const textColor = getContrastColor(tag.color);

  return (
    <div
      className="tag-pill"
      style={{
        backgroundColor: tag.color,
        color: textColor,
        border: tag.color === '#FFFFFF' ? '1px solid #e0e0e0' : 'none',
      }}
    >
      {tag.name}
    </div>
  );
}