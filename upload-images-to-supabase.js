/**
 * Script para fazer upload de imagens para o Supabase Storage
 * e gerar SQL com os URLs corretos
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Configuração do Supabase (use suas credenciais do .env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'SUA_URL_AQUI'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'SUA_KEY_AQUI'

const supabase = createClient(supabaseUrl, supabaseKey)

const BUCKET_NAME = 'trivoo-images'

// Pastas de imagens
const imagePaths = {
  teachers: path.join(__dirname, 'public/images/teachers'),
  clubs: path.join(__dirname, 'public/images/clubs'),
  events: path.join(__dirname, 'public/images/events')
}

/**
 * Faz upload de uma imagem para o Supabase Storage
 */
async function uploadImage(localPath, storagePath) {
  try {
    const fileBuffer = fs.readFileSync(localPath)
    const fileExt = path.extname(localPath)
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: getMimeType(fileExt),
        upsert: true
      })

    if (error) throw error
    
    // Obter URL público
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath)
    
    return publicUrlData.publicUrl
  } catch (error) {
    console.error(`Erro ao fazer upload de ${localPath}:`, error.message)
    return null
  }
}

/**
 * Retorna o MIME type baseado na extensão do arquivo
 */
function getMimeType(ext) {
  const types = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
  }
  return types[ext.toLowerCase()] || 'image/jpeg'
}

/**
 * Faz upload de todas as imagens de uma pasta
 */
async function uploadFolder(folderPath, folderName) {
  console.log(`\n📁 Fazendo upload de ${folderName}...`)
  
  if (!fs.existsSync(folderPath)) {
    console.log(`⚠️  Pasta ${folderPath} não encontrada`)
    return []
  }

  const files = fs.readdirSync(folderPath)
    .filter(file => /\.(jpg|jpeg|png|webp|svg)$/i.test(file))
  
  const results = []
  
  for (const file of files) {
    const localPath = path.join(folderPath, file)
    const storagePath = `${folderName}/${file}`
    
    console.log(`  ↗️  Enviando ${file}...`)
    const url = await uploadImage(localPath, storagePath)
    
    if (url) {
      results.push({ file, url, originalPath: `/images/${folderName}/${file}` })
      console.log(`  ✅ Upload concluído: ${file}`)
    }
  }
  
  return results
}

/**
 * Gera SQL para atualizar as URLs nas tabelas
 */
function generateUpdateSQL(teacherUrls, clubUrls, eventUrls) {
  let sql = '-- ============================================\n'
  sql += '-- ATUALIZAR URLs DAS IMAGENS NO BANCO\n'
  sql += '-- ============================================\n\n'
  
  // Teachers
  if (teacherUrls.length > 0) {
    sql += '-- Atualizar avatares dos professores\n'
    teacherUrls.forEach(({ file, url, originalPath }) => {
      const name = file.replace('profile ', '').replace('.png', '').replace('.jpg', '').replace('.webp', '')
      sql += `UPDATE teachers SET avatar_url = '${url}' WHERE name LIKE '%${name}%';\n`
    })
    sql += '\n'
  }
  
  // Clubs
  if (clubUrls.length > 0) {
    sql += '-- Atualizar imagens dos clubes\n'
    clubUrls.forEach(({ file, url, originalPath }) => {
      const name = file.replace('.png', '').replace('.jpg', '').replace('.webp', '')
      sql += `UPDATE clubs SET image_url = '${url}' WHERE name = '${name}';\n`
    })
    sql += '\n'
  }
  
  // Events
  if (eventUrls.length > 0) {
    sql += '-- Atualizar imagens dos eventos\n'
    eventUrls.forEach(({ file, url, originalPath }) => {
      const name = file.replace('.png', '').replace('.jpg', '').replace('.webp', '')
      sql += `UPDATE events SET image_url = '${url}' WHERE title = '${name}';\n`
    })
    sql += '\n'
  }
  
  sql += '-- Verificar atualizações\n'
  sql += 'SELECT name, avatar_url FROM teachers LIMIT 3;\n'
  sql += 'SELECT name, image_url FROM clubs LIMIT 3;\n'
  sql += 'SELECT title, image_url FROM events LIMIT 3;\n'
  
  return sql
}

/**
 * Função principal
 */
async function main() {
  console.log('🚀 Iniciando upload de imagens para o Supabase Storage...\n')
  console.log(`📍 Bucket: ${BUCKET_NAME}`)
  console.log(`🔗 Supabase URL: ${supabaseUrl}\n`)
  
  // Verificar se o bucket existe
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
  
  if (bucketError) {
    console.error('❌ Erro ao verificar buckets:', bucketError.message)
    console.log('\n⚠️  Execute primeiro o script SQL: supabase/setup_storage.sql')
    return
  }
  
  const bucketExists = buckets.some(b => b.id === BUCKET_NAME)
  
  if (!bucketExists) {
    console.error(`❌ Bucket '${BUCKET_NAME}' não encontrado!`)
    console.log('\n⚠️  Execute primeiro o script SQL: supabase/setup_storage.sql')
    return
  }
  
  console.log('✅ Bucket encontrado!\n')
  
  // Upload das imagens
  const teacherUrls = await uploadFolder(imagePaths.teachers, 'teachers')
  const clubUrls = await uploadFolder(imagePaths.clubs, 'clubs')
  const eventUrls = await uploadFolder(imagePaths.events, 'events')
  
  // Gerar SQL
  const sql = generateUpdateSQL(teacherUrls, clubUrls, eventUrls)
  
  // Salvar SQL em arquivo
  const sqlFilePath = path.join(__dirname, 'supabase/update_image_urls.sql')
  fs.writeFileSync(sqlFilePath, sql)
  
  console.log('\n' + '='.repeat(60))
  console.log('✨ Upload concluído!')
  console.log('='.repeat(60))
  console.log(`\n📊 Resumo:`)
  console.log(`  • Professores: ${teacherUrls.length} imagens`)
  console.log(`  • Clubes: ${clubUrls.length} imagens`)
  console.log(`  • Eventos: ${eventUrls.length} imagens`)
  console.log(`\n📄 SQL gerado em: ${sqlFilePath}`)
  console.log('\n🔧 Próximo passo:')
  console.log('  1. Abra o Supabase SQL Editor')
  console.log('  2. Execute o arquivo: supabase/update_image_urls.sql')
  console.log('  3. Atualize a página do Trivoo\n')
}

// Executar
main().catch(console.error)

