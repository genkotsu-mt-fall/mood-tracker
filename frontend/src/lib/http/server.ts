// import 'server-only';
// import { HttpJsonResult, postJsonAuth, PostJsonOptions } from './json';
// import { cookies } from 'next/headers';

// export async function postJsonWithCookieAuth<T>(
//   url: string,
//   payload: unknown,
//   opts?: Omit<PostJsonOptions, 'headers'>,
// ): Promise<HttpJsonResult<T>> {
//   const cookieStore = await cookies();
//   const token = cookieStore.get('_access')?.value ?? '';
//   return postJsonAuth<T>(url, payload, token, opts);
// }
