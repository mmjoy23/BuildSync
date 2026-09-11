import React from 'react';
import Card from '../../../components/common/Card';
import { propertyOverviewData } from '../../../data/ownerDashboardData';

/**
 * PropertyOverview
 * Donut / ring breakdown of units:
 * - Total Units: 76
 * - Occupied: 68 (green)
 * - Vacant: 8 (slate/gray)
 * - Maintenance: 2 (orange)
 */
function PropertyOverview() {
  const { totalUnits, occupied, vacant, maintenance } = propertyOverviewData;

  // SVG circular perimeter: 2 * Math.PI * 45 ≈ 282.74
  const circumference = 282.74;
  const occupiedPct = occupied / totalUnits;
  const vacantPct = vacant / totalUnits;
  const maintenancePct = maintenance / totalUnits;

  const occupiedStroke = occupiedPct * circumference;
  const vacantStroke = vacantPct * circumference;
  const maintenanceStroke = maintenancePct * circumference;

  return (
    <Card title="Property Overview">
      <div className="donut-chart-container">
        <div className="donut-graphic-wrapper">
          <svg className="donut-svg" viewBox="0 0 120 120">
            {/* Background ring */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="transparent"
              stroke="var(--color-divider)"
              strokeWidth="14"
            />
            {/* Occupied Segment */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="transparent"
              stroke="var(--color-success)"
              strokeWidth="14"
              strokeDasharray={`${occupiedStroke} ${circumference}`}
              strokeDashoffset="0"
            />
            {/* Vacant Segment */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="transparent"
              stroke="var(--slate-400)"
              strokeWidth="14"
              strokeDasharray={`${vacantStroke} ${circumference}`}
              strokeDashoffset={`-${occupiedStroke}`}
            />
            {/* Maintenance Segment */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="transparent"
              stroke="var(--color-warning)"
              strokeWidth="14"
              strokeDasharray={`${maintenanceStroke} ${circumference}`}
              strokeDashoffset={`-${occupiedStroke + vacantStroke}`}
            />
          </svg>

          {/* Center Info */}
          <div className="donut-center-info">
            <span className="donut-center-number">{totalUnits}</span>
            <span className="donut-center-label">Total Units</span>
          </div>
        </div>

        {/* Legend */}
        <div className="donut-legend">
          <div className="donut-legend__item">
            <span className="donut-legend__dot donut-legend__dot--occupied" />
            <span>Occupied:</span>
            <span className="donut-legend__count">{occupied}</span>
          </div>
          <div className="donut-legend__item">
            <span className="donut-legend__dot donut-legend__dot--vacant" />
            <span>Vacant:</span>
            <span className="donut-legend__count">{vacant}</span>
          </div>
          <div className="donut-legend__item">
            <span className="donut-legend__dot donut-legend__dot--maintenance" />
            <span>Maintenance:</span>
            <span className="donut-legend__count">{maintenance}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default PropertyOverview;
