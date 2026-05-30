-- trials テーブルに participants カラムを追加するマイグレーション
-- （初期SQLに participants が含まれていなかったため追加）
alter table trials add column if not exists participants integer;
