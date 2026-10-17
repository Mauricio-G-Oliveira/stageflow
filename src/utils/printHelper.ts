/**
 * Utilitário para personalização do nome padrão do arquivo ao imprimir ou "Salvar como PDF" no navegador.
 * Os navegadores modernos (Chrome, Safari, Edge, Firefox) utilizam o `document.title` no momento da impressão
 * como o nome sugerido para o arquivo PDF gerado.
 */

export function sanitizarNomeArquivo(texto: string): string {
  return texto
    .replace(/[/\\?%*:|"<>]/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function formatarDataParaNomeArquivo(dataStr?: string): string {
  if (!dataStr) return ''
  const trimmed = dataStr.trim()
  if (trimmed.includes('-')) {
    const parts = trimmed.split('-')
    if (parts.length === 3 && parts[0].length === 4) {
      // YYYY-MM-DD -> DD-MM-YYYY
      return `${parts[2]}-${parts[1]}-${parts[0]}`
    }
  }
  return sanitizarNomeArquivo(trimmed)
}

export function imprimirComNomeArquivo(nomeArquivoSugerido: string, delayMs = 0) {
  const originalTitle = document.title
  const nomeLimpo = sanitizarNomeArquivo(nomeArquivoSugerido)

  document.title = nomeLimpo

  const restoreTitle = () => {
    document.title = originalTitle
    window.removeEventListener('afterprint', restoreTitle)
  }

  window.addEventListener('afterprint', restoreTitle)

  if (delayMs > 0) {
    setTimeout(() => {
      window.print()
      setTimeout(restoreTitle, 2000)
    }, delayMs)
  } else {
    window.print()
    setTimeout(restoreTitle, 2000)
  }
}
