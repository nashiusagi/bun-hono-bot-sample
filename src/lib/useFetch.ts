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
			return res.json();
		});
};

const handleServerSideErrors = async (res: Response) => {
	if (!res) return new Response("Abort Error", undefined);
	if (res.ok) return res;

	switch (res.status) {
		case 400:
			return new Response("Bad Request", { status: res.status });
		case 404:
			return new Response("Not Found", { status: res.status });
		default:
			return new Response("Unhandled Error", { status: res.status });
	}
};

const hasJsonContent = (res: Response): boolean => {
	const contentType = res.headers.get("Content-Type");

	return !!contentType?.includes("application/json");
};
