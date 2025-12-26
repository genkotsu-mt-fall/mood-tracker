import {
  badRequest,
  e2eScenarioRules,
  ok,
  unauthorized,
  withE2E,
} from '@/e2e/utils';
import { AuthLoginBody } from '@genkotsu-mt-fall/shared/schemas';

type LoginBody = Partial<AuthLoginBody>;

export const POST = withE2E(async (req): Promise<Response> => {
  const body = (await req.json().catch(() => ({}))) as LoginBody;
  const { email, password } = body;

  if (!email || !password)
    return badRequest('メールアドレスとパスワードは必須です');

  if (password === e2eScenarioRules.login.wrongPassword)
    return unauthorized('メールアドレスまたはパスワードが正しくありません');

  return ok({ accessToken: 'dummy_access_token' });
});
