import '../styles/selectCountyAndCourt.scss';

export default function SelectCountyAndCourt({ region, counties, courts, countyId, setCountyId, setCourtId }) {
  return (
    <div className="county-court-selection">
      <div className="title">{region.RegionName} course selection</div>
      <div className="wrap">
        <div>
          <select
            defaultValue={''}
            onChange={e => setCountyId(e.target.value)}
          >
            <option value="">Select County</option>
            {counties.map(({ RegionID: countyId, RegionName: countyName }) => (
              <option key={countyId} value={countyId}>{countyName}</option>
            ))}
          </select>
        </div>

        {countyId && (
          <div>
            <select
              defaultValue={''}
              onChange={e => setCourtId(e.target.value)}
            >
              <option value="">Select Court</option>
              {courts.map(({ RegionID: courtId, RegionName: courtName }) => (
                <option key={courtId} value={courtId}>{courtName}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}