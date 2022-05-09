import { badRequest, forbidden } from '@hapi/boom';

import { insertReview } from '../../functions';
import { MutationResolvers } from '../../graphql';
import { mapReview } from '../../mappers';
import { Review } from '../../models';
import { reviewSchema } from '../schema';

type Resolver = MutationResolvers['insertReview'];

export const resolver: Resolver = async (_, { review }, { user }) => {
  if (user == null) {
    throw forbidden();
  }

  const { value, error } = await reviewSchema.validate(review);
  if (error) {
    throw badRequest(error.message);
  }

  // enforce distinct author/course/semester tuples across reviews
  const conflicting = await Review.query()
    .select('id')
    .where('course_id', review.course_id)
    .andWhere('semester_id', review.semester_id);
  if (conflicting.length > 0) {
    throw forbidden(
      'You have already authored a review for this course and semester.',
    );
  }

  return mapReview(await insertReview(value, user), user);
};
