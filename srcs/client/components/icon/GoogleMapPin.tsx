import { MapPin } from 'lucide-react';

const GoogleMapPin = ({ size = 24, className = '' }) => {
  const gradientId = 'googleMapsLikeGradient';

  return (
    <>
      <svg
        width='0'
        height='0'
        style={{ position: 'absolute' }}
        aria-hidden='true'
      >
        <defs>
          <linearGradient id={gradientId} x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor='var(--lime)' />
            <stop offset='30%' stopColor='var(--blue)' />
            <stop offset='50%' stopColor='var(--yellow)' />
            <stop offset='100%' stopColor='var(--red)' />
          </linearGradient>
        </defs>
      </svg>

      {/* 2. <MapPin /> 아이콘 사용 */}
      <MapPin
        size={size}
        className={className}
        fill={`url(#${gradientId})`}
        stroke='white'
        strokeWidth={1.5}
      />
    </>
  );
};

export default GoogleMapPin;
