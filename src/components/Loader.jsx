const Loader = ({ size = 50, color = "#014785" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width={size} height={size} aria-label="Loading...">
    <circle cx="25" cy="25" r="20" fill="none" stroke={color} strokeWidth="4" strokeDasharray="31.4 31.4" strokeLinecap="round" transform="rotate(-90, 25, 25)">
      <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
    </circle>
  </svg>
);

export default Loader;