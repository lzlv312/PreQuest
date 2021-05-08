import { BaseOption } from '@prequest/types'
export interface Request extends BaseOption {
  requestType?: 'json' | 'form' | ({} & string)
}

export interface Response {
  data: any
  status: number
  statusText: string
  headers: Record<string, any>
}
