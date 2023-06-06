import cron from 'node-cron';
import passwordExipiration from '../services/isPasswordExpired';
import checkExpiredProducts from '../utils/productExpiration';
import 'dotenv/config';

export const schedulingJob = () => {
  const task = cron.schedule(process.env.JOB_SCHEDULING_TIME, passwordExipiration);
  task.start();
};

export const isProductExpiredschedulingJob = () => {
  const task = cron.schedule(process.env.JOB_SCHEDULING_TIME, checkExpiredProducts);
  task.start();
};
