import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(
    private fb: FormBuilder,
    private PaisesSerivice: PaisesServiceService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.regiones = this.PaisesSerivice.regiones

    //Cuando cambie la region
    this.miFormulario.get('region')?.valueChanges
      .subscribe( region => {
        console.log(region);

        this.PaisesSerivice.getPaisesPorRegion( region )
          .subscribe( paises => {
            console.log(paises);
            this.paises = paises;
          });
      });
  }

  initializeForm() {
    this.miFormulario = this.fb.group({
      region: ['', Validators.required],
      pais: ['', Validators.required]
    });
  }

  Guardar() {
    console.log(this.miFormulario.value);
  }
}
