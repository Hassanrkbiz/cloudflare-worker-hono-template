import { Hono } from 'hono';
import { ExampleController } from '../controllers/example.controller';

const exampleRouter = new Hono()

exampleRouter.get("/", ExampleController.getAll);
exampleRouter.get("/:id", ExampleController.getById);
exampleRouter.post("/", ExampleController.create);
exampleRouter.put("/:id", ExampleController.update);
exampleRouter.delete("/:id", ExampleController.delete);

export default exampleRouter;