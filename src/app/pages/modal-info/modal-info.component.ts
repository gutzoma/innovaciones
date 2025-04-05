import { ChangeDetectionStrategy, Component, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProfileService } from '../../_services/profile.service';

@Component({
  selector: 'app-modal-info',
  imports: [],
  standalone: true,
  templateUrl: './modal-info.component.html',
  styles: ``,
  providers: [ProfileService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalInfoComponent {
  public creditoInfo!: any;

  constructor(
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<ModalInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { info: any; tipo: any }
  ) {}

  cerrarModal(): void {
    this.dialogRef.close();
  }
}
