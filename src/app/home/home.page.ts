import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonCard,
  IonCheckbox,
  IonBadge,
  IonProgressBar,
  IonIcon,
  IonSearchbar,
  IonFabButton,
  IonModal,
  IonList,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonItem
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  searchOutline,
  flash,
  timeOutline,
  cellularOutline,
  statsChartOutline,
  listOutline,
  optionsOutline,
  add,
  createOutline,
  trashOutline,
  trash,
  closeOutline,
  chevronDownOutline,
  chevronForwardOutline,
  checkmarkCircle,
  checkmarkCircleOutline,
  checkmarkOutline,
  arrowBackOutline,
  arrowUndoOutline,
  folderOutline,
  calendarOutline,
  serverOutline,
  briefcaseOutline,
  schoolOutline,
  personOutline
} from 'ionicons/icons';
import { TarefasService, Tarefa, ImpactStyle } from '../services/tarefas.service';
import { EstatisticasPage } from '../estatisticas/estatisticas.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonCard,
    IonCheckbox,
    IonBadge,
    IonProgressBar,
    IonIcon,
    IonSearchbar,
    IonFabButton,
    IonModal,
    IonList,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonItem,
    EstatisticasPage
  ],
})
export class HomePage {
  // Controle de Abertura dos Bottom Sheets (ion-modal)
  isNovaTarefaModalOpen: boolean = false;
  isDetalhesModalOpen: boolean = false;
  isExcluirModalOpen: boolean = false;
  isFiltrosModalOpen: boolean = false;
  isEditarModalOpen: boolean = false;
  isEstatisticasModalOpen: boolean = false;

  // Tarefas em foco
  tarefaSelecionada: Tarefa | null = null;
  tarefaParaExcluir: Tarefa | null = null;

  // Formulário de Nova Tarefa
  novoTitulo: string = '';
  novasNotas: string = '';
  novaCategoria: string = 'Trabalho';
  novaPrioridade: 'Alta' | 'Média' | 'Baixa' = 'Alta';
  novoPrazoData: string = '';
  novoPrazoHora: string = '';

  // Formulário de Edição
  editTitulo: string = '';
  editNotas: string = '';
  editCategoria: string = 'Trabalho';
  editPrioridade: 'Alta' | 'Média' | 'Baixa' = 'Alta';
  editPrazo: string = '';

  // Filtros e Pesquisa
  termoBusca: string = '';
  filtroStatus: 'Todas' | 'Pendentes' | 'Concluídas' = 'Todas';
  filtroPrioridade: string = 'Todas';
  filtroCategoria: string = 'Todas';

  // Seções retráteis
  mostrarConcluidas: boolean = false;

  // Opções para chips
  categoriasDisponiveis: string[] = ['Trabalho', 'Estudo', 'Pessoal'];
  prioridadesDisponiveis: ('Alta' | 'Média' | 'Baixa')[] = ['Alta', 'Média', 'Baixa'];

  constructor(public tarefasService: TarefasService) {
    addIcons({
      searchOutline,
      flash,
      timeOutline,
      cellularOutline,
      statsChartOutline,
      listOutline,
      optionsOutline,
      add,
      createOutline,
      trashOutline,
      trash,
      closeOutline,
      chevronDownOutline,
      chevronForwardOutline,
      checkmarkCircle,
      checkmarkCircleOutline,
      checkmarkOutline,
      arrowBackOutline,
      arrowUndoOutline,
      folderOutline,
      calendarOutline,
      serverOutline,
      briefcaseOutline,
      schoolOutline,
      personOutline
    });

    this.definirDataHoraPadrao();
  }

  private definirDataHoraPadrao() {
    const hoje = new Date();
    this.novoPrazoData = hoje.toISOString().split('T')[0];
    this.novoPrazoHora = '14:00';
  }

