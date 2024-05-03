interface FetchRequest {
	url: string;
	options: object;
}

export const useFetch = <T>(request: FetchRequest): Promise<T> => {
	return fetch(request.url, request.options)
		.catch((e) => {
			throw Error(e);
		})
		.then(handleServerSideErrors)
		.then((res) => {
      return res.json()
    });
};

const handleServerSideErrors = async (res: Response) => {
	// NOTE: AbortErrorが発生した場合のみ res === void になりうる
	if (!res) return new Response("Abort Error", undefined);
	if (res.ok) return res;

	let body = undefined;
	try {
		body = await res.json();
	} catch {
		console.error("Non json response");
	}

	switch (res.status) {
		case 400:
			throw new Response("Bad Request", {status: res.status});
		case 404:
			throw new Response("Not Found", {status: res.status});
		default:
			throw new Response("Unhandled Error", {status: res.status});
	}
};

const hasJsonContent = (res: Response): boolean => {
	const contentType = res.headers.get("Content-Type");

	return !!contentType?.includes("application/json");
};
