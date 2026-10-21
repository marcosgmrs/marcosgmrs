import { Component } from '@angular/core';
import { PROJETOS } from './projetos.data';

@Component({
  selector: 'app-projetos',
  imports: [],
  templateUrl: './projetos.html',
  styleUrl: './projetos.css'
})
export class Projetos {
  projetos = PROJETOS
}
