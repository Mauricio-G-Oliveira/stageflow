import { useState } from 'react'
import {
  Printer,
  Download,
  ArrowLeft,
  Edit3,
  Check,
  Building2,
  FileCheck,
} from 'lucide-react'
import type { Contrato } from '../../types/contrato'
import { Button } from '../../components/Button/Button'

interface VisualizadorContratoProps {
  contrato: Contrato
  onVoltar: () => void
  onSalvarEdicoes?: (contratoAtualizado: Contrato) => void
}

export function VisualizadorContrato({
  contrato,
  onVoltar,
  onSalvarEdicoes,
}: VisualizadorContratoProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [currentContrato, setCurrentContrato] = useState<Contrato>(contrato)

  const handlePrint = () => {
    window.print()
  }

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentContrato, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `Contrato_${currentContrato.numeroContrato}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  const handleSaveEdits = () => {
    setIsEditing(false)
    if (onSalvarEdicoes) {
      onSalvarEdicoes(currentContrato)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar (Hidden during print) */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onVoltar} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Voltar para Contratos
          </Button>
          <div className="h-6 w-px bg-slate-800" />
          <span className="text-xs font-semibold text-slate-300">
            Contrato Nº <span className="text-teal-400 font-mono">{currentContrato.numeroContrato}</span>
          </span>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
            {currentContrato.modelo.replace('_', ' ')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveEdits}
              leftIcon={<Check className="w-4 h-4" />}
            >
              Salvar Alterações
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              leftIcon={<Edit3 className="w-4 h-4" />}
            >
              Editar Cláusulas
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportJSON}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Exportar JSON
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
            className="bg-emerald-600 hover:bg-emerald-700 font-semibold"
          >
            Imprimir / Salvar em PDF
          </Button>
        </div>
      </div>

      {/* A4 Document Paper Container */}
      <div className="max-w-[850px] mx-auto bg-white text-slate-900 shadow-2xl rounded-xl p-8 sm:p-14 print:p-0 print:shadow-none print:max-w-none print:w-full print:rounded-none text-[13px] leading-relaxed font-serif">
        {/* Document Header */}
        <div className="text-center border-b-2 border-slate-900 pb-6 mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building2 className="w-6 h-6 text-slate-800" />
            <h1 className="text-xl font-bold tracking-wider uppercase font-sans">
              INSTRUMENTO PARTICULAR DE PRESTAÇÃO DE SERVIÇOS MUSICAIS
            </h1>
          </div>
          <p className="text-xs font-sans text-slate-600">
            Contrato de Apresentação Musical ao Vivo • Referência: <strong>{currentContrato.numeroContrato}</strong>
          </p>
        </div>

        {/* Partes Contratantes */}
        <div className="space-y-4 mb-6">
          <p>
            Pelo presente instrumento particular, de um lado:
          </p>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1 text-xs">
            <p>
              <strong>CONTRATANTE:</strong>{' '}
              {isEditing ? (
                <input
                  type="text"
                  value={currentContrato.contratante.nome}
                  onChange={(e) =>
                    setCurrentContrato({
                      ...currentContrato,
                      contratante: { ...currentContrato.contratante, nome: e.target.value },
                    })
                  }
                  className="border border-slate-300 p-1 rounded w-64"
                />
              ) : (
                currentContrato.contratante.nome
              )}
              , portador(a) do CPF/CNPJ nº{' '}
              {currentContrato.contratante.cpfCnpj || '_________________________'}, telefone de contato{' '}
              {currentContrato.contratante.telefone}, e-mail {currentContrato.contratante.email || '—'}, com endereço em{' '}
              {currentContrato.contratante.enderecoCompleto} - {currentContrato.contratante.cidade}/
              {currentContrato.contratante.estado}.
            </p>
          </div>

          <p>
            E, de outro lado:
          </p>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1 text-xs">
            <p>
              <strong>CONTRATADA (BANDA):</strong> {currentContrato.contratado.nomeBanda}, representada neste ato por{' '}
              <strong>{currentContrato.contratado.representanteNome}</strong>, inscrito no CPF sob nº{' '}
              {currentContrato.contratado.cpfRepresentante}, telefone {currentContrato.contratado.telefone}, e-mail{' '}
              {currentContrato.contratado.email}, com chave PIX para pagamentos:{' '}
              <span className="font-mono">{currentContrato.contratado.chavePix}</span>.
            </p>
          </div>

          <p className="pt-2">
            Têm entre si, justo e contratado, o que se declara mediante as cláusulas e condições seguintes:
          </p>
        </div>

        {/* Detalhes do Show & Horários de Palco */}
        <div className="my-6 p-4 rounded-lg border-2 border-slate-800 bg-slate-50/50">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-sans mb-3 flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-emerald-700" />
            RESUMO OPERACIONAL E HORÁRIOS TÉCNICOS DE PALCO
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
            <div>
              <span className="font-sans font-semibold text-slate-700">Data do Evento:</span>{' '}
              <strong>
                {new Date(currentContrato.detalhesShow.data + 'T00:00:00').toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </strong>
            </div>
            <div>
              <span className="font-sans font-semibold text-slate-700">Local da Apresentação:</span>{' '}
              {currentContrato.detalhesShow.localNome}
            </div>
            <div>
              <span className="font-sans font-semibold text-slate-700">Endereço Completo:</span>{' '}
              {currentContrato.detalhesShow.enderecoShow}
            </div>
            <div>
              <span className="font-sans font-semibold text-slate-700">Formação Artística:</span>{' '}
              {currentContrato.detalhesShow.formacaoBanda}
            </div>
            <div className="pt-1 col-span-2 border-t border-slate-200 mt-1 grid grid-cols-3 gap-2">
              <div>
                <span className="font-sans font-semibold text-slate-700 block">Montagem do Som:</span>
                <span className="font-bold text-slate-900">{currentContrato.detalhesShow.horarioChegadaMontagem}</span>
              </div>
              <div>
                <span className="font-sans font-semibold text-slate-700 block">Passagem de Som:</span>
                <span className="font-bold text-slate-900">{currentContrato.detalhesShow.horarioPassagemSom}</span>
              </div>
              <div>
                <span className="font-sans font-semibold text-slate-700 block">Início e Duração:</span>
                <span className="font-bold text-slate-900">
                  {currentContrato.detalhesShow.horarioInicioShow} ({currentContrato.detalhesShow.duracaoShow})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cláusulas do Contrato */}
        <div className="space-y-4 my-6">
          {currentContrato.clausulas.map((clausula, index) => (
            <div key={clausula.id || index} className="space-y-1">
              <h3 className="font-bold font-sans text-xs uppercase text-slate-900">
                {clausula.titulo}
              </h3>
              {isEditing ? (
                <textarea
                  value={clausula.conteudo}
                  onChange={(e) => {
                    const newClausulas = [...currentContrato.clausulas]
                    newClausulas[index].conteudo = e.target.value
                    setCurrentContrato({ ...currentContrato, clausulas: newClausulas })
                  }}
                  className="w-full text-xs p-2 border border-slate-300 rounded font-serif"
                  rows={4}
                />
              ) : (
                <p className="text-justify text-slate-800 text-xs indent-6 leading-relaxed">
                  {clausula.conteudo}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Condições Financeiras */}
        <div className="my-6 p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <h3 className="font-bold font-sans text-xs uppercase text-slate-900">
            DISPOSIÇÕES FINANCEIRAS E FORMA DE PAGAMENTO
          </h3>
          <p>
            O valor total ajustado para a prestação dos serviços musicais é de{' '}
            <strong>
              R$ {currentContrato.financeiro.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </strong>
            , a ser adimplido nas seguintes condições:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-800">
            <li>
              <strong>Sinal de Reserva:</strong> R${' '}
              {currentContrato.financeiro.valorSinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}{' '}
              com vencimento em{' '}
              {new Date(currentContrato.financeiro.dataVencimentoSinal + 'T00:00:00').toLocaleDateString('pt-BR')}.
            </li>
            <li>
              <strong>Saldo Restante:</strong> R${' '}
              {currentContrato.financeiro.valorRestante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}{' '}
              com vencimento em{' '}
              {new Date(currentContrato.financeiro.dataVencimentoRestante + 'T00:00:00').toLocaleDateString('pt-BR')}{' '}
              (antes do início da apresentação).
            </li>
            <li>
              <strong>Forma de Pagamento:</strong> {currentContrato.financeiro.formaPagamento} — Chave PIX:{' '}
              <span className="font-mono font-bold">{currentContrato.financeiro.chavePix}</span> (Favorecido:{' '}
              {currentContrato.financeiro.beneficiarioPix}).
            </li>
          </ul>
        </div>

        {currentContrato.observacoesAdicionais && (
          <div className="my-4 text-xs text-slate-700 italic border-l-2 border-slate-400 pl-3">
            <strong>Observações Especiais:</strong> {currentContrato.observacoesAdicionais}
          </div>
        )}

        <p className="my-8 text-xs text-justify">
          E, por estarem justos e contratados, assinam o presente instrumento em 02 (duas) vias de igual teor e forma,
          na presença de 02 (duas) testemunhas, para que produza todos os seus efeitos jurídicos.
        </p>

        <p className="text-right text-xs my-6">
          {currentContrato.detalhesShow.cidadeShow || 'São Paulo'}, {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}.
        </p>

        {/* Linhas de Assinatura */}
        <div className="pt-10 grid grid-cols-2 gap-12 text-center text-xs">
          <div className="space-y-1">
            <div className="border-t border-slate-800 pt-2 font-bold font-sans">
              {currentContrato.contratante.nome}
            </div>
            <p className="text-[11px] text-slate-600 font-sans">CONTRATANTE</p>
            <p className="text-[10px] text-slate-500 font-sans">CPF: {currentContrato.contratante.cpfCnpj || '___.___.___-__'}</p>
          </div>

          <div className="space-y-1">
            <div className="border-t border-slate-800 pt-2 font-bold font-sans">
              {currentContrato.contratado.representanteNome}
            </div>
            <p className="text-[11px] text-slate-600 font-sans">{currentContrato.contratado.nomeBanda}</p>
            <p className="text-[10px] text-slate-500 font-sans">CONTRATADA</p>
          </div>
        </div>

        {/* Testemunhas */}
        <div className="pt-12 grid grid-cols-2 gap-12 text-center text-[11px] text-slate-500 font-sans">
          <div className="space-y-1">
            <div className="border-t border-slate-400 pt-1">Testemunha 1</div>
            <p>Nome:</p>
            <p>CPF:</p>
          </div>
          <div className="space-y-1">
            <div className="border-t border-slate-400 pt-1">Testemunha 2</div>
            <p>Nome:</p>
            <p>CPF:</p>
          </div>
        </div>
      </div>
    </div>
  )
}
