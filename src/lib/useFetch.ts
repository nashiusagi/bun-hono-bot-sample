interface FetchRequest {
  url: string;
  options: object;
}

export const useFetch = <T>(request: FetchRequest): Promise<T> => {
  return fetch(request.url, request.options)
    .catch((e) => {
      console.log(e)
      throw Error(e);
    })
    .then(handleServerSideErrors)
    .then((res) => {
      return res.text();
    });
};

const handleServerSideErrors = async (res: Response) => {
  if (!res) return new Response("Abort Error", undefined);
  if (res.ok) return res;

  switch (res.status) {
    case 400:
      console.log("Bad Request")
      return new Response("Bad Request", { status: res.status });
    case 404:
      console.log("Not Found")
      return new Response("Not Found", { status: res.status });
    default:
      console.log("Unhandled Error")
      return new Response("Unhandled Error", { status: res.status });
  }
};

const hasJsonContent = (res: Response): boolean => {
  const contentType = res.headers.get("Content-Type");

  return !!contentType?.includes("application/json");
};
