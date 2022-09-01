type FetchConfig = {
  url: string;
  init: RequestInit;
};
export const sequentialFetch = async (configs: FetchConfig[]) => {
  const responses: Response[] = [];
  for (let config of configs) {
    const res = await fetch(config.url, config.init);
    responses.push(res);
  }
  return Promise.all(responses.map((res) => res.json()));
};
