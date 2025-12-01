export const getCompanyColor = (company) => {
  const colors = {
    tier: '#2ECC71',
    lime: '#A7E815',
    bird: '#000000',
  };
  return colors[company] || '#95A5A6';
};

export const getCompanyName = (company) => {
  const names = {
    tier: 'Tier',
    lime: 'Lime',
    bird: 'Bird',
  };
  return names[company] || company;
};

export const getVehicleIcon = (type) => {
  return type === 'scooter' 
    ? '<svg viewBox="0 0 24 24" fill="white" width="20" height="20"><circle cx="6" cy="19" r="2" stroke="white" stroke-width="2" fill="none"/><circle cx="18" cy="19" r="2" stroke="white" stroke-width="2" fill="none"/><path d="M6 19h12M10 5l4 14M8 9h8" stroke="white" stroke-width="2"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="white" width="20" height="20"><circle cx="5.5" cy="17.5" r="3.5" stroke="white" stroke-width="2" fill="none"/><circle cx="18.5" cy="17.5" r="3.5" stroke="white" stroke-width="2" fill="none"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V9l-3 4-2 3h4.5" stroke="white" stroke-width="2"/><path d="m12 17.5 3.5-4 2-5h-4" stroke="white" stroke-width="2"/></svg>';
};

export const formatPrice = (price) => {
  return `$${price.toFixed(2)}`;
};

export const formatBattery = (battery) => {
  return `${battery}%`;
};

export const getBatteryColor = (battery) => {
  if (battery >= 70) return 'text-success';
  if (battery >= 40) return 'text-accent';
  return 'text-error';
};

export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateCardNumber = (number) => {
  const cleaned = number.replace(/\s/g, '');
  return /^\d{16}$/.test(cleaned);
};

export const validateExpiry = (expiry) => {
  return /^\d{2}\/\d{2}$/.test(expiry);
};

export const validateCVC = (cvc) => {
  return /^\d{3,4}$/.test(cvc);
};

export const formatCardNumber = (value) => {
  const cleaned = value.replace(/\s/g, '');
  const chunks = cleaned.match(/.{1,4}/g);
  return chunks ? chunks.join(' ') : cleaned;
};

export const formatExpiry = (value) => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  return cleaned;
};
