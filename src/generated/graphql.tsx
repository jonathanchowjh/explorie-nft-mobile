import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CreateFirstTypeInput = {
  status: Status;
};

export type FirstType = {
  __typename?: 'FirstType';
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  status: Status;
  updatedAt?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createFirstType?: Maybe<FirstType>;
  updateFirstType?: Maybe<FirstType>;
};


export type MutationCreateFirstTypeArgs = {
  args: CreateFirstTypeInput;
};


export type MutationUpdateFirstTypeArgs = {
  id: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  getFirstType?: Maybe<Array<Maybe<FirstType>>>;
};


export type QueryGetFirstTypeArgs = {
  status: Status;
};

export enum Status {
  Completed = 'Completed',
  NotStarted = 'NotStarted',
  OnGoing = 'OnGoing'
}

export type CreateFirstTypeMutationVariables = Exact<{
  args: CreateFirstTypeInput;
}>;


export type CreateFirstTypeMutation = { __typename?: 'Mutation', createFirstType?: Maybe<{ __typename?: 'FirstType', id: string }> };

export type UpdateFirstTypeMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UpdateFirstTypeMutation = { __typename?: 'Mutation', updateFirstType?: Maybe<{ __typename?: 'FirstType', id: string }> };

export type GetFirstTypesQueryVariables = Exact<{
  status: Status;
}>;


export type GetFirstTypesQuery = { __typename?: 'Query', getFirstType?: Maybe<Array<Maybe<{ __typename?: 'FirstType', id: string }>>> };


export const CreateFirstTypeDocument = gql`
    mutation CreateFirstType($args: CreateFirstTypeInput!) {
  createFirstType(args: $args) {
    id
  }
}
    `;
export type CreateFirstTypeMutationFn = Apollo.MutationFunction<CreateFirstTypeMutation, CreateFirstTypeMutationVariables>;

/**
 * __useCreateFirstTypeMutation__
 *
 * To run a mutation, you first call `useCreateFirstTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFirstTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFirstTypeMutation, { data, loading, error }] = useCreateFirstTypeMutation({
 *   variables: {
 *      args: // value for 'args'
 *   },
 * });
 */
export function useCreateFirstTypeMutation(baseOptions?: Apollo.MutationHookOptions<CreateFirstTypeMutation, CreateFirstTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateFirstTypeMutation, CreateFirstTypeMutationVariables>(CreateFirstTypeDocument, options);
      }
export type CreateFirstTypeMutationHookResult = ReturnType<typeof useCreateFirstTypeMutation>;
export type CreateFirstTypeMutationResult = Apollo.MutationResult<CreateFirstTypeMutation>;
export type CreateFirstTypeMutationOptions = Apollo.BaseMutationOptions<CreateFirstTypeMutation, CreateFirstTypeMutationVariables>;
export const UpdateFirstTypeDocument = gql`
    mutation UpdateFirstType($id: ID!) {
  updateFirstType(id: $id) {
    id
  }
}
    `;
export type UpdateFirstTypeMutationFn = Apollo.MutationFunction<UpdateFirstTypeMutation, UpdateFirstTypeMutationVariables>;

/**
 * __useUpdateFirstTypeMutation__
 *
 * To run a mutation, you first call `useUpdateFirstTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFirstTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFirstTypeMutation, { data, loading, error }] = useUpdateFirstTypeMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUpdateFirstTypeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFirstTypeMutation, UpdateFirstTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateFirstTypeMutation, UpdateFirstTypeMutationVariables>(UpdateFirstTypeDocument, options);
      }
export type UpdateFirstTypeMutationHookResult = ReturnType<typeof useUpdateFirstTypeMutation>;
export type UpdateFirstTypeMutationResult = Apollo.MutationResult<UpdateFirstTypeMutation>;
export type UpdateFirstTypeMutationOptions = Apollo.BaseMutationOptions<UpdateFirstTypeMutation, UpdateFirstTypeMutationVariables>;
export const GetFirstTypesDocument = gql`
    query GetFirstTypes($status: Status!) {
  getFirstType(status: $status) {
    id
  }
}
    `;

/**
 * __useGetFirstTypesQuery__
 *
 * To run a query within a React component, call `useGetFirstTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFirstTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFirstTypesQuery({
 *   variables: {
 *      status: // value for 'status'
 *   },
 * });
 */
export function useGetFirstTypesQuery(baseOptions: Apollo.QueryHookOptions<GetFirstTypesQuery, GetFirstTypesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFirstTypesQuery, GetFirstTypesQueryVariables>(GetFirstTypesDocument, options);
      }
export function useGetFirstTypesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFirstTypesQuery, GetFirstTypesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFirstTypesQuery, GetFirstTypesQueryVariables>(GetFirstTypesDocument, options);
        }
export type GetFirstTypesQueryHookResult = ReturnType<typeof useGetFirstTypesQuery>;
export type GetFirstTypesLazyQueryHookResult = ReturnType<typeof useGetFirstTypesLazyQuery>;
export type GetFirstTypesQueryResult = Apollo.QueryResult<GetFirstTypesQuery, GetFirstTypesQueryVariables>;

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;
    