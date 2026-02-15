import { supabase } from '@/lib/supabase'

export async function uploadImage(file: File): Promise<string> {
  const fileName = `${Date.now()}-${file.name}`

  const { error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file)

  if (error) throw error

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName)

  return data.publicUrl
}