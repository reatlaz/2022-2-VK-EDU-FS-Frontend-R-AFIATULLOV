export interface ITranslateParams {
  text: string
  // from: string
  to: string
}

interface IApiResponseItem {
  detectedLanguage: {
    language: string
    score: number
  },
  translations: [
    {
      text: string
      to: string
    }
  ]
}

export interface IApiResponse extends Array<IApiResponseItem>{}

export type TTranslateFunction = (params: ITranslateParams) => Promise<string | Response>
