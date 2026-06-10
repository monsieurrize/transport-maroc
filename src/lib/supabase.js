import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://sporwksuimsvzhnrllxf.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_OfIdHATcjx_QmBRJGoRqEw_JfW_Bzsp'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
