import { Component } from '@angular/core';

interface Habilidade {
  nome: string
  nivel: number
  categoria: string
}

@Component({
  selector: 'app-habilidades',
  imports: [],
  templateUrl: './habilidades.html',
  styleUrl: './habilidades.css'
})
export class Habilidades {
  habilidades: Habilidade[] = [
    { nome: 'HTML', nivel: 90, categoria: 'Desenvolvimento' },
    { nome: 'CSS', nivel: 85, categoria: 'Desenvolvimento' },
    { nome: 'JavaScript', nivel: 70, categoria: 'Desenvolvimento' },
    { nome: 'TypeScript', nivel: 65, categoria: 'Desenvolvimento' },
    { nome: 'Angular', nivel: 60, categoria: 'Desenvolvimento' },
    { nome: 'RxJS', nivel: 45, categoria: 'Desenvolvimento' },
    { nome: 'Git e GitHub', nivel: 70, categoria: 'Desenvolvimento' },
    { nome: 'Windows', nivel: 95, categoria: 'Infraestrutura' },
    { nome: 'Linux', nivel: 60, categoria: 'Infraestrutura' },
    { nome: 'MacOS', nivel: 60, categoria: 'Infraestrutura' },
    { nome: 'Redes locais', nivel: 70, categoria: 'Infraestrutura' },
    { nome: 'Manutenção de PCs', nivel: 80, categoria: 'Infraestrutura' },
    { nome: 'Inglês', nivel: 60, categoria: 'Idiomas' },
    { nome: 'Espanhol', nivel: 20, categoria: 'Idiomas' },
  ]

  get categorias(): string[] {
    return [...new Set(this.habilidades.map(h => h.categoria))]
  }

  porCategoria(categoria: string): Habilidade[] {
    return this.habilidades.filter(h => h.categoria === categoria)
  }
}