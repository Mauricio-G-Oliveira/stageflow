/**
 * Utilitário para processamento de arquivos de partituras e cifras (.docx, .txt, .pdf)
 * Executado 100% no navegador do cliente sem dependências de servidor.
 */

export async function parseDocxToText(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)

    // Procura por local file headers no formato ZIP (PK\x03\x04)
    let offset = 0
    while (offset < bytes.length - 30) {
      if (
        bytes[offset] === 0x50 &&
        bytes[offset + 1] === 0x4b &&
        bytes[offset + 2] === 0x03 &&
        bytes[offset + 3] === 0x04
      ) {
        const compressionMethod = bytes[offset + 8] | (bytes[offset + 9] << 8)
        const compressedSize =
          bytes[offset + 18] |
          (bytes[offset + 19] << 8) |
          (bytes[offset + 20] << 16) |
          (bytes[offset + 21] << 24)
        const fileNameLength = bytes[offset + 26] | (bytes[offset + 27] << 8)
        const extraFieldLength = bytes[offset + 28] | (bytes[offset + 29] << 8)

        const fileNameBytes = bytes.slice(offset + 30, offset + 30 + fileNameLength)
        const fileName = new TextDecoder().decode(fileNameBytes)

        const dataStart = offset + 30 + fileNameLength + extraFieldLength

        if (fileName === 'word/document.xml' && compressedSize > 0) {
          const compressedData = bytes.slice(dataStart, dataStart + compressedSize)

          if (compressionMethod === 8 && typeof DecompressionStream !== 'undefined') {
            try {
              const ds = new DecompressionStream('deflate-raw')
              const writer = ds.writable.getWriter()
              writer.write(compressedData)
              writer.close()
              const decompressedResponse = await new Response(ds.readable).arrayBuffer()
              const xmlContent = new TextDecoder().decode(decompressedResponse)
              return extractTextFromWordXml(xmlContent)
            } catch (err) {
              console.warn('DecompressionStream error, usando fallback:', err)
            }
          }
        }

        offset = dataStart + compressedSize
      } else {
        offset++
      }
    }

    // Fallback: busca por tags de texto <w:t> no arquivo bruto se não foi possível inflar
    const rawText = new TextDecoder('utf-8', { fatal: false }).decode(bytes)
    return extractTextFromWordXml(rawText)
  } catch (error) {
    console.error('Erro ao ler DOCX:', error)
    return 'Não foi possível extrair o texto automaticamente do arquivo Word.'
  }
}

function extractTextFromWordXml(xml: string): string {
  // Converte quebras de parágrafo do Word em novas linhas
  const withParagraphs = xml
    .replace(/<\/w:p>/g, '\n')
    .replace(/<w:br[^>]*\/>/g, '\n')
    .replace(/<w:tab[^>]*\/>/g, '\t')

  // Extrai o conteúdo entre as tags de texto <w:t>
  const matches = withParagraphs.match(/<w:t[^>]*>(.*?)<\/w:t>/g)
  if (matches && matches.length > 0) {
    const textPieces = matches.map((tag) => tag.replace(/<[^>]+>/g, ''))
    return textPieces.join('').trim()
  }

  // Se for texto plano ou HTML genérico
  const stripped = withParagraphs.replace(/<[^>]+>/g, '').trim()
  return stripped.replace(/\n{3,}/g, '\n\n')
}

// Dicionário de notas e acordes musicais para transposição
const NOTAS_NATURAIS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const NOTAS_BEMAIS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

export function transporAcorde(acorde: string, semitons: number): string {
  if (semitons === 0) return acorde

  const match = acorde.match(/^([A-G][#b]?)(.*)$/)
  if (!match) return acorde

  const tomOriginal = match[1]
  const sufixo = match[2]

  let index = NOTAS_NATURAIS.indexOf(tomOriginal)
  if (index === -1) {
    index = NOTAS_BEMAIS.indexOf(tomOriginal)
  }
  if (index === -1) return acorde

  let novoIndex = (index + semitons) % 12
  if (novoIndex < 0) novoIndex += 12

  const novoTom = NOTAS_NATURAIS[novoIndex]
  return `${novoTom}${sufixo}`
}
