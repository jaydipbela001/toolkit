import { Link } from 'react-router-dom';
import './ToolCard.css';

const ToolCard = ({ title, description, icon, path, color = 'primary' }) => {
  const colorMap = {
    primary: '#4f46e5',
    secondary: '#06b6d4',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    purple: '#8b5cf6',
  };

  const cardColor = colorMap[color] || colorMap.primary;

  return (
    <Link to={path} className="tool-card" style={{ '--card-accent': cardColor }}>
      <div className="tool-card-icon" style={{ backgroundColor: `${cardColor}20` }}>
        <span style={{ color: cardColor }}>{icon}</span>
      </div>
      <div className="tool-card-content">
        <h3 className="tool-card-title">{title}</h3>
        <p className="tool-card-description">{description}</p>
      </div>
      <div className="tool-card-arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </Link>
  );
};

export default ToolCard;
