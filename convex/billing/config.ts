const isProduction = process.env.POLAR_ENVIRONMENT === 'production';

export const POLAR_CONFIG = {
  productId: isProduction
    ? '39fcc208-1195-45d5-a39a-4bedb5ce08dc'
    : 'bdea346d-5096-4cf7-b21c-f355ee41eaa4',
  successPath: '/?success=true',
};
