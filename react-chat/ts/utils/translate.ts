
import * as T from "./types";

const API = 'https://microsoft-translator-text.p.rapidapi.com/translate?';

export const translate: T.TTranslateFunction = async (args: T.ITranslateParams) => {
  const url = `${API}to%5B0%5D=${args.to}&api-version=3.0&profanityAction=NoAction&textType=plain`
  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': 'df5ffa97f3mshfa5277882376ad1p1db7b7jsnb69ba524116a',
      'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
    },
    body: `[{ "Text": "${args.text}" }]`
  }

  const cache = await caches.open('translate')
  const request = new Request(url, options)
  const cachedResp = await cache.match(request)

  if (cachedResp) {
    return cachedResp;
  } else {
    let res = ''
    fetch(url, options)
      .then(response => response.json())
      .then((data: T.IApiResponse) => {
        res = data[0].translations[0].text
        console.log(data)
      });
    await cache.put(request, new Response(res))
    return res
  }
};