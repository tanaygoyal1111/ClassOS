import { Request, Response, NextFunction } from 'express';
import { assignmentQueue, GenerationJobData } from '../queue/assignmentQueue.js';

/**
 * POST /api/v1/generate
 * Adds an assignment generation job to the queue.
 */
export const addGenerationJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { formData, extractedText } = req.body as GenerationJobData;

    if (!formData || !extractedText) {
      return res.status(400).json({ success: false, error: 'Missing formData or extractedText in request body.' });
    }

    const job = await assignmentQueue.add('generate-paper', { formData, extractedText });

    return res.status(202).json({
      success: true,
      jobId: job.id,
      message: 'Job added to queue'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/job-status/:jobId
 * Fetches the status of the generated job.
 */
export const getJobStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobId = req.params.jobId as string;
    const job = await assignmentQueue.getJob(jobId);

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found.' });
    }

    const state = await job.getState();

    if (state === 'completed') {
      if (!job.returnvalue) {
        return res.status(200).json({
          status: 'failed',
          error: 'Generation completed but produced no output. Please try again.'
        });
      }
      return res.status(200).json({
        status: 'completed',
        result: job.returnvalue
      });
    }

    if (state === 'failed') {
      return res.status(200).json({
        status: 'failed',
        error: job.failedReason
      });
    }

    // Default to processing for active, waiting, delayed etc.
    return res.status(200).json({
      status: 'processing'
    });
  } catch (error) {
    next(error);
  }
};
