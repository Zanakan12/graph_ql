// src/app/services/apiService.ts

const API_URL = 'https://zone01normandie.org/api/graphql-engine/v1/graphql';

/**
 * Fonction utilitaire pour envoyer une requête GraphQL
 * @param query - La requête GraphQL
 * @param variables - Les variables (optionnelles)
 */
export async function graphqlRequest(query: string, token: string, variables?: any) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error('GraphQL request failed');
  }

  const result = await response.json();
  return result.data;
}


/* -------------------------------------------
   1️⃣ Query pour récupérer les données utilisateur
-------------------------------------------- */
export const USER_QUERY = `
query {
    user {
        labels {
            labelName
        }
        attrs
        login
        totalUp
        totalDown
    }
}`;

/* -------------------------------------------
   2️⃣ Query pour récupérer les données des projets
-------------------------------------------- */
export const PROJECT_QUERY = (id: number) => `
query {
    transaction(
        where: {
            transaction_type: { type: { _eq: "xp" } },
            eventId: { _eq: ${id} }
        },
        order_by: { createdAt: desc }
    ) {
        amount
        isBonus
        attrs
        eventId
        createdAt
        object {
            name
            type
        }
    }
}`;

/* -------------------------------------------
   3️⃣ Query pour récupérer les données de cursus
-------------------------------------------- */
export const CURSUS_QUERY = `
query {
    user {
        events(where: { event: { object: { type: { _in: ["piscine", "module"] } } } }) {
            event {
                id
                object {
                    name
                    type
                }
            }
        }
    }
}`;

/* -------------------------------------------
   4️⃣ Query pour récupérer les informations détaillées d'un cursus
-------------------------------------------- */
export const CURSUS_INFO_QUERY = (id: number) => `
query {
    event(where: { id: { _eq: ${id} } }) {
        id
        startAt
        endAt
        object {
            name
            type
        }
        parent {
            id
            object {
                name
                type
            }
        }
    }
}`;

/* -------------------------------------------
   5️⃣ Query pour récupérer les données d'audit
-------------------------------------------- */
export const AUDIT_QUERY = (id: string) => `
query {
    audit(
        where: {
            auditorLogin: { _eq: "${id}" },
            _or: [
                { grade: { _is_null: true }, resultId: { _is_null: true } },
                { grade: { _is_null: false }, resultId: { _is_null: false } }
            ]
        },
        order_by: [{ group: { createdAt: desc } }],
        limit: 70
    ) {
        private {
            code
        }
        grade
        resultId
        group {
            captainLogin
            createdAt
            object {
                name
                type
            }
        }
    }
}`;

/* -------------------------------------------
   6️⃣ Query pour récupérer les XP par cursus
-------------------------------------------- */
export const XP_QUERY = (id: number) => `
query {
    transaction_aggregate(where: {
        type: { _eq: "xp" },
        eventId: { _eq: ${id} }
    }) {
        aggregate {
            sum {
                amount
            }
        }
    }
}`;

/* -------------------------------------------
   7️⃣ Query pour récupérer le niveau de l'utilisateur par cursus
-------------------------------------------- */
export const LEVEL_QUERY = (login: string, id: number) => `
query {
    event_user(where: { userLogin: { _eq: "${login}" }, eventId: { _eq: ${id} } }) {
        level
    }
}`;

/* -------------------------------------------
   7️⃣ Query pour récupérer le niveau de l'utilisateur par cursus
-------------------------------------------- */
export const UPDATE_USER_MUTATION = `
mutation UpdateUser($id: Int!, $email: String!, $attrs: jsonb!) {
  update_user_by_pk(
    pk_columns: { id: $id },
    _set: { email: $email, attrs: $attrs }
  ) {
    id
    email
    attrs
  }
}
`;

export const LAST_PROJECT_QUERY = `
query {
    progress(
        where: {
            object: { type: { _eq: "project" } },
            isDone: { _eq: false }
        }
        order_by: { createdAt: desc }
        limit: 1
    ) {
        createdAt
        object {
            name
            type
        }
        isDone
    }
}`;