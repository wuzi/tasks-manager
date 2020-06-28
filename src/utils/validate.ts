import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { validate as cvValidator } from 'class-validator';

export default async function validate<T, V>(cls: ClassType<T>, plain: V) {
  const object = plainToClass(cls, plain);
  return cvValidator(object);
}
