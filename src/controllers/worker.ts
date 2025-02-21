import { parentPort, workerData } from "worker_threads";
import fs from "fs";
import csv from "csv-parser";
import path from "path";
import User from "../models/User";
import { Request, Response } from 'express';

const { filePath, imageName } = workerData;
import mongoose from "mongoose";

export const processCsvFile = async () => {
  const results: Record<string, string>[] = [];
  const promises: Promise<any>[] = [];

  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.DBURL)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => {
          console.error('Failed to connect to MongoDB', err);
          throw err;
        });
    }
    // Wrap the CSV processing into a promise
    const fileProcessingPromise = new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath).pipe(csv());
      
      stream.on("data", async (data) => {

        let newdata = { name: data.Name, email: data.Email };
        // Perform upsert operation
        const checkUserPromise = User.findOne({ email: data.Email }).then((user) => {
          if (!user) results.push(newdata);
        });

        promises.push(checkUserPromise); // Collect all promises
        
      });

      stream.on("end", async () => {
        
        await Promise.all(promises); // Ensure all `findOne` queries finish
        console.log("lenght test = ",results.length);

          if (results.length > 0) {
            await User.insertMany(results, { ordered: false }) // Ignore duplicates
              .catch((err) => console.error("InsertMany error:", err.message));
          }
        
        const oldImagePath = path.join(process.cwd(), 'public/uploads/', imageName);
        if (fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              console.error('Error deleting old file:', err);
            } else {
              console.log('Old file deleted successfully');
            }
          });
        }
        resolve(results); // Resolve after processing is complete
      });

      stream.on("error", (err) => {
        reject(new Error(`Error in CSV processing: ${err.message}`));
      });
    });

    const processedData = await fileProcessingPromise;
    // After processing is done, send back success message
    parentPort?.postMessage({ status: 'success', data: processedData, testmsg: "testing" });

  } catch (error) {
    if (error instanceof Error) {
      parentPort?.postMessage({ status: 'error', message: error.message });
    } else {
      console.error("Unexpected error:", error);
    }
  }
};

processCsvFile();