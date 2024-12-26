// types/express.d.ts

import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;  // Or use a more specific type for the decoded JWT
    }
  }
}


// interface User {
//     id: string;
//     username: string;
//   }
  
//   declare global {
//     namespace Express {
//       interface Request {
//         user?: User;
//       }
//     }
//   }
  