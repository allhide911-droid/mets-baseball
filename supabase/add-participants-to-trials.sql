-- trials テーブルの walk_in_count カラムを participants にリネームするマイグレーション
-- Supabase の SQL Editor で実行してください。
ALTER TABLE trials RENAME COLUMN walk_in_count TO participants;
