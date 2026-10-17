import { Printer, MessageCircle, ArrowLeft, CheckCircle2, Calendar, MapPin, Clock, ShieldCheck, Music2 } from 'lucide-react'
import type { Orcamento } from '../../types/orcamento'
import { orcamentoService } from '../../services/orcamentoService'
import { Button } from '../../components/Button/Button'
import { imprimirComNomeArquivo, formatarDataParaNomeArquivo } from '../../utils/printHelper'

interface VisualizadorOrcamentoProps {
  orcamento: Orcamento
  onBack: () => void
}

export function VisualizadorOrcamento({ orcamento, onBack }: VisualizadorOrcamentoProps) {
  const handlePrint = () => {
    const nomeCliente = orcamento.cliente.nome || 'Cliente'
    const dataEvento = formatarDataParaNomeArquivo(orcamento.cliente.dataEvento)
    const nomeSugestao = `Orcamento - ${nomeCliente}${dataEvento ? ` - ${dataEvento}` : ''}`
    imprimirComNomeArquivo(nomeSugestao)
  }

  const handleWhatsApp = () => {
    const rawPhone = orcamento.cliente.telefone.replace(/\D/g, '')
    const phoneWithCountry = rawPhone.length <= 11 ? `55${rawPhone}` : rawPhone
    const text = encodeURIComponent(orcamentoService.gerarTextoWhatsApp(orcamento))
    window.open(`https://wa.me/${phoneWithCountry}?text=${text}`, '_blank')
  }

  const dataEventoFormatada = new Date(orcamento.cliente.dataEvento + 'T00:00:00').toLocaleDateString('pt-BR')
  const validadeData = new Date(
    new Date(orcamento.dataEmissao).getTime() + orcamento.validadeDias * 24 * 60 * 60 * 1000
  ).toLocaleDateString('pt-BR')

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Bar (Hidden on print) */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Lista de Orçamentos
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleWhatsApp}
            leftIcon={<MessageCircle className="w-4 h-4 text-emerald-400" />}
            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
          >
            Enviar no WhatsApp do Cliente
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Imprimir / Salvar PDF
          </Button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-3xl shadow-2xl border border-slate-200 print:border-none print:shadow-none print:p-0 print:rounded-none">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b-2 border-slate-900 pb-6 gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 inline-block mb-2">
              Proposta Comercial Exclusiva
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
              {orcamento.nomeBanda}
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Apresentações musicais ao vivo de alta performance para celebrações e eventos especiais
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-mono text-slate-500 block">Número da Proposta</span>
            <span className="text-xl font-black text-slate-900 font-mono">
              {orcamento.numeroOrcamento}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">
              Emissão: {new Date(orcamento.dataEmissao).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>

        {/* Client & Event Data */}
        <div className="my-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Dados do Contratante & Detalhes do Evento
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Cliente / Contratante:</span>
              <strong className="text-sm text-slate-900 block">{orcamento.cliente.nome}</strong>
              <span className="text-slate-600">WhatsApp: {orcamento.cliente.telefone}</span>
              {orcamento.cliente.email && (
                <span className="text-slate-600 block">E-mail: {orcamento.cliente.email}</span>
              )}
            </div>

            <div>
              <span className="text-slate-500 block">Tipo do Evento:</span>
              <strong className="text-sm text-teal-800 block">{orcamento.cliente.tipoEvento}</strong>
              <div className="flex items-center gap-1.5 text-slate-700 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-teal-700" />
                <span>Data: <strong>{dataEventoFormatada}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <Clock className="w-3.5 h-3.5 text-teal-700" />
                <span>Horário: {orcamento.cliente.horarioInicio} ({orcamento.cliente.duracaoShow})</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-teal-700" />
                <span>Local: {orcamento.cliente.localEvento} - {orcamento.cliente.cidade}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formation & Included Items */}
        <div className="space-y-4 mb-8">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Formação Musical
            </h3>
            <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Music2 className="w-4 h-4 text-teal-700" />
              {orcamento.proposta.formacaoBanda}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Estrutura & Itens Inclusos na Apresentação
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {orcamento.proposta.itensInclusos.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-100/70 border border-slate-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-800">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {orcamento.proposta.observacoes && (
            <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200 text-xs text-teal-900">
              <strong>Observações Técnicas:</strong> {orcamento.proposta.observacoes}
            </div>
          )}
        </div>

        {/* Financial Section */}
        <div className="border-t-2 border-slate-900 pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 text-white">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-300 block">
                Valor Total do Investimento
              </span>
              <span className="text-3xl font-extrabold text-white font-mono">
                R$ {orcamento.proposta.valorTotal.toLocaleString('pt-BR')}
              </span>
            </div>

            <div className="text-left sm:text-right space-y-1 text-xs">
              <div className="text-teal-200 font-semibold">
                Sinal para Reserva de Data (50%):{' '}
                <strong className="text-white text-sm">
                  R$ {orcamento.proposta.valorSinal.toLocaleString('pt-BR')}
                </strong>
              </div>
              <div className="text-slate-300">
                Saldo Restante:{' '}
                <strong className="text-white">
                  R$ {orcamento.proposta.valorRestante.toLocaleString('pt-BR')}
                </strong>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="font-bold text-slate-900 block mb-1">Condições de Pagamento:</span>
              <p>{orcamento.proposta.formaPagamento}</p>
            </div>
            <div>
              <span className="font-bold text-slate-900 block mb-1">Dados para Pagamento do Sinal (PIX):</span>
              <p className="font-mono text-slate-900 font-semibold">
                Chave PIX: {orcamento.proposta.chavePix}
              </p>
              <p className="text-slate-500">Beneficiário: {orcamento.proposta.beneficiarioPix}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
              Proposta sujeita à confirmação de disponibilidade da data na assinatura.
            </span>
            <span className="font-semibold text-slate-700">
              Validade: até {validadeData} ({orcamento.validadeDias} dias)
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
