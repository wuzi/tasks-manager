import { getConnection, FindManyOptions } from 'typeorm';
import Task from '../models/task.model';

export default class TaskService {
  /**
   * Find all tasks in the database and paginate the results
   * @param options Defines a special criteria to find specific entities.
   */
  static findAll(options?: FindManyOptions<Task>): Promise<[Task[], number]> {
    return getConnection().getRepository(Task).findAndCount(options);
  }

  /**
   * Find one task by id
   * @param id The id of the task
   */
  static findById(id: number): Promise<Task | undefined> {
    return getConnection().getRepository(Task).findOne(id);
  }
}
