import { each } from 'bluebird';
import { randomUUID } from 'crypto';
import * as Knex from 'knex';
import _ from 'lodash';
import { Model, ModelObject } from 'objection';

import { appConfig } from '../../src/config';
import { insertReview } from '../../src/functions';
import { Course, Review, Semester, User } from '../../src/models';

export async function seed(knex: Knex): Promise<void> {
  Model.knex(knex);

  if (appConfig.environment === 'production') {
    return;
  }

  const [users, courses, semesters] = await Promise.all([
    User.query(),
    Course.query(),
    Semester.query(),
  ]);

  if (!users || !courses || !semesters) {
    return;
  }

  const randomBody = () => {
    return (
      'I really liked that this class review contains the number ' +
      _.random(1000)
    );
  };
  const timestamp = +new Date();

  const reviews: ModelObject<Review>[] = [];
  courses.forEach((course) => {
    for (let i = 0; i < _.random(16); i++) {
      const user = _.sample(users);
      const semester = _.sample(semesters);

      if (!user || !semester) {
        continue;
      }
      if (!user.last_signed_in || typeof user.last_signed_in === 'string')
        user.last_signed_in = timestamp;

      const review: ModelObject<Review> = {
        id: randomUUID(),
        author_id: user.id,
        author: user,
        course_id: course.id,
        course: course,
        semester_id: semester.id,
        semester: semester,
        difficulty: _.random(1, 5),
        rating: _.random(1, 5),
        workload: _.random(1, 5),
        body: randomBody(),
        meta: null,
        created: timestamp,
        updated: null,
        reports: [],
      };
      reviews.push(review);
    }
  });

  await each(reviews, async (review) => {
    await insertReview(review, review.author);
  });
}
