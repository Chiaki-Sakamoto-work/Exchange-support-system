-- 1. Shadow DB環境（authスキーマがない環境）のみ、ダミーのスキーマとテーブルを作成する
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth') THEN
        -- EXECUTE を使うことで、本当のDBでは構文チェックすらされずに安全にスルーされます
        EXECUTE 'CREATE SCHEMA auth';
        EXECUTE 'CREATE TABLE auth.users (id uuid PRIMARY KEY, email text, raw_user_meta_data jsonb)';
    END IF;
END $$;

-- 2. カラム追加
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "avatar_url" VARCHAR;

-- 3. 関数作成
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, avatar_url, is_admin, is_support_used)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url', 
    false, 
    false
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. トリガー作成
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
