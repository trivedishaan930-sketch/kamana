import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fail, json, method, queryText, supabase, signView, HttpError } from './_lib/core';
export default async function handler(req: VercelRequest,res: VercelResponse) {
 if (!method(req,res,'GET')) return;
 try {
  const search=queryText(req.query.search,'search',100), tag=queryText(req.query.tag,'tag',30), sort=queryText(req.query.sort,'sort',20)||'latest';
  if(sort!=='latest') throw new HttpError(400,'Invalid sort; only latest is supported');
  const offset=Number(req.query.offset??0), limit=Number(req.query.limit??24);
  if(!Number.isInteger(offset)||offset<0||offset>10000||!Number.isInteger(limit)||limit<1||limit>48) throw new HttpError(400,'Invalid pagination');
  let q=supabase().from('artworks').select('id,creator_id,title,description,tags,model,prompt,sensitive,status,created_at,object_key,profiles!artworks_creator_id_fkey(handle,display_name)',{count:'exact'}).eq('status','approved');
  if(search) q=q.or(`title.ilike.%${search.replace(/[,%()]/g,' ')}%,description.ilike.%${search.replace(/[,%()]/g,' ')}%`);
  if(tag) q=q.contains('tags',[tag.toLowerCase()]);
  q=q.order('created_at',{ascending:false}).range(offset,offset+limit-1);
  const {data,error,count}=await q; if(error) throw error;
  const items=await Promise.all((data||[]).map(async (a:any)=>({id:a.id,title:a.title,creator_id:a.creator_id,creator_name:a.profiles?.display_name||'Creator',handle:a.profiles?.handle||'',description:a.description,tags:a.tags,model:a.model,prompt:a.prompt,sensitive:a.sensitive,status:a.status,created_at:a.created_at,image_url:await signView(a.object_key,180)})));
  return json(res,200,{items,total:count||0,offset,limit});
 } catch(e){return fail(res,e);}
}
