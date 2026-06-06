import { Queue, Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis.js';
import { AssignmentFormData } from '../utils/promptBuilder.js';
import { generateAssignment } from '../services/llmService.js';
import { AssignmentResponse } from '../schemas/assignmentSchema.js';

export interface GenerationJobData {
  formData: AssignmentFormData;
  extractedText: string;
}

// Queue Instance
export const assignmentQueue = new Queue<GenerationJobData, AssignmentResponse, 'generate-paper'>(
  'generation-queue',
  { connection: redisConnection as any }
);

// Worker Instance
export const assignmentWorker = new Worker<GenerationJobData, AssignmentResponse, 'generate-paper'>(
  'generation-queue',
  async (job: Job<GenerationJobData, AssignmentResponse, 'generate-paper'>) => {
    try {
      const { formData, extractedText } = job.data;
      
      await job.updateProgress(10);
      
      const assignment = await generateAssignment(formData, extractedText);
      await job.updateProgress(100);
      
      return assignment as AssignmentResponse;
    } catch (error: any) {
      console.error(`[Worker Error] Job ${job.id} failed:`, error);
      throw new Error(error?.message || "Unknown error occurred during generation"); // Crucial for BullMQ
    }
  },
  { connection: redisConnection as any }
);

// Worker Listeners
assignmentWorker.on('completed', (job) => {
  console.log(`[Worker] Job ${job.id} completed successfully.`);
});

assignmentWorker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed with error: ${err.message}`);
});
