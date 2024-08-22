import { gql } from '@apollo/client';

export const GET_TASK = gql`
  query GetTasks($userId: Int!) {
    getTasks(userId: $userId) {
      id
      name
      dueDate
      status
      description
    }
  }
`;

