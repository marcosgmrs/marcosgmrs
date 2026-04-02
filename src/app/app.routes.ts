import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Projetos } from './pages/projetos/projetos';
import { Habilidades } from './pages/habilidades/habilidades';
import { Sobre } from './pages/sobre/sobre';
import { Contato } from './pages/contato/contato';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'projetos', component: Projetos },
  { path: 'habilidades', component: Habilidades },
  { path: 'sobre', component: Sobre },
  { path: 'contato', component: Contato }
]