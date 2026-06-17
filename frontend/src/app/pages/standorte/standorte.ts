import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../core/catalog.service';

/** Übersicht aller acht INNOQ-Standorte (Glossar: „Standort“). */
@Component({
  selector: 'clv-standorte',
  imports: [RouterLink],
  templateUrl: './standorte.html',
  styleUrl: './standorte.scss',
})
export class Standorte {
  private readonly catalog = inject(CatalogService);

  protected readonly standorte = this.catalog.getStandorte();

  protected anzahlRaeume(standortId: string): number {
    return this.catalog.anzahlRaeume(standortId);
  }
}
