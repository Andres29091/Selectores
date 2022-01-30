import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { switchMap, tap } from 'rxjs/operators';

import { PaisSmall } from '../../interfaces/paises-interfaces';
import { PaisesServiceService } from '../../services/paises-service.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css'],
})
export class SelectorPageComponent implements OnInit {
  miFormulario!: FormGroup;

  // llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  //fronteras: string[] = [];
  fronteras: PaisSmall[] = [];

  //UI
  cargando: boolean = false;

  constructor
    (
      private fb: FormBuilder,
      private PaisesSerivice: PaisesServiceService
    ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.regiones = this.PaisesSerivice.regiones

    //Cuando cambie la region
    /* this.miFormulario.get('region')?.valueChanges
      .subscribe( region => {
        console.log(region);

        this.PaisesSerivice.getPaisesPorRegion( region )
          .subscribe( paises => {
            console.log(paises);
            this.paises = paises;
          });
      }); */

    //Cuando cambie la region
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap( ( _ ) => {
          //console.log(region);
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap(region => this.PaisesSerivice.getPaisesPorRegion(region))
      )
      .subscribe(paises => {
        //console.log(paises);
        this.paises = paises;
        this.cargando = false;
      });

    //Cuando cambia el pais
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap( ( _ ) => {
          this.fronteras = [];
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        switchMap( codigo => this.PaisesSerivice.getPaisPorCodigo(codigo)),
        switchMap( pais => this.PaisesSerivice.getPaisesPorCodigos( pais == null || undefined ? [""] : pais![0].borders ) )
      )
      .subscribe(paises => {
        if (!paises) {
          return;
        } else {
          //this.fronteras = paises[0].borders;
          console.log(paises);
          this.fronteras = paises;
          this.cargando = false;
        }
      })
  }

  initializeForm() {
    this.miFormulario = this.fb.group({
      region: ['', Validators.required],
      pais: ['', Validators.required],
      frontera: ['', Validators.required]
    });
  }

  Guardar() {
    console.log(this.miFormulario.value);
  }
}
