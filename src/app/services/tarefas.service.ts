import { Injectable } from '@angular/core';

export interface Tarefa {
  id: string;
  titulo: string;
  categoria: string;
  prioridade: 'Alta' | 'Média' | 'Baixa';
  concluida: boolean;
  prazo?: string;
  notas?: string;
  dataCriacao?: string;
}

@Injectable({ providedIn: 'root' })
export class TarefasService {
  private tarefas: Tarefa[] = [];
  private readonly STORAGE_KEY = 'tarefas_salvas';

  constructor() {
    this.carregarTarefas();
  }

  private salvarNoStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tarefas));
  }

  private carregarTarefas() {
    const tarefasSalvas = localStorage.getItem(this.STORAGE_KEY);
    if (tarefasSalvas && JSON.parse(tarefasSalvas).length > 0) {
      this.tarefas = JSON.parse(tarefasSalvas);
    } else {
      // Inicializa com dados de exemplo baseados no design de referência
      this.tarefas = [
        {
          id: '1',
          titulo: 'Revisar slides da apresentação',
          categoria: 'Estudo',
          prioridade: 'Alta',
          concluida: false,
          prazo: 'Hoje, 14:00',
          notas: 'Focar na conclusão dos slides de metodologia e resultados esperados.',
          dataCriacao: '20 de out. de 2026'
        },
        {
          id: '2',
          titulo: 'Enviar relatório semanal',
          categoria: 'Trabalho',
          prioridade: 'Alta',
          concluida: false,
          prazo: 'Hoje, 18:00',
          notas: 'Consolidar as entregas da sprint e métricas de desempenho da equipe.',
          dataCriacao: '19 de out. de 2026'
        },
        {
          id: '3',
          titulo: 'Revisar relatório financeiro',
          categoria: 'Trabalho',
          prioridade: 'Alta',
          concluida: false,
          prazo: 'Sex, 10:00',
          notas: 'Verificar os centros de custo e despesas operacionais do mês.',
          dataCriacao: '18 de out. de 2026'
        },
        {
          id: '4',
          titulo: 'Ler capítulo 4 de Estatística',
          categoria: 'Estudo',
          prioridade: 'Média',
          concluida: false,
          prazo: 'Amanhã',
          notas: 'Fazer anotações sobre distribuições de probabilidade.',
          dataCriacao: '17 de out. de 2026'
        },
        {
          id: '5',
          titulo: 'Organizar planilha de investimentos',
          categoria: 'Pessoal',
          prioridade: 'Média',
          concluida: false,
          prazo: 'Amanhã, 11:30',
          notas: 'Atualizar dividendos e aportes do mês.',
          dataCriacao: '16 de out. de 2026'
        },
        {
          id: '6',
          titulo: 'Atualizar repositório Git',
          categoria: 'Trabalho',
          prioridade: 'Baixa',
          concluida: false,
          prazo: 'Sáb, 16:00',
          notas: 'Limpar branches antigas e atualizar a documentação no README.',
          dataCriacao: '15 de out. de 2026'
        },
        {
          id: '7',
          titulo: 'Comprar mantimentos para a semana',
          categoria: 'Pessoal',
          prioridade: 'Baixa',
          concluida: false,
          prazo: 'Dom, 10:00',
          notas: 'Frutas, legumes, café e itens essenciais.',
          dataCriacao: '14 de out. de 2026'
        },
        {
          id: '8',
          titulo: 'Reunião de alinhamento com cliente',
          categoria: 'Trabalho',
          prioridade: 'Alta',
          concluida: true,
          prazo: 'Ontem',
          notas: 'Apresentação do cronograma ajustado.',
          dataCriacao: '13 de out. de 2026'
        },
        {
          id: '9',
          titulo: 'Resumo do artigo científico',
          categoria: 'Estudo',
          prioridade: 'Média',
          concluida: true,
          prazo: 'Ontem',
          notas: 'Submissão para a disciplina de computação.',
          dataCriacao: '12 de out. de 2026'
        },
        {
          id: '10',
          titulo: 'Planejamento das metas semanais',
          categoria: 'Pessoal',
          prioridade: 'Baixa',
          concluida: true,
          prazo: 'Segunda',
          notas: 'Definição das três prioridades principais da semana.',
          dataCriacao: '11 de out. de 2026'
        }
      ];
      this.salvarNoStorage();
    }
  }

  obterTarefas(): Tarefa[] {
    return this.tarefas;
  }

  adicionarTarefa(tarefa: Omit<Tarefa, 'id' | 'concluida'>) {
    const hoje = new Date();
    const dataCriacao = tarefa.dataCriacao || hoje.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
    const novaTarefa: Tarefa = {
      ...tarefa,
      id: Date.now().toString(),
      concluida: false,
      dataCriacao
    };
    this.tarefas.unshift(novaTarefa); // adiciona no topo
    this.salvarNoStorage();
  }

  atualizarTarefa(tarefaAtualizada: Tarefa) {
    const index = this.tarefas.findIndex(t => t.id === tarefaAtualizada.id);
    if (index !== -1) {
      this.tarefas[index] = tarefaAtualizada;
      this.salvarNoStorage();
    }
  }

  excluirTarefa(id: string) {
    this.tarefas = this.tarefas.filter(t => t.id !== id);
    this.salvarNoStorage();
  }
}
