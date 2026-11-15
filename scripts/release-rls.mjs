import {PGlite} from '@electric-sql/pglite'
import assert from 'node:assert/strict'
import {readdirSync,readFileSync} from 'node:fs'
const db=new PGlite()
await db.exec(`
create role anon;
create role authenticated;
create role service_role bypassrls;
create schema auth;
create table auth.users(id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
create function auth.jwt() returns jsonb language sql stable as $$ select '{}'::jsonb $$;
grant usage on schema auth to anon, authenticated, service_role;
`)
const dir='supabase/migrations'
for(const file of readdirSync(dir).filter(x=>x.endsWith('.sql')).sort()){
 await db.exec(readFileSync(dir+'/'+file,'utf8'))
 console.log('Applied',file)
}
const owner='00000000-0000-4000-8000-000000000001'
const admin='00000000-0000-4000-8000-000000000002'
await db.exec(`insert into auth.users values ('${owner}'), ('${admin}');
insert into public.profiles(id,display_name,role) values ('${owner}','Demo Provider','provider'), ('${admin}','Demo Admin','admin');
set role authenticated;
select set_config('request.jwt.claim.sub','${owner}',false);
insert into public.services(provider_id,title,hourly_rate,duration_minutes,coverage_radius_miles) values ('${owner}','Demo cleaning',50,60,10), ('${owner}','Draft service',60,60,10);
insert into public.sponsors(owner_id,name) values ('${owner}','Aster Demo Sponsor');`)
await assert.rejects(db.exec("update public.services set status='approved' where title='Demo cleaning'"),{code:'42501'})
await assert.rejects(db.exec("update public.profiles set role='admin'"),{code:'42501'})
await db.exec(`select set_config('request.jwt.claim.sub','${admin}',false);
update public.services set status='approved' where title='Demo cleaning';
reset role;
set role anon;
`)
assert.deepEqual((await db.query('select title from public.services')).rows,[{title:'Demo cleaning'}])
assert.deepEqual((await db.query('select name from public.sponsors')).rows,[])
await assert.rejects(db.query('select * from public.bookings'),{code:'42501'})
console.log('PASS: anonymous approved-only services, draft sponsor hidden, booking reads denied, provider self-approval and role escalation rejected.')
await db.close()
