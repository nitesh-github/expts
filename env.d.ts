declare namespace NodeJS {
    interface ProcessEnv {
      DBURL: string;
      PORT?: string;
      JWT_SECRET:string;
    }
  }
  