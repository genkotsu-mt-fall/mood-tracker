import { badRequest, e2eScenarioRules, ok, withE2E } from '@/e2e/utils';
import { AuthSignupBody } from '@genkotsu-mt-fall/shared/schemas';

type SignupBody = Partial<AuthSignupBody>;

export const POST = withE2E(async (req): Promise<Response> => {
  const body = (await req.json().catch(() => ({}))) as SignupBody;
  const email = body.email ?? 'user@example.com';

  const { duplicateEmail, schemaErrorEmail } = e2eScenarioRules.signup;

  // 異常系：バックエンドAPIからのレスポンス形式が不正
  if (email === schemaErrorEmail)
    return ok({
      id: 'not-a-uuid',
      email: 'not-an-email',
      name: 123 as unknown as string,
    });

  // 異常系：ユニークキーの重複
  if (email === duplicateEmail)
    return badRequest('このメールアドレスは既に登録されています。');

  return ok({
    id: '550e8400-e29b-41d4-a716-446655440000',
    email,
    name: body.name ?? null,
  });
});
