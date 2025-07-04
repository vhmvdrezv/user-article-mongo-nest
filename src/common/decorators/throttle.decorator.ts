import { Throttle } from '@nestjs/throttler';

export const ThrottleStrict = () => Throttle({
  short: { limit: 1, ttl: 1000 },
  medium: { limit: 5, ttl: 60000 },
});

export const ThrottleModerate = () => Throttle({
  short: { limit: 3, ttl: 1000 },
  medium: { limit: 30, ttl: 60000 },
});

export const ThrottleRelaxed = () => Throttle({
  short: { limit: 10, ttl: 1000 },
  medium: { limit: 200, ttl: 60000 },
});


export const ThrottleAuth = () => Throttle({
  short: { limit: 1, ttl: 1000 },
  medium: { limit: 5, ttl: 60000 },
  long: { limit: 20, ttl: 3600000 },
});

export const SkipThrottle = () => Throttle({ default: { limit: 0, ttl: 0 } });