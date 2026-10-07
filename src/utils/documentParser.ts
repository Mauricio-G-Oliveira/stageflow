/**
 * Utilitário profissional para processamento de arquivos de partituras e letras/cifras (.docx, .txt, .pdf)
 * Executado 100% no navegador do cliente com descompactação OpenXML nativa via JSZip.
 */
import JSZip from 'jszip'

export async function parseDocxToText(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const zip = await JSZip.loadAsync(arrayBuffer)
    const docXmlFile = zip.file('word/document.xml')

    if (!docXmlFile) {
      throw new Error('Arquivo word/document.xml não encontrado no pacote .docx')
    }

    const xmlString = await docXmlFile.async('text')
    const extracted = extractFormattedTextFromWordXml(xmlString)

    if (!extracted || extracted.trim().length === 0) {
      return 'O documento Word foi importado, mas não continha texto legível.'
    }

    return extracted
  } catch (error) {
    console.error('Erro ao ler DOCX com JSZip:', error)
    return `Não foi possível extrair o texto automaticamente: ${error instanceof Error ? error.message : 'formato incompatível'}`
  }
}

function extractFormattedTextFromWordXml(xmlString: string): string {
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml')

    // Procura por todos os elementos de parágrafo do Word
    const paragraphs = xmlDoc.getElementsByTagName('w:p')
    const lines: string[] = []

    for (let i = 0; i < paragraphs.length; i++) {
      const p = paragraphs[i]
      let pText = ''

      // Processa cada nó filho em ordem para manter espaçamento e quebras
      const allElements = p.getElementsByTagName('*')
      for (let j = 0; j < allElements.length; j++) {
        const el = allElements[j]
        const nodeName = el.nodeName.toLowerCase()

        if (nodeName === 'w:t' || nodeName.endsWith(':t')) {
          pText += el.textContent || ''
        } else if (nodeName === 'w:tab' || nodeName.endsWith(':tab')) {
          pText += '    '
        } else if (nodeName === 'w:br' || nodeName.endsWith(':br')) {
          pText += '\n'
        }
      }

      lines.push(pText)
    }

    const fullText = lines.join('\n').trim()
    if (fullText.length > 0) {
      return fullText
    }
  } catch (err) {
    console.warn('Falha no DOMParser, usando regex fallback estruturado:', err)
  }

  // Fallback robusto via regex caso o DOMParser falhe no navegador
  return xmlString
    .replace(/<\/w:p>/g, '\n')
    .replace(/<w:br[^>]*\/>/g, '\n')
    .replace(/<w:tab[^>]*\/>/g, '    ')
    .replace(/<w:t[^>]*>(.*?)<\/w:t>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// Dicionário de notas e acordes musicais para transposição em palco
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
