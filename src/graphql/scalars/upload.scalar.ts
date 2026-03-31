import { GraphQLScalarType } from 'graphql';
import { GraphQLError } from 'graphql';

export class UploadScalar extends GraphQLScalarType<any, any> {
  description = 'File upload scalar type';

  _parseValue(value: any): any {
    if (value && typeof value === 'object' && value.hasOwnProperty('file')) {
      return value;
    }
    throw new GraphQLError('Upload value invalid.');
  }

  _serialize(value: any): any {
    return value;
  }

  _parseLiteral(ast: any): any {
    throw new GraphQLError('Upload scalar literal unsupported.');
  }

  parseValue = this._parseValue;
  serialize = this._serialize;
  parseLiteral = this._parseLiteral;
}

export const Upload = UploadScalar;
