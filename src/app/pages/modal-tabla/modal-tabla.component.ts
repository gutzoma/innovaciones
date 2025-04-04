import { ChangeDetectionStrategy, Component, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProfileService } from '../../_services/profile.service';

@Component({
  selector: 'app-modal-tabla',
  imports: [],
  standalone: true,
  templateUrl: './modal-tabla.component.html',
  styles: ``,
  providers: [ProfileService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalTablaComponent {
  public creditoInfo!: any;

  constructor(private _profileservice: ProfileService, private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<ModalTablaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { prestamo_id: any }
  ) {}
  ngOnInit (){
    this.getCreditHistory3(this.data.prestamo_id)
  }

  getCreditHistory3(params: any) {
    this._profileservice.getCreditHistory3 (params).subscribe(
      response => {
        if(response != 'No existen'){
          this.creditoInfo = response;
          this.cdr.detectChanges();
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }
}
