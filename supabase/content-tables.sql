-- 費用・FAQ・大会実績・イベント用テーブル（導入マニュアルの初期SQLに追加で実行）

create table if not exists costs (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  amount text not null,
  note text default '',
  sort_order integer not null default 0
);

create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order integer not null default 0
);

create table if not exists tournaments (
  id uuid primary key default gen_random_uuid(),
  year_month text not null,
  name text not null,
  result text not null,
  sort_order integer not null default 0
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  date text not null,
  name text not null,
  sort_order integer not null default 0
);

alter table costs enable row level security;
alter table faqs enable row level security;
alter table tournaments enable row level security;
alter table events enable row level security;

create policy "Public read costs" on costs for select using (true);
create policy "Public read faqs" on faqs for select using (true);
create policy "Public read tournaments" on tournaments for select using (true);
create policy "Public read events" on events for select using (true);

create policy "Anon write costs" on costs for all using (true) with check (true);
create policy "Anon write faqs" on faqs for all using (true) with check (true);
create policy "Anon write tournaments" on tournaments for all using (true) with check (true);
create policy "Anon write events" on events for all using (true) with check (true);
