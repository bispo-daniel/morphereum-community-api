import cors from 'cors';

const corsMiddleware = () => {
  return cors({
    origin: ['https://localhost:5173', 'https://morphereum.netlify.app'],
  });
};

export default corsMiddleware;
