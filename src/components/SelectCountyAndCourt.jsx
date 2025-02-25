import '../styles/selectCountyAndCourt.scss';
import { useEffect } from 'react';

export default function SelectCountyAndCourt(
  {
    region,
    counties,
    courts,
    countyId,
    setCountyId,
    setCourtId,
    setProducts,
    setCourts,
    courtId,
    setSelectedUpgrades,
  },
) {

  useEffect(() => {
    if (!countyId) {
      setCourts([]);
      setCourtId('');
    }
  }, [countyId]);

  useEffect(() => {
    if (!courtId) {
      setProducts([]);
      setSelectedUpgrades([]);
    }

  }, [courtId]);

  return (
    <div className="county-court-selection">
      <div className="title">{region.RegionName} course selection</div>
      <div className="wrap">
        <div>
          <select
            value={countyId}
            onChange={e => {
              setCountyId(e.target.value);
              setProducts([]);
              setSelectedUpgrades([]);
              setCourts([]);
              setCourtId('');
            }}
          >
            <option value="">Select County</option>
            {counties.map(({ RegionID: countyId, RegionName: countyName }) => (
              <option key={countyId} value={countyId}>{countyName}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={courtId}
            onChange={e => {
              setCourtId(e.target.value);
              setSelectedUpgrades([]);
            }}
            disabled={!countyId}
          >
            <option value="">Select Court</option>
            {courts.map(({ RegionID: courtId, RegionName: courtName }) => (
              <option key={courtId} value={courtId}>{courtName}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}