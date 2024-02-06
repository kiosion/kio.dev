export const API_CONFIG_ROUTE = /.*\/api\/get\/config.*/;
export const API_POST_ROUTE = /.*\/api\/get\/post.*/;
export const API_POST_MANY_ROUTE = /.*\/api\/get\/post\/many.*/;
export const API_PROJECT_ROUTE = /.*\/api\/get\/project.*/;
export const API_PROJECT_MANY_ROUTE = /.*\/api\/get\/project\/many.*/;

export const stubResponse = ({
  data,
  meta = {},
  errors = [],
  code = 200
}: {
  data?: Record<PropertyKey, unknown> | Record<PropertyKey, unknown>[];
  meta?: Record<PropertyKey, unknown>;
  errors?: string[];
  code?: number;
}) => {
  return {
    status: code,
    body: JSON.stringify({
      code,
      errors,
      data,
      meta
    }),
    headers: {
      'content-type': 'application/json; charset=utf-8'
    }
  };
};