  get dataFormatada(): string {
    const hoje = new Date();
    const opcoes: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    };
    const formatado = hoje.toLocaleDateString('pt-BR', opcoes);
    const semFeira = formatado.replace('-feira', '');
    return semFeira.charAt(0).toUpperCase() + semFeira.slice(1);
  }

  get todasTarefas(): Tarefa[] {
    return this.tarefasService.obterTarefas();
  }

  get tarefasConcluidas(): Tarefa[] {
    return this.todasTarefas.filter(t => t.concluida);
  }

  get totalTarefas(): number {
    return this.todasTarefas.length;
  }

  get totalConcluidas(): number {
    return this.tarefasConcluidas.length;
  }

  get porcentagemProgresso(): number {
    if (this.totalTarefas === 0) return 0;
    return Math.round((this.totalConcluidas / this.totalTarefas) * 100);
  }

  get valorProgresso(): number {
    if (this.totalTarefas === 0) return 0;
    return this.totalConcluidas / this.totalTarefas;
  }

  get sugestaoTarefa(): Tarefa | null {
    const pendentes = this.todasTarefas.filter(t => !t.concluida);
    if (pendentes.length === 0) return null;
    const alta = pendentes.find(t => t.prioridade === 'Alta');
    if (alta) return alta;
    const media = pendentes.find(t => t.prioridade === 'Média');
    if (media) return media;
    return pendentes[0];
  }

  // Lista Filtrada Principal
  get tarefasFiltradas(): Tarefa[] {
    let lista = this.todasTarefas;

    // Filtro de Status
    if (this.filtroStatus === 'Pendentes') {
      lista = lista.filter(t => !t.concluida);
    } else if (this.filtroStatus === 'Concluídas') {
      lista = lista.filter(t => t.concluida);
    }

    // Filtro de Prioridade
    if (this.filtroPrioridade !== 'Todas') {
      lista = lista.filter(t => t.prioridade === this.filtroPrioridade);
    }

    // Filtro de Categoria
    if (this.filtroCategoria !== 'Todas') {
      lista = lista.filter(t => t.categoria === this.filtroCategoria);
    }

    // Busca textual
    if (this.termoBusca && this.termoBusca.trim() !== '') {
      const termo = this.termoBusca.toLowerCase().trim();
      lista = lista.filter(t =>
        t.titulo.toLowerCase().includes(termo) ||
        t.categoria.toLowerCase().includes(termo) ||
        t.prioridade.toLowerCase().includes(termo) ||
        (t.notas && t.notas.toLowerCase().includes(termo))
      );
    }

    // Ordenação por prioridade (Alta -> Média -> Baixa)
    const pesoPrioridade: Record<string, number> = { 'Alta': 1, 'Média': 2, 'Baixa': 3 };
    return lista.sort((a, b) => {
      if (a.concluida !== b.concluida) {
        return a.concluida ? 1 : -1;
      }
      const pesoA = pesoPrioridade[a.prioridade] ?? 4;
      const pesoB = pesoPrioridade[b.prioridade] ?? 4;
      return pesoA - pesoB;
    });
  }

  get tarefasPendentes(): Tarefa[] {
    return this.tarefasFiltradas.filter(t => !t.concluida);
  }

  get tarefasConcluidasFiltradas(): Tarefa[] {
    return this.tarefasFiltradas.filter(t => t.concluida);
  }

  get temFiltroAtivo(): boolean {
    return this.filtroStatus !== 'Todas' ||
           this.filtroPrioridade !== 'Todas' ||
           this.filtroCategoria !== 'Todas' ||
           !!(this.termoBusca && this.termoBusca.trim() !== '');
  }

  // --- 1. MODAL: NOVA TAREFA ---
  abrirNovaTarefaModal() {
    this.definirDataHoraPadrao();
    this.novoTitulo = '';
    this.novasNotas = '';
    this.novaCategoria = 'Trabalho';
    this.novaPrioridade = 'Alta';
    this.isNovaTarefaModalOpen = true;
  }

  fecharNovaTarefaModal() {
    this.isNovaTarefaModalOpen = false;
  }

  salvarNovaTarefa() {
    if (!this.novoTitulo || this.novoTitulo.trim() === '') {
      return;
    }

    const prazoFormatado = this.formatarPrazo(this.novoPrazoData, this.novoPrazoHora);

    this.tarefasService.adicionarTarefa({
      titulo: this.novoTitulo.trim(),
      categoria: this.novaCategoria,
      prioridade: this.novaPrioridade,
      prazo: prazoFormatado,
      notas: this.novasNotas.trim() || undefined
    });

    this.fecharNovaTarefaModal();
  }

  private formatarPrazo(data: string, hora: string): string {
    if (!data) return 'Hoje, 14:00';
    try {
      const hoje = new Date();
      const hojeStr = hoje.toISOString().split('T')[0];
      const horaStr = hora ? `, ${hora}` : '';

      if (data === hojeStr) {
        return `Hoje${horaStr}`;
      }

      const amanha = new Date();
      amanha.setDate(hoje.getDate() + 1);
      const amanhaStr = amanha.toISOString().split('T')[0];
      if (data === amanhaStr) {
        return `Amanhã${horaStr}`;
      }

      const [ano, mes, dia] = data.split('-');
      const dataObj = new Date(Number(ano), Number(mes) - 1, Number(dia));
      const diaSemana = dataObj.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
      const diaSemanaCap = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

      return `${diaSemanaCap}${horaStr}`;
    } catch {
      return 'Hoje, 14:00';
    }
  }

  // --- 2. MODAL: DETALHES DA TAREFA ---
  abrirDetalhesModal(tarefa: Tarefa) {
    this.tarefaSelecionada = tarefa;
    this.isDetalhesModalOpen = true;
  }

  fecharDetalhesModal() {
    this.isDetalhesModalOpen = false;
    this.tarefaSelecionada = null;
  }

  alternarStatusDetalhes() {
    if (!this.tarefaSelecionada) return;
    const novoStatus = !this.tarefaSelecionada.concluida;
    const atualizada: Tarefa = {
      ...this.tarefaSelecionada,
      concluida: novoStatus
    };
    this.tarefasService.atualizarTarefa(atualizada);
    this.tarefaSelecionada = atualizada;
  }

  onCheckboxChange(tarefa: Tarefa, event: CustomEvent) {
    const concluida = event.detail.checked ?? false;
    this.tarefasService.atualizarTarefa({
      ...tarefa,
      concluida
    });
    if (this.tarefaSelecionada && this.tarefaSelecionada.id === tarefa.id) {
      this.tarefaSelecionada = { ...this.tarefaSelecionada, concluida };
    }
  }

  // --- AÇÕES RÁPIDAS COM GESTO DE DESLIZAR (SWIPE) ---
  async concluirTarefa(tarefa: Tarefa, slidingItem?: IonItemSliding) {
    if (slidingItem) {
      await slidingItem.close();
    }
    const novoStatus = !tarefa.concluida;
    await this.tarefasService.atualizarTarefa({
      ...tarefa,
      concluida: novoStatus
    });
    if (this.tarefaSelecionada && this.tarefaSelecionada.id === tarefa.id) {
      this.tarefaSelecionada = { ...this.tarefaSelecionada, concluida: novoStatus };
    }
  }

  async excluirTarefa(tarefa: Tarefa, slidingItem?: IonItemSliding) {
    if (slidingItem) {
      await slidingItem.close();
    }
    this.tarefasService.excluirTarefa(tarefa.id);
    await this.tarefasService.dispararFeedbackTatil(ImpactStyle.Light);

    if (this.tarefaSelecionada && this.tarefaSelecionada.id === tarefa.id) {
      this.fecharDetalhesModal();
    }
    if (this.tarefaParaExcluir && this.tarefaParaExcluir.id === tarefa.id) {
      this.fecharExcluirModal();
    }
  }

  // --- 3. MODAL DE EXCLUSÃO ---
  solicitarExclusao(tarefa: Tarefa) {
    this.tarefaParaExcluir = tarefa;
    this.isExcluirModalOpen = true;
  }

  fecharExcluirModal() {
    this.isExcluirModalOpen = false;
    this.tarefaParaExcluir = null;
  }

  confirmarExcluirTarefa() {
    if (this.tarefaParaExcluir) {
      this.excluirTarefa(this.tarefaParaExcluir);
      this.fecharExcluirModal();
    }
  }

  // --- 4. MODAL: PESQUISA E FILTROS ---
  abrirFiltrosModal() {
    this.isFiltrosModalOpen = true;
  }

  fecharFiltrosModal() {
    this.isFiltrosModalOpen = false;
  }

  limparFiltros() {
    this.termoBusca = '';
    this.filtroStatus = 'Todas';
    this.filtroPrioridade = 'Todas';
    this.filtroCategoria = 'Todas';
  }

  // --- 5. MODAL DE EDIÇÃO ---
  abrirEditarTarefa(tarefa: Tarefa) {
    this.tarefaSelecionada = tarefa;
    this.editTitulo = tarefa.titulo;
    this.editNotas = tarefa.notas || '';
    this.editCategoria = tarefa.categoria;
    this.editPrioridade = tarefa.prioridade;
    this.editPrazo = tarefa.prazo || 'Hoje, 14:00';
    this.isEditarModalOpen = true;
  }

  fecharEditarModal() {
    this.isEditarModalOpen = false;
  }

  salvarEdicaoTarefa() {
    if (!this.tarefaSelecionada || !this.editTitulo.trim()) return;

    const atualizada: Tarefa = {
      ...this.tarefaSelecionada,
      titulo: this.editTitulo.trim(),
      notas: this.editNotas.trim() || undefined,
      categoria: this.editCategoria,
      prioridade: this.editPrioridade,
      prazo: this.editPrazo.trim() || this.tarefaSelecionada.prazo
    };

    this.tarefasService.atualizarTarefa(atualizada);
    this.tarefaSelecionada = atualizada;
    this.fecharEditarModal();
  }

  // --- 6. MODAL: ESTATÍSTICAS / DASHBOARD ---
  abrirEstatisticasModal() {
    this.isEstatisticasModalOpen = true;
  }

  fecharEstatisticasModal() {
    this.isEstatisticasModalOpen = false;
  }

  // Auxiliares
  alternarMostrarConcluidas() {
    this.mostrarConcluidas = !this.mostrarConcluidas;
  }

  getIconeCategoria(categoria: string): string {
    switch (categoria?.toLowerCase()) {
      case 'trabalho':
        return 'briefcase-outline';
      case 'estudo':
        return 'school-outline';
      case 'pessoal':
        return 'person-outline';
      default:
        return 'folder-outline';
    }
  }
}
