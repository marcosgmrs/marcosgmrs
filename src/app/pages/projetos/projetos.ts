import { Component } from '@angular/core';

interface Projeto {
  nome: string
  descricao: string
  tecnologias: string[]
  github: string
  deploy: string
  destaque: boolean
}

@Component({
  selector: 'app-projetos',
  imports: [],
  templateUrl: './projetos.html',
  styleUrl: './projetos.css'
})
export class Projetos {
  projetos: Projeto[] = [
    {
      nome: 'meu-app-angular',
      descricao: 'Aplicação Angular completa com autenticação, rotas protegidas por guards, consumo de API REST, formulários reativos e dashboard de perfil com dados reais do GitHub.',
      tecnologias: ['Angular 18', 'TypeScript', 'RxJS', 'GitHub API'],
      github: 'https://github.com/marcosgmrs/meu-app-angular',
      deploy: 'https://meu-app-angular.vercel.app',
      destaque: true
    },
    {
      nome: 'mineralogia',
      descricao: 'Catálogo satírico de minerais comparando propriedades científicas com promessas esotéricas. Inclui quiz interativo e página de detalhe com revelação progressiva.',
      tecnologias: ['Angular 21', 'TypeScript', 'CSS', 'Vercel'],
      github: 'https://github.com/marcosgmrs/mineralogia',
      deploy: 'https://mineralogia.vercel.app',
      destaque: true
    }
  ]
}