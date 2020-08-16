import { injectable } from 'tsyringe';
import { FindManyOptions, getConnection } from 'typeorm';
import Task from '../models/task.model';

@injectable()
export default class TaskService {
  /**
   * Find all tasks in the database and paginate the results
   * @param options Defines a special criteria to find specific entities.
   */
  public findAll(options?: FindManyOptions<Task>): Promise<[Task[], number]> {
    return getConnection().getRepository(Task).findAndCount(options);
  }

  /**
   * Find one task by id
   * @param id The id of the task
   */
  public findById(id: number): Promise<Task | undefined> {
    return getConnection().getRepository(Task).findOne(id);
  }

  /**
   * Creates a new task instance and copies all properties from data into a new task.
   * Note that it copies only properties that are present in task model.
   * @param data The data of the task
   */
  public create(data: Partial<Task>): Task {
    const task = { ...data };
    task.status = data.status || 'pending';
    return getConnection().getRepository(Task).create(task);
  }

  /**
   * Saves a task entity in the database.
   * If it does not exist then inserts, otherwise updates.
   * @param task The task to be saved
   */
  public save(task: Task): Promise<Task> {
    return getConnection().getRepository(Task).save(task);
  }
}
