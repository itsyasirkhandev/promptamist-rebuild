import { Schema } from 'effect';

export class Unauthorized extends Schema.TaggedErrorClass<Unauthorized>()(
  'Unauthorized',
  {
    message: Schema.String,
  },
) {}

export class NotFound extends Schema.TaggedErrorClass<NotFound>()('NotFound', {
  message: Schema.String,
  resource: Schema.optional(Schema.String),
}) {}

export class ValidationError extends Schema.TaggedErrorClass<ValidationError>()(
  'ValidationError',
  {
    message: Schema.String,
    fields: Schema.optional(Schema.Record(Schema.String, Schema.String)),
  },
) {}

export class LimitExceeded extends Schema.TaggedErrorClass<LimitExceeded>()(
  'LimitExceeded',
  {
    message: Schema.String,
    limit: Schema.optional(Schema.Number),
  },
) {}

export class InternalError extends Schema.TaggedErrorClass<InternalError>()(
  'InternalError',
  {
    message: Schema.String,
  },
) {}
