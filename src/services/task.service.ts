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
}
