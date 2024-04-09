import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  accessTtl: parseInt(process.env.JWT_ACCESS_TOKEN_TTL || '3600', 10),
  refreshTtl: parseInt(process.env.JWT_REFRESH_TOKEN_TTL || '604800', 10),
  audience: process.env.JWT_TOKEN_AUDIENCE,
  issuer: process.env.JWT_TOKEN_ISSUER,
}));
