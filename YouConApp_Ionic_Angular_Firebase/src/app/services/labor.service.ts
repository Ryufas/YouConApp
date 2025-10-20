import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Labor, TipoPago } from '../models/labor.model';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LaborService {
  constructor(private firestore: Firestore) {}

  async createLabor(labor: Partial<Labor>): Promise<string> {
    const laborData = {
      ...labor,
      createdAt: new Date(),
      updatedAt: new Date(),
      total: this.calcularTotal(labor)
    };
    
    const docRef = await addDoc(collection(this.firestore, 'labores'), laborData);
    return docRef.id;
  }

  private calcularTotal(labor: Partial<Labor>): number {
    switch(labor.tipoPago) {
      case 'DiaCompleto':
        return labor.montoDia || 0;
      case 'PorHora':
        return (labor.horasTrabajadas || 0) * (labor.valorPorUnidad || 0);
      case 'PorUnidad':
        return (labor.cantidadUnidades || 0) * (labor.valorPorUnidad || 0);
      default:
        return 0;
    }
  }

  getLaborsByTrabajador(trabajadorId: string, fechaInicio: Date, fechaFin: Date): Observable<Labor[]> {
    const laboresRef = collection(this.firestore, 'labores');
    const q = query(
      laboresRef,
      where('trabajadorId', '==', trabajadorId),
      where('fecha', '>=', fechaInicio),
      where('fecha', '<=', fechaFin)
    );

    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Labor))
      )
    );
  }
}