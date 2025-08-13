import React from 'react';
import { Product } from '../types';
import { LAYOUT_CONFIG } from '../config/layout';

interface ProductBoxProps {
  product: Product;
  isUnified?: boolean;
  opacity?: number;
}

const ProductBox: React.FC<ProductBoxProps> = ({ product, isUnified = false, opacity = 1 }) => {
  const boxStyle: React.CSSProperties = {
    position: 'absolute',
    left: product.position.x - LAYOUT_CONFIG.products.width / 2,
    top: product.position.y - LAYOUT_CONFIG.products.height / 2,
    width: LAYOUT_CONFIG.products.width,
    height: LAYOUT_CONFIG.products.height,
    backgroundColor: isUnified ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : product.bgColor,
    border: `${LAYOUT_CONFIG.products.borderWidth}px solid ${isUnified ? '#667eea' : product.color}`,
    borderRadius: LAYOUT_CONFIG.products.borderRadius,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity,
    transition: 'all 0.5s ease',
    boxShadow: isUnified ? '0 4px 12px rgba(102, 126, 234, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
    zIndex: LAYOUT_CONFIG.zIndex.products,
  };

  const textStyle: React.CSSProperties = {
    color: isUnified ? 'white' : product.color,
    fontWeight: 'bold',
    fontSize: isUnified ? 14 : 12,
    textAlign: 'center',
  };

  return (
    <div style={boxStyle} className={`product-box product-${product.id}`}>
      <span style={textStyle}>{product.name}</span>
    </div>
  );
};

export default ProductBox;