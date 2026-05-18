import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://figsrwkeyvapcwvkdpdh.supabase.co/rest/v1/'
const supabaseKey = 'sb_publishable_pDZNxFHdKchK8FKnrE5R9w_s-rllw3T'

export const supabase = createClient(supabaseUrl, supabaseKey)