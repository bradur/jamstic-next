export type FetchProps = {
  url: string
  body?: BodyInit
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: HeadersInit
}

const defaultHeaders = {
  'content-type': 'application/json;charset=UTF-8',
}

export const getApi = async <T>(props: FetchProps): Promise<T> => fetchApi({ ...props, method: 'GET' })
export const postApi = async <T>(props: FetchProps): Promise<T> => fetchApi({ ...props, method: 'POST' })
export const deleteApi = async <T>(props: FetchProps): Promise<T> => fetchApi({ ...props, method: 'DELETE' })

const fetchApi = async <T>({ url, body, method, headers = defaultHeaders }: FetchProps): Promise<T> => {
  const response = await window.fetch(url, {
    method,
    headers,
    body: body,
  })

  type JSONResponse = {
    data?: T
    errors?: Array<{ message: string }>
  }
  const { data, errors }: JSONResponse = await response.json()
  if (response.ok) {
    if (data) {
      return data
    }
  }
  const errorMessage = errors?.map((e) => e.message).join('\n') ?? 'unknown'
  const error = new Error(errorMessage)
  return Promise.reject(error)
}
