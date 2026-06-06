import { Request, Response } from 'express';
import { Group } from '../models/Group.js';

export const createGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    const teacherId = req.headers['x-user-id'] as string; // Expecting teacherId in headers for now

    if (!teacherId) {
      res.status(401).json({ error: 'Unauthorized: Missing user ID' });
      return;
    }

    if (!name) {
      res.status(400).json({ error: 'Group name is required' });
      return;
    }

    const newGroup = await Group.create({
      name,
      description,
      teacherId,
      students: [],
      assignments: []
    });

    res.status(201).json({ success: true, data: newGroup });
  } catch (error: any) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getGroups = async (req: Request, res: Response): Promise<void> => {
  try {
    const teacherId = req.headers['x-user-id'] as string;

    if (!teacherId) {
      res.status(401).json({ error: 'Unauthorized: Missing user ID' });
      return;
    }

    const groups = await Group.find({ teacherId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: groups.length, data: groups });
  } catch (error: any) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getGroupById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const teacherId = req.headers['x-user-id'] as string;

    if (!teacherId) {
      res.status(401).json({ error: 'Unauthorized: Missing user ID' });
      return;
    }

    const group = await Group.findOne({ _id: id, teacherId });
    if (!group) {
      res.status(404).json({ error: 'Group not found' });
      return;
    }

    res.status(200).json({ success: true, data: group });
  } catch (error: any) {
    console.error('Error fetching group:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
