import React from 'react';

const StatsCard = ({ icon: Icon, title, value, color }) => {
  // Use the color prop to create a tinted background and colored text/border
  const cardStyle = {
    backgroundColor: `${color}15`, // 15 is hex for ~8% opacity tint if color is hex
    borderLeft: `4px solid ${color}`
  };

  return (
    <div className="stats-card" style={cardStyle}>
      <div className="stats-icon-container" style={{ color: color }}>
        {Icon && <Icon className="stats-icon" size={28} />}
      </div>
      <div className="stats-content">
        <h3 className="stats-value" style={{ color: color }}>{value}</h3>
        <p className="stats-title">{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;
