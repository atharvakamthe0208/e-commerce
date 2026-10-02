import jwt from 'jsonwebtoken';

const generateToken = (id, isAdmin = false) => {
  return jwt.sign(
    { id, isAdmin },
    process.env.JWT_SECRET || 'supersecretjwtkey_ecommerce_demo_2026',
    {
      expiresIn: '7d',
    }
  );
};

export default generateToken;
