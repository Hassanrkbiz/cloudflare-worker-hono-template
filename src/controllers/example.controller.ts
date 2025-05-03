import { crypto } from 'node:crypto';
import { Hono } from 'hono';
import { Example } from '../models/example.model';
import { z } from 'zod';

// Input validation schema
const exampleSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

type ExampleInput = z.infer<typeof exampleSchema>;

export class ExampleController {
  // Get all examples
  static async getAll(ctx: Hono.Context) {
    try {
      const examples: Example[] = await ctx.env.EXAMPLE_DB.list();
      return ctx.json(examples);
    } catch (error) {
      return ctx.json({ error: 'Failed to fetch examples' }, 500);
    }
  }

  // Get single example by ID
  static async getById(ctx: Hono.Context) {
    const id = ctx.req.param('id');
    
    try {
      const example: Example | null = await ctx.env.EXAMPLE_DB.get(id);
      if (!example) {
        return ctx.json({ error: 'Example not found' }, 404);
      }
      return ctx.json(example);
    } catch (error) {
      return ctx.json({ error: 'Failed to fetch example' }, 500);
    }
  }

  // Create new example
  static async create(ctx: Hono.Context) {
    const body = await ctx.req.json();
    
    try {
      const validatedData = exampleSchema.parse(body);
      const example: Example = {
        ...validatedData,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await ctx.env.EXAMPLE_DB.put(example.id, example);
      return ctx.json(example, 201);
    } catch (error) {
      return ctx.json({ error: 'Invalid request data' }, 400);
    }
  }

  // Update example
  static async update(ctx: Hono.Context) {
    const id = ctx.req.param('id');
    const body = await ctx.req.json();
    
    try {
      const example: Example | null = await ctx.env.EXAMPLE_DB.get(id);
      if (!example) {
        return ctx.json({ error: 'Example not found' }, 404);
      }

      const validatedData = exampleSchema.parse(body);
      const updatedExample: Example = {
        ...example,
        ...validatedData,
        updatedAt: new Date(),
      };

      await ctx.env.EXAMPLE_DB.put(id, updatedExample);
      return ctx.json(updatedExample);
    } catch (error) {
      return ctx.json({ error: 'Failed to update example' }, 500);
    }
  }

  // Delete example
  static async delete(ctx: Hono.Context) {
    const id = ctx.req.param('id');
    
    try {
      const example: Example | null = await ctx.env.EXAMPLE_DB.get(id);
      if (!example) {
        return ctx.json({ error: 'Example not found' }, 404);
      }

      await ctx.env.EXAMPLE_DB.delete(id);
      return ctx.json({ message: 'Example deleted successfully' });
    } catch (error) {
      return ctx.json({ error: 'Failed to delete example' }, 500);
    }
  }
}
