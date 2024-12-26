import { Request, Response, NextFunction } from 'express';
import basicAuth from 'basic-auth';

// This is a simple example with hardcoded username and password.
const USERS = [
  { username: 'admin', password: 'Nsingh@991' }, // Example user
];

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction):void => {
  const user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  const validUser = USERS.find(
    (u) => u.username === user.name && u.password === user.pass
  );

  if (!validUser) {
    res.status(401).json({ message: 'Invalid username or password' });
    return;
  }

  // User is authenticated, proceed to the next middleware or route
  //next();
};
