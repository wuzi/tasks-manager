import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { validate as cvValidator } from 'class-validator';

/**
 * Validates an object using a class.
 * @param cls - The class to be used as model
 * @param plain - The object to be validated
 */
export default async function validate<T, V>(cls: ClassType<T>, plain: V) {
  const object = plainToClass(cls, plain);
  return cvValidator(object);
}
