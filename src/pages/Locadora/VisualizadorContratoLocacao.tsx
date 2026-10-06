import { Printer, ArrowLeft } from 'lucide-react'
import type { LocacaoEvento } from '../../types/locadora'
import { Button } from '../../components/Button/Button'

interface VisualizadorContratoLocacaoProps {
  locacao: LocacaoEvento
  onBack: () => void
}

export function VisualizadorContratoLocacao({
  locacao,
  onBack,
}: VisualizadorContratoLocacaoProps) {
  const handlePrint = () => {
    window.print()
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  }

  return (
    <div className="space-y-6">
      {/* Action Bar (hidden when printing) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Voltar para Locações
          </Button>
          <div>
            <h2 className="text-base font-bold text-white">
              Contrato de Locação #{locacao.numeroContrato}
            </h2>
            <p className="text-xs text-slate-400">
              Cliente: {locacao.clienteNome} • {locacao.eventoNome}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={handlePrint} leftIcon={<Printer className="w-4 h-4" />}>
            Imprimir / Salvar PDF
          </Button>
        </div>
      </div>

      {/* Printable Sheet A4 */}
      <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-2xl max-w-4xl mx-auto border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none text-xs sm:text-sm leading-relaxed">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-5 mb-6 text-center">
          <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 block mb-1">
            STAGEFLOW AUDIO & SOUND RENTAL • INSTRUMENTO PARTICULAR DE LOCAÇÃO
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
            CONTRATO DE LOCAÇÃO DE EQUIPAMENTOS DE ÁUDIO E ILUMINAÇÃO
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Contrato Nº <strong>{locacao.numeroContrato}</strong> • Emitido em {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        {/* 1. Partes */}
        <div className="mb-6 space-y-3">
          <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-300 pb-1">
            1. QUALIFICAÇÃO DAS PARTES
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div>
              <strong className="block text-slate-800 font-semibold mb-1">LOCADOR (EMPRESA / PROPRIETÁRIO):</strong>
              <p>Razão Social/Nome: <strong>StageFlow Locações de Som & Iluminação</strong></p>
              <p>Responsável Técnico: <strong>Mauricio G. Oliveira</strong></p>
              <p>Contato: (11) 99999-9999 | mauriciogoulart.deoliveira37@gmail.com</p>
            </div>
            <div>
              <strong className="block text-slate-800 font-semibold mb-1">LOCATÁRIO (CLIENTE CONTRATANTE):</strong>
              <p>Nome/Razão Social: <strong>{locacao.clienteNome}</strong></p>
              <p>CPF/CNPJ: {locacao.clienteDocumento}</p>
              <p>Telefone: {locacao.clienteTelefone}</p>
              {locacao.clienteEmail && <p>E-mail: {locacao.clienteEmail}</p>}
            </div>
          </div>
        </div>

        {/* 2. Logística e Local */}
        <div className="mb-6 space-y-2">
          <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-300 pb-1">
            2. DETALHES DO EVENTO E LOGÍSTICA
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Evento</span>
              <strong className="text-slate-800">{locacao.eventoNome}</strong>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Data do Evento</span>
              <strong className="text-slate-800">{locacao.dataEvento}</strong>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Entrega / Montagem</span>
              <strong className="text-slate-800">{locacao.dataRetiradaEntrega}</strong>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Devolução</span>
              <strong className="text-slate-800">{locacao.dataDevolucao}</strong>
            </div>
          </div>
          <p className="text-xs text-slate-700 mt-2">
            <strong>Local de Instalação:</strong> {locacao.localEvento}
          </p>
        </div>

        {/* 3. Equipamentos Locados */}
        <div className="mb-6">
          <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-300 pb-1 mb-2">
            3. RELAÇÃO DE EQUIPAMENTOS LOCADOS (INVENTÁRIO)
          </h3>
          <table className="w-full text-left text-xs border border-slate-300">
            <thead className="bg-slate-100 border-b border-slate-300 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-2 border-r border-slate-300">Qtd</th>
                <th className="p-2 border-r border-slate-300">Descrição do Equipamento</th>
                <th className="p-2 border-r border-slate-300 text-right">Diária Unit.</th>
                <th className="p-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {locacao.itens.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="p-2 border-r border-slate-300 font-bold text-center">{item.quantidade}x</td>
                  <td className="p-2 border-r border-slate-300 font-medium">{item.nome}</td>
                  <td className="p-2 border-r border-slate-300 text-right">{formatCurrency(item.valorUnitario)}</td>
                  <td className="p-2 text-right font-bold">{formatCurrency(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. Valores e Pagamento */}
        <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
          <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-300 pb-1">
            4. CONDIÇÕES FINANCEIRAS & PAGAMENTO
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div>
              <span className="text-slate-500 block text-[10px]">Operador Técnico:</span>
              <strong>{locacao.incluiOperadorSom ? formatCurrency(locacao.valorOperadorSom) : 'Não incluso'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Transporte / Frete:</span>
              <strong>{locacao.incluiTransporteFrete ? formatCurrency(locacao.valorFrete) : 'Retirada no local'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Sinal Pago / Entrada:</span>
              <strong className="text-teal-700">{formatCurrency(locacao.valorSinal)}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">VALOR TOTAL:</span>
              <strong className="text-base text-slate-900">{formatCurrency(locacao.valorTotal)}</strong>
            </div>
          </div>
          <div className="pt-2 text-xs text-slate-700 border-t border-slate-200 flex flex-wrap justify-between gap-2">
            <span><strong>Forma de Pagamento:</strong> {locacao.formaPagamento}</span>
            {locacao.chavePix && <span><strong>Chave PIX:</strong> {locacao.chavePix}</span>}
          </div>
        </div>

        {/* 5. Cláusulas Legais */}
        <div className="mb-8 space-y-2.5 text-[11px] text-slate-700 text-justify">
          <h3 className="font-bold text-sm uppercase text-slate-900 border-b border-slate-300 pb-1 mb-2">
            5. CLÁUSULAS CONTRATUAIS E RESPONSABILIDADES
          </h3>
          <p>
            <strong>CLÁUSULA 1ª - DO ESTADO DOS BENS:</strong> O LOCATÁRIO declara receber todos os equipamentos em perfeito estado de funcionamento, limpos e revisados, comprometendo-se a utilizá-los estritamente de acordo com suas especificações técnicas.
          </p>
          <p>
            <strong>CLÁUSULA 2ª - DA RESPONSABILIDADE E GUARDA:</strong> A partir do momento da entrega ou retirada até a efetiva devolução e conferência, o LOCATÁRIO assume total e exclusiva responsabilidade pela guarda e integridade dos bens locados, respondendo por quaisquer avarias, queima de alto-falantes/drivers, quebras, furtos ou roubos. Em caso de dano irreparável ou extravio, o LOCATÁRIO ressarcirá o LOCADOR pelo valor de reposição de mercado de um equipamento novo equivalente em até 5 (cinco) dias úteis.
          </p>
          <p>
            <strong>CLÁUSULA 3ª - DA INSTALAÇÃO E ENERGIA:</strong> É de responsabilidade do LOCATÁRIO fornecer ponto de energia elétrica estável (110V/220V conforme especificado), devidamente dimensionado e aterrado. Danos causados por oscilação ou ligação em voltagem incorreta correrão por conta do LOCATÁRIO.
          </p>
          <p>
            <strong>CLÁUSULA 4ª - DO PRAZO E MULTA POR ATRASO:</strong> Caso os equipamentos não sejam devolvidos no horário e data estipulados neste termo, incidirá multa equivalente a 100% (cem por cento) do valor da diária para cada 24 horas de atraso, sem prejuízo de perdas e danos decorrentes de outros eventos cancelados.
          </p>
        </div>

        {/* Assinaturas */}
        <div className="pt-10 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs">
          <div>
            <div className="border-b border-slate-900 pb-1 mb-1 mx-4"></div>
            <strong className="block text-slate-900">LOCADOR</strong>
            <span className="text-slate-600 text-[10px]">StageFlow Locações • Mauricio G. Oliveira</span>
          </div>
          <div>
            <div className="border-b border-slate-900 pb-1 mb-1 mx-4"></div>
            <strong className="block text-slate-900">LOCATÁRIO</strong>
            <span className="text-slate-600 text-[10px]">{locacao.clienteNome}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
